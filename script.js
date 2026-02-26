/* =========================================================== */
/* BAGIAN 0: SETUP FIREBASE & KONFIGURASI                      */
/* =========================================================== */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  updateProfile,
  updatePassword,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// --- KONFIGURASI FIREBASE ---
const firebaseConfig = {
  apiKey: "AIzaSyBrHbchi0sGC3LS7ZP6B4jAFwt338C2Aq0",
  authDomain: "webbelajarpplg.firebaseapp.com",
  projectId: "webbelajarpplg",
  storageBucket: "webbelajarpplg.firebasestorage.app",
  messagingSenderId: "1027186626520",
  appId: "1:1027186626520:web:44b34aa6fd76692022ecad",
  measurementId: "G-MNJB98BF4T",
};

// --- KONFIGURASI CLOUDINARY ---
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dqybajzya/image/upload";
const CLOUDINARY_PRESET = "pplg_preset";

let app, auth;
try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
} catch (e) {
  console.error("Firebase Config Error:", e);
}

let isRegisterMode = false;

/* =========================================================== */
/* BAGIAN 1: AUTHENTICATION, PROFILE & CLOUDINARY              */
/* =========================================================== */

window.toggleProfileMenu = function () {
  document.getElementById("dropdownContent").classList.toggle("show");
};

// --- LOGIKA LOGIN & REGISTER ---
window.bukaLogin = function () {
  const modal = document.getElementById("loginModal");
  if (modal) modal.style.display = "block";
};

window.tutupLogin = function () {
  document.getElementById("loginModal").style.display = "none";
};

window.switchAuthMode = function () {
  isRegisterMode = !isRegisterMode;
  const title = document.getElementById("modalTitle");
  const btn = document.querySelector("#authForm button");
  const toggleText = document.querySelector("#loginModal a");
  const usernameInput = document.getElementById("username");

  if (isRegisterMode) {
    title.innerText = "Daftar Akun Baru";
    btn.innerText = "Daftar Sekarang";
    toggleText.innerText = "Sudah punya akun? Login";
    usernameInput.style.display = "block";
    usernameInput.setAttribute("required", "true");
  } else {
    title.innerText = "Masuk Akun";
    btn.innerText = "Masuk Sekarang";
    toggleText.innerText = "Belum punya akun? Daftar";
    usernameInput.style.display = "none";
    usernameInput.removeAttribute("required");
  }
};

window.handleAuth = async function (event) {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;
  const username = document.getElementById("username").value;
  const errorText = document.getElementById("authError");
  errorText.innerText = "Loading...";

  try {
    if (isRegisterMode) {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      await updateProfile(userCredential.user, { displayName: username });
      alert(`Halo ${username}! Akun berhasil dibuat.`);
      window.tutupLogin();
      location.reload();
    } else {
      await signInWithEmailAndPassword(auth, email, pass);
      alert("Berhasil masuk!");
      window.tutupLogin();
    }
  } catch (error) {
    console.error(error);
    errorText.innerText = "Error: " + error.message;
  }
};

window.handleLogout = async function () {
  if (confirm("Yakin ingin keluar?")) {
    await signOut(auth);
    location.reload();
  }
};

// --- CEK STATUS LOGIN (LISTENER) ---
if (auth) {
  onAuthStateChanged(auth, (user) => {
    const loginBtn = document.getElementById("navLoginBtn");
    const userMenu = document.getElementById("userMenu");
    const navImg = document.getElementById("navUserImg");
    const navName = document.getElementById("navUserName");

    if (user) {
      if (loginBtn) loginBtn.style.display = "none";
      if (userMenu) userMenu.style.display = "flex";

      const name = user.displayName || user.email.split("@")[0];
      const photo = user.photoURL || `https://ui-avatars.com/api/?name=${name}&background=ff746c&color=fff`;

      if (navName) navName.innerText = `Halo, ${name}`;
      if (navImg) navImg.src = photo;
    } else {
      if (loginBtn) loginBtn.style.display = "block";
      if (userMenu) userMenu.style.display = "none";
    }
  });
}

// --- LOGIKA UPLOAD FOTO (CLOUDINARY) ---
window.ubahPFP = function () {
  const fileInput = document.getElementById("fileInputPFP");
  if (fileInput) fileInput.click();
};

