const { routeProvider } = require("../modules/routes.cjs");
const { Validator } = require('../middlewares/validate.cjs');
const { Sanitizer } = require('../middlewares/sanitize.cjs');
const { Admin } = require("../controllers/admin.cjs");
const { Auth } = require('../middlewares/auth.cjs');
const { APIAccess } = require('./apiaccess.cjs')
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
    return APIAccess.getHomePage(req, res)
});

/**
 * Login page
 */
app.get("/login", [], (req, res) => {
    return APIAccess.getLoginPage(req, res);
});

/**
 * Error 404 page
 */
app.get("/404", [], (req, res) => {
    return APIAccess.get404Page(req, res);
});
/**
 * Error 403 page
 */
app.get("/403", [], (req, res) => {
    return APIAccess.get403Page(req, res);
});
/**
 * Error 400 page
 */
app.get("/400", [], (req, res) => {
    return APIAccess.get400Page(req, res);
});
/**
 * Error 500 page
 */
app.get("/500", [], (req, res) => {
    return APIAccess.get500Page(req, res);
});

/**
 * ````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````
 * SUPER ADMIN
 * ```````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````` 
 */


app.get('/super-admin/admins', [Auth.authenticate], async (req, res,) => {
    return await APIAccess.getAdminsPage(req, res)
})


app.get('/view/admins', [Auth.authenticate, Sanitizer.sanitize], async (req, res) => {
    return await APIAccess.getAdmins(req, res)
});


app.get('/admins/count', [Auth.authenticate, Sanitizer.sanitize], async (req, res) => {
    return await APIAccess.getAdminsCount(req, res);
});

app.get('/view/current-admin', [Auth.authenticate], async (req, res) => {
    return await APIAccess.getCurrentAdmin(req, res)
})

app.get('/view/admin', [Auth.authenticate], async (req, res) => {
    return await APIAccess.getAdmin(req, res)
})

app.get('/admins/paginate', [Auth.authenticate, Sanitizer.sanitize], async (req, res) => {
    return await APIAccess.getAdminsPaginate(req, res);
})


app.get('/admins/search', [Auth.authenticate, Sanitizer.sanitize], async (req, res) => {
    return await APIAccess.getAdminSearch(req, res);
})

app.get('/admins/delete', [Auth.authenticate, Sanitizer.sanitize], async (req, res) => {
    return await APIAccess.deleteAdmin(req, res);
})

app.get('/admins/allow-access', [Auth.authenticate, Sanitizer.sanitize], async (req, res) => {
    return await APIAccess.allowAdminAccess(req, res);
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
