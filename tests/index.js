const { routeProvider } = require("./routes.cjs");
const fs = require("fs");
const utilities = require("./utilities.cjs");
const DB = require("./database.cjs");

const app = routeProvider();

app.get("/", (req, res) => {
    fs.readFile(utilities.getFilePath("login"), (err, data) => {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(data);
        res.end();
    });
});

app.post("/register", (req, res) => {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("Test Post");
});

app.get("/users", (req, res) => {
    res.writeHead(200, { "Content-Type": "application/json" });
    (async () => {
        let db = await DB.use().select(["*"]).from("system_admins", true);
        res.write(JSON.stringify(db.getResults()));
        res.end();
    })();
});

app.start();
