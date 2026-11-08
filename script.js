// PUSTAKA LONTARA — shared multi-page experience
const books = [
  {
    id: 1,
    title: "Alice’s Adventures in Wonderland",
    author: "Lewis Carroll",
    category: "Misteri",
    type: "Digital",
    image: "https://i.pinimg.com/1200x/69/b6/59/69b6598b4b9423324c5d0e1b1939c439.jpg",
    description: "Petualangan Alice di dunia ajaib yang penuh teka-teki, tokoh unik, dan kejadian tak terduga.",
    rating: 4.9,
    link: "https://www.gutenberg.org/ebooks/11.html.images"
  },
  {
    id: 2,
    title: "The Wonderful Wizard of Oz",
    author: "L. Frank Baum",
    category: "Alam",
    type: "Digital",
    image: "https://i.pinimg.com/736x/d2/6b/78/d26b784912fa0efa5a17f2c5f45250bf.jpg",
    description: "Kisah Dorothy dan teman-temannya dalam perjalanan menakjubkan menuju Kota Zamrud.",
    rating: 4.9,
    link: "https://www.gutenberg.org/ebooks/55.html.images"
  },
  {
    id: 3,
    title: "Anne of Green Gables",
    author: "Lucy Maud Montgomery",
    category: "Sejarah",
    type: "Digital",
    image: "https://i.pinimg.com/736x/06/36/5b/06365bd9f65ae7b7b8042319540c7970.jpg",
    description: "Kisah Anne Shirley, seorang anak yatim piatu yang menemukan keluarga dan persahabatan di Green Gables.",
    rating: 4.8,
    link: "https://www.gutenberg.org/ebooks/45.html.images"
  },
  {
    id: 4,
    title: "The Secret Garden",
    author: "Frances Hodgson Burnett",
    category: "Alam",
    type: "Digital",
    image: "https://i.pinimg.com/736x/50/13/a3/5013a37abc647f91fd4776b2e54adb8c.jpg",
    description: "Kisah persahabatan dan pemulihan yang bermula dari sebuah taman rahasia yang terlupakan.",
    rating: 4.8,
    link: "https://www.gutenberg.org/ebooks/113.html.images"
  },
  {
    id: 5,
    title: "The Adventures of Sherlock Holmes",
    author: "Arthur Conan Doyle",
    category: "Misteri",
    type: "Digital",
    image: "https://i.pinimg.com/736x/ce/29/f2/ce29f2ee4f7617f73ee5f05a378e52fe.jpg",
    description: "Kumpulan kasus detektif Sherlock Holmes dan Dr. Watson dalam memecahkan berbagai misteri.",
    rating: 4.9,
    link: "https://www.gutenberg.org/ebooks/1661.html.images"
  },
  {
    id: 6,
    title: "Around the World in Eighty Days",
    author: "Jules Verne",
    category: "Sejarah",
    type: "Digital",
    image: "https://i.pinimg.com/1200x/cf/fa/ef/cffaef637b6d9cd8e1b26f6656acca30.jpg",
    description: "Petualangan Phileas Fogg yang bertaruh untuk mengelilingi dunia dalam waktu delapan puluh hari.",
    rating: 4.8,
    link: "https://www.gutenberg.org/ebooks/103.html.images"
  },
  {
    id: 7,
    title: "Black Beauty",
    author: "Anna Sewell",
    category: "Alam",
    type: "Digital",
    image: "https://i.pinimg.com/736x/39/31/7d/39317d86732df0d03087cc7889d83fb3.jpg",
    description: "Kisah kehidupan seekor kuda yang mengajak pembaca memahami kasih sayang dan perlakuan baik terhadap hewan.",
    rating: 4.8,
    link: "https://www.gutenberg.org/ebooks/271.html.images"
  },
  {
    id: 8,
    title: "Little Women",
    author: "Louisa May Alcott",
    category: "Sejarah",
    type: "Digital",
    image: "https://i.pinimg.com/736x/ae/85/e1/ae85e143c738729359ec52b7fd546316.jpg",
    description: "Kisah empat saudari March tentang keluarga, persahabatan, cita-cita, dan perjalanan menuju kedewasaan.",
    rating: 4.9,
    link: "https://www.gutenberg.org/ebooks/514.html.images"
  }
];
const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const read = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));
let wishlist = read("pustakaWishlist", []);
let currentUser = read("pustakaUser", null);
let selectedBookId = null;
let selectedGenre = "Semua", selectedType = "Semua";
const initialParams = new URLSearchParams(window.location.search);
const initialSearch = initialParams.get("q") || "";
if (initialParams.get("kategori")) selectedGenre = initialParams.get("kategori");
const ADMIN_WA = "628xxxxxxxxxx";
const borrowKey = "pustakaBorrowRequests";
let borrowRequests = read(borrowKey, []);

