/* =========================================================== */
/* BAGIAN 0: SETUP FIREBASE (DATABASE & AUTH)                  */
/* =========================================================== */

// Import fungsi dari Google (Ditambah 'updateProfile')
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, updateProfile } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBrHbchi0sGC3LS7ZP6B4jAFwt338C2Aq0",
  authDomain: "webbelajarpplg.firebaseapp.com",
  projectId: "webbelajarpplg",
  storageBucket: "webbelajarpplg.firebasestorage.app",
  messagingSenderId: "1027186626520",
  appId: "1:1027186626520:web:44b34aa6fd76692022ecad",
  measurementId: "G-MNJB98BF4T"
};

// Mencegah error jika config belum diisi
let app, auth;
try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
} catch (e) {
    console.error("Firebase belum disetting dengan benar:", e);
}

// Variabel Login
let isRegisterMode = false;

// --- FUNGSI LOGIN (Window Functions) ---

window.bukaLogin = function() {
    const modal = document.getElementById('loginModal');
    if(modal) modal.style.display = 'block';
}

window.tutupLogin = function() {
    document.getElementById('loginModal').style.display = 'none';
    const errElem = document.getElementById('authError');
    if(errElem) errElem.innerText = "";
    
    // Reset form saat ditutup
    document.getElementById('authForm').reset();
}

window.switchAuthMode = function() {
    isRegisterMode = !isRegisterMode;
    const title = document.getElementById('modalTitle');
    const btn = document.querySelector('#authForm button');
    const toggleText = document.querySelector('#loginModal a');
    const usernameInput = document.getElementById('username'); // Ambil elemen username
    
    if(isRegisterMode) {
        // MODE DAFTAR
        title.innerText = "Daftar Akun Baru";
        btn.innerText = "Daftar Sekarang";
        toggleText.innerText = "Sudah punya akun? Login";
        
        // Tampilkan Input Username & Wajib Diisi
        usernameInput.style.display = 'block';
        usernameInput.setAttribute('required', 'true');
    } else {
        // MODE LOGIN
        title.innerText = "Masuk Akun";
        btn.innerText = "Masuk Sekarang";
        toggleText.innerText = "Belum punya akun? Daftar";
        
        // Sembunyikan Input Username & Tidak Wajib
        usernameInput.style.display = 'none';
        usernameInput.removeAttribute('required');
    }
}

window.handleAuth = async function(event) {
    event.preventDefault(); 
    if(!auth) { alert("Firebase belum dikonfigurasi di script.js!"); return; }

    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    const username = document.getElementById('username').value; // Ambil nilai username
    const errorText = document.getElementById('authError');
    
    errorText.innerText = "Loading...";

    try {
        if(isRegisterMode) {
            // --- LOGIKA DAFTAR (DENGAN USERNAME) ---
            // 1. Buat Akun
            const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
            const user = userCredential.user;

            // 2. Update Profile (Simpan Username ke Firebase)
            await updateProfile(user, {
                displayName: username
            });

            alert(`Halo ${username}! Akun berhasil dibuat.`);
            window.tutupLogin();
            
            // Reload halaman agar nama langsung muncul (opsional)
            location.reload(); 

        } else {
            // --- LOGIKA LOGIN ---
            await signInWithEmailAndPassword(auth, email, pass);
            alert("Berhasil masuk! Selamat datang.");
            window.tutupLogin();
        }
    } catch (error) {
        console.error(error);
        if(error.code === 'auth/invalid-credential') {
            errorText.innerText = "Email atau Password salah!";
        } else if (error.code === 'auth/email-already-in-use') {
            errorText.innerText = "Email ini sudah terdaftar.";
        } else if (error.code === 'auth/weak-password') {
            errorText.innerText = "Password terlalu lemah (min 6 karakter).";
        } else {
            errorText.innerText = "Error: " + error.message;
        }
    }
}

window.handleLogout = async function() {
    if(confirm("Yakin ingin keluar?")) {
        if(auth) await signOut(auth);
        // Refresh halaman biar bersih
        location.reload();
    }
}

// Cek Status Login Otomatis
if(auth) {
    onAuthStateChanged(auth, (user) => {
        const navBtn = document.getElementById('navLoginBtn');
        if (navBtn) {
            if (user) {
                // PENTING: Ambil displayName (Username) kalau ada, kalau tidak ada baru pakai email
                const displayName = user.displayName || user.email.split('@')[0];
                
                navBtn.innerText = `Halo, ${displayName}`;
                navBtn.onclick = window.handleLogout;
                navBtn.style.backgroundColor = "#27c93f";
                navBtn.style.color = "#fff";
            } else {
                navBtn.innerText = "Masuk/Daftar";
                navBtn.onclick = window.bukaLogin;
                navBtn.style.backgroundColor = "";
                navBtn.style.color = "";
            }
        }
    });
}


