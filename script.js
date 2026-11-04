
// =====================================
// PUSTAKA LONTARA
// JAVASCRIPT WEBSITE PERPUSTAKAAN
// =====================================

// Ganti dengan nomor WhatsApp admin.
// Gunakan kode negara 62, tanpa tanda +.
const ADMIN_WA = "628xxxxxxxxxx";

// =====================================
// DATA BUKU
// =====================================

const books = [
  {
    id: 1,
    title: "Misteri Dasar Samudera",
    author: "Andika Pratama",
    category: "Alam",
    type: "Digital",
    image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=500",
    description: "Mengenal kehidupan laut, ekosistem bawah laut, dan berbagai keunikan samudera.",
    rating: 4.8,
    link: ""
  },
  {
    id: 2,
    title: "Arsitektur Kosmik Bima Sakti",
    author: "Dimas Saputra",
    category: "Sains",
    type: "Digital",
    image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=500",
    description: "Mempelajari galaksi, planet, bintang, dan berbagai fenomena alam semesta.",
    rating: 4.9,
    link: ""
  },
  {
    id: 3,
    title: "Atlas Awan Nusantara",
    author: "Rina Amelia",
    category: "Alam",
    type: "Fisik",
    image: "https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=500",
    description: "Mengenal jenis awan, cuaca, dan fenomena atmosfer di Indonesia.",
    rating: 4.7,
    link: ""
  },
  {
    id: 4,
    title: "Planetarium Saku",
    author: "Fajar Ramadhan",
    category: "Sains",
    type: "Fisik",
    image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=500",
    description: "Panduan sederhana untuk mengenal planet dan benda-benda langit.",
    rating: 4.8,
    link: ""
  },
  {
    id: 5,
    title: "Jejak Peradaban Rempah",
    author: "Nadia Putri",
    category: "Sejarah",
    type: "Digital",
    image: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=500",
    description: "Menelusuri sejarah perdagangan rempah dan perkembangan peradaban Nusantara.",
    rating: 4.9,
    link: ""
  },
  {
    id: 6,
    title: "Ensiklopedia Paradoks Waktu",
    author: "Rizky Maulana",
    category: "Misteri",
    type: "Digital",
    image: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=500",
    description: "Membahas berbagai misteri waktu, teori, dan fakta menarik.",
    rating: 4.6,
    link: ""
  }
];

// =====================================
// VARIABEL
// =====================================

let selectedGenre = "Semua";
let selectedType = "Semua";
let selectedBookId = null;

let wishlist = JSON.parse(
  localStorage.getItem("pustakaWishlist") || "[]"
);

let currentUser = JSON.parse(
  localStorage.getItem("pustakaUser") || "null"
);

// =====================================
// FORMAT RATING
// =====================================

function ratingHTML(rating) {
  return `⭐ ${rating} / 5`;
}

// =====================================
// MENAMPILKAN BUKU
// =====================================

