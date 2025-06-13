const DB = require("../modules/database.cjs");
const Hashing = require("../modules/hashing.cjs");
const Utilities = require("../modules/utilities.cjs");
const Auth = require('../modules/auth.cjs');
const Routes = require('../config/routes.cjs');
const Events = require('./events.cjs');
const Request = require("../modules/request.cjs");
const Queries = require("./queries.cjs");

class Admin {

    static async register(req, res) {
        if (!req.body) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Missing request body' }));
            return;
        }
        const email = await Auth.getEmailFromSession(req, res);
        const response = await this.processAdminRegistration(email, req.body);
        return Request.sendResponse(response, res, 'form');
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
                const [ev, desc] = ['logout', `Logged out at ${Utilities.getDateTime('g:iA').toLowerCase()}`]
                const registerEvent = await Events.register(email, ev, desc);
                if (registerEvent) {
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
                    res.writeHead(403, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, message: `Failed to register event ${ev}` }));
                }
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

            // Redirect based on the user's role
            const redirectResponse = await this.#redirectBasedOnRoleAndStatus(data.email, 'email');
            const redirectData = JSON.parse(redirectResponse);

            // Send response with success and redirect URL

            switch (redirectData.status) {
                case 200:
                    // Update user status (if applicable)
                    const statusUpdate = await Admin.updateStatus(data.email);
                    const [ev, desc] = ['login', `Logged in at ${Utilities.getDateTime('g:iA').toLowerCase()}`]
                    if (statusUpdate) {
                        const registerEvent = await Events.register(data.email, ev, desc)
                        if (registerEvent) {
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
                            res.end(JSON.stringify({ success: true, message: 'Login request successful', redirect: redirectData.url }));
                            return;
                        } else {
                            res.writeHead(403, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ success: false, message: `Failed to register event ${ev}` }));
                        }
                    } else {
                        res.writeHead(403, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: false, message: 'Failed to update admin login status' }));
                    }
                case 403:
                    res.writeHead(403, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, message: redirectData.message }));
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
        const email = await Auth.getEmailFromSession(req, res);
        const response = await this.processAdminUpdate(email, req.body);
        return Request.sendResponse(response, res, 'form');
    }

    static async updateStatus(email) {
        const query = await DB.run().select(['aid']).from('admins').where(['email', '=', email]).query();
        const results = query.getResults();
        if (!Array.isArray(results) || results.length === 0) return false;

        const aid = results[0].aid;
        const update = await DB.run()
            .update('admins_activity')
            .set({ status: 'Online', last_seen: new Date().toISOString().slice(0, 19).replace('T', ' ') })
            .where(['aid', '=', aid])
            .query();

        return update ? true : false;
    }

    static async delete(id, email) {
        const query = await DB.run().select(['firstname']).from('admins').where(['admins.aid', '=', id]).query();
        const firstname = query.getResults()[0]['firstname'];
        const [ev, desc] = ['Admin account deletion', `Deleted ${firstname}'s account on ${Utilities.getDateTime()} at ${Utilities.getDateTime('g:iA').toLowerCase()}`,]
        const registerEvent = await Events.register(email, ev, desc);
        if (registerEvent) {
            await DB.run().delete().from('admins').where(['aid', '=', id]).query();
            await DB.run().delete().from('admins_activity').where(['aid', '=', id]).query();
            return Admin.getAll(8, [], email)
        } else {
            return false
        }
    }

    static async grantAccess(id, req) {
        let query = await DB.run()
            .select(['admins.firstname', 'admins_activity.can_access'])
            .from('admins_activity')
            .join('INNER JOIN', 'admins')
            .on('admins_activity.aid', 'admins.aid')
            .where(['admins_activity.aid', '=', id])
            .query();
        const canAccess = query.getResults()[0].can_access;
        const firstname = query.getResults()[0].firstname;
        const email = await Auth.getEmailFromSession(req)
        if (!Boolean(+canAccess)) {
            const [ev, desc] = ['Grant Admin Access', `Granted access to admin ${firstname}`]
            const registerEvent = await Events.register(email, ev, desc);
            if (registerEvent) {
                query = await DB.run().update('admins_activity').set({ 'can_access': 1 }).where(['admins_activity.aid', '=', id]).query();
                if (query) {
                    return { success: true, message: `${firstname} has been granted access successfully` };
                }
                return { success: false, message: `Failed to grant access to ${firstname}` };
            }
            return { success: false, message: `Failed to register event grant admin ${firstname} access` };
        } else {
            const [ev, desc] = ['Revoke Admin Access', `Revoked access to admin ${firstname}`]
            const registerEvent = await Events.register(email, ev, desc);
            if (registerEvent) {
                query = await DB.run().update('admins_activity').set({ 'can_access': 0 }).where(['admins_activity.aid', '=', id]).query();
                if (query) {
                    return { success: true, message: `${firstname}'s access has been revoked successfully` };
                }
                return { success: false, message: `Failed to deactivate admin ${firstname}` };
            }
            return { success: false, message: `Failed to register event deactivate admin ${firstname}` };
        }
    }

    static async search(keyword) {
        return await DB.run()
            .select(['admins.*', 'admins_activity.*'])
            .from('admins')
            .join('INNER JOIN', 'admins_activity')
            .on('admins.aid', 'admins_activity.aid')
            .matchAgainst(['firstname', 'lastname', 'email'], keyword)
            .orderby('relevance', 'DESC')
            .limit(20)
            .query();

    }

    static async count() {
        const query = await DB.run()
            .select(['COUNT(*) AS total'])
            .from('admins')
            .join('INNER JOIN', 'admins_activity')
            .on('admins.aid', 'admins_activity.aid')
            .query();
        return query.getResults()[0].total
    }

    static async profile(fields = [], identifier, flag = 'email') {
        switch (flag) {
            case 'email':
                return await DB.run()
                    .select((fields.length > 0) ? fields : ['*'])
                    .from('admins')
                    .join('INNER JOIN', 'admins_activity')
                    .on('admins.aid', 'admins_activity.aid')
                    .where(['admins.email', '=', identifier])
                    .query();
            case 'aid':
                return await DB.run()
                    .select((fields.length > 0) ? fields : ['*'])
                    .from('admins')
                    .join('INNER JOIN', 'admins_activity')
                    .on('admins.aid', 'admins_activity.aid')
                    .where(['admins.aid', '=', identifier])
                    .query();
        }

    }

    static async paginate(page, limit, fields = [], forbiddenEmail) {

        const totalRows = await Queries.viewAdminsCount();

        const totalPages = Math.ceil(totalRows / limit);

        if (page > totalPages) {
            page = totalPages;
        }

        const offset = Queries.generateOffset(page, limit);

        return await DB.run()
            .select(Queries.generateFields(fields))
            .from('admins')
            .join('INNER JOIN', 'admins_activity')
            .on('admins.aid', 'admins_activity.aid')
            .where(['admins.email', '!=', forbiddenEmail])
            .orderby('created_at', ' DESC')
            .limit(limit)
            .offset(offset)
            .query();
    }

    static async getAll(limit = 10, fields = [], forbiddenEmail) {
        return await DB.run()
            .select(Queries.generateFields(fields))
            .from('admins')
            .join('INNER JOIN', 'admins_activity')
            .on('admins.aid', 'admins_activity.aid')
            .where(['admins.email', '!=', forbiddenEmail])
            .orderby('created_at', 'DESC')
            .limit(limit)
            .query();
    }







    /**
     * ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * PROCESSES
     * ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    static async processAdminUpdate(email, data) {
        const query = await DB
            .run().update('admins').set({
                'firstname': data.firstname,
                'lastname': data.lastname,
                'email': data.email,
                'role': data.role,
                'phone_no': data['phone-no'],
            }).where(['aid', '=', data.aid]).query();
        const results = await DB.run().select(['firstname', 'role']).from('admins').where(['admins.aid', '=', data.aid]).query()
        const name = results.getResults()[0]['firstname'];
        if (query) {
            const [ev, desc] = ['Admin account update', `Updated admin <a class="text-decoration-none" href="/super-admin/admins/show?aid=${data.aid}">${name}</a>`]
            const registerEvent = await Events.register(email, ev, desc);
            if (registerEvent) {
                return { success: true, message: 'Admin updated successfully' };
            }
        }
        return { success: false, message: 'Admin update failed' };
    }

    static async processAdminRegistration(email, data) {
        try {
            data = Utilities.replaceObjectKeysPattern(data, [/-/g], ['_']);
            data.password = await Hashing.hashPassword(data.password)
            data.aid = Utilities.getRandom(1000, 10000);
            delete data.form;
            const adminsTable = 'admins';
            const adminsActivityTable = 'admins_activity';
            const insertAdminActivity = await DB.run().insert().into(adminsActivityTable, { 'aid': data.aid, 'can_access': 0, 'activity': `${JSON.stringify({})}` })
            const insertAdmin = await DB.run().insert().into(adminsTable, data)

            if (!insertAdminActivity) {
                return { success: false, message: `Failed to insert admins activity log in ${adminsActivityTable}` };
            } else {
                if (!insertAdmin) {
                    return { success: false, message: `Failed to insert admins data in ${adminsTable}` };
                } else {
                    const [ev, desc] = ['Admin account creation', `Created admin ${data.firstname}'s account on ${Utilities.getDateTime()} at ${Utilities.getDateTime('g:iA').toLowerCase()}`,]
                    const registerEvent = await Events.register(email, ev, desc);
                    if (registerEvent) {
                        return { success: true, message: `${data.firstname}'s account has been registered successfully` };
                    }
                    return { success: false, message: `Account created but failed to update admin activity` };
                }
            }
        } catch (err) {
            return { success: false, message: 'Something unexpected happened', error: err.message }
        }
    }

    /**
     * ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * UTILITIES
     * ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    static async #redirectBasedOnRoleAndStatus(data, column) {
        const result = await DB.run().select(['admins.role', 'admins_activity.can_access'])
            .from('admins')
            .join('INNER JOIN', 'admins_activity')
            .on('admins.aid', 'admins_activity.aid')
            .where([column, '=', data]).query();
        const role = (result.getResults().length > 0) ? result.getResults()[0].role : false;
        const canAccess = (result.getResults().length > 0) ? result.getResults()[0].can_access : false;
        if (!role) {
            let message = 'Invalid account type'
            return JSON.stringify({ status: 403, message: message });
        }
        if (!Boolean(+canAccess)) {
            let message = 'Your account has not yet been approved. Kindly contact the administrator'
            return JSON.stringify({ status: 403, message: message });
        }
        if (Object.hasOwnProperty.call(Routes, role)) {
            return JSON.stringify({ status: 200, url: Routes[role]['default'] });
        }
        return '';
    }



}


module.exports = {
    Admin
}