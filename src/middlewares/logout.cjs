const Auth = require('../modules/auth.cjs')

const DB = require('../modules/database.cjs')

class LogoutMiddleware {
    static async exit(req, res) {
        try {
            await Auth.run().deleteSessionFromRequest(req); // ✅ await it
            const clearCookieHeader = Auth.run().destroyCookieHeader();


            res.writeHead(200, {
                'Content-Type': 'application/json',
                'Set-Cookie': clearCookieHeader // ✅ send the cookie
            });

            res.end(JSON.stringify({
                message: 'Logout request successful, you will be redirected shortly'
            }));
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: error.message }));
        }
    }
}

module.exports = {
    Logout: LogoutMiddleware
}