Promise.all([
    fetch('/api/araclar/az_olan_sorgu').then(res => res.json()),
    fetch('/api/araclar/cok_olan_sorgu').then(res => res.json())
]).then(([azData, cokData]) => {
    const azLabels = azData.map(item => item.arac_model);
    const azValues = azData.map(item => item.kiralama_sayisi);
    const azYakit = azData.map(item => item.yakit_turu);

    const cokLabels = cokData.map(item => item.arac_model);
    const cokValues = cokData.map(item => item.kiralama_sayisi);
    const cokYakit = cokData.map(item => item.yakit_turu);

    // Az kiralananlar grafiği
    const ctxAz = document.getElementById('chartAz').getContext('2d');
    new Chart(ctxAz, {
        type: 'bar',
        data: {
            labels: azLabels,
            datasets: [{
                label: 'Kiralama Sayısı',
                data: azValues,
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                },
                tooltip: {
                    callbacks: {
                        afterLabel: function (context) {
                            const index = context.dataIndex;
                            return 'Yakıt Türü: ' + azYakit[index];
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    const ctxCok = document.getElementById('chartCok').getContext('2d');
    new Chart(ctxCok, {
        type: 'bar',
        data: {
            labels: cokLabels,
            datasets: [{
                label: 'Kiralama Sayısı',
                data: cokValues,
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                },
                tooltip: {
                    callbacks: {
                        afterLabel: function (context) {
                            const index = context.dataIndex;
                            return 'Yakıt Türü: ' + cokYakit[index];
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

}).catch(err => console.error('Veri çekme hatası:', err));

