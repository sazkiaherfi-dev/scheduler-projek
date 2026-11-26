document.addEventListener('DOMContentLoaded', () => {
    // --- LOGIKA POMODORO TIMER ---
    let timerInterval = null;
    let timeLeft = 25 * 60; // 25 Menit dalam detik
    let isRunning = false;

    const timeDisplay = document.getElementById('timeDisplay');
    const btnStart = document.getElementById('btnStart');
    const btnPause = document.getElementById('btnPause');
    const btnReset = document.getElementById('btnReset');

    // Hentikan eksekusi dengan aman jika elemen timer tidak ada di halaman ini
    if (!timeDisplay || !btnStart || !btnPause || !btnReset) {
        return;
    }

    function updateDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    function startTimer() {
        if (isRunning || timeLeft <= 0) return;

        isRunning = true;
        // Pastikan tidak ada interval ganda yang menumpuk
        clearInterval(timerInterval);

        timerInterval = setInterval(() => {
            timeLeft--;
            updateDisplay();

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                timerInterval = null;
                isRunning = false;
                alert("Sesi Pomodoro Selesai! Waktunya istirahat 5 menit.");
            }
        }, 1000);
    }

    function pauseTimer() {
        clearInterval(timerInterval);
        timerInterval = null;
        isRunning = false;
    }

    function resetTimer() {
        clearInterval(timerInterval);
        timerInterval = null;
        isRunning = false;
        timeLeft = 25 * 60;
        updateDisplay();
    }

    // Event Listeners untuk Tombol Timer
    btnStart.addEventListener('click', startTimer);
    btnPause.addEventListener('click', pauseTimer);
    btnReset.addEventListener('click', resetTimer);

    // Inisialisasi tampilan angka saat pertama kali dimuat
    updateDisplay();
});