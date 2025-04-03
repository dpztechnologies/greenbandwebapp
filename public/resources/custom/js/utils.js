class Utils {
    /**
     * Constructs a full URL by combining the current origin with the given path.
     * 
     * @param {string} path - The path to append to the current origin.
     * @returns {string} - The full URL consisting of the origin and the provided path.
     */
    static getUrl(path) {
        return window.location.origin + path;
    }
}

export default Utils;
