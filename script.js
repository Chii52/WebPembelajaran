/* =========================================================== */
/* BAGIAN 0: SETUP FIREBASE (LENGKAP DENGAN PROFIL)            */
/* =========================================================== */

// Import fungsi yang dibutuhkan (Tambahan: updatePassword)
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

// --- PASTE KONFIGURASI FIREBASE KAMU DI SINI ---
const firebaseConfig = {
  apiKey: "AIzaSyBrHbchi0sGC3LS7ZP6B4jAFwt338C2Aq0",
  authDomain: "webbelajarpplg.firebaseapp.com",
  projectId: "webbelajarpplg",
  storageBucket: "webbelajarpplg.firebasestorage.app",
  messagingSenderId: "1027186626520",
  appId: "1:1027186626520:web:44b34aa6fd76692022ecad",
  measurementId: "G-MNJB98BF4T",
};

let app, auth;
try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
} catch (e) {
  console.error("Firebase Config Error:", e);
}

// Variabel Global
let isRegisterMode = false;

/* --- FUNGSI AUTH & USER MENU --- */

// Toggle Menu Titik 3
window.toggleProfileMenu = function () {
  document.getElementById("dropdownContent").classList.toggle("show");
};

// Tutup menu kalau klik di luar
window.onclick = function (event) {
  if (!event.target.matches(".three-dots-btn")) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    for (var i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains("show")) {
        openDropdown.classList.remove("show");
      }
    }
  }
  // Logic modal click
  const modalDetail = document.getElementById("detailModal");
  const modalLogin = document.getElementById("loginModal");
  if (event.target == modalDetail) window.tutupDetail();
  if (event.target == modalLogin) window.tutupLogin();
};

// 1. Ganti Foto Profil (PFP)
window.ubahPFP = async function () {
  const user = auth.currentUser;
  if (user) {
    // Minta URL gambar dari user
    const newPhotoURL = prompt(
      "Masukkan Link/URL Gambar Foto Profil baru:",
      "https://ui-avatars.com/api/?name=Baru",
    );

    if (newPhotoURL) {
      try {
        await updateProfile(user, { photoURL: newPhotoURL });
        alert("Foto profil berhasil diubah!");
        // Update tampilan langsung tanpa reload
        document.getElementById("navUserImg").src = newPhotoURL;
      } catch (error) {
        alert("Gagal mengubah foto: " + error.message);
      }
    }
  }
};

// Tambahkan listener ini agar Module bisa menangkap URL dari fungsi window di atas
window.addEventListener("fotoBaruTersedia", async (e) => {
  const url = e.detail;
  const user = auth.currentUser;
  if (user) {
    try {
      await updateProfile(user, { photoURL: url });

      // Update Tampilan UI
      document.getElementById("navUserImg").src = url;
      document.getElementById("navUserImg").style.opacity = "1";

      alert("Foto Profil Berhasil Diupdate! 🔥");
    } catch (error) {
      alert("Gagal update profil Firebase: " + error.message);
    }
  }
});

// 2. Ganti Password
window.ubahPassword = async function () {
  const user = auth.currentUser;
  if (user) {
    const newPass = prompt("Masukkan Password Baru (Minimal 6 karakter):");

    if (newPass && newPass.length >= 6) {
      try {
        await updatePassword(user, newPass);
        alert("Password berhasil diubah! Silakan login ulang.");
        await signOut(auth);
      } catch (error) {
        alert("Gagal (Mungkin perlu login ulang dulu): " + error.message);
      }
    } else if (newPass) {
      alert("Password terlalu pendek!");
    }
  }
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
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        pass,
      );
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

// DETEKTIF STATUS LOGIN (PENTING!)
if (auth) {
  onAuthStateChanged(auth, (user) => {
    const loginBtn = document.getElementById("navLoginBtn"); // Tombol Masuk
    const userMenu = document.getElementById("userMenu"); // Menu User (Titik 3)

    // Elemen tampilan user
    const navImg = document.getElementById("navUserImg");
    const navName = document.getElementById("navUserName");

    if (user) {
      // USER LOGIN: Sembunyikan Tombol Masuk, Tampilkan Menu User
      if (loginBtn) loginBtn.style.display = "none";
      if (userMenu) userMenu.style.display = "flex"; // Pakai flex biar sejajar

      // Set Data User
      const name = user.displayName || user.email.split("@")[0];
      const photo =
        user.photoURL ||
        `https://ui-avatars.com/api/?name=${name}&background=ff746c&color=fff`;

      if (navName) navName.innerText = `Halo, ${name}`;
      if (navImg) navImg.src = photo;
    } else {
      // USER LOGOUT: Tampilkan Tombol Masuk, Sembunyikan Menu User
      if (loginBtn) loginBtn.style.display = "block";
      if (userMenu) userMenu.style.display = "none";
    }
  });
}

