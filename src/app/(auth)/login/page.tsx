"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import { Eye, EyeOff, User, Lock } from "lucide-react";
import StarField from "@/components/layout/StarField";

function LoginBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <div className="absolute inset-0 bg-gradient-to-br from-[#0d0b1e] via-[#130f2e] to-[#0d0b1e]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_20%,rgba(87,73,244,0.18),transparent)]" />
      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-[#5749F4]/8 blur-3xl" />
      <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-[#7C3AED]/8 blur-3xl" />
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="opacity-50 sm:opacity-100">
        <StarField />
      </div>

      <div
        className="hidden sm:block absolute right-[2%] top-[12%] w-[500px] h-[500px] rounded-full animate-pulse-glow pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(87,73,244,0.18) 0%, rgba(87,73,244,0.06) 50%, transparent 70%)',
          filter: 'blur(24px)',
        }}
      />

      <div
        className="hidden sm:block absolute right-[2%] top-[12%] opacity-[0.35] animate-rotate-slow"
        style={{ filter: 'drop-shadow(0 0 16px rgba(139,124,246,0.9)) drop-shadow(0 0 40px rgba(87,73,244,0.5))' }}
      >
        <svg viewBox="0 0 320 320" fill="none" className="w-[500px] h-[500px]">
          <circle cx="160" cy="160" r="155" stroke="white" strokeWidth="1.5" strokeDasharray="6 4" />
          <circle cx="160" cy="160" r="110" stroke="white" strokeWidth="1" />
          <circle cx="160" cy="160" r="65"  stroke="white" strokeWidth="1" />
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i * 45 * Math.PI) / 180;
            const r1 = 120, r2 = 155;
            const x1 = 160 + r1 * Math.sin(angle), y1 = 160 - r1 * Math.cos(angle);
            const x2 = 160 + r2 * Math.sin(angle), y2 = 160 - r2 * Math.cos(angle);
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="white" strokeWidth="1.5" />;
          })}
          <circle cx="160" cy="160" r="28" fill="none" stroke="white" strokeWidth="1" />
          <circle cx="160" cy="146" r="8" fill="white" fillOpacity="0.7" />
          <circle cx="160" cy="174" r="8" fill="none" stroke="white" strokeWidth="1" />
        </svg>
      </div>

      <div className="absolute left-[4%] bottom-[15%] opacity-[0.10] flex flex-col gap-3 hidden sm:flex" style={{ filter: 'drop-shadow(0 0 4px rgba(139,124,246,0.5))' }}>
        {["full", "full", "broken", "full", "broken", "broken"].map((t, i) => (
          <div key={i} className="flex gap-2">
            {t === "full" ? (
              <div className="h-px w-10 bg-white" />
            ) : (
              <>
                <div className="h-px w-4 bg-white" />
                <div className="h-px w-4 bg-white" />
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const callbackUrl = searchParams.get("callbackUrl") || "/bazi";
  const error = searchParams.get("error");

  const [mode, setMode] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    setLoading(true);

    try {
      if (mode === "register") {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });
        const data = await res.json();
        if (!res.ok) {
          setFormError(data.error?.message || "注册失败");
          return;
        }
        setFormSuccess("注册成功！正在登录...");
        const result = await signIn("credentials", {
          username, password, redirect: false,
        });
        if (result?.error) {
          setFormError("注册成功但登录失败，请手动登录");
        } else {
          window.location.href = callbackUrl;
        }
      } else {
        const result = await signIn("credentials", {
          username, password, redirect: false,
        });
        if (result?.error) {
          setFormError("用户名或密码错误");
        } else {
          window.location.href = callbackUrl;
        }
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative z-10 w-full max-w-sm">
      {/* Logo + 移动端轮盘 */}
      <div className="relative mb-6 text-center">
        <div className="sm:hidden absolute left-1/2 top-1/2 -translate-x-1/2 pointer-events-none" style={{ '--tw-translate-y': '-70%' } as React.CSSProperties}>
          <div className="animate-pulse-glow absolute inset-0 rounded-full" style={{ background: 'radial-gradient(circle, rgba(87,73,244,0.15) 0%, transparent 70%)', filter: 'blur(16px)' }} />
          <div className="opacity-[0.20] animate-rotate-slow" style={{ filter: 'drop-shadow(0 0 12px rgba(139,124,246,0.8))' }}>
            <svg viewBox="0 0 320 320" fill="none" className="w-[160px] h-[160px]">
              <circle cx="160" cy="160" r="155" stroke="white" strokeWidth="1.5" strokeDasharray="6 4" />
              <circle cx="160" cy="160" r="110" stroke="white" strokeWidth="1" />
              <circle cx="160" cy="160" r="65" stroke="white" strokeWidth="1" />
              {Array.from({ length: 8 }).map((_, i) => {
                const angle = (i * 45 * Math.PI) / 180;
                const r1 = 120, r2 = 155;
                const x1 = 160 + r1 * Math.sin(angle), y1 = 160 - r1 * Math.cos(angle);
                const x2 = 160 + r2 * Math.sin(angle), y2 = 160 - r2 * Math.cos(angle);
                return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="white" strokeWidth="1.5" />;
              })}
              <circle cx="160" cy="160" r="28" fill="none" stroke="white" strokeWidth="1" />
              <circle cx="160" cy="146" r="8" fill="white" fillOpacity="0.7" />
              <circle cx="160" cy="174" r="8" fill="none" stroke="white" strokeWidth="1" />
            </svg>
          </div>
        </div>
        <div className="relative z-10">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#5749F4] to-[#8B7CF6] shadow-xl shadow-[#5749F4]/30">
            <span className="font-serif text-3xl font-bold text-white leading-none">观</span>
          </div>
          <h1 className="font-serif text-2xl font-semibold text-white tracking-widest mb-1">观己</h1>
          <p className="text-sm text-white/40 tracking-wider">观己知序，安住当下</p>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-[#13102a]/80 backdrop-blur-xl p-8">
        {/* OAuth 错误 */}
        {error && (
          <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error === "OAuthCallback" ? "登录回调失败，请重试" : `登录失败: ${error}`}
          </div>
        )}

        {/* 标题 + 模式切换 */}
        <div className="mb-6">
          <div className="flex rounded-xl bg-white/5 p-1 mb-4">
            <button
              onClick={() => { setMode("login"); setFormError(""); }}
              className={`flex-1 rounded-lg py-2 text-sm font-medium transition ${
                mode === "login"
                  ? "bg-[#5749F4] text-white shadow"
                  : "text-white/50 hover:text-white/80"
              }`}
            >
              登录
            </button>
            <button
              onClick={() => { setMode("register"); setFormError(""); }}
              className={`flex-1 rounded-lg py-2 text-sm font-medium transition ${
                mode === "register"
                  ? "bg-[#5749F4] text-white shadow"
                  : "text-white/50 hover:text-white/80"
              }`}
            >
              注册
            </button>
          </div>
        </div>

        {/* 表单 */}
        <form onSubmit={handleSubmit} className="space-y-3 mb-5">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder={mode === "register" ? "用户名（2-20位，字母/数字/中文）" : "用户名"}
              required
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 text-sm focus:outline-none focus:border-[#5749F4]/60 focus:bg-white/8 transition"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder={mode === "register" ? "密码（至少 6 位）" : "密码"}
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full pl-10 pr-10 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 text-sm focus:outline-none focus:border-[#5749F4]/60 focus:bg-white/8 transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* 错误 / 成功提示 */}
          {formError && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm text-red-300">
              {formError}
            </div>
          )}
          {formSuccess && (
            <div className="rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-2.5 text-sm text-green-300">
              {formSuccess}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#5749F4] to-[#7C3AED] text-white text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#5749F4]/25"
          >
            {loading ? "处理中..." : mode === "login" ? "登录" : "注册"}
          </button>
        </form>

        {/* 分割线 */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-xs text-white/25">或</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* OAuth */}
        <div className="space-y-3 mb-6">
          <button
            onClick={() => { if (loading) return; setLoading(true); signIn("github", { callbackUrl }); }}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition text-sm font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            {loading ? "跳转中..." : "使用 GitHub 登录"}
          </button>
        </div>

        <p className="text-center text-xs text-white/25 leading-relaxed">
          登录即同意{" "}
          <Link href="/terms" className="text-[#8B7CF6] hover:underline">《用户协议》</Link>
          {" "}与{" "}
          <Link href="/privacy" className="text-[#8B7CF6] hover:underline">《隐私政策》</Link>
        </p>
      </div>

      <div className="mt-6 flex justify-center gap-6 text-xs text-white/25">
        <span>八字排盘</span>
        <span className="text-white/10">·</span>
        <span>AI命理师</span>
        <span className="text-white/10">·</span>
        <span>每日运势</span>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start px-4 pt-[8vh] pb-8 sm:justify-center sm:pt-0 sm:py-12">
      <LoginBackground />
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
