# Panduan Deployment Manlab.id (Laravel + Inertia.js + React + MySQL)

Dokumen ini berisi panduan lengkap langkah demi langkah untuk merilis dan men-deploy aplikasi Manlab.id ke server produksi (*production server* seperti VPS Ubuntu, Cloud Instance, atau aaPanel).

---

## 📋 Prasyarat Server (Prerequisites)

Sebelum melakukan deployment, pastikan server Anda telah terinstall:
- **PHP >= 8.2** dengan ekstensi berikut aktif: `ctype`, `curl`, `dom`, `fileinfo`, `filter`, `hash`, `mbstring`, `openssl`, `pcre`, `pdo_mysql`, `session`, `tokenizer`, `xml`.
- **Composer** (Dependency manager untuk PHP).
- **Node.js >= 18** & **npm** atau **yarn** (Untuk build aset frontend).
- **MySQL >= 8.0** atau **MariaDB >= 10.4**.
- Web Server (**Nginx** direkomendasikan, atau **Apache**).

---

## 🚀 Opsi 1: CD/CD Otomatis via GitHub Actions ke aaPanel (Direkomendasikan)

Jika Anda ingin melakukan deployment otomatis setiap kali Anda melakukan push ke branch `main` di GitHub, Anda dapat menggunakan workflow CI/CD bawaan yang memanfaatkan rsync SSH.

### Langkah 1: Siapkan SSH Key di aaPanel VPS
1. Masuk ke terminal VPS aaPanel Anda.
2. Buat SSH key pair jika belum ada:
   ```bash
   ssh-keygen -t rsa -b 4096 -C "deploy@manlab.id"
   ```
3. Tambahkan public key ke daftar authorized keys:
   ```bash
   cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys
   chmod 600 ~/.ssh/authorized_keys
   chmod 700 ~/.ssh
   ```
4. Salin isi private key (`~/.ssh/id_rsa`) yang nanti akan dimasukkan ke GitHub.

### Langkah 2: Konfigurasi GitHub Repository Secrets
Buka halaman repositori Anda di GitHub, lalu navigasikan ke **Settings** > **Secrets and variables** > **Actions** > **New repository secret**. Tambahkan key berikut:
1. `SERVER_IP` : Alamat IP server VPS aaPanel Anda.
2. `SSH_USER` : Username SSH Anda (biasanya `root`).
3. `SSH_PRIVATE_KEY` : Isi lengkap private key (`id_rsa`) yang Anda salin dari langkah 1 (termasuk tag `-----BEGIN RSA PRIVATE KEY-----` dan `-----END RSA PRIVATE KEY-----`).

