const express = require('express');
const db = require('../config/db');
const router = express.Router();

// ÇOK BAKIMA GİREN VE AZ MASRAF YAPAN ARAÇLAR
router.get('/getTopMaintenanceCars', (req, res) => {
    const query = `
        SELECT
            araclar.arac_model,
            yakitlar.yakit_turu,
            COUNT(bakim.bakim_id) AS toplam_bakim_sayisi,
            ROUND(AVG(bakim.masraf)) AS ortalama_masraf
        FROM bakim 
        LEFT JOIN araclar ON araclar.arac_id = bakim.arac_id
        LEFT JOIN yakitlar ON yakitlar.yakit_id = araclar.yakit_id
        GROUP BY araclar.arac_id, yakitlar.yakit_turu  
        ORDER BY toplam_bakim_sayisi DESC, ortalama_masraf ASC
        LIMIT 20;
    `;
    db.query(query, (err, result) => {
        if (err) {
            console.error('Sorgu hatası:', err.message);
            return res.status(500).json({ error: 'Veritabanı sorgusu başarısız oldu.' });
        }
        res.json(result);
    });
});

// EN ÇOK KİRALANAN 20 ARAÇ
router.get('/getTopRentedCars', (req, res) => {
    const query = `
        SELECT yakitlar.yakit_turu, araclar.arac_model, COUNT(kiralama.kiralama_id) AS kiralama_sayisi
        FROM yakitlar 
        LEFT JOIN araclar ON yakitlar.yakit_id = araclar.yakit_id
        LEFT JOIN kiralama ON araclar.arac_id = kiralama.arac_id
        GROUP BY yakitlar.yakit_id, araclar.arac_id  
        ORDER BY kiralama_sayisi DESC
        LIMIT 20;
    `;
    db.query(query, (err, result) => {
        if (err) {
            console.error('Sorgu hatası:', err.message);
            return res.status(500).json({ error: 'Veritabanı sorgusu başarısız oldu.' });
        }
        res.json(result);
    });
});


router.get('/getCommonCars', (req, res) => {
    const rentedCarsQuery = `
        SELECT araclar.arac_id, araclar.arac_model, yakitlar.yakit_turu
        FROM yakitlar 
        LEFT JOIN araclar ON yakitlar.yakit_id = araclar.yakit_id
        LEFT JOIN kiralama ON araclar.arac_id = kiralama.arac_id
        GROUP BY araclar.arac_id, araclar.arac_model, yakitlar.yakit_turu  
        ORDER BY COUNT(kiralama.kiralama_id) DESC
        LIMIT 20;
    `;

    const maintenanceCarsQuery = `
        SELECT araclar.arac_id, araclar.arac_model, yakitlar.yakit_turu
        FROM bakim
        LEFT JOIN araclar ON araclar.arac_id = bakim.arac_id
        LEFT JOIN yakitlar ON yakitlar.yakit_id = araclar.yakit_id
        GROUP BY araclar.arac_id, araclar.arac_model, yakitlar.yakit_turu  
        ORDER BY COUNT(bakim.bakim_id) DESC, AVG(bakim.masraf) ASC
        LIMIT 20;
    `;

    // Veritabanında her iki sorguyu çalıştır
    db.query(rentedCarsQuery, (err, rentedResult) => {
        if (err) {
            console.error('Kiralanan araçlar sorgu hatası:', err.message);
            return res.status(500).json({ error: 'Veritabanı sorgusu başarısız oldu.' });
        }

        db.query(maintenanceCarsQuery, (err, maintenanceResult) => {
            if (err) {
                console.error('Bakım araçları sorgu hatası:', err.message);
                return res.status(500).json({ error: 'Veritabanı sorgusu başarısız oldu.' });
            }

            // Ortak araçları bulmak
            const rentedCars = rentedResult.map(item => ({ id: item.arac_id, model: item.arac_model, fuel: item.yakit_turu }));
            const maintenanceCars = maintenanceResult.map(item => ({ id: item.arac_id, model: item.arac_model, fuel: item.yakit_turu }));

            // Ortak araçları filtrele
            const commonCars = rentedCars.filter(car => maintenanceCars.some(maintenanceCar => maintenanceCar.id === car.id));

            // Ortak araçları döndür
            res.json(commonCars);
        });
    });
});


// Çok Masraf Az Bakım Yapan Araçlar
router.get('/getTopCostLowMaintenanceCars', (req, res) => {
    const query = `
        SELECT araclar.arac_model, yakitlar.yakit_turu, COUNT(bakim.bakim_id) AS toplam_bakim_sayisi, ROUND(AVG(bakim.masraf)) AS ortalama_masraf
        FROM bakim
        LEFT JOIN araclar ON araclar.arac_id = bakim.arac_id
        LEFT JOIN yakitlar ON yakitlar.yakit_id = araclar.yakit_id
        GROUP BY araclar.arac_id, yakitlar.yakit_turu
        ORDER BY toplam_bakim_sayisi ASC, ortalama_masraf DESC
        LIMIT 20;
    `;
    db.query(query, (err, result) => {
        if (err) {
            console.error('Sorgu hatası:', err.message);
            return res.status(500).json({ error: 'Veritabanı sorgusu başarısız oldu.' });
        }
        res.json(result);
    });
});

