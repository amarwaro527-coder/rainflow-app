# Panduan Instalasi Rainflow (VPS)

Panduan ini akan membimbing Anda dari nol sampai aplikasi berjalan 100%.

## TAHAP 0: Update Repo (Wajib!)
Karena ada perbaikan konfigurasi terakhir, lakukan ini di **PC/Laptop** Anda dulu sebelum ke VPS:

1.  Buka terminal di folder `rainflow-app`.
2.  Ketik perintah ini:
    ```bash
    git add .
    git commit -m "Fix tsconfig to CommonJS"
    git push
    ```

---

## TAHAP 1: Persiapan VPS (Sekali Saja)
Login ke VPS Anda, lalu jalankan perintah ini satu per satu.

**1. Update & Install Tools**
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git unzip
```

**2. Install Docker (Database)**
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
rm get-docker.sh
```

**3. Install Node.js v20**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

---

## TAHAP 2: Download Aplikasi

**1. Hapus Versi Lama (Biar Bersih)**
```bash
cd ~
rm -rf rainflow-automation
rm -rf rainflow-app
```

**2. Clone Repository Baru**
Ganti `USERNAME` dengan username GitHub Anda.
```bash
git clone https://github.com/USERNAME/rainflow-app.git
cd rainflow-app
```

**3. Install Dependency**
```bash
npm install
```
*(Tunggu sampai selesai. Bisa 2-5 menit)*

---

## TAHAP 3: Setup Environment (.env)

Kita pakai cara cepat (Anti-Gagal) untuk membuat file konfigurasi.
Copy **SEMUA** kode di bawah ini, lalu Paste ke terminal VPS:

```bash
cat > .env <<EOF
PORT=3000
NODE_ENV=production

# Database (Docker)
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=rainflow

# Redis (Docker)
REDIS_HOST=localhost
REDIS_PORT=6379

# Google API
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=http://VPS_IP_ANDA:3000/api/auth/google/callback
EOF
```

---

## TAHAP 4: Jalankan Aplikasi

**1. Nyalakan Database**
```bash
sudo docker compose up -d
```

**2. Jalankan Server**
```bash
npm run dev
```

Jika muncul: `🚀 Rainflow Server running on port 3000`
**SELAMAT! Aplikasi Anda sudah online.** 🎉
