/**
 * Created on 2019-05-09.
 *
 * @author Maximilian Beck <maximilian.beck@wtl.de>
 */

/**
 * Converts a passed version to an object
 *
 * @param {string} version : string : The version string
 * @return {{patch: string, major: string, minor: string, suffix: string}} : The converted version
 */
function convertVersionToObject(version) {
    const [major, minor, patch] = version.split('.');
    let formattedPatch = patch;
    let suffix = '';

    if (includes(formattedPatch, '-')) {
        const split = formattedPatch.split('-');
        formattedPatch = split.shift();

        if (isEmpty(suffix) && split.length > 0) {
            suffix = `-${split.join('')}`;
        }
    }

    return {
        major,
        minor,
        patch: formattedPatch,
        suffix,
    };
}

module.exports = convertVersionToObject;
