const { getRandom, getConfig } = require("./utilities.js");
const http = require("http");
const port = 9000;
const mysql = require("mysql");

const DB = require("./database.js");

let profiles = [
    {
        uid: getRandom(),
        firstname: "Peter",
        lastname: "Mwambi",
        email: "calebmwambi@gmail.com",
        phone_no: "0114958431",
        password: getRandom(10000000, 100000000)
    },
    {
        uid: getRandom(),
        firstname: "John",
        lastname: "Kiragu",
        email: "jkiragu001@gmail.com",
        phone_no: "0722137451",
        password: getRandom(10000000, 100000000)
    }
];

let conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "test"
});

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

function insert(data, table) {
    let cols = "";
    let pstmt = "";
    let i = 1;
    let sql = `INSERT INTO ${table} `;
    data.forEach((item, key) => {
        for (let x in item) {
            if (key === 0) {
                cols += `'${x}'`;
                pstmt += "?";
                if (i < Object.keys(item).length) {
                    cols += ",";
                    pstmt += ",";
                }
            }
            i++;
        }
    });
    sql += `(${cols}) VALUES (${pstmt})`;
    return sql;
}

let database = new DB();

database.query();

/*
http.createServer((req, res) => {
    res.write("Hello Test");
    res.end();
}).listen(port, () => {
    console.log(`Started server on http://localhost:${port}`);
});
*/
