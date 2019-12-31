const db = require('../util/database');

module.exports = class userInfo {
    
    static save(obj) {
      return db.execute('INSERT INTO users(fname, lname, user_phn, password, dob, profile_img) VALUES(?, ?, ?, ?, ?, ?)',
                   [obj.fname, obj.lname, obj.user_phn, obj.password, obj.dob, obj.profile_img]
        ); 
    }
    static userAuth(phnNum, password) {
        return db.execute('SELECT * FROM users WHERE user_phn = ? && password = ?', [phnNum, password]);
    }
    static fetchAllUsers() {
        return db.execute('SELECT id, fname, lname, user_phn, password, dob, profile_img, DATE_FORMAT(created_at, "%d-%c-%Y | %I:%i %p") AS created_at, user_role FROM users');
    }
    static userProfile(id) {
        return db.execute('SELECT id, fname, lname, user_phn, password, dob, profile_img, DATE_FORMAT(created_at, "%d-%c-%Y | %I:%i %p") AS created_at, user_role FROM users WHERE id = ?', [id]);
    }
    static editUserProfile(id) {
        return db.execute('SELECT * FROM users WHERE id = ?', [id]);
    }
    static updateProfile(obj) {
        return db.execute('UPDATE users SET fname = ?, lname = ?, user_phn = ?, profile_img = ? WHERE id = ?', 
            [obj.fname, obj.lname, obj.user_phn, obj.profile_img, obj.userId]
        );
    }
    static updateProfileExceptImg(obj) {
        return db.execute('UPDATE users SET fname = ?, lname = ?, user_phn = ?  WHERE id = ?', 
            [obj.fname, obj.lname, obj.user_phn, obj.userId]
        );
    }
    static countUser() {
        return db.execute('SELECT COUNT(*) AS total FROM users');
    }
    static deleteUser(id) {
        return db.execute('DELETE FROM users WHERE id = ?', [id]);
    }
    
}