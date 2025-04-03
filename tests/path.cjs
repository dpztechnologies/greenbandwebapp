const path = require('path');


/**
 * @author DPZTechnologies
 * @date Thu Apr 03 2025 15:17:25 GMT+0300 (East Africa Time)
 * @abstract Path handling methods
 */
class Path {

    /**
    * Get the nth parent directory of a given directory using path.dirname recursively.
    * @param {string} dir - The starting directory (default: __dirname).
    * @param {number} levels - The number of levels to go up (default: 1).
    * @returns {string} - The resolved parent directory.
    */
    static getParentDir(dir = __dirname, levels = 1) {
        for (let i = 0; i < levels; i++) {
            dir = path.dirname(dir)
        }
        return dir;
    }


    /**
     * Creates an absolute file path based on provided relative segments
     * @param  {...any} segments - The segments forming the file path
     * @returns {string} - The resolved absolute file path.
     */
    static getFile(base, ...segments) {
        return path.join(base, ...segments);
    }

    /**
     * Creates a relative path based on provided relative segments
     * @param  {...any} segments - The segments forming the file path
     * @returns {string} - The resolved relative file path.
     */
    static relative(...segments) {
        return path.join(...segments);
    }
}


module.exports = Path;