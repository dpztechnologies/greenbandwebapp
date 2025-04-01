const Min = 1000;
const Max = 10000;
const Path = require("path");

async function getConfig(type) {
    let path = Path.relative("config.json", "src/config.json");
    
    console.log(path);
    
   // console.log(path)
    
    /*
    try {
        let config = await fetch(path);
        config.then(response => {
            if (response.ok) {
                response.json().then(res => {
                    console.log(res);
                });
            }
        });
    } catch (e) {
        throw e;
    }*/
}

function getRandom(min = Min, max = Max) {
    return !isNaN(min) && !isNaN(max)
        ? Math.floor(Math.random() * max + min)
        : console.error(`Invalid expression ${min} | ${max}`);
}

module.exports = { getRandom, getConfig };
