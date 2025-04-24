const crypto = require('crypto')
const DB = require('./database.cjs');

/**
 * Auth class handles session-based authentication using cookies and a database-backed session store.
 */
class Auth {

    /**
     * Singleton instance of the Auth class.
     * @type {Auth|null}
     */
    static instance = null;

    /**
     * Creates an instance of the Auth class.
     * @param {Object} options - Configuration options.
     * @param {string} [options.cookieName='auth_token'] - Name of the authentication cookie.
     * @param {Object} [options.cookieOptions] - Cookie options like httpOnly, path, etc.
     */
    constructor(options = {}) {
        this.cookieName = options.cookieName || 'auth_token';
        this.cookieOptions = options.cookieOptions || {
            httpOnly: true,
            path: '/',
            secure: true,
            sameSite: 'strict',
            maxAge: 60 * 60 * 1000
        };
    }

    /**
     * Generates a secure random session ID.
     * @returns {string} A hexadecimal session ID.
     */
    generateSessionId() {
        return crypto.randomBytes(32).toString('hex');
    }

    /**
     * Parses a cookie header string into an object.
     * @param {string} cookieHeader - The raw cookie header string from a request.
     * @returns {Object} Parsed cookies as key-value pairs.
     */
    parseCookies(cookieHeader) {
        const cookies = {};
        cookieHeader?.split(';').forEach(cookie => {
            const [key, value] = cookie.trim().split('=');
            cookies[key] = decodeURIComponent(value);
        });
        return cookies;
    }

    /**
     * Constructs the `Set-Cookie` header string from a session ID and cookie options.
     * @param {string} sessionId - The session ID to include in the cookie.
     * @returns {string} The formatted `Set-Cookie` header string.
     */
    buildCookieHeader(sessionId) {
        const options = this.cookieOptions;
        const parts = [
            `${this.cookieName} = ${encodeURIComponent(sessionId)}`,
            `path=${options.path}`,
            `HttpOnly`,
            `Max-Age=${Math.floor(options.maxAge / 1000)}`
        ];
        if (options.secure) parts.push('Secure');
        if (options.sameSite) parts.push(`SameSite=${options.sameSite}`);
        return parts.join('; ');
    }

    /**
     * Deletes an existing session from the database if one exists for the given criteria.
     * @param {Object} data - The session filter criteria.
     * @param {string} data.from - The value to match against.
     * @param {string} data.column - The column to match.
     * @returns {Promise<void>}
     */
    async garbageCollectSession(data = { from: '', column: '' }) {
        const count = DB.run().count('sessions', [data.column, '=', data.from]);
        if (count) {
            await DB.run().delete().from('sessions').where([data.column, '=', data.from]).query()
            return;
        }
        return;
    }

    /**
     * Creates a new session and stores it in the database.
     * @param {Object} data - Data for session creation.
     * @param {string} data.from - The value to store in the session row.
     * @param {string} data.column - The column name to store `from` under.
     * @returns {Promise<string>} The newly generated session ID.
     */
    async createSession(data = { from: '', column: '' }) {
        await this.validateSessionParams(data)
        await this.garbageCollectSession(data);
        const sessionId = this.generateSessionId();
        const expires = new Date(Date.now() + this.cookieOptions.maxAge);
        await DB.run().insert().into('sessions', { id: sessionId, [data.column]: data.from, expires_at: expires });
        return sessionId;
    }

    /**
     * Validates session parameters to ensure proper structure and types.
     * @param {Object} data - Session parameters.
     * @param {string} data.from - The value to store in the session.
     * @param {string} data.column - The column name to store it under.
     * @throws Will throw an error if validation fails.
     * @returns {Promise<void>}
     */
    async validateSessionParams(data = { from: '', column: '' }) {
        const allowedKeys = ['from', 'column'];
        if (Object.keys(data) > 2) throw new Error(`Data must contain only 2 params from & column`)
        Object.keys(data).forEach(key => {
            if (!allowedKeys.includes(key)) {
                throw new Error(`Invalid key ${key} data must have only 2 params from & column`);
            }
        })
        if (!data.from || !data.column) throw new Error('`from` field and `column` field are required');
        if (typeof data.from !== 'string' || typeof data.column !== 'string') throw new Error('`from` and `column` must be of type string')
        return;
    }

    /**
     * Retrieves a session from the request cookies.
     * @param {Object} req - The HTTP request object.
     * @returns {Promise<Object|null>} The session data or null if not found or expired.
     */
    async getSessionFromRequest(req) {
        const cookies = this.parseCookies(req.headers.cookie);
        const sessionId = cookies[this.cookieName];
        if (!sessionId) return null;
        const session = await DB.reset().select(['*']).from('sessions').where(['id', '=', sessionId]).and(['expires_at', '>', 'NOW()']).query();
        return session.getResults();
    }

    /**
     * Deletes a session from the database using the session ID from cookies.
     * @param {Object} req - The HTTP request object.
     * @returns {Promise<void>}
     */
    async deleteSessionFromRequest(req) {
        const cookies = this.parseCookies(req.headers.cookie);
        const sessionId = cookies[this.cookieName];
        if (!sessionId) return;
        await DB.reset().delete().from('sessions').where(['id', '=', sessionId]).query()
    }

    /**
     * Builds a header to instruct the client to destroy the session cookie.
     * @returns {string} The `Set-Cookie` header that clears the cookie.
     */
    destroyCookieHeader() {
        return `${this.cookieName}=; Max-Age=0; Path=/; HttpOnly`
    }

    /**
     * Returns the singleton instance of the Auth class, initializing it if needed.
     * @param {Object} options - Initialization options for the Auth instance.
     * @returns {Auth} The Auth singleton instance.
     */
    static run(options = {}) {
        if (!this.instance) {
            this.instance = new Auth(options)
        }
        return this.instance;
    }

    /**
     * Resets the singleton Auth instance with new options.
     * @param {Object} options - Initialization options for the new Auth instance.
     * @returns {Auth} The new Auth singleton instance.
     */
    static reset(options = {}) {
        this.instance = new Auth(options)
        return this.instance;
    }

}


module.exports = Auth;