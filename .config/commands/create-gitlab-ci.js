
const yamlMerge = require('@alexlafroscia/yaml-merge');
const resolvePathRelativeToProjectDir = require('../util/resolvePath');
const packageJson = require('../../package');
const write = require('../util/write');

/**
 * create:gitlab-ci
 *
 * @param {Object} options : Object : The parsed options from process.argv
 * @param {Object} config : Object : The configuration from ~/.nodexec/config.json
 * @param {Object} command : Object : The exported command from this directory
 * @returns {void}
 */
function createGitlabCi(options, config, command) {
    const moduleGitlabCiYmls = packageJson.modules.map(m => `${m}/.gitlab-ci.yml`);
    const baseGitLabCiYml = '.gitlab-ci.base.yml';
    const projectGitlabCiYml = '.gitlab-ci.yml';

    const merged = yamlMerge(
        resolvePathRelativeToProjectDir(baseGitLabCiYml),
        ...moduleGitlabCiYmls.map(path => resolvePathRelativeToProjectDir(path)),
    );

    write(projectGitlabCiYml, merged);
}

module.exports = {
    name: 'create:gitlab-ci',
    command: createGitlabCi,
    description: '',
    scope: '/',
    aliases: [],
};
