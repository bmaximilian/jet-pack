/**
 * Created on 2019-05-09.
 *
 * @author Maximilian Beck <maximilian.beck@wtl.de>
 */

const {
    isEmpty,
    isNil,
} = require('lodash');

/**
 * Converts the version object to string
 *
 * @param {{patch: string, major: string, minor: string, suffix: string}} version : object : The version to convert
 * @param {string|null} suffix? : string : The suffix for the version (null if the old suffix should be removed)
 * @return {string} : The new version
 */
function versionObjectToString(version, suffix = '') {
    const {
        major,
        minor,
        patch,
        suffix: oldSuffix,
    } = version;

    const formattedPatch = parseInt(patch, 10) + 1;
    const formattedSuffix = isEmpty(suffix) && !isNil(suffix) ? oldSuffix : suffix;

    return `${major}.${minor}.${formattedPatch}${formattedSuffix || ''}`;
}

module.exports = versionObjectToString;
