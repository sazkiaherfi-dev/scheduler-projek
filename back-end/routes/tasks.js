const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET: Mengambil semua data tugas
router.get('/', async (req, res) => {
    try {
        const tasks = await prisma.task.findMany();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: "Gagal mengambil data tugas" });
    }
});

// POST: Menambahkan tugas baru
router.post('/', async (req, res) => {
    const { title, description, deadline } = req.body;
    try {
        const newTask = await prisma.task.create({
            data: {
                userId: 1, // Hardcode sementara
                title,
                description,
                deadline: new Date(deadline), 
                status: 'PENDING'
            }
        });
        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ error: "Gagal menyimpan tugas ke database", detail: error.message });
    }
});

// PATCH: Mengubah status tugas menjadi selesai
router.patch('/:id/complete', async (req, res) => {
    const { id } = req.params;
    try {
        const updatedTask = await prisma.task.update({
            where: { id: Number(id) },
            data: { status: 'COMPLETED' }
        });
        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ error: "Gagal mengupdate status tugas" });
    }
});

module.exports = router;