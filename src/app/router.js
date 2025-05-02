const { routeProvider } = require("../modules/routes.cjs");
const fs = require("fs");
const utilities = require("../modules/utilities.cjs");
const { Validator } = require('../middlewares/validate.cjs');
const { Sanitizer } = require('../middlewares/sanitize.cjs');
const { Register } = require("../controllers/registration.cjs");
const Login = require("../controllers/login.cjs");
const { Auth } = require('../middlewares/auth.cjs');
const Query = require('../controllers/queries.cjs');
const { Logout } = require("../middlewares/logout.cjs");
const File = require("../modules/template.cjs");
const { view } = require('../helpers/functions.cjs');
const { API } = require('./api.js')
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



app.get('/super-admin/admins', [Auth.authenticate], async (req, res,) => {
    return await API.showAdmins(req, res)
})


app.get('/view-admins/:limit', [Auth.authenticate, Sanitizer.sanitize], async (req, res) => {
    return await API.getAdmins(req, res)
});


app.get('/admins/count', [Auth.authenticate, Sanitizer.sanitize], async (req, res) => {
    return await API.getAdminsCount(req, res);
});

app.get('/view-admin', [Auth.authenticate], async (req, res) => {
    return await API.getAdmin(req, res)
})







/**
 * `````````````````````````````````````````````````````````````````````````````````````````````````````````
 * POST REQUESTS
 * `````````````````````````````````````````````````````````````````````````````````````````````````````````
 */


app.post("/process-login", [Sanitizer.sanitize, Validator.validate], async (req, res) => {
    return await Login.admin(req, res);
})

app.post("/process-registration", [Sanitizer.sanitize, Validator.validate], async (req, res) => {
    return Register.admin(req, res);
})


app.post('/logout', [Auth.authenticate], async (req, res) => {
    return Logout.exit(req, res);
});

app.post('/process')






/**
 * `````````````````````````````````````````````````````````````````````````````````````````````````````````
 * RUN SERVER
 * `````````````````````````````````````````````````````````````````````````````````````````````````````````
 */

app.start();
