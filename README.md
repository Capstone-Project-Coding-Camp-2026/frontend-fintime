# FinTime Frontend

FinTime Frontend adalah antarmuka pengguna (UI) modern untuk platform manajemen keuangan cerdas FinTime. Aplikasi ini dirancang untuk memberikan visualisasi data yang intuitif, analisis skenario keuangan real-time, dan pengalaman pengguna yang seamless menggunakan teknologi web terbaru.

## Tech Stack
- **Framework:** React 19 (Vite)
- **Styling:** Tailwind CSS & Framer Motion (Animations)
- **State Management:** React Context API & SWR (Data Fetching)
- **Charts:** Recharts
- **Icons:** Lucide React
- **Routing:** React Router 7
- **Linting:** ESLint & Prettier

## Fitur Utama
- **Smarter Dashboard:** Ringkasan saldo, aset, dan riwayat transaksi dalam satu tampilan.
- **AI What-If Simulation:** Simulasi keputusan pembelian (Cash vs PayLater) dengan visualisasi probabilitas keberhasilan.
- **Interactive Charts:** Visualisasi pengeluaran dan pendapatan yang responsif.
- **Gamified Experience:** Avatar dinamis yang merefleksikan kondisi kesehatan finansial pengguna.
- **Responsive Design:** Optimal untuk berbagai ukuran layar (Desktop & Mobile).
- **Multi-language Support:** Dukungan Bahasa Indonesia dan Bahasa Inggris.

## Arsitektur Direktori
```text
frontend-fintime/
├── public/               # Static assets
├── src/
│   ├── assets/           # Gambar, icon, dan font
│   ├── components/       # Komponen UI (Atomic & Composite)
│   │   ├── common/       # Komponen reusable (Button, Logo, dll)
│   │   ├── dashboard/    # Komponen khusus halaman Dashboard
│   │   └── ui/           # Komponen dasar UI
│   ├── context/          # Global state (Auth, Language, Toast)
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Konfigurasi library (API Client/Axios)
│   ├── pages/            # Komponen Halaman (Routes)
│   ├── styles/           # Konfigurasi CSS global (Tailwind)
│   └── utils/            # Helper functions (Formatting, Validation)
├── index.html            # Entry point HTML
└── vite.config.js        # Konfigurasi Vite
```

## Instalasi & Penggunaan

### 1. Clone & Install
```bash
cd frontend-fintime
npm install
```

### 2. Konfigurasi Environment
Salin file `.env.example` menjadi `.env` dan sesuaikan variabel berikut:
- `VITE_API_URL`: URL base backend API (default: http://localhost:5000)

### 3. Menjalankan Aplikasi
- **Development:** `npm run dev`
- **Build:** `npm run build`
- **Lint:** `npm run lint`

## Pengembangan
Aplikasi ini mengikuti pola desain berbasis komponen. Gunakan `Framer Motion` untuk setiap transisi antar halaman atau interaksi mikro guna menjaga estetika aplikasi. Pastikan setiap komponen baru bersifat modular dan menggunakan variabel warna CSS yang telah ditentukan di `index.css`.

---
© 2026 FinTime Team. Seluruh hak cipta dilindungi undang-undang.
