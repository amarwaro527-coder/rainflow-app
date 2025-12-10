# Panduan Membuka Port di AWS EC2 (Security Group)

Jika aplikasi sudah berjalan di VPS (cek dengan `pm2 list` aktif) tetapi **tidak bisa dibuka di browser**, 99% penyebabnya adalah **Firewall AWS (Security Group)** belum mengizinkan akses ke port tersebut.

Berikut cara memperbaikinya:

## 1. Masuk ke AWS Console
1.  Login ke [AWS Management Console](https://console.aws.amazon.com/).
2.  Cari layanan **EC2**.

## 2. Temukan Security Group Instance Anda
1.  Di menu sebelah kiri, klik **Instances**.
2.  Klik pada Instance VPS Anda (yang IP-nya `54.219.178.244`).
3.  Di bagian bawah layar, klik tab **Security**.
4.  Anda akan melihat link di bawah tulisan **Security groups** (biasanya bernama `launch-wizard-xx` atau `default`). **Klik link tersebut**.

## 3. Edit Inbound Rules (Aturan Masuk)
1.  Setelah masuk ke halaman Security Group, klik tab **Inbound rules** di bagian bawah.
2.  Klik tombol **Edit inbound rules** (di sebelah kanan).

## 4. Tambahkan Port 3000 dan 5173
Anda perlu menambahkan 2 aturan baru agar orang lain bisa mengakses aplikasi Anda.

Klik **Add rule** untuk setiap baris di bawah ini:

| Type | Protocol | Port range | Source | Description |
| :--- | :--- | :--- | :--- | :--- |
| Custom TCP | TCP | **3000** | **0.0.0.0/0** | Rainflow Backend |
| Custom TCP | TCP | **5173** | **0.0.0.0/0** | Rainflow Frontend |

*   **Penting**: Pastikan Source diatur ke `0.0.0.0/0` (Anywhere-IPv4) agar bisa diakses dari mana saja.

## 5. Simpan & Coba Lagi
1.  Klik tombol **Save rules** di pojok kanan bawah.
2.  Tunggu sekitar 10-30 detik.
3.  Coba buka kembali link aplikasi Anda di browser:
    *   Frontend: [http://54.219.178.244:5173](http://54.219.178.244:5173)
    *   Backend: [http://54.219.178.244:3000/health](http://54.219.178.244:3000/health)

Seharusnya sekarang aplikasi sudah bisa diakses! 🚀

## 6. Pertanyaan Umum (FAQ)

### Q: Apakah bisa diakses lewat HP (Handphone) atau Laptop lain?
**Jawab: YA, BISA.**
Karena Anda mengatur **Source** menjadi `0.0.0.0/0` (Anywhere), artinya **SIAPA SAJA** di seluruh dunia yang punya link tersebut bisa membuka aplikasi Anda, baik lewat HP (Android/iPhone), tablet, maupun laptop teman Anda. Tidak harus lewat VPS.

### Q: Berapa lama waktu yang dibutuhkan setelah "Save rules"?
**Jawab: INSTAN (Langsung).**
Perubahan pada AWS Security Group biasanya berlaku **seketika** (kurang dari 1-2 detik).
*   Jika setelah disimpan masih tidak bisa dibuka, coba **Refresh** browser Anda.
*   Pastikan Anda mengakses dengan `http://` (bukan `https://`) karena kita belum pasang SSL.
*   Pastikan port yang dimasukkan benar (`:5173` untuk frontend).
