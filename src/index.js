const { routeProvider } = require("./modules/routes.cjs");
const fs = require("fs");
const utilities = require("./modules/utilities.cjs");
const { Validator } = require('./middlewares/validate.cjs');
const { Sanitizer } = require('./middlewares/sanitize.cjs');
const { Register } = require("./controllers/registration.cjs");
const Login = require("./controllers/login.cjs");
const { Auth } = require('./middlewares/auth.cjs');
const Query = require('./controllers/queries.cjs');
const { Logout } = require("./middlewares/logout.cjs");
const File = require("./modules/template.cjs");
const { view } = require('./helpers/functions.cjs');

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
    fs.readFile(utilities.getFilePath("home"), (err, data) => {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(data);
        res.end();
    });
});

/**
 * Login page
 */
app.get("/login", [], (req, res) => {
    fs.readFile(utilities.getFilePath("login"), (err, data) => {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(data);
        res.end();
    });
});



app.get('/super-admin/admins', [Auth.authenticate], async (req, res,) => {
    const html = await view('pages/spadmin/admins.html');
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write(html);
    res.end();
})




app.get('/view-admins/:limit', [Auth.authenticate, Sanitizer.sanitize], async (req, res) => {
    try {
        const query = await Query.viewAdmins(req.params.limit);
        return utilities.sendResults(query, res);
    } catch (error) {
        return utilities.sendErrors(error, res);
    }
});

app.get('/view-admin', [Auth.authenticate], async (req, res) => {
    try {
        const email = await Auth.getEmailFromSession(req, res);
        const query = await Query.viewAdmin(email, ['admins.firstname', 'admins.role'])
        return utilities.sendResults(query, res);
    } catch (error) {
        return utilities.sendErrors(error, res);
    }
})


app.get('/test/render', [], async (req, res) => {
    const html = await view('pages/spadmin/admins.html');
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write(html);
    res.end();
});






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






/**
 * `````````````````````````````````````````````````````````````````````````````````````````````````````````
 * RUN SERVER
 * `````````````````````````````````````````````````````````````````````````````````````````````````````````
 */

app.start();
