const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");

const router = express.Router();

// Signup Route
router.post("/signup", async (req, res) => {
    const { username, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    db.query("INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
        [username, email, hashedPassword],
        (err, result) => {
            if (err) return res.status(400).json({ error: err.message });
            res.json({ message: "User registered successfully!" });
        }
    );
});

// Login Route
router.post("/login", (req, res) => {
    const { email, password } = req.body;

    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {
        if (err) return res.status(400).json({ error: err.message });

        if (result.length === 0) return res.status(401).json({ error: "Invalid Credentials" });

        const validPassword = await bcrypt.compare(password, result[0].password);
        if (!validPassword) return res.status(401).json({ error: "Invalid Credentials" });

        const token = jwt.sign({ id: result[0].id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token });
    });
});

module.exports = router;
