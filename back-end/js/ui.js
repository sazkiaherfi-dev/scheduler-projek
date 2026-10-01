// ==========================================
// 1. LOGIKA TEMA (DARK MODE / LIGHT MODE)
// ==========================================
const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;

// Cek preferensi sebelumnya di localStorage
if (localStorage.getItem('theme') === 'dark') {
    htmlElement.classList.add('dark');
}

themeToggle.addEventListener('click', () => {
    htmlElement.classList.toggle('dark');
    if (htmlElement.classList.contains('dark')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
});

// ==========================================
// 2. LOGIKA NAVIGASI (PINDAH HALAMAN)
// ==========================================
function switchView(viewId) {
    // Sembunyikan semua section
    const sections = document.querySelectorAll('.view-section');
    sections.forEach(sec => {
        sec.classList.add('hidden');
        sec.classList.remove('block');
    });

    // Tampilkan section yang dituju
    const targetSection = document.getElementById(`view-${viewId}`);
    if (targetSection) {
        targetSection.classList.remove('hidden');
        targetSection.classList.add('block');
    }

    // Update indikator warna pada tombol sidebar
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        if (btn.getAttribute('data-target') === viewId) {
            btn.classList.add('bg-blue-600');
        } else {
            btn.classList.remove('bg-blue-600');
        }
    });
}

// ==========================================
// 3. LOGIKA BUKA TUTUP MODAL (POP-UP FORM)
// ==========================================
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('hidden');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('hidden');
    }
}

// Menutup modal jika area gelap di luar form di-klik
window.addEventListener('click', (e) => {
    if (e.target.id === 'modalTugas') closeModal('modalTugas');
    if (e.target.id === 'modalJadwal') closeModal('modalJadwal');
});

// ==========================================
// 4. LOGIKA TAMBAH DATA JADWAL KE TABEL
// ==========================================
const formTambahJadwal = document.getElementById('formTambahJadwal');
const scheduleTableBody = document.getElementById('scheduleTableBody');

if (formTambahJadwal) {
    formTambahJadwal.addEventListener('submit', function(e) {
        e.preventDefault(); // Mencegah halaman refresh saat tombol simpan diklik

        // Ambil nilai dari input form
        const mataPelajaran = document.getElementById('inputMatkul').value;
        const hari = document.getElementById('inputHari').value;
        const jamMulai = document.getElementById('inputJamMulai').value;
        const jamSelesai = document.getElementById('inputJamSelesai').value;
        const catatan = document.getElementById('inputCatatan').value;

        // Buat elemen baris tabel baru (<tr>)
        const tr = document.createElement('tr');
        tr.className = 'border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700';
        
        // Masukkan data ke dalam sel tabel (<td>)
        tr.innerHTML = `
            <td class="p-3 font-bold">${hari}</td>
            <td class="p-3">${jamMulai} - ${jamSelesai}</td>
            <td class="p-3">${mataPelajaran}</td>
            <td class="p-3">${catatan}</td>
            <td class="p-3">
                <button class="text-red-500 hover:underline" onclick="this.closest('tr').remove()">Hapus</button>
            </td>
        `;

        // Tambahkan baris baru ke dalam tabel
        scheduleTableBody.appendChild(tr);

        // Tutup modal form dan kosongkan isian form
        closeModal('modalJadwal');
        formTambahJadwal.reset();
    });
}