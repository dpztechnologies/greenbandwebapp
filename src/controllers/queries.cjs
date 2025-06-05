const DB = require('../modules/database.cjs');


class Queries {

    static async viewAdmins(limit = 10, fields = [], forbiddenEmail) {
        return await DB.run()
            .select(Queries.#generateFields(fields))
            .from('admins')
            .join('INNER JOIN', 'admins_activity')
            .on('admins.aid', 'admins_activity.aid')
            .where(['admins.email', '!=', forbiddenEmail])
            .orderby('created_at', 'DESC')
            .limit(limit)
            .query();
    }

    static async viewAdminsPaginate(page, limit, fields = [], forbiddenEmail) {

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
            .where(['admins.email', '!=', forbiddenEmail])
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


    static async viewAdmin(value, fields = [], flag = 'email') {
        switch (flag) {
            case 'email':
                return await DB.run()
                    .select((fields.length > 0) ? fields : ['*'])
                    .from('admins')
                    .join('INNER JOIN', 'admins_activity')
                    .on('admins.aid', 'admins_activity.aid')
                    .where(['admins.email', '=', value])
                    .query();
            case 'aid':
                return await DB.run()
                    .select((fields.length > 0) ? fields : ['*'])
                    .from('admins')
                    .join('INNER JOIN', 'admins_activity')
                    .on('admins.aid', 'admins_activity.aid')
                    .where(['admins.aid', '=', value])
                    .query();
        }

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

    static async deleteAdmin(id, email) {
        await DB.run().delete().from('admins').where(['aid', '=', id]).query();
        await DB.run().delete().from('admins_activity').where(['aid', '=', id]).query();
        return await this.viewAdmins(10, [], email);
    }


    static async allowAdminAccess(id) {
        let query = await DB.run()
            .select(['admins.firstname', 'admins_activity.can_access'])
            .from('admins_activity')
            .join('INNER JOIN', 'admins')
            .on('admins_activity.aid', 'admins.aid')
            .where(['admins_activity.aid', '=', id])
            .query();
        const canAccess = query.getResults()[0].can_access;
        const firstname = query.getResults()[0].firstname;
        if (!Boolean(+canAccess)) {
            query = await DB.run().update('admins_activity').set({ 'can_access': 1 }).where(['admins_activity.aid', '=', id]).query();
            if (query) {
                return { success: true, message: `${firstname} has been granted access successfully` };
            }
            return { success: false, message: `Failed to grant access to ${firstname}` };
        } else {
            query = await DB.run().update('admins_activity').set({ 'can_access': 0 }).where(['admins_activity.aid', '=', id]).query();
            if (query) {
                return { success: true, message: `${firstname}'s access has been revoked successfully` };
            }
            return { success: false, message: `Failed to deactivate admin ${firstname}` };
        }

    }

}


module.exports = Queries