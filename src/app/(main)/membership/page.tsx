import type { Metadata } from "next";
import { Crown, Check } from "lucide-react";

export const metadata: Metadata = {
  title: "会员中心",
  description: "升级观己会员，解锁无限 AI 对话、专属命盘分析等高级功能。",
};

const PLANS = [
  {
    tier: "basic" as const,
    name: "基础版",
    price: 19,
    originalPrice: 39,
    features: [
      "每日 20 次 AI 对话",
      "无限次八字排盘",
      "每日专属运势报告",
      "命盘历史保存（20 个）",
    ],
    highlighted: false,
    buttonLabel: "选择基础版",
  },
  {
    tier: "pro" as const,
    name: "专业版",
    price: 49,
    originalPrice: 99,
    features: [
      "无限次 AI 对话",
      "无限次八字排盘",
      "深度运势分析报告",
      "命盘历史无限保存",
      "优先客服支持",
      "专属会员徽章",
    ],
    highlighted: true,
    buttonLabel: "选择专业版",
  },
];

export default function MembershipPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-[var(--radius-m)] mb-4" style={{ background: "rgba(201,168,76,0.15)" }}>
          <Crown size={24} style={{ color: "var(--gold)" }} aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-bold text-[var(--foreground)] mb-1">会员中心</h1>
        <p className="text-sm text-[var(--muted-foreground)]">
          解锁高级功能，深度探索命理智慧
        </p>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {PLANS.map((plan) => (
          <div
            key={plan.tier}
            className={`guanji-card p-6 flex flex-col gap-4 relative ${
              plan.highlighted ? "guanji-glow border-[var(--primary)]" : ""
            }`}
            style={
              plan.highlighted
                ? { borderColor: "var(--primary)", borderWidth: 2 }
                : {}
            }
          >
            {plan.highlighted && (
              <span
                className="absolute top-0 right-4 -translate-y-1/2 px-3 py-0.5 rounded-[var(--radius-pill)] text-white text-xs font-semibold"
                style={{ background: "var(--primary)" }}
              >
                推荐
              </span>
            )}

            <div>
              <h2 className="font-bold text-lg text-[var(--foreground)]">{plan.name}</h2>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-2xl font-bold text-[var(--foreground)]">
                  ¥{plan.price}
                </span>
                <span className="text-sm text-[var(--muted-foreground)]">/月</span>
                {plan.originalPrice && (
                  <span className="text-sm text-[var(--muted-foreground)] line-through ml-1">
                    ¥{plan.originalPrice}
                  </span>
                )}
              </div>
            </div>

            <ul className="flex flex-col gap-2">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm text-[var(--foreground)]">
                  <Check size={14} style={{ color: "var(--primary)" }} aria-hidden="true" />
                  {feature}
                </li>
              ))}
            </ul>

            <button
              className="mt-auto w-full py-2.5 rounded-[var(--radius-pill)] text-sm font-semibold transition-opacity hover:opacity-90"
              style={
                plan.highlighted
                  ? { background: "var(--primary)", color: "#fff" }
                  : { background: "var(--muted)", color: "var(--foreground)" }
              }
            >
              {plan.buttonLabel}
            </button>
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-[var(--muted-foreground)]">
        订阅即代表您同意
        <a href="/terms" className="underline hover:text-[var(--primary)] transition-colors mx-1">用户协议</a>
        与
        <a href="/privacy" className="underline hover:text-[var(--primary)] transition-colors mx-1">隐私政策</a>
        · 内容仅供娱乐参考，不构成任何决策建议
      </p>
    </div>
  );
}
