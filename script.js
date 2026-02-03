let targetAngka = Math.floor(Math.random() * 10) + 1;

function mainkanGame() {
    const inputUser = document.getElementById('tebakInput').value;
    const resultText = document.getElementById('gameResult');

    if (inputUser == targetAngka) {
        resultText.style.color = "#7ec699";
        resultText.innerText = "Benar! Angkanya adalah " + targetAngka;
        targetAngka = Math.floor(Math.random() * 10) + 1;
        document.getElementById('tebakInput').value = '';
    } else if (inputUser > targetAngka) {
        resultText.style.color = "#ff5f56";
        resultText.innerText = "Terlalu tinggi!";
    } else if (inputUser < targetAngka && inputUser >= 1) {
        resultText.style.color = "#ff5f56";
        resultText.innerText = "Terlalu rendah!";
    } else {
        resultText.style.color = "#ffbd2e";
        resultText.innerText = "Masukkan angka 1-10!";
    }
}

function cekQuiz() {
    const q1 = document.querySelector('input[name="q1"]:checked');
    const q2 = document.querySelector('input[name="q2"]:checked');
    let skor = 0;
    
    if(q1 && q1.value === 'a') skor++;
    if(q2 && q2.value === 'b') skor++;

    const hasil = document.getElementById('quizResult');
    
    if(skor === 2) {
        hasil.style.color = "#7ec699";
        hasil.innerText = "Skor Anda: " + skor + " / 2 (Sempurna!)";
    } else if(skor === 1) {
        hasil.style.color = "#ffbd2e";
        hasil.innerText = "Skor Anda: " + skor + " / 2 (Coba lagi!)";
    } else if(skor === 0) {
        hasil.style.color = "#ff5f56";
        hasil.innerText = "Skor Anda: " + skor + " / 2 (Belajar lagi ya!)";
    } else {
        hasil.style.color = "#ffbd2e";
        hasil.innerText = "Jawab semua pertanyaan dulu!";
    }
}

