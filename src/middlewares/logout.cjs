const AuthModule = require('../modules/auth.cjs')

const DB = require('../modules/database.cjs')

const { Auth } = require('./auth.cjs')

class LogoutMiddleware {
    static async exit(req, res) {
        try {

            const email = await Auth.getEmailFromSession(req, res)
            const query = await DB.run()
                .update('admins_activity')
                .join('JOIN', 'admins')
                .on('admins_activity.aid', 'admins.aid')
                .set({ 'admins_activity.status': 'offline' })
                .where(['admins.email', '=', email])
                .query();
            if (query) {
                await AuthModule.run().deleteSessionFromRequest(req); // ✅ await it
                const clearCookieHeader = AuthModule.run().destroyCookieHeader();

                res.writeHead(200, {
                    'Content-Type': 'application/json',
                    'Set-Cookie': clearCookieHeader // ✅ send the cookie
                });

                res.end(JSON.stringify({
                    message: 'Logout request successful, you will be redirected shortly'
                }));
            } else {
                console.log("Error")
            }
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: error.message }));
        }
    }
}

module.exports = {
    Logout: LogoutMiddleware
}