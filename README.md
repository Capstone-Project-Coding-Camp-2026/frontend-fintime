# FinTime - Frontend (React + Vite) 🚀

![FinTime Logo](https://img.shields.io/badge/FinTime-AI_Financial_Time_Machine-00f5ff?style=for-the-badge)

**FinTime** adalah sebuah aplikasi "AI Financial Time Machine" inovatif yang membantu pengguna mencapai kebebasan finansial melalui proyeksi masa depan, manajemen keuangan cerdas (*smart ledger*), dan simulasi keputusan ("What-If"). 

Proyek ini dibangun menggunakan **React (Vite)** dengan antarmuka pengguna yang sangat responsif, elegan, dan kaya akan animasi.

---

## ✨ Fitur Utama

*   **📊 Dashboard Interaktif:** Pantau arus kas (Pemasukan, Pengeluaran, Saldo) dan lacak aktivitas finansial dalam satu tampilan elegan dengan Mode Gelap (*Dark Theme*).
*   **🤖 AI Assistance (Simulasi What-If):** Fitur canggih untuk memproyeksikan kekayaan masa depan berdasarkan kondisi finansial dan pola belanja Anda saat ini.
*   **🎯 Target Tabungan & Budgeting:** Tetapkan batas *budget* bulanan untuk berbagai kategori dan raih *goals* spesifik (misal: Beli Mobil, Dana Darurat) dengan *progress tracking* visual.
*   **📈 Smart Ledger:** Pencatatan dan klasifikasi transaksi keuangan secara otomatis, ringkas, dan modern.
*   **🏆 Gamifikasi (Pencapaian):** Dapatkan penghargaan dan pertahankan *streak* harian Anda untuk membangun kebiasaan finansial yang lebih sehat!
*   **📱 Sepenuhnya Responsif:** Dirancang dengan pendekatan *Mobile-First*. Optimal digunakan baik di *Desktop*, *Tablet*, maupun *Smartphone*.

---

## 🛠️ Teknologi yang Digunakan

*   **[React 18](https://reactjs.org/)** - Library UI utama
*   **[Vite](https://vitejs.dev/)** - *Build tool* & *Dev server* yang super cepat
*   **[Tailwind CSS](https://tailwindcss.com/)** - *Utility-first CSS framework* untuk *styling* cepat dan konsisten
*   **[Framer Motion](https://www.framer.com/motion/)** - *Library* animasi tingkat lanjut untuk pergerakan UI yang sangat halus (*micro-interactions* dan transisi rute)
*   **[React Router v6](https://reactrouter.com/)** - *Routing* aplikasi SPA
*   **[Lucide React](https://lucide.dev/)** - Kumpulan ikon *open-source* yang minimalis dan indah

---

## 🚀 Cara Menjalankan Proyek secara Lokal

1. **Pastikan Anda memiliki [Node.js](https://nodejs.org/) terinstal di komputer Anda.**
2. **Kloning Repositori:**
   ```bash
   git clone https://github.com/Capstone-Project-Coding-Camp-2026/frontend-fintime.git
   cd frontend-fintime
   ```
3. **Instal Dependensi:**
   ```bash
   npm install
   ```
   *(Atau gunakan `yarn install` / `pnpm install`)*
4. **Jalankan *Development Server*:**
   ```bash
   npm run dev
   ```
5. Buka **`http://localhost:5173`** di browser Anda untuk melihat hasilnya.

---

## 📂 Struktur Direktori Utama

```
src/
├── components/       # Komponen React yang dapat digunakan ulang (Navbar, Modals, dll)
│   ├── budget/       # Komponen terkait penganggaran
│   ├── dashboard/    # Komponen utama di halaman beranda
│   ├── layout/       # Tata letak aplikasi (misal: DashboardLayout)
│   └── common/       # Komponen umum (Logo, dll)
├── pages/            # Halaman utama aplikasi (Dashboard, Profile, Gamification, dll)
├── context/          # State Management global (seperti ToastContext)
├── assets/           # Gambar, font, dan aset statis lainnya
├── data/             # Mock data / Konstanta
├── App.jsx           # Entry point untuk routing
└── index.css         # Styling global Tailwind CSS
```

---

## 🤝 Kontribusi

Aplikasi ini dikembangkan untuk keperluan *Capstone Project*. Jika Anda ingin berkontribusi, silakan buat *pull request* ke *branch* `development`.

© 2026 FinTime Team. Dibuat dengan 💡 dan ☕.
