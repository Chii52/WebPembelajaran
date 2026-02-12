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
/* BAGIAN 1: AUTHENTICATION & USER PROFILE                     */
/* =========================================================== */

window.toggleProfileMenu = function () {
  document.getElementById("dropdownContent").classList.toggle("show");
};

// Login & Register Logic
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

// Cek Status Login
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

// Upload Foto Profil
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
      
      await window.simpanFotoKeFirebase(imageUrl);
    } catch (error) {
      console.error(error);
      alert("Gagal upload foto.");
      navImg.style.opacity = "1";
    }
  });
}

window.simpanFotoKeFirebase = async function (url) {
  const user = auth.currentUser;
  if (user) {
     try {
        // Kita gunakan trik dispatch event karena updateProfile di import module
        const event = new CustomEvent("fotoBaruTersedia", { detail: url });
        window.dispatchEvent(event);
     } catch (e) { console.error(e); }
  }
};

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

// Modal Pengaturan
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
    hasil = "SERI! ";
    resultText.style.color = "#ffbd2e";
  } else if (
    (pilihanPlayer === "batu" && pilihanKomputer === "gunting") ||
    (pilihanPlayer === "gunting" && pilihanKomputer === "kertas") ||
    (pilihanPlayer === "kertas" && pilihanKomputer === "batu")
  ) {
    hasil = "KAMU MENANG! 脂";
    resultText.style.color = "#7ec699";
  } else {
    hasil = "KAMU KALAH! 逐";
    resultText.style.color = "#ff5f56";
  }
  resultText.innerHTML = `Kamu: <b>${pilihanPlayer}</b> VS CPU: <b>${pilihanKomputer}</b><br>${hasil}`;
};


/* =========================================================== */
/* BAGIAN 3: KUIS STEP-BY-STEP (YANG HILANG TADI)              */
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

function loadQuestion() {
    const questionEl = document.getElementById("question-text");
    const optionsEl = document.getElementById("options-container");
    const progressText = document.getElementById("question-number");
    const progressBar = document.getElementById("progress-bar");
    const nextBtn = document.getElementById("next-btn");
    
    if(!questionEl) return; // Cegah error kalau bukan di halaman kuis

    const currentData = questionsData[currentQuestionIndex];
    selectedOptionIndex = null;
    nextBtn.disabled = true;
    nextBtn.innerHTML = (currentQuestionIndex === questionsData.length - 1) ? "Selesai" : "Selanjutnya <i class='fa-solid fa-arrow-right'></i>";
    
    questionEl.innerText = `${currentQuestionIndex + 1}. ${currentData.question}`;
    progressText.innerText = `Soal ${currentQuestionIndex + 1} / ${questionsData.length}`;
    progressBar.style.width = `${((currentQuestionIndex) / questionsData.length) * 100}%`;

    optionsEl.innerHTML = "";
    currentData.options.forEach((opt, index) => {
        const btn = document.createElement("button");
        btn.classList.add("option-btn");
        btn.innerText = opt;
        btn.onclick = () => {
            selectedOptionIndex = index;
            document.querySelectorAll(".option-btn").forEach(b => b.classList.remove("selected"));
            btn.classList.add("selected");
            nextBtn.disabled = false;
        };
        optionsEl.appendChild(btn);
    });
}

window.nextQuestion = function() {
    if (selectedOptionIndex === questionsData[currentQuestionIndex].correct) score += 10;
    currentQuestionIndex++;
    if (currentQuestionIndex < questionsData.length) {
        loadQuestion();
    } else {
        document.getElementById("quiz-container").style.display = "none";
        document.getElementById("result-container").style.display = "block";
        document.getElementById("final-score").innerText = score;
    }
}

// --- INISIALISASI KUIS OTOMATIS (PERBAIKAN LOADING) ---
// Cek apakah elemen kuis ada di halaman ini
const quizContainer = document.getElementById("quiz-container");
if (quizContainer) {
    loadQuestion();
}


/* =========================================================== */
/* BAGIAN 4: MATERI & VIDEO                                    */
/* =========================================================== */

