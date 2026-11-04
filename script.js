const ADMIN_WA = "6285219454256";

// Data Koleksi Buku PUSTAKA LONTARA
const books = [
  {
    id: 1,
    code: "RB-D01",
    title: "Misteri Dasar Samudera",
    author: "Dr. Alana Veda",
    genre: "Alam dan Kehidupan",
    type: "Digital",
    colorClass: "blue",
    description: "Menjelajahi palung laut terdalam dan makhluk hidup bioluminesensi yang menakjubkan.",
    likes: 182,
    finished: 64,
    duration: "2j 15m"
  },
  {
    id: 2,
    code: "RB-D02",
    title: "Arsitektur Kosmik Bima Sakti",
    author: "Prof. Rayhan Mahendra",
    genre: "Sains dan Semesta",
    type: "Digital",
    colorClass: "purple",
    description: "Peta galaksi interaktif dan pemahaman terbaru mengenai pembentukan lubang hitam.",
    likes: 215,
    finished: 92,
    duration: "3j 10m"
  },
  {
    id: 3,
    code: "RB-F01",
    title: "Atlas Awan Nusantara",
    author: "Tim Klimatologi UI",
    genre: "Alam dan Kehidupan",
    type: "Fisik",
    colorClass: "blue",
    mood: "Mood: Santai",
    description: "Panduan mengenali formasi awan khas di langit khatulistiwa dan prediksi cuaca lokal.",
    likes: 110,
    finished: 45,
    duration: "1j 45m"
  },
  {
    id: 4,
    code: "RB-F02",
    title: "Planetarium Saku",
    author: "Andi Mulia & Rekan",
    genre: "Sains dan Semesta",
    type: "Fisik",
    colorClass: "purple",
    mood: "Mood: Penasaran",
    description: "Buku panduan beratap langit: mengenali rasi bintang malam secara praktis.",
    likes: 165,
    finished: 78,
    duration: "1j 50m"
  },
  {
    id: 5,
    code: "RB-D03",
    title: "Jejak Peradaban Rempah",
    author: "Sartono K.",
    genre: "Sejarah dan Peradaban",
    type: "Digital",
    colorClass: "brown",
    description: "Kisah epik jalur perdagangan rempah dunia yang mengubah peta politik global.",
    likes: 142,
    finished: 51,
    duration: "2j 40m"
  },
  {
    id: 6,
    code: "RB-D04",
    title: "Ensiklopedia Paradoks Waktu",
    author: "Karel H.",
    genre: "Misteri dan Fakta Unik",
    type: "Digital",
    colorClass: "brown",
    description: "Kumpulan teka-teki logika fisika kuantum dan anomali waktu paling membingungkan.",
    likes: 205,
    finished: 110,
    duration: "4j 00m"
  }
];

// DOM Elements
const bookGrid = document.getElementById("bookGrid");
const physicalBookGrid = document.getElementById("physicalBookGrid");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const bookCount = document.getElementById("bookCount");
const emptyState = document.getElementById("emptyState");

const loginModal = document.getElementById("loginModal");
const borrowModal = document.getElementById("borrowModal");
const rulesModal = document.getElementById("rulesModal");
const detailModal = document.getElementById("detailModal");
const toast = document.getElementById("toast");
const themeToggle = document.getElementById("themeToggle");

let activeGenre = "Semua";
let activeType = "Semua";
let currentDetailId = null;

// Ambil daftar ID buku yang disukai dari localStorage
let likedBookIds = JSON.parse(localStorage.getItem("pustaka_liked_books")) || [];

// Dark Mode Persistence
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-mode");
  if (themeToggle) themeToggle.textContent = "☀️";
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");
    themeToggle.textContent = isDark ? "☀️" : "🌙";
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });
}

// Mobile Navigation Toggle
const menuToggle = document.getElementById("menuToggle");
if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    document.getElementById("navLinks").classList.toggle("open");
  });
}

// Render Semua Bagian Buku
function renderBooks() {
  renderCatalog();
  renderPhysicalBooks();
  renderWishlist();
}

