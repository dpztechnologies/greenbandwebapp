const Auth = require('../modules/auth.cjs');

const DB = require('../modules/database.cjs');

const Routes = require('../config/routes.cjs');


class Login {

    static async admin(req, res) {
        if (!req.body) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Missing request body' }));
            return;
        }
        try {
            const data = req.body;

            // Update user status (if applicable)
            const statusUpdate = await Login.updateStatus(data.email);

            if (statusUpdate) {
                const authInstance = Auth.run({
                    cookieOptions: {
                        httpOnly: true,
                        path: '/',
                        secure: false, // Change to `true` in production
                        sameSite: 'lax',
                        maxAge: 60 * 60 * 1000
                    }
                });

                // Extract user agent from the request headers
                const userAgent = req.headers['user-agent'];

                // Create a session for the user, passing the email and user-agent for unique device identification
                const sessionId = await authInstance.createSession({
                    from: data.email,
                    column: 'email',
                    userAgent: userAgent
                });

                // Set the cookie header with the generated session ID
                res.writeHead(200, {
                    'Set-Cookie': authInstance.buildCookieHeader(sessionId),
                    'Content-Type': 'application/json'
                });

                // Redirect based on the user's role
                const redirectUrl = await this.#redirectBasedOnRole(data.email, 'email');

                // Send response with success and redirect URL
                res.end(JSON.stringify({ success: true, message: 'Login request successful', redirect: redirectUrl }));
            }
            return;
        } catch (err) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: 'Something unexpected happened', error: err.message }));
        }
    }


    static async updateStatus(email) {
        const query = await DB.run().select(['aid']).from('admins').where(['email', '=', email]).query();
        const results = query.getResults();
        if (!Array.isArray(results) || results.length === 0) return false;

        const aid = results[0].aid;
        const update = await DB.run()
            .update('admins_activity')
            .set({ status: 'Online' })
            .where(['aid', '=', aid])
            .query();

        return update ? true : false;
    }



    static async #redirectBasedOnRole(data, column) {
        const result = await DB.run().select(['role']).from('admins').where([column, '=', data]).query();
        const role = (result.getResults().length > 0) ? result.getResults()[0].role : false;
        if (!role) throw new Error('Failed to resolve admin roles');
        if (Object.hasOwnProperty.call(Routes, role)) {
            return Routes[role]['default'];
        }
        return '';
    }
}

module.exports = Login