const fileInput = document.getElementById("fileInputPFP");
if (fileInput) {
  fileInput.addEventListener("change", async function (e) {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("File terlalu besar! Maksimal 2MB.");
      return;
    }

    const navImg = document.getElementById("navUserImg");
    navImg.style.opacity = "0.5";
    alert("Sedang mengupload foto...");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_PRESET);

    try {
      const response = await fetch(CLOUDINARY_URL, { method: "POST", body: formData });
      if (!response.ok) throw new Error("Gagal upload ke Cloudinary");
      
      const data = await response.json();
      const imageUrl = data.secure_url;
      
      // Simpan ke Firebase
      await window.simpanFotoKeFirebase(imageUrl);

    } catch (error) {
      console.error(error);
      alert("Gagal upload foto.");
      navImg.style.opacity = "1";
    }
  });
}

// Fungsi Simpan Link Foto ke Firebase
window.simpanFotoKeFirebase = async function (url) {
  const user = auth.currentUser;
  if (user) {
     try {
        // Trik dispatch event agar module bisa menangkap URL
        const event = new CustomEvent("fotoBaruTersedia", { detail: url });
        window.dispatchEvent(event);
     } catch (e) { console.error(e); }
  }
};

// Listener untuk Update Profil Firebase (Menerima Event dari Window)
window.addEventListener("fotoBaruTersedia", async (e) => {
  const url = e.detail;
  const user = auth.currentUser;
  if (user) {
    try {
      await updateProfile(user, { photoURL: url });
      document.getElementById("navUserImg").src = url;
      document.getElementById("navUserImg").style.opacity = "1";
      alert("Foto Profil Berhasil Diupdate!");
    } catch (error) {
      alert("Gagal update profil: " + error.message);
    }
  }
});

// --- UBAH PASSWORD ---
window.ubahPassword = async function () {
  const user = auth.currentUser;
  if (user) {
    const newPass = prompt("Masukkan Password Baru (Min 6 karakter):");
    if (newPass && newPass.length >= 6) {
      try {
        await updatePassword(user, newPass);
        alert("Password berhasil diubah! Login ulang ya.");
        await signOut(auth);
        location.reload();
      } catch (error) {
        alert("Gagal: " + error.message);
      }
    }
  }
};

// --- MODAL PENGATURAN AKUN ---
window.bukaPengaturan = function () {
  const modal = document.getElementById("settingsModal");
  const user = auth.currentUser;
  if (user && modal) {
    const name = user.displayName || "User";
    const email = user.email;
    const photo = user.photoURL || `https://ui-avatars.com/api/?name=${name}&background=ff746c&color=fff`;

    document.getElementById("settingsName").innerText = name;
    document.getElementById("settingsEmail").innerText = email;
    document.getElementById("settingsPFP").src = photo;
    
    modal.style.display = "block";
    document.getElementById("dropdownContent").classList.remove("show");
  }
};

window.tutupPengaturan = function () {
  document.getElementById("settingsModal").style.display = "none";
};

/* =========================================================== */
/* BAGIAN 2: LOGIKA GAMES (SIMULASI)                           */
/* =========================================================== */

let targetAngka = Math.floor(Math.random() * 10) + 1;

window.mainkanGame = function () {
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
    resultTextElem.innerText = "BENAR! Angkanya: " + targetAngka;
    targetAngka = Math.floor(Math.random() * 10) + 1;
    inputUserElem.value = "";
  } else if (inputUser > targetAngka) {
    resultTextElem.style.color = "#ff5f56";
    resultTextElem.innerText = "Terlalu tinggi!";
  } else {
    resultTextElem.style.color = "#ff5f56";
    resultTextElem.innerText = "Terlalu rendah!";
  }
};

window.mainkanSuit = function (pilihanPlayer) {
  const resultText = document.getElementById("suitResult");
  if(!resultText) return;
  
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
  resultText.innerHTML = `Kamu: <b>${pilihanPlayer}</b> VS CPU: <b>${pilihanKomputer}</b><br>${hasil}`;
};


/* =========================================================== */
/* BAGIAN 3: KUIS STEP-BY-STEP (LIVE SCORE FIX)                */
/* =========================================================== */

