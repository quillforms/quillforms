const spawn = require('cross-spawn');
const { sync: resolveBin } = require('resolve-bin');

const args = process.argv.slice(2);
const wpCliPath = resolveBin('@wordpress/cli', { executable: 'wp' });

const result = spawn.sync(wpCliPath, ['i18n', ...args], {
    stdio: 'inherit'
});

process.exit(result.status);