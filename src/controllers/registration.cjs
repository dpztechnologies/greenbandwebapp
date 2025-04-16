const DB = require("../modules/database.cjs");
const { Hashing } = require("../modules/hashing.cjs");
const Utilities = require("../modules/utilities.cjs");

class Registration {

    static async admin(data) {
        try {
            data = Utilities.replaceObjectKeysPattern(data, [/-/g], ['_']);
            data.password = await Hashing.hashPassword(data.password)
            data.uid = Utilities.getRandom(1000, 10000);
            delete data.form;
            const insert = await DB.run().insert().into('admins', data);
            if (insert) {
                return { success: true, message: 'Account has been created successfully' };
            } else {
                return { success: false, message: 'Account creation failed' };
            }
        } catch (err) {
            return { success: false, message: 'Something unexpected happened', error: err.message }
        }

    }
}


module.exports = {
    Register: Registration
}