"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Star,
  Briefcase,
  Heart,
  DollarSign,
  Activity,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Gift,
  Lock,
  ChevronRight,
  Flame,
  Calendar,
} from "lucide-react";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
type TabKey = "today" | "week" | "month";

interface FortuneDetail {
  icon: React.ElementType;
  label: string;
  stars: number;
  summary: string;
  interpretation: string;
  advice: string;
  color: string;
}

interface DailySign {
  quote: string;
  openingTip: string;
  luckyColor: string;
  luckyNumber: number;
  luckyDirection: string;
}

// ─────────────────────────────────────────────
// Mock Data
// ─────────────────────────────────────────────
const TODAY_META = {
  date: "2026年3月21日",
  ganzhi: "丙午年 · 庚申月 · 壬寅日",
  weekday: "周六",
  overallStars: 4,
  overallSummary: "今日整体运势向好，贵人运强，适合主动推进重要计划。保持平和心态，好事自然来。",
};

const LUCKY_ITEMS = {
  yi: ["签约合作", "拜访贵人", "运动健身", "理财规划", "学习进修"],
  ji: ["轻率决定", "远行奔波", "情绪争执", "大额支出"],
};

const DAILY_TIP =
  "今日木气旺盛，创造力充沛。将脑海中的想法付诸行动，你会发现事情比想象中顺利许多。";

const FORTUNE_DETAILS: FortuneDetail[] = [
  {
    icon: Briefcase,
    label: "事业运",
    stars: 4,
    summary: "贵人运强，推进顺利",
    interpretation:
      "今日职场气场活跃，沟通顺畅，上司或合作方对你的方案持开放态度。适合主动提出新想法或进行重要汇报，能量充沛，思维清晰。",
    advice: "今日可主动约定一个重要会议或提交一份积压已久的方案，把握机会窗口。",
    color: "from-[#5749F4] to-[#818CF8]",
  },
  {
    icon: Heart,
    label: "感情运",
    stars: 3,
    summary: "坦诚交流，关系升温",
    interpretation:
      "感情方面平稳中见温度，与伴侣或心仪对象的沟通若能保持真诚坦率，将带来意想不到的亲密感。单身者今日有机会在熟人圈子中遇见值得深交的缘分。",
    advice: "放下手机，给对方一句真心的肯定或感谢，小行动往往带来大温暖。",
    color: "from-[#EC4899] to-[#F472B6]",
  },
  {
    icon: DollarSign,
    label: "财富运",
    stars: 5,
    summary: "正财旺盛，收益可期",
    interpretation:
      "今日财运达到本周峰值，正财渠道（工资、项目款项、预期内收益）十分顺畅。已在评估中的稳健理财计划可适时推进，偏财方面不建议过度追求刺激性投机。",
    advice: "可以完成一笔早有计划的稳健投资，或者整理记账，清晰了解当前财务状况。",
    color: "from-[#D97706] to-[#FBBF24]",
  },
  {
    icon: Activity,
    label: "健康运",
    stars: 3,
    summary: "注意休息，保持节律",
    interpretation:
      "今日身体状态中规中矩，如近期睡眠不规律需加以注意。肝木偏旺，情绪波动可能导致疲惫感，建议避免过于紧绷，适当放松也是生产力的一部分。",
    advice: "今日可安排一次20分钟的冥想或伸展练习，帮助身心同步放松。",
    color: "from-[#10B981] to-[#34D399]",
  },
];

const DAILY_SIGN: DailySign = {
  quote: "静水流深，厚积方能薄发。今日的积累，是明日绽放的序章。",
  openingTip: "出行时选择绿色单品，有助于提升当日整体气场流动。",
  luckyColor: "松柏绿",
  luckyNumber: 3,
  luckyDirection: "东南方",
};

const MOCK_STREAK = 7;

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────

function StarRating({ count, total = 5, size = "md" }: { count: number; total?: number; size?: "sm" | "md" | "lg" }) {
  const sizeClass = size === "sm" ? "h-3 w-3" : size === "lg" ? "h-5 w-5" : "h-4 w-4";
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: total }).map((_, i) => (
        <Star
          key={i}
          className={`${sizeClass} ${
            i < count ? "fill-amber-400 text-amber-400" : "fill-white/10 text-white/10"
          }`}
        />
      ))}
    </div>
  );
}

const TABS: { key: TabKey; label: string }[] = [
  { key: "today", label: "今日" },
  { key: "week",  label: "本周" },
  { key: "month", label: "本月" },
];