/* =========================================================== */
/* BAGIAN LAIN (GAME, MATERI, DLL) - TETAP SAMA                */
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
};

window.mainkanSuit = function (pilihanPlayer) {
  const resultText = document.getElementById("suitResult");
  if (!resultText) return;
  const pilihanKomputer = ["batu", "gunting", "kertas"][
    Math.floor(Math.random() * 3)
  ];
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
};

/* =========================================================== */
/* BAGIAN 3: LOGIKA KUIS STEP-BY-STEP (MODERN)                 */
/* =========================================================== */

// 1. Database Soal (Array of Objects)
const questionsData = [
    {
        question: "Fungsi utama tag <head> dalam struktur HTML adalah...",
        options: ["Menampilkan seluruh isi website", "Menyimpan elemen interaktif", "Menyimpan informasi metadata", "Mengatur tampilan halaman"],
        correct: 2 // Index jawaban benar (mulai dari 0). Jadi 2 = Opsi ke-3
    },
    {
        question: "Perbedaan utama antara HTML dan CSS adalah...",
        options: ["HTML untuk logika, CSS untuk data", "HTML untuk struktur, CSS untuk tampilan", "HTML untuk animasi, CSS untuk database", "HTML untuk server, CSS untuk client"],
        correct: 1
    },
    {
        question: "Agar website tampil responsif di berbagai ukuran layar, CSS berperan dalam hal...",
        options: ["Validasi form", "Struktur data", "Interaksi pengguna", "Pengaturan layout dan tampilan"],
        correct: 3
    },
    {
        question: "Fungsi utama atribut onclick pada tombol adalah...",
        options: ["Jalan saat halaman dibuka", "Jalan saat mouse diarahkan", "Jalan saat tombol diklik", "Jalan otomatis"],
        correct: 2
    },
    {
        question: "Yang BUKAN termasuk unsur utama dalam sebuah gim adalah...",
        options: ["Player", "Compiler", "Aturan", "Tantangan"],
        correct: 1
    },
    {
        question: "Urutan alur pembuatan gim yang benar adalah...",
        options: ["Kode → Ide → Uji", "Ide → Desain → Kode → Uji", "Desain → Ide → Kode", "Ide → Kode → Desain"],
        correct: 1
    },
    {
        question: "Pada JavaScript, perintah untuk menyimpan nilai yang TIDAK boleh berubah adalah...",
        options: ["var", "let", "const", "function"],
        correct: 2
    },
    {
        question: "Fungsi utama Code Editor dalam PPLG adalah...",
        options: ["Menjalankan OS", "Menyimpan database", "Menulis & mendeteksi error kode", "Hosting website"],
        correct: 2
    },
    {
        question: "Berikut ini yang termasuk software pemrograman adalah...",
        options: ["Windows", "Google Chrome", "Visual Studio Code", "Photoshop"],
        correct: 2
    },
    {
        question: "Mengapa sikap bertanggung jawab terhadap kode sangat penting?",
        options: ["Biar kode panjang", "Biar warna-warni", "Agar mudah dipahami & dikembangkan", "Agar program lambat"],
        correct: 2
    }
];

// Variabel State
let currentQuestionIndex = 0;
let score = 0;
let selectedOptionIndex = null; // Menyimpan jawaban sementara user

