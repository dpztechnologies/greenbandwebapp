const mysql = require('mysql2/promise');
const path = require("path");
const dotenv = require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const Utilities = require('./utilities.cjs')


if (dotenv.error) {
    throw new Error("Failed to load .env file");
}

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

    static #instance



    /**
     * Constructor to initialize the database connection.
     * Sets up the connection to the MySQL database using credentials from environment variables.
     */
    constructor() {
        this.#conn = mysql.createPool({
            connectionLimit: 200,
            host: process.env.DBHOST,
            user: process.env.DBUSER,
            password: process.env.DBPASSWORD,
            database: process.env.DBNAME,
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
     * Public method to get the query results.
     * @returns {Array} The results of the executed SQL query.
     */
    getResults() {
        return JSON.parse(JSON.stringify(this.#result));
    }

    /**
     * Asynchronous method to perform a SQL query and handle results.
     * @param {string} sql - The SQL query string.
     * @param {Array} [params=[]] - The parameters to use in the query.
     * @returns {Promise} A promise that resolves with the current instance after the query completes.
     */
    async query(sql = this.#sql, params = this.#params) {
        try {
            const [results] = await this.#conn.execute(sql, params);
            this.#setResults(results);
            return this;
        } catch (err) {
            err.query = sql;
            err.params = params;
            throw err;
        }
    }


    /**
     * Method to start a SELECT query with specified fields.
     * @param {Array} [fields=[]] - The fields to select in the query.
     * @returns {Database} The current instance for chaining.
     * @throws {Error} Throws error if fields are empty.
     */
    select(fields = []) {
        try {
            if (fields.length > 0 && Array.isArray(fields)) {
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
    * Method to start a DELETE query.
    * Initializes the SQL query with the DELETE keyword.
    * To complete the query, use chaining with from(), where(), etc.
    *
    * @returns {Database} The current instance for chaining.
    */
    delete() {
        this.#sql = `DELETE`;
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
    from(table) {
        this.#sql += ` FROM ${table}`;
        return this;
    }

    /**
     * Asynchronous method to add a WHERE clause to the SQL query.
     * Delegates processing to a private helper.
     *
     * @param {Array} where - An array with exactly 3 elements: [column, operator, value].
     * @param {boolean} [exec=false] - Whether to execute the query immediately.
     * @returns {Promise<Database>} The current instance for chaining.
     * @throws {Error} Throws an error if the input array doesn't have exactly 3 elements.
    */
    where(where = []) {
        return this.#primitives('WHERE', where);
    }

    /**
     * Asynchronous method to append an AND condition to an existing WHERE clause.
     * Delegates processing to a private helper.
     *
     * @param {Array} and - An array with exactly 3 elements: [column, operator, value].
     * @param {boolean} [exec=false] - Whether to execute the query immediately.
     * @returns {Promise<Database>} The current instance for chaining.
     * @throws {Error} Throws an error if the input array doesn't have exactly 3 elements.
     */
    and(and = []) {
        return this.#primitives('AND', and);
    }

    /**
     * Private helper to process conditional SQL primitives (e.g., WHERE, AND).
     *
     * @param {string} alias - The SQL keyword to use (e.g., "WHERE", "AND").
     * @param {Array} primitive - An array containing [column, operator, value].
     * @param {boolean} exec - Whether to execute the query immediately.
     * @returns {Promise<Database>} The current instance for chaining.
     * @throws {Error} If the input array doesn't have exactly 3 elements.
     */
    #primitives(alias, primitive = []) {
        try {
            if (primitive.length === 3) {
                const [col, op, val] = primitive;
                this.#sql += ` ${alias} ${col} ${op} ?`;
                this.#params.push(val);
                return this;
            } else {
                throw new Error("Warning: Where params must have exactly 3 elements");
            }
        } catch (err) {
            console.error(err);
        }
    }

    /**
     * Adds a JOIN clause to the SQL query.
     *
     * @param {string} type - The type of join (e.g., 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN').
     * @param {string} table - The name of the table to join.
     * @returns {this} The current instance for chaining.
     */
    join(type, table) {
        this.#sql += ` ${type} ${table}`;
        return this;
    }

    /**
    * Adds an ON condition for the previously defined JOIN clause.
    *
    * @param {string} baseTableColumn - The column from the base table (e.g., 'users.id').
    * @param {string} joinedTableColumn - The column from the joined table (e.g., 'orders.user_id').
    * @returns {this} The current instance for chaining.
    */
    on(baseTableColumn, joinedTableColumn) {
        this.#sql += ` ON ${baseTableColumn} = ${joinedTableColumn}`;
        return this;
    }

    /**
 * Begins an SQL UPDATE statement for the specified table.
 *
 * @param {string} table - The name of the table to update.
 * @returns {this} The current instance to allow method chaining.
 *
 * @example
 * queryBuilder.update('users')
 */
    update(table) {
        this.#sql = `UPDATE ${table}`;
        return this;
    }

    /**
     * Adds a SET clause to the current SQL UPDATE statement.
     * Accepts an object where keys are column names and values are the values to set.
     * Uses parameterized placeholders to prevent SQL injection.
     *
     * @param {Object} data - An object mapping columns to new values.
     * @returns {this} The current instance to allow method chaining.
     *
     * @example
     * queryBuilder.set({ name: 'John', age: 30 })
     * // Produces: "SET name = ?, age = ?"
     */
    set(data) {
        const setClauses = [];
        for (let key in data) {
            setClauses.push(`${key} = ?`);
            this.#params.push(data[key]);
        }
        this.#sql += ` SET ${setClauses.join(', ')}`;
        return this;
    }

    /**
    * Count the number of records in a table.
    * @param {string} table - The table to count records in.
    * @param {Array} [where=[]] - Optional WHERE condition in the form [column, operator, value].
    * @returns {Promise<number>} The count result as a number.
    */
    async count(table, where = []) {
        try {
            let sql = `SELECT COUNT(*) AS count FROM ${table}`;
            const params = [];

            if (where.length === 3) {
                const [col, op, val] = where;
                sql += ` WHERE ${col} ${op} ?`;
                params.push(val);
            }
            await this.query(sql, params);
            const result = this.getResults();
            return result[0]?.count || 0;
        } catch (err) {
            console.error("Count Error:", err.message);
            throw err;
        }
    }


    limit(count) {
        this.#sql += ` LIMIT ${count}`
        return this;
    }


    orderby(field, order) {
        this.#sql += ` ORDER BY ${field} ${order}`
        return this;
    }


    getSQL() {
        return { sql: this.#sql, params: this.#params };
    }


    /**
     * Static method to get the singleton instance of the Database class.
     * If no instance exists, it creates one.
     * @returns {Database} The singleton instance of the Database class.
     */
    static run() {
        if (!this.instance) {
            this.instance = new this();
        }
        return this.instance;
    }

    static reset() {
        this.instance = new this();
        return this.instance;
    }
}



module.exports = Database;