function toast(message) {
  const el = $("#toast");
  if (!el) return;
  el.textContent = message; el.classList.add("show");
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => el.classList.remove("show"), 2800);
}
function showModal(id) { const el=$("#"+id); if(el) el.classList.add("show"); }
function closeModal(id) { const el=$("#"+id); if(el) el.classList.remove("show"); }
function bookCard(book, compact=false) {
  return `<article class="book-card">
    <img src="${book.image}" alt="Sampul ${book.title}" loading="lazy" onclick="showDetail(${book.id})">
    <div class="book-card-content">
      <span class="book-category">${book.category}</span><h3>${book.title}</h3>
      <p>Penulis: ${book.author}</p><p>⭐ ${book.rating} / 5 · ${book.type}</p>
      <button onclick="showDetail(${book.id})">Lihat Detail</button>
      <button class="btn-soft" onclick="toggleWishlist(${book.id})">${wishlist.includes(book.id)?"♥ Hapus Favorit":"♡ Simpan Favorit"}</button>
      ${!compact ? `<button onclick="openBorrow(${book.id})">${book.type==="Fisik"?"Ajukan Peminjaman":"Pinjam Buku"}</button>`:""}
    </div></article>`;
}
function renderCatalog() {
  const grid=$("#bookGrid"); if(!grid) return;
  const keyword=($("#searchInput")?.value||"").toLocaleLowerCase("id-ID").trim();
  let list=books.filter(b=>{
    const searchable=[b.title,b.author,b.category,b.type,b.description].join(" ").toLocaleLowerCase("id-ID");
    return (!keyword || searchable.includes(keyword)) &&
      (selectedGenre==="Semua"||b.category===selectedGenre) &&
      (selectedType==="Semua"||b.type===selectedType);
  });
  const sort=$("#sortSelect")?.value;
  if(sort==="az") list.sort((a,b)=>a.title.localeCompare(b.title));
  if(sort==="za") list.sort((a,b)=>b.title.localeCompare(a.title));
  grid.innerHTML=list.map(b=>bookCard(b)).join("");
  if($("#bookCount")) $("#bookCount").textContent=keyword
    ? `Ditemukan ${list.length} buku untuk “${$("#searchInput").value.trim()}”`
    : `Menampilkan ${list.length} dari ${books.length} buku`;
  if($("#emptyState")) $("#emptyState").style.display=list.length?"none":"block";
}
function renderPhysical() {
  const grid=$("#physicalBookGrid"); if(grid) grid.innerHTML=books.filter(b=>b.type==="Fisik").map(b=>bookCard(b)).join("");
}
function renderWishlist() {
  const grid=$("#wishlistGrid"); if(!grid) return;
  const list=books.filter(b=>wishlist.includes(b.id));
  grid.innerHTML=list.map(b=>bookCard(b,true)).join("");
  if($("#emptyWishlistState")) $("#emptyWishlistState").style.display=list.length?"none":"block";
}
function toggleWishlist(id) {
  wishlist=wishlist.includes(id)?wishlist.filter(x=>x!==id):[...wishlist,id];
  write("pustakaWishlist",wishlist); renderCatalog(); renderPhysical(); renderWishlist();
  toast(wishlist.includes(id)?"Buku ditambahkan ke koleksi favorit.":"Buku dihapus dari favorit.");
}
function showDetail(id) {
  const b=books.find(x=>x.id===id); if(!b)return;
  $("#detailModalCover").src=b.image;
  $("#detailModalInfo").innerHTML=`<span class="book-category">${b.category}</span><h2>${b.title}</h2>
  <p><strong>Penulis:</strong> ${b.author}</p><p><strong>Jenis:</strong> ${b.type}</p>
  <p><strong>Rating:</strong> ⭐ ${b.rating}/5</p><p>${b.description}</p>
  ${b.link?`<a class="btn-primary" href="${b.link}" target="_blank" rel="noopener">Baca Buku</a>`:`<p class="detail-notice">Link bacaan belum tersedia.</p>`}
  <button class="btn-primary" onclick="openBorrow(${b.id})">Ajukan Peminjaman</button>`;
  showModal("detailModal");
}
function openBorrow(id) {
  selectedBookId=id; const b=books.find(x=>x.id===id); if(!b)return;
  $("#selectedBookBadge").innerHTML=`<p>Buku yang dipilih</p><strong>${b.title}</strong><p>${b.author} · ${b.type}</p>`;
  if(currentUser && $("#borrowName")) $("#borrowName").value=currentUser.name;
  closeModal("detailModal"); showModal("borrowModal");
}
function renderAdmin() {
  const tbody=$("#borrowTableBody"); if(!tbody)return;
  borrowRequests=read(borrowKey,[]);
  const q=($("#adminSearch")?.value||"").toLowerCase();
  const status=$("#statusFilter")?.value||"Semua";
  const list=borrowRequests.filter(r=>(r.name+" "+r.book+" "+r.phone).toLowerCase().includes(q)&&(status==="Semua"||r.status===status));
  tbody.innerHTML=list.length?list.map(r=>`<tr>
    <td><strong>${escapeHTML(r.name)}</strong><small>${escapeHTML(r.phone)}</small></td>
    <td>${escapeHTML(r.book)}<small>${escapeHTML(r.type)}</small></td>
    <td>${escapeHTML(r.date)}</td>
    <td><span class="status status-${r.status.toLowerCase()}">${r.status}</span></td>
    <td><select aria-label="Ubah status" onchange="updateBorrowStatus('${r.id}',this.value)">
      ${["Menunggu","Disetujui","Dikembalikan"].map(s=>`<option ${r.status===s?"selected":""}>${s}</option>`).join("")}
    </select></td>
    <td><button type="button" class="delete-borrow-btn" onclick="deleteBorrowRequest('${r.id}')" aria-label="Hapus permintaan ${escapeHTML(r.book)}">Hapus</button></td>
    </tr>`).join(""):`<tr><td colspan="6" class="table-empty">Belum ada data peminjaman.</td></tr>`;
  $("#statTotal") && ($("#statTotal").textContent=books.length);
  $("#statBorrow") && ($("#statBorrow").textContent=borrowRequests.length);
  $("#statWaiting") && ($("#statWaiting").textContent=borrowRequests.filter(r=>r.status==="Menunggu").length);
  $("#statUsers") && ($("#statUsers").textContent=new Set(borrowRequests.map(r=>r.phone)).size);
}
function updateBorrowStatus(id,status) {
  borrowRequests=read(borrowKey,[]).map(r=>r.id===id?{...r,status}:r);
  write(borrowKey,borrowRequests); renderAdmin(); toast("Status peminjaman diperbarui.");
}
function deleteBorrowRequest(id) {
  const current = read(borrowKey, []);
  const request = current.find(r => String(r.id) === String(id));
  if (!request) { toast("Data peminjaman tidak ditemukan."); return; }
  const approved = window.confirm(`Batalkan dan hapus permintaan peminjaman buku "${request.book}" atas nama ${request.name}?\n\nData yang dihapus tidak dapat dipulihkan.`);
  if (!approved) return;
  borrowRequests = current.filter(r => String(r.id) !== String(id));
  write(borrowKey, borrowRequests);
  renderAdmin();
  toast("Permintaan peminjaman berhasil dihapus.");
}
function escapeHTML(s) { return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }

