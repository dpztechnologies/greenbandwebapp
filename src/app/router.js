const { routeProvider } = require("../modules/routes.cjs");
const { Validator } = require('../middlewares/validate.cjs');
const { Sanitizer } = require('../middlewares/sanitize.cjs');
const { Register } = require("../controllers/registration.cjs");
const Login = require("../controllers/login.cjs");
const { Auth } = require('../middlewares/auth.cjs');
const { Logout } = require("../middlewares/logout.cjs");
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

app.get('/view/admin', [Auth.authenticate], async (req, res) => {
    return await APIAccess.getAdmin(req, res)
})

app.get('/admins/paginate', [Auth.authenticate, Sanitizer.sanitize], async (req, res) => {
    return await APIAccess.getAdminsPaginate(req, res);
})


app.get('/admins/search', [Auth.authenticate, Sanitizer.sanitize], async (req, res) => {
    return await APIAccess.getAdminSearch(req, res);
})






/**
 * `````````````````````````````````````````````````````````````````````````````````````````````````````````
 * POST REQUESTS
 * `````````````````````````````````````````````````````````````````````````````````````````````````````````
 */


app.post("/process/login", [Sanitizer.sanitize, Validator.validate], async (req, res) => {
    return await Login.admin(req, res);
})

app.post("/process/admin/registration", [Sanitizer.sanitize, Validator.validate], async (req, res) => {
    return Register.admin(req, res);
})


app.post('/logout', [Auth.authenticate], async (req, res) => {
    return Logout.exit(req, res);
});







/**
 * `````````````````````````````````````````````````````````````````````````````````````````````````````````
 * RUN SERVER
 * `````````````````````````````````````````````````````````````````````````````````````````````````````````
 */

app.start();
