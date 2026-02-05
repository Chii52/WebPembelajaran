/* =========================================================== */
/* BAGIAN 1: LOGIKA GAME TEBAK ANGKA                           */
/* =========================================================== */

let targetAngka = Math.floor(Math.random() * 10) + 1;

function mainkanGame() {
    // Ambil elemen hanya jika ada di halaman (Pencegahan Error)
    const inputUserElem = document.getElementById('tebakInput');
    const resultTextElem = document.getElementById('gameResult');

    if (!inputUserElem || !resultTextElem) return;

    const inputUser = inputUserElem.value;

    if (inputUser === '') {
        resultTextElem.style.color = "#ffbd2e";
        resultTextElem.innerText = "Masukkan angka dulu!";
        return;
    }

    if (inputUser == targetAngka) {
        resultTextElem.style.color = "#7ec699";
        resultTextElem.innerText = "BENAR! Angkanya adalah " + targetAngka;
        targetAngka = Math.floor(Math.random() * 10) + 1;
        inputUserElem.value = ''; 
    } else if (inputUser > targetAngka) {
        resultTextElem.style.color = "#ff5f56";
        resultTextElem.innerText = "Terlalu tinggi! Coba turunkan.";
    } else if (inputUser < targetAngka) {
        resultTextElem.style.color = "#ff5f56";
        resultTextElem.innerText = "Terlalu rendah! Coba naikkan.";
    }
}

/* =========================================================== */
/* BAGIAN 2: LOGIKA GAME BATU GUNTING KERTAS (SUIT)            */
/* =========================================================== */

function mainkanSuit(pilihanPlayer) {
    const resultText = document.getElementById('suitResult');
    if (!resultText) return;

    const pilihanKomputer = ['batu', 'gunting', 'kertas'][Math.floor(Math.random() * 3)];
    let hasil = '';

    if (pilihanPlayer === pilihanKomputer) {
        hasil = 'SERI! 😐';
        resultText.style.color = "#ffbd2e";
    } else if (
        (pilihanPlayer === 'batu' && pilihanKomputer === 'gunting') ||
        (pilihanPlayer === 'gunting' && pilihanKomputer === 'kertas') ||
        (pilihanPlayer === 'kertas' && pilihanKomputer === 'batu')
    ) {
        hasil = 'KAMU MENANG! 🎉';
        resultText.style.color = "#7ec699";
    } else {
        hasil = 'KAMU KALAH! 💀';
        resultText.style.color = "#ff5f56";
    }

    resultText.innerHTML = `Kamu: <b>${pilihanPlayer.toUpperCase()}</b> VS Komputer: <b>${pilihanKomputer.toUpperCase()}</b><br><br>${hasil}`;
}

/* =========================================================== */
/* BAGIAN 3: LOGIKA KUIS (10 SOAL)                             */
/* =========================================================== */

function cekQuiz() {
    const hasil = document.getElementById('quizResult');
    if (!hasil) return;

    // Kunci Jawaban (Sesuai urutan soal 1-10)
    const kunciJawaban = ['c', 'b', 'd', 'c', 'd', 'b', 'c', 'c', 'c', 'c'];
    
    let jumlahBenar = 0;
    const totalSoal = 10;

    for (let i = 1; i <= totalSoal; i++) {
        const jawabanUser = document.querySelector(`input[name="q${i}"]:checked`);
        if (jawabanUser && jawabanUser.value === kunciJawaban[i-1]) {
            jumlahBenar++;
        }
    }

    const skor = (jumlahBenar / totalSoal) * 100;
    
    if(skor >= 80) {
        hasil.style.color = "#7ec699"; 
        hasil.innerText = `Luar Biasa! Skor: ${skor} / 100 (${jumlahBenar} Benar)`;
    } else if(skor >= 60) {
        hasil.style.color = "#ffbd2e"; 
        hasil.innerText = `Cukup Bagus! Skor: ${skor} / 100 (${jumlahBenar} Benar)`;
    } else {
        hasil.style.color = "#ff5f56"; 
        hasil.innerText = `Jangan Menyerah! Skor: ${skor} / 100 (${jumlahBenar} Benar)`;
    }
}

/* =========================================================== */
/* BAGIAN 4: DATABASE MATERI (PEMBARUAN LENGKAP)               */
/* =========================================================== */

