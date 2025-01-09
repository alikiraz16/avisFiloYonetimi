const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Kiralanan toplam gün sayısını getir
router.get('/total-rental-days', (req, res) => {
    const { start, end } = req.query;
    const query = `
        SELECT SUM(kiralama_suresi) AS totalRentalDays 
        FROM kiralama 
        WHERE kiralama_tarihi BETWEEN ? AND ?
    `;
    db.query(query, [start, end], (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results[0]);
    });
});


// Toplam kiralama gelirini getir
router.get('/total-revenue', (req, res) => {
    const { start, end } = req.query;
    const query = `SELECT SUM(kiralama_ucreti) AS totalRevenue FROM kiralama WHERE kiralama_tarihi BETWEEN ? AND ?`;
    db.query(query, [start, end], (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results[0]);
    });
});

// Toplam bakım masrafını getir
router.get('/total-maintenance', (req, res) => {
    const { start, end } = req.query;
    const query = `SELECT SUM(masraf) AS totalMaintenance FROM bakim WHERE bakim_tarihi BETWEEN ? AND ?`;
    db.query(query, [start, end], (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results[0]);
    });
});

module.exports = router;