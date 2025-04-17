const crypto = require('crypto')
const DB = require('./database.cjs');

class Auth {
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

    generateSessionId() {
        return crypto.randomBytes(32).toString('hex');
    }

    parseCookies(cookieHeader) {
        const cookies = {};
        cookieHeader?.split(';').forEach(cookie => {
            const [key, value] = cookie.trim().split('=');
            cookies[key] = decodeURIComponent(value);
        });
        return cookies;
    }

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


    async createSession(username) {
        const sessionId = this.generateSessionId();
        const expires = new Date(Date.now() + this.cookieOptions.maxAge);
        await DB.run().insert().into('sessions', { id: sessionId, username: username, expires_at: expires });
        return sessionId;
    }

    async getSessionFromRequest(req) {
        const cookies = this.parseCookies(req.headers.cookie);
        const sessionId = cookies[this.cookieName];
        if (!sessionId) return null; //throw something
        const session = await DB.run().select(['*']).from('sessions').where(['id', '=', sessionId]).and(['expires_at', '>', 'NOW()']).query();
        return session.getResults();
    }


    async deleteSessionFromRequest(req) {
        const cookies = this.parseCookies(req.headers.cookies);
        const sessionId = cookies[this.cookieName];
        if (!sessionId) return; //Throw something
        await (DB.run().delete().from('sessions').where(['id', '=', sessionId]).query())
    }


    destroyCookieHeader() {
        return `${this, this.cookieName}=; Max-Age=0; Path=/; HttpOnly`
    }

}

module.exports = Auth;