const questionsData = [
    { question: "Fungsi utama tag <head> dalam HTML?", options: ["Isi Web", "Interaktif", "Metadata", "Tampilan"], correct: 2 },
    { question: "Beda HTML vs CSS?", options: ["Logika vs Data", "Struktur vs Tampilan", "Animasi vs DB", "Server vs Client"], correct: 1 },
    { question: "CSS untuk responsif mengatur apa?", options: ["Form", "Data", "Interaksi", "Layout"], correct: 3 },
    { question: "Atribut onclick gunanya?", options: ["Saat dibuka", "Saat hover", "Saat diklik", "Otomatis"], correct: 2 },
    { question: "Yang BUKAN unsur gim?", options: ["Player", "Compiler", "Aturan", "Tantangan"], correct: 1 },
    { question: "Alur buat gim?", options: ["Kode-Ide-Uji", "Ide-Desain-Kode-Uji", "Desain-Ide", "Ide-Kode-Desain"], correct: 1 },
    { question: "Variabel JS tidak boleh berubah?", options: ["var", "let", "const", "function"], correct: 2 },
    { question: "Fungsi Code Editor?", options: ["OS", "DB", "Nulis Kode", "Hosting"], correct: 2 },
    { question: "Contoh Software Pemrograman?", options: ["Windows", "Chrome", "VS Code", "Photoshop"], correct: 2 },
    { question: "Kenapa harus tanggung jawab sama kode?", options: ["Biar Panjang", "Warna-warni", "Mudah dipahami", "Lambat"], correct: 2 }
];

let currentQuestionIndex = 0;
let score = 0;
let selectedOptionIndex = null;

// Fungsi Render Soal
function loadQuestion() {
    const questionEl = document.getElementById("question-text");
    const optionsEl = document.getElementById("options-container");
    const progressText = document.getElementById("question-number");
    const progressBar = document.getElementById("progress-bar");
    const nextBtn = document.getElementById("next-btn");
    
    // Validasi agar tidak error di halaman lain (Misal di Beranda)
    if(!questionEl) return; 

    const currentData = questionsData[currentQuestionIndex];
    selectedOptionIndex = null;
    nextBtn.disabled = true;
    nextBtn.innerHTML = (currentQuestionIndex === questionsData.length - 1) ? "Selesai" : "Selanjutnya <i class='fa-solid fa-arrow-right'></i>";
    
    // Update Teks Soal & Progress
    questionEl.innerText = `${currentQuestionIndex + 1}. ${currentData.question}`;
    progressText.innerText = `Soal ${currentQuestionIndex + 1} / ${questionsData.length}`;
    progressBar.style.width = `${((currentQuestionIndex) / questionsData.length) * 100}%`;

    // Render Pilihan Jawaban
    optionsEl.innerHTML = "";
    currentData.options.forEach((opt, index) => {
        const btn = document.createElement("button");
        btn.classList.add("option-btn");
        btn.innerText = opt;
        btn.onclick = () => {
            selectedOptionIndex = index;
            // Visualisasi pilihan
            document.querySelectorAll(".option-btn").forEach(b => b.classList.remove("selected"));
            btn.classList.add("selected");
            // Aktifkan tombol next
            nextBtn.disabled = false;
        };
        optionsEl.appendChild(btn);
    });
}

// Fungsi Pindah Soal / Selesai (DIPERBAIKI)
window.nextQuestion = function() {
    // Cek jawaban
    if (selectedOptionIndex === questionsData[currentQuestionIndex].correct) {
        score += 10;
        // --- LIVE SCORE UPDATE ---
        const scoreElem = document.getElementById("score-live");
        if(scoreElem) {
            scoreElem.innerText = `Score: ${score}`;
        }
    }
    
    currentQuestionIndex++;
    
    if (currentQuestionIndex < questionsData.length) {
        loadQuestion();
    } else {
        // Tampilkan Hasil Akhir
        document.getElementById("quiz-container").style.display = "none";
        document.getElementById("result-container").style.display = "block";
        document.getElementById("final-score").innerText = score;
    }
}

// --- INISIALISASI KUIS OTOMATIS (FIX LOADING TERUS) ---
// Langsung cek apakah elemen kuis ada di halaman saat script dimuat
const quizContainer = document.getElementById("quiz-container");
if (quizContainer) {
    loadQuestion();
}


/* =========================================================== */
/* BAGIAN 4: MATERI & VIDEO (UPDATE MATERI BARU)               */
/* =========================================================== */

