const { Auth } = require('../middlewares/auth.cjs');
const DB = require('../modules/database.cjs');


class Queries {

    static async viewAdmins(limit = 10, fields = []) {
        return await DB.run()
            .select(Queries.#generateFields(fields))
            .from('admins')
            .join('INNER JOIN', 'admins_activity')
            .on('admins.aid', 'admins_activity.aid')
            .orderby('admins.id', 'DESC')
            .limit(limit)
            .query();
    }

    static async viewAdminsPaginate(page, limit, fields = []) {
        const offset = Queries.#generateOffset(page, limit);
        return await DB.run()
            .select(Queries.#generateFields(fields))
            .join('INNER JOIN', 'admins_activity')
            .on('admins.aid', 'admins_activity.aid')
            .orderby('admins.id', 'DESC')
            .limit(limit)
            .offset(offset)
            .query();
    }


    static #generateOffset(page, limit) {
        const offset = (page - 1) * limit;
        return offset;
    }

    static #generateFields(fields = []) {
        return (fields.length > 0) ? fields : ['*']
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


    static async viewAdminsCount() {
        return await DB.run()
            .count('admins');
    }
}


module.exports = Queries