// Fungsi Mulai/Load Soal
function loadQuestion() {
    // Ambil elemen
    const questionEl = document.getElementById("question-text");
    const optionsEl = document.getElementById("options-container");
    const progressText = document.getElementById("question-number");
    const progressBar = document.getElementById("progress-bar");
    const nextBtn = document.getElementById("next-btn");
    const quizBody = document.getElementById("quiz-body");

    // Validasi elemen (cegah error di halaman lain)
    if(!questionEl) return;

    // Reset State Tampilan
    const currentData = questionsData[currentQuestionIndex];
    selectedOptionIndex = null;
    nextBtn.disabled = true;
    nextBtn.innerHTML = (currentQuestionIndex === questionsData.length - 1) ? "Selesai" : "Selanjutnya <i class='fa-solid fa-arrow-right'></i>";
    
    // Animasi Fade In
    quizBody.classList.remove("fade-animation");
    void quizBody.offsetWidth; // Trigger reflow
    quizBody.classList.add("fade-animation");

    // Update Teks & Progress
    questionEl.innerText = `${currentQuestionIndex + 1}. ${currentData.question}`;
    progressText.innerText = `Soal ${currentQuestionIndex + 1} / ${questionsData.length}`;
    
    // Hitung Persentase Progress Bar
    const progressPercent = ((currentQuestionIndex) / questionsData.length) * 100;
    progressBar.style.width = `${progressPercent}%`;

    // Render Opsi Jawaban (Button)
    optionsEl.innerHTML = ""; // Kosongkan dulu
    currentData.options.forEach((opt, index) => {
        const btn = document.createElement("button");
        btn.classList.add("option-btn");
        btn.innerText = opt;
        btn.onclick = () => selectOption(index, btn); // Pasang event klik
        optionsEl.appendChild(btn);
    });
}

// Fungsi Saat User Klik Opsi
function selectOption(index, btnElement) {
    selectedOptionIndex = index;
    
    // Hapus kelas 'selected' dari semua tombol
    const allBtns = document.querySelectorAll(".option-btn");
    allBtns.forEach(b => b.classList.remove("selected"));

    // Tambahkan kelas ke yang diklik
    btnElement.classList.add("selected");

    // Aktifkan tombol Next
    document.getElementById("next-btn").disabled = false;
}

// Fungsi Tombol Selanjutnya
window.nextQuestion = function() {
    // 1. Cek Jawaban Benar/Salah
    if (selectedOptionIndex === questionsData[currentQuestionIndex].correct) {
        score += 10; // Tambah poin
        document.getElementById("score-live").innerText = `Score: ${score}`; // Update live score (opsional)
    }

    // 2. Pindah Soal
    currentQuestionIndex++;

    if (currentQuestionIndex < questionsData.length) {
        loadQuestion(); // Muat soal berikutnya
    } else {
        showResult(); // Tampilkan hasil akhir
    }
}

// Fungsi Tampilkan Hasil Akhir
function showResult() {
    document.getElementById("quiz-container").style.display = "none";
    document.getElementById("result-container").style.display = "block";
    
    // Tampilkan Skor
    document.getElementById("final-score").innerText = score;
    
    // Pesan berdasarkan skor
    const messageEl = document.getElementById("final-message");
    const iconEl = document.querySelector(".result-icon");
    
    if(score >= 80) {
        messageEl.innerText = "Luar Biasa! Kamu calon programmer hebat! 🚀";
        iconEl.innerText = "🏆";
    } else if (score >= 60) {
        messageEl.innerText = "Cukup Bagus! Tingkatkan lagi belajarnya. 📚";
        iconEl.innerText = "👏";
    } else {
        messageEl.innerText = "Jangan menyerah! Coba baca materi lagi ya. 💪";
        iconEl.innerText = "💪";
    }
}

// Jalankan Load Pertama kali saat halaman dimuat
document.addEventListener("DOMContentLoaded", () => {
    if(document.getElementById("quiz-container")) {
        loadQuestion();
    }
});

const revealElements = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("active");
    });
  },
  { threshold: 0.15 },
);
revealElements.forEach((el) => revealObserver.observe(el));

/* ===  MUSIC PLAYER === */
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
    videoId: "KNtJGQkC",
    playerVars: { autoplay: 0, controls: 0, loop: 1, playlist: "KNtJGQkC" },
    events: { onReady: onPlayerReady },
  });
};

function onPlayerReady(event) {
  event.target.setVolume(40);
}

window.toggleMusic = function () {
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
};

/* =========================================================== */
/* BAGIAN INTEGRASI CLOUDINARY (BARU)                          */
/* =========================================================== */

// --- CONFIG CLOUDINARY (ISI DENGAN DATA KAMU!) ---
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dqybajzya/image/upload";
const CLOUDINARY_PRESET = "pplg_preset";
// Contoh URL: "https://api.cloudinary.com/v1_1/dxyz123/image/upload"
// Contoh Preset: "pplg_preset"

