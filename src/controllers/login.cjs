const Auth = require('../modules/auth.cjs');

const DB = require('../modules/database.cjs');

const Routes = require('../config/routes.cjs');


class Login {
    static async admin(data, res) {
        try {
            const statusUpdate = await Login.updateStatus(data.email)
            if (statusUpdate) {
                const authInstance = Auth.run({
                    cookieOptions: {
                        httpOnly: true,
                        path: '/',
                        secure: false,
                        sameSite: 'lax',
                        maxAge: 60 * 60 * 1000
                    }
                })
                const sessionId = await authInstance.createSession({ from: data.email, column: 'email' });
                res.writeHead(200, {
                    'Set-Cookie': authInstance.buildCookieHeader(sessionId),
                    'Content-Type': 'application/json'
                })
                const redirectUrl = await this.#redirectBasedOnRole(data.email, 'email')
                res.end(JSON.stringify({ success: true, message: 'Login was successful', redirect: redirectUrl }))
            }
            return;
        } catch (err) {
            res.writeHead(400, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ success: false, message: 'Something unexpected happened', error: err.message }))
        }
    }

    static async updateStatus(email) {
        const query = await DB.reset().select(['aid']).from('admins').where(['email', '=', email]).query();
        const results = query.getResults();
        if (!Array.isArray(results) || results.length === 0) return false;

        const aid = results[0].aid;
        const update = await DB.reset()
            .update('admins_activity')
            .set({ status: 'Online' })
            .where(['aid', '=', aid])
            .query();

        return update ? true : false;
    }



    static async #redirectBasedOnRole(data, column) {
        const result = await DB.reset().select(['role']).from('admins').where([column, '=', data]).query();
        const role = (result.getResults().length > 0) ? result.getResults()[0].role : false;
        if (!role) throw new Error('Failed to resolve admin roles');
        if (Object.hasOwnProperty.call(Routes, role)) {
            return Routes[role]['default'];
        }
        return '';
    }
}

module.exports = Login