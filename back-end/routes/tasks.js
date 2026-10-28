const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { requireAuth } = require('../middleware/auth');
const prisma = new PrismaClient();

router.use(requireAuth);

// GET: Ambil daftar tugas milik pengguna
router.get('/', async (req, res) => {
    try {
        const tasks = await prisma.task.findMany({ where: { userId: req.userId } });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: "Gagal mengambil data tugas" });
    }
});

// POST: Tambah tugas baru
router.post('/', async (req, res) => {
    const body = req.body || {};
    const title = typeof body.title === 'string' ? body.title.trim() : '';
    const rawDeadline = body.deadline;
    const deadlineDate = typeof rawDeadline === 'string' ? new Date(rawDeadline) : null;

    if (!title) {
        return res.status(400).json({ error: 'Judul tugas wajib diisi' });
    }

    if (!deadlineDate || Number.isNaN(deadlineDate.getTime())) {
        return res.status(400).json({ error: 'Deadline tidak valid' });
    }

    const course = typeof body.course === 'string' ? body.course.trim() : '';
    const subject = typeof body.subject === 'string' ? body.subject.trim() : '';
    const description = typeof body.description === 'string' ? body.description.trim() : '';

    try {
        const matkul = course || subject || 'Umum';

        const newTask = await prisma.task.create({
            data: {
                userId: req.userId,
                title,
                description: description || matkul,
                deadline: deadlineDate,
                status: 'PENDING'
            }
        });

        res.status(201).json(newTask);
    } catch (error) {
        console.error("Error Simpan Task:", error);
        res.status(500).json({ error: "Gagal menyimpan tugas", detail: error.message });
    }
});

// PATCH: Mengubah status tugas menjadi selesai
router.patch('/:id/complete', async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
        return res.status(400).json({ error: 'ID tugas tidak valid' });
    }

    try {
        const result = await prisma.task.updateMany({
            where: { id, userId: req.userId },
            data: { status: 'COMPLETED' }
        });

        if (!result.count) {
            return res.status(404).json({ error: 'Tugas tidak ditemukan' });
        }

        const updatedTask = await prisma.task.findUnique({ where: { id } });
        res.json(updatedTask);
    } catch (error) {
        console.error('Error memperbarui status tugas:', error);
        res.status(500).json({ error: 'Gagal mengupdate status tugas' });
    }
});

// DELETE: Menghapus tugas berdasarkan ID
router.delete('/:id', async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
        return res.status(400).json({ error: 'ID tugas tidak valid' });
    }

    try {
        const result = await prisma.task.deleteMany({ where: { id, userId: req.userId } });
        if (!result.count) {
            return res.status(404).json({ error: 'Tugas tidak ditemukan' });
        }

        res.json({ message: 'Tugas berhasil dihapus' });
    } catch (error) {
        console.error('Error menghapus tugas:', error);
        res.status(500).json({ error: 'Gagal menghapus tugas' });
    }
});

module.exports = router;