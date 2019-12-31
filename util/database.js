const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'fyProject',
    password: 'Allahisgreat'
});

module.exports = pool.promise();