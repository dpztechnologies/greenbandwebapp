const fs = require("fs");
const { Auth } = require('../middlewares/auth.cjs');
const { view, getFilePath } = require('../helpers/functions.cjs');
const Request = require('../modules/request.cjs');
const { Admin } = require("../controllers/admin.cjs");


class API {

    /**
     * ````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````
     * PRELIMINARY PAGES
     * ```````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````` 
     */
    static getHomePage(req, res) {
        fs.readFile(getFilePath("home"), (err, data) => {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.write(data);
            res.end();
        });
    }

    static getLoginPage(req, res) {
        fs.readFile(getFilePath("login"), (err, data) => {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.write(data);
            res.end();
        });
    }

    static get404Page(req, res) {
        fs.readFile(getFilePath("error404"), (err, data) => {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.write(data);
            res.end();
        });
    }
    static get403Page(req, res) {
        fs.readFile(getFilePath("error403"), (err, data) => {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.write(data);
            res.end();
        });
    }
    static get400Page(req, res) {
        fs.readFile(getFilePath("error400"), (err, data) => {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.write(data);
            res.end();
        });
    }
    static get500Page(req, res) {
        fs.readFile(getFilePath("error500"), (err, data) => {
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
            const email = await Auth.getEmailFromSession(req, res);
            const query = await Admin.getAll(parseInt(limit), [], email);
            return Request.sendResults(query, res);
        } catch (error) {
            return Request.sendErrors(error, res);
        }
    }


    static async getCurrentAdmin(req, res) {
        try {
            const email = await Auth.getEmailFromSession(req, res);
            const query = await Admin.profile(['admins.firstname', 'admins.role'], email, 'email',)
            return Request.sendResults(query, res);
        } catch (error) {
            return Request.sendErrors(error, res);
        }
    }


    static async getAdmin(req, res) {
        try {
            const id = req.query
            const query = await Admin.profile([], id.id, 'aid');
            return Request.sendResults(query, res);
        } catch (error) {
            return Request.sendErrors(error, res);
        }
    }


    static async countAdmins(req, res) {
        try {
            const count = await Admin.count();
            return Request.sendResults(count, res);
        } catch (error) {
            return Request.sendErrors(error, res);
        }
    }


    static async paginateAdmin(req, res) {
        try {
            const { currentPage, limit } = req.query;
            const email = await Auth.getEmailFromSession(req, res);
            const query = await Admin.paginate(currentPage, limit, [], email);
            return Request.sendResults(query, res);
        } catch (error) {
            console.error(error);
            return Request.sendErrors(error, res)
        }
    }


    static async searchAdmin(req, res) {
        try {
            const { keyword } = req.query;
            const query = await Admin.search(keyword);
            return Request.sendResults(query, res);
        } catch (error) {
            console.error(error);
            return Request.sendErrors(error, res);
        }
    }

    static async deleteAdmin(req, res) {
        try {
            const { id } = req.query;
            const email = await Auth.getEmailFromSession(req, res);
            const query = await Admin.delete(id, email);
            return Request.sendResults(query, res);
        } catch (error) {
            console.error(error);
            return Request.sendErrors(error, res);
        }
    }


    static async allowAdminAccess(req, res) {
        try {
            const { id } = req.query;
            const query = await Admin.grantAccess(id, req);
            return Request.sendResponse(query, res);
        } catch (error) {
            console.error(error);
            return Request.sendErrors(error, res)
        }
    }


    static async getAdminProfilePage(req, res) {
        const html = await view('pages/spadmin/show.html');
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(html);
        res.end();
    }

}

module.exports = { API }