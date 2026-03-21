"use client";

import { useState } from "react";
import BaziForm from "@/components/bazi/BaziForm";
import BaziChart from "@/components/bazi/BaziChart";
import {
  Share2,
  BookmarkPlus,
  Lock,
  ChevronRight,
  Sparkles,
} from "lucide-react";

// ─── 类型定义 ────────────────────────────────────────────────
export interface BaziInfo {
  name: string;
  gender: "male" | "female";
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  birthHour: number;
  birthPlace: string;
  isLunar: boolean;
}

export interface Pillar {
  tianGan: string;
  diZhi: string;
  wuXing: string;
}

export interface BaziResult {
  yearPillar: Pillar;
  monthPillar: Pillar;
  dayPillar: Pillar;
  hourPillar: Pillar;
  dayMaster: string;
  wuXingBalance: Record<string, number>;
  basicReading: string[];
}

// ─── Mock 数据 ───────────────────────────────────────────────
const MOCK_RESULT: BaziResult = {
  yearPillar: { tianGan: "甲", diZhi: "子", wuXing: "木" },
  monthPillar: { tianGan: "丙", diZhi: "寅", wuXing: "火" },
  dayPillar: { tianGan: "戊", diZhi: "午", wuXing: "土" },
  hourPillar: { tianGan: "庚", diZhi: "申", wuXing: "金" },
  dayMaster: "戊",
  wuXingBalance: { 木: 15, 火: 30, 土: 25, 金: 20, 水: 10 },
  basicReading: [
    "整体格局：命主日主戊土，生于寅月，得午火生扶，土性厚重而不失灵动。年柱甲子带来木水之气，月柱丙寅火旺助身，时柱庚申金气流通，四柱五行流转有序，格局较为均衡，属中上之命。",
    "性格特点：戊土日主性格稳重务实，待人宽厚，处事圆融。受丙寅月柱影响，兼具进取之心，外柔内刚。庚申时柱赋予逻辑思维与执行力，善于将想法付诸实践，适合从事需要耐心与规划的领域。",
    "近期运势：当前大运行至火土并旺之地，事业运势向好，贵人运强，适合开拓新项目或深化合作关系。感情方面宜主动，缘分将于近期出现转机。财运稳健，忌冲动投资，守成为上。",
  ],
};

// ─── 五行横条图 ──────────────────────────────────────────────
const WU_XING_COLORS: Record<string, { bg: string; text: string; bar: string }> = {
  木: { bg: "bg-green-50", text: "text-green-700", bar: "bg-green-500" },
  火: { bg: "bg-red-50", text: "text-red-700", bar: "bg-red-500" },
  土: { bg: "bg-yellow-50", text: "text-yellow-700", bar: "bg-yellow-500" },
  金: { bg: "bg-gray-50", text: "text-gray-600", bar: "bg-gray-400" },
  水: { bg: "bg-blue-50", text: "text-blue-700", bar: "bg-blue-500" },
};

