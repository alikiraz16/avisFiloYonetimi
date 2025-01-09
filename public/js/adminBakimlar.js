document.addEventListener('DOMContentLoaded', () => {

    function formatToCurrency(value) {
        if (value === null || value === undefined) return '-';
        return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(value);
    }

    fetch('/api/bakimlar/az-bakim-cok-masraf')
        .then(res => res.json())
        .then(data => {
            const tbody = document.querySelector('#az-bakim-table tbody');
            data.forEach(item => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${item.arac_model || '-'}</td>
                    <td>${item.yakit_turu || '-'}</td>
                    <td>${item.toplam_bakim_sayisi || 0}</td>
                    <td>${formatToCurrency(item.toplam_masraf) || formatToCurrency(0)}</td>
                    <td>${formatToCurrency(item.ortalama_masraf) || formatToCurrency(0)}</td>
                `;
                tbody.appendChild(tr);
            });
        })
        .catch(err => console.error('Az Bakım - Çok Masraf Veri Hatası:', err));

    fetch('/api/bakimlar/cok-bakim-az-masraf')
        .then(res => res.json())
        .then(data => {
            const tbody = document.querySelector('#cok-bakim-table tbody');
            data.forEach(item => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${item.arac_model || '-'}</td>
                    <td>${item.yakit_turu || '-'}</td>
                    <td>${item.toplam_bakim_sayisi || 0}</td>
                    <td>${formatToCurrency(item.toplam_masraf) || formatToCurrency(0)}</td>
                    <td>${formatToCurrency(item.ortalama_masraf) || formatToCurrency(0)}</td>
                `;
                tbody.appendChild(tr);
            });
        })
        .catch(err => console.error('Çok Bakım - Az Masraf Veri Hatası:', err));

    // Masraflı araç grafiği
    fetch('/api/bakimlar/masrafli-arac')
        .then(res => res.json())
        .then(data => {
            const labels = data.map(item => item.arac_model);
            const values = data.map(item => item.toplam_masraf);

            const ctx = document.getElementById('masrafliAracChart').getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Toplam Masraf',
                        data: values,
                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                        borderColor: 'rgba(255,99,132,1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: { beginAtZero: true }
                    },
                    plugins: {
                        title: {
                            display: true,
                            text: 'En Masraflı 20 Araç'
                        }
                    }
                }
            });
        })
        .catch(err => console.error('Masraflı Araç Veri Hatası:', err));

    // Bakım sayısı grafiği
    fetch('/api/bakimlar/bakim-sayisi')
        .then(res => res.json())
        .then(data => {
            const labels = data.map(item => item.arac_model);
            const values = data.map(item => item.bakim_sayisi);

            const ctx = document.getElementById('bakimSayisiChart').getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Bakım Sayısı',
                        data: values,
                        backgroundColor: 'rgba(54, 162, 235, 0.5)',
                        borderColor: 'rgba(54,162,235,1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: { beginAtZero: true }
                    },
                    plugins: {
                        title: {
                            display: true,
                            text: 'Bakım Sayısı En Yüksek 20 Araç'
                        }
                    }
                }
            });
        })
        .catch(err => console.error('Bakım Sayısı Veri Hatası:', err));
});
