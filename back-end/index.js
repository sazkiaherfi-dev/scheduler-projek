const crypto = require('crypto');
const express = require('express');
const cors = require('cors');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const scheduleRoutes = require('./routes/schedules');
const taskRoutes = require('./routes/tasks');
const authRoutes = require('./routes/auth');
const { getSessionUserId, setSessionCookie } = require('./middleware/auth');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// Halaman utama yang langsung mendapatkan sesi tamu otomatis jika belum login
const GUEST_ENABLED_PAGES = ['/', '/index.html', '/study-space.html'];

// Folder/file internal backend yang tidak boleh diakses langsung lewat browser
const BLOCKED_PATHS = /^\/(\.env|prisma|routes|middleware|test|node_modules|package(-lock)?\.json|docker-compose\.yml|vercel\.json|index\.js)/i;

// Middleware dasar
app.use(cors());
app.use(express.json());

// 1. Blokir akses langsung ke file-file internal backend
app.use((req, res, next) => {
  if (BLOCKED_PATHS.test(req.path)) {
    return res.status(403).json({ error: 'Akses ditolak' });
  }
  next();
});

// 2. Otomatis buatkan sesi tamu (demo) jika membuka halaman utama tanpa login
app.use(async (req, res, next) => {
  if (req.method === 'GET' && GUEST_ENABLED_PAGES.includes(req.path)) {
    const existingUserId = getSessionUserId(req);

    if (!existingUserId) {
      try {
        const guestUser = await prisma.user.create({
          data: {
            name: 'Pengguna Tamu',
            email: `guest-${crypto.randomUUID()}@demo.scheduler.local`,
            password: crypto.randomBytes(64).toString('hex')
          }
        });

        setSessionCookie(res, guestUser.id, { isDemo: true });
      } catch (error) {
        console.error('Gagal membuat sesi tamu otomatis:', error);
        return res.redirect('/login.html');
      }
    }
  }
  next();
});

// 3. Melayani file statis Front-End
app.use(express.static(__dirname));

// 4. Daftarkan API Routes
app.use('/api/auth', authRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/tasks', taskRoutes);

// 5. Pastikan endpoint API yang tidak terdaftar selalu membalas JSON 404
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Endpoint API tidak ditemukan' });
});

// 6. Fallback Route untuk halaman HTML
app.get(/.*/, (req, res) => {
  const targetFile = req.path === '/' ? 'index.html' : req.path;
  const filePath = path.join(__dirname, targetFile);

  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(404).send('Halaman tidak ditemukan');
    }
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server Scheduler berjalan di http://localhost:${PORT}`);
  });
}

module.exports = app;