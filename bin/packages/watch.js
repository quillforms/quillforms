/**
 * External dependencies
 */
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const chokidar = require('chokidar'); // Add this to your dependencies
const { spawn } = require('child_process');
const debounce = require('lodash/debounce');

/**
 * Internal dependencies
 */
const getPackages = require('./get-packages');
const BUILD_SCRIPT = path.resolve(__dirname, './build.js');
const PACKAGES_DIR = path.resolve(__dirname, '../../packages');
const modulePackages = getPackages();

// Keep track of file operations
const fileOperations = new Map();

/**
 * Determines whether a file exists.
 *
 * @param {string} filename
 * @return {boolean} True if a file exists.
 */
function exists(filename) {
	try {
		return fs.statSync(filename).isFile();
	} catch (e) { }
	return false;
}

/**
 * Is the path name a directory?
 *
 * @param {string} pathname
 * @return {boolean} True if the given path is a directory.
 */
function isDirectory(pathname) {
	try {
		return fs.statSync(pathname).isDirectory();
	} catch (e) { }
	return false;
}

/**
 * Determine if a file is source code.
 *
 * @param {string} filename
 * @return {boolean} True if the file a source file.
 */
function isSourceFile(filename) {
	let relativePath = path.relative(process.cwd(), filename);
	relativePath = relativePath.replace(/\\/g, '/');

	return (
		/\/src\/.+\.(ts|tsx|js|json|scss)$/.test(relativePath) &&
		![
			/\/(benchmark|__mocks__|__tests__|test|storybook|stories)\/.+/,
			/.\.(spec|test)\.js$/,
		].some((regex) => regex.test(relativePath))
	);
}

/**
 * Determine if a file is in a module package.
 *
 * @param {string} filename
 * @return {boolean} True if the file is in a module package.
 */
function isModulePackage(filename) {
	return modulePackages.some((packagePath) =>
		filename.indexOf(packagePath) > -1
	);
}

/**
 * Returns the associated file in the build folder for a given source file.
 *
 * @param {string} srcFile
 * @return {string} Path to the build file.
 */
function getBuildFile(srcFile) {
	const packageDir = srcFile.substr(0, srcFile.lastIndexOf('/src/'));
	const filePath = srcFile.substr(srcFile.lastIndexOf('/src/') + 5);
	return path.resolve(packageDir, 'build', filePath);
}

/**
 * Safe file removal with logging
 *
 * @param {string} filename
 */
function safeRemoveFile(filename) {
	const buildFile = getBuildFile(filename);
	if (buildFile && buildFile.includes('/build/') && exists(buildFile)) {
		try {
			fs.unlink(buildFile, () => {
				console.log(chalk.red('<-'), `removed: ${filename}`);
			});
		} catch (e) {
			console.log(
				chalk.red('Error:'),
				`Unable to remove build file: ${filename} - `,
				e
			);
		}
	}
}

/**
 * Process file changes in batches
 */
const processFileChanges = debounce(() => {
	const files = Array.from(fileOperations.keys());
	if (files.length) {
		try {
			console.log(chalk.cyan('Building files:'), files.length);
			spawn('node', [BUILD_SCRIPT, ...files], {
				stdio: 'inherit',
				env: { ...process.env, FORCE_COLOR: true }
			});
		} catch (e) {
			console.error(chalk.red('Build error:'), e);
		}
		fileOperations.clear();
	}
}, 300);

/**
 * Handle file changes
 *
 * @param {string} filepath
 * @param {'add' | 'change' | 'unlink'} event
 */
function handleFileChange(filepath, event) {
	if (!isSourceFile(filepath) || !isModulePackage(filepath) ||
		filepath?.includes('node_modules')) {
		return;
	}

	if (event === 'unlink') {
		safeRemoveFile(filepath);
		return;
	}

	if (exists(filepath)) {
		console.log(chalk.green('->'), `${event}: ${filepath}`);
		fileOperations.set(filepath, event);
		processFileChanges();
	}
}

// Initialize watcher
const watcher = chokidar.watch(PACKAGES_DIR, {
	ignored: [
		'**/node_modules/**',
		'**/build/**',
		'**/build-module/**',
		'**/build-style/**',
		'**/*.d.ts',
		'**/.*'
	],
	persistent: true,
	ignoreInitial: true,
	awaitWriteFinish: {
		stabilityThreshold: 500,
		pollInterval: 100
	}
});

// Bind events
watcher
	.on('add', filepath => handleFileChange(filepath, 'add'))
	.on('change', filepath => handleFileChange(filepath, 'change'))
	.on('unlink', filepath => handleFileChange(filepath, 'unlink'))
	.on('error', error => console.error(chalk.red('Watcher error:'), error));

// Initial console message
console.log(chalk.cyan('Watching for changes...'));

// Clean up on exit
process.on('SIGINT', () => {
	console.log(chalk.yellow('Closing file watcher...'));
	watcher.close().then(() => process.exit(0));
});