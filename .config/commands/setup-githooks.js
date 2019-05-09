
const fs = require('fs');
const chalk = require('chalk');
const resolvePathRelativeToProjectDir = require('../util/resolvePath');
const copy = require('../util/copy');

/**
 * setup:githooks
 *
 * @param {Object} options : Object : The parsed options from process.argv
 * @param {Object} config : Object : The configuration from ~/.nodexec/config.json
 * @param {Object} command : Object : The exported command from this directory
 * @returns {void}
 */
function setupGithooks(options, config, command) {
    console.log(chalk.white('Setting up Git hooks...'));

    const hooks = [
        'pre-push',
        'pre-commit',
    ];

    const srcPath = '.config/githooks';
    const destPath = '.git/hooks';

    hooks.forEach((hook) => {
       const src = resolvePathRelativeToProjectDir(`${srcPath}/${hook}`);
       const dest = resolvePathRelativeToProjectDir(`${destPath}/${hook}`);

        if (fs.existsSync(dest)) {
            fs.unlinkSync(dest);
        }

        copy(src, dest, (copyError) => {
            if (copyError) throw copyError;

            fs.chmodSync(dest, '0755');

            console.log(`${chalk.green(`Git hook ${hook} set up successfully.`)}`);
        });
    });
}

module.exports = {
    name: 'setup:githooks',
    command: setupGithooks,
    description: '',
    scope: '/',
    aliases: [],
};