const databaseMateri = {
  html: { title: "HTML5 Dasar", videoId: "NBZ9Ro6UKV8", content: "<p>HTML adalah kerangka web...</p>" },
  css: { title: "CSS3 Styling", videoId: "CleFk3BZB3g", content: "<p>CSS mempercantik web...</p>" },
  javascript: { title: "JavaScript Logic", videoId: "RUTV_5m4WIV", content: "<p>JS bikin web hidup...</p>" },
  gamedev: { title: "Game Dev Intro", videoId: "z0kTMXv3fQI", content: "<p>Bikin game itu seru...</p>" },
  toolsgame: { title: "Tools Game", videoId: "8aGhZQkoFbQ", content: "<p>Unity & Godot...</p>" },
  toolsdev: { title: "Setup VS Code", videoId: "8aGhZQkoFbQ", content: "<p>Install VS Code dulu...</p>" },
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
  document.getElementById("detailModal").style.display = "none";
  document.getElementById("materiVideo").src = "";
  document.body.style.overflow = "auto";
};

/* =========================================================== */
/* BAGIAN 5: TIM POPUP & INTERAKSI GLOBAL                      */
/* =========================================================== */

const teamData = {
  member1: { name: "Miftah Ramadhan", role: "Project Manager", photo: "https://ui-avatars.com/api/?name=Miftah+R&background=6c63ff&color=fff&size=256", desc: "Pemimpin proyek.", skills: ["Leadership", "Agile"], motto: "Kode bersih, pikiran jernih." },
  member2: { name: "Rima Amarida", role: "UI/UX Designer", photo: "https://ui-avatars.com/api/?name=Rima+A&background=ff5f56&color=fff&size=256", desc: "Desainer kreatif.", skills: ["Figma", "Design"], motto: "Design is functionality." },
  member3: { name: "Inayattullah Yoga F.", role: "Full Stack Dev", photo: "https://ui-avatars.com/api/?name=Inayattullah+Y&background=27c93f&color=fff&size=256", desc: "Frontend & Backend.", skills: ["JS", "Firebase"], motto: "Talk is cheap." },
  member4: { name: "Nayla Seftiawati", role: "Game Developer", photo: "https://ui-avatars.com/api/?name=Nayla+S&background=ffbd2e&color=fff&size=256", desc: "Pembuat Game.", skills: ["Unity", "C#"], motto: "Level Up!" },
  member5: { name: "Shifa Octaviani", role: "Quality Assurance", photo: "https://ui-avatars.com/api/?name=Shifa+O&background=00f3ff&color=fff&size=256", desc: "Pencari Bug.", skills: ["Testing", "Detail"], motto: "Zero Bug." },
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

// GLOBAL CLICK HANDLER (Satu untuk semua)
window.onclick = function (event) {
  // Tutup Dropdown
  if (!event.target.matches(".three-dots-btn")) {
    const dropdowns = document.getElementsByClassName("dropdown-content");
    for (let i = 0; i < dropdowns.length; i++) {
      if (dropdowns[i].classList.contains("show")) dropdowns[i].classList.remove("show");
    }
  }
  // Tutup Modal
  if (event.target === document.getElementById("loginModal")) window.tutupLogin();
  if (event.target === document.getElementById("detailModal")) window.tutupDetail();
  if (event.target === document.getElementById("settingsModal")) window.tutupPengaturan();
  if (event.target === document.getElementById("teamModal")) window.tutupTeam();
};

window.toggleMenu = function () {
  const navLinks = document.querySelector(".nav-links");
  if (navLinks) navLinks.classList.toggle("active");
};

// Scroll Reveal
const revealElements = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add("active"); });
}, { threshold: 0.15 });
revealElements.forEach((el) => revealObserver.observe(el));

/* =========================================================== */
/* BAGIAN 6: MUSIK PLAYER                                      */
/* =========================================================== */

var player;
var isPlaying = false;
var tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

window.onYouTubeIframeAPIReady = function () {
  player = new YT.Player("music-player", {
    height: "0",
    width: "0",
    videoId: "rrXF9ziZ3AU4",
    playerVars: { autoplay: 0, controls: 0, loop: 1, playlist: "rrXF9ziZ3AU4", playsinline: 1 },
    events: { onReady: (e) => e.target.setVolume(40) },
  });
};

window.toggleMusic = function () {
  var btn = document.getElementById("musicBtn");
  if (isPlaying) {
    player.pauseVideo();
    btn.innerHTML = "七 Play Music";
    btn.classList.remove("music-playing");
    isPlaying = false;
  } else {
    player.playVideo();
    btn.innerHTML = "竢ｸ Pause Music";
    btn.classList.add("music-playing");
    isPlaying = true;
  }
};
