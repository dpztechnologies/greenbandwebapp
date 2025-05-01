const Auth = require('../modules/auth.cjs')

const DB = require('../modules/database.cjs')

const Routes = require('../config/routes.cjs')

const { match } = require('path-to-regexp');

const crypto = require('crypto')



class AuthMiddleware extends Auth {

    /**
   * Middleware to authenticate a user session and authorize access based on role.
   *
   * Checks if the session is valid and whether the requested route is allowed
   * for the user's role. If not authorized, responds with a 403 error.
   *
   * @param {IncomingMessage} req - The HTTP request object.
   * @param {ServerResponse} res - The HTTP response object.
   * @param {Function} next - The next middleware function.
   * @returns {Promise<boolean|void>} - Returns true if authorized, otherwise ends the response.
   */
    static async authenticate(req, res, next) {
        try {
            // Get the email from the session
            const email = await AuthMiddleware.getEmailFromSession(req, res);

            // Extract user agent from the request headers
            const userAgent = req.headers['user-agent'];

            const deviceToken = crypto.createHash('sha256').update(email + userAgent).digest('hex');

            // Retrieve the session from the database based on email and user-agent
            const query = await DB.run()
                .select(['*'])
                .from('sessions')
                .where(['email', '=', email])
                .and(['device_token', '=', deviceToken])  // Ensure the user-agent matches
                .and(['expires_at', '>', 'NOW()'])   // Ensure the session is not expired
                .query();


            const session = query.getResults();


            // If session is not found or expired, reject the request
            if (!session || !session.length) {
                return AuthMiddleware.#reject(res, 'Session not valid or expired');
            }

            // Retrieve the user's role from the database
            const result = await DB.run()
                .select(['role'])
                .from('admins')
                .where(['email', '=', email])
                .query();

            const roles = await result.getResults();
            if (!roles.length) {
                return AuthMiddleware.#reject(res, 'Role not found');
            }

            const role = roles[0].role;
            const allowedRoutes = Routes[role];

            // Check if the user has permission to access the route
            const isAllowed = Object.values(allowedRoutes).some(routePattern => {
                const matcher = match(routePattern, { decode: decodeURIComponent });
                return matcher(req.url) !== false;
            });

            // If the route is not allowed, reject the request
            if (!isAllowed) {
                return AuthMiddleware.#reject(res, `Access to invalid route ${req.url}`);
            }

            // Proceed to the next middleware if everything is valid
            next();
        } catch (err) {
            console.error(`Something unexpected happened: ${err}`)
        }
    }


    /**
     * Sends a 403 Forbidden response and ends the request.
     *
     * @param {ServerResponse} res - The HTTP response object.
     */
    static #reject(res, msg) {
        res.writeHead(403, { 'Content-Type': 'text/json' });
        res.end(`${msg}`);
        return this;
    }


    static async getEmailFromSession(req, res) {
        try {
            const session = await Auth.run().getSessionFromRequest(req);
            // If no session is found, reject the request
            if (!session || session.length === 0) {
                return AuthMiddleware.#reject(res, 'Session not established');
            }
            // Check if the session has expired by comparing with the expiration time
            const expiresAt = session[0].expires_at;
            if (new Date(expiresAt) < new Date()) {
                return AuthMiddleware.#reject(res, 'Your session has expired');
            }

            // If email exists, return it, otherwise reject
            const email = session[0].email;
            if (!email) {
                return AuthMiddleware.#reject(res, 'Your session has expired');
            }

            return email;
        } catch (err) {
            console.error('Error fetching email from session:', err);
        }
    }


}


module.exports = {
    Auth: AuthMiddleware
};