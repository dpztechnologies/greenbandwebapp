const { getRandom, getConfig } = require("./utilities.js");
const http = require("http");
const port = 9000;
const mysql = require("mysql");
const DB = require("./database.cjs");
const { routeProvider } = require('./routes.cjs');

const app = routeProvider();

// let profiles = [
//     {
//         uid: getRandom(),
//         firstname: "Peter",
//         lastname: "Mwambi",
//         email: "calebmwambi@gmail.com",
//         phone_no: "0114958431",
//         password: getRandom(10000000, 100000000)
//     },
//     {
//         uid: getRandom(),
//         firstname: "John",
//         lastname: "Kiragu",
//         email: "jkiragu001@gmail.com",
//         phone_no: "0722137451",
//         password: getRandom(10000000, 100000000)
//     }
// ];

// let conn = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "",
//     database: "test"
// });

// getConfig("database");

/*
conn.connect(err => {
    if (err) throw err;
    console.log("Connection successful");
    sql = insert(profiles, "users");
    conn.query(sql, err => {
        if (err) throw err;
    });
});
*/

/*
(async () => {
    profiles.forEach(profile => {
        let db = DB.use().insert().into("system_admins", profile);
    });
})();
*/


// (async () => {
//     let db = await DB.use().select(["*"]).from("system_admins", true);
//     console.log(db.getResults());
// })();


/*
http.createServer((req, res) => {
    res.write("Hello Test");
    res.end();
}).listen(port, () => {
    console.log(`Started server on http://localhost:${port}`);
});
*/


app.get('/', (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.end('Welcome to the home page');
})

app.start();