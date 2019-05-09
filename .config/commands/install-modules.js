
const { exec } = require('child_process');
const chalk = require('chalk');
const resolvePathRelativeToProjectDir = require('../util/resolvePath');
const packageJson = require('../../package');

/**
 * install:modules
 *
 * @param {Object} options : Object : The parsed options from process.argv
 * @param {Object} config : Object : The configuration from ~/.nodexec/config.json
 * @param {Object} command : Object : The exported command from this directory
 * @returns {void}
 */
function installModules(options, config, command) {
    packageJson.modules.forEach((m) => {
        chalk.white(`Installing module ${m}`);
        exec(`cd ${resolvePathRelativeToProjectDir(m)} && npm install`, () => {
            chalk.green(`Finished installing module ${m}`);
        });
    });
}

module.exports = {
    name: 'install:modules',
    command: installModules,
    description: '',
    scope: '/',
    aliases: [],
};
