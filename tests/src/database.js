const mysql = require("mysql");

const dotenv = require("dotenv");

dotenv.config();

class DB {
    /*{MySQL}*/
    #conn;
    /*{array|object}*/
    #data;
    /*{string}*/
    #table;
    /*{array|object|string}*/
    #cols;
    /*{string}*/
    #sql;
    /*{array|object}*/
    #params;

    constructor(dbname = "") {
        try {
            this.#conn = mysql.createConnection({
                host: process.env.DBHOST,
                username: process.env.DBUSERNAME,
                password: process.env.DBPASSWORD,
                database: dbname.length > 0 ? dbname : process.env.DBNAME
            });
            console.log("Connection successful");
        } catch (e) {
            throw e;
        }
    }

    async #query() {
        return new Promise((resolve, reject) => {
            this.#conn.query(this.#sql, this.#params, (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    console.log(this.#params);
                    resolve(results);
                }
            });
        });
    }
}

module.exports = DB;
