const express = require('express');
const router = express.Router();
const db = require('../config/db');


// Kiralanan Gün Sayısı API
router.get('/kiralanan-gun', (req, res) => {
    const { startDate, endDate } = req.query;
    let query = `
        SELECT subeler.sube_adi, SUM(kiralama.kiralama_suresi) as toplam_kiralanan_gun
        FROM subeler 
        LEFT JOIN kiralama ON subeler.sube_id = kiralama.sube_id
    `;

    if (startDate && endDate) {
        query += `WHERE kiralama.kiralama_tarihi BETWEEN ? AND ? `;
    }

    query += `
        GROUP BY subeler.sube_id
    `;

    db.query(query, [startDate, endDate], (err, results) => {
        if (err) {
            console.error('Veritabanı hatası:', err);
            return res.status(500).json({ error: 'Veritabanı hatası' });
        }
        res.json(results);
    });
});

// Kiralama Geliri API
router.get('/kiralama-geliri', (req, res) => {
    const { startDate, endDate } = req.query;
    let query = `
        SELECT subeler.sube_adi, SUM(kiralama.kiralama_ucreti) as kiralama_geliri
        FROM subeler 
        LEFT JOIN kiralama ON subeler.sube_id = kiralama.sube_id
    `;

    if (startDate && endDate) {
        query += `WHERE kiralama.kiralama_tarihi BETWEEN ? AND ? `;
    }

    query += `
        GROUP BY subeler.sube_id
    `;

    db.query(query, [startDate, endDate], (err, results) => {
        if (err) {
            console.error('Veritabanı hatası:', err);
            return res.status(500).json({ error: 'Veritabanı hatası' });
        }
        res.json(results);
    });
});

module.exports = router;
