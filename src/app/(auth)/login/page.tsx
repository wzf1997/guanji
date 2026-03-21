"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { Phone, Shield, ChevronRight, Sparkles, CheckCircle2 } from "lucide-react";
import { signIn } from "next-auth/react";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
type Step = "phone" | "code" | "done";

interface FormState {
  phone: string;
  code: string;
}

interface FormErrors {
  phone?: string;
  code?: string;
  general?: string;
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
const isValidPhone = (v: string) => /^1[3-9]\d{9}$/.test(v);
const isValidCode  = (v: string) => /^\d{6}$/.test(v);

const COUNTDOWN_SECONDS = 60;

// ─────────────────────────────────────────────
// Decorative Background (matches Hero style)
// ─────────────────────────────────────────────
function LoginBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <div className="absolute inset-0 bg-gradient-to-br from-[#0d0b1e] via-[#130f2e] to-[#0d0b1e]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_20%,rgba(87,73,244,0.18),transparent)]" />
      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-[#5749F4]/8 blur-3xl" />
      <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-[#7C3AED]/8 blur-3xl" />

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Stars */}
      {[
        { top: "8%",  left: "10%", size: 2 },
        { top: "20%", left: "25%", size: 1.5 },
        { top: "5%",  left: "65%", size: 2 },
        { top: "35%", left: "88%", size: 1.5 },
        { top: "70%", left: "15%", size: 2 },
        { top: "80%", left: "75%", size: 1.5 },
        { top: "55%", left: "5%",  size: 2.5 },
        { top: "15%", left: "80%", size: 2 },
      ].map((s, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            top: s.top, left: s.left,
            width: s.size, height: s.size,
            opacity: 0.35 + (i % 3) * 0.12,
            boxShadow: `0 0 ${s.size * 4}px rgba(255,255,255,0.5)`,
          }}
        />
      ))}

      {/* Bagua ring decoration */}
      <div className="absolute left-[5%] top-[30%] opacity-[0.04]">
        <svg width="240" height="240" viewBox="0 0 240 240" fill="none">
          <circle cx="120" cy="120" r="115" stroke="white" strokeWidth="1" strokeDasharray="5 4" />
          <circle cx="120" cy="120" r="80"  stroke="white" strokeWidth="0.5" />
          <circle cx="120" cy="120" r="45"  stroke="white" strokeWidth="0.5" />
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (i * 45 * Math.PI) / 180;
            return (
              <line
                key={i}
                x1={120 + 85 * Math.sin(a)} y1={120 - 85 * Math.cos(a)}
                x2={120 + 115 * Math.sin(a)} y2={120 - 115 * Math.cos(a)}
                stroke="white" strokeWidth="1"
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────
export default function LoginPage() {
  const [step, setStep]               = useState<Step>("phone");
  const [form, setForm]               = useState<FormState>({ phone: "", code: "" });
  const [errors, setErrors]           = useState<FormErrors>({});
  const [countdown, setCountdown]     = useState(0);
  const [isLoading, setIsLoading]     = useState(false);
  const countdownRef                  = useRef<ReturnType<typeof setInterval> | null>(null);

  // Cleanup on unmount
  useEffect(() => () => { if (countdownRef.current) clearInterval(countdownRef.current); }, []);

  const startCountdown = useCallback(() => {
    setCountdown(COUNTDOWN_SECONDS);
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const handlePhoneChange = (val: string) => {
    const cleaned = val.replace(/\D/g, "").slice(0, 11);
    setForm((f) => ({ ...f, phone: cleaned }));
    if (errors.phone) setErrors((e) => ({ ...e, phone: undefined }));
  };

  const handleCodeChange = (val: string) => {
    const cleaned = val.replace(/\D/g, "").slice(0, 6);
    setForm((f) => ({ ...f, code: cleaned }));
    if (errors.code) setErrors((e) => ({ ...e, code: undefined }));
  };

  const handleSendCode = async () => {
    if (!isValidPhone(form.phone)) {
      setErrors({ phone: "请输入正确的11位手机号" });
      return;
    }
    setIsLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 800));
    setIsLoading(false);
    startCountdown();
    setStep("code");
  };

  const handleLogin = async () => {
    const newErrors: FormErrors = {};
    if (!isValidPhone(form.phone)) newErrors.phone = "请输入正确的11位手机号";
    if (!isValidCode(form.code))   newErrors.code  = "请输入6位验证码";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setIsLoading(true);
    // Simulate API
    await new Promise((r) => setTimeout(r, 1200));
    setIsLoading(false);
    setStep("done");
  };

  // ── Render helpers ──

  const renderPhoneInput = () => (
    <div className="space-y-3">
      <div className={`flex items-center gap-3 rounded-2xl border ${errors.phone ? "border-red-500/50 bg-red-500/5" : "border-white/10 bg-white/5"} px-4 py-3.5 transition-colors focus-within:border-[#5749F4]/50 focus-within:bg-[#5749F4]/5`}>
        <Phone className="h-4 w-4 shrink-0 text-white/30" />
        <span className="text-white/50 text-sm select-none">+86</span>
        <div className="h-4 w-px bg-white/15 shrink-0" />
        <input
          type="tel"
          inputMode="numeric"
          placeholder="请输入手机号"
          value={form.phone}
          onChange={(e) => handlePhoneChange(e.target.value)}
          className="flex-1 bg-transparent text-sm text-white placeholder:text-white/30 outline-none"
          maxLength={11}
        />
      </div>
      {errors.phone && (
        <p className="text-xs text-red-400 pl-1">{errors.phone}</p>
      )}
    </div>
  );

  const renderCodeInput = () => (
    <div className="space-y-3">
      {/* Phone (read-only with edit option) */}
      <div className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/3 px-4 py-3">
        <div className="flex items-center gap-2 text-sm text-white/50">
          <Phone className="h-3.5 w-3.5" />
          <span>+86 {form.phone}</span>
        </div>
        <button
          onClick={() => { setStep("phone"); setForm((f) => ({ ...f, code: "" })); setErrors({}); }}
          className="text-xs text-[#8B7CF6] hover:text-white transition-colors"
        >
          修改
        </button>
      </div>

      {/* Code input row */}
      <div className="flex gap-3">
        <div
          className={`flex flex-1 items-center gap-3 rounded-2xl border ${
            errors.code ? "border-red-500/50 bg-red-500/5" : "border-white/10 bg-white/5"
          } px-4 py-3.5 transition-colors focus-within:border-[#5749F4]/50 focus-within:bg-[#5749F4]/5`}
        >
          <Shield className="h-4 w-4 shrink-0 text-white/30" />
          <input
            type="tel"
            inputMode="numeric"
            placeholder="6位验证码"
            value={form.code}
            onChange={(e) => handleCodeChange(e.target.value)}
            className="flex-1 bg-transparent text-sm text-white placeholder:text-white/30 outline-none tracking-widest"
            maxLength={6}
          />
        </div>

        {/* Resend button */}
        <button
          onClick={countdown === 0 ? handleSendCode : undefined}
          disabled={countdown > 0 || isLoading}
          className={`shrink-0 rounded-2xl px-4 py-3.5 text-sm font-medium transition-all duration-200 whitespace-nowrap border ${
            countdown > 0
              ? "border-white/8 bg-white/3 text-white/30 cursor-not-allowed"
              : "border-[#5749F4]/40 bg-[#5749F4]/10 text-[#8B7CF6] hover:bg-[#5749F4]/20"
          }`}
        >
          {countdown > 0 ? `${countdown}s` : "重新发送"}
        </button>
      </div>

      {errors.code && (
        <p className="text-xs text-red-400 pl-1">{errors.code}</p>
      )}

      <p className="text-xs text-white/30 pl-1">
        验证码已发送至 +86 {form.phone}，有效期 5 分钟
      </p>
    </div>
  );

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <LoginBackground />

      <div className="relative z-10 w-full max-w-sm">
        {/* ── Logo ── */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#5749F4] to-[#8B7CF6] shadow-xl shadow-[#5749F4]/30">
            <span className="font-serif text-3xl font-bold text-white leading-none">观</span>
          </div>
          <h1 className="font-serif text-2xl font-semibold text-white tracking-widest mb-1">
            观己
          </h1>
          <p className="text-sm text-white/40 tracking-wider">观己知序，安住当下</p>
        </div>

        {/* ── Card ── */}
        <div className="rounded-3xl border border-white/10 bg-[#13102a]/80 backdrop-blur-xl p-8">

          {step === "done" ? (
            /* ── Success state ── */
            <div className="text-center py-6">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-500/25">
                <CheckCircle2 className="h-7 w-7 text-emerald-400" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">登录成功</h2>
              <p className="text-sm text-white/50 mb-6">欢迎回来，正在为你加载专属运势…</p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#5749F4] to-[#7C3AED] px-6 py-3 text-sm font-semibold text-white"
              >
                <Sparkles className="h-4 w-4" />
                进入观己
              </Link>
            </div>
          ) : (
            <>
              {/* ── Title ── */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-white mb-1">
                  {step === "phone" ? "登录 / 注册" : "输入验证码"}
                </h2>
                <p className="text-sm text-white/40">
                  {step === "phone"
                    ? "未注册的手机号将自动创建账号"
                    : "请查收短信验证码"}
                </p>
              </div>

              {/* ── OAuth 登录 ── */}
              <div className="space-y-3 mb-6">
                <button
                  onClick={() => signIn("github", { callbackUrl: "/" })}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition text-sm font-medium"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  使用 GitHub 登录
                </button>
                <button
                  onClick={() => signIn("google", { callbackUrl: "/" })}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition text-sm font-medium"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  使用 Google 登录
                </button>
              </div>

              {/* ── 分隔线 ── */}
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 bg-[#13102a] text-white/40">或使用手机号登录</span>
                </div>
              </div>

              {/* ── Form ── */}
              <div className="space-y-4 mb-6">
                {step === "phone" ? renderPhoneInput() : renderCodeInput()}

                {/* Submit button */}
                <button
                  onClick={step === "phone" ? handleSendCode : handleLogin}
                  disabled={isLoading || (step === "phone" && form.phone.length < 11)}
                  className="w-full rounded-2xl bg-gradient-to-r from-[#5749F4] to-[#7C3AED] py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#5749F4]/25 transition-all duration-300 hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                  ) : null}
                  {isLoading
                    ? step === "phone" ? "发送中…" : "验证中…"
                    : step === "phone" ? "获取验证码" : "登录 / 注册"}
                </button>
              </div>

              {/* ── Guest entry ── */}
              <div className="mb-6 text-center">
                <Link
                  href="/"
                  className="inline-flex items-center gap-1 text-sm text-white/40 hover:text-white/70 transition-colors"
                >
                  先体验再注册
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {/* ── Compliance ── */}
              <p className="text-center text-xs text-white/25 leading-relaxed">
                登录即同意{" "}
                <Link href="/terms" className="text-[#8B7CF6] hover:underline">
                  《用户协议》
                </Link>
                {" "}与{" "}
                <Link href="/privacy" className="text-[#8B7CF6] hover:underline">
                  《隐私政策》
                </Link>
              </p>
            </>
          )}
        </div>

        {/* ── Features reminder ── */}
        <div className="mt-6 flex justify-center gap-6 text-xs text-white/25">
          <span>八字排盘</span>
          <span className="text-white/10">·</span>
          <span>AI命理师</span>
          <span className="text-white/10">·</span>
          <span>每日运势</span>
        </div>
      </div>
    </div>
  );
}