// Az Kiralanan 20 Araç
router.get('/getBottomRentedCars', (req, res) => {
    const query = `
        SELECT yakitlar.yakit_turu, araclar.arac_model, COUNT(kiralama.kiralama_id) as kiralama_sayisi
        FROM yakitlar LEFT JOIN araclar ON yakitlar.yakit_id=araclar.yakit_id
		LEFT JOIN kiralama ON araclar.arac_id=kiralama.arac_id
        GROUP BY yakitlar.yakit_id, araclar.arac_id  
        ORDER BY kiralama_sayisi ASC
        LIMIT 20;
    `;
    db.query(query, (err, result) => {
        if (err) {
            console.error('Sorgu hatası:', err.message);
            return res.status(500).json({ error: 'Veritabanı sorgusu başarısız oldu.' });
        }
        res.json(result);
    });
});


router.get('/getCommonCarsForGraphs', (req, res) => {
    const maintenanceCarsQuery = `
        SELECT araclar.arac_id, araclar.arac_model, yakitlar.yakit_turu
        FROM bakim
        LEFT JOIN araclar ON araclar.arac_id = bakim.arac_id
        LEFT JOIN yakitlar ON yakitlar.yakit_id = araclar.yakit_id
        GROUP BY araclar.arac_id, araclar.arac_model, yakitlar.yakit_turu
        ORDER BY AVG(bakim.masraf) DESC, COUNT(bakim.bakim_id) ASC
        LIMIT 20;
    `;

    const rentedCarsQuery = `
        SELECT araclar.arac_id, araclar.arac_model, yakitlar.yakit_turu
        FROM yakitlar
        LEFT JOIN araclar ON yakitlar.yakit_id = araclar.yakit_id
        LEFT JOIN kiralama ON araclar.arac_id = kiralama.arac_id
        GROUP BY araclar.arac_id, araclar.arac_model, yakitlar.yakit_turu
        ORDER BY COUNT(kiralama.kiralama_id) ASC
        LIMIT 20;
    `;

    db.query(rentedCarsQuery, (err, rentedResult) => {
        if (err) {
            console.error('Kiralanan araçlar sorgu hatası:', err.message);
            return res.status(500).json({ error: 'Veritabanı sorgusu başarısız oldu.' });
        }

        db.query(maintenanceCarsQuery, (err, maintenanceResult) => {
            if (err) {
                console.error('Bakım araçları sorgu hatası:', err.message);
                return res.status(500).json({ error: 'Veritabanı sorgusu başarısız oldu.' });
            }

            // Ortak araçları bulmak
            const rentedCars = rentedResult.map(item => ({ id: item.arac_id, model: item.arac_model, fuel: item.yakit_turu }));
            const maintenanceCars = maintenanceResult.map(item => ({ id: item.arac_id, model: item.arac_model, fuel: item.yakit_turu }));

            // Ortak araçları filtrele
            const commonCars = rentedCars.filter(car => maintenanceCars.some(maintenanceCar => maintenanceCar.id === car.id));

            // Ortak araçları döndür
            res.json(commonCars);
        });
    });
});


router.get('/getCarFinancialData', (req, res) => {
    const { carId } = req.query;

    const query = `
        SELECT YEAR(kiralama_tarihi) AS year, 
               SUM(kiralama_ucreti) AS revenue 
        FROM kiralama
        WHERE arac_id = ?
        GROUP BY YEAR(kiralama_tarihi)
    `;

    db.query(query, [carId], (err, rentalResults) => {
        if (err) return res.status(500).send(err);

        const maintenanceQuery = `
            SELECT YEAR(bakim_tarihi) AS year, 
                   SUM(masraf) AS maintenanceCost
            FROM bakim
            WHERE arac_id = ?
            GROUP BY YEAR(bakim_tarihi)
        `;

        db.query(maintenanceQuery, [carId], (err, maintenanceResults) => {
            if (err) return res.status(500).send(err);

            const yearlyStats = {};

            rentalResults.forEach(rental => {
                yearlyStats[rental.year] = {
                    revenue: rental.revenue || 0,
                    maintenanceCost: 0
                };
            });

            maintenanceResults.forEach(maintenance => {
                if (!yearlyStats[maintenance.year]) {
                    yearlyStats[maintenance.year] = {
                        revenue: 0,
                        maintenanceCost: 0
                    };
                }
                yearlyStats[maintenance.year].maintenanceCost = maintenance.maintenanceCost || 0;
            });

            res.json(yearlyStats);
        });
    });
});

router.get('/getAllCars', (req, res) => {
    const query = `
        SELECT arac_id, arac_model, yakit_turu
        FROM yakitlar LEFT JOIN araclar ON yakitlar.yakit_id=araclar.yakit_id
    `;

    db.query(query, (err, result) => {
        if (err) {
            console.error('Veritabanı hatası:', err.message);
            return res.status(500).json({ error: 'Veritabanı sorgusu başarısız oldu.' });
        }

        res.json(result);
    });
});

module.exports = router;