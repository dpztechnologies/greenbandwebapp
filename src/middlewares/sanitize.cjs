class SanitizeMiddleware {
    static #sanitizeEngine(input) {
        if (typeof input === 'string') {
            return input.trim()
                .replace(/&/g, "&amp;") //Escape &
                .replace(/</g, "&lt;") //Escape <
                .replace(/>/g, "&gt;") // Escape > 
                .replace(/"/g, "&quot;") // Escape "
                .replace(/'/g, "&#x27;") // Escape '
                .replace(/\\/g, "&#x5C;") // Escape \
                .replace(/\//g, "&#x2F;") //Escape /
                .replace(/`/g, "&#x60;") // Escape ` -> Prevents template injections
                .replace(/x00/g, "&#x00;") // Escape null byte -> Prevents file manipulation vulnerabilities
                .replace(/\\x/g, "&#92;x") // Escape hexadecimal encoding characters
        }

        //Sanitive each element in an array input
        if (Array.isArray(input)) {
            return input.map(item => SanitizeMiddleware.#sanitizeEngine(item));
        }

        if (typeof input === 'object' && input !== null) {
            const cleanObject = {};
            for (let key in input) {
                if (Object.hasOwnProperty.call(input, key)) {
                    const cleanKey = SanitizeMiddleware.#sanitizeEngine(key);
                    const cleanValue = SanitizeMiddleware.#sanitizeEngine(input[key]);
                    cleanObject[cleanKey] = cleanValue;
                }
            }
            return cleanObject;
        }

        //If input is a number or boolean return it as it is
        return input;
    }

    static sanitizeData(req, res, next) {
        if (req.body) {
            req.body = SanitizeMiddleware.#sanitizeEngine(req.body);
        }
        if (req.query) {
            req.query = SanitizeMiddleware.#sanitizeEngine(req.query);
        }
        if (req.params) {
            req.params = SanitizeMiddleware.#sanitizeEngine(req.params);
        }
        next();
    }

}

module.exports = {
    Sanitizer: SanitizeMiddleware
}