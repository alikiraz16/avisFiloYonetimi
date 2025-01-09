const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/az-bakim-cok-masraf', (req, res) => {
    const query = `
        SELECT
        araclar.arac_model,
        yakitlar.yakit_turu,
        COUNT(bakim.bakim_id) AS toplam_bakim_sayisi,
        SUM(bakim.masraf) AS toplam_masraf,
        round(AVG(bakim.masraf)) AS ortalama_masraf
        FROM bakim LEFT JOIN araclar ON araclar.arac_id = bakim.arac_id
        LEFT JOIN yakitlar ON yakitlar.yakit_id = araclar.yakit_id
        GROUP BY araclar.arac_model, yakitlar.yakit_turu  
        ORDER BY toplam_bakim_sayisi ASC, ortalama_masraf ASC
        LIMIT 10
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Veritabanı hatası:', err);
            return res.status(500).json({ error: 'Veritabanı hatası' });
        }
        res.json(results);
    })
})

router.get('/cok-bakim-az-masraf', (req, res) => {
    const query = `
        SELECT
        araclar.arac_model,
        yakitlar.yakit_turu,
        COUNT(bakim.bakim_id) AS toplam_bakim_sayisi,
        SUM(bakim.masraf) AS toplam_masraf,
        round(AVG(bakim.masraf)) AS ortalama_masraf
        FROM bakim LEFT JOIN araclar ON araclar.arac_id = bakim.arac_id
        LEFT JOIN yakitlar ON yakitlar.yakit_id = araclar.yakit_id
        GROUP BY araclar.arac_model, yakitlar.yakit_turu  
        ORDER BY  toplam_bakim_sayisi DESC, ortalama_masraf DESC
        LIMIT 10
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Veritabanı hatası:', err);
            return res.status(500).json({ error: 'Veritabanı hatası' });
        }
        res.json(results);
    })
})

router.get('/masrafli-arac', (req,res) => {
    const query = `
        SELECT araclar.arac_model, SUM(bakim.masraf) as toplam_masraf
        FROM araclar LEFT JOIN bakim ON araclar.arac_id=bakim.arac_id
        GROUP BY araclar.arac_id
        ORDER BY toplam_masraf DESC
        LIMIT 20
    `;
    db.query(query, (err, results) => {
        if(err) {
            console.error('Veritabanı hatası:', err);
            return res.status(500).json({error: 'Veritabanı hatası'});
        }
        res.json(results);
    })
})

router.get('/bakim-sayisi', (req, res) => {
    const query = `
        SELECT yakitlar.yakit_turu, araclar.arac_model, COUNT(bakim.bakim_id) as bakim_sayisi
        FROM yakitlar LEFT JOIN araclar ON araclar.yakit_id=yakitlar.yakit_id	 
        LEFT JOIN bakim ON araclar.arac_id=bakim.arac_id
        GROUP BY araclar.arac_id  
        ORDER BY bakim_sayisi DESC
        LIMIT 20
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Veritabanı hatası:', err);
            return res.status(500).json({ error: 'Veritabanı hatası' });
        }
        res.json(results);
    })
})

module.exports = router;