// 1. Fungsi Klik Tombol Ganti Foto
window.ubahPFP = function () {
  const fileInput = document.getElementById("fileInputPFP");
  if (fileInput) {
    // Otomatis klik input file yang tersembunyi
    fileInput.click();
  } else {
    alert("Elemen input file tidak ditemukan di HTML!");
  }
};

// 2. Event Listener saat File Dipilih (Otomatis Upload)
// Kita pasang listener ini sekali saja saat script dimuat
const fileInput = document.getElementById("fileInputPFP");
if (fileInput) {
  fileInput.addEventListener("change", async function (e) {
    const file = e.target.files[0];
    if (!file) return;

    // Cek ukuran file (Maksimal 2MB biar ga berat)
    if (file.size > 2 * 1024 * 1024) {
      alert("File terlalu besar! Maksimal 2MB.");
      return;
    }

    // Tampilkan status Loading
    const navImg = document.getElementById("navUserImg");
    const oldSrc = navImg.src;
    navImg.style.opacity = "0.5"; // Efek redup tanda loading
    alert("Sedang mengupload foto... Mohon tunggu sebentar.");

    // Siapkan Data untuk Cloudinary
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_PRESET);

    try {
      // --- PROSES UPLOAD KE CLOUDINARY ---
      const response = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Gagal upload ke Cloudinary");

      const data = await response.json();
      const imageUrl = data.secure_url; // Link gambar dari Cloudinary

      // --- SIMPAN LINK KE FIREBASE ---
      // (Pastikan auth dan user sudah siap)
      // Kita akses auth dari variabel global yang sudah ada di script.js
      // Karena script type="module", kita perlu akses auth via window atau variabel scope.
      // Asumsi: 'auth' sudah dideklarasikan di bagian atas script.js kamu.

      // Note: Karena 'auth' ada di dalam module scope, kita perlu cara untuk mengaksesnya
      // Solusi: Kita gunakan window.currentUser (jika kamu sudah set) atau reload logic
      // Tapi cara paling aman di module adalah import ulang di fungsi ini jika perlu,
      // tapi karena ini file tunggal, kita pakai trick updateProfile langsung.

      // Import UpdateProfile (Copy baris ini ke paling atas file jika belum ada)
      // import { updateProfile } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

      // Karena ini di dalam event listener DOM biasa, kita butuh akses ke 'auth' dari scope module.
      // Kita akan memicu custom event atau memanggil fungsi window yang terhubung ke module.

      await window.simpanFotoKeFirebase(imageUrl);
    } catch (error) {
      console.error("Error Upload:", error);
      alert("Gagal mengupload foto. Cek koneksi atau setting Cloudinary.");
      navImg.src = oldSrc; // Balikin gambar lama
      navImg.style.opacity = "1";
    }
  });
}

// 3. Fungsi Penghubung ke Firebase (Masukkan ke dalam module script.js kamu)
window.simpanFotoKeFirebase = async function (url) {
  // Kita butuh 'auth' dan 'updateProfile' yang ada di scope module
  // KITA AKALI DENGAN CARA INI:
  // Panggil fungsi ini dari dalam blok kode handleAuth atau buat fungsi khusus
  // TAPI cara paling mudah: Masukkan logika updateProfile di sini langsung
  // Asalkan auth sudah ter-init di bagian atas script.js

  // PERHATIAN: Kamu harus pastikan 'auth' bisa diakses.
  // Jika kode ini di dalam <script type="module"> yang sama, variabel 'auth' bisa diakses.

  // Cek apakah user sedang login
  // Karena 'auth' variabel lokal module, kita pakai window.auth (kalau kita expose)
  // ATAU kita tangkap auth.currentUser langsung

  // SOLUSI TERBAIK: Pindahkan logika updateProfile ke sini (Copy-Paste import di atas)
  const user = auth.currentUser;

  if (user) {
    try {
      // Kita import updateProfile di bagian paling atas file script.js kamu ya!
      // Baris: import { ..., updateProfile } from "...firebase-auth.js";

      // Cara panggil updateProfile dari library yang sudah diimport di atas:
      // Karena updateProfile adalah fungsi module, kita harus memanggilnya langsung.
      // TAPI window.simpanFotoKeFirebase ada di window, dia gak kenal 'updateProfile' yang diimport module.

      // JADI: Kita buat event custom agar module menangkap URL barunya.
      const event = new CustomEvent("fotoBaruTersedia", { detail: url });
      window.dispatchEvent(event);
    } catch (e) {
      console.error(e);
    }
  }
};