function WuXingBar({ balance }: { balance: Record<string, number> }) {
  const total = Object.values(balance).reduce((a, b) => a + b, 0);
  return (
    <div className="space-y-2.5">
      {Object.entries(balance).map(([key, val]) => {
        const pct = Math.round((val / total) * 100);
        const c = WU_XING_COLORS[key];
        return (
          <div key={key} className="flex items-center gap-3">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${c.bg} ${c.text}`}
            >
              {key}
            </span>
            <div className="flex-1 bg-[var(--border)] rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${c.bar}`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-xs text-[var(--muted-foreground)] w-8 text-right">
              {pct}%
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── 基础解读段落 ────────────────────────────────────────────
function ReadingSection({ readings }: { readings: string[] }) {
  const labels = ["整体格局", "性格特点", "近期运势"];
  const icons = ["☯", "✦", "◈"];
  return (
    <div className="space-y-4">
      {readings.map((text, i) => (
        <div
          key={i}
          className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[var(--primary)] text-base">{icons[i]}</span>
            <span className="text-sm font-semibold text-[var(--foreground)]">
              {labels[i]}
            </span>
          </div>
          <p className="text-sm leading-7 text-[var(--muted-foreground)]">
            {text.replace(/^[^：]+：/, "")}
          </p>
        </div>
      ))}
    </div>
  );
}

// ─── 主页面 ──────────────────────────────────────────────────
export default function BaziPage() {
  const [step, setStep] = useState<"form" | "result">("form");
  const [baziInfo, setBaziInfo] = useState<BaziInfo | null>(null);
  const [result] = useState<BaziResult>(MOCK_RESULT);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (info: BaziInfo) => {
    setIsLoading(true);
    setBaziInfo(info);
    // 模拟 API 请求延迟
    setTimeout(() => {
      setIsLoading(false);
      setStep("result");
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* 顶部装饰条 */}
      <div className="h-1 w-full bg-gradient-to-r from-[var(--primary)] via-purple-400 to-indigo-400" />

      {/* 页头 */}
      <header className="border-b border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[var(--primary)] text-xl">☯</span>
            <span className="font-bold text-[var(--foreground)] tracking-wider">
              观己
            </span>
            <span className="text-[var(--muted-foreground)] text-sm mx-2">
              /
            </span>
            <span className="text-sm text-[var(--muted-foreground)]">
              八字排盘
            </span>
          </div>
          {step === "result" && (
            <button
              onClick={() => setStep("form")}
              className="text-xs text-[var(--primary)] hover:underline"
            >
              重新排盘
            </button>
          )}
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* ── Step 1：表单 ── */}
        {step === "form" && (
          <div>
            {/* 说明文字 */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2 tracking-wide">
                八字排盘
              </h1>
              <p className="text-[var(--muted-foreground)] text-sm">
                依据出生时空，推演先天命局，洞见自身格局
              </p>
            </div>

            <BaziForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>
        )}

        {/* ── Step 2：命盘结果 ── */}
        {step === "result" && baziInfo && (
          <div className="space-y-6">
            {/* 命主信息 */}
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 flex items-center justify-between">
              <div>
                <p className="text-xs text-[var(--muted-foreground)] mb-1">
                  命主
                </p>
                <p className="text-lg font-bold text-[var(--foreground)]">
                  {baziInfo.name}
                  <span className="ml-2 text-sm font-normal text-[var(--muted-foreground)]">
                    {baziInfo.gender === "male" ? "男命" : "女命"}
                  </span>
                </p>
                <p className="text-xs text-[var(--muted-foreground)] mt-1">
                  {baziInfo.birthYear}年{baziInfo.birthMonth}月
                  {baziInfo.birthDay}日 · {baziInfo.birthPlace}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-[var(--muted-foreground)] mb-1">
                  日主
                </p>
                <p className="text-3xl font-bold text-[var(--primary)]">
                  {result.dayMaster}
                </p>
                <p className="text-xs text-[var(--muted-foreground)]">
                  {result.dayMaster}命之人
                </p>
              </div>
            </div>

            {/* 八字命盘 */}
            <div>
              <h2 className="text-sm font-semibold text-[var(--muted-foreground)] mb-3 flex items-center gap-1.5">
                <Sparkles size={14} className="text-[var(--primary)]" />
                四柱命盘
              </h2>
              <BaziChart result={result} />
            </div>

            {/* 五行分析 */}
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
              <h2 className="text-sm font-semibold text-[var(--foreground)] mb-4 flex items-center gap-1.5">
                <span className="text-[var(--primary)]">◎</span>
                五行偏旺 / 偏弱分析
              </h2>
              <WuXingBar balance={result.wuXingBalance} />
              <p className="text-xs text-[var(--muted-foreground)] mt-4 leading-5">
                命主五行以{" "}
                <span className="text-red-600 font-medium">火（30%）</span>{" "}
                最旺，
                <span className="text-blue-600 font-medium">水（10%）</span>{" "}
                最弱，整体偏向阳热格局。
              </p>
            </div>

            {/* 基础解读 */}
            <div>
              <h2 className="text-sm font-semibold text-[var(--muted-foreground)] mb-3 flex items-center gap-1.5">
                <Sparkles size={14} className="text-[var(--primary)]" />
                基础解读
              </h2>
              <ReadingSection readings={result.basicReading} />
            </div>

            {/* 深度报告引导 */}
            <div className="rounded-2xl bg-gradient-to-br from-[var(--primary)] to-indigo-500 p-px">
              <div className="rounded-[calc(var(--radius-m)-1px)] bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/40 dark:to-indigo-950/40 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Lock size={14} className="text-[var(--primary)]" />
                      <span className="text-sm font-bold text-[var(--foreground)]">
                        深度报告
                      </span>
                    </div>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      含年运 / 事业 / 婚恋 / 财富全面解析
                    </p>
                  </div>
                  <span className="text-2xl font-bold text-[var(--primary)]">
                    ¥39
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-5">
                  {[
                    "流年大运详批",
                    "事业财运走势",
                    "婚恋缘分解析",
                    "用神喜忌推断",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)]"
                    >
                      <span className="w-1 h-1 rounded-full bg-[var(--primary)]" />
                      {item}
                    </div>
                  ))}
                </div>
                <button className="w-full h-11 rounded-xl bg-[var(--primary)] text-white text-sm font-semibold flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all">
                  解锁完整深度报告（¥39）
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* 分享/保存 */}
            <div className="flex gap-3">
              <button className="flex-1 h-11 rounded-xl border border-[var(--border)] bg-[var(--card)] text-sm text-[var(--foreground)] flex items-center justify-center gap-2 hover:bg-[var(--muted)] transition-colors">
                <Share2 size={15} />
                生成命盘海报
              </button>
              <button className="flex-1 h-11 rounded-xl border border-[var(--border)] bg-[var(--card)] text-sm text-[var(--foreground)] flex items-center justify-center gap-2 hover:bg-[var(--muted)] transition-colors">
                <BookmarkPlus size={15} />
                保存到档案
              </button>
            </div>

            {/* 底部安全间距 */}
            <div className="h-8" />
          </div>
        )}
      </main>
    </div>
  );
}
