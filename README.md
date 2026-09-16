Deskripsi 

Scheduler adalah aplikasi berbasis web yang dirancang sebagai pusat manajemen waktu dan produktivitas bagi mahasiswa. Projek Scheduler ini juga merupakan projek lanjutan dari projek kelompok pertama saya di semester 1 dari matakuliah Algoritma, dan saya memutuskan untuk melanjutkan projek ini agar bisa memaksimalkan semua potensi dari ide awalnya. Jika sebelumnya aplikasi ini dibangun dengan logika dasar yang sederhana, kini Scheduler telah berevolusi dengan mengintegrasikan sistem back-end dan database mandiri. Selain itu, aplikasi ini dikembangkan lebih jauh dengan perbaikan UI/UX, navigasi yang lebih intuitif, dan penambahan fitur 'Ruang Belajar' yang memfasilitasi teknik belajar saintifik (seperti Pomodoro, Feynman, Active Recall, dan Blurting Method), menjadikannya bukan sekadar pengingat tugas, melainkan ruang produktivitas yang utuh.

Fitur Utama

Dashboard Interaktif: Menampilkan ringkasan tugas belum selesai, jadwal terdekat, dan aksi cepat (quick add).
Manajemen Jadwal (CRUD): Fitur untuk menambah, melihat, mengubah, dan menghapus jadwal mata kuliah beserta detail harinya.
Pelacak Status Tugas (CRUD): Daftar tugas lengkap dengan filter (berdasarkan status, deadline, mata pelajaran) dan tombol untuk menandai tugas telah selesai.
Manajemen Profil: Pengaturan informasi dasar pengguna (nama, email, password) yang tersimpan aman di database.

Ruang Produktivitas (Fitur Baru):
Pomodoro Timer: Timer bawaan di dalam website dengan interval waktu yang bisa disesuaikan (misal: 25 menit fokus, 5 menit istirahat) yang bisa dihubungkan dengan tugas tertentu.
Feynman Notes: Form catatan khusus di mana pengguna "ditantang" untuk mengetik ulang materi kuliah dengan bahasa paling sederhana (seolah menjelaskan pada anak kecil).
Active Recall / Blurting Canvas: Area teks yang memiliki fitur hide/show. Pengguna bisa menuliskan semua yang mereka ingat (blurting), lalu menekan tombol untuk membandingkannya dengan catatan asli untuk melihat bagian mana yang terlewat.

3. Ide Pengembangan Tambahan (Saran Tambahan)

Statistik / Progress Tracker: Grafik sederhana di Dashboard yang menunjukkan berapa banyak tugas yang selesai minggu ini, atau berapa jam total belajar menggunakan Pomodoro timer. Ini sangat bagus untuk motivasi.
Dark Mode: Sangat penting untuk mahasiswa yang sering mengerjakan tugas atau belajar di malam hari demi kenyamanan mata.
Sistem Notifikasi In-App: Karena tidak ada sinkronisasi ke kalender luar atau email, buat notifikasi lokal berupa badge merah muda atau pop-up toast saat login jika ada tugas yang deadline-nya besok.
Mobile-Responsive Design: Pastikan navigasi dan tabel-tabel di "Screenshot 2026-09-10 100258.png" bisa menyusut dan rapi saat diakses lewat smartphone

4. User Flow (Alur Pengguna)
Onboarding & Autentikasi: Pengguna mendaftar akun baru lalu melakukan Login.

Dashboard Overview: Setelah login, pengguna diarahkan ke Dashboard. Mereka bisa langsung melihat berapa tugas yang menunggu dan apakah hari ini ada jadwal kuliah.

Input Data Akademik:
Pengguna masuk ke menu Jadwal untuk memasukkan rutinitas kelas mingguan.
Pengguna masuk ke menu Tugas untuk menambahkan PR baru, lengkap dengan deadline.
Eksekusi Sesi Belajar (Action):
Pengguna memilih satu tugas di menu "Tugas".
Akan ada opsi "Mulai Belajar".
Pengguna diarahkan untuk memilih metode (Pomodoro / Feynman / Blurting).
Pengguna menjalankan sesi tersebut di dalam website.
Penyelesaian: Sesi belajar selesai, pengguna menandai status tugas menjadi Complete. Angka di Dashboard otomatis berkurang secara real-time.

tools yang akan digunakan 
html, css, javascript,