/* --- TAMBAHAN: LOGIKA MODAL PENGATURAN AKUN --- */

window.bukaPengaturan = function () {
  const modal = document.getElementById("settingsModal");
  const user = auth.currentUser; // Ambil user yang sedang login

  if (user && modal) {
    // Isi data ke dalam Modal
    const name = user.displayName || "User";
    const email = user.email;
    // Gunakan foto dari Firebase atau default avatar
    const photo =
      user.photoURL ||
      `https://ui-avatars.com/api/?name=${name}&background=ff746c&color=fff`;

    document.getElementById("settingsName").innerText = name;
    document.getElementById("settingsEmail").innerText = email;
    document.getElementById("settingsPFP").src = photo;

    // Tampilkan Modal
    modal.style.display = "block";

    // Tutup dropdown menu biar rapi
    document.getElementById("dropdownContent").classList.remove("show");
  }
};

window.tutupPengaturan = function () {
  const modal = document.getElementById("settingsModal");
  if (modal) modal.style.display = "none";
};

// Update window.onclick agar bisa menutup modal pengaturan saat klik di luar
// (Tambahkan logika ini ke fungsi window.onclick yang sudah ada)
const originalOnClick = window.onclick;
window.onclick = function (event) {
  if (originalOnClick) originalOnClick(event); // Jalankan fungsi lama juga

  const modalSettings = document.getElementById("settingsModal");
  if (event.target == modalSettings) window.tutupPengaturan();
};

/* =========================================================== */
/* BAGIAN 4: DATABASE MATERI & VIDEO LENGKAP                   */
/* =========================================================== */

