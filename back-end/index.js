require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const path = require('path');

// Menghubungkan folder front-end agar bisa dibaca langsung oleh Express
app.use(express.static(path.join(__dirname, '../front-end')));

// Import Routes yang baru dibuat
const scheduleRoutes = require('./routes/schedules');
const taskRoutes = require('./routes/tasks');

// Daftarkan Routes ke Express
app.use('/api/schedules', scheduleRoutes);
app.use('/api/tasks', taskRoutes);

// Rute tes dasar
app.get('/', (req, res) => {
    res.send('Server Scheduler API berjalan dengan baik! 🚀');
});

// Nyalakan server
app.listen(PORT, () => {
    console.log(`Server Backend berjalan di http://localhost:${PORT}`);
});