// ─────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────
export default function FortunePage() {
  const [activeTab, setActiveTab] = useState<TabKey>("today");
  const [checkedIn, setCheckedIn] = useState(false);
  const isLoggedIn = false; // mock

  return (
    <main className="min-h-screen bg-[#0d0b1e] text-white pt-20 pb-32">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">

        {/* ── Page Title ── */}
        <div className="py-8">
          <div className="mb-1 text-xs font-medium tracking-widest text-[#8B7CF6] uppercase">
            命理 · 运势
          </div>
          <h1 className="text-3xl font-serif font-semibold text-white">每日运势</h1>
        </div>

        {/* ── Tabs ── */}
        <div className="mb-8 flex gap-1 rounded-xl bg-white/5 p-1 border border-white/8 w-fit">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`rounded-lg px-6 py-2 text-sm font-medium transition-all duration-200 ${
                activeTab === key
                  ? "bg-[#5749F4] text-white shadow-lg shadow-[#5749F4]/25"
                  : "text-white/50 hover:text-white/80"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── Non-today placeholder ── */}
        {activeTab !== "today" && (
          <div className="rounded-2xl border border-white/10 bg-[#13102a] p-12 text-center">
            <Lock className="mx-auto mb-4 h-10 w-10 text-[#5749F4]/40" />
            <h3 className="mb-2 text-lg font-semibold text-white">
              {activeTab === "week" ? "本周运势" : "本月运势"}解读
            </h3>
            <p className="mb-6 text-sm text-white/40">
              {activeTab === "week"
                ? "本周运势涵盖7天详细运程，助你合理规划每一天"
                : "本月深度解读，含月度运势走势图与关键节点预警"}
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#5749F4] to-[#7C3AED] px-6 py-2.5 text-sm font-semibold text-white"
            >
              登录查看
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        )}

        {/* ══ TODAY CONTENT ══════════════════════════════ */}
        {activeTab === "today" && (
          <div className="space-y-6">

            {/* ── Main Card ── */}
            <div className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-[#16123a] to-[#0d0b1e] p-8 overflow-hidden">
              <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-[#5749F4]/10 blur-2xl pointer-events-none" />
              <div className="relative z-10">
                {/* Date & Ganzhi */}
                <div className="mb-6 flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2 text-white/60 text-sm">
                    <Calendar className="h-4 w-4 text-[#8B7CF6]" />
                    <span>{TODAY_META.date}</span>
                    <span className="text-white/30">·</span>
                    <span>{TODAY_META.weekday}</span>
                  </div>
                  <div className="rounded-full bg-[#5749F4]/15 border border-[#5749F4]/25 px-3 py-0.5 text-xs font-medium text-[#A78BFA]">
                    {TODAY_META.ganzhi}
                  </div>
                </div>

                {/* Overall score */}
                <div className="mb-4 flex items-center gap-4">
                  <StarRating count={TODAY_META.overallStars} size="lg" />
                  <span className="text-sm text-white/50">
                    综合运势 {TODAY_META.overallStars}.2 / 5
                  </span>
                </div>
                <p className="text-base leading-relaxed text-white/70">
                  {TODAY_META.overallSummary}
                </p>
              </div>
            </div>

            {/* ── Yi / Ji ── */}
            <div className="grid grid-cols-2 gap-4">
              {/* Yi */}
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                <div className="mb-3 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span className="text-sm font-medium text-emerald-300">宜</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {LUCKY_ITEMS.yi.map((item) => (
                    <span
                      key={item}
                      className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-xs text-emerald-300"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              {/* Ji */}
              <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
                <div className="mb-3 flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-400" />
                  <span className="text-sm font-medium text-red-300">忌</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {LUCKY_ITEMS.ji.map((item) => (
                    <span
                      key={item}
                      className="rounded-full bg-red-500/10 border border-red-500/20 px-2.5 py-0.5 text-xs text-red-300"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Daily Tip ── */}
            <div className="flex items-start gap-3 rounded-2xl border border-amber-400/20 bg-amber-400/5 px-5 py-4">
              <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
              <p className="text-sm leading-relaxed text-amber-200/80">{DAILY_TIP}</p>
            </div>

            {/* ── Four Dimensions ── */}
            <div>
              <h2 className="mb-4 text-base font-semibold text-white/60 tracking-wider uppercase text-xs">
                四维运势详情
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {FORTUNE_DETAILS.map(({ icon: Icon, label, stars, summary, interpretation, advice, color }) => (
                  <div
                    key={label}
                    className="group rounded-2xl border border-white/8 bg-[#13102a] p-6 hover:border-white/15 transition-all duration-300 hover:-translate-y-0.5"
                  >
                    {/* Card header */}
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${color}`}>
                          <Icon className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white">{label}</div>
                          <div className="text-xs text-white/40">{summary}</div>
                        </div>
                      </div>
                      <StarRating count={stars} size="sm" />
                    </div>

                    {/* Interpretation */}
                    <p className="mb-4 text-xs leading-relaxed text-white/50">{interpretation}</p>

                    {/* Advice */}
                    <div className="rounded-xl bg-white/3 border border-white/6 px-4 py-3">
                      <div className="mb-1 text-[10px] font-medium tracking-widest text-[#8B7CF6] uppercase">
                        可落地建议
                      </div>
                      <p className="text-xs leading-relaxed text-white/60">{advice}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Daily Sign / Check-in ── */}
            <div className="rounded-3xl border border-[#5749F4]/25 bg-gradient-to-br from-[#1a1540] to-[#13102a] overflow-hidden">
              {/* Sign card */}
              <div className="relative p-8 text-center border-b border-white/8">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(87,73,244,0.12),transparent)] pointer-events-none" />
                <div className="relative z-10">
                  <div className="mb-2 text-xs font-medium tracking-widest text-[#8B7CF6] uppercase">
                    今日日签
                  </div>
                  <p className="mb-6 text-lg font-serif font-medium text-white leading-relaxed">
                    「{DAILY_SIGN.quote}」
                  </p>
                  <p className="mb-6 text-sm text-white/50">{DAILY_SIGN.openingTip}</p>

                  {/* Lucky items */}
                  <div className="flex flex-wrap justify-center gap-4 text-xs text-white/40">
                    <span>
                      <span className="text-[#8B7CF6]">开运色：</span>
                      {DAILY_SIGN.luckyColor}
                    </span>
                    <span>
                      <span className="text-[#8B7CF6]">幸运数：</span>
                      {DAILY_SIGN.luckyNumber}
                    </span>
                    <span>
                      <span className="text-[#8B7CF6]">开运方位：</span>
                      {DAILY_SIGN.luckyDirection}
                    </span>
                  </div>
                </div>
              </div>

              {/* Check-in area */}
              <div className="p-6">
                {/* Streak */}
                <div className="mb-5 flex items-center justify-center gap-2 text-sm text-white/50">
                  <Flame className="h-4 w-4 text-orange-400" />
                  <span>
                    {checkedIn || isLoggedIn
                      ? `已连续签到 ${MOCK_STREAK} 天`
                      : "连续签到可获得额外开运贴士"}
                  </span>
                </div>

                {/* Check-in button */}
                {!checkedIn ? (
                  <button
                    onClick={() => {
                      if (!isLoggedIn) {
                        window.location.href = "/login";
                      } else {
                        setCheckedIn(true);
                      }
                    }}
                    className="mx-auto flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#5749F4] to-[#7C3AED] px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-[#5749F4]/25 hover:opacity-90 transition-opacity"
                  >
                    <Gift className="h-4 w-4" />
                    领取今日日签
                  </button>
                ) : (
                  <div className="flex items-center justify-center gap-2 text-emerald-400 text-sm font-medium">
                    <CheckCircle2 className="h-4 w-4" />
                    今日已领取，明日再来
                  </div>
                )}

                {/* Reward note */}
                <p className="mt-4 text-center text-xs text-white/25">
                  连续签到 7 天可解锁专属「命理深读」报告一次
                </p>
              </div>
            </div>

            {/* ── Bottom CTA ── */}
            {!isLoggedIn ? (
              <div className="rounded-2xl border border-[#5749F4]/20 bg-[#5749F4]/5 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="font-medium text-white mb-1">登录后查看专属八字运势</p>
                  <p className="text-sm text-white/45">基于你的生辰八字，提供个性化运势解读</p>
                </div>
                <Link
                  href="/login"
                  className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#5749F4] to-[#7C3AED] px-6 py-2.5 text-sm font-semibold text-white"
                >
                  立即登录
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            ) : (
              <div className="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="font-medium text-white mb-1">解锁深度月度运势报告</p>
                  <p className="text-sm text-white/45">含月度走势图、关键节点提醒、个性化建议</p>
                </div>
                <button className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 px-6 py-2.5 text-sm font-semibold text-white">
                  解锁 ¥19
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}

          </div>
        )}
      </div>
    </main>
  );
}