const databaseMateri = {
  html: { 
      title: "2. HTML (HyperText Markup Language)", 
      videoId: "NBZ9Ro6UKV8", 
      content: `
        <p>HTML adalah bahasa markup standar yang digunakan untuk menyusun struktur halaman website. HTML menjadi dasar dari semua halaman web.</p>
        
        <h3>Fungsi HTML:</h3>
        <ul>
            <li>Menentukan struktur dan konten halaman web</li>
            <li>Menampilkan teks, gambar, audio, dan video</li>
            <li>Membuat hyperlink antar halaman</li>
            <li>Membuat tabel dan form input</li>
        </ul>

        <h3>Elemen HTML yang Sering Digunakan:</h3>
        <ol>
            <li><strong>Heading:</strong> &lt;h1&gt; – &lt;h6&gt;</li>
            <li><strong>Paragraf:</strong> &lt;p&gt;</li>
            <li><strong>Gambar:</strong> &lt;img&gt;</li>
            <li><strong>Link:</strong> &lt;a&gt;</li>
            <li><strong>List:</strong> &lt;ul&gt;, &lt;ol&gt;, &lt;li&gt;</li>
            <li><strong>Form:</strong> &lt;form&gt;, &lt;input&gt;, &lt;button&gt;</li>
        </ol>

        <h3>Contoh HTML Lengkap:</h3>
        <pre>&lt;!DOCTYPE html&gt;
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
&lt;/html&gt;</pre>
      ` 
  },
  css: { 
      title: "3. CSS (Cascading Style Sheets)", 
      videoId: "CleFk3BZB3g", 
      content: `
        <p>CSS adalah bahasa yang digunakan untuk mengatur tampilan halaman web agar lebih menarik dan mudah digunakan.</p>
        
        <h3>Fungsi CSS:</h3>
        <ul>
            <li>Mengatur warna, font, dan ukuran</li>
            <li>Mengatur layout halaman</li>
            <li>Membuat animasi sederhana</li>
            <li>Membuat website responsif</li>
        </ul>

        <h3>Cara Menggunakan CSS:</h3>
        <ol>
            <li><strong>Inline CSS:</strong> Langsung di elemen HTML</li>
            <li><strong>Internal CSS:</strong> Di dalam tag &lt;style&gt;</li>
            <li><strong>External CSS:</strong> File terpisah (.css)</li>
        </ol>

        <h3>Contoh CSS:</h3>
        <pre>body {
  background-color: #eef;
  font-family: Arial;
}
h1 {
  color: blue;
}</pre>
      ` 
  },
  javascript: { 
      title: "4. JavaScript (JS)", 
      videoId: "RUTV_5m4WIV", 
      content: `
        <p>JavaScript adalah bahasa pemrograman yang membuat website menjadi interaktif dan dinamis.</p>
        
        <h3>Fungsi JavaScript:</h3>
        <ul>
            <li>Menangani event (klik, input)</li>
            <li>Mengolah data</li>
            <li>Validasi form</li>
            <li>Membuat game berbasis web</li>
        </ul>

        <h3>Dasar JavaScript:</h3>
        <ul>
            <li><strong>Variabel:</strong> let, const</li>
            <li><strong>Operator:</strong> +, -, *, /</li>
            <li><strong>Percabangan:</strong> if else</li>
            <li><strong>Perulangan:</strong> for, while</li>
            <li><strong>Function</strong></li>
        </ul>

        <h3>Contoh JavaScript:</h3>
        <pre>&lt;script&gt;
let nilai = 80;
if (nilai >= 75) {
  alert("Lulus");
} else {
  alert("Tidak Lulus");
}
&lt;/script&gt;</pre>
      ` 
  },
  gamedev: { 
      title: "5. Gim dan Game Development", 
      videoId: "z0kTMXv3fQI", 
      content: `
        <p>Gim adalah perangkat lunak interaktif yang dibuat untuk hiburan, edukasi, atau simulasi.</p>
        
        <h3>Unsur Gim:</h3>
        <ol>
            <li>Player</li>
            <li>Aturan permainan</li>
            <li>Skor</li>
            <li>Level</li>
            <li>Tantangan</li>
        </ol>

        <h3>Alur Pembuatan Gim:</h3>
        <ol>
            <li>Ide dan konsep</li>
            <li>Desain karakter dan aturan</li>
            <li>Pembuatan kode</li>
            <li>Pengujian</li>
            <li>Perbaikan</li>
        </ol>

        <h3>Contoh Logika Game Sederhana:</h3>
        <pre>&lt;script&gt;
let skor = 0;
function tambahSkor() {
  skor++;
  alert("Skor: " + skor);
}
&lt;/script&gt;
&lt;button onclick="tambahSkor()"&gt;Tambah Skor&lt;/button&gt;</pre>
      ` 
  },
  toolsdev: { 
      title: "1. Pengenalan PPLG & Tools", 
      videoId: "8aGhZQkoFbQ", 
      content: `
        <h3>Apa itu PPLG?</h3>
        <p>PPLG (Pengembangan Perangkat Lunak dan Gim) adalah jurusan yang mempelajari proses pembuatan perangkat lunak (software) dan gim mulai dari perencanaan, perancangan, pembuatan, pengujian, hingga pemeliharaan. Jurusan ini menekankan kemampuan berpikir logis, analitis, kreatif, dan pemecahan masalah.</p>

        <h3>Tujuan Pembelajaran PPLG:</h3>
        <ol>
            <li>Memahami konsep dasar pemrograman</li>
            <li>Mampu membuat website dan aplikasi sederhana</li>
            <li>Mampu membuat gim sederhana</li>
            <li>Memahami penggunaan software pendukung pemrograman</li>
        </ol>

        <h3>Sikap yang Diharapkan:</h3>
        <ul>
            <li>Teliti dan sabar</li>
            <li>Mampu bekerja mandiri dan tim</li>
            <li>Berpikir kritis dan kreatif</li>
            <li>Bertanggung jawab terhadap kode yang dibuat</li>
        </ul>

        <hr>

        <h3>6. Software dalam PPLG</h3>
        <p>Software adalah perangkat lunak yang digunakan untuk membantu pekerjaan pemrograman.</p>
        <p><strong>Contoh Software Pendukung:</strong></p>
        <ul>
            <li>Web browser (Chrome, Firefox)</li>
            <li>Text editor / Code editor</li>
            <li>Compiler dan interpreter</li>
            <li>Software desain</li>
        </ul>

        <h3>7. Code Editor</h3>
        <p>Code editor adalah software yang digunakan untuk menulis dan mengedit kode program.</p>
        <p><strong>Fungsi:</strong> Menulis kode rapi, syntax highlighting, deteksi kesalahan.</p>
        <p><strong>Contoh Populer:</strong> Visual Studio Code, Sublime Text, Notepad++, Atom.</p>
      ` 
  },
};

