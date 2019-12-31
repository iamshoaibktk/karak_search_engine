const db = require('../util/database');

module.exports = class auth{
    static checkExisting(phn_num) {
        return db.execute('SELECT * FROM users WHERE user_phn = ?', [phn_num]);
    }

    static validateLogin(user_phn) {
        return db.execute('SELECT * FROM users WHERE user_phn = ?', [user_phn]);
    }
}