function bukaDetail(materi) {
    const modal = document.getElementById('detailModal');
    const modalBody = document.getElementById('modalBody');
    
    let konten = '';
    
    if(materi === 'html') {
        konten = `
            <h2 class="modal-title">HTML Dasar</h2>
            <p class="modal-description">
                HTML (HyperText Markup Language) adalah bahasa markup standar untuk membuat halaman web. 
                HTML menggambarkan struktur halaman web dengan menggunakan elemen-elemen seperti heading, 
                paragraf, gambar, link, dan lainnya.
            </p>
            
            <div class="modal-example">
                <h4>Contoh Struktur HTML Dasar:</h4>
                <div class="code-example">&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
    &lt;title&gt;Judul Halaman&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
    &lt;h1&gt;Ini Heading&lt;/h1&gt;
    &lt;p&gt;Ini paragraf.&lt;/p&gt;
&lt;/body&gt;
&lt;/html&gt;</div>
            </div>
            
            <div class="modal-benefits">
                <h4>Kelebihan HTML:</h4>
                <ul>
                    <li>Mudah dipelajari dan digunakan</li>
                    <li>Didukung oleh semua browser</li>
                    <li>Gratis dan open source</li>
                    <li>Integrasi mudah dengan CSS dan JavaScript</li>
                    <li>Struktur yang logis dan terorganisir</li>
                </ul>
            </div>
            
            <p class="modal-description">
                <strong>Fungsi HTML:</strong> HTML digunakan untuk membuat struktur dasar halaman web, 
                menentukan elemen-elemen seperti judul, paragraf, gambar, tabel, form, dan link.
            </p>
            
            <p class="modal-description">
                <strong>Tag Penting:</strong> &lt;html&gt;, &lt;head&gt;, &lt;body&gt;, &lt;h1&gt; sampai &lt;h6&gt;, 
                &lt;p&gt;, &lt;a&gt;, &lt;img&gt;, &lt;div&gt;, &lt;span&gt;.
            </p>
        `;
    } else if(materi === 'css') {
        konten = `
            <h2 class="modal-title">CSS Styling</h2>
            <p class="modal-description">
                CSS (Cascading Style Sheets) adalah bahasa yang digunakan untuk mengatur tampilan dan 
                tata letak elemen-elemen HTML di halaman web. Dengan CSS, Anda dapat mengubah warna, 
                font, ukuran, spasi, dan posisi elemen dengan mudah.
            </p>
            
            <div class="modal-example">
                <h4>Contoh CSS Sederhana:</h4>
                <div class="code-example">/* Mengubah warna teks semua paragraf */
p {
    color: blue;
    font-size: 16px;
    font-family: Arial, sans-serif;
}

/* Mengatur background dan padding untuk header */
.header {
    background-color: #333;
    padding: 20px;
    color: white;
}

/* Membuat tombol dengan hover effect */
.button {
    background-color: #4CAF50;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.button:hover {
    background-color: #45a049;
}</div>
            </div>
            
            <div class="modal-benefits">
                <h4>Manfaat CSS:</h4>
                <ul>
                    <li>Memisahkan konten dari presentasi</li>
                    <li>Konsistensi tampilan di seluruh halaman</li>
                    <li>Meningkatkan kecepatan loading halaman</li>
                    <li>Mudah untuk maintenance dan update</li>
                    <li>Fleksibel untuk berbagai perangkat (responsive)</li>
                </ul>
            </div>
            
            <div class="modal-example">
                <h4>Selektor CSS:</h4>
                <div class="code-example">/* Selektor elemen */
p { color: red; }

/* Selektor class */
.menu { background: blue; }

/* Selektor ID */
#header { height: 100px; }

/* Selektor atribut */
input[type="text"] { border: 1px solid #ccc; }

/* Selektor pseudo-class */
a:hover { color: orange; }</div>
            </div>
        `;
    } else if(materi === 'javascript') {
        konten = `
            <h2 class="modal-title">JavaScript</h2>
            <p class="modal-description">
                JavaScript adalah bahasa pemrograman yang digunakan untuk membuat halaman web menjadi 
                interaktif. Dengan JavaScript, Anda dapat menambahkan animasi, validasi form, 
                manipulasi DOM, komunikasi dengan server, dan membuat aplikasi web yang kompleks.
            </p>
            
            <div class="modal-example">
                <h4>Contoh JavaScript Dasar:</h4>
                <div class="code-example">// Menampilkan alert saat halaman dimuat
window.onload = function() {
    alert("Selamat datang di halaman kami!");
};

// Fungsi untuk mengubah teks
function ubahTeks() {
    document.getElementById("demo").innerHTML = "Teks telah diubah!";
}

// Event listener untuk tombol
document.getElementById("myButton").addEventListener("click", function() {
    console.log("Tombol diklik!");
});

// Array dan loop
let buah = ["Apel", "Jeruk", "Mangga"];
for(let i = 0; i < buah.length; i++) {
    console.log(buah[i]);
}</div>
            </div>
            
            <div class="modal-benefits">
                <h4>Kemampuan JavaScript:</h4>
                <ul>
                    <li>Manipulasi HTML dan CSS secara dinamis</li>
                    <li>Validasi form sebelum dikirim ke server</li>
                    <li>Membuat animasi dan efek visual</li>
                    <li>Komunikasi dengan server (AJAX)</li>
                    <li>Membuat game dan aplikasi web kompleks</li>
                    <li>Berjalan di sisi client (browser)</li>
                </ul>
            </div>
            
            <div class="modal-example">
                <h4>Fitur JavaScript Modern:</h4>
                <div class="code-example">// Arrow function
const sum = (a, b) => a + b;

// Template literals
const name = "John";
console.log(\`Hello, \${name}!\`);

// Destructuring
const person = { name: "Alice", age: 25 };
const { name, age } = person;

// Async/await
async function fetchData() {
    const response = await fetch('https://api.example.com/data');
    const data = await response.json();
    return data;
}</div>
            </div>
        `;
    } else if(materi === 'gamedev') {
        konten = `
            <h2 class="modal-title">Game Development</h2>
            <p class="modal-description">
                Pengembangan game adalah proses menciptakan permainan video yang melibatkan desain, 
                pemrograman, seni, audio, dan testing. Untuk web, game biasanya dibuat menggunakan 
                HTML5 Canvas, WebGL, atau framework seperti Phaser.js dan Three.js.
            </p>
            
            <div class="modal-example">
                <h4>Konsep Dasar Game Dev:</h4>
                <div class="code-example">// Game Loop sederhana untuk web
function gameLoop() {
    // 1. Handle input
    handleInput();
    
    // 2. Update game state
    updateGame();
    
    // 3. Render graphics
    renderGraphics();
    
    // 4. Request next frame
    requestAnimationFrame(gameLoop);
}

// Fungsi untuk collision detection
function checkCollision(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + obj1.height > obj2.y;
}

// Inisialisasi game
window.onload = function() {
    // Setup canvas
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    
    // Mulai game loop
    gameLoop();
};</div>
            </div>
            
            <div class="modal-benefits">
                <h4>Komponen Penting Game Dev:</h4>
                <ul>
                    <li><strong>Game Loop:</strong> Siklus update dan render yang konstan</li>
                    <li><strong>Physics:</strong> Gravitasi, collision, dan movement</li>
                    <li><strong>AI:</strong> Perilaku karakter non-pemain</li>
                    <li><strong>Asset Management:</strong> Gambar, audio, dan font</li>
                    <li><strong>State Management:</strong> Menu, gameplay, pause, game over</li>
                    <li><strong>User Interface:</strong> Skor, health bar, tombol</li>
                </ul>
            </div>
            
            <div class="modal-example">
                <h4>Framework Game Web Populer:</h4>
                <ul>
                    <li><strong>Phaser.js:</strong> Framework 2D game yang powerful</li>
                    <li><strong>Three.js:</strong> Library 3D graphics untuk WebGL</li>
                    <li><strong>Babylon.js:</strong> Engine 3D game yang lengkap</li>
                    <li><strong>Pixi.js:</strong> Renderer 2D yang sangat cepat</li>
                    <li><strong>Unity WebGL:</strong> Export game Unity ke web</li>
                </ul>
            </div>
            
            <p class="modal-description">
                <strong>Tips Memulai Game Dev:</strong> Mulai dari game sederhana seperti Flappy Bird atau Snake, 
                pelajari konsep game loop dan collision detection, gunakan framework seperti Phaser.js untuk 
                mempercepat pengembangan.
            </p>
        `;
    }
    
    modalBody.innerHTML = konten;
    modal.style.display = 'block';
}

function tutupDetail() {
    const modal = document.getElementById('detailModal');
    modal.style.display = 'none';
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
