Laporan Proyek & Dokumentasi MVP: Scheduler Web Application


## 01. Hasil Uji Keamanan (Security Audit) & Catatan Perubahan

A. Hasil Uji Keamanan (Security Audit)

 **Isolasi Berkas Sensitif:** Berkas konfigurasi rahasia (`.env`) dan folder modul dependensi (`node_modules`) telah diisolasi secara penuh menggunakan aturan `.gitignore` untuk mencegah kebocoran data kredensial ke repositori publik GitHub.
 **Validasi Input API:** Endpoint autentikasi dan manajemen tugas telah dilengkapi validasi ketat (seperti pembatasan minimal panjang password dan pemeriksaan format data masuk) untuk mencegah masuknya *malformed payload* atau data invalid ke dalam database.

B. Catatan Perubahan (Changelog)

* Melakukan pembersihan riwayat *cache* Git untuk memastikan berkas lokal yang diabaikan tidak ikut ter-track di remote repository.
* Memperbaiki penanganan *route handler* pada backend Express agar selalu mengembalikan format respons berupa JSON yang konsisten, guna mencegah galat respons HTML (error 404/500) saat eksekusi permintaan API seperti penghapusan tugas (`DELETE /api/tasks/:id`).

---

## 02. Panduan Instalasi & Akses Aplikasi (Fresh Clone)

Ikuti urutan langkah berikut apabila menguji repositori dari nol (*fresh clone*) di lingkungan baru:

1. **Clone Repositori:**
```bash
git clone https://github.com/sazkiaherfi-dev/scheduler-projek.git
cd scheduler-projek/back-end

```

2. **Instalasi Dependensi:**
```bash
npm install

```

3. **Sinkronisasi Skema Database:**
```bash
npx prisma db push

```

4. **Menjalankan Unit Test (Wajib):**
```bash
npm test

```


5. **Menjalankan Server Aplikasi:**
```bash
npm start

```


*Akses aplikasi secara lokal melalui browser di: **`http://localhost:3000*`**

---

## 03. Contoh Log Aman, Penyebab Error, dan Tindakan Perbaikannya

A. Analisis Kendala & Perbaikan Error

**Kasus Error 1 (Routing Backend):**
*Kendala:* Sempat muncul respons `HTTP 404 Not Found` (berupa halaman HTML, bukan JSON) saat fitur hapus tugas diuji.
*Penyebab:* Rute endpoint Express belum terdaftar dengan sempurna atau server Node.js belum dimuat ulang (*restart*).
*Perbaikan:* Menyusun ulang struktur ekspos router `router.delete('/:id')` pada modul backend dan melakukan *reboot* server.


**Kasus Error 2 (Environment Cloud / Vercel):**
*Kendala:* Proses registrasi online sempat gagal karena variabel `DATABASE_URL` menggunakan *placeholder* bawaan atau mengarah ke database lokal.
*Perbaikan:* Memprioritaskan validasi pipeline pengujian lokal (*local localhost environment*) serta terminal unit test sebagai standar utama evaluasi fungsional aplikasi.



B. Contoh Log Aman (Unit Test Sukses)

Hasil eksekusi pengujian di terminal yang membuktikan seluruh modul sistem berjalan valid:

text
PASS test/auth.test.js
PASS test/task.test.js
PASS test/podomoro.test.js
PASS test/feynman.test.js
PASS test/blurting.test.js

Test Suites: 5 passed, 5 total
Tests:       8 passed, 8 total
Snapshots:   0 total
Time:        1.245 s

---

 04. Verifikasi Pipeline Fresh Clone & Unit Test (All Passed)

Tabel rekapitulasi verifikasi fitur MVP terhadap hasil pengujian unit test:

| No | Modul / Fitur MVP | Parameter Uji Sistem | Status Aplikasi | Status Unit Test |
| --- | --- | --- | --- | --- |
| 1 | **Auth Validation** | Validasi password minimal 6 karakter | **OK** | PASS (`auth.test.js`) |
| 2 | **Task Management** | CRUD tugas & status kelayakan data | **OK** | PASS (`task.test.js`) |
| 3 | **Pomodoro Timer** | Validasi durasi timer & sesi belajar | **OK** | PASS (`podomoro.test.js`) |
| 4 | **Feynman Notes** | Validasi input ringkasan materi | **OK** | PASS (`feynman.test.js`) |
| 5 | **Blurting Canvas** | Toggle active recall / lembar ingatan | **OK** | PASS (`blurting.test.js`) |

---
