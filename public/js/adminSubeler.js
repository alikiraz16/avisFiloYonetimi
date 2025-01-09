document.addEventListener('DOMContentLoaded', () => {
    const dateFilter = document.getElementById('date-filter');
    const yearFilter = document.getElementById('year-filter');

    loadData('2022-01-01', '2022-03-31');

    dateFilter.addEventListener('change', (e) => {
        const [startDate, endDate] = e.target.value.split('|');
        loadData(startDate, endDate);
    });

    yearFilter.addEventListener('change', (e) => {
        const selectedYear = e.target.value;
        const startDate = `${selectedYear}-01-01`;
        const endDate = `${selectedYear}-12-31`;
        loadData(startDate, endDate);
    });

    function loadData(startDate, endDate) {

        fetch(`/api/subeler/kiralanan-gun?startDate=${startDate}&endDate=${endDate}`)
            .then(response => response.json())
            .then(data => {
                const kiralananGunTable = document.getElementById('kiralananGunTable').getElementsByTagName('tbody')[0];
                kiralananGunTable.innerHTML = '';
                data.forEach(item => {
                    const row = kiralananGunTable.insertRow();
                    row.insertCell(0).textContent = item.sube_adi;
                    row.insertCell(1).textContent = item.toplam_kiralanan_gun || 0;
                });
            })
            .catch(error => {
                console.error('Kiralanan gün tablosu yüklenirken hata:', error);
            });

        fetch(`/api/subeler/kiralama-geliri?startDate=${startDate}&endDate=${endDate}`)
            .then(response => response.json())
            .then(data => {
                const kiralamaGeliriTable = document.getElementById('kiralamaGeliriTable').getElementsByTagName('tbody')[0];
                kiralamaGeliriTable.innerHTML = '';
                data.forEach(item => {
                    const row = kiralamaGeliriTable.insertRow();
                    row.insertCell(0).textContent = item.sube_adi;
                    row.insertCell(1).textContent = formatToCurrency(item.kiralama_geliri) || 0;
                });
            })
            .catch(error => {
                console.error('Kiralama geliri tablosu yüklenirken hata:', error);
            });
    }

    // Helper function to format numbers as currency (TL)
    function formatToCurrency(value) {
        if (value === null || value === undefined) return '-';
        return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(value);
    }
});