// Database Materi (Video ID ambil dari Youtube)
// Format ID Youtube: https://www.youtube.com/watch?v=ID_VIDEO_DISINI
const databaseMateri = {
  html: {
    title: "HTML5 Dasar untuk Pemula",
    videoId: "NBZ9Ro6UKV8", // Video Web Programming Unpas (Contoh)
    content: `
            <p>HTML (HyperText Markup Language) adalah tulang punggung dari setiap halaman web yang Anda lihat di internet. Tanpa HTML, web browser tidak akan tahu cara menampilkan teks, memuat gambar, atau merender video.</p>
            
            <h2>1. Struktur Dasar HTML</h2>
            <p>Setiap file HTML harus memiliki struktur dasar berikut agar bisa dibaca oleh browser:</p>
            <pre>&lt;!DOCTYPE html&gt;
&lt;html&gt;
  &lt;head&gt;
    &lt;title&gt;Judul Halaman&lt;/title&gt;
  &lt;/head&gt;
  &lt;body&gt;
    &lt;h1&gt;Halo Dunia!&lt;/h1&gt;
    &lt;p&gt;Ini paragraf pertamaku.&lt;/p&gt;
  &lt;/body&gt;
&lt;/html&gt;</pre>
            
            <h2>2. Tag Penting yang Wajib Tahu</h2>
            <ul>
                <li><strong>&lt;h1&gt; sampai &lt;h6&gt;</strong>: Digunakan untuk membuat judul atau heading. h1 paling besar, h6 paling kecil.</li>
                <li><strong>&lt;p&gt;</strong>: Tag untuk membuat paragraf teks.</li>
                <li><strong>&lt;a href="..."&gt;</strong>: Anchor tag untuk membuat link ke halaman lain.</li>
                <li><strong>&lt;img src="..."&gt;</strong>: Untuk menampilkan gambar.</li>
            </ul>
            <p>Cobalah menulis kode di atas di Visual Studio Code dan simpan dengan akhiran <code>.html</code>, lalu buka di browser!</p>
        `,
  },
  css: {
    title: "CSS3 Styling & Layout",
    videoId: "CleFk3BZB3g", // Video WPU CSS
    content: `
            <p>CSS (Cascading Style Sheets) ibarat "baju" dan "make-up" bagi HTML. Jika HTML adalah kerangka, maka CSS adalah yang membuatnya terlihat indah.</p>
            <h2>Cara Menggunakan CSS</h2>
            <p>Ada 3 cara memasukkan CSS ke dalam HTML:</p>
            <ol>
                <li><strong>Inline CSS:</strong> Langsung di tag HTML (Kurang disarankan).</li>
                <li><strong>Internal CSS:</strong> Di dalam tag &lt;style&gt; di head.</li>
                <li><strong>External CSS:</strong> File terpisah (.css) yang paling sering digunakan profesional.</li>
            </ol>
            <pre>/* Contoh CSS */
body {
    background-color: #f0f0f0;
    font-family: Arial, sans-serif;
}
h1 {
    color: blue;
}</pre>
        `,
  },
  javascript: {
    title: "JavaScript Logic & DOM",
    videoId: "RUTV_5m4WIV", // Video WPU JS
    content: `
            <p>JavaScript adalah bahasa pemrograman yang membuat website menjadi "hidup". Dengan JS, Anda bisa membuat tombol bereaksi saat diklik, membuat animasi, hingga game.</p>
            <h2>Variabel di JS</h2>
            <p>Gunakan <code>let</code> atau <code>const</code> untuk membuat variabel.</p>
            <pre>let nama = "Budi";
const nilai = 90;

if(nilai > 75) {
    alert("Selamat " + nama + ", Anda Lulus!");
}</pre>
        `,
  },
  gamedev: {
    title: "Pengenalan Game Development",
    videoId: "z0kTMXv3fQI", // Video Intro Game Dev
    content: `
            <p>Game Development adalah proses menciptakan video game. Ini menggabungkan coding, desain grafis, suara, dan storytelling.</p>
            <h2>Engine Populer</h2>
            <ul>
                <li><strong>Unity:</strong> Menggunakan bahasa C#. Sangat populer untuk game mobile dan 3D.</li>
                <li><strong>Godot:</strong> Gratis dan ringan. Menggunakan GDScript (mirip Python).</li>
                <li><strong>Unreal Engine:</strong> Untuk game grafis tingkat tinggi (AAA).</li>
            </ul>
        `,
  },
  toolsgame: {
    title: "Software & Tools PPLG",
    videoId: "8aGhZQkoFbQ", // Video Tools Coding
    content: `
            <p>Sebagai siswa PPLG, senjata utama kita adalah software. Berikut adalah yang wajib diinstall:</p>
            <ul>
                <li><strong>Visual Studio Code:</strong> Text Editor terbaik saat ini. Ringan dan banyak fitur.</li>
                <li><strong>Google Chrome:</strong> Browser untuk debugging website.</li>
                <li><strong>Git:</strong> Untuk mengatur versi kode (Version Control System).</li>
            </ul>
        `,
  },
  toolsdev: {
    title: "Setup VS Code & Environment",
    videoId: "8aGhZQkoFbQ",
    content: `
            <p>Visual Studio Code (VS Code) adalah editor kode sumber yang dikembangkan oleh Microsoft. Fitur utamanya meliputi debugging, penyorotan sintaksis, penyelesaian kode cerdas, cuplikan, refactoring kode, dan Git.</p>
            <h2>Ekstensi Wajib:</h2>
            <ul>
                <li>Live Server</li>
                <li>Prettier - Code Formatter</li>
                <li>Auto Close Tag</li>
            </ul>
        `,
  },
};

// Fungsi Buka Detail Baru (Full Screen)
window.bukaDetail = function (key) {
  const modal = document.getElementById("detailModal");
  const titleElem = document.getElementById("materiTitle");
  const contentElem = document.getElementById("materiContent");
  const videoElem = document.getElementById("materiVideo");

  // Ambil data berdasarkan key (html, css, dll)
  const data = databaseMateri[key];

  if (data && modal) {
    // Isi Konten
    titleElem.innerText = data.title;
    contentElem.innerHTML = data.content;

    // Set Video Youtube (Embed URL)
    // Format embed: https://www.youtube.com/embed/VIDEO_ID
    videoElem.src = `https://www.youtube.com/embed/${data.videoId}`;

    // Tampilkan Modal
    modal.style.display = "block";

    // Matikan scroll body utama biar fokus ke modal
    document.body.style.overflow = "hidden";
  }
};

