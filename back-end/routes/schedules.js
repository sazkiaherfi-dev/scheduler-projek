const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET: Mengambil semua data jadwal
router.get('/', async (req, res) => {
    try {
        const schedules = await prisma.schedule.findMany();
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
                userId: 1, // Hardcode sementara agar tidak error sebelum fitur login aktif
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
            where: { id: Number(id) }
        });
        res.json({ message: "Jadwal berhasil dihapus" });
    } catch (error) {
        res.status(500).json({ error: "Gagal menghapus jadwall" });
    }
});

module.exports = router;