const db = require('../util/database');

module.exports = class report {
    static deleteReport(id) {
        return db.execute('DELETE FROM reports WHERE id = ?', [id]);
    }
}