### Langkah 3: Gunakan File Alur Kerja GitHub Actions
Alur kerja CI/CD sudah kami buatkan secara otomatis di direktori proyek Anda pada berkas [deploy.yml](file:///.github/workflows/deploy.yml). 

Setiap kali Anda menjalankan `git push origin main`, GitHub akan otomatis:
1. Membaca repositori dan menginstal dependensi PHP (Composer).
2. Mengompilasi berkas frontend React (Vite build) untuk production.
3. Menyinkronkan seluruh berkas proyek ke direktori aaPanel `/www/wwwroot/manlab.id` menggunakan rsync (sambil mengecualikan folder upload gambar `storage/app/public` agar data upload klien tidak terhapus).
4. Melakukan migrasi database dan pembersihan cache otomatis di server.

---

## 🚀 Opsi 2: Langkah Deployment Manual

Jika Anda memilih untuk tidak menggunakan CI/CD dan ingin mengunggah berkas secara manual ke aaPanel (baik via File Manager aaPanel atau FTP):

### Langkah 1: Kloning Repositori & Masuk ke Direktori
Kloning repositori kode Anda ke direktori web server aaPanel:
```bash
git clone <URL_REPOSITORI_ANDA> /www/wwwroot/manlab.id
cd /www/wwwroot/manlab.id
```

### Langkah 2: Konfigurasi File Environment (`.env`)
Salin berkas `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```
Buka berkas `.env` menggunakan editor teks (misal `nano .env` atau file manager aaPanel) dan sesuaikan parameter berikut:
```env
APP_NAME="Manlab.id"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://manlab.id   # Ganti dengan domain rill Anda

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=nama_database_produksi
DB_USERNAME=username_database
DB_PASSWORD=password_database
```

Generate application key baru untuk mengenkripsi cookie dan sesi:
```bash
php artisan key:generate --force
```

### Langkah 3: Install Dependensi PHP (Composer)
Jalankan instalasi dependensi PHP untuk production (tanpa paket development dan dengan optimasi autoloader):
```bash
composer install --no-dev --optimize-autoloader
```

### Langkah 4: Migrasi & Seed Database
Jalankan migrasi database ke database MySQL server produksi Anda. Gunakan flag `--force` karena Laravel membatasi migrasi destruktif pada environment production secara default:
```bash
php artisan migrate --force
```

Jika ini adalah instalasi pertama dan Anda ingin menyertakan data awal (seperti akun Admin dan data dummy):
```bash
php artisan db:seed --force
```
*Catatan: Akun admin default adalah `admin@manlab.id` dengan password `0000` (silakan segera ubah setelah login).*

### Langkah 5: Install & Build Aset Frontend (Vite)
Kompilasi aset React dan Tailwind/CSS untuk produksi agar siap disajikan oleh browser secara optimal:
```bash
npm ci
npm run build
```
Setelah proses selesai, berkas terkompilasi akan berada di folder `public/build/`.

### Langkah 6: Hubungkan Storage Publik (Symlink)
Buat symlink antara folder penyimpanan internal Laravel dan folder public agar file unggahan (seperti quotation & review photo) dapat diakses publik:
```bash
php artisan storage:link
```

### Langkah 7: Atur Izin File (*File Permissions*)
Beri izin akses baca-tulis kepada web server (misal `www-data` di Ubuntu) pada direktori `storage` dan `bootstrap/cache`:
```bash
sudo chown -R www-data:www-data /www/wwwroot/manlab.id
sudo find /www/wwwroot/manlab.id -type f -exec chmod 644 {} \;
sudo find /www/wwwroot/manlab.id -type d -exec chmod 755 {} \;
sudo chmod -R 775 /www/wwwroot/manlab.id/storage
sudo chmod -R 775 /www/wwwroot/manlab.id/bootstrap/cache
```

### Langkah 8: Optimasi Laravel Caching
Jalankan perintah berikut untuk mengompilasi semua file konfigurasi, rute, dan tampilan ke dalam cache guna meningkatkan kecepatan akses secara signifikan:
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

---

## 🌐 Konfigurasi Web Server di aaPanel (Nginx)

Untuk mengarahkan domain utama aaPanel Anda ke folder Laravel `public`:
1. Buka dashboard **aaPanel** > **Website** > klik domain `manlab.id`.
2. Pada tab **Site directory**, ubah **Running directory** ke `/public`, lalu klik **Save**.
3. Pada tab **URL rewrite**, masukkan konfigurasi rewrite rule Nginx untuk Laravel:
   ```nginx
   location / {
       try_files $uri $uri/ /index.php?$query_string;
   }
   ```
4. Klik **Save**.

---

## ⚡ Supervisor (Queue Worker) di aaPanel

Untuk memproses antrean di latar belakang (seperti pengiriman email masal otomatis):
1. Install **Supervisor** dari **App Store** di panel aaPanel Anda.
2. Buka Supervisor, klik **Add Daemon**.
3. Konfigurasikan sebagai berikut:
   - **Name**: `manlab-worker`
   - **Run User**: `www` (user default web server aaPanel)
   - **Run Directory**: `/www/wwwroot/manlab.id`
   - **Start Command**: `php artisan queue:work --sleep=3 --tries=3 --max-time=3600`
   - **Processes**: `2`
4. Klik **Confirm**.
