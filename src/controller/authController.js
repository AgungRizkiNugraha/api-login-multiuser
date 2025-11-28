const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const db = require("../config/database");

exports.register = (req, res) => {
    let { nama, username, password, level } = req.body;

     if (!nama || !username || !password) {
            return res.status(400).json({ message: "Name, username, and password are required" });
        }

    // default level to 'user' when not provided
    level = level || 'user';
    const allowedLevels = ['user', 'admin', 'pemilik'];
    if (!allowedLevels.includes(level)) {
        return res.status(400).json({ message: "Invalid level. Allowed: user, admin, pemilik" });
    }

    User.findByUsername(username, async (err, result) => {
        if (err) return res.status(500).json({ error: err });
        if (result.length > 0) {
            return res.status(400).json({ message: "Username sudah dipakai" });
        }

        const hashed = await bcrypt.hash(password, 10);
        User.createUser(nama, username, hashed, level, (err2) => {
                if (err2) return res.status(500).json({ error: err2 });

                res.json({ message: "User registered successfully" });
            });
        });
    };

exports.login = (req, res) => {
        const { username, password } = req.body;

        User.findByUsername(username, (err, results) => {
            if (err) return res.status(500).json({ error: err });
            if (results.length === 0) return res.status(401).json({ message: "User not found" });

            const user = results[0];

            const isMatch = bcrypt.compareSync(password, user.password);
            if (!isMatch) return res.status(401).json({ message: "Invalid password" });

            const displayName = user.nama || user.name;
            const userLevel = user.level || 'user';

            const token = jwt.sign(
                { id: user.id, username: user.username, name: displayName, level: userLevel },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );

            res.json({
                message: "Login success",
                token,
                user: {
                    id: user.id,
                    name: displayName,
                    username: user.username,
                    level: userLevel
                }
            });
        });
};

 
exports.logout = (req, res) => {
    const userId = req.user.id;

    db.query("UPDATE users SET refresh_token = NULL WHERE id = ?", [userId], (err) => {
        if (err) return res.status(500).json({ message: "DB error" });

        res.json({ message: "Logout successful" });
    });
};

