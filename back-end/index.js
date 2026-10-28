const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Melayani file statis Front-End dari folder utama (back-end)
app.use(express.static(__dirname));

// Import Routes 
const scheduleRoutes = require('./routes/schedules');
const taskRoutes = require('./routes/tasks');

// Daftarkan API Routes
app.use('/api/schedules', scheduleRoutes);
app.use('/api/tasks', taskRoutes);

// Fallback Route untuk menyajikan halaman utama Front-End langsung dari folder utama
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Jalankan Server
app.listen(PORT, () => {
  console.log(`Server Scheduler berjalan di http://localhost:${PORT}`);
});

