// ============================================================
// REGISTER PAGE
// Halaman pendaftaran akun FinTime
// ============================================================
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronLeft, ArrowRight, Loader2 } from "lucide-react";
import api from "../lib/api";
import { useNavigate } from "react-router-dom";
import ParticleField from "../components/Particlefield";
import {
  StepCheckpoint,
  StepPersonal,
  StepContact,
  StepFinancial,
  StepBankEWallet,
  StepPensiun,
  RegisterSuccess,
  RegisterLeftPanel,
  STEPS,
  INITIAL_FORM_DATA,
} from "../components/register";

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function RegisterPage() {
  // ─── State ───────────────────────────────────────────────
  const [currentStep, setCurrentStep] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  // ─── Validasi step ────────────────────────────────────────
  const canNext = () => {
    if (currentStep === 0) {
      return (
        formData.fullName &&
        formData.gender &&
        formData.birthDate &&
        formData.occupation
      );
    }
    if (currentStep === 1) {
      return (
        formData.email &&
        formData.phone &&
        formData.password &&
        formData.confirmPassword &&
        formData.password === formData.confirmPassword
      );
    }
    if (currentStep === 2) {
      return !!formData.monthlyIncome;
    }
    return true;
  };

  // ─── Navigasi step ────────────────────────────────────────
  const navigate = useNavigate();
  const handleNext = async () => {
    if (!canNext()) return;

    if (currentStep < STEPS.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      setIsSuccess(true);

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);

      try {
        const payload = {
          fullName: formData.fullName,
          gender: formData.gender,
          birthDate: formData.birthDate,
          occupation: formData.occupation,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          monthlyIncome: formData.monthlyIncome,
          linkedAccounts: formData.linkedAccounts,
          retirementAge: Number(formData.retirementAge),
        };

        const response = await api.post("/auth/register", payload);

        const data = response.data;

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        setIsSuccess(true);
      } catch (error) {
        alert(error.response?.data?.message || "Register failed");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  };

  // ─── Progress calculation ─────────────────────────────────
  const progressPct = (currentStep / (STEPS.length - 1)) * 100;

  // ─── Render ───────────────────────────────────────────────
  return (
    <div
      className="relative min-h-screen flex overflow-hidden"
      style={{ background: "var(--dark)" }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <ParticleField count={40} />
      </div>

      <RegisterLeftPanel />

      <div
        className="flex-1 flex flex-col justify-center relative z-10"
        style={{ padding: "clamp(2rem, 5vw, 4rem)" }}
      >
        <Link
          to="/"
          className="absolute top-6 right-6 flex items-center gap-1.5 text-sm font-semibold no-underline"
          style={{ color: "var(--text-muted)", fontFamily: "Sora, sans-serif" }}
        >
          <ChevronLeft size={14} /> Kembali
        </Link>

        <div className="w-full max-w-md mx-auto">
          {!isSuccess && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <span
                  className="text-xs font-mono font-bold tracking-widest"
                  style={{ color: "var(--text-dim)" }}
                >
                  {Math.round(progressPct)}% COMPLETE
                </span>
                <span
                  className="text-xs font-mono"
                  style={{ color: "var(--text-dim)" }}
                >
                  {currentStep + 1} / {STEPS.length}
                </span>
              </div>
              <div
                className="h-0.5 rounded-full overflow-hidden"
                style={{ background: "rgba(0,245,255,0.1)" }}
              >
                <motion.div
                  className="h-full rounded-full"
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 0.45 }}
                  style={{
                    background: "linear-gradient(90deg, #0096c7, #00f5ff)",
                    boxShadow: "0 0 8px rgba(0,245,255,0.5)",
                  }}
                />
              </div>
              <div className="flex justify-between mt-4">
                {STEPS.map((_, i) => (
                  <StepCheckpoint key={i} step={i} current={currentStep} />
                ))}
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            {isSuccess ? (
              <RegisterSuccess key="success" data={formData} />
            ) : (
              <>
                {currentStep === 0 && (
                  <StepPersonal data={formData} setData={setFormData} />
                )}
                {currentStep === 1 && (
                  <StepContact data={formData} setData={setFormData} />
                )}
                {currentStep === 2 && (
                  <StepFinancial data={formData} setData={setFormData} />
                )}
                {currentStep === 3 && (
                  <StepBankEWallet data={formData} setData={setFormData} />
                )}
                {currentStep === 4 && (
                  <StepPensiun data={formData} setData={setFormData} />
                )}
              </>
            )}
          </AnimatePresence>

          {!isSuccess && (
            <div className="flex items-center justify-between mt-8">
              <button
                onClick={handleBack}
                className="btn-ghost text-sm font-bold px-6 py-3"
                style={{ visibility: currentStep > 0 ? "visible" : "hidden" }}
              >
                <ChevronLeft size={14} className="inline mr-1" /> Kembali
              </button>

              <motion.button
                whileHover={{ scale: canNext() && !isLoading ? 1.04 : 1 }}
                whileTap={{ scale: canNext() && !isLoading ? 0.97 : 1 }}
                onClick={handleNext}
                disabled={!canNext() || isLoading}
                className="btn-primary flex items-center gap-2 px-7 py-3 text-sm font-extrabold rounded-full"
                style={{
                  opacity: canNext() && !isLoading ? 1 : 0.4,
                  cursor: canNext() && !isLoading ? "pointer" : "not-allowed",
                }}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Memproses...</span>
                  </>
                ) : (
                  <>
                    {currentStep === 4 ? "Buat Akun" : "Lanjut"}
                    <ArrowRight size={14} />
                  </>
                )}
              </motion.button>
            </div>
          )}

          {!isSuccess && (
            <p
              className="text-center text-xs mt-6"
              style={{ color: "var(--text-dim)" }}
            >
              Sudah punya akun?{" "}
              <Link
                to="/login"
                className="font-bold no-underline"
                style={{ color: "#00f5ff" }}
              >
                Masuk di sini
              </Link>
            </p>
          )}

          {isSuccess && (
            <div className="flex flex-col gap-3 mt-6">
              <Link
                to="/"
                className="btn-primary flex items-center justify-center gap-2 px-6 py-3 text-sm font-extrabold rounded-full no-underline"
              >
                Mulai Perjalanan Finansialmu <ArrowRight size={14} />
              </Link>
              <Link
                to="/login"
                className="btn-ghost flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold rounded-full no-underline"
              >
                Masuk ke Akun
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
