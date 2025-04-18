const { routeProvider } = require("./modules/routes.cjs");
const fs = require("fs");
const utilities = require("./modules/utilities.cjs");
const { Validator } = require('./middlewares/validate.cjs');
const { Sanitizer } = require('./middlewares/sanitize.cjs');
const { Register } = require("./controllers/registration.cjs");
const Login = require("./controllers/login.cjs");
const { Auth } = require('./middlewares/auth.cjs');

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

/**
 * Registration page
 */
app.get("/register", [], (req, res) => {
    fs.readFile(utilities.getFilePath("register"), (err, data) => {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(data);
        res.end();
    });
});


app.get('/super-admin/admins', [Auth.authenticate], (req, res,) => {
    fs.readFile(utilities.getFilePath("super-admin/admins"), (err, data) => {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(data);
        res.end();
    });
})



/**
 * `````````````````````````````````````````````````````````````````````````````````````````````````````````
 * POST REQUESTS
 * `````````````````````````````````````````````````````````````````````````````````````````````````````````
 */


app.post("/process-login", [Sanitizer.sanitize, Validator.validate], async (req, res) => {
    if (!req.body) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Missing request body' }));
        return;
    }
    return await Login.admin(req.body, res);
})

app.post("/process-registration", [Sanitizer.sanitize, Validator.validate], async (req, res) => {
    if (!req.body) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Missing request body' }));
        return;
    }
    const response = await Register.admin(req.body);
    if (response.success) {
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify(response));
        return;
    } else {
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify(response));
        return;
    }
})






/**
 * `````````````````````````````````````````````````````````````````````````````````````````````````````````
 * RUN SERVER
 * `````````````````````````````````````````````````````````````````````````````````````````````````````````
 */

app.start();
