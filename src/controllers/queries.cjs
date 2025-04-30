const { Auth } = require('../middlewares/auth.cjs');
const DB = require('../modules/database.cjs');


class Queries {

    static async viewAdmins(limit = 10, fields = []) {
        return await DB.run()
            .select((fields.length > 0) ? fields : ['*'])
            .from('admins')
            .join('INNER JOIN', 'admins_activity')
            .on('admins.aid', 'admins_activity.aid')
            .orderby('admins.id', 'DESC')
            .limit(limit)
            .query();
    }

    static async viewAdmin(email, fields = []) {
        return await DB.run()
            .select((fields.length > 0) ? fields : ['*'])
            .from('admins')
            .join('INNER JOIN', 'admins_activity')
            .on('admins.aid', 'admins_activity.aid')
            .where(['admins.email', '=', email])
            .query();
    }
}


module.exports = Queries