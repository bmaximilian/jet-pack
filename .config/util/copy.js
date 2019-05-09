/**
 * Created on 2019-05-09.
 *
 * @author Maximilian Beck <maximilian.beck@wtl.de>
 */

const fs = require('fs');

/**
 * Copies a file
 * @param {String} source : String : The source file
 * @param {String} target : String : The target file
 * @param {void} cb : Function : The callback executed when done
 * @return {void}
 */
module.exports = function copyFile(source, target, cb) {
    let cbCalled = false;
    /**
     * Executed when stream is done
     * @param {Object} err : Object : The error passed to the function
     * @param {Object} success : Object : The success object passed to the function
     * @return {void}
     */
    const done = (err, success = null) => {
        if (!cbCalled) {
            cb(err, success);
            cbCalled = true;
        }
    };

    const readStream = fs.createReadStream(source);
    const writeStream = fs.createWriteStream(target);

    readStream.on('error', (err) => {
        done(err);
    });

    writeStream.on('error', (err) => {
        done(err);
    });

    writeStream.on('close', (ex) => {
        done(null, ex);
    });

    readStream.pipe(writeStream);
};