// Fungsi Tutup Detail
window.tutupDetail = function () {
  const modal = document.getElementById("detailModal");
  const videoElem = document.getElementById("materiVideo");

  if (modal) {
    modal.style.display = "none";

    // STOP VIDEO saat ditutup (Penting!)
    videoElem.src = "";

    // Nyalakan scroll body lagi
    document.body.style.overflow = "auto";
  }
};

/* =========================================================== */
/* BAGIAN 6: LOGIKA POPUP TIM (MODAL SETENGAH LAYAR)           */
/* =========================================================== */

// Database Tim (Data lengkap)
// Database Tim (Data SUDAH DISESUAIKAN dengan HTML)
const teamData = {
  member1: {
    name: "Miftah Ramadhan",
    role: "Project Manager",
    photo: "https://ui-avatars.com/api/?name=Miftah+R&background=6c63ff&color=fff&size=256",
    desc: "Pemimpin proyek yang memastikan setiap baris kode berjalan sesuai rencana. Fokus pada manajemen waktu dan efisiensi tim.",
    skills: ["Leadership", "Agile", "Jira"],
    motto: "Kode bersih, pikiran jernih.",
  },
  member2: {
    name: "Rima Amarida",
    role: "UI/UX Designer",
    photo: "https://ui-avatars.com/api/?name=Rima+A&background=ff5f56&color=fff&size=256",
    desc: "Merancang antarmuka yang tidak hanya cantik, tapi juga mudah digunakan (User Friendly). Seni adalah passion saya.",
    skills: ["Figma", "Adobe XD", "Prototyping"],
    motto: "Desain adalah tentang fungsi.",
  },
  member3: {
    name: "Inayattullah Yoga F.",
    role: "Full Stack Dev",
    photo: "https://ui-avatars.com/api/?name=Inayattullah+Y&background=27c93f&color=fff&size=256",
    desc: "Menguasai Frontend dan Backend. Suka memecahkan masalah kompleks dengan solusi kode yang efisien dan skalabel.",
    skills: ["HTML/CSS", "Node.js", "Firebase"],
    motto: "Talk is cheap. Show me the code.",
  },
  member4: {
    name: "Nayla Septiawati",
    role: "Game Developer",
    photo: "https://ui-avatars.com/api/?name=Nayla+S&background=ffbd2e&color=fff&size=256",
    desc: "Menciptakan dunia virtual interaktif. Ahli dalam logika permainan dan fisika game menggunakan engine modern.",
    skills: ["Unity", "C#", "Pixel Art"],
    motto: "Level up your life!",
  },
  member5: {
    name: "Shifa Octaviani",
    role: "Quality Assurance",
    photo: "https://ui-avatars.com/api/?name=Shifa+O&background=00f3ff&color=fff&size=256",
    desc: "Detektif Bug. Tugas saya memastikan tidak ada kesalahan sebelum aplikasi sampai ke tangan pengguna.",
    skills: ["Testing", "Automation", "Detail Oriented"],
    motto: "Zero bug, happy user.",
  },
};

// Fungsi Buka Modal Tim
window.bukaTeam = function (id) {
  const modal = document.getElementById("teamModal");
  const member = teamData[id];

  if (member && modal) {
    // Isi Data ke HTML
    document.getElementById("tImg").src = member.photo;
    document.getElementById("tRole").innerText = member.role;
    document.getElementById("tName").innerText = member.name;
    document.getElementById("tDesc").innerText = member.desc;
    document.getElementById("tMotto").innerText = `"${member.motto}"`;

    // Render Skill (Looping)
    const skillContainer = document.getElementById("tSkills");
    skillContainer.innerHTML = ""; // Bersihkan skill sebelumnya

    member.skills.forEach((skill) => {
      const span = document.createElement("span");
      span.innerText = skill;
      skillContainer.appendChild(span);
    });

    // Tampilkan Modal
    modal.style.display = "block";
  }
};

// Fungsi Tutup Modal Tim
window.tutupTeam = function () {
  const modal = document.getElementById("teamModal");
  if (modal) modal.style.display = "none";
};

// Update Event Listener Klik Luar (Biar bisa tutup modal tim juga)
// (Cari window.onclick yang lama, dan UPDATE bagian dalamnya seperti ini)
const oldWindowClick = window.onclick;
window.onclick = function (event) {
  if (oldWindowClick) oldWindowClick(event); // Jalankan fungsi lama

  const teamModal = document.getElementById("teamModal");
  if (event.target == teamModal) window.tutupTeam();
};
