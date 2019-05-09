/**
 * Created on 2019-05-09.
 *
 * @author Maximilian Beck <maximilian.beck@wtl.de>
 */

const { execSync } = require('child_process');
const resolvePath = require('./resolvePath');

/**
 * Executes some nodexec commands
 * @param {string[]} commands : string[] : The commands to execute
 * @return {void}
 */
function runNodexecCommands(commands) {
    const nodexecPath = resolvePath('node_modules/.bin/nodexec');

    commands.forEach((command) => {
        execSync(`${nodexecPath} ${command}`, { stdio: [0, 1, 2] });
        console.log();
    });
}

module.exports = runNodexecCommands;
