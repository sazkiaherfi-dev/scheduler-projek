Berikut adalah perumusan tema aplikasi **Scheduler** yang telah disusun ulang agar lebih terarah, realistis untuk diselesaikan dalam 12 pertemuan, serta disajikan dengan bahasa yang formal, profesional, namun tetap mudah dipahami (dimanusiakan).

---

### 1. TEMA (Mengerucut)

**Nama Aplikasi:** Scheduler (Aplikasi Web Pusat Manajemen Waktu dan Ruang Produktivitas Mahasiswa)

**Deskripsi Masalah**
Mahasiswa sering kali kesulitan menyeimbangkan waktu antara jadwal perkuliahan yang padat dan tenggat waktu tugas yang menumpuk. Di sisi lain, meskipun banyak yang sadar akan pentingnya metode belajar saintifik (seperti *Pomodoro*, *Feynman Technique*, atau *Active Recall*), alat bantu yang ada saat ini masih terpisah-pisah. Akibatnya, mahasiswa harus menggunakan beberapa aplikasi berbeda untuk mencatat tugas, mengatur *timer*, dan membuat catatan, yang justru memecah fokus dan menurunkan produktivitas.

**Profil Target Pengguna**
Mahasiswa aktif yang membutuhkan alat bantu terpusat untuk mengatur rutinitas akademik, melacak tenggat waktu (*deadline*) tugas, serta ingin meningkatkan kualitas fokus dan pemahaman belajar mereka melalui metode yang terstruktur.

**Manfaat Aplikasi**
Scheduler hadir tidak sekadar sebagai aplikasi pengingat tugas (To-Do List) biasa, melainkan berevolusi menjadi ruang produktivitas yang utuh. Aplikasi ini membantu pengguna untuk memusatkan seluruh kegiatan akademiknya di satu tempat, meningkatkan kedisiplinan melalui pelacakan waktu, serta memfasilitasi teknik belajar yang mendalam agar pemahaman materi kuliah menjadi lebih maksimal.

**Daftar Fitur Inti (Ruang Lingkup 12 Pertemuan)**
Mengingat batas pengerjaan dalam 12 pertemuan menggunakan *tech-stack* dasar (HTML, CSS, JavaScript) dengan tambahan integrasi *back-end* dan *database* mandiri, fitur akan difokuskan pada fungsionalitas esensial:

1. **Autentikasi & Manajemen Profil:** Pendaftaran akun, *login*, dan pengaturan data dasar pengguna.
2. **Dashboard Interaktif & Pelacak Progres:** Halaman utama yang merangkum tugas yang belum selesai, jadwal terdekat, aksi cepat (*quick add*), serta grafik statistik sederhana mengenai produktivitas mingguan.
3. **Manajemen Jadwal & Tugas (CRUD):** Fungsionalitas untuk menambah, melihat, mengubah, dan menghapus jadwal perkuliahan serta tugas (dilengkapi filter status dan tenggat waktu).
4. **Ruang Produktivitas (Sesi Belajar):**
* *Pomodoro Timer:* Waktu fokus dan istirahat yang dapat diatur serta dihubungkan langsung dengan tugas yang sedang dikerjakan.
* *Feynman Notes:* Area mengetik terstruktur yang menantang pengguna menyederhanakan materi kuliah.
* *Active Recall / Blurting Canvas:* Area teks dengan fitur sembunyikan/tampilkan (*hide/show*) untuk menguji daya ingat pengguna terhadap materi.


5. **Notifikasi In-App lokal:** Peringatan visual (seperti *badge* merah atau *pop-up toast*) saat pengguna *login* jika ada tugas yang tenggat waktunya sudah dekat.
6. **Desain Responsif & Dark Mode:** Tampilan antarmuka yang nyaman di mata untuk penggunaan malam hari serta fleksibel saat diakses melalui *smartphone* maupun *desktop*.

**Fitur yang Tidak Dikerjakan (Out of Scope)**
Untuk menjaga fokus dan memastikan proyek selesai tepat waktu, beberapa fitur lanjutan ditiadakan pada pengembangan tahap ini:

* Sinkronisasi dengan kalender eksternal (seperti Google Calendar atau Outlook).
* Pengiriman notifikasi ke luar aplikasi (misalnya melalui Email, WhatsApp, atau *Push Notification* di *smartphone*).
* Fitur kolaborasi atau berbagi catatan dengan pengguna lain (*multiplayer/sharing*).
* Pembuatan versi aplikasi *mobile* asli (*Native Android/iOS App*).

**Kriteria Keberhasilan Aplikasi**

1. **Fungsionalitas Alur Utama Berjalan Lancar:** Pengguna dapat menyelesaikan *User Flow* utama tanpa hambatan—mulai dari mendaftar, menambahkan jadwal/tugas, menjalankan sesi belajar *Pomodoro/Feynman*, hingga menandai tugas selesai.
2. **Keandalan Integrasi Data:** Data akademik (jadwal, tugas, riwayat belajar) tersimpan dengan aman di dalam *database* mandiri dan dapat dimuat ulang (*retrieve*) dengan benar saat pengguna login kembali.
3. **Stabilitas dan Aksesibilitas UI/UX:** Aplikasi dapat digunakan dengan tampilan yang rapi dan fungsi yang utuh, baik saat dibuka di *browser* laptop maupun layar smartphone (responsif).
4. **Ketepatan Waktu Penyelesaian:** Seluruh daftar fitur inti yang direncanakan dapat diimplementasikan dan bebas dari error fatal (bug mayor) dalam batas waktu 12 pertemuan perkuliahan.
