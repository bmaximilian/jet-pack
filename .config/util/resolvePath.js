/**
 * Created on 2019-05-09.
 *
 * @author Maximilian Beck <maximilian.beck@wtl.de>
 */

const path = require('path');

/**
 * Returns an absolute path from a path relative to project dir
 * @param relativePath
 */
function resolvePathRelativeToProjectDir(relativePath) {
    return path.resolve(__dirname, '../..', relativePath);
}

module.exports = resolvePathRelativeToProjectDir;
