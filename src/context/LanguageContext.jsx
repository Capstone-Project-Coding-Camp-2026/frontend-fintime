import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  id: {
    // Navbar & Layout
    nav_home: "Beranda",
    nav_dashboard: "Dashboard",
    nav_reports: "Laporan",
    nav_investment: "Investasi",
    nav_recurring: "Berulang",
    nav_profile: "Profil",
    nav_dash_short: "Dash",
    nav_settings: "Pengaturan",
    nav_logout: "Keluar",
    nav_login: "Masuk",
    nav_register: "Daftar",
    nav_help_tooltip: "Bantuan & Panduan",
    nav_notif_tooltip: "Notifikasi",

    // Landing Page Nav
    nav_landing_timeline: "Timeline",
    nav_landing_features: "Fitur",
    nav_landing_how: "Cara Kerja",
    nav_launch_app: "Buka Aplikasi",

    // Menu Sidebar
    menu_title: "Menu",
    menu_general: "Umum",
    menu_notifications: "Notifikasi",
    menu_data: "Data",
    menu_about: "Tentang",

    // Common Buttons
    btn_save: "Simpan",
    btn_cancel: "Batal",
    btn_edit: "Edit",
    btn_delete: "Hapus",
    btn_add: "Tambah",
    btn_loading: "Memproses...",
    btn_next: "Lanjut",
    btn_back: "Kembali",
    btn_show_less: "Tampilkan Lebih Sedikit",
    btn_see_all: "Lihat Semua",
    btn_clear: "Bersihkan Data Lokal",
    btn_backup: "Export Data",
    btn_download: "Unduh",

    // Dashboard
    dash_welcome: "Selamat Datang",
    dash_total_balance: "Total Saldo",
    dash_projected_wealth: "Proyeksi Kekayaan",
    dash_pension_survival: "Ketahanan Pensiun",
    dash_pension_years: "Tahun",
    dash_status_account: "Status Akun",
    dash_status_verified: "Terverifikasi",
    dash_quick_actions: "Aksi Cepat",
    dash_action_expense: "Pengeluaran",
    dash_action_income: "Pendapatan",
    dash_action_add_account: "Tambah Akun",
    dash_action_quick_tx: "Quick Transaksi",
    dash_action_add_new: "Tambah baru",
    dash_action_connect_new: "Hubungkan baru",
    dash_action_record_fast: "Catat cepat",
    dash_accounts_title: "Akun Terhubung",
    dash_accounts_subtitle: "akun terdaftar",
    dash_no_accounts: "Belum ada akun terhubung",
    dash_connect_account: "Hubungkan Akun",
    dash_transactions_title: "Transaksi Terbaru",
    dash_ledger_title: "Smart Ledger",
    dash_income_label: "Pemasukan",
    dash_expense_label: "Pengeluaran",
    dash_balance_label: "Saldo",
    dash_action_record: "Catat Transaksi",
    dash_unit_transactions: "transaksi",
    dash_loading: "Memuat...",

    // Avatar Condition
    cond_good_label: "Kondisi Keuangan Prima",
    cond_good_score: "Sangat Baik",
    cond_good_msg: "Finansialmu dalam kondisi sangat baik! Terus pertahankan.",
    cond_good_rec: "Alokasikan 10% pendapatan tambahanmu ke instrumen investasi agresif.",
    cond_normal_label: "On Track",
    cond_normal_score: "Cukup Baik",
    cond_normal_msg: "Finansialmu cukup baik. Masih ada ruang untuk perbaikan.",
    cond_normal_rec: "Coba kurangi pengeluaran hiburan sebesar 5% untuk dana darurat.",
    cond_bad_label: "Perlu Perbaikan",
    cond_bad_score: "Perlu Perhatian",
    cond_bad_msg: "Finansialmu membutuhkan perhatian lebih. Buat rencana perbaikan.",
    cond_bad_rec: "Fokus lunasi hutang berbunga tinggi dan tunda pengeluaran besar.",
    cond_unit_miliar: "Miliar",
    cond_unit_juta: "Juta",

    // Reports Page
    rep_title: "Laporan Keuangan",
    rep_subtitle: "Analisis mendalam aktivitas finansialmu",
    rep_total_income: "Total Pemasukan",
    rep_total_expense: "Total Pengeluaran",
    rep_net_balance: "Saldo Bersih",
    rep_tx_count: "Jumlah Transaksi",
    rep_filter_title: "Filter Laporan",
    rep_date_range: "Rentang Tanggal",
    rep_category: "Kategori",
    rep_type: "Tipe",
    rep_all_categories: "Semua Kategori",
    rep_all_types: "Semua Tipe",
    rep_income: "Pemasukan",
    rep_expense: "Pengeluaran",
    rep_preset_7d: "7 Hari",
    rep_preset_30d: "30 Hari",
    rep_preset_3m: "3 Bulan",
    rep_preset_6m: "6 Bulan",
    rep_chart_trend: "Tren Bulanan",
    rep_chart_breakdown: "Distribusi Pengeluaran",
    rep_no_data: "Tidak ada data untuk periode ini",
    rep_export_pdf: "Cetak PDF",
    rep_export_csv: "Export CSV",

    // Categories
    cat_perumahan: "Perumahan",
    cat_makanan: "Makanan",
    cat_transport: "Transport",
    cat_hiburan: "Hiburan",
    cat_kesehatan: "Kesehatan",
    cat_pendidikan: "Pendidikan",
    cat_belanja: "Belanja",
    cat_tagihan: "Tagihan",
    cat_gaji: "Gaji",
    cat_investasi: "Investasi",
    cat_freelance: "Freelance",
    cat_hadiah: "Hadiah",
    cat_lainnya: "Lainnya",
    cat_tidak_diketahui: "Tidak Diketahui",
    cat_topup_ewallet: "Top Up E-Wallet",
    cat_transfer_internal: "Transfer Internal",
    cat_transfer_keluarga: "Transfer Keluarga",
    cat_transfer_sosial: "Transfer Sosial",

    // Time
    time_today: "Hari ini",
    time_yesterday: "Kemarin",
    time_days_ago: "hari lalu",

    // Settings Page
    settings_title: "Pengaturan",
    settings_subtitle: "Kelola preferensi dan konfigurasi aplikasi",
    regional_title: "Regional",
    language_label: "Bahasa",
    language_desc: "Pilih bahasa antarmuka",
    currency_label: "Mata Uang",
    currency_desc: "Pilih mata uang utama",
    theme_title: "Tampilan",
    theme_label: "Tema",
    theme_desc: "Pilih tampilan aplikasi",
    theme_dark: "Gelap",
    theme_light: "Terang",
    notification_title: "Notifikasi",
    notif_budget: "Peringatan Budget",
    notif_budget_desc: "Notifikasi saat budget hampir habis",
    notif_debt: "Pengingat Hutang",
    notif_debt_desc: "Notifikasi jatuh tempo cicilan",
    notif_goals: "Update Target",
    notif_goals_desc: "Notifikasi progress target tabungan",
    notif_weekly: "Laporan Mingguan",
    notif_weekly_desc: "Kirim ringkasan keuangan tiap minggu",
    notif_promo: "Promo & Update",
    notif_promo_desc: "Informasi fitur baru dan promo",
    data_title: "Data",
    data_backup_title: "Backup Data",
    data_backup_desc: "Export semua data Anda dalam format JSON untuk backup.",
    danger_title: "Zona Berbahaya",
    danger_clear_data: "Bersihkan Data Lokal",
    danger_clear_data_desc: "Hapus semua data lokal dan cache. Data di server tidak akan terpengaruh.",

    // About
    about_subtitle: "AI Financial Time Machine",
    about_version: "Versi",
    about_credits: "Credits",
    about_tech_stack: "Tech Stack",

    // Auth Pages
    auth_login_title: "Selamat Datang Kembali",
    auth_login_subtitle: "Masuk untuk mengelola keuanganmu",
    auth_email_label: "Alamat Email",
    auth_password_label: "Kata Sandi",
    auth_forgot_password: "Lupa kata sandi?",
    auth_no_account: "Belum punya akun?",
    auth_register_now: "Daftar di sini",
    auth_remember_me: "Ingat saya",
    auth_login_button: "Masuk",
    auth_login_to: "Masuk ke",
    auth_register_title: "Mulai Perjalananmu",
    auth_register_subtitle: "Daftar sekarang untuk masa depan yang lebih baik",

    // Login Sidebar Stats
    login_sidebar_welcome: "Selamat Datang",
    login_sidebar_back: "Kembali",
    login_sidebar_desc: "Lanjutkan perjalanan finansialmu dan lihat bagaimana AI kami memproyeksikan masa depanmu.",
    login_stat_projections: "Proyeksi Dihasilkan",
    login_stat_nlp: "NLP Engine",
    login_stat_accuracy: "Akurasi Model",
    login_stat_encryption: "Enkripsi",

    // Confirmations
    conf_delete_account: "Yakin ingin menghapus akun ini?",
    msg_account_deleted: "Akun berhasil dihapus",
    dash_filter_all: "Semua",
    dash_filter_income: "Masuk",
    dash_filter_expense: "Keluar",
    dash_filter_need_label: "Perlu Label",
    dash_analysis_title: "Analisis AI",
    dash_scenario_title: "Simulator Apa-Jika",
    dash_scenario_desc: "Simulasikan keputusan finansialmu",
    dash_scenario_input: "Input Skenario",
    dash_scenario_input_desc: "Masukkan detail pembelian Anda",
    dash_scenario_price: "Harga Barang",
    dash_scenario_method: "Metode Pembayaran",
    dash_scenario_cash: "Tunai",
    dash_scenario_paylater: "PayLater",
    dash_scenario_tenor: "Tenor Cicilan (bulan)",
    dash_scenario_interest: "Bunga (% / bulan)",
    dash_scenario_btn: "Analisis Sekarang",
    dash_scenario_analyzing: "Menganalisis...",
  },
  en: {
    // Navbar & Layout
    nav_home: "Home",
    nav_dashboard: "Dashboard",
    nav_reports: "Reports",
    nav_investment: "Investment",
    nav_recurring: "Recurring",
    nav_profile: "Profile",
    nav_dash_short: "Dash",
    nav_settings: "Settings",
    nav_logout: "Logout",
    nav_login: "Login",
    nav_register: "Register",
    nav_help_tooltip: "Help & Guide",
    nav_notif_tooltip: "Notifications",

    // Landing Page Nav
    nav_landing_timeline: "Timeline",
    nav_landing_features: "Features",
    nav_landing_how: "How it Works",
    nav_launch_app: "Launch App",

    // Sidebar Menu
    menu_title: "Menu",
    menu_general: "General",
    menu_notifications: "Notifications",
    menu_data: "Data",
    menu_about: "About",

    // Common Buttons
    btn_save: "Save",
    btn_cancel: "Cancel",
    btn_edit: "Edit",
    btn_delete: "Delete",
    btn_add: "Add",
    btn_loading: "Processing...",
    btn_next: "Next",
    btn_back: "Back",
    btn_show_less: "Show Less",
    btn_see_all: "See All",
    btn_clear: "Clear Local Data",
    btn_backup: "Export Data",
    btn_download: "Download",

    // Dashboard
    dash_welcome: "Welcome",
    dash_total_balance: "Total Balance",
    dash_projected_wealth: "Projected Wealth",
    dash_pension_survival: "Pension Survival",
    dash_pension_years: "Years",
    dash_status_account: "Account Status",
    dash_status_verified: "Verified",
    dash_quick_actions: "Quick Actions",
    dash_action_expense: "Expense",
    dash_action_income: "Income",
    dash_action_add_account: "Add Account",
    dash_action_quick_tx: "Quick Transaction",
    dash_action_add_new: "Add new",
    dash_action_connect_new: "Connect new",
    dash_action_record_fast: "Record fast",
    dash_accounts_title: "Linked Accounts",
    dash_accounts_subtitle: "accounts registered",
    dash_no_accounts: "No accounts linked yet",
    dash_connect_account: "Connect Account",
    dash_transactions_title: "Recent Transactions",
    dash_ledger_title: "Smart Ledger",
    dash_income_label: "Income",
    dash_expense_label: "Expense",
    dash_balance_label: "Balance",
    dash_action_record: "Record Transaction",
    dash_unit_transactions: "transactions",
    dash_loading: "Loading...",

    // Avatar Condition
    cond_good_label: "Prime Financial Condition",
    cond_good_score: "Excellent",
    cond_good_msg: "Your financials are in great shape! Keep it up.",
    cond_good_rec: "Allocate 10% of your extra income to aggressive investment instruments.",
    cond_normal_label: "On Track",
    cond_normal_score: "Good Enough",
    cond_normal_msg: "Your financials are doing well. Still room for improvement.",
    cond_normal_rec: "Try reducing entertainment spending by 5% for your emergency fund.",
    cond_bad_label: "Needs Improvement",
    cond_bad_score: "Needs Attention",
    cond_bad_msg: "Your financials need more attention. Create an improvement plan.",
    cond_bad_rec: "Focus on paying off high-interest debt and postpone large expenses.",
    cond_unit_miliar: "Billion",
    cond_unit_juta: "Million",

    // Reports Page
    rep_title: "Financial Reports",
    rep_subtitle: "In-depth analysis of your financial activities",
    rep_total_income: "Total Income",
    rep_total_expense: "Total Expense",
    rep_net_balance: "Net Balance",
    rep_tx_count: "Transaction Count",
    rep_filter_title: "Report Filter",
    rep_date_range: "Date Range",
    rep_category: "Category",
    rep_type: "Type",
    rep_all_categories: "All Categories",
    rep_all_types: "All Types",
    rep_income: "Income",
    rep_expense: "Expense",
    rep_preset_7d: "7 Days",
    rep_preset_30d: "30 Days",
    rep_preset_3m: "3 Months",
    rep_preset_6m: "6 Months",
    rep_chart_trend: "Monthly Trend",
    rep_chart_breakdown: "Spending Breakdown",
    rep_no_data: "No data available for this period",
    rep_export_pdf: "Print PDF",
    rep_export_csv: "Export CSV",

    // Categories
    cat_perumahan: "Housing",
    cat_makanan: "Food",
    cat_transport: "Transport",
    cat_hiburan: "Entertainment",
    cat_kesehatan: "Health",
    cat_pendidikan: "Education",
    cat_belanja: "Shopping",
    cat_tagihan: "Bills",
    cat_gaji: "Salary",
    cat_investasi: "Investment",
    cat_freelance: "Freelance",
    cat_hadiah: "Gift",
    cat_lainnya: "Others",
    cat_tidak_diketahui: "Unknown",
    cat_topup_ewallet: "Top Up E-Wallet",
    cat_transfer_internal: "Internal Transfer",
    cat_transfer_keluarga: "Family Transfer",
    cat_transfer_sosial: "Social Transfer",

    // Time
    time_today: "Today",
    time_yesterday: "Yesterday",
    time_days_ago: "days ago",

    // Settings Page
    settings_title: "Settings",
    settings_subtitle: "Manage your application preferences and configuration",
    regional_title: "Regional",
    language_label: "Language",
    language_desc: "Choose interface language",
    currency_label: "Currency",
    currency_desc: "Choose primary currency",
    theme_title: "Appearance",
    theme_label: "Theme",
    theme_desc: "Choose application appearance",
    theme_dark: "Dark",
    theme_light: "Light",
    notification_title: "Notifications",
    notif_budget: "Budget Alerts",
    notif_budget_desc: "Notify me when budget is near limit",
    notif_debt: "Debt Reminders",
    notif_debt_desc: "Remind me of upcoming debt due dates",
    notif_goals: "Goal Updates",
    notif_goals_desc: "Update my financial goal progress",
    notif_weekly: "Weekly Report",
    notif_weekly_desc: "Send weekly transaction summary",
    notif_promo: "Promos & Info",
    notif_promo_desc: "New features and offers information",
    data_title: "Data",
    data_backup_title: "Data Backup",
    data_backup_desc: "Export all your data in JSON format for backup.",
    danger_title: "Danger Zone",
    danger_clear_data: "Clear Local Data",
    danger_clear_data_desc: "Clear all local data and cache. Server data will not be affected.",

    // About
    about_subtitle: "AI Financial Time Machine",
    about_version: "Version",
    about_credits: "Credits",
    about_tech_stack: "Tech Stack",

    // Auth Pages
    auth_login_title: "Welcome Back",
    auth_login_subtitle: "Login to manage your finances",
    auth_email_label: "Email Address",
    auth_password_label: "Password",
    auth_forgot_password: "Forgot password?",
    auth_no_account: "Don't have an account?",
    auth_register_now: "Register here",
    auth_remember_me: "Remember me",
    auth_login_button: "Login",
    auth_login_to: "Login to",
    auth_register_title: "Start Your Journey",
    auth_register_subtitle: "Register now for a better future",

    // Login Sidebar Stats
    login_sidebar_welcome: "Welcome",
    login_sidebar_back: "Back",
    login_sidebar_desc: "Continue your financial journey and see how our AI projects your future.",
    login_stat_projections: "Projections Generated",
    login_stat_nlp: "NLP Engine",
    login_stat_accuracy: "Model Accuracy",
    login_stat_encryption: "Encryption",

    // Confirmations
    conf_delete_account: "Are you sure you want to delete this account?",
    msg_account_deleted: "Account deleted successfully",
    dash_filter_all: "All",
    dash_filter_income: "Income",
    dash_filter_expense: "Expense",
    dash_filter_need_label: "Needs Label",
    dash_analysis_title: "AI Analysis",
    dash_scenario_title: "What-If Simulator",
    dash_scenario_desc: "Simulate your financial decisions",
    dash_scenario_input: "Input Scenario",
    dash_scenario_input_desc: "Enter your purchase details",
    dash_scenario_price: "Item Price",
    dash_scenario_method: "Payment Method",
    dash_scenario_cash: "Cash",
    dash_scenario_paylater: "PayLater",
    dash_scenario_tenor: "Installment Term (months)",
    dash_scenario_interest: "Interest (% / month)",
    dash_scenario_btn: "Analyze Now",
    dash_scenario_analyzing: "Analyzing...",
  }
};

const LanguageContext = createContext();

export const useLanguage = () => {
  return useContext(LanguageContext);
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(
    localStorage.getItem('fintime_language') || 'id'
  );

  useEffect(() => {
    localStorage.setItem('fintime_language', language);
  }, [language]);

  const changeLanguage = (langCode) => {
    setLanguage(langCode);
  };

  const t = (key) => {
    if (translations[language] && translations[language][key]) {
      return translations[language][key];
    }
    // Fallback to indonesian if key not found
    if (translations['id'] && translations['id'][key]) {
      return translations['id'][key];
    }
    return key; // return key as fallback
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
