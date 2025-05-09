const DB = require('../modules/database.cjs');


class Queries {

    static async viewAdmins(limit = 10, fields = []) {
        return await DB.run()
            .select(Queries.#generateFields(fields))
            .from('admins')
            .join('INNER JOIN', 'admins_activity')
            .on('admins.aid', 'admins_activity.aid')
            .orderby('created_at', 'DESC')
            .limit(limit)
            .query();
    }

    static async viewAdminsPaginate(page, limit, fields = []) {

        const totalRows = await Queries.viewAdminsCount();

        const totalPages = Math.ceil(totalRows / limit);

        if (page > totalPages) {
            page = totalPages;
        }

        const offset = Queries.#generateOffset(page, limit);

        return await DB.run()
            .select(Queries.#generateFields(fields))
            .from('admins')
            .join('INNER JOIN', 'admins_activity')
            .on('admins.aid', 'admins_activity.aid')
            .orderby('created_at', ' DESC')
            .limit(limit)
            .offset(offset)
            .query();
    }


    static #generateOffset(page, limit) {
        return (page - 1) * limit;;
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
        const query = await DB.run()
            .select(['COUNT(*) AS total'])
            .from('admins')
            .join('INNER JOIN', 'admins_activity')
            .on('admins.aid', 'admins_activity.aid')
            .query();
        return query.getResults()[0].total
    }

    static async searchAdmin(keyword) {
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



}


module.exports = Queries