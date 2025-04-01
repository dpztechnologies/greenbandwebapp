const mysql = require('mysql');
const path = require("path");
const dotenv = require('dotenv').config({ path: path.resolve("../../.env") });
const Utilities = require('./utilities.js')






class Database {
    #conn;
    #sql = "";
    #result;
    #params = [];
    #fields;

    static instance = "";

    constructor() {
        this.#conn = mysql.createConnection({
            host: process.env.DBHOST,
            user: process.env.DBUSER,
            password: process.env.DBPASSWORD,
            database: process.env.DBNAME
        });

        this.#conn.connect((err) => {
            if (err) throw err;
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


    insert() {
        this.#sql = `INSERT `
        return this;
    }


    async into(table, data = {}) {
        try {
            if (Utilities.verifyNullableItem(table) && Utilities.verifyNullableItem(data)) {
                this.#sql += `INTO ${table} (\`${Object.keys(data).join('`, `')}\`) VALUES (${this.#generatePreparedStmt(data)})`;
                this.#params = Object.values(data);
                await this.query(this.#sql, this.#params);
                return this;
            } else {
                throw new Error(`Missing item: Table ${table} Data ${data}`)
            }
        } catch (err) {
            throw err
        }
    }


    #generatePreparedStmt(data) {
        let pstmt = ''
        let x = 1;
        Object.keys(data).forEach(key => {
            pstmt += '?'
            if (x < Object.keys(data).length) {
                pstmt += ','
            }
            x++;
        });
        return pstmt
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
