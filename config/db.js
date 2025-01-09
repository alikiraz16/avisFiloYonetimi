const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "avisfiloyonetimi"
});

db.connect((err) => {
    if (err) {
        console.error('MySQL bağlantı hatası: ', err);
        return;
    }
    console.log('MySQL bağlantısı başarılı!');
});

module.exports = db;