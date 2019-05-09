/**
 * Created on 2019-05-09.
 *
 * @author Maximilian Beck <maximilian.beck@wtl.de>
 */

const fs = require('fs');

/**
 * Write a file
 * @param {String} path : String : The file path
 * @param {String} content : String : The content
 * @return {Promise}
 */
module.exports = function write(path, content) {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, content, (writeError) => {
            if (writeError) {
                return reject(writeError);
            }

            return resolve(`Wrote file ${path}`);
        });
    });
};
