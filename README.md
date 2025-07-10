# 🧠 Forum API

RESTful API sebagai syarat kelulusan program dicoding, dibangun menggunakan Node.js dan Hapi.js dengan pendekatan Clean Architecture & TDD.

## 🧪 Tech Stack
- Node.js
- Hapi.js
- PostgreSQL
- JWT Authentication
- Jest (Testing)
- Clean Architecture

## 🚀 Cara Menjalankan

### 1. Clone repository dan install dependensi
```bash
git clone https://github.com/afrizaahmadmuqoffa/forum-api-dicoding.git
cd forum-api-dicoding
npm install
```
### 2. Setup Environment Variable
Salin file .env.example jadi .env:

```bash
cp .example.env .env
```
Lalu edit isinya sesuai database dan konfigurasi lokalmu.

### 3. Migrasi Database
```bash
npm run migrate up
npm run migrate:test up
```
### 4. Jalankan Server
```bash
npm run start:dev
```
### 5. Jalankan Tes
```bash
npm run test:watch
```

## 📄 Dokumentasi API

- [🧾 Download Postman Collection](./docs/Forum%20API%20V2%20Test.postman_collection.json)
- [🧾 Download Postman Environment ](./docs/Forum%20API%20V2%20Test.postman_environment.json)
