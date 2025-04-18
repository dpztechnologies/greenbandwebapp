const Auth = require('../modules/auth.cjs');

const DB = require('../modules/database.cjs');

const Routes = require('../config/routes.cjs');


class Login {
    static async admin(data, res) {
        try {
            const sessionId = await Auth.run().createSession({ from: data.email, column: 'email' });
            res.writeHead(200, {
                'Set-Cookie': Auth.run().buildCookieHeader(sessionId),
                'Content-Type': 'application/json'
            })
            const redirectUrl = await this.#redirectBasedOnRole(data.email, 'email')
            res.end(JSON.stringify({ success: true, message: 'Login was successful', redirect: redirectUrl }))
        } catch (err) {
            res.writeHead(400, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ success: false, message: 'Something unexpected happened', error: err.message }))
        }
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