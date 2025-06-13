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
            const email = await AuthMiddleware.getEmailFromSession(req, res);
            const userAgent = req.headers['user-agent'];
            const deviceToken = crypto.createHash('sha256').update(email + userAgent).digest('hex');

            const query = await DB.run()
                .select(['*'])
                .from('sessions')
                .where(['email', '=', email])
                .and(['device_token', '=', deviceToken])
                .and(['expires_at', '>', 'NOW()'])
                .query();

            const session = query.getResults();
            if (!session || !session.length) {
                return Auth.redirect(res, '/login');
            }

            const result = await DB.run()
                .select(['admins.role', 'admins_activity.can_access'])
                .from('admins')
                .join("INNER JOIN", 'admins_activity')
                .on('admins.aid', 'admins_activity.aid')
                .where(['email', '=', email])
                .query();

            const roles = await result.getResults();
            if (!roles.length) {
                return Auth.redirect(res, '/login');
            }

            const role = roles[0].role;
            const canAccess = roles[0].can_access
            const allowedRoutes = Routes[role];

            // ✅ FIXED: Extract just the pathname for matching
            const pathname = new URL(req.url, `http://${req.headers.host}`).pathname;

            const isAllowed = Object.values(allowedRoutes).some(routePattern => {
                const matcher = match(routePattern, { decode: decodeURIComponent });
                return matcher(pathname) !== false;
            });

            if (!isAllowed) {
                return Auth.redirect(res, '/login')
            }

            if (!Boolean(canAccess)) {
                return Auth.redirect(res, '/login')
            }

            next();
        } catch (err) {
            console.error(`Something unexpected happened: ${err}`)
        }
    }
}


module.exports = {
    Auth: AuthMiddleware
};