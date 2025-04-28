const DB = require("../modules/database.cjs");
const Hashing = require("../modules/hashing.cjs");
const Utilities = require("../modules/utilities.cjs");

class Registration {

    static async processAdmin(data) {
        try {
            data = Utilities.replaceObjectKeysPattern(data, [/-/g], ['_']);
            data.password = await Hashing.hashPassword(data.password)
            data.aid = Utilities.getRandom(1000, 10000);
            delete data.form;

            const adminsTable = 'admins';
            const adminsActivity = 'admins_activity';
            const insertAdmin = await DB.run().insert().into(adminsTable, data)
            const insertAdminActivity = await DB.run().insert().into(adminsActivity, { 'aid': data.aid })

            if (!insertAdminActivity) {
                return { success: false, message: `Failed to insert admins activity log in ${adminsActivity}` };
            }

            if (!insertAdmin) {
                return { success: false, message: `Failed to insert admins data in ${adminsActivity}` };
            }

            return { success: true, message: 'Account has been created successfully' };

        } catch (err) {
            return { success: false, message: 'Something unexpected happened', error: err.message }
        }
    }

    static async admin(req, res) {
        if (!req.body) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Missing request body' }));
            return;
        }
        const response = await this.processAdmin(req.body);
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
    Register: Registration
}