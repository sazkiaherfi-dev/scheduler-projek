const crypto = require('crypto');
const { promisify } = require('util');
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const {
    clearSessionCookie,
    requireAuth,
    setSessionCookie
} = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();
const scrypt = promisify(crypto.scrypt);

const PASSWORD_KEY_LENGTH = 64;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USER_PUBLIC_SELECT = { id: true, name: true, email: true };
const DUMMY_HASH = `scrypt$${'0'.repeat(32)}$${'0'.repeat(128)}`;

// --- Helper Functions ---

async function hashPassword(password) {
    const salt = crypto.randomBytes(16).toString('hex');
    const derivedKey = await scrypt(password, salt, PASSWORD_KEY_LENGTH);
    return `scrypt$${salt}$${derivedKey.toString('hex')}`;
}

async function verifyPassword(password, storedHash) {
    if (typeof storedHash !== 'string') return false;

    const [algorithm, salt, hash, extra] = storedHash.split('$');
    if (algorithm !== 'scrypt' || !salt || !hash || extra) return false;

    const expectedHash = Buffer.from(hash, 'hex');
    if (expectedHash.length !== PASSWORD_KEY_LENGTH) return false;

    const derivedKey = await scrypt(password, salt, PASSWORD_KEY_LENGTH);
    return crypto.timingSafeEqual(expectedHash, derivedKey);
}

function validateUserInput(body = {}, { requirePassword = true } = {}) {
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body.password === 'string' ? body.password : '';

    if (!name || name.length > 80) {
        return { error: 'Nama wajib diisi dan maksimal 80 karakter' };
    }
    if (email.length > 254 || !EMAIL_REGEX.test(email)) {
        return { error: 'Alamat email tidak valid' };
    }
    if ((requirePassword || password) && (password.length < 8 || password.length > 128)) {
        return { error: 'Password harus terdiri dari 8 sampai 128 karakter' };
    }

    return { data: { name, email, password } };
}

// Fungsi pembuatan sesi demo terpusat (dengan fallback tanpa DB untuk lingkungan read-only seperti Vercel)
async function createDemoSession(res) {
    try {
        const user = await prisma.user.create({
            data: {
                name: 'Pengguna Demo',
                email: `demo-${crypto.randomUUID()}@demo.scheduler.local`,
                password: crypto.randomBytes(64).toString('hex')
            },
            select: USER_PUBLIC_SELECT
        });

        setSessionCookie(res, user.id, { isDemo: true });
        return user;
    } catch (error) {
        const fallbackDemoUser = {
            id: 999999,
            name: 'Pengguna Demo',
            email: 'demo@scheduler.local'
        };
        setSessionCookie(res, fallbackDemoUser.id, { isDemo: true });
        return fallbackDemoUser;
    }
}

// --- Auth Routes ---

router.post('/register', async (req, res) => {
    const { data, error: validationError } = validateUserInput(req.body, { requirePassword: true });
    if (validationError) {
        return res.status(400).json({ error: validationError });
    }

    try {
        const passwordHash = await hashPassword(data.password);
        const user = await prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: passwordHash
            },
            select: USER_PUBLIC_SELECT
        });

        setSessionCookie(res, user.id);
        res.status(201).json({ user });
    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(409).json({ error: 'Email sudah terdaftar' });
        }
        console.error('Gagal mendaftarkan akun:', error);
        res.status(500).json({ error: 'Pendaftaran gagal. Silakan coba lagi.' });
    }
});

router.post('/login', async (req, res) => {
    const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const password = typeof req.body?.password === 'string' ? req.body.password : '';

    if (!email || !password) {
        return res.status(400).json({ error: 'Email dan password wajib diisi' });
    }

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        const isPasswordValid = await verifyPassword(password, user?.password || DUMMY_HASH);

        if (!user || !isPasswordValid) {
            return res.status(401).json({ error: 'Email atau password salah' });
        }

        setSessionCookie(res, user.id);
        res.json({
            user: { id: user.id, name: user.name, email: user.email }
        });
    } catch (error) {
        console.error('Gagal memproses login:', error);
        res.status(500).json({ error: 'Login gagal. Silakan coba lagi.' });
    }
});

router.post('/demo', async (req, res) => {
    try {
        const user = await createDemoSession(res);
        res.status(201).json({ user, isDemo: true });
    } catch (error) {
        console.error('Gagal membuat sesi demo:', error);
        res.status(500).json({ error: 'Mode demo gagal dibuka. Silakan coba lagi.' });
    }
});

router.post('/logout', (req, res) => {
    clearSessionCookie(res);
    res.json({ message: 'Berhasil keluar' });
});

router.get('/me', requireAuth, async (req, res) => {
    if (req.isDemo && req.userId === 999999) {
        return res.json({
            user: { id: 999999, name: 'Pengguna Demo', email: 'demo@scheduler.local' },
            isDemo: true
        });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: req.userId },
            select: USER_PUBLIC_SELECT
        });

        // Jika data user tidak ditemukan di DB (misal setelah reset DB), otomatis buatkan sesi demo baru
        if (!user) {
            const demoUser = await createDemoSession(res);
            return res.json({ user: demoUser, isDemo: true });
        }

        res.json({ user, isDemo: req.isDemo });
    } catch (error) {
        if (req.isDemo) {
            const demoUser = await createDemoSession(res);
            return res.json({ user: demoUser, isDemo: true });
        }
        console.error('Gagal mengambil profil pengguna:', error);
        res.status(500).json({ error: 'Gagal memuat profil pengguna' });
    }
});

router.patch('/me', requireAuth, async (req, res) => {
    if (req.isDemo) {
        return res.status(403).json({ error: 'Profil tidak dapat diubah dalam mode demo' });
    }

    const { data, error: validationError } = validateUserInput(req.body, { requirePassword: false });
    if (validationError) {
        return res.status(400).json({ error: validationError });
    }

    try {
        const payload = {
            name: data.name,
            email: data.email,
            ...(data.password ? { password: await hashPassword(data.password) } : {})
        };

        const user = await prisma.user.update({
            where: { id: req.userId },
            data: payload,
            select: USER_PUBLIC_SELECT
        });

        res.json({ user });
    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(409).json({ error: 'Email sudah digunakan oleh akun lain' });
        }
        console.error('Gagal memperbarui profil pengguna:', error);
        res.status(500).json({ error: 'Gagal memperbarui profil pengguna' });
    }
});

module.exports = router;
module.exports.hashPassword = hashPassword;
module.exports.verifyPassword = verifyPassword;
module.exports.createDemoSession = createDemoSession;