window.bukaDetail = function (key) {
  const modal = document.getElementById("detailModal");
  const data = databaseMateri[key];
  if (data && modal) {
    document.getElementById("materiTitle").innerText = data.title;
    document.getElementById("materiContent").innerHTML = data.content;
    document.getElementById("materiVideo").src = `https://www.youtube.com/embed/${data.videoId}`;
    modal.style.display = "block";
    document.body.style.overflow = "hidden";
  }
};

window.tutupDetail = function () {
  const modal = document.getElementById("detailModal");
  const videoElem = document.getElementById("materiVideo");

  if (modal) {
    modal.style.display = "none";
    if (videoElem) videoElem.src = ""; // Matikan video saat tutup
    document.body.style.overflow = "auto";
  }
};

/* =========================================================== */
/* BAGIAN 5: TIM POPUP                                         */
/* =========================================================== */

const teamData = {
  member1: { 
      name: "Miftah Ramadhan", 
      role: "Project Manager", 
      photo: "miftah.jpeg", 
      desc: "Pemimpin proyek.", 
      skills: ["Leadership", "Agile"], 
      motto: "Kode bersih, pikiran jernih." 
  },
  member2: { 
      name: "Rima Amarida", 
      role: "UI/UX Designer", 
      photo: "rima.jpeg", 
      desc: "Desainer kreatif.", 
      skills: ["Figma", "Design"], 
      motto: "Design is functionality." 
  },
  member3: { 
      name: "Inayattullah Yoga F.", 
      role: "Full Stack Dev", 
      photo: "saya.jpg", 
      desc: "Frontend & Backend.", 
      skills: ["JS", "Firebase"], 
      motto: "Talk is cheap." 
  },
  member4: { 
      name: "Nayla Seftiawati", 
      role: "Pembuat Materi", 
      photo: "nayla.jpeg", 
      desc: "Pembuat Materi.", 
      skills: ["Unity", "C#"], 
      motto: "Level Up!" 
  },
  member5: { 
      name: "Shifa Octaviani", 
      role: "Quality Assurance", 
      photo: "shifa.jpeg", 
      desc: "Pencari Bug.", 
      skills: ["Testing", "Detail"], 
      motto: "Zero Bug." 
  },
};

