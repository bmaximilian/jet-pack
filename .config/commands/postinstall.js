
const nodexec = require('nodexec');

/**
 * postinstall
 *
 * @param {Object} options : Object : The parsed options from process.argv
 * @param {Object} config : Object : The configuration from ~/.nodexec/config.json
 * @param {Object} command : Object : The exported command from this directory
 * @returns {void}
 */
function postinstall(options, config, command) {
    [
        'install:modules',
        'setup:githooks',
    ].forEach(cmd => nodexec(cmd));
}

module.exports = {
    name: 'postinstall',
    command: postinstall,
    description: '',
    scope: '/',
    aliases: [],
};
