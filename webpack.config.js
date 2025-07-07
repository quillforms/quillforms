/**
 * External dependencies
 */
const { DefinePlugin } = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const RtlCssPlugin = require('rtlcss-webpack-plugin');

const TerserPlugin = require('terser-webpack-plugin');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const CopyWebpackPlugin = require('copy-webpack-plugin');

const postcss = require('postcss');
const { compact } = require('lodash');
const { basename } = require('path');
const path = require('path');


const defaultConfig = require('./packages/scripts/config/webpack.config');

function camelCaseDash(string) {
	return string.replace(/-([a-z])/g, (_match, letter) =>
		letter.toUpperCase()
	);
}

const DependencyExtractionWebpackPlugin = require('@quillforms/dependency-extraction-webpack-plugin');

/**
 * Internal dependencies
 */
const { dependencies } = require('./package');

const {
	NODE_ENV: mode = 'development',
	WP_DEVTOOL: devtool = mode === 'production' ? false : 'source-map',
} = process.env;

const QUILLFORMS_NAMESPACE = '@quillforms/';
const entryPoints = {};

const quillFormsBlocklibPackagesNames = [
	'date',
	'dropdown',
	'group',
	'email',
	'long-text',
	'multiple-choice',
	'legal',
	'number',
	'slider',
	'short-text',
	'statement',
	'website',
	'welcome-screen',
	'thankyou-screen',
	'quill-booking'
];
const quillFormsBlocklibPackages = quillFormsBlocklibPackagesNames.map(
	(name) => `@quillforms/blocklib-${name}-block`
);
const quillformsPackages = Object.keys(dependencies)
	.filter(
		(packageName) =>
			packageName.startsWith(QUILLFORMS_NAMESPACE) &&
			packageName !== '@quillforms/scripts' &&
			packageName !== '@quillforms/dependency-extraction-webpack-plugin' &&
			packageName !== '@quillforms/babel-plugin-makepot'
	)
	.map((packageName) => packageName.replace(QUILLFORMS_NAMESPACE, ''));

const quillformsPackagesWithoutBlocklib = Object.keys(dependencies)
	.filter(
		(packageName) =>
			packageName.startsWith(QUILLFORMS_NAMESPACE) &&
			!quillFormsBlocklibPackages.includes(packageName) &&
			packageName !== '@quillforms/scripts' &&
			packageName !== '@quillforms/dependency-extraction-webpack-plugin'
	)
	.map((packageName) => packageName.replace(QUILLFORMS_NAMESPACE, ''));

quillformsPackagesWithoutBlocklib.forEach((packageName) => {
	const name = camelCaseDash(packageName);
	entryPoints[name] = `./packages/${packageName}`;
}, {});

const stylesTransform = (content) => {
	if (mode === 'production') {
		return postcss([
			require('cssnano')({
				preset: [
					'default',
					{
						discardComments: {
							removeAll: true,
						},
					},
				],
			}),
		])
			.process(content, {
				from: 'src/app.css',
				to: 'dest/app.css',
			})
			.then((result) => result.css);
	}
	return content;
};

quillFormsBlocklibPackages.forEach((packageName) => {
	const name = camelCaseDash(
		packageName.replace(QUILLFORMS_NAMESPACE, '')
	);
	entryPoints[`${name}Admin`] = `./packages/${packageName.replace(
		QUILLFORMS_NAMESPACE,
		''
	)}/src/admin`;

	entryPoints[`${name}Renderer`] = `./packages/${packageName.replace(
		QUILLFORMS_NAMESPACE,
		''
	)}/src/renderer`;
}, {});

const quillFormsBlocklibPackagesCopy = [];
quillFormsBlocklibPackagesNames.forEach((name) => {
	quillFormsBlocklibPackagesCopy.push(
		{
			from: `./packages/blocklib-${name}-block/src/index.php`,
			to: path.resolve(
				__dirname,
				`includes/blocks/${name}/class-${name}-block.php`
			),
		},
		{
			from: `./packages/blocklib-${name}-block/src/block.json`,
			to: path.resolve(
				__dirname,
				`includes/blocks/${name}/block.json`
			),
		}
	);
});

