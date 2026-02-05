/* =========================================================== */
/* BAGIAN 1: LOGIKA GAME TEBAK ANGKA                           */
/* =========================================================== */

let targetAngka = Math.floor(Math.random() * 10) + 1;

function mainkanGame() {
    const inputUser = document.getElementById('tebakInput').value;
    const resultText = document.getElementById('gameResult');

    if (inputUser === '') {
        resultText.style.color = "#ffbd2e";
        resultText.innerText = "Masukkan angka dulu!";
        return;
    }

    if (inputUser == targetAngka) {
        resultText.style.color = "#7ec699";
        resultText.innerText = "BENAR! Angkanya adalah " + targetAngka;
        targetAngka = Math.floor(Math.random() * 10) + 1;
        document.getElementById('tebakInput').value = ''; 
    } else if (inputUser > targetAngka) {
        resultText.style.color = "#ff5f56";
        resultText.innerText = "Terlalu tinggi! Coba turunkan.";
    } else if (inputUser < targetAngka) {
        resultText.style.color = "#ff5f56";
        resultText.innerText = "Terlalu rendah! Coba naikkan.";
    }
}

/* =========================================================== */
/* BAGIAN 2: LOGIKA GAME BATU GUNTING KERTAS (SUIT)            */
/* =========================================================== */

