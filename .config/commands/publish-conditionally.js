
const path = require('path');
const simpleGit = require('simple-git');
const chalk = require('chalk');
const { execSync } = require('child_process');
const latestVersion = require('latest-version');
const packageJson = require('../../package');

/**
 * publish:conditionally
 *
 * @param {Object} options : Object : The parsed options from process.argv
 * @param {Object} config : Object : The configuration from ~/.nodexec/config.json
 * @param {Object} command : Object : The exported command from this directory
 * @returns {void}
 */
function publishConditionally(options, config, command) {
    const modulePackageJsonPath = path.resolve(process.cwd(), 'package.json');
    const modulePackageJson = require(modulePackageJsonPath);

    if (!modulePackageJson) {
        throw new Error(`Could not find file ${modulePackageJsonPath}`);
    }

    const version = modulePackageJson.version;

    if (!version) {
        throw new Error(`Could not find version property in file ${modulePackageJsonPath}`);
    }

    const moduleNameSplit = process.cwd().split('/');
    const moduleName = moduleNameSplit[moduleNameSplit.length - 1];

    if (!packageJson.modules.find(m => m === moduleName)) {
        throw new Error(`Module name ${moduleName} is not listed in package.json of the whole project`);
    }

    const packageName = `@jet-pack/${moduleName}`;

    const git = simpleGit();
    git.tags(['--sort'], (listTagsError, tagsList) => {
        if (listTagsError) {
            console.error(listTagsError);
            process.exit(1);
            return;
        }

        let latestTag = tagsList.length > 0 ? tagsList[tagsList.length - 1] : null;

        if (!latestTag) {
            console.error(chalk.red(`No tag found for ${process.cwd()}`));
            process.exit(1);
            return;
        }

        if (latestTag[0] === 'v') {
            latestTag = latestTag.substr(1);
        }

        if (latestTag !== modulePackageJson.version) {
            console.log(chalk.yellow(`Version of package ${packageName} ${modulePackageJson.version} is different than current tag ${latestTag}`));
            // throw new Error(`Tag ${latestTag} not matching package json version ${modulePackageJson.version}`);
        }

        latestVersion(packageName)
        .then((response) => {
            console.log(chalk.white(`Old version of package ${packageName}: `) + chalk.cyan(response));

            if (response !== modulePackageJson.version) {
                console.log(chalk.white(`Publishing new version of package ${packageName}: `) + chalk.cyan(modulePackageJson.version));
                execSync('npm publish');
                return;
            }

            console.log(chalk.yellow(`Version of package ${packageName} was not changed and stays ${modulePackageJson.version}`));
        })
        .catch((err) => {
            if (err.constructor.name === 'PackageNotFoundError') {
                console.log(chalk.cyan(`Package ${packageName} not found. Will be published for the first time`));
                execSync('npm publish');
                return;
            }

            console.error(err);
            process.exit(1);
        })
    });
}

module.exports = {
    name: 'publish:conditionally',
    command: publishConditionally,
    description: '',
    scope: '/',
    aliases: [],
};
