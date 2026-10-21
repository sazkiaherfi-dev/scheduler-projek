const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Melayani file statis Front-End dari folder 'public' (Single Folder Setup)
app.use(express.static(path.join(__dirname, 'public')));

// Import Routes
const authRoutes = require('./src/routes/authRoutes');
const scheduleRoutes = require('./src/routes/scheduleRoutes');
const taskRoutes = require('./src/routes/taskRoutes');
const studyRoutes = require('./src/routes/studyRoutes');
const dashboardRoutes = require('./src/routes/dashboardRoutes');

// Daftarkan API Routes
app.use('/api/auth', authRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/study-sessions', studyRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Fallback Route untuk menyajikan halaman utama Front-End
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Jalankan Server
app.listen(PORT, () => {
  console.log(`Server Scheduler berjalan di http://localhost:${PORT}`);
});