/* =========================================================== */
/* BAGIAN 1: LOGIKA GAME TEBAK ANGKA                           */
/* =========================================================== */

let targetAngka = Math.floor(Math.random() * 10) + 1;

window.mainkanGame = function() {
  const inputUserElem = document.getElementById("tebakInput");
  const resultTextElem = document.getElementById("gameResult");

  if (!inputUserElem || !resultTextElem) return;

  const inputUser = inputUserElem.value;

  if (inputUser === "") {
    resultTextElem.style.color = "#ffbd2e";
    resultTextElem.innerText = "Masukkan angka dulu!";
    return;
  }

  if (inputUser == targetAngka) {
    resultTextElem.style.color = "#7ec699";
    resultTextElem.innerText = "BENAR! Angkanya adalah " + targetAngka;
    targetAngka = Math.floor(Math.random() * 10) + 1;
    inputUserElem.value = "";
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

window.mainkanSuit = function(pilihanPlayer) {
  const resultText = document.getElementById("suitResult");
  if (!resultText) return;

  const pilihanKomputer = ["batu", "gunting", "kertas"][Math.floor(Math.random() * 3)];
  let hasil = "";

  if (pilihanPlayer === pilihanKomputer) {
    hasil = "SERI! 😐";
    resultText.style.color = "#ffbd2e";
  } else if (
    (pilihanPlayer === "batu" && pilihanKomputer === "gunting") ||
    (pilihanPlayer === "gunting" && pilihanKomputer === "kertas") ||
    (pilihanPlayer === "kertas" && pilihanKomputer === "batu")
  ) {
    hasil = "KAMU MENANG! 🎉";
    resultText.style.color = "#7ec699";
  } else {
    hasil = "KAMU KALAH! 💀";
    resultText.style.color = "#ff5f56";
  }

  resultText.innerHTML = `Kamu: <b>${pilihanPlayer.toUpperCase()}</b> VS Komputer: <b>${pilihanKomputer.toUpperCase()}</b><br><br>${hasil}`;
}

/* =========================================================== */
/* BAGIAN 3: LOGIKA KUIS (10 SOAL)                             */
/* =========================================================== */

window.cekQuiz = function() {
  const hasil = document.getElementById("quizResult");
  if (!hasil) return;

  const kunciJawaban = ["c", "b", "d", "c", "d", "b", "c", "c", "c", "c"];
  let jumlahBenar = 0;
  const totalSoal = 10;

  for (let i = 1; i <= totalSoal; i++) {
    const jawabanUser = document.querySelector(`input[name="q${i}"]:checked`);
    if (jawabanUser && jawabanUser.value === kunciJawaban[i - 1]) {
      jumlahBenar++;
    }
  }

  const skor = (jumlahBenar / totalSoal) * 100;

  if (skor >= 80) {
    hasil.style.color = "#7ec699";
    hasil.innerText = `Luar Biasa! Skor: ${skor} / 100 (${jumlahBenar} Benar)`;
  } else if (skor >= 60) {
    hasil.style.color = "#ffbd2e";
    hasil.innerText = `Cukup Bagus! Skor: ${skor} / 100 (${jumlahBenar} Benar)`;
  } else {
    hasil.style.color = "#ff5f56";
    hasil.innerText = `Jangan Menyerah! Skor: ${skor} / 100 (${jumlahBenar} Benar)`;
  }
}

/* =========================================================== */
/* BAGIAN 4: DATABASE MATERI                                   */
/* =========================================================== */

window.bukaDetail = function(materi) {
  const modal = document.getElementById("detailModal");
  const modalBody = document.getElementById("modalBody");
  if (!modal || !modalBody) return;

  let konten = "";

  // --- 1. HTML ---
  if (materi === "html") {
    konten = `
            <h2 class="modal-title">HTML (HyperText Markup Language)</h2>
            <p class="modal-description">HTML adalah bahasa markup standar yang digunakan untuk menyusun struktur halaman website. HTML menjadi dasar dari semua halaman web.</p>
            <div class="modal-benefits"><h4>Fungsi HTML:</h4><ol><li>Menentukan struktur dan konten halaman web</li><li>Menampilkan teks, gambar, audio, dan video</li><li>Membuat hyperlink antar halaman</li><li>Membuat tabel dan form input</li></ol></div>
            <div class="modal-benefits"><h4>Struktur Dasar HTML:</h4><ul><li><code>&lt;!DOCTYPE html&gt;</code> : deklarasi dokumen</li><li><code>&lt;html&gt;</code> : elemen utama</li><li><code>&lt;head&gt;</code> : informasi halaman</li><li><code>&lt;body&gt;</code> : isi halaman</li></ul></div>
            <div class="modal-benefits"><h4>Elemen HTML yang Sering Digunakan:</h4><ul><li><strong>Heading:</strong> <code>&lt;h1&gt;</code> – <code>&lt;h6&gt;</code></li><li><strong>Paragraf:</strong> <code>&lt;p&gt;</code></li><li><strong>Gambar:</strong> <code>&lt;img&gt;</code></li><li><strong>Link:</strong> <code>&lt;a&gt;</code></li><li><strong>List:</strong> <code>&lt;ul&gt;</code>, <code>&lt;ol&gt;</code>, <code>&lt;li&gt;</code></li><li><strong>Form:</strong> <code>&lt;form&gt;</code>, <code>&lt;input&gt;</code>, <code>&lt;button&gt;</code></li></ul></div>
            <div class="modal-example"><h4>Contoh HTML Lengkap:</h4><div class="code-example">&lt;!DOCTYPE html&gt;\n&lt;html&gt;\n  &lt;head&gt;\n    &lt;title&gt;Website PPLG&lt;/title&gt;\n  &lt;/head&gt;\n  &lt;body&gt;\n    &lt;h1&gt;Selamat Datang di PPLG&lt;/h1&gt;\n    &lt;p&gt;Belajar HTML itu menyenangkan&lt;/p&gt;\n    &lt;ul&gt;\n      &lt;li&gt;HTML&lt;/li&gt;\n      &lt;li&gt;CSS&lt;/li&gt;\n      &lt;li&gt;JavaScript&lt;/li&gt;\n    &lt;/ul&gt;\n  &lt;/body&gt;\n&lt;/html&gt;</div></div>`;
  }
  // --- 2. CSS ---
  else if (materi === "css") {
    konten = `
            <h2 class="modal-title">CSS (Cascading Style Sheets)</h2>
            <p class="modal-description">CSS adalah bahasa yang digunakan untuk mengatur tampilan halaman web agar lebih menarik dan mudah digunakan.</p>
            <div class="modal-benefits"><h4>Fungsi CSS:</h4><ol><li>Mengatur warna, font, dan ukuran</li><li>Mengatur layout halaman</li><li>Membuat animasi sederhana</li><li>Membuat website responsif</li></ol></div>
            <div class="modal-benefits"><h4>Cara Menggunakan CSS:</h4><ul><li><strong>Inline CSS:</strong> Ditulis langsung di elemen HTML.</li><li><strong>Internal CSS:</strong> Ditulis di dalam tag <code>&lt;style&gt;</code>.</li><li><strong>External CSS:</strong> File terpisah (.css).</li></ul></div>
            <div class="modal-benefits"><h4>Properti CSS Umum:</h4><ul><li><code>color</code>, <code>background-color</code></li><li><code>font-size</code>, <code>font-family</code></li><li><code>margin</code> dan <code>padding</code></li><li><code>border</code></li></ul></div>
            <div class="modal-example"><h4>Contoh CSS:</h4><div class="code-example">body {\n  background-color: #eef;\n  font-family: Arial;\n}\nh1 {\n  color: blue;\n}</div></div>`;
  }
  // --- 3. JAVASCRIPT ---
  else if (materi === "javascript") {
    konten = `
            <h2 class="modal-title">JavaScript (JS)</h2>
            <p class="modal-description">JavaScript adalah bahasa pemrograman yang membuat website menjadi interaktif dan dinamis.</p>
            <div class="modal-benefits"><h4>Fungsi JavaScript:</h4><ol><li>Menangani event (klik, input)</li><li>Mengolah data</li><li>Validasi form</li><li>Membuat game berbasis web</li></ol></div>
            <div class="modal-benefits"><h4>Dasar JavaScript:</h4><ul><li><strong>Variabel:</strong> <code>let</code>, <code>const</code></li><li><strong>Operator</strong> (+, -, *, /)</li><li><strong>Percabangan:</strong> <code>if else</code></li><li><strong>Perulangan:</strong> <code>for</code>, <code>while</code></li><li><strong>Function</strong></li></ul></div>
            <div class="modal-example"><h4>Contoh JavaScript:</h4><div class="code-example">&lt;script&gt;\nlet nilai = 80;\nif (nilai >= 75) {\n  alert("Lulus");\n} else {\n  alert("Tidak Lulus");\n}\n&lt;/script&gt;</div></div>`;
  }
  // --- 4. GAME DEV ---
  else if (materi === "gamedev") {
    konten = `
            <h2 class="modal-title">Gim dan Game Development</h2>
            <p class="modal-description">Gim adalah perangkat lunak interaktif yang dibuat untuk hiburan, edukasi, atau simulasi.</p>
            <div class="modal-benefits"><h4>Unsur Gim:</h4><ol><li>Player (Pemain)</li><li>Aturan permainan</li><li>Skor</li><li>Level</li><li>Tantangan</li></ol></div>
            <div class="modal-benefits"><h4>Alur Pembuatan Gim:</h4><ol><li>Ide dan konsep</li><li>Desain karakter dan aturan</li><li>Pembuatan kode (Coding)</li><li>Pengujian (Testing)</li><li>Perbaikan (Debugging)</li></ol></div>
            <div class="modal-example"><h4>Contoh Logika Game Sederhana:</h4><div class="code-example">&lt;script&gt;\nlet skor = 0;\nfunction tambahSkor() {\n  skor++;\n  alert("Skor: " + skor);\n}\n&lt;/script&gt;\n&lt;button onclick="tambahSkor()"&gt;Tambah Skor&lt;/button&gt;</div></div>`;
  }
  // --- 5. TOOLS GAME ---
  else if (materi === "toolsgame") {
    konten = `
            <h2 class="modal-title">Software dalam PPLG</h2>
            <p class="modal-description">Software adalah perangkat lunak yang digunakan untuk membantu pekerjaan pemrograman dan pengembangan.</p>
            <div class="modal-benefits"><h4>Jenis Software:</h4><ol><li><strong>Software Sistem:</strong> Windows, Linux, MacOS.</li><li><strong>Software Aplikasi:</strong> Microsoft Office, Browser.</li><li><strong>Software Pemrograman:</strong> VS Code, Python, Java.</li></ol></div>
            <div class="modal-benefits"><h4>Contoh Software Pendukung:</h4><ul><li><strong>Web Browser:</strong> Chrome, Firefox (Untuk menjalankan web).</li><li><strong>Text Editor:</strong> VS Code, Sublime Text (Untuk ngetik kode).</li><li><strong>Compiler/Interpreter:</strong> Menerjemahkan kode ke bahasa mesin.</li><li><strong>Software Desain:</strong> Figma, Photoshop, Canva.</li></ul></div>`;
  }
  // --- 6. TOOLS DEV ---
  else if (materi === "toolsdev") {
    konten = `
            <h2 class="modal-title">Code Editor</h2>
            <p class="modal-description">Code editor adalah software yang digunakan untuk menulis dan mengedit kode program.</p>
            <div class="modal-benefits"><h4>Fungsi Code Editor:</h4><ol><li>Menulis kode dengan rapi.</li><li>Memberi warna pada kode (Syntax Highlighting) agar mudah dibaca.</li><li>Membantu mendeteksi kesalahan (Error detection).</li></ol></div>
            <div class="modal-benefits"><h4>Fitur Umum:</h4><ul><li><strong>Auto Complete:</strong> Melengkapi kode otomatis.</li><li><strong>Syntax Highlighting:</strong> Pewarnaan kode.</li><li><strong>Extension / Plugin:</strong> Menambah fitur tambahan.</li></ul></div>
            <div class="modal-example"><h4>Contoh Code Editor Populer:</h4><ul><li>Visual Studio Code (Paling populer)</li><li>Sublime Text (Ringan)</li><li>Notepad++ (Klasik)</li><li>Atom</li></ul></div>`;
  }
  // --- TIM ---
  else if (materi === "member1") {
    konten = `<div style="text-align:center;"><img src="https://ui-avatars.com/api/?name=Aditya+R&background=6c63ff&color=fff&size=128" style="border-radius:50%; margin-bottom:15px; border:3px solid #6c63ff;"><h2 class="modal-title">Aditya R.</h2><p style="color:#6c63ff; font-weight:bold;">PROJECT MANAGER</p></div><div class="modal-benefits"><h4>Tentang Saya:</h4><p>"Pemimpin yang percaya bahwa kode yang bersih berawal dari komunikasi yang jelas."</p></div>`;
  } else if (materi === "member2") {
    konten = `<div style="text-align:center;"><img src="https://ui-avatars.com/api/?name=Bunga+C&background=ff5f56&color=fff&size=128" style="border-radius:50%; margin-bottom:15px; border:3px solid #ff5f56;"><h2 class="modal-title">Bunga C.</h2><p style="color:#ff5f56; font-weight:bold;">UI/UX DESIGNER</p></div><div class="modal-benefits"><h4>Tentang Saya:</h4><p>Mendesain antarmuka yang tidak hanya cantik, tapi juga mudah digunakan.</p></div>`;
  } else if (materi === "member3") {
    konten = `<div style="text-align:center;"><img src="https://ui-avatars.com/api/?name=Chandra+K&background=27c93f&color=fff&size=128" style="border-radius:50%; margin-bottom:15px; border:3px solid #27c93f;"><h2 class="modal-title">Chandra K.</h2><p style="color:#27c93f; font-weight:bold;">FULL STACK DEV</p></div><div class="modal-benefits"><h4>Tentang Saya:</h4><p>Menguasai sisi depan (Frontend) yang indah dan sisi belakang (Backend) yang kuat.</p></div>`;
  } else if (materi === "member4") {
    konten = `<div style="text-align:center;"><img src="https://ui-avatars.com/api/?name=Dinda+P&background=ffbd2e&color=fff&size=128" style="border-radius:50%; margin-bottom:15px; border:3px solid #ffbd2e;"><h2 class="modal-title">Dinda P.</h2><p style="color:#ffbd2e; font-weight:bold;">GAME DEVELOPER</p></div><div class="modal-benefits"><h4>Tentang Saya:</h4><p>Menciptakan dunia virtual interaktif dan logika permainan yang menantang.</p></div>`;
  } else if (materi === "member5") {
    konten = `<div style="text-align:center;"><img src="https://ui-avatars.com/api/?name=Eko+S&background=00f3ff&color=fff&size=128" style="border-radius:50%; margin-bottom:15px; border:3px solid #00f3ff;"><h2 class="modal-title">Eko S.</h2><p style="color:#00f3ff; font-weight:bold;">QUALITY ASSURANCE</p></div><div class="modal-benefits"><h4>Tentang Saya:</h4><p>"Detektif Bug". Saya tidak akan membiarkan satu kesalahan pun lolos.</p></div>`;
  }

  modalBody.innerHTML = konten;
  modal.style.display = "block";
}

/* =========================================================== */
/* BAGIAN 5: UTILITY (EVENT LISTENER)                          */
/* =========================================================== */

window.tutupDetail = function() {
  const modal = document.getElementById("detailModal");
  if (modal) modal.style.display = "none";
}

window.onclick = function (event) {
  const modal = document.getElementById("detailModal");
  const modalLogin = document.getElementById("loginModal");
  if (event.target == modal) window.tutupDetail();
  if (event.target == modalLogin) window.tutupLogin();
};

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    window.tutupDetail();
    window.tutupLogin();
  }
});