module.exports = {
	...defaultConfig,
	mode,
	entry: {
		client: './client',
		...entryPoints,
	},


	resolve: {
		...defaultConfig.resolve,
		alias: {
			"react/jsx-runtime.js": "react/jsx-runtime",
			"react/jsx-dev-runtime.js": "react/jsx-dev-runtime"
		},
		fallback: {
			"fs": false,
			"path": require.resolve("path-browserify")
		}
	},

	output: {
		devtoolNamespace: 'quillforms',
		filename: (pathData) => {
			const { chunk } = pathData;
			const { entryModule } = chunk;
			const { rawRequest, rootModule } = entryModule;

			// When processing ESM files, the requested path
			// is defined in `entryModule.rootModule.rawRequest`, instead of
			// being present in `entryModule.rawRequest`.
			// In the context of frontend files, they would be processed
			// as ESM if they use `import` or `export` within it.
			const request = rootModule?.rawRequest || rawRequest;
			if (request) {
				if (new RegExp('(\\w+)-block/src/admin$').test(request)) {
					const matches = request.match(
						'blocklib-([a-zA-Z-]+)-block/src/admin$'
					);
					return `blocklib-${matches[1]}-block/admin/index.js`;
				} else if (
					new RegExp(
						'blocklib-([a-zA-Z-]+)-block/src/renderer$'
					).test(request)
				) {
					const matches = request.match(
						'blocklib-([a-zA-Z-]+)-block/src/renderer$'
					);
					return `blocklib-${matches[1]}-block/renderer/index.js`;
				}
			}

			return `${basename(request)}/index.js`;
		},
		path: path.join(__dirname, 'build'),
		library: ['qf', '[name]'],
		libraryTarget: 'window',
		chunkFilename: `chunks/[name].js`,
	},
	module: {
		rules: compact([
			mode !== 'production' && {
				test: /\.js$/,
				use: require.resolve('source-map-loader'),
				include: [path.resolve(__dirname, 'packages')],
				exclude: [
					path.resolve(__dirname, 'packages/blocklib-date-block'),
					path.resolve(
						__dirname,
						'packages/blocklib-dropdown-block'
					),
					path.resolve(__dirname, 'packages/blocklib-email-block'),
					path.resolve(__dirname, 'packages/blocklib-quill-booking-block'),
					path.resolve(
						__dirname,
						'packages/blocklib-long-text-block'
					),
					path.resolve(__dirname, 'packages/blocklib-group-block'),
					path.resolve(
						__dirname,
						'packages/blocklib-multiple-choice-block'
					),
					path.resolve(__dirname, 'packages/blocklib-number-block'),
					path.resolve(
						__dirname,
						'packages/blocklib-slider-block'
					),
					path.resolve(
						__dirname,
						'packages/blocklib-short-text-block'
					),
					path.resolve(
						__dirname,
						'packages/blocklib-statement-block'
					),
					path.resolve(
						__dirname,
						'packages/blocklib-legal-block'
					),
					path.resolve(
						__dirname,
						'packages/blocklib-website-block'
					),
					path.resolve(
						__dirname,
						'packages/blocklib-welcome-screen-block'
					),
					path.resolve(
						__dirname,
						'packages/blocklib-thankyou-screen-block'
					),
					path.resolve(__dirname, 'packages/types'),
				],
				enforce: 'pre',
			},
			{
				test: /\.jsx?$/,
				use: [
					{
						loader: 'babel-loader?cacheDirectory',
						options: {
							presets: [
								[
									'@babel/preset-env',
									{
										modules: false,
										targets: {
											browsers: [
												'extends @wordpress/browserslist-config',
											],
										},
									},
								],
							],
							plugins: [
								require.resolve(
									'@babel/plugin-proposal-object-rest-spread'
								),
								require.resolve(
									'@babel/plugin-transform-react-jsx'
								),
								['@quillforms/babel-plugin-makepot', {
									output: 'languages/quillforms-js.pot',
									headers: {
										'Project-Id-Version': 'QuillForms 2.0.0',
										'Last-Translator': 'Mohamed Magdy',
										'Report-Msgid-Bugs-To': 'https://github.com/quillforms/quillforms/issues'
									}
								}]
							].filter(Boolean),

						},
					},
				],
				include: [
					path.resolve(__dirname, 'client'),
					path.resolve(__dirname, 'packages/blocklib-date-block'),
					path.resolve(
						__dirname,
						'packages/blocklib-dropdown-block'
					),
					path.resolve(__dirname, 'packages/blocklib-email-block'),
					path.resolve(__dirname, 'packages/blocklib-quill-booking-block'),
					path.resolve(
						__dirname,
						'packages/blocklib-long-text-block'
					),
					path.resolve(__dirname, 'packages/blocklib-group-block'),
					path.resolve(
						__dirname,
						'packages/blocklib-multiple-choice-block'
					),
					path.resolve(__dirname, 'packages/blocklib-number-block'),
					path.resolve(
						__dirname,
						'packages/blocklib-slider-block'
					),
					path.resolve(
						__dirname,
						'packages/blocklib-legal-block'
					),
					path.resolve(
						__dirname,
						'packages/blocklib-short-text-block'
					),
					path.resolve(
						__dirname,
						'packages/blocklib-statement-block'
					),
					path.resolve(
						__dirname,
						'packages/blocklib-website-block'
					),
					path.resolve(
						__dirname,
						'packages/blocklib-welcome-screen-block'
					),
					path.resolve(
						__dirname,
						'packages/blocklib-thankyou-screen-block'
					),
				],
				exclude: /node_modules/,
			},
			{
				test: /\.s?css$/,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader',
					{
						// postcss loader so we can use autoprefixer and theme Gutenberg components
						loader: 'postcss-loader',
						options: {
							postcssOptions: {
								config: path.resolve(
									__dirname,
									'postcss.config.js'
								),
							},
						},
					},
					{
						loader: 'sass-loader',
						options: {
							additionalData:
								'@import "packages/base-styles/_colors"; ' +
								'@import "packages/base-styles/_variables"; ' +
								'@import "packages/base-styles/_breakpoints"; ' +
								'@import "packages/base-styles/_mixins"; ',
						},
					},
				],
			},
			{
				test: /\.tsx?$/,
				use: [
					{
						loader: 'ts-loader',
						options: {
							transpileOnly: true,
						},
					},
				],
			},
		]),
	},
	plugins: [
		new CleanWebpackPlugin({
			cleanOnceBeforeBuildPatterns: [
				'**/*',
				'!**/*.php',
				'!**/*.txt',
				'!**/assets/**',
			],
			cleanStaleWebpackAssets: false,
			protectWebpackAssets: true,
		}),
		new DefinePlugin({
			'process.env.FORCE_REDUCED_MOTION': JSON.stringify(
				process.env.FORCE_REDUCED_MOTION
			),
		}),
		new CopyWebpackPlugin(
			quillformsPackages.map((packageName) => ({
				from: `./packages/${packageName}/build-style/*.css`,
				to: `./${packageName}`,
				flatten: true,
				transform: stylesTransform,
			}))
		),
		new CopyWebpackPlugin([
			...quillFormsBlocklibPackagesCopy,
			{
				from: './packages/config/src/json',
				to: path.resolve(__dirname, './includes/json'),
			},
		]),
		...defaultConfig.plugins.filter(
			(plugin) =>
				plugin.constructor.name !== 'DependencyExtractionWebpackPlugin'
		),
		new DependencyExtractionWebpackPlugin({
			useDefaults: true,
			injectPolyfill: false,
		}),
		// new WebpackRTLPlugin( {
		// 	filename: './[name]/style-rtl.css',
		// 	minify: {
		// 		safe: true,
		// 	},
		// } ),

		new MiniCssExtractPlugin({
			filename: './[name]/style.css',
			chunkFilename: './client/chunks/[id].style.css',
		}),
		new RtlCssPlugin('./[name]/style-rtl.css'),
	],
	optimization: {
		concatenateModules: mode === 'production',

		minimize: mode !== 'development',
		minimizer: [
			new TerserPlugin({
				parallel: true,
				terserOptions: {
					output: {
						comments: /translators:/i,
					},
					compress: {
						passes: 2,
					},
					mangle: {
						reserved: ['__', '_n', '_nx', '_x'],
					},
				},
				extractComments: false,
			}),
		],
	},

	devtool,
};