// Render Katalog Buku Berdasarkan Filter & Search
function renderCatalog() {
  if (!bookGrid) return;
  
  const keyword = searchInput ? searchInput.value.trim().toLowerCase() : "";
  const sortValue = sortSelect ? sortSelect.value : "popular";

  let filtered = books.filter(b => {
    const matchGenre = activeGenre === "Semua" || b.genre === activeGenre;
    const matchType = activeType === "Semua" || b.type === activeType;
    const matchKeyword = b.title.toLowerCase().includes(keyword) || b.genre.toLowerCase().includes(keyword) || b.author.toLowerCase().includes(keyword);
    return matchGenre && matchType && matchKeyword;
  });

  if (sortValue === "popular") filtered.sort((a,b) => b.likes - a.likes);
  if (sortValue === "title-asc") filtered.sort((a,b) => a.title.localeCompare(b.title));
  if (sortValue === "title-desc") filtered.sort((a,b) => b.title.localeCompare(a.title));

  bookGrid.innerHTML = filtered.map(b => {
    const isLiked = likedBookIds.includes(b.id);
    return `
      <article class="book-card-item ${b.colorClass}">
        <div class="card-top-header">
          <span class="card-code">${b.code}</span>
          <span class="card-type-pill">${b.type}</span>
        </div>
        <div class="card-body-content">
          <h3 class="card-title">${b.title}</h3>
          <p class="card-author">Oleh: ${b.author}</p>
          <p class="card-desc">${b.description}</p>
        </div>
        <div class="card-footer-meta">
          <div class="meta-stats">
            <span>❤️ ${b.likes}</span>
            <span>✅ ${b.finished} selesai</span>
            <span>⏱️ ${b.duration}</span>
          </div>
          <div class="card-btn-group">
            <button class="card-detail-btn" onclick="openDetail(${b.id})">Detail</button>
            <button class="card-like-btn" onclick="toggleLike(event, ${b.id})" title="Sukai Buku">${isLiked ? "❤️" : "🤍"}</button>
          </div>
        </div>
      </article>
    `;
  }).join("");

  if (bookCount) bookCount.textContent = `${filtered.length} buku ditemukan`;
  if (emptyState) emptyState.hidden = filtered.length !== 0;
}

