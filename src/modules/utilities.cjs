const { FilePaths, MinRandom, MaxRandom } = require('../config/constants.cjs');

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

    /**
    * Recursively replaces patterns in object keys based on search and replace arrays.
    * Handles nested objects and arrays.
    * @param {object|array} object - The object or array to process
    * @param {Array<RegExp>} search - Array of RegExp patterns to search for in keys
    * @param {Array<string>} replace - Array of replacement strings corresponding to the search patterns
    * @returns {object|array} A new object or array with replaced keys
    * @throws Will throw an error if search and replace are not arrays or have different lengths
    */
    static replaceObjectKeysPattern(object, search = [], replace = []) {
        if (!Array.isArray(search) || !Array.isArray(replace)) {
            throw new Error('Search & Replace must be of type Array');
        }

        if (search.length !== replace.length) {
            throw new Error('Search and replace items must be of the same length');
        }

        const replaceKeys = (key) => {
            let newKey = key;
            for (let x = 0; x < search.length; x++) {
                newKey = newKey.replace(search[x], replace[x]);
            }
            return newKey;
        }

        if (Array.isArray(object)) {
            return object.map(item => Utilities.replaceObjectKeysPattern(item, search, replace));
        }

        if (object !== null && typeof object === 'object') {
            const newObject = {};
            for (const key in object) {
                if (Object.hasOwnProperty.call(object, key)) {
                    const newKey = replaceKeys(key);
                    newObject[newKey] = Utilities.replaceObjectKeysPattern(object[key], search, replace);
                }
            }
            return newObject;
        }

        return object;
    }

    /**
     * Replaces object keys based on a key mapping.
     * @param {object} object - The original object
     * @param {object} keyMap - A mapping of old keys to new keys
     * @returns {object} A new object with keys replaced based on the key map
     * @throws Will throw an error if object or keyMap is not an object
     */
    static replaceObjectKeys(object, keyMap = {}) {
        if (typeof object !== 'object' || typeof keyMap !== 'object') {
            throw new Error('object and keyMap must be of type object');
        }

        const newObject = {};

        for (let key in object) {
            if (Object.hasOwnProperty.call(object, key)) {
                const newKey = keyMap[key] || key;
                newObject[newKey] = object[key];
            }
        }

        return newObject;
    }


    static #getDateTimeString(timestamp, format = 'd/m/Y') {
        const date = new Date(timestamp);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();

        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        const allowedDateFormats = ['d/m/Y', 'd', 'm', 'Y', 'g:iA', 'd/m/Y g:iA'];

        if (allowedDateFormats.includes(format)) {
            switch (format) {
                case 'd/m/Y':
                    return `${day}/${month}/${year}`
                case 'd':
                    return `${day}`
                case 'm':
                    return `${month}`
                case 'Y':
                    return `${year}`
                case 'g:iA':
                    return `${hours}:${minutes}${ampm}`
                case 'd/m/Y g:iA':
                    return `${day}/${month}/${year} ${hours}:${minutes}${ampm}`;
                default:
                    return `${day}/${month}/${year}`
            }
        }
        throw new Error(`Invalid Date time format ${format}`);
    }

    static getDateTime(format) {
        return Utilities.#getDateTimeString(new Date, format)
    }
}



module.exports = Utilities;
