const mysql = require('mysql');
const path = require("path");
const dotenv = require('dotenv').config({ path: path.resolve("../../.env") });
const Utilities = require('./utilities.cjs')


/**
 * @author DPZTechnologies
 * @date Thu Apr 03 2025 15:17:25 GMT+0300 (East Africa Time)
 * @abstract Database Service Provider (MySQL)
 */
class Database {
    /*** Private variable for database connection. ***/
    #conn;

    /*** SQL query string. ***/
    #sql = "";

    /*** Holds query results. ***/
    #result;

    /*** Array to hold query parameters. ***/
    #params = [];

    /*** Holds field names from the query result. ***/
    #fields;

    /*** Singleton instance for ensuring a single database connection. ***/
    static instance = "";


    /**
     * Constructor to initialize the database connection.
     * Sets up the connection to the MySQL database using credentials from environment variables.
     */
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

    /**
     * Private method to set query results.
     * @param {Array} results - The results of the SQL query.
     */
    #setResults(results) {
        this.#result = results;
    }

    /**
     * Private method to set query fields.
     * @param {Array} fields - The fields of the SQL query.
     */
    #setFields(fields) {
        this.#fields = fields;
    }

    /**
     * Public method to get the query results.
     * @returns {Array} The results of the executed SQL query.
     */
    getResults() {
        return this.#result;
    }

    /**
     * Asynchronous method to perform a SQL query and handle results.
     * @param {string} sql - The SQL query string.
     * @param {Array} [params=[]] - The parameters to use in the query.
     * @returns {Promise} A promise that resolves with the current instance after the query completes.
     */
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

    /**
     * Method to start a SELECT query with specified fields.
     * @param {Array} [fields=[]] - The fields to select in the query.
     * @returns {Database} The current instance for chaining.
     * @throws {Error} Throws error if fields are empty.
     */
    select(fields = []) {
        try {
            if (fields.length > 0) {
                this.#sql = `SELECT ${fields.join(', ')}`;
            } else {
                throw new Error("Warning: Fields must be defined");
            }
        } catch (err) {
            console.error(err);
        }
        return this;
    }

    /**
     * Method to start an INSERT query.
     * @returns {Database} The current instance for chaining.
     */
    insert() {
        this.#sql = `INSERT `;
        return this;
    }

    /**
     * Asynchronous method to specify the target table and insert data.
     * @param {string} table - The table to insert data into.
     * @param {Object} data - The data to insert into the table.
     * @returns {Database} The current instance for chaining.
     * @throws {Error} Throws error if table or data is missing.
     */
    async into(table, data = {}) {
        try {
            if (Utilities.isDefined(table) && Utilities.isDefined(data)) {
                this.#sql += `INTO ${table} (\`${Object.keys(data).join('`, `')}\`) VALUES (${this.#generatePreparedStmt(data)})`;
                this.#params = Object.values(data);
                await this.query(this.#sql, this.#params);
                return this;
            } else {
                throw new Error(`Missing item: Table ${table} Data ${data}`); // Throw error if table or data is missing.
            }
        } catch (err) {
            throw err;
        }
    }

    /**
     * Private method to generate the prepared statement for parameterized queries.
     * @param {Object} data - The data for which to generate the prepared statement.
     * @returns {string} The generated prepared statement.
     */
    #generatePreparedStmt(data) {
        return Object.keys(data).fill('?').join(',');
    }

    /**
     * Asynchronous method to specify the source table for the query.
     * @param {string} table - The table to query data from.
     * @param {boolean} [exec=false] - Whether to execute the query immediately.
     * @returns {Database} The current instance for chaining.
     */
    async from(table, exec = false) {
        this.#sql += ` FROM ${table}`;
        if (exec) {
            await this.query(this.#sql, this.#params);
        }
        return this;
    }

    /**
     * Asynchronous method to add WHERE conditions to the SQL query.
     * @param {Array} where - The WHERE condition with column, operator, and value.
     * @returns {Database} The current instance for chaining.
     * @throws {Error} Throws error if WHERE conditions don't have exactly 3 elements.
     */
    async where(where = []) {
        try {
            if (where.length === 3) {
                const [col, op, val] = where;
                this.#sql += ` WHERE ${col} ${op} ?`;
                this.#params.push(val);
                await this.query(this.#sql, this.#params);
                return this;
            } else {
                throw new Error("Warning: Where params must have exactly 3 elements"); // Error if invalid parameters.
            }
        } catch (err) {
            console.error(err);
        }
    }

    /**
     * Static method to get the singleton instance of the Database class.
     * If no instance exists, it creates one.
     * @returns {Database} The singleton instance of the Database class.
     */
    static use() {
        if (!this.instance) {
            this.instance = new this();
        }
        return this.instance;
    }
}



module.exports = Database;
