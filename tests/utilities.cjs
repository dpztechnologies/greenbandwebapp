const { FilePaths, MinRandom, MaxRandom } = require('./constants.cjs');

/**
 * @author DPZTechnologies
 * @date Thu Apr 03 2025 15:17:25 GMT+0300 (East Africa Time)
 * @abstract App Utilities
 */
class Utilities {

    /**
     * Genarate a random number
     * @param {Number} min - The minimum random number value 
     * @param {Number} max  - The maximum random number value
     * @returns {Number|TypeError} - A random number or throws a TypeError Exception
     */
    static getRandom(min = MinRandom, max = MaxRandom) {
        return !isNaN(min) && !isNaN(max)
            ? Math.floor(Math.random() * max + min)
            : console.error(`Invalid expression ${min} | ${max}`);
    }

    /**
     * Get a value from a parameter or use the default value
     * @param {string|number|array|object|null|undefined}  item 
     * @param {string|number|array|object|null|undefined} defaultValue 
     * @returns {string|number|array|object|null|undefined} A value whether default or new
     */
    static getOrDefault(item, defaultValue) {
        return (typeof item !== 'null' && typeof item !== 'undefined') ? item : defaultValue;
    }

    /**
     * Checks if a variable is defined
     * @param {string|number|array|object|null|undefined} item 
     * @returns {bool} true if defined false if undefuined
     */
    static isDefined(item) {
        return (typeof item !== 'null' && typeof item !== 'undefined') ? true : false;
    }

    /**
     * Gets a file path registered in Constants/Filepaths
     * @param {string} filename 
     * @returns {string} A file path registered in constants/FilePaths object
     */
    static getFilePath(filename) {
        return (Object.keys(FilePaths).includes(filename)) ? FilePaths[filename] : console.error(`Invalid filename: ${filename}`)
    }
}



module.exports = Utilities;
