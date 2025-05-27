const DB = require("../modules/database.cjs");
const Hashing = require("../modules/hashing.cjs");
const Utilities = require("../modules/utilities.cjs");
const Queries = require("./queries.cjs");
const Auth = require('../modules/auth.cjs');
const Routes = require('../config/routes.cjs');

class Admin {

    static async register(req, res) {
        if (!req.body) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Missing request body' }));
            return;
        }
        const response = await this.processAdminRegistration(req.body);
        return Admin.#sendResponse(response, res);
    }


    static async logout(req, res) {
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
                await Auth.run().deleteSessionFromRequest(req);

                // Clear the session cookie
                const clearCookieHeader = Auth.run().destroyCookieHeader();

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
            console.error(error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: error.message }));
        }
    }

    static async login(req, res) {
        if (!req.body) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Missing request body' }));
            return;
        }
        try {
            const data = req.body;

            // Update user status (if applicable)
            const statusUpdate = await Admin.updateStatus(data.email);

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
                return;
            }
        } catch (err) {
            console.error(err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: 'Something unexpected happened', error: err.message }));
            return;
        }
    }

    static async update(req, res) {
        if (!req.body) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Missing request body' }));
            return;
        }
        const response = await this.processAdminUpdate(req.body);
        return Admin.#sendResponse(response, res);
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


    static async processAdminUpdate(data) {
        const aid = data.aid;
        const firstname = data.firstname;
        const lastname = data.lastname;
        const role = data.role;
        const phone_no = data['phone-no'];
        const email = data.email;

        const query = await DB
            .run().update('admins').set({
                'firstname': firstname,
                'lastname': lastname,
                'email': email,
                'role': role,
                'phone_no': phone_no,
            }).where(['aid', '=', aid]).query();

        if (query) {
            return { success: true, message: 'Admin updated successfully' };
        }
        return { success: false, message: 'Admin update failed' };
    }

    static async processAdminRegistration(data) {
        try {
            data = Utilities.replaceObjectKeysPattern(data, [/-/g], ['_']);
            data.password = await Hashing.hashPassword(data.password)
            data.aid = Utilities.getRandom(1000, 10000);
            delete data.form;
            const count = await Queries.viewAdminsCount();
            data.seq = parseInt(count) + 1;
            const adminsTable = 'admins';
            const adminsActivity = 'admins_activity';
            const insertAdmin = await DB.run().insert().into(adminsTable, data)
            const insertAdminActivity = await DB.run().insert().into(adminsActivity, { 'aid': data.aid, 'can_access': 0 })

            if (!insertAdminActivity) {
                return { success: false, message: `Failed to insert admins activity log in ${adminsActivity}` };
            }

            if (!insertAdmin) {
                return { success: false, message: `Failed to insert admins data in ${adminsTable}` };
            }

            return { success: true, message: 'Account has been created successfully' };

        } catch (err) {
            return { success: false, message: 'Something unexpected happened', error: err.message }
        }
    }


    static #sendResponse(response, res) {
        if (response.success) {
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify(response));
            return;
        } else {
            res.writeHead(400, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify(response));
            return;
        }
    }

}


module.exports = {
    Admin
}