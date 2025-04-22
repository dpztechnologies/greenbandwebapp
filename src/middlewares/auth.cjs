const Auth = require('../modules/auth.cjs')

const DB = require('../modules/database.cjs')

const Routes = require('../config/routes.cjs')


class AuthMiddleware {

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
        const session = await Auth.run().getSessionFromRequest(req);
        if (!session) return AuthMiddleware.#reject(res, 'Session not established');
        const email = (typeof session[0] !== 'undefined' && session[0].hasOwnProperty('email')) ? session[0].email : AuthMiddleware.#reject(res, 'Your session has expired');
        const result = await DB.reset()
            .select(['role'])
            .from('admins')
            .where(['email', '=', email])
            .query();

        const roles = await result.getResults();
        if (!roles.length) return AuthMiddleware.#reject(res, 'Role not found');

        const role = roles[0].role;
        const allowedRoutes = Routes[role];

        if (!allowedRoutes || !Object.values(allowedRoutes).includes(req.url)) {
            return AuthMiddleware.#reject(res, 'Access to invalid route');
        }

        next();
    }

    /**
     * Sends a 403 Forbidden response and ends the request.
     *
     * @param {ServerResponse} res - The HTTP response object.
     */
    static #reject(res, msg) {
        res.writeHead(403, { 'Content-Type': 'text/html' });
        res.end(`<h1 style='text-align:center; padding:5rem'>${msg}</h1>`);
        return this;
    }


}


module.exports = {
    Auth: AuthMiddleware
};