const express = require('express');
const db = require('./config/db');
const app = express();
const PORT = process.env.PORT || 3000;

const summaryRoutes = require('./routes/summaryRoutes');
const subeler = require('./routes/subeler');
const araclar = require('./routes/araclar');
const bakimlar = require('./routes/bakimlar');
const vehicleRoutes = require('./routes/vehicleRoutes');
const tahminlemeAraclarRoute = require('./routes/tahminlemeAraclar');
const tahminlemeRoute = require('./routes/tahminleme');

const bodyParser = require('body-parser');
const cors = require('cors');
app.use(bodyParser.json());
app.use(cors());

app.use('/api/bakimlar', bakimlar);
app.use('/api/summary', summaryRoutes);
app.use('/api/subeler', subeler);
app.use('/api/araclar', araclar);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api', tahminlemeAraclarRoute); 
app.use('/api', tahminlemeRoute);
app.use(express.json());
app.use(express.static('public'));

app.listen(PORT, () => {
    console.log(`Server ${PORT} portunda çalışıyor...`);
});
