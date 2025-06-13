const Utilities = require("../modules/utilities.cjs");
const DB = require("../modules/database.cjs");

class Events {
    static async register(email, type, desc) {
        const result = await Events.#fetchActivityObject(email);

        // New log entry format
        const logEntry = {
            date: Utilities.getDateTime(),               // e.g., "12/06/2025"
            time: Utilities.getDateTime("g:iA"),         // e.g., "4:30PM"
            type: type,                                  // e.g., "login"
            desc: desc                                   // e.g., "Logged in successfully"
        };

        // Safely parse existing activity
        let activity = [];
        try {
            const parsed = JSON.parse(result.activity);
            if (Array.isArray(parsed)) {
                activity = parsed;
            } else {
                console.warn("Activity log was not an array. Resetting to empty.");
            }
        } catch (err) {
            console.warn("Failed to parse activity JSON. Resetting to empty.");
        }

        // Append the new entry
        activity.push(logEntry);

        // Update database
        const updated = JSON.stringify(activity);
        const query = await DB.run()
            .update('admins_activity')
            .set({ activity: updated })
            .where(['admins_activity.aid', '=', result['aid']])
            .query();

        return !!query;
    }

    static async #fetchActivityObject(email) {
        const query = await DB.run()
            .select(['admins_activity.activity', 'admins.aid'])
            .from('admins_activity')
            .join('INNER JOIN', 'admins')
            .on('admins_activity.aid', 'admins.aid')
            .where(['admins.email', '=', email])
            .query();

        const result = query.getResults()[0];
        if (!result) throw new Error(`Admin activity not found for: ${email}`);

        return result;
    }
}


module.exports = Events;