function renderBooks() {
  const bookGrid = document.getElementById("bookGrid");
  const searchInput = document.getElementById("searchInput");
  const sortSelect = document.getElementById("sortSelect");
  const emptyState = document.getElementById("emptyState");
  const bookCount = document.getElementById("bookCount");

  if (!bookGrid) return;

  const keyword = searchInput.value.toLowerCase().trim();

  let filteredBooks = books.filter(book => {
    const matchSearch =
      book.title.toLowerCase().includes(keyword) ||
      book.author.toLowerCase().includes(keyword);

    const matchGenre =
      selectedGenre === "Semua" ||
      book.category === selectedGenre;

    const matchType =
      selectedType === "Semua" ||
      book.type === selectedType;

    return matchSearch && matchGenre && matchType;
  });

  if (sortSelect.value === "az") {
    filteredBooks.sort((a, b) =>
      a.title.localeCompare(b.title)
    );
  }

  if (sortSelect.value === "za") {
    filteredBooks.sort((a, b) =>
      b.title.localeCompare(a.title)
    );
  }

  bookCount.textContent =
    `Menampilkan ${filteredBooks.length} buku`;

  if (filteredBooks.length === 0) {
    bookGrid.innerHTML = "";
    emptyState.style.display = "block";
    return;
  }

  emptyState.style.display = "none";

  bookGrid.innerHTML = filteredBooks.map(book => `
    <article class="book-card">
      <img
        src="${book.image}"
        alt="Sampul ${book.title}"
        loading="lazy"
        onclick="showDetail(${book.id})"
      >

      <div class="book-card-content">
        <span class="book-category">${book.category}</span>

        <h3>${book.title}</h3>

        <p>Penulis: ${book.author}</p>

        <p>${ratingHTML(book.rating)}</p>

        <p>Jenis: ${book.type}</p>

        <button onclick="showDetail(${book.id})">
          Lihat Detail
        </button>

        <button onclick="toggleWishlist(${book.id})">
          ${wishlist.includes(book.id) ? "♥ Hapus Favorit" : "♡ Simpan Favorit"}
        </button>

        <button onclick="openBorrow(${book.id})">
          Pinjam Buku
        </button>
      </div>
    </article>
  `).join("");
}

// =====================================
// MENAMPILKAN BUKU FISIK
// =====================================

function renderPhysicalBooks() {
  const container = document.getElementById("physicalBookGrid");

  if (!container) return;

  const physicalBooks = books.filter(
    book => book.type === "Fisik"
  );

  container.innerHTML = physicalBooks.map(book => `
    <article class="book-card">
      <img
        src="${book.image}"
        alt="Sampul ${book.title}"
        loading="lazy"
        onclick="showDetail(${book.id})"
      >

      <div class="book-card-content">
        <span class="book-category">Buku Fisik</span>
        <h3>${book.title}</h3>
        <p>Penulis: ${book.author}</p>
        <p>${ratingHTML(book.rating)}</p>

        <button onclick="showDetail(${book.id})">
          Lihat Detail
        </button>

        <button onclick="openBorrow(${book.id})">
          Ajukan Peminjaman
        </button>
      </div>
    </article>
  `).join("");
}

// =====================================
// DETAIL BUKU
// =====================================

function showDetail(id) {
  const book = books.find(item => item.id === id);

  if (!book) return;

  const modal = document.getElementById("detailModal");
  const cover = document.getElementById("detailModalCover");
  const info = document.getElementById("detailModalInfo");

  cover.src = book.image;
  cover.alt = "Sampul " + book.title;

  info.innerHTML = `
    <span class="book-category">${book.category}</span>
    <h2>${book.title}</h2>
    <p><strong>Penulis:</strong> ${book.author}</p>
    <p><strong>Jenis:</strong> ${book.type}</p>
    <p><strong>Rating:</strong> ${ratingHTML(book.rating)}</p>
    <p>${book.description}</p>

    ${book.link ? `
      <a class="btn-primary" href="${book.link}" target="_blank" rel="noopener">
        Baca Buku
      </a>
    ` : `
      <p class="detail-notice">
        Link bacaan belum tersedia.
      </p>
    `}

    <button class="btn-primary" onclick="openBorrow(${book.id})">
      Pinjam Buku
    </button>
  `;

  modal.classList.add("show");
}

// =====================================
// KOLEKSI FAVORIT
// =====================================

function toggleWishlist(id) {
  if (wishlist.includes(id)) {
    wishlist = wishlist.filter(item => item !== id);
    showToast("Buku dihapus dari favorit.");
  } else {
    wishlist.push(id);
    showToast("Buku berhasil disimpan!");
  }

  localStorage.setItem(
    "pustakaWishlist",
    JSON.stringify(wishlist)
  );

  renderBooks();
  renderWishlist();
  renderPhysicalBooks();
}

