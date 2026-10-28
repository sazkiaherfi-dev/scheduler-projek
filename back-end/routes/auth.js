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

async function hashPassword(password) {
    const salt = crypto.randomBytes(16).toString('hex');
    const derivedKey = await scrypt(password, salt, PASSWORD_KEY_LENGTH);
    return `scrypt$${salt}$${derivedKey.toString('hex')}`;
}

async function verifyPassword(password, storedHash) {
    const [algorithm, salt, hash, extra] = storedHash.split('$');
    if (algorithm !== 'scrypt' || !salt || !hash || extra) return false;

    const expectedHash = Buffer.from(hash, 'hex');
    if (expectedHash.length !== PASSWORD_KEY_LENGTH) return false;

    const derivedKey = await scrypt(password, salt, PASSWORD_KEY_LENGTH);
    return crypto.timingSafeEqual(expectedHash, derivedKey);
}

router.post('/register', async (req, res) => {
    const name = typeof req.body?.name === 'string' ? req.body.name.trim() : '';
    const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const password = typeof req.body?.password === 'string' ? req.body.password : '';

    if (!name || name.length > 80) {
        return res.status(400).json({ error: 'Nama wajib diisi dan maksimal 80 karakter' });
    }
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: 'Alamat email tidak valid' });
    }
    if (password.length < 8 || password.length > 128) {
        return res.status(400).json({ error: 'Password harus terdiri dari 8 sampai 128 karakter' });
    }

    try {
        const passwordHash = await hashPassword(password);
        const user = await prisma.user.create({
            data: { name, email, password: passwordHash },
            select: { id: true, name: true, email: true }
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
        const passwordMatches = user && await verifyPassword(password, user.password);
        if (!passwordMatches) {
            return res.status(401).json({ error: 'Email atau password salah' });
        }

        setSessionCookie(res, user.id);
        res.json({ user: { id: user.id, name: user.name, email: user.email } });
    } catch (error) {
        console.error('Gagal memproses login:', error);
        res.status(500).json({ error: 'Login gagal. Silakan coba lagi.' });
    }
});

router.post('/logout', (req, res) => {
    clearSessionCookie(res);
    res.json({ message: 'Berhasil keluar' });
});

router.get('/me', requireAuth, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.userId },
            select: { id: true, name: true, email: true }
        });
        if (!user) {
            clearSessionCookie(res);
            return res.status(401).json({ error: 'Sesi tidak valid. Silakan masuk kembali.' });
        }
        res.json({ user });
    } catch (error) {
        console.error('Gagal mengambil profil pengguna:', error);
        res.status(500).json({ error: 'Gagal memuat profil pengguna' });
    }
});

router.patch('/me', requireAuth, async (req, res) => {
    const name = typeof req.body?.name === 'string' ? req.body.name.trim() : '';
    const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const password = typeof req.body?.password === 'string' ? req.body.password : '';

    if (!name || name.length > 80) {
        return res.status(400).json({ error: 'Nama wajib diisi dan maksimal 80 karakter' });
    }
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: 'Alamat email tidak valid' });
    }
    if (password && (password.length < 8 || password.length > 128)) {
        return res.status(400).json({ error: 'Password harus terdiri dari 8 sampai 128 karakter' });
    }

    try {
        const payload = {
            name,
            email,
            ...(password ? { password: await hashPassword(password) } : {})
        };

        const user = await prisma.user.update({
            where: { id: req.userId },
            data: payload,
            select: { id: true, name: true, email: true }
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
