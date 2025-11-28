const db = require("../config/database");

module.exports = {
    findByUsername(username, callback) {
        db.query("SELECT * FROM users WHERE username = ?", [username], callback);
    },

    createUser(nama,username, password, level, callback) {
        db.query(
            "INSERT INTO users (nama, username, password, level) VALUES (?, ?, ?, ?)",
            [nama, username, password, level],
            callback
        );
    }
};
