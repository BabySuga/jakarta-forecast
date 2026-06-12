# 🌤️ Cuaca Jakarta — Premium Weather Dashboard

Dashboard cuaca premium berbasis web untuk kota Jakarta, Indonesia. Dibangun sepenuhnya dengan **HTML, CSS, dan JavaScript Vanilla** menggunakan **Vite** sebagai build tool.

![Jakarta Weather Forecast Screenshot](screenshots/screenshot.png)

---

## ✨ Fitur Utama

- **Cuaca Real-time** — Suhu, kondisi cuaca, terasa seperti, kelembaban, angin, jarak pandang, serta waktu terbit & terbenam matahari
- **Prakiraan 5 Hari Ke Depan** — Kartu prakiraan harian dengan ikon cuaca dinamis
- **Grafik Suhu 5 Hari** — Visualisasi suhu maks & min menggunakan Chart.js
- **Indeks UV** — Gauge setengah lingkaran dengan gradien warna (oranye → merah)
- **Kualitas Udara (AQI)** — Indikator kualitas udara beserta status dan deskripsi
- **Peringatan Dini** — Notifikasi status cuaca berbahaya
- **Glassmorphism UI** — Desain modern dengan efek kaca, gradien, dan animasi halus
- **Interaktif** — Hover effect terangkat pada semua card, toast notification untuk fitur WIP
- **Real-time Clock** — Jam dan tanggal Jakarta yang terus diperbarui otomatis

---

## 🛠️ Tech Stack

| Layer | Teknologi |
|---|---|
| Markup | HTML5 Semantik |
| Styling | CSS3 (Vanilla, Glassmorphism, Custom Properties) |
| Logic | JavaScript ES6+ |
| Grafik | [Chart.js](https://www.chartjs.org/) |
| Data | [OpenWeatherMap API](https://openweathermap.org/appid) |
| Tooling | [Vite](https://vitejs.dev/) |

---

## 📁 Struktur Proyek

```
jakarta-forecast/
├── src/
│   ├── index.html       # Struktur utama dashboard
│   ├── styles.css       # Semua styling & animasi
│   ├── app.js           # Logic utama: fetch API, render UI
│   └── img/
│       └── monas-background.png
├── .env                 # API Key (tidak di-commit)
├── .env.example
├── package.json
└── vite.config.js
```

---

## 🚀 Cara Menjalankan Lokal

**1. Install dependencies**
```bash
npm install
```

**2. Buat file `.env` dari contoh yang ada**
```bash
cp .env.example .env
```

**3. Isi API Key dari [OpenWeatherMap](https://openweathermap.org/appid)**
```
VITE_API_KEY=api_key_kamu_di_sini
```

**4. Jalankan dev server**
```bash
npm run dev
```

Buka `http://localhost:5173` di browser.

---

## 🔑 Environment Variable

| Variable | Keterangan |
|---|---|
| `VITE_API_KEY` | API Key dari OpenWeatherMap (gratis) |

---

## 🎨 Desain & Keputusan Teknis

- **Glassmorphism** — Elemen UI menggunakan `backdrop-filter: blur()` dan background semi-transparan untuk efek kaca yang elegan
- **Warna berbasis CSS Custom Properties** — Seluruh palet warna didefinisikan di `:root` sehingga mudah dikustomisasi
- **Chart.js** — Dipilih untuk grafik suhu karena ringan dan mudah dikonfigurasi tanpa dependensi besar
- **Data 3-jam → Harian** — Data prakiraan OpenWeatherMap (per 3 jam) diproses dengan memilih entri paling dekat pukul 12.00 sebagai representasi harian
- **Toast Notification** — Fitur yang belum selesai (peta cuaca, info cuaca, pencarian, setting) diberi notifikasi *"Fitur ini sedang dikerjakan"* daripada dinonaktifkan, demi UX yang lebih baik

---

> Dibuat dengan ☁️ sebagai proyek personal eksplorasi front-end development.
