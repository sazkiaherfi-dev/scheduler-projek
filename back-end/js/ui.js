// ==========================================
// 1. LOGIKA TEMA (DARK MODE / LIGHT MODE)
// ==========================================
const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;
const logoutButton = document.getElementById('logoutButton');
const userGreeting = document.getElementById('userGreeting');
const userInitial = document.getElementById('userInitial');
const profileName = document.getElementById('profileName');
const profileNameDetail = document.getElementById('profileNameDetail');
const profileEmail = document.getElementById('profileEmail');
const profileInitial = document.getElementById('profileInitial');

async function loadCurrentUser() {
    try {
        const response = await fetch('/api/auth/me', { credentials: 'same-origin' });
        if (!response.ok) {
            throw new Error('Belum login');
        }

        const result = await response.json();
        const user = result.user || {};
        const firstName = (user.name || 'User').trim();
        const initial = firstName.charAt(0).toUpperCase();
        if (userGreeting) userGreeting.textContent = `Hai, ${firstName}`;
        if (userInitial) userInitial.textContent = initial || 'U';
        if (profileName) profileName.textContent = user.name || '-';
        if (profileNameDetail) profileNameDetail.textContent = user.name || '-';
        if (profileEmail) profileEmail.textContent = user.email || '-';
        if (profileInitial) profileInitial.textContent = initial || 'U';
    } catch (error) {
        window.location.href = '/login.html';
    }
}

// Cek preferensi sebelumnya di localStorage
if (localStorage.getItem('theme') === 'dark') {
    htmlElement.classList.add('dark');
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        htmlElement.classList.toggle('dark');
        if (htmlElement.classList.contains('dark')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    });
}

if (logoutButton) {
    logoutButton.addEventListener('click', async () => {
        try {
            await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'same-origin'
            });
        } finally {
            window.location.href = '/login.html';
        }
    });
}

loadCurrentUser();

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

// ==========================================
// 5. LOGIKA DATA TUGAS DARI API
// ==========================================
const formTambahTugas = document.getElementById('formTambahTugas');
const taskTableBody = document.getElementById('taskTableBody');
const taskMessage = document.getElementById('taskMessage');
const countPending = document.getElementById('countPending');
const taskStatusFilter = document.getElementById('taskStatusFilter');
const taskDeadlineFilter = document.getElementById('taskDeadlineFilter');
const resetTaskFilters = document.getElementById('resetTaskFilters');
let allTasks = [];

function showTaskMessage(message, isError = false) {
    if (!taskMessage) return;

    taskMessage.textContent = message;
    taskMessage.classList.remove('hidden', 'text-red-600', 'text-gray-500');
    taskMessage.classList.add(isError ? 'text-red-600' : 'text-gray-500');
}

function createTaskCell(text) {
    const cell = document.createElement('td');
    cell.className = 'p-3';
    cell.textContent = text;
    return cell;
}

async function readTaskApiResponse(response) {
    const responseText = await response.text();
    const contentType = response.headers.get('content-type') || '';

    if (!contentType.includes('application/json')) {
        const detail = responseText.startsWith('<')
            ? 'Server mengirim halaman HTML, bukan respons API. Mulai ulang backend dari folder back-end.'
            : 'Server mengirim respons yang bukan JSON.';
        throw new Error(`${detail} (HTTP ${response.status})`);
    }

    try {
        return responseText ? JSON.parse(responseText) : {};
    } catch (error) {
        console.error('Respons API tugas bukan JSON yang valid:', error);
        throw new Error(`Respons API tugas tidak valid (HTTP ${response.status}).`);
    }
}

function createTaskRow(task) {
    const row = document.createElement('tr');
    row.className = 'border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700';

    const subjectCell = createTaskCell(task.description || 'Umum');
    const titleCell = createTaskCell(task.title || 'Tanpa judul');
    const statusCell = createTaskCell('');
    const statusBadge = document.createElement('span');
    const isCompleted = task.status === 'COMPLETED';
    statusBadge.className = isCompleted
        ? 'bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-bold'
        : 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-bold';
    statusBadge.textContent = isCompleted ? 'SELESAI' : task.status || 'PENDING';
    statusCell.appendChild(statusBadge);

    const deadlineCell = createTaskCell(
        task.deadline && !Number.isNaN(new Date(task.deadline).getTime())
            ? new Date(task.deadline).toLocaleDateString('id-ID', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            })
            : '-'
    );

    const actionCell = createTaskCell('');
    if (!isCompleted) {
        const completeButton = document.createElement('button');
        completeButton.type = 'button';
        completeButton.className = 'text-blue-500 hover:underline';
        completeButton.textContent = 'Selesai';
        completeButton.dataset.completeTask = String(task.id);
        actionCell.appendChild(completeButton);
    }

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = `${isCompleted ? '' : 'ml-3 '}text-red-500 hover:underline`;
    deleteButton.textContent = 'Hapus';
    deleteButton.dataset.deleteTask = String(task.id);
    actionCell.appendChild(deleteButton);

    row.append(subjectCell, titleCell, statusCell, deadlineCell, actionCell);
    return row;
}

