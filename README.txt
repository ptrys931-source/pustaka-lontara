PUSTAKA LONTARA — PERBAIKAN LOGIN, LANGGANAN, ADMIN, DAN DENDA

Isi paket:
- Gerbang login/daftar tampil sebelum halaman website terlihat.
- Tampilan login khusus anggota dengan gaya modern dan responsif (inspirasi umum aplikasi baca, bukan salinan Wattpad).
- 8 kartu buku katalog (dua judul contoh tambahan).
- Paket keanggotaan Gratis, Premium Bulanan (Rp10.000/30 hari), Premium Tahunan (Rp99.000/1 tahun).
- Pengajuan langganan dan panel admin untuk aktivasi/penghapusan pengajuan.
- Dashboard admin: data peminjaman, status, jatuh tempo, estimasi denda, hapus data pinjaman yang keliru, dan ringkasan anggota.
- Masa pinjam 7 hari setelah disetujui; denda contoh Rp2.000 per hari keterlambatan.

CARA MENJALANKAN:
1. Ekstrak ZIP.
2. Buka folder Pustaka-Lontara-Mobile-Fix 23 di VS Code.
3. Jalankan melalui Live Server atau hosting web.
4. Login demo admin:
   Email: admin@pustakalontara.id
   Password: LontaraAdmin!2026

PENTING — BATASAN KEAMANAN:
Versi ini masih prototipe front-end. Akun, sesi, peminjaman, langganan dan dashboard disimpan di localStorage browser. Artinya belum tersinkron antara perangkat dan BUKAN autentikasi Firebase. Password demo admin tertanam pada kode dan hanya untuk pengujian lokal; jangan gunakan untuk website publik.
Agar siap dipublikasikan, tahap berikutnya wajib mengganti autentikasi demo dengan Firebase Authentication, menyimpan peminjaman/langganan/profil ke Realtime Database, membuat Security Rules yang sesuai, serta memverifikasi role admin di server/database. Jangan memasang aturan database terbuka.
Paket langganan belum menerima pembayaran otomatis. Admin memverifikasi pembayaran secara manual.
Delapan buku yang ditampilkan adalah data katalog contoh. Tautan PDF belum disediakan; untuk fitur baca PDF, unggah file yang memang kamu miliki/berhak distribusikan ke Firebase Storage lalu simpan URL-nya di data buku.

Pengaturan contoh yang bisa diubah di enhancements.js:
- LOAN_DAYS = 7
- FINE_PER_DAY = 2000
- PLANS: nama, harga, masa paket
