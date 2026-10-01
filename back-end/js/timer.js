// --- LOGIKA POMODORO TIMER ---
let timerInterval;
let timeLeft = 25 * 60; // 25 Menit dalam detik
let isRunning = false;

const timeDisplay = document.getElementById('timeDisplay');
const btnStart = document.getElementById('btnStart');
const btnPause = document.getElementById('btnPause');
const btnReset = document.getElementById('btnReset');

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    // Format agar selalu 2 digit (contoh: 09:05)
    timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function startTimer() {
    if (!isRunning && timeLeft > 0) {
        isRunning = true;
        timerInterval = setInterval(() => {
            timeLeft--;
            updateDisplay();
            
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                isRunning = false;
                alert("Sesi Pomodoro Selesai! Waktunya istirahat 5 menit.");
            }
        }, 1000); // Eksekusi setiap 1 detik (1000 ms)
    }
}

function pauseTimer() {
    clearInterval(timerInterval);
    isRunning = false;
}

function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    timeLeft = 25 * 60; // Kembalikan ke 25 menit
    updateDisplay();
}

// Event Listeners untuk Tombol Timer
btnStart.addEventListener('click', startTimer);
btnPause.addEventListener('click', pauseTimer);
btnReset.addEventListener('click', resetTimer);

// Inisialisasi tampilan angka saat pertama kali dimuat
updateDisplay();