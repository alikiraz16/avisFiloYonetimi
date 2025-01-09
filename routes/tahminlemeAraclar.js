const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/tahminlemeAraclar', (req, res) => {
    db.query('SELECT arac_id, arac_model, yakit_turu FROM yakitlar LEFT JOIN araclar ON yakitlar.yakit_id=araclar.yakit_id', (err, results) => {
        if (err) throw err;
        res.json(results); 
    });
});

module.exports = router;
