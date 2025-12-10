# Panduan Konfigurasi Environment Variables (.env)

File `.env` adalah tempat menyimpan "rahasia" dan konfigurasi aplikasi. Anda perlu membuat 2 file `.env` di VPS.

## 1. Backend (.env)
Lokasi di VPS: `~/rainflow-app/.env`

Isi file ini dengan text berikut:

```env
# Server Config
PORT=3000
NODE_ENV=production

# Database (PostgreSQL)
# Sesuai dengan yang ada di docker-compose.host.yml
DB_HOST=localhost
DB_PORT=5432
DB_USER=rainflow_user
DB_PASSWORD=rainflow_password
DB_NAME=rainflow_db

# Redis (Job Queue)
REDIS_HOST=localhost
REDIS_PORT=6379

# Google YouTube API (PENTING UNTUK UPLOAD)
# Cara dapatnya lihat di bawah
GOOGLE_CLIENT_ID=isi_client_id_disini
GOOGLE_CLIENT_SECRET=isi_client_secret_disini
GOOGLE_REDIRECT_URI=http://54.219.178.244.nip.io:3000/api/auth/google/callback
```

### Cara Mendapatkan Google Client ID & Secret:
1.  Buka [Google Cloud Console](https://console.cloud.google.com/).
2.  Buat Project baru (misal: "Rainflow App").
3.  Ke menu **APIs & Services** > **Credentials**.
4.  Klik **Create Credentials** > **OAuth client ID**.
5.  Pilih Application type: **Web application**.
6.  Di bagian **Authorized redirect URIs**, masukkan:
    `http://54.219.178.244.nip.io:3000/api/auth/google/callback`
    
    > **PENTING:** Google menolak jika hanya menggunakan angka IP saja. Kita gunakan trik `nip.io` agar IP Anda dianggap sebagai "Domain Resmi".
7.  Klik **Create**. Anda akan dapat **Client ID** dan **Client Secret**. Copy ke file `.env` di atas.

---

## 2. Frontend (.env)
Lokasi di VPS: `~/rainflow-app/frontend/.env`

Isi file ini dengan text berikut:

```env
# Alamat Backend (Server)
# Ini agar frontend tahu harus kirim data ke mana
VITE_API_URL=http://54.219.178.244:3000
```

---

## Cara Mengisi di VPS
1.  Masuk ke VPS via SSH.
2.  Buka/Buat file backend: `nano ~/rainflow-app/.env` -> Paste isi Backend -> Save (Ctrl+X, Y, Enter).
3.  Buka/Buat file frontend: `nano ~/rainflow-app/frontend/.env` -> Paste isi Frontend -> Save.
4.  Restart aplikasi:
    ```bash
    pm2 restart all
    ```
