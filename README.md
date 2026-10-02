 Web Scheduler App

Aplikasi web pengelola jadwal dan tugas akademik untuk mahasiswa, dengan fitur pembeda *To do list*.

### Deskripsi Proyek

Web Scheduler App membantu mahasiswa mencatat jadwal kuliah, mengelola tenggat waktu tugas, menentukan target jam belajar mingguan, 
memantau *progress* belajar, dan mengetahui berapa jam yang idealnya harus dialokasikan untuk belajar per hari sampai akhir pekan.

### Latar Belakang

Mahasiswa sering menghadapi jadwal kuliah yang padat dan tugas yang menumpuk. Tanpa pencatatan yang baik, tugas sering baru dikerjakan mendekati *deadline* (Sistem Kebut Semalam). Selain itu, mahasiswa jarang memiliki target belajar yang terstruktur. Mengetahui jumlah tugas saja tidak cukup membantu memanajemen waktu harian. Aplikasi ini menjawabnya dengan pengingat *deadline* visual dan angka target belajar harian yang mudah dipahami.

### Tujuan

1. Mencatat jadwal kuliah berdasarkan hari.
2. Mengelola daftar tugas (*tasks*) beserta *deadline*-nya.
3. Menentukan dan memantau target jam belajar mingguan.
4. Memberi peringatan ketika tenggat waktu tugas mendekati batas kritis (kurang dari 24 jam).
5. Menghitung *Daily Study Target* dari sisa target jam belajar dan sisa hari.
6. Menampilkan ringkasan produktivitas akademik mingguan.

### Target Pengguna

Mahasiswa aktif yang mengikuti perkuliahan dan memiliki beban tugas mandiri, yang ingin belajar mendisiplinkan manajemen waktu mereka. Hanya ada satu peran, yaitu pengguna (mahasiswa).

### Rencana Fitur

* Register, login, dan logout
* Kategori Kegiatan: Kuliah, Praktikum, Tugas, Ujian, Lainnya
* Pencatatan jadwal kuliah per hari
* Pencatatan tugas (*tasks*) berdasarkan *deadline*
* Pengaturan target belajar (jam) untuk minggu tertentu
* Status tugas dan peringatan *deadline* saat kurang dari 24 jam
* *Daily Study Target* (Batas Belajar Harian)
* Dashboard ringkasan akademik (jadwal hari ini & sisa tugas)
* Laporan mingguan dengan grafik/bar penyelesaian tugas sederhana

### Status Tenggat Waktu (Deadline)

| Sisa Waktu Tugas | Status |
| --- | --- |
| Lebih dari 3 Hari | Aman |
| 1 sampai 3 Hari | Perlu Perhatian |
| Kurang dari 24 Jam | Mendekati Batas (Kritis) |
| Lewat *Deadline* | Terlambat |

### Daily Study Target

Fitur utama aplikasi. Sistem menghitung jumlah jam yang secara ideal masih harus dipakai untuk belajar per hari sampai akhir pekan.

* Sisa Target Belajar = Target Belajar Mingguan - Total Jam Belajar Tercapai
* Sisa Hari = Hari terakhir minggu (Minggu) - Hari ini + 1 (termasuk hari ini)
* **Daily Study Target** = Sisa Target Belajar / Sisa Hari

**Contoh:** Target belajar 10 jam seminggu, jam belajar tercapai 4 jam, sisa target 6 jam, sisa 3 hari dalam pekan tersebut, maka batas belajar harian yang harus dipenuhi adalah 2 jam per hari.

### Rencana Tech Stack

| Bagian | Teknologi |
| --- | --- |
| Frontend | HTML, CSS, JavaScript (Vanilla API Fetch) |
| Backend | Node.js, Express.js |
| Database | SQLite |
| ORM | Prisma |
| Autentikasi | JWT, bcrypt |
| Infrastruktur | Node environment lokal |

### Rencana Struktur Proyek

```text
Web Scheduler/
  front-end/         # Antarmuka web (HTML, JS, CSS)
  back-end/          # Backend server
    prisma/          # Skema database & file dev.db
    routes/          # Endpoint API untuk jadwal, tugas, dll
    index.js         # File konfigurasi utama Express
  docs/              # Dokumen proyek
  README.md          # Dokumentasi utama proyek

```

### Dokumen Proyek

| Dokumen | Isi |
| --- | --- |
| 01-IDE_AWAL.md | Tiga ide awal dan alasan pemilihan Web Scheduler |
| 02-DEFINISI_MASALAH.md | Definisi masalah, fitur inti, dan kriteria keberhasilan |
| 03-PROJECT_SPEC.md | Spesifikasi teknis lengkap |

### Bagian yang Akan Ditambahkan Setelah Aplikasi Jadi

* Struktur database (ERD/Prisma Schema)
* Daftar *endpoint* API
* Instalasi dan konfigurasi `.env`
* Cara menjalankan (integrasi *backend* dan *frontend* lewat `localhost`)
* Keterbatasan
* Pengembangan selanjutnya
