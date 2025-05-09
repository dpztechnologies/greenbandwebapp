const fs = require("fs");
const utilities = require("../modules/utilities.cjs");
const { Auth } = require('../middlewares/auth.cjs');
const Query = require('../controllers/queries.cjs');
const { view } = require('../helpers/functions.cjs');


class APIAccess {

    /**
     * ````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````
     * PRELIMINARY PAGES
     * ```````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````` 
     */
    static getHomePage(req, res) {
        fs.readFile(utilities.getFilePath("home"), (err, data) => {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.write(data);
            res.end();
        });
    }

    static getLoginPage(req, res) {
        fs.readFile(utilities.getFilePath("login"), (err, data) => {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.write(data);
            res.end();
        });
    }

    /**
     * ````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````
     * SUPER ADMIN
     * ```````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````` 
     */
    static async getAdminsPage(req, res) {
        const html = await view('pages/spadmin/admins.html');
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(html);
        res.end();
    }

    static async getAdmins(req, res) {
        try {
            const { limit } = req.query
            const query = await Query.viewAdmins(parseInt(limit));
            return utilities.sendResults(query, res);
        } catch (error) {
            return utilities.sendErrors(error, res);
        }
    }


    static async getAdmin(req, res) {
        try {
            const email = await Auth.getEmailFromSession(req, res);
            const query = await Query.viewAdmin(email, ['admins.firstname', 'admins.role'])
            return utilities.sendResults(query, res);
        } catch (error) {
            return utilities.sendErrors(error, res);
        }
    }


    static async getAdminsCount(req, res) {
        try {
            const count = await Query.viewAdminsCount();
            return utilities.sendResults(count, res);
        } catch (error) {
            return utilities.sendErrors(error, res);
        }
    }


    static async getAdminsPaginate(req, res) {
        try {
            const { currentPage, limit } = req.query;
            const query = await Query.viewAdminsPaginate(currentPage, limit);
            return utilities.sendResults(query, res);
        } catch (error) {
            console.error(error);
            return utilities.sendErrors(error, res)
        }
    }


    static async getAdminSearch(req, res) {
        try {
            const { keyword } = req.query;
            const query = await Query.searchAdmin(keyword);
            return utilities.sendResults(query, res);
        } catch (error) {
            console.error(error);
            return utilities.sendErrors(error, res);
        }
    }

}

module.exports = { APIAccess }