// Render Khusus Seksi Buku Fisik
function renderPhysicalBooks() {
  if (!physicalBookGrid) return;
  
  const physicalOnly = books.filter(b => b.type === "Fisik");
  physicalBookGrid.innerHTML = physicalOnly.map(b => {
    const isLiked = likedBookIds.includes(b.id);
    return `
      <article class="book-card-item ${b.colorClass}">
        <div class="card-top-header">
          <span class="card-code">${b.code}</span>
          <span class="card-type-pill">Fisik</span>
        </div>
        <div class="card-body-content">
          <h3 class="card-title">${b.title}</h3>
          <p class="card-author">Oleh: ${b.author}</p>
          <p class="card-desc">${b.description}</p>
        </div>
        <div class="card-footer-meta">
          <div class="meta-stats">
            <span>❤️ ${b.likes}</span>
            <span>✅ ${b.finished} dipinjam</span>
            ${b.mood ? `<span>🏷️ ${b.mood}</span>` : ''}
          </div>
          <div class="card-btn-group">
            <button class="card-detail-btn" onclick="openDetail(${b.id})">Detail</button>
            <button class="card-like-btn" onclick="toggleLike(event, ${b.id})" title="Sukai Buku">${isLiked ? "❤️" : "🤍"}</button>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

// Fungsi Toggle Like & Simpan ke Koleksi Anda
function toggleLike(e, id) {
  e.stopPropagation();
  const book = books.find(b => b.id === id);
  if (!book) return;

  const index = likedBookIds.indexOf(id);
  if (index === -1) {
    likedBookIds.push(id);
    book.likes += 1;
    showToast(`Buku "${book.title}" ditambahkan ke Koleksi Anda!`);
  } else {
    likedBookIds.splice(index, 1);
    book.likes -= 1;
    showToast(`Buku dihapus dari Koleksi Anda.`);
  }

  localStorage.setItem("pustaka_liked_books", JSON.stringify(likedBookIds));
  renderBooks();
}

// Render Daftar Buku di "Koleksi Buku Anda"
function renderWishlist() {
  const wishlistGrid = document.getElementById("wishlistGrid");
  const emptyWishlistState = document.getElementById("emptyWishlistState");
  if (!wishlistGrid) return;

  const likedBooks = books.filter(b => likedBookIds.includes(b.id));

  if (likedBooks.length === 0) {
    wishlistGrid.innerHTML = "";
    if (emptyWishlistState) emptyWishlistState.hidden = false;
    return;
  }

  if (emptyWishlistState) emptyWishlistState.hidden = true;

  wishlistGrid.innerHTML = likedBooks.map(b => `
    <article class="book-card-item ${b.colorClass}">
      <div class="card-top-header">
        <span class="card-code">${b.code}</span>
        <span class="card-type-pill">${b.type}</span>
      </div>
      <div class="card-body-content">
        <h3 class="card-title">${b.title}</h3>
        <p class="card-author">Oleh: ${b.author}</p>
        <p class="card-desc">${b.description}</p>
      </div>
      <div class="card-footer-meta">
        <div class="meta-stats">
          <span>❤️ Disukai</span>
          <span>⏱️ ${b.duration}</span>
        </div>
        <div class="card-btn-group">
          <button class="card-detail-btn" onclick="openDetail(${b.id})">Baca / Detail</button>
          <button class="card-like-btn" onclick="toggleLike(event, ${b.id})" title="Hapus dari Koleksi">❤️</button>
        </div>
      </div>
    </article>
  `).join("");
}

// Modal Detail Buku
function openDetail(id) {
  const selected = books.find(b => b.id == id);
  if (!selected) return;
  currentDetailId = selected.id;

  document.getElementById("detailModalCode").textContent = `— ${selected.code} (${selected.type})`;
  document.getElementById("detailModalTitle").textContent = selected.title;
  document.getElementById("detailModalAuthor").textContent = `Penulis: ${selected.author}`;
  document.getElementById("detailModalGenre").textContent = `Genre: ${selected.genre}`;
  document.getElementById("detailModalDesc").textContent = selected.description;
  document.getElementById("detailModalLikes").textContent = `❤️ ${selected.likes}`;
  document.getElementById("detailModalFinished").textContent = `✅ ${selected.finished} selesai`;
  document.getElementById("detailModalDuration").textContent = `⏱️ ${selected.duration}`;

  detailModal.classList.add("show");
}

document.getElementById("closeDetailModal").addEventListener("click", () => detailModal.classList.remove("show"));
document.getElementById("modalBorrowFromDetailBtn").addEventListener("click", () => {
  detailModal.classList.remove("show");
  openBorrow(currentDetailId);
});

// Event Listeners Filter Genre
const genreFilters = document.getElementById("genreFilters");
if (genreFilters) {
  genreFilters.addEventListener("click", e => {
    const btn = e.target.closest("button[data-genre]");
    if (!btn) return;
    activeGenre = btn.dataset.genre;
    document.querySelectorAll("#genreFilters .chip").forEach(c => c.classList.remove("active"));
    btn.classList.add("active");
    renderBooks();
  });
}

// Event Listeners Filter Tipe Buku
const typeFilters = document.getElementById("typeFilters");
if (typeFilters) {
  typeFilters.addEventListener("click", e => {
    const btn = e.target.closest("button[data-type]");
    if (!btn) return;
    activeType = btn.dataset.type;
    document.querySelectorAll("#typeFilters .chip").forEach(c => c.classList.remove("active"));
    btn.classList.add("active");
    renderBooks();
  });
}

if (searchInput) searchInput.addEventListener("input", renderBooks);
if (sortSelect) sortSelect.addEventListener("change", renderBooks);

// Notification Toast
function showToast(msg) {
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2800);
}

// Modal Handlers (Login, Borrow, Rules)
const openLoginModal = document.getElementById("openLoginModal");
const closeLoginModal = document.getElementById("closeLoginModal");
const openRegisterModalBtn = document.getElementById("openRegisterModalBtn");

if (openLoginModal) openLoginModal.addEventListener("click", () => loginModal.classList.add("show"));
if (openRegisterModalBtn) {
  openRegisterModalBtn.addEventListener("click", (e) => { e.preventDefault(); loginModal.classList.add("show"); });
}
if (closeLoginModal) closeLoginModal.addEventListener("click", () => loginModal.classList.remove("show"));

const footerLogin = document.getElementById("footerLogin");
const footerRegister = document.getElementById("footerRegister");
const footerProfile = document.getElementById("footerProfile");

if (footerLogin) footerLogin.addEventListener("click", (e) => { e.preventDefault(); loginModal.classList.add("show"); });
if (footerRegister) footerRegister.addEventListener("click", (e) => { e.preventDefault(); loginModal.classList.add("show"); });
if (footerProfile) footerProfile.addEventListener("click", (e) => { e.preventDefault(); loginModal.classList.add("show"); });

const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    loginModal.classList.remove("show");
    showToast("Berhasil masuk ke akun PUSTAKA LONTARA!");
  });
}

// Borrow Modal & WhatsApp Integration
function openBorrow(id) {
  const selected = books.find(b => b.id == id);
  if (!selected) return;
  document.getElementById("borrowBookId").value = selected.id;
  document.getElementById("borrowBookTitle").value = selected.title;
  document.getElementById("selectedBookBadge").textContent = `Buku: ${selected.title} (${selected.code})`;
  borrowModal.classList.add("show");
}

const closeBorrowModal = document.getElementById("closeBorrowModal");
if (closeBorrowModal) closeBorrowModal.addEventListener("click", () => borrowModal.classList.remove("show"));

const borrowForm = document.getElementById("borrowForm");
if (borrowForm) {
  borrowForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("borrowName").value.trim();
    const nim = document.getElementById("borrowNim").value.trim();
    const studentClass = document.getElementById("borrowClass").value.trim();
    const phone = document.getElementById("borrowPhone").value.trim();
    const title = document.getElementById("borrowBookTitle").value;

    const msg = `Halo Admin PUSTAKA LONTARA, saya ingin meminjam buku.\n\nNama: ${name}\nNIM: ${nim}\nKelas: ${studentClass}\nNo HP: ${phone}\nJudul Buku: ${title}\n\nMohon konfirmasinya. Terima kasih.`;
    
    window.open(`https://wa.me/${ADMIN_WA}?text=${encodeURIComponent(msg)}`, "_blank");
    borrowModal.classList.remove("show");
    showToast("Diteruskan ke WhatsApp Admin...");
  });
}

