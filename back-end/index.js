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
const authRoutes = require('./routes/auth');
const { getSessionUserId } = require('./middleware/auth');

// Daftarkan API Routes
app.use('/api/auth', authRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/tasks', taskRoutes);

// Keep unknown API requests in JSON format instead of returning the HTML page.
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Endpoint API tidak ditemukan' });
});

app.use((req, res, next) => {
  const protectedPages = ['/', '/index.html', '/study-space.html'];
  if (req.method === 'GET' && protectedPages.includes(req.path) && !getSessionUserId(req)) {
    return res.redirect('/login.html');
  }

  next();
});

// Fallback Route untuk menyajikan halaman utama Front-End langsung dari folder utama
app.get(/.*/, (req, res) => {
  if (req.path === '/login.html') {
    return res.sendFile(path.join(__dirname, 'login.html'));
  }

  if (req.path === '/' || req.path === '/index.html' || req.path === '/study-space.html') {
    const userId = getSessionUserId(req);
    if (!userId) {
      return res.redirect('/login.html');
    }
  }

  res.sendFile(path.join(__dirname, req.path === '/' ? 'index.html' : req.path));
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server Scheduler berjalan di http://localhost:${PORT}`);
  });
}

module.exports = app;
