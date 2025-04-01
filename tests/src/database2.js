const mysql = require('mysql');
const path = require("path");
const env = require('dotenv').config({ path: path.resolve("../../.env") });


class Database {
    #conn;
    #sql = "";
    #result;
    #params = [];
    #fields;

    static instance = "";

    constructor() {
        this.#conn = mysql.createConnection({
            host: process.env.HOST,
            user: process.env.USER,
            password: process.env.PASSWORD,
            database: process.env.DB
        });

        this.#conn.connect((err) => {
            if (err) throw err;
            console.log("Connected to database");
        });
    }

    #setResults(results) {
        this.#result = results;
    }

    #setFields(fields) {
        this.#fields = fields;
    }

    getResults() {
        return this.#result;
    }

    async query(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.#conn.query(sql, params, (err, results, fields) => {
                if (err) {
                    reject(err);
                    return;
                }
                this.#setResults(results);
                this.#setFields(fields);
                resolve(this);
            });
        });
    }



    select(fields = []) {
        try {
            if (fields.length > 0) {
                this.#sql = `SELECT ${fields.join(', ')}`
            } else {
                throw new Error("Warning: Fields must be defined");
            }
        } catch (err) {
            console.error(err);
        }
        return this;
    }


    async from(table, exec = false) {
        this.#sql += ` FROM ${table}`;
        if (exec) {
            await this.query(this.#sql, this.#params);
        }
        return this;
    }

    async where(where = []) {
        try {
            if (where.length === 3) {
                const [col, op, val] = where;
                this.#sql += ` WHERE ${col} ${op} ?`;
                this.#params.push(val);
                await this.query(this.#sql, this.#params);
                return this;
            } else {
                throw new Error("Warning: Where params must have exactly 3 elements");
            }
        } catch (err) {
            console.error(err);
        }
    }

    static use() {
        if (!this.instance) {
            this.instance = new this();
        }
        return this.instance;
    }
}


module.exports = Database;