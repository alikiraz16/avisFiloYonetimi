const express = require('express');
const router = express.Router();
const db = require('../config/db'); 

router.get('/kiralama-verileri', (req, res) => {
    const aracId = req.query.arac_id;

    db.query(`
    SELECT 
      YEAR(kiralama_tarihi) AS yil,
      SUM(kiralama_suresi) AS toplam_kiralanan_gun
    FROM kiralama
    WHERE arac_id = ?
    GROUP BY YEAR(kiralama_tarihi)
    HAVING yil BETWEEN 2021 AND 2024
    ORDER BY yil ASC
    `, [aracId], (err, results) => {
        if (err) throw err;

        const years = results.map(result => result.yil);
        let totalDays = results.map(result => result.toplam_kiralanan_gun);

        if (!totalDays || totalDays.length === 0) {
            return res.json({ error: 'Veri bulunamadı veya eksik.' });
        }

        totalDays = totalDays.map(cost => parseFloat(cost));

        const averagePrediction = totalDays.reduce((sum, val) => sum + val, 0) / totalDays.length;
        const limitedPrediction = Math.round(averagePrediction);

        res.json({
            years,
            totalDays,
            averagePrediction: limitedPrediction
        });
    });
});

router.get('/bakim-masrafi', (req, res) => {
    const aracId = req.query.arac_id;

    db.query(`
    SELECT 
      YEAR(bakim_tarihi) AS yil,
      AVG(masraf) AS toplam_masraf
    FROM bakim
    WHERE arac_id = ?
    GROUP BY YEAR(bakim_tarihi)
    HAVING yil BETWEEN 2021 AND 2024  
    ORDER BY yil ASC;`, [aracId], (err, results) => {
        if (err) throw err;

        const years = results.map(result => result.yil);
        let totalCosts = results.map(result => result.toplam_masraf);

        if (!totalCosts || totalCosts.length === 0) {
            return res.json({ error: 'Veri bulunamadı veya eksik.' });
        }

        totalCosts = totalCosts.map(cost => parseFloat(cost));

        const averageCost = totalCosts.reduce((sum, val) => sum + val, 0) / totalCosts.length;

        const limitedCost = Math.round(averageCost);

        res.json({
            years,
            totalCosts,
            averageCost: limitedCost 
        });
    });
});


router.get('/kiralama-geliri', (req, res) => {
    const aracId = req.query.arac_id;

    db.query(`
    SELECT 
      YEAR(kiralama_tarihi) AS yil,
      AVG(gunluk_ucret) AS ortalama
    FROM kiralama
    WHERE arac_id = ?
    GROUP BY YEAR(kiralama_tarihi)
    HAVING yil BETWEEN 2021 AND 2024  
    ORDER BY yil ASC;`, [aracId], (err, results) => {
        if (err) throw err;

        const years = results.map(result => result.yil);
        let totalincome = results.map(result => result.ortalama);

        if (!totalincome || totalincome.length === 0) {
            return res.json({ error: 'Veri bulunamadı veya eksik.' });
        }

        totalincome = totalincome.map(cost => parseFloat(cost));

        const averageincome = totalincome.reduce((sum, val) => sum + val, 0) / totalincome.length;

        const limitedincome = Math.round(averageincome);

        res.json({
            years,
            totalincome,
            averageincome: limitedincome
        });
    });
});

module.exports = router;