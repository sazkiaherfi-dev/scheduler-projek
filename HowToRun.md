# Cara Menjalankan Web Scheduler

## Prasyarat
- Instal Node.js (versi 18+)
- Database lokal (misal: MySQL/PostgreSQL berjalan)

## Setup Backend
1. Buka terminal, masuk ke folder `back-end`.
2. Ketik `npm install` untuk mengunduh dependensi.
3. Buat file `.env` dan isi koneksi database.
4. Ketik `npx prisma db push` untuk migrasi database.
5. Ketik `npm start` atau `npm run dev` untuk menyalakan server.

## Setup Frontend
1. Buka terminal baru, masuk ke folder `front-end`.
2. (Sesuaikan petunjuknya: apakah pakai `npm run dev` untuk React/Vite, atau cukup buka `index.html` di browser).

## Langkah Menjalankan Aplikasi
1. Masuk ke direktori projek:
   ```bash
   cd back-end

   Install dependensi package:

Bash
npm install
Sinkronkan skema database Prisma:

Bash
npx prisma db push
Jalankan server aplikasi:

Bash
npm start
Akses melalui browser di: http://localhost:3000

pengujian unit test 
npm test 
