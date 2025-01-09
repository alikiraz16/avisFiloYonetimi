fetch('/api/tahminlemeAraclar')
    .then(response => response.json())
    .then(data => {
        const dropdown = document.getElementById('arac-secimi');
        data.forEach(arac => {
            const option = document.createElement('option');
            option.value = arac.arac_id; 
            option.textContent = `${arac.arac_model} - ${arac.yakit_turu}`;  
            dropdown.appendChild(option);
        });
    })
    .catch(error => console.error('Araçlar yüklenirken hata oluştu:', error));

document.getElementById('arac-secimi').addEventListener('change', function () {
    const aracId = this.value;

    if (aracId) {
        fetch(`/api/kiralama-verileri?arac_id=${aracId}`)
            .then(response => response.json())
            .then(data => {
                console.log(data); 

                document.getElementById('2021-gun-sayisi').innerText = data.totalDays[0];
                document.getElementById('2022-gun-sayisi').innerText = data.totalDays[1];
                document.getElementById('2023-gun-sayisi').innerText = data.totalDays[2];
                document.getElementById('2024-gun-sayisi').innerText = data.totalDays[3];

                if (data.averagePrediction !== undefined) {
                    document.getElementById('2025-tahmin').innerText = Math.round(data.averagePrediction);
                } else {
                    console.error("Tahmin değeri undefined.");
                }
            })
            .catch(error => console.error('Hata:', error));

        fetch(`/api/bakim-masrafi?arac_id=${aracId}`)
            .then(response => response.json())
            .then(data => {
                console.log('API Yanıtı:', data);  

                if (data.error) {
                    console.error('Veri hatası:', data.error);
                    return; 
                }

                const formatTL = new Intl.NumberFormat('tr-TR', {
                    style: 'currency',
                    currency: 'TRY'
                });

                document.getElementById('2021-masraf').innerText = formatTL.format(data.totalCosts[0]);
                document.getElementById('2022-masraf').innerText = formatTL.format(data.totalCosts[1]);
                document.getElementById('2023-masraf').innerText = formatTL.format(data.totalCosts[2]);
                document.getElementById('2024-masraf').innerText = formatTL.format(data.totalCosts[3]);

                if (data.averageCost !== undefined) {
                    document.getElementById('2025-masraf').innerText = formatTL.format(data.averageCost);
                } else {
                    console.error("Tahmin değeri undefined.");
                }
            })
            .catch(error => console.error('Hata:', error));


        fetch(`/api/kiralama-geliri?arac_id=${aracId}`)
            .then(response => response.json())
            .then(data => {
                console.log('API Yanıtı:', data);

                if (data.error) {
                    console.error('Veri hatası:', data.error);
                    return;
                }

                const formatTL = new Intl.NumberFormat('tr-TR', {
                    style: 'currency',
                    currency: 'TRY'
                });

                document.getElementById('2021-Gelir').innerText = formatTL.format(data.totalincome[0]);
                document.getElementById('2022-Gelir').innerText = formatTL.format(data.totalincome[1]);
                document.getElementById('2023-Gelir').innerText = formatTL.format(data.totalincome[2]);
                document.getElementById('2024-Gelir').innerText = formatTL.format(data.totalincome[3]);

                if (data.averageincome !== undefined) {
                    document.getElementById('2025-Gelir').innerText = formatTL.format(data.averageincome);
                } else {
                    console.error("Tahmin değeri undefined.");
                }
            })
            .catch(error => console.error('Hata:', error));        
    }
});