// Aturan Perpustakaan Modal Handlers
const closeRulesModal = document.getElementById("closeRulesModal");
const acceptRulesBtn = document.getElementById("acceptRulesBtn");
const footerRulesLink = document.getElementById("footerRulesLink");

if (footerRulesLink) {
  footerRulesLink.addEventListener("click", (e) => {
    e.preventDefault();
    if (rulesModal) rulesModal.classList.add("show");
  });
}

if (closeRulesModal) closeRulesModal.addEventListener("click", () => rulesModal.classList.remove("show"));
if (acceptRulesBtn) acceptRulesBtn.addEventListener("click", () => rulesModal.classList.remove("show"));
if (rulesModal) {
  rulesModal.addEventListener("click", (e) => {
    if (e.target === rulesModal) rulesModal.classList.remove("show");
  });
}

// Fun Fact Cycler
const funFacts = [
  "Ada lebih banyak kemungkinan susunan satu tumpukan kartu remi daripada jumlah atom di Bumi.",
  "Membaca buku selama 6 menit sehari dapat menurunkan tingkat stres hingga 68%.",
  "Nusantara memiliki tradisi naskah lontar tertua yang diakui sebagai warisan dunia UNESCO.",
  "Otak manusia menghasilkan listrik yang cukup untuk menyalakan lampu bohlam kecil."
];
let factIndex = 0;
setInterval(() => {
  factIndex = (factIndex + 1) % funFacts.length;
  const factEl = document.getElementById("funFactText");
  if (factEl) factEl.textContent = `"${funFacts[factIndex]}"`;
}, 6000);