function renderWishlist() {
  const container = document.getElementById("wishlistGrid");
  const empty = document.getElementById("emptyWishlistState");

  if (!container) return;

  const favoriteBooks = books.filter(
    book => wishlist.includes(book.id)
  );

  if (favoriteBooks.length === 0) {
    container.innerHTML = "";
    empty.style.display = "block";
    return;
  }

  empty.style.display = "none";

  container.innerHTML = favoriteBooks.map(book => `
    <article class="book-card">
      <img src="${book.image}" alt="${book.title}" loading="lazy">

      <div class="book-card-content">
        <h3>${book.title}</h3>
        <p>${book.author}</p>

        <button onclick="showDetail(${book.id})">
          Lihat Detail
        </button>

        <button onclick="toggleWishlist(${book.id})">
          ♥ Hapus Favorit
        </button>
      </div>
    </article>
  `).join("");
}

// =====================================
// PEMINJAMAN BUKU
// =====================================

function openBorrow(id) {
  const book = books.find(item => item.id === id);

  if (!book) return;

  selectedBookId = id;

  document.getElementById("selectedBookBadge").innerHTML = `
    <p>Buku yang dipilih:</p>
    <strong>${book.title}</strong>
    <p>Jenis: ${book.type}</p>
  `;

  closeModal("detailModal");
  document.getElementById("borrowModal").classList.add("show");
}

document.getElementById("borrowForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const book = books.find(item => item.id === selectedBookId);

  if (!book) {
    showToast("Silakan pilih buku terlebih dahulu.");
    return;
  }

  const name = document.getElementById("borrowName").value.trim();
  const phone = document.getElementById("borrowPhone").value.trim();
  const address = document.getElementById("borrowAddress").value.trim();

  if (!name || !phone || !address) {
    showToast("Lengkapi semua data peminjaman.");
    return;
  }

  const message = `
PERMINTAAN PEMINJAMAN BUKU
--------------------------
Nama: ${name}
Nomor HP: ${phone}
Alamat: ${address}

Judul Buku: ${book.title}
Penulis: ${book.author}
Jenis: ${book.type}

Mohon konfirmasi ketersediaan buku.
  `;

  const adminNumber = ADMIN_WA.replace(/\D/g, "");

  if (!/^62\d{8,15}$/.test(adminNumber)) {
    showToast("Atur nomor WhatsApp admin di script.js terlebih dahulu.");
    return;
  }

  const whatsappURL =
    "https://wa.me/" + adminNumber +
    "?text=" + encodeURIComponent(message);

  window.open(whatsappURL, "_blank");

  this.reset();
  closeModal("borrowModal");
  showToast("Permintaan siap dikirim melalui WhatsApp.");
});

// =====================================
// PENCARIAN
// =====================================

document.getElementById("searchInput").addEventListener("input", renderBooks);

// =====================================
// PENGURUTAN
// =====================================

document.getElementById("sortSelect").addEventListener("change", renderBooks);

// =====================================
// FILTER KATEGORI
// =====================================

document.querySelectorAll("[data-genre]").forEach(button => {
  button.addEventListener("click", function() {
    selectedGenre = this.dataset.genre;

    document.querySelectorAll("[data-genre]").forEach(btn => {
      btn.classList.remove("active");
    });

    this.classList.add("active");
    renderBooks();

    document.getElementById("katalog").scrollIntoView({
      behavior: "smooth"
    });
  });
});

// =====================================
// FILTER JENIS BUKU
// =====================================

document.querySelectorAll("[data-type]").forEach(button => {
  button.addEventListener("click", function() {
    selectedType = this.dataset.type;

    document.querySelectorAll("[data-type]").forEach(btn => {
      btn.classList.remove("active");
    });

    this.classList.add("active");
    renderBooks();
  });
});

// =====================================
// KARTU KATEGORI BERANDA
// =====================================

document.querySelectorAll(".category-card").forEach(button => {
  button.addEventListener("click", function() {
    selectedGenre = this.dataset.category;

    document.querySelectorAll("[data-genre]").forEach(btn => {
      btn.classList.toggle(
        "active",
        btn.dataset.genre === selectedGenre
      );
    });

    renderBooks();

    document.getElementById("katalog").scrollIntoView({
      behavior: "smooth"
    });
  });
});