function getLocalDateString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function matchesDeadlineFilter(task, filter) {
    if (filter === 'all') return true;

    const deadline = new Date(task.deadline);
    if (Number.isNaN(deadline.getTime())) return false;

    const deadlineDate = deadline.toISOString().slice(0, 10);
    const todayDate = getLocalDateString(new Date());
    if (filter === 'overdue') return deadlineDate < todayDate;
    if (filter === 'today') return deadlineDate === todayDate;

    const today = new Date(`${todayDate}T00:00:00Z`);
    const deadlineDay = new Date(`${deadlineDate}T00:00:00Z`);
    const daysAhead = Math.floor((deadlineDay - today) / 86400000);
    if (filter === 'week') return daysAhead >= 0 && daysAhead <= 7;
    if (filter === 'month') return daysAhead >= 0 && daysAhead <= 30;
    return true;
}

function renderTasks() {
    if (!taskTableBody) return;

    const statusFilter = taskStatusFilter?.value || 'all';
    const deadlineFilter = taskDeadlineFilter?.value || 'all';
    const tasks = allTasks.filter(task =>
        (statusFilter === 'all' || task.status === statusFilter) &&
        matchesDeadlineFilter(task, deadlineFilter)
    );
    taskTableBody.replaceChildren();
    const pendingTasks = allTasks.filter(task => task.status !== 'COMPLETED');
    if (countPending) {
        countPending.textContent = String(pendingTasks.length);
    }

    if (tasks.length === 0) {
        showTaskMessage(allTasks.length === 0
            ? 'Belum ada tugas. Tambahkan tugas baru untuk mulai.'
            : 'Tidak ada tugas yang cocok dengan filter.');
        return;
    }

    taskMessage?.classList.add('hidden');
    tasks.forEach(task => taskTableBody.appendChild(createTaskRow(task)));
}

async function loadTasks() {
    if (!taskTableBody) return;

    try {
        const response = await fetch('/api/tasks');
        if (!response.ok) {
            throw new Error(`Gagal memuat tugas (${response.status}).`);
        }

        const tasks = await readTaskApiResponse(response);
        if (!response.ok) {
            throw new Error(tasks.error || `Gagal memuat tugas (${response.status}).`);
        }
        if (!Array.isArray(tasks)) {
            throw new Error('Data tugas dari server tidak valid.');
        }

        allTasks = tasks;
        renderTasks();
    } catch (error) {
        console.error('Gagal memuat daftar tugas:', error);
        showTaskMessage('Daftar tugas gagal dimuat. Pastikan server berjalan lalu muat ulang halaman.', true);
    }
}

if (formTambahTugas) {
    formTambahTugas.addEventListener('submit', async event => {
        event.preventDefault();

        const titleInput = document.getElementById('inputNamaTugas');
        const subjectInput = document.getElementById('inputMataPelajaran');
        const deadlineInput = document.getElementById('inputDeadline');
        const submitButton = formTambahTugas.querySelector('button[type="submit"]');

        if (!titleInput || !subjectInput || !deadlineInput) {
            showTaskMessage('Form tugas tidak lengkap.', true);
            return;
        }

        if (submitButton) submitButton.disabled = true;

        try {
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: titleInput.value.trim(),
                    course: subjectInput.value.trim() || 'Umum',
                    deadline: deadlineInput.value
                })
            });

            const result = await readTaskApiResponse(response);
            if (!response.ok) {
                throw new Error(result.detail || result.error || `Gagal menyimpan tugas (${response.status}).`);
            }

            formTambahTugas.reset();
            closeModal('modalTugas');
            await loadTasks();
        } catch (error) {
            console.error('Gagal menyimpan tugas:', error);
            showTaskMessage(error.message || 'Tugas gagal disimpan. Periksa koneksi ke server.', true);
            alert(error.message || 'Tugas gagal disimpan. Periksa koneksi ke server.');
        } finally {
            if (submitButton) submitButton.disabled = false;
        }
    });
}

if (taskTableBody) {
    taskTableBody.addEventListener('click', async event => {
        const button = event.target.closest('[data-complete-task], [data-delete-task]');
        if (!button) return;

        button.disabled = true;
        try {
            const isDeleteAction = button.hasAttribute('data-delete-task');
            if (isDeleteAction && !confirm('Hapus tugas ini? Tindakan ini tidak dapat dibatalkan.')) {
                button.disabled = false;
                return;
            }

            const taskId = isDeleteAction ? button.dataset.deleteTask : button.dataset.completeTask;
            const response = await fetch(`/api/tasks/${taskId}${isDeleteAction ? '' : '/complete'}`, {
                method: isDeleteAction ? 'DELETE' : 'PATCH'
            });
            const result = await readTaskApiResponse(response);
            if (!response.ok) {
                throw new Error(result.error || `Gagal ${isDeleteAction ? 'menghapus' : 'memperbarui'} tugas (${response.status}).`);
            }
            await loadTasks();
        } catch (error) {
            console.error('Gagal memproses tugas:', error);
            showTaskMessage(error.message || 'Tugas gagal diperbarui.', true);
            button.disabled = false;
        }
    });
}

taskStatusFilter?.addEventListener('change', renderTasks);
taskDeadlineFilter?.addEventListener('change', renderTasks);
resetTaskFilters?.addEventListener('click', () => {
    if (taskStatusFilter) taskStatusFilter.value = 'all';
    if (taskDeadlineFilter) taskDeadlineFilter.value = 'all';
    renderTasks();
});

loadTasks();