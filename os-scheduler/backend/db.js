const mysql = require("mysql");
require("dotenv").config();

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "os_scheduler"
});

db.connect(err => {
    if (err) throw err;
    console.log("✅ MySQL Connected...");
});

module.exports = db;
