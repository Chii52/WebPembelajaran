/* --- LOGIKA TEBAK ANGKA --- */
let targetAngka = Math.floor(Math.random() * 10) + 1;

function mainkanGame() {
    const inputUser = document.getElementById('tebakInput').value;
    const resultText = document.getElementById('gameResult');

    if (inputUser == targetAngka) {
        resultText.style.color = "#7ec699"; // Hijau lembut
        resultText.innerText = "Benar! Angkanya adalah " + targetAngka;
        targetAngka = Math.floor(Math.random() * 10) + 1; // Reset
    } else if (inputUser > targetAngka) {
        resultText.style.color = "#ff5f56"; // Merah lembut
        resultText.innerText = "Terlalu tinggi!";
    } else {
        resultText.style.color = "#ff5f56";
        resultText.innerText = "Terlalu rendah!";
    }
}

/* --- LOGIKA KUIS --- */
function cekQuiz() {
    const form = document.forms['quizForm'];
    let skor = 0;
    
    // Kunci Jawaban
    if(form['q1'].value === 'a') skor++; // <b>
    if(form['q2'].value === 'b') skor++; // Cascading Style Sheets

    const hasil = document.getElementById('quizResult');
    hasil.innerText = "Skor Anda: " + skor + " / 2";
    
    if(skor === 2) {
        hasil.style.color = "#7ec699";
        hasil.innerText += " (Sempurna!)";
    } else {
        hasil.style.color = "#ffbd2e";
    }
}