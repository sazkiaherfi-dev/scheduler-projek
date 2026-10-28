const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { requireAuth } = require('../middleware/auth');
const prisma = new PrismaClient();

router.use(requireAuth);

// GET: Mengambil semua data jadwal milik pengguna
router.get('/', async (req, res) => {
    try {
        const schedules = await prisma.schedule.findMany({ where: { userId: req.userId } });
        res.json(schedules);
    } catch (error) {
        res.status(500).json({ error: "Gagal mengambil data jadwal" });
    }
});

// POST: Menambahkan jadwal baru
router.post('/', async (req, res) => {
    const { courseName, dayOfWeek, startTime, endTime, room } = req.body;
    try {
        const newSchedule = await prisma.schedule.create({
            data: {
                userId: req.userId,
                courseName,
                dayOfWeek,
                startTime,
                endTime,
                room
            }
        });
        res.status(201).json(newSchedule);
    } catch (error) {
        res.status(500).json({ error: "Gagal menyimpan jadwal ke database" });
    }
});

// DELETE: Menghapus jadwal berdasarkan ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.schedule.delete({
            where: { id: Number(id), userId: req.userId }
        });
        res.json({ message: "Jadwal berhasil dihapus" });
    } catch (error) {
        res.status(500).json({ error: "Gagal menghapus jadwal" });
    }
});

module.exports = router;