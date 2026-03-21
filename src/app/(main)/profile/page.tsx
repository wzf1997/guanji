import type { Metadata } from "next";
import Link from "next/link";
import { User, BookOpen, MessageCircle, Star, LogIn } from "lucide-react";

export const metadata: Metadata = {
  title: "个人档案",
  description: "查看和管理你的命盘档案、历史对话及个人信息。",
};

export default function ProfilePage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-[var(--radius-m)] mb-4" style={{ background: "rgba(87,73,244,0.12)" }}>
          <User size={24} style={{ color: "var(--primary)" }} aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-bold text-[var(--foreground)] mb-1">个人档案</h1>
        <p className="text-sm text-[var(--muted-foreground)]">管理你的命盘、对话与账户</p>
      </div>

      {/* Login prompt */}
      <div className="guanji-card p-8 text-center mb-6">
        <p className="text-[var(--muted-foreground)] text-sm mb-4">登录后查看个人档案</p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-[var(--radius-pill)] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          style={{ background: "var(--primary)" }}
        >
          <LogIn size={15} aria-hidden="true" />
          立即登录
        </Link>
      </div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { icon: BookOpen, label: "命盘数量", value: "—" },
          { icon: MessageCircle, label: "对话次数", value: "—" },
          { icon: Star, label: "运势查询", value: "—" },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="guanji-card p-4 text-center">
            <Icon size={18} className="mx-auto mb-2" style={{ color: "var(--primary)" }} aria-hidden="true" />
            <p className="text-lg font-bold text-[var(--foreground)]">{value}</p>
            <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