function mainkanSuit(pilihanPlayer) {
    const pilihanKomputer = ['batu', 'gunting', 'kertas'][Math.floor(Math.random() * 3)];
    const resultText = document.getElementById('suitResult');
    
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
/* BAGIAN 3: LOGIKA KUIS (NILAI OTOMATIS)                      */
/* =========================================================== */

function cekQuiz() {
    const q1 = document.querySelector('input[name="q1"]:checked');
    const q2 = document.querySelector('input[name="q2"]:checked');
    let skor = 0;
    
    if(q1 && q1.value === 'a') skor += 50;
    if(q2 && q2.value === 'b') skor += 50;

    const hasil = document.getElementById('quizResult');
    
    if(skor === 100) {
        hasil.style.color = "#7ec699";
        hasil.innerText = "Skor: 100/100 (Sempurna!)";
    } else if(skor === 50) {
        hasil.style.color = "#ffbd2e";
        hasil.innerText = "Skor: 50/100 (Belajar lagi ya!)";
    } else {
        hasil.style.color = "#ff5f56";
        hasil.innerText = "Skor: 0/100 (Salah semua, semangat!)";
    }
}

/* =========================================================== */
/* BAGIAN 4: DATABASE MATERI (DEEP & SIMPLE VERSION)           */
/* =========================================================== */

function bukaDetail(materi) {
    const modal = document.getElementById('detailModal');
    const modalBody = document.getElementById('modalBody');
    let konten = '';

    // --- 1. HTML (MATERI MENDALAM) ---
    if(materi === 'html') {
        konten = `
            <h2 class="modal-title">HTML5: Struktur & Semantik</h2>
            
            <div class="modal-benefits">
                <h4>Filosofi Dasar</h4>
                <p class="modal-description">
                    Jangan hafal semua tag! Pahami konsepnya: HTML adalah tentang <strong>memberi arti</strong> pada konten. 
                    Browser tidak tahu mana "judul" dan mana "paragraf" kecuali kita memberitahunya lewat tag.
                    <br><br>
                    Jika Website = Rumah, maka HTML adalah pondasi, tiang, dan tembok batanya.
                </p>
            </div>

            <div class="modal-benefits">
                <h4>Struktur Wajib (Anatomi)</h4>
                <ul>
                    <li><code>&lt;!DOCTYPE html&gt;</code>: "KTP" website, memberitahu browser ini HTML5 modern.</li>
                    <li><code>&lt;head&gt;</code>: Bagian otak. Isinya judul tab, link CSS, dan info SEO (tidak tampil di layar).</li>
                    <li><code>&lt;body&gt;</code>: Bagian tubuh. Semua tulisan, gambar, dan tombol yang user lihat ada di sini.</li>
                </ul>
            </div>

            <div class="modal-benefits">
                <h4>Tag Paling Sering Dipakai (Top 5)</h4>
                <ul>
                    <li><code>&lt;div&gt;</code>: Kotak kosong (pembungkus) untuk mengatur layout.</li>
                    <li><code>&lt;h1&gt;</code> s/d <code>&lt;h6&gt;</code>: Judul (H1 paling besar/penting).</li>
                    <li><code>&lt;p&gt;</code>: Paragraf teks bacaan.</li>
                    <li><code>&lt;a href="..."&gt;</code>: Anchor (Link) untuk pindah halaman.</li>
                    <li><code>&lt;img src="..."&gt;</code>: Image (Gambar). Unik karena tidak punya tag penutup.</li>
                </ul>
            </div>

            <div class="modal-example">
                <h4>Contoh Kode Nyata:</h4>
                <div class="code-example">&lt;!-- Struktur Artikel Blog --&gt;
&lt;article&gt;
   &lt;h1&gt;Belajar Koding Itu Seru&lt;/h1&gt;
   &lt;img src="laptop.jpg" alt="Foto Laptop" /&gt;
   &lt;p&gt;Koding melatih logika kita...&lt;/p&gt;
   &lt;button&gt;Baca Selengkapnya&lt;/button&gt;
&lt;/article&gt;</div>
            </div>`;
    } 
    // --- 2. CSS (MATERI MENDALAM) ---
    else if(materi === 'css') {
        konten = `
            <h2 class="modal-title">CSS3: Visual & Tata Letak</h2>
            
            <div class="modal-benefits">
                <h4>Filosofi Dasar</h4>
                <p class="modal-description">
                    HTML tanpa CSS itu jelek (hitam putih). CSS bertugas mendandani HTML.
                    <br><br>
                    Prinsip kerjanya: <strong>"Pilih Siapa" (Selector)</strong> lalu <strong>"Ubah Apa" (Property).</strong>
                </p>
            </div>

            <div class="modal-benefits">
                <h4>The Box Model (Konsep Paling Penting)</h4>
                <p class="modal-description">Pemula sering bingung mengatur jarak. Ingatlah mantra ini, urut dari dalam ke luar:</p>
                <ul>
                    <li>1. <strong>Content:</strong> Isi murninya (teks/gambar).</li>
                    <li>2. <strong>Padding:</strong> Jarak napas antara isi dengan bingkai.</li>
                    <li>3. <strong>Border:</strong> Bingkai/Garis tepi.</li>
                    <li>4. <strong>Margin:</strong> Jarak tolak-menolak dengan elemen tetangga.</li>
                </ul>
            </div>

            <div class="modal-benefits">
                <h4>Layout Modern: Flexbox</h4>
                <p class="modal-description">Dulu mengatur posisi itu susah. Sekarang kita pakai <code>display: flex</code>.</p>
                <ul>
                    <li><code>justify-content: center;</code> (Rata tengah Horizontal/Kiri-Kanan).</li>
                    <li><code>align-items: center;</code> (Rata tengah Vertikal/Atas-Bawah).</li>
                </ul>
            </div>

            <div class="modal-example">
                <h4>Contoh Kode Styling:</h4>
                <div class="code-example">/* Memilih elemen dengan class "kotak" */
.kotak {
    background: crimson;
    color: white;
    padding: 20px;       /* Lega di dalam */
    margin-bottom: 10px; /* Jarak ke bawah */
    border-radius: 10px; /* Sudut tumpul */
}</div>
            </div>`;
    } 
    // --- 3. JAVASCRIPT (MATERI MENDALAM) ---
    else if(materi === 'javascript') {
        konten = `
            <h2 class="modal-title">JavaScript: Logika & Interaksi</h2>
            
            <div class="modal-benefits">
                <h4>Filosofi Dasar</h4>
                <p class="modal-description">
                    Jika HTML adalah mobil, dan CSS adalah cat warnanya, maka <strong>JS adalah Mesin dan Setirnya.</strong>
                    JS membuat website bisa "merespon" tindakan user (klik, scroll, ketik).
                </p>
            </div>

            <div class="modal-benefits">
                <h4>3 Pilar Utama Programming JS</h4>
                <ol>
                    <li>
                        <strong>Variable (Wadah Data):</strong><br>
                        Tempat simpan skor, nama user, dll.<br>
                        <code>let skor = 0;</code> (Bisa berubah)<br>
                        <code>const pi = 3.14;</code> (Tetap/Konstan)
                    </li>
                    <br>
                    <li>
                        <strong>Function (Resep Perintah):</strong><br>
                        Kumpulan kode yang disimpan untuk dipakai nanti.<br>
                        <code>function lompat() { karakter.y += 10; }</code>
                    </li>
                    <br>
                    <li>
                        <strong>DOM (Pengendali HTML):</strong><br>
                        JS bisa mengubah HTML sesuka hati.<br>
                        <code>document.getElementById("judul").style.color = "red";</code>
                    </li>
                </ol>
            </div>

            <div class="modal-example">
                <h4>Contoh Logika If/Else:</h4>
                <div class="code-example">let nyawa = 3;

function kenaDamage() {
    nyawa = nyawa - 1;
    
    if (nyawa <= 0) {
        alert("GAME OVER!");
    } else {
        alert("Hati-hati! Sisa nyawa: " + nyawa);
    }
}</div>
            </div>`;
    } 
    // --- 4. GAME DEV (MATERI MENDALAM) ---
    else if(materi === 'gamedev') {
        konten = `
            <h2 class="modal-title">Dasar Game Development</h2>
            
            <div class="modal-benefits">
                <h4>Bedanya Web vs Game</h4>
                <p class="modal-description">
                    Web itu statis (diam menunggu diklik). Game itu dinamis (bergerak terus).
                    Game membutuhkan <strong>Game Loop</strong>, yaitu kode yang dijalankan ulang 60 kali setiap detik (60 FPS).
                </p>
            </div>

            <div class="modal-benefits">
                <h4>3 Fase Utama dalam Loop</h4>
                <ul>
                    <li><strong>1. Input:</strong> Mendengar tombol keyboard/mouse (Ditekan gak?).</li>
                    <li><strong>2. Update:</strong> Mengubah matematika (Posisi X maju 5 langkah, Nyawa kurang 1).</li>
                    <li><strong>3. Render:</strong> Menghapus layar lama, lalu menggambar ulang posisi baru.</li>
                </ul>
            </div>

            <div class="modal-benefits">
                <h4>Koordinat (X dan Y)</h4>
                <p class="modal-description">
                    Layar komputer itu seperti grafik matematika Kartesius.
                    <br><strong>X</strong> = Kiri (0) ke Kanan (+).
                    <br><strong>Y</strong> = Atas (0) ke Bawah (+) <small>*Awas! Di komputer, Y makin ke bawah makin positif.</small>
                </p>
            </div>

            <div class="modal-example">
                <h4>Contoh Logika Gerak:</h4>
                <div class="code-example">let playerX = 0;

function gameLoop() {
    // Tiap frame, player maju 5 pixel
    playerX = playerX + 5; 
    
    // Gambar ulang kotak di posisi baru
    ctx.clearRect(0,0, 500, 500);
    ctx.fillRect(playerX, 100, 50, 50);
    
    requestAnimationFrame(gameLoop);
}</div>
            </div>`;
    } 
    // --- 5. SOFTWARE GAME (MATERI MENDALAM) ---
    else if(materi === 'toolsgame') {
        konten = `
            <h2 class="modal-title">Mengenal Game Engine</h2>
            <p class="modal-description">
                Zaman dulu bikin game harus ngetik kode ribuan baris cuma buat nampilin gambar. 
                Sekarang kita pakai <strong>Game Engine</strong>, software sakti yang sudah punya fitur fisika (gravitasi/tabrakan) siap pakai.
            </p>
            
            <div class="modal-benefits">
                <h4>1. Unity (Si Populer)</h4>
                <ul>
                    <li><strong>Bahasa:</strong> C# (Dibaca: C-Sharp).</li>
                    <li><strong>Kenapa Populer?</strong> Bisa bikin game untuk HP (Android/iOS), PC, sampai PlayStation. Komunitasnya raksasa, jadi kalau error gampang cari solusi di Google.</li>
                    <li><strong>Game:</strong> Mobile Legends, Among Us, Pokemon Go.</li>
                </ul>
            </div>

            <div class="modal-benefits">
                <h4>2. Godot (Si Ringan)</h4>
                <ul>
                    <li><strong>Bahasa:</strong> GDScript (Mirip Python, sangat mudah dibaca).</li>
                    <li><strong>Kenapa Bagus?</strong> Ukurannya kecil (< 100MB), Gratis total (Open Source), dan sangat cepat dijalankan di laptop spek rendah.</li>
                    <li><strong>Cocok Untuk:</strong> Pemula yang baru belajar bikin game 2D.</li>
                </ul>
            </div>

            <div class="modal-benefits">
                <h4>3. Unreal Engine (Si Grafis Dewa)</h4>
                <ul>
                    <li><strong>Bahasa:</strong> C++ atau Blueprints (Coding pakai gambar kabel, tanpa ngetik).</li>
                    <li><strong>Kenapa Bagus?</strong> Grafisnya ultra-realistis seperti film. Biasa dipakai studio besar.</li>
                    <li><strong>Game:</strong> PUBG, Valorant, Fortnite, Tekken 8.</li>
                </ul>
            </div>`;
    } 
    // --- 6. SOFTWARE CODING (MATERI MENDALAM) ---
    else if(materi === 'toolsdev') {
        konten = `
            <h2 class="modal-title">Text Editor (Senjata Programmer)</h2>
            <p class="modal-description">
                Jangan pernah koding pakai Microsoft Word! Itu untuk nulis surat.
                Programmer butuh <strong>Text Editor</strong> atau <strong>IDE</strong> yang bisa mewarnai kode (Syntax Highlighting) biar gak sakit mata.
            </p>
            
            <div class="modal-benefits">
                <h4>1. Visual Studio Code (VS Code)</h4>
                <p>Raja editor saat ini. Gratis buatan Microsoft.</p>
                <ul>
                    <li><strong>Kelebihan:</strong> Punya "Extension". Mau koding Web? Install plugin Web. Mau Python? Install plugin Python. Sangat fleksibel.</li>
                    <li><strong>Fitur Wajib:</strong> Terminal bawaan, Git integration, dan Auto-complete (saran kode otomatis).</li>
                </ul>
            </div>

            <div class="modal-benefits">
                <h4>2. Sublime Text</h4>
                <p>Editor legendaris yang super cepat.</p>
                <ul>
                    <li><strong>Kelebihan:</strong> Sangat ringan. Kalau laptopmu RAM-nya kecil, pakailah ini. Buka file coding 10.000 baris cuma butuh 1 detik.</li>
                </ul>
            </div>

            <div class="modal-example">
                <h4>Istilah Wajib Tahu:</h4>
                <ul>
                    <li><strong>Bug:</strong> Error/kesalahan dalam kode.</li>
                    <li><strong>Debugging:</strong> Proses mencari dan membasmi bug.</li>
                    <li><strong>Syntax:</strong> Tata bahasa dalam koding (kalau salah koma, program crash).</li>
                </ul>
            </div>`;
    }

    // Masukkan konten ke dalam modal lalu tampilkan
    modalBody.innerHTML = konten;
    modal.style.display = 'block';
}

/* =========================================================== */
/* BAGIAN 5: UTILITY (TUTUP MODAL, SCROLL, DLL)                */
/* =========================================================== */

function tutupDetail() {
    document.getElementById('detailModal').style.display = 'none';
}

window.onclick = function(event) {
    const modal = document.getElementById('detailModal');
    if (event.target == modal) {
        tutupDetail();
    }
}

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        tutupDetail();
    }
});

document.getElementById('tebakInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        mainkanGame();
    }
});

document.querySelectorAll('.floating-nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: 'smooth'
        });
    });
});

/* =========================================================== */
/* BAGIAN 6: ANIMASI SCROLL REVEAL                             */
/* =========================================================== */

const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, {
    threshold: 0.15 
});

revealElements.forEach(el => revealObserver.observe(el));