function bukaDetail(materi) {
    const modal = document.getElementById('detailModal');
    const modalBody = document.getElementById('modalBody');
    if (!modal || !modalBody) return;

    let konten = '';

    // --- 1. HTML ---
    if(materi === 'html') {
        konten = `
            <h2 class="modal-title">HTML (HyperText Markup Language)</h2>
            <p class="modal-description">
                HTML adalah bahasa markup standar yang digunakan untuk menyusun struktur halaman website. 
                HTML menjadi dasar dari semua halaman web.
            </p>
            
            <div class="modal-benefits">
                <h4>Fungsi HTML:</h4>
                <ol>
                    <li>Menentukan struktur dan konten halaman web</li>
                    <li>Menampilkan teks, gambar, audio, dan video</li>
                    <li>Membuat hyperlink antar halaman</li>
                    <li>Membuat tabel dan form input</li>
                </ol>
            </div>

            <div class="modal-benefits">
                <h4>Struktur Dasar HTML:</h4>
                <ul>
                    <li><code>&lt;!DOCTYPE html&gt;</code> : deklarasi dokumen</li>
                    <li><code>&lt;html&gt;</code> : elemen utama</li>
                    <li><code>&lt;head&gt;</code> : informasi halaman</li>
                    <li><code>&lt;body&gt;</code> : isi halaman</li>
                </ul>
            </div>

            <div class="modal-benefits">
                <h4>Elemen HTML yang Sering Digunakan:</h4>
                <ul>
                    <li><strong>Heading:</strong> <code>&lt;h1&gt;</code> – <code>&lt;h6&gt;</code></li>
                    <li><strong>Paragraf:</strong> <code>&lt;p&gt;</code></li>
                    <li><strong>Gambar:</strong> <code>&lt;img&gt;</code></li>
                    <li><strong>Link:</strong> <code>&lt;a&gt;</code></li>
                    <li><strong>List:</strong> <code>&lt;ul&gt;</code>, <code>&lt;ol&gt;</code>, <code>&lt;li&gt;</code></li>
                    <li><strong>Form:</strong> <code>&lt;form&gt;</code>, <code>&lt;input&gt;</code>, <code>&lt;button&gt;</code></li>
                </ul>
            </div>

            <div class="modal-example">
                <h4>Contoh HTML Lengkap:</h4>
                <div class="code-example">&lt;!DOCTYPE html&gt;
&lt;html&gt;
  &lt;head&gt;
    &lt;title&gt;Website PPLG&lt;/title&gt;
  &lt;/head&gt;
  &lt;body&gt;
    &lt;h1&gt;Selamat Datang di PPLG&lt;/h1&gt;
    &lt;p&gt;Belajar HTML itu menyenangkan&lt;/p&gt;
    &lt;ul&gt;
      &lt;li&gt;HTML&lt;/li&gt;
      &lt;li&gt;CSS&lt;/li&gt;
      &lt;li&gt;JavaScript&lt;/li&gt;
    &lt;/ul&gt;
  &lt;/body&gt;
&lt;/html&gt;</div>
            </div>`;
    } 
    // --- 2. CSS ---
    else if(materi === 'css') {
        konten = `
            <h2 class="modal-title">CSS (Cascading Style Sheets)</h2>
            <p class="modal-description">
                CSS adalah bahasa yang digunakan untuk mengatur tampilan halaman web agar lebih menarik dan mudah digunakan.
            </p>
            
            <div class="modal-benefits">
                <h4>Fungsi CSS:</h4>
                <ol>
                    <li>Mengatur warna, font, dan ukuran</li>
                    <li>Mengatur layout halaman</li>
                    <li>Membuat animasi sederhana</li>
                    <li>Membuat website responsif</li>
                </ol>
            </div>

            <div class="modal-benefits">
                <h4>Cara Menggunakan CSS:</h4>
                <ul>
                    <li><strong>Inline CSS:</strong> Ditulis langsung di elemen HTML.</li>
                    <li><strong>Internal CSS:</strong> Ditulis di dalam tag <code>&lt;style&gt;</code>.</li>
                    <li><strong>External CSS:</strong> File terpisah (.css).</li>
                </ul>
            </div>

            <div class="modal-benefits">
                <h4>Properti CSS Umum:</h4>
                <ul>
                    <li><code>color</code>, <code>background-color</code></li>
                    <li><code>font-size</code>, <code>font-family</code></li>
                    <li><code>margin</code> dan <code>padding</code></li>
                    <li><code>border</code></li>
                </ul>
            </div>

            <div class="modal-example">
                <h4>Contoh CSS:</h4>
                <div class="code-example">body {
  background-color: #eef;
  font-family: Arial;
}
h1 {
  color: blue;
}</div>
            </div>`;
    } 
    // --- 3. JAVASCRIPT ---
    else if(materi === 'javascript') {
        konten = `
            <h2 class="modal-title">JavaScript (JS)</h2>
            <p class="modal-description">
                JavaScript adalah bahasa pemrograman yang membuat website menjadi interaktif dan dinamis.
            </p>
            
            <div class="modal-benefits">
                <h4>Fungsi JavaScript:</h4>
                <ol>
                    <li>Menangani event (klik, input)</li>
                    <li>Mengolah data</li>
                    <li>Validasi form</li>
                    <li>Membuat game berbasis web</li>
                </ol>
            </div>

            <div class="modal-benefits">
                <h4>Dasar JavaScript:</h4>
                <ul>
                    <li><strong>Variabel:</strong> <code>let</code>, <code>const</code></li>
                    <li><strong>Operator</strong> (+, -, *, /)</li>
                    <li><strong>Percabangan:</strong> <code>if else</code></li>
                    <li><strong>Perulangan:</strong> <code>for</code>, <code>while</code></li>
                    <li><strong>Function</strong></li>
                </ul>
            </div>

            <div class="modal-example">
                <h4>Contoh JavaScript:</h4>
                <div class="code-example">&lt;script&gt;
let nilai = 80;
if (nilai >= 75) {
  alert("Lulus");
} else {
  alert("Tidak Lulus");
}
&lt;/script&gt;</div>
            </div>`;
    } 
    // --- 4. GAME DEV ---
    else if(materi === 'gamedev') {
        konten = `
            <h2 class="modal-title">Gim dan Game Development</h2>
            <p class="modal-description">
                Gim adalah perangkat lunak interaktif yang dibuat untuk hiburan, edukasi, atau simulasi.
            </p>
            
            <div class="modal-benefits">
                <h4>Unsur Gim:</h4>
                <ol>
                    <li>Player (Pemain)</li>
                    <li>Aturan permainan</li>
                    <li>Skor</li>
                    <li>Level</li>
                    <li>Tantangan</li>
                </ol>
            </div>

            <div class="modal-benefits">
                <h4>Alur Pembuatan Gim:</h4>
                <ol>
                    <li>Ide dan konsep</li>
                    <li>Desain karakter dan aturan</li>
                    <li>Pembuatan kode (Coding)</li>
                    <li>Pengujian (Testing)</li>
                    <li>Perbaikan (Debugging)</li>
                </ol>
            </div>

            <div class="modal-example">
                <h4>Contoh Logika Game Sederhana:</h4>
                <div class="code-example">&lt;script&gt;
let skor = 0;
function tambahSkor() {
  skor++;
  alert("Skor: " + skor);
}
&lt;/script&gt;
&lt;button onclick="tambahSkor()"&gt;Tambah Skor&lt;/button&gt;</div>
            </div>`;
    } 
    // --- 5. SOFTWARE PPLG (MENGGANTIKAN TOOLS GAME) ---
    else if(materi === 'toolsgame') {
        konten = `
            <h2 class="modal-title">Software dalam PPLG</h2>
            <p class="modal-description">
                Software adalah perangkat lunak yang digunakan untuk membantu pekerjaan pemrograman dan pengembangan.
            </p>
            
            <div class="modal-benefits">
                <h4>Jenis Software:</h4>
                <ol>
                    <li><strong>Software Sistem:</strong> Windows, Linux, MacOS.</li>
                    <li><strong>Software Aplikasi:</strong> Microsoft Office, Browser.</li>
                    <li><strong>Software Pemrograman:</strong> VS Code, Python, Java.</li>
                </ol>
            </div>

            <div class="modal-benefits">
                <h4>Contoh Software Pendukung:</h4>
                <ul>
                    <li><strong>Web Browser:</strong> Chrome, Firefox (Untuk menjalankan web).</li>
                    <li><strong>Text Editor:</strong> VS Code, Sublime Text (Untuk ngetik kode).</li>
                    <li><strong>Compiler/Interpreter:</strong> Menerjemahkan kode ke bahasa mesin.</li>
                    <li><strong>Software Desain:</strong> Figma, Photoshop, Canva.</li>
                </ul>
            </div>`;
    } 
    // --- 6. CODE EDITOR (MENGGANTIKAN TOOLS DEV) ---
    else if(materi === 'toolsdev') {
        konten = `
            <h2 class="modal-title">Code Editor</h2>
            <p class="modal-description">
                Code editor adalah software yang digunakan untuk menulis dan mengedit kode program.
            </p>
            
            <div class="modal-benefits">
                <h4>Fungsi Code Editor:</h4>
                <ol>
                    <li>Menulis kode dengan rapi.</li>
                    <li>Memberi warna pada kode (Syntax Highlighting) agar mudah dibaca.</li>
                    <li>Membantu mendeteksi kesalahan (Error detection).</li>
                </ol>
            </div>

            <div class="modal-benefits">
                <h4>Fitur Umum:</h4>
                <ul>
                    <li><strong>Auto Complete:</strong> Melengkapi kode otomatis.</li>
                    <li><strong>Syntax Highlighting:</strong> Pewarnaan kode.</li>
                    <li><strong>Extension / Plugin:</strong> Menambah fitur tambahan.</li>
                </ul>
            </div>

            <div class="modal-example">
                <h4>Contoh Code Editor Populer:</h4>
                <ul>
                    <li>Visual Studio Code (Paling populer)</li>
                    <li>Sublime Text (Ringan)</li>
                    <li>Notepad++ (Klasik)</li>
                    <li>Atom</li>
                </ul>
            </div>`;
    }
    // --- BIODATA TIM (TIDAK BERUBAH) ---
    else if(materi === 'member1') {
        konten = `<div style="text-align:center;"><img src="https://ui-avatars.com/api/?name=Aditya+R&background=6c63ff&color=fff&size=128" style="border-radius:50%; margin-bottom:15px; border:3px solid #6c63ff;"><h2 class="modal-title">Aditya R.</h2><p style="color:#6c63ff; font-weight:bold;">PROJECT MANAGER</p></div><div class="modal-benefits"><h4>Tentang Saya:</h4><p>"Pemimpin yang percaya bahwa kode yang bersih berawal dari komunikasi yang jelas."</p></div>`;
    } 
    else if(materi === 'member2') {
        konten = `<div style="text-align:center;"><img src="https://ui-avatars.com/api/?name=Bunga+C&background=ff5f56&color=fff&size=128" style="border-radius:50%; margin-bottom:15px; border:3px solid #ff5f56;"><h2 class="modal-title">Bunga C.</h2><p style="color:#ff5f56; font-weight:bold;">UI/UX DESIGNER</p></div><div class="modal-benefits"><h4>Tentang Saya:</h4><p>Mendesain antarmuka yang tidak hanya cantik, tapi juga mudah digunakan.</p></div>`;
    }
    else if(materi === 'member3') {
        konten = `<div style="text-align:center;"><img src="https://ui-avatars.com/api/?name=Chandra+K&background=27c93f&color=fff&size=128" style="border-radius:50%; margin-bottom:15px; border:3px solid #27c93f;"><h2 class="modal-title">Chandra K.</h2><p style="color:#27c93f; font-weight:bold;">FULL STACK DEV</p></div><div class="modal-benefits"><h4>Tentang Saya:</h4><p>Menguasai sisi depan (Frontend) yang indah dan sisi belakang (Backend) yang kuat.</p></div>`;
    }
    else if(materi === 'member4') {
        konten = `<div style="text-align:center;"><img src="https://ui-avatars.com/api/?name=Dinda+P&background=ffbd2e&color=fff&size=128" style="border-radius:50%; margin-bottom:15px; border:3px solid #ffbd2e;"><h2 class="modal-title">Dinda P.</h2><p style="color:#ffbd2e; font-weight:bold;">GAME DEVELOPER</p></div><div class="modal-benefits"><h4>Tentang Saya:</h4><p>Menciptakan dunia virtual interaktif dan logika permainan yang menantang.</p></div>`;
    }
    else if(materi === 'member5') {
        konten = `<div style="text-align:center;"><img src="https://ui-avatars.com/api/?name=Eko+S&background=00f3ff&color=fff&size=128" style="border-radius:50%; margin-bottom:15px; border:3px solid #00f3ff;"><h2 class="modal-title">Eko S.</h2><p style="color:#00f3ff; font-weight:bold;">QUALITY ASSURANCE</p></div><div class="modal-benefits"><h4>Tentang Saya:</h4><p>"Detektif Bug". Saya tidak akan membiarkan satu kesalahan pun lolos.</p></div>`;
    }

    modalBody.innerHTML = konten;
    modal.style.display = 'block';
}

/* =========================================================== */
/* BAGIAN 5: UTILITY & EVENT LISTENER                          */
/* =========================================================== */

function tutupDetail() {
    const modal = document.getElementById('detailModal');
    if (modal) modal.style.display = 'none';
}

window.onclick = function(event) {
    const modal = document.getElementById('detailModal');
    if (modal && event.target == modal) {
        tutupDetail();
    }
}

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        tutupDetail();
    }
});

// Event Listener Tebak Angka (Hanya jika elemen ada)
const inputTebak = document.getElementById('tebakInput');
if (inputTebak) {
    inputTebak.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            mainkanGame();
        }
    });
}

// Hamburger Menu
function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) navLinks.classList.toggle('active');
}

// Scroll Reveal
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, { threshold: 0.15 });

revealElements.forEach(el => revealObserver.observe(el));
