const express = require("express");
const db = require("../db");

const router = express.Router();

// Save Calculation
router.post("/save", (req, res) => {
    const { user_id, algorithm, input_data, results } = req.body;

    db.query("INSERT INTO calculations (user_id, algorithm, input_data, results) VALUES (?, ?, ?, ?)",
        [user_id, algorithm, JSON.stringify(input_data), JSON.stringify(results)],
        (err, result) => {
            if (err) return res.status(400).json({ error: err.message });
            res.json({ message: "Calculation saved!" });
        }
    );
});

// Fetch User Calculations
router.get("/history/:user_id", (req, res) => {
    db.query("SELECT * FROM calculations WHERE user_id = ?", [req.params.user_id], (err, result) => {
        if (err) return res.status(400).json({ error: err.message });
        res.json(result);
    });
});

module.exports = router;
