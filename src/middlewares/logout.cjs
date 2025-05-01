const AuthModule = require('../modules/auth.cjs')

const DB = require('../modules/database.cjs')

const { Auth } = require('./auth.cjs')

class LogoutMiddleware {
    static async exit(req, res) {
        try {
            // Get the email and user agent from the request
            const email = await Auth.getEmailFromSession(req, res);

            // Update user activity to offline status for this device (user-agent)
            const query = await DB.run()
                .update('admins_activity')
                .join('JOIN', 'admins')
                .on('admins_activity.aid', 'admins.aid')
                .set({ 'admins_activity.status': 'Offline' })
                .where(['admins.email', '=', email])
                .query();

            if (query) {
                // Delete the session specific to this device
                await AuthModule.run().deleteSessionFromRequest(req);

                // Clear the session cookie
                const clearCookieHeader = AuthModule.run().destroyCookieHeader();

                // Respond with a successful logout message
                res.writeHead(200, {
                    'Content-Type': 'application/json',
                    'Set-Cookie': clearCookieHeader // Send the cookie header to clear it
                });

                res.end(JSON.stringify({
                    message: 'Logout request successful, you will be redirected shortly'
                }));
            } else {
                // If no activity is found for the user, log an error
                console.log("Error: No activity found for this user.");
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'No activity found for the user' }));
            }
        } catch (error) {
            // Catch any unexpected errors and send the response
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: error.message }));
        }
    }
}

module.exports = {
    Logout: LogoutMiddleware
}