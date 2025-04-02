const Min = 1000;
const Max = 10000;
const Path = require("path");



class Utilities {
    static getConfig(type) {
        let path = Path.relative("config.json", "src/config.json");
    }

    static getRandom(min = Min, max = Max) {
        return !isNaN(min) && !isNaN(max)
            ? Math.floor(Math.random() * max + min)
            : console.error(`Invalid expression ${min} | ${max}`);
    }

    static getNullableItem(item, defaultValue) {
        return (typeof item !== 'null' && typeof item !== 'undefined') ? item : defaultValue;
    }

    static verifyNullableItem(item) {
        return (typeof item !== 'null' && typeof item !== 'undefined') ? true : false;
    }
}



module.exports = Utilities;
