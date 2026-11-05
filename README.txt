PUSTAKA LONTARA — UPDATE LOGIN, ADMIN, LANGGANAN & DENDA

FITUR YANG DITAMBAHKAN
- Pengunjung wajib masuk atau membuat akun sebelum mengakses halaman website.
- Tombol Masuk/Keluar terlihat di handphone.
- Hak akses dashboard admin dibatasi untuk akun administrator.
- Admin dapat mengubah status, membatalkan/menghapus permintaan pinjam yang keliru.
- Dashboard menampilkan tanggal jatuh tempo dan estimasi denda.
- Setelah admin menyetujui pinjaman, masa pinjam 7 hari dimulai.
- Denda keterlambatan contoh: Rp2.000 per hari, dihitung sampai buku dikembalikan.
- Halaman Langganan: Premium contoh Rp10.000/bulan; pengajuan diverifikasi admin secara manual.
- Warna sage/ivory dan identitas desain Pustaka Lontara dipertahankan.

CARA MENJALANKAN
1. Ekstrak ZIP.
2. Buka folder di VS Code.
3. Semua file HTML, style.css, script.js, dan enhancements.js harus berada di folder yang sama.
4. Jalankan index.html melalui browser atau Live Server.

LOGIN ADMIN DEMO
Email: admin@pustakalontara.id
Kata sandi: LontaraAdmin!2026

PENTING — BATASAN VERSI DEMO
Sistem akun, sesi, peminjaman, dan langganan versi ini masih menggunakan localStorage browser.
Artinya, data tidak tersinkron otomatis antara HP pengguna dan laptop admin. Password juga
belum dilindungi oleh server. Untuk website yang benar-benar dipublikasikan, wajib gunakan
backend/database dan autentikasi aman (misalnya Firebase atau Supabase), serta gateway
pembayaran jika ingin menerima pembayaran otomatis.

Aturan contoh yang dapat diubah di enhancements.js:
- LOAN_DAYS = 7 hari.
- FINE_PER_DAY = 2000 rupiah per hari.
- Paket Premium = Rp10.000 per bulan.
Harga dan ketentuan ini adalah contoh awal, bukan ketentuan resmi perpustakaan.