window.bukaTeam = function (id) {
  const modal = document.getElementById("teamModal");
  const member = teamData[id];
  if (member && modal) {
    document.getElementById("tImg").src = member.photo;
    document.getElementById("tRole").innerText = member.role;
    document.getElementById("tName").innerText = member.name;
    document.getElementById("tDesc").innerText = member.desc;
    document.getElementById("tMotto").innerText = `"${member.motto}"`;
    
    const skillContainer = document.getElementById("tSkills");
    skillContainer.innerHTML = "";
    member.skills.forEach(skill => {
      const span = document.createElement("span");
      span.innerText = skill;
      skillContainer.appendChild(span);
    });
    modal.style.display = "block";
  }
};

window.tutupTeam = function () {
  const modal = document.getElementById("teamModal");
  if (modal) modal.style.display = "none";
};

/* =========================================================== */
/* BAGIAN 6: GLOBAL HANDLER & UTILS                            */
/* =========================================================== */

// GLOBAL CLICK HANDLER (Satu fungsi menangani tutup semua modal)
window.onclick = function (event) {
  // Tutup Dropdown Menu (Titik 3)
  if (!event.target.matches(".three-dots-btn")) {
    const dropdowns = document.getElementsByClassName("dropdown-content");
    for (let i = 0; i < dropdowns.length; i++) {
      if (dropdowns[i].classList.contains("show")) dropdowns[i].classList.remove("show");
    }
  }
  // Tutup Modal jika klik background gelap
  if (event.target === document.getElementById("loginModal")) window.tutupLogin();
  if (event.target === document.getElementById("detailModal")) window.tutupDetail();
  if (event.target === document.getElementById("settingsModal")) window.tutupPengaturan();
  if (event.target === document.getElementById("teamModal")) window.tutupTeam();
};

window.toggleMenu = function () {
  const navLinks = document.querySelector(".nav-links");
  if (navLinks) navLinks.classList.toggle("active");
};

// Scroll Reveal Observer
const revealElements = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add("active"); });
}, { threshold: 0.15 });
revealElements.forEach((el) => revealObserver.observe(el));

/* =========================================================== */
/* BAGIAN 7: MUSIK PLAYER (FIXED & ROBUST)                     */
/* =========================================================== */

var player;
var isPlaying = false;
var isPlayerReady = false; // Penanda apakah musik sudah siap

// Load YouTube API
var tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api"; 
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// Fungsi yang dipanggil otomatis oleh YouTube API saat siap
window.onYouTubeIframeAPIReady = function () {
  player = new YT.Player("music-player", {
    height: "0",
    width: "0",
    // ID Video: Lofi Girl (Pasti Jalan)
    videoId: "rXF9ziZ3AU4", 
    playerVars: { 
        autoplay: 0, 
        controls: 0, 
        loop: 1, 
        playlist: "fk4BbF7B29w", 
        playsinline: 1 
    },
    events: { 
        onReady: (e) => {
            isPlayerReady = true; // Beri tahu kalau sudah siap
            e.target.setVolume(50); 
            console.log("Musik Siap!");
        },
        onError: (e) => {
            console.error("Error YouTube Player:", e.data);
        }
    },
  });
};

// Fungsi Tombol Play/Pause
window.toggleMusic = function () {
  var btn = document.getElementById("musicBtn");
  
  // Cek apakah player sudah siap
  if (!isPlayerReady || !player) {
      alert("Sabar ya, musik sedang dimuat... (Cek koneksi internet)");
      return;
  }

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
};

/* =========================================================== */
/* TAMBAHAN: DOWNLOAD MODUL                                    */
/* =========================================================== */

// Fungsi Download Simulasi
window.downloadModul = function(namaModul) {
    // 1. Konfirmasi
    if (!confirm(`Mau download modul PDF untuk ${namaModul}?`)) return;

    // 2. Efek Loading pada tombol yang diklik
    const btn = event.currentTarget;
    const icon = btn.querySelector("i");
    const oldClass = icon.className;

    // Ubah ikon jadi putaran loading
    icon.className = "fa-solid fa-spinner fa-spin";

    // 3. Simulasi Selesai (2 detik)
    setTimeout(() => {
        icon.className = "fa-solid fa-check"; // Centang sukses
        alert(`✅ Berhasil! Modul ${namaModul} tersimpan.`);
        
        // Balikin ikon semula
        setTimeout(() => icon.className = oldClass, 2000);
    }, 1500);
};