// =====================================
// MENU HAMBURGER HP
// =====================================

const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

menuToggle.addEventListener("click", function() {
  navMenu.classList.toggle("open");

  menuToggle.textContent =
    navMenu.classList.contains("open") ? "✕" : "☰";
});

document.querySelectorAll("#navMenu a").forEach(link => {
  link.addEventListener("click", function() {
    navMenu.classList.remove("open");
    menuToggle.textContent = "☰";
  });
});

// =====================================
// LOGIN SIMULASI
// =====================================

document.getElementById("loginBtn").addEventListener("click", function() {
  document.getElementById("loginModal").classList.add("show");
});

document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const name = document.getElementById("loginName").value.trim();
  const email = document.getElementById("loginEmail").value.trim();

  currentUser = { name, email };

  localStorage.setItem(
    "pustakaUser",
    JSON.stringify(currentUser)
  );

  closeModal("loginModal");

  document.getElementById("loginBtn").textContent =
    "Halo, " + name.split(" ")[0];

  this.reset();
  showToast("Berhasil masuk sebagai " + name);
});

// =====================================
// DAFTAR SIMULASI
// =====================================

document.getElementById("registerBtn").addEventListener("click", function(e) {
  e.preventDefault();
  showToast("Fitur pendaftaran belum terhubung ke database.");
});

// =====================================
// ATURAN PEMINJAMAN
// =====================================

document.getElementById("footerRules").addEventListener("click", function(e) {
  e.preventDefault();
  document.getElementById("rulesModal").classList.add("show");
});

// =====================================
// MODE GELAP
// =====================================

const themeToggle = document.getElementById("themeToggle");

if (localStorage.getItem("pustakaTheme") === "dark") {
  document.body.classList.add("dark-mode");
  themeToggle.textContent = "☀";
}

themeToggle.addEventListener("click", function() {
  document.body.classList.toggle("dark-mode");

  const isDark = document.body.classList.contains("dark-mode");

  themeToggle.textContent = isDark ? "☀" : "☾";

  localStorage.setItem(
    "pustakaTheme",
    isDark ? "dark" : "light"
  );
});

// =====================================
// FAKTA MENARIK
// =====================================

const facts = [
  "Membaca buku dapat menambah wawasan dan pengetahuan.",
  "Buku adalah salah satu sumber informasi yang telah digunakan selama berabad-abad.",
  "Membaca dapat membantu meningkatkan kemampuan berbahasa.",
  "Setiap buku memiliki cerita dan pengetahuan yang berbeda."
];

let factIndex = 0;

document.getElementById("funFactText").addEventListener("click", function() {
  factIndex = (factIndex + 1) % facts.length;
  this.textContent = facts[factIndex];
});

// =====================================
// MODAL
// =====================================

function closeModal(id) {
  const modal = document.getElementById(id);

  if (modal) {
    modal.classList.remove("show");
  }
}

document.querySelectorAll("[data-close]").forEach(button => {
  button.addEventListener("click", function() {
    const modal = this.closest(".modal");
    if (modal) modal.classList.remove("show");
  });
});

document.querySelectorAll(".modal").forEach(modal => {
  modal.addEventListener("click", function(e) {
    if (e.target === this) {
      this.classList.remove("show");
    }
  });
});

document.addEventListener("keydown", function(e) {
  if (e.key === "Escape") {
    document.querySelectorAll(".modal.show").forEach(modal => {
      modal.classList.remove("show");
    });
  }
});

// =====================================
// NOTIFIKASI TOAST
// =====================================

let toastTimer;

function showToast(message) {
  const toast = document.getElementById("toast");

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

// =====================================
// MEMULIHKAN LOGIN
// =====================================

if (currentUser) {
  document.getElementById("loginBtn").textContent =
    "Halo, " + currentUser.name.split(" ")[0];
}

// =====================================
// JALANKAN WEBSITE
// =====================================