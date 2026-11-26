const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Semua endpoint jadwal wajib memiliki sesi pengguna (termasuk sesi demo/tamu)
router.use(requireAuth);

// GET: Mengambil semua data jadwal milik pengguna
router.get('/', async (req, res) => {
    try {
        const schedules = await prisma.schedule.findMany({
            where: { userId: req.userId },
            orderBy: [
                { dayOfWeek: 'asc' },
                { startTime: 'asc' }
            ]
        });
        res.json(schedules);
    } catch (error) {
        console.error('Gagal mengambil data jadwal:', error);
        res.status(500).json({ error: 'Gagal mengambil data jadwal' });
    }
});

// POST: Menambahkan jadwal baru
router.post('/', async (req, res) => {
    const courseName = typeof req.body?.courseName === 'string' ? req.body.courseName.trim() : '';
    const dayOfWeek = typeof req.body?.dayOfWeek === 'string' ? req.body.dayOfWeek.trim() : '';
    const startTime = typeof req.body?.startTime === 'string' ? req.body.startTime.trim() : '';
    const endTime = typeof req.body?.endTime === 'string' ? req.body.endTime.trim() : '';
    const room = typeof req.body?.room === 'string' ? req.body.room.trim() : '';

    if (!courseName || !dayOfWeek || !startTime || !endTime) {
        return res.status(400).json({
            error: 'Nama mata kuliah, hari, jam mulai, dan jam selesai wajib diisi'
        });
    }

    try {
        const newSchedule = await prisma.schedule.create({
            data: {
                userId: req.userId,
                courseName,
                dayOfWeek,
                startTime,
                endTime,
                room: room || null
            }
        });
        res.status(201).json(newSchedule);
    } catch (error) {
        console.error('Gagal menyimpan jadwal:', error);
        res.status(500).json({ error: 'Gagal menyimpan jadwal ke database' });
    }
});

// DELETE: Menghapus jadwal berdasarkan ID
router.delete('/:id', async (req, res) => {
    const scheduleId = Number(req.params.id);

    if (!Number.isInteger(scheduleId) || scheduleId <= 0) {
        return res.status(400).json({ error: 'ID jadwal tidak valid' });
    }

    try {
        await prisma.schedule.delete({
            where: {
                id: scheduleId,
                userId: req.userId
            }
        });
        res.json({ message: 'Jadwal berhasil dihapus' });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Jadwal tidak ditemukan' });
        }
        console.error('Gagal menghapus jadwal:', error);
        res.status(500).json({ error: 'Gagal menghapus jadwal' });
    }
});

module.exports = router;