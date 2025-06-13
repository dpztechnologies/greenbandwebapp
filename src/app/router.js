const { routeProvider } = require("../modules/routes.cjs");
const { Validator } = require('../middlewares/validate.cjs');
const { Sanitizer } = require('../middlewares/sanitize.cjs');
const { Admin } = require("../controllers/admin.cjs");
const { Auth } = require('../middlewares/auth.cjs');
const { API } = require('./api.cjs');
const { getSuperAdminRoute } = require("../helpers/functions.cjs");
const app = routeProvider();


app.use((req, res, next) => {
    console.log(`Incoming requests: [${req.method}] ${req.url}`);
    next();
})

/**
 * `````````````````````````````````````````````````````````````````````````````````````````````````````````
 * GET REQUESTS
 * `````````````````````````````````````````````````````````````````````````````````````````````````````````
 */



/**
 * ````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````
 * PRELIMINARIES
 * ```````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````` 
 */


/**
 * Home/Landing page
 */

app.get("/", [], (req, res) => {
    return API.getHomePage(req, res)
});

/**
 * Login page
 */
app.get("/login", [], (req, res) => {
    return API.getLoginPage(req, res);
});

/**
 * Error 404 page
 */
app.get("/404", [], (req, res) => {
    return API.get404Page(req, res);
});
/**
 * Error 403 page
 */
app.get("/403", [], (req, res) => {
    return API.get403Page(req, res);
});
/**
 * Error 400 page
 */
app.get("/400", [], (req, res) => {
    return API.get400Page(req, res);
});
/**
 * Error 500 page
 */
app.get("/500", [], (req, res) => {
    return API.get500Page(req, res);
});

/**
 * ````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````
 * SUPER ADMIN
 * ```````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````` 
 */


app.get(getSuperAdminRoute('default'), [Auth.authenticate], async (req, res,) => {
    return await API.getAdminsPage(req, res)
})


app.get(getSuperAdminRoute('view-admins'), [Auth.authenticate, Sanitizer.sanitize], async (req, res) => {
    return await API.getAdmins(req, res)
});


app.get(getSuperAdminRoute('admin-count'), [Auth.authenticate, Sanitizer.sanitize], async (req, res) => {
    return await API.countAdmins(req, res);
});

app.get(getSuperAdminRoute('current-admin'), [Auth.authenticate], async (req, res) => {
    return await API.getCurrentAdmin(req, res)
})

app.get(getSuperAdminRoute('view-admin'), [Auth.authenticate], async (req, res) => {
    return await API.getAdmin(req, res)
})

app.get(getSuperAdminRoute('admins-paginate'), [Auth.authenticate, Sanitizer.sanitize], async (req, res) => {
    return await API.paginateAdmin(req, res);
})


app.get(getSuperAdminRoute('admins-search'), [Auth.authenticate, Sanitizer.sanitize], async (req, res) => {
    return await API.searchAdmin(req, res);
})

app.get(getSuperAdminRoute('delete-admin'), [Auth.authenticate, Sanitizer.sanitize], async (req, res) => {
    return await API.deleteAdmin(req, res);
})

app.get(getSuperAdminRoute('admin-access'), [Auth.authenticate, Sanitizer.sanitize], async (req, res) => {
    return await API.allowAdminAccess(req, res);
})

app.get(getSuperAdminRoute('show-admin'), [Auth.authenticate, Sanitizer.sanitize], async (req, res) => {
    return await API.getAdminProfilePage(req, res);
})

app.get(getSuperAdminRoute('show-admin-profile'), [Auth.authenticate, Sanitizer.sanitize], async (req, res) => {
    return await API.getAdmin(req, res);
})




/**
 * `````````````````````````````````````````````````````````````````````````````````````````````````````````
 * POST REQUESTS
 * `````````````````````````````````````````````````````````````````````````````````````````````````````````
 */


app.post("/process/admin/login", [Sanitizer.sanitize, Validator.validate], async (req, res) => {
    return await Admin.login(req, res);
})

app.post("/process/admin/registration", [Sanitizer.sanitize, Validator.validate], async (req, res) => {
    return Admin.register(req, res);
})


app.post("/process/admin/update", [Sanitizer.sanitize, Validator.validate], async (req, res) => {
    return Admin.update(req, res);
})




app.post('/logout', [Auth.authenticate], async (req, res) => {
    return Admin.logout(req, res);
});







/**
 * `````````````````````````````````````````````````````````````````````````````````````````````````````````
 * RUN SERVER
 * `````````````````````````````````````````````````````````````````````````````````````````````````````````
 */

app.start();
