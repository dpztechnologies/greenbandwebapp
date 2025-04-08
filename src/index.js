const { routeProvider } = require("./modules/routes.cjs");
const fs = require("fs");
const utilities = require("./modules/utilities.cjs");
const DB = require("./modules/database.cjs");

const app = routeProvider();


app.use((req, res, next) => {
    console.log(`Incoming requests: [${req.method}] ${req.url}`);
    next();
})

app.get("/", [], (req, res) => {
    fs.readFile(utilities.getFilePath("login"), (err, data) => {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(data);
        res.end();
    });
});

app.post("/login", [validateLogin], (req, res) => {
    if (!req.body) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Missing request body' }));
        return;
    }
    const { email, otp } = req.body;

    console.log(email);
})


function validateLogin(req, res, next) {
    if (!req.body.email) {
        res.writeHead(400, { 'Content-Type': 'application/json' })
        return res.end(JSON.stringify({ message: 'Email is required', handler: 'email' }));
    }
    next();
}







app.start();