// Event Listener Tebak Angka
const inputTebak = document.getElementById("tebakInput");
if (inputTebak) {
  inputTebak.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      mainkanGame();
    }
  });
}

// Hamburger Menu
window.toggleMenu = function() {
  const navLinks = document.querySelector(".nav-links");
  if (navLinks) navLinks.classList.toggle("active");
}

// Scroll Reveal
const revealElements = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      }
    });
  },
  { threshold: 0.15 },
);
revealElements.forEach((el) => revealObserver.observe(el));


/* ========================================= */
/* ===  MUSIC PLAYER (YOUTUBE API)       === */
/* ========================================= */

var player;
var isPlaying = false;

// 1. Memuat IFrame Player API
var tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// Fungsi ini harus window.agar bisa diakses API YouTube
window.onYouTubeIframeAPIReady = function() {
  player = new YT.Player("music-player", {
    height: "0",
    width: "0",
    videoId: "hEAMhsRE5rc", // Cheerleader - Porter Robinson
    playerVars: {
      autoplay: 0,
      controls: 0,
      loop: 1,
      playlist: "hEAMhsRE5rc",
    },
    events: {
      onReady: onPlayerReady,
    },
  });
}

function onPlayerReady(event) {
  event.target.setVolume(40);
}

window.toggleMusic = function() {
  var btn = document.getElementById("musicBtn");
  if (isPlaying) {
    player.pauseVideo();
    btn.innerHTML = "🎵 Play Music";
    btn.classList.remove("music-playing");
    isPlaying = false;
  } else {
    player.playVideo();
    btn.innerHTML = "⏸ Pause Music";
    btn.classList.add("music-playing");
    isPlaying = true;
  }
}