if ($("#searchInput")) {
  $("#searchInput").value = initialSearch;
  $("#searchInput").addEventListener("input",renderCatalog);
}
$("#clearSearch")?.addEventListener("click",()=>{
  if($("#searchInput")) { $("#searchInput").value=""; $("#searchInput").focus(); }
  renderCatalog();
});
$("#homeSearchForm")?.addEventListener("submit",e=>{
  e.preventDefault();
  const q=$("#homeSearchInput")?.value.trim()||"";
  location.href="katalog.html"+(q?"?q="+encodeURIComponent(q):"");
});
$("#sortSelect")?.addEventListener("change",renderCatalog);
$$("[data-genre]").forEach(btn=>{
  btn.classList.toggle("active",btn.dataset.genre===selectedGenre);
  btn.addEventListener("click",()=>{
  selectedGenre=btn.dataset.genre; $$("[data-genre]").forEach(x=>x.classList.toggle("active",x===btn)); renderCatalog();
  });
});
$$("[data-type]").forEach(btn=>btn.addEventListener("click",()=>{
  selectedType=btn.dataset.type; $$("[data-type]").forEach(x=>x.classList.toggle("active",x===btn)); renderCatalog();
}));
$$(".category-card").forEach(btn=>btn.addEventListener("click",()=>location.href=`katalog.html?kategori=${encodeURIComponent(btn.dataset.category)}`));
$("#borrowForm")?.addEventListener("submit",e=>{
  e.preventDefault(); const b=books.find(x=>x.id===selectedBookId); if(!b)return;
  const request={id:String(Date.now()),name:$("#borrowName").value.trim(),phone:$("#borrowPhone").value.trim(),
    address:$("#borrowAddress").value.trim(),book:b.title,type:b.type,status:"Menunggu",
    date:new Date().toLocaleDateString("id-ID")};
  borrowRequests=read(borrowKey,[]); borrowRequests.unshift(request); write(borrowKey,borrowRequests);
  const message=`PERMINTAAN PEMINJAMAN BUKU\nNama: ${request.name}\nNomor HP: ${request.phone}\nAlamat: ${request.address}\nBuku: ${b.title}\nJenis: ${b.type}`;
  const wa=ADMIN_WA.replace(/\D/g,"");
  if(/^62\d{8,15}$/.test(wa)) window.open("https://wa.me/"+wa+"?text="+encodeURIComponent(message),"_blank");
  e.target.reset(); closeModal("borrowModal"); toast("Permintaan tersimpan. Admin dapat melihatnya di Dashboard.");
});
$("#loginBtn")?.addEventListener("click",()=>showModal("loginModal"));
$("#loginForm")?.addEventListener("submit",e=>{
  e.preventDefault(); currentUser={name:$("#loginName").value.trim(),email:$("#loginEmail").value.trim()};
  write("pustakaUser",currentUser); closeModal("loginModal"); updateLogin(); toast("Selamat datang, "+currentUser.name+"!");
});
function updateLogin(){if($("#loginBtn"))$("#loginBtn").textContent=currentUser?"Halo, "+currentUser.name.split(" ")[0]:"Masuk";}
$("#registerBtn")?.addEventListener("click",e=>{e.preventDefault();toast("Pendaftaran akun belum terhubung ke server.");});
$("#footerRules")?.addEventListener("click",e=>{e.preventDefault();showModal("rulesModal");});
$("#themeToggle")?.addEventListener("click",()=>{
  document.body.classList.toggle("dark-mode"); const dark=document.body.classList.contains("dark-mode");
  $("#themeToggle").textContent=dark?"☀":"☾"; localStorage.setItem("pustakaTheme",dark?"dark":"light");
});
if(localStorage.getItem("pustakaTheme")==="dark"){document.body.classList.add("dark-mode");if($("#themeToggle"))$("#themeToggle").textContent="☀";}
$("#menuToggle")?.addEventListener("click",()=>{$("#navMenu")?.classList.toggle("open");});
$$("#navMenu a").forEach(a=>a.addEventListener("click",()=>$("#navMenu")?.classList.remove("open")));
$$("[data-close]").forEach(btn=>btn.addEventListener("click",()=>btn.closest(".modal")?.classList.remove("show")));
$$(".modal").forEach(m=>m.addEventListener("click",e=>{if(e.target===m)m.classList.remove("show");}));
document.addEventListener("keydown",e=>{if(e.key==="Escape")$$(".modal.show").forEach(m=>m.classList.remove("show"));});
$("#adminSearch")?.addEventListener("input",renderAdmin); $("#statusFilter")?.addEventListener("change",renderAdmin);
$("#exportBorrow")?.addEventListener("click",()=>{
  const rows=read(borrowKey,[]); const csv=[["Nama","Telepon","Alamat","Buku","Jenis","Tanggal","Status"],...rows.map(r=>[r.name,r.phone,r.address,r.book,r.type,r.date,r.status])].map(row=>row.map(v=>'"'+String(v??"").replace(/"/g,'""')+'"').join(",")).join("\n");
  const a=document.createElement("a");a.href=URL.createObjectURL(new Blob(["\ufeff"+csv],{type:"text/csv;charset=utf-8"}));a.download="data-peminjaman-pustaka-lontara.csv";a.click();URL.revokeObjectURL(a.href);
});
const params=new URLSearchParams(location.search); if(params.get("kategori")){selectedGenre=params.get("kategori");$$("[data-genre]").forEach(b=>b.classList.toggle("active",b.dataset.genre===selectedGenre));}
renderCatalog();renderPhysical();renderWishlist();renderAdmin();updateLogin();


/* Mobile bottom navigation: only rendered on small screens via CSS. */
(function addMobileBottomNavigation() {
  if (document.querySelector(".mobile-bottom-nav")) return;
  const current = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  const links = [
    { href: "index.html", label: "Beranda", icon: "⌂", files: ["", "index.html", "index(1).html"] },
    { href: "katalog.html", label: "Katalog", icon: "▤", files: ["katalog.html"] },
    { href: "koleksi.html", label: "Favorit", icon: "♡", files: ["koleksi.html"] },
    { href: "admin.html", label: "Admin", icon: "♙", files: ["admin.html", "admin(1).html"] }
  ];
  const nav = document.createElement("nav");
  nav.className = "mobile-bottom-nav";
  nav.setAttribute("aria-label", "Navigasi utama");
  nav.innerHTML = links.map(item => {
    const active = item.files.includes(current);
    return `<a href="${item.href}" class="${active ? "active" : ""}" ${active ? 'aria-current="page"' : ""}>
      <span class="mobile-nav-icon" aria-hidden="true">${item.icon}</span>
      <span>${item.label}</span>
    </a>`;
  }).join("");
  document.body.appendChild(nav);
})();
