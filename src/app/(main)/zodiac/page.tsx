"use client";

import { useState, useCallback } from "react";
import { Compass } from "lucide-react";
import ZodiacCompass from "@/components/zodiac/ZodiacCompass";
import ZodiacFortunePanel from "@/components/zodiac/ZodiacFortunePanel";
import { ZODIAC_DATA } from "@/lib/data/zodiacData";
import { COMPLIANCE_TEXT } from "@/lib/constants";

interface FortuneDimension {
  dimension: string;
  level: number;
  summary: string;
  advice: string;
}

interface ZodiacFortuneData {
  sign: string;
  signCn: string;
  date: string;
  overallStars: number;
  overallSummary: string;
  dimensions: FortuneDimension[];
  luckyColor: string;
  luckyNumber: number;
  dailyQuote: string;
  periodAdvice: string;
}

export default function ZodiacPage() {
  const [selectedSign, setSelectedSign] = useState<string | null>(null);
  const [fortune, setFortune] = useState<ZodiacFortuneData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSelectSign = useCallback(
    async (sign: string) => {
      // 如果点击同一星座，不重复请求
      if (sign === selectedSign && fortune) return;

      setSelectedSign(sign);
      setFortune(null);
      setError("");
      setLoading(true);

      try {
        const res = await fetch(`/api/zodiac?sign=${sign}`);
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || "请求失败");
        }
        const data: ZodiacFortuneData = await res.json();
        setFortune(data);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "星象解读失败";
        setError(msg + "，请稍后重试");
      } finally {
        setLoading(false);
      }
    },
    [selectedSign, fortune]
  );

  const selectedInfo = selectedSign ? ZODIAC_DATA[selectedSign] : null;

  return (
    <main className="min-h-screen bg-[#0d0b1e] text-white pt-20 pb-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">

        {/* 页面标题 */}
        <div className="py-8">
          <div className="mb-1 flex items-center gap-2 text-xs font-medium tracking-widest text-[#8B7CF6] uppercase">
            <Compass className="h-3.5 w-3.5" />
            星象 · 命盘
          </div>
          <h1 className="text-3xl font-serif font-semibold text-white">
            星座罗盘
          </h1>
          <p className="mt-1.5 text-sm text-white/40">
            中西合璧，观星知命
          </p>
        </div>

        {/* 主体内容：响应式左右/上下布局 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">

          {/* 左侧：罗盘 */}
          <div className="lg:sticky lg:top-28">
            <ZodiacCompass
              selectedSign={selectedSign}
              onSelectSign={handleSelectSign}
            />
            {/* 罗盘说明 */}
            <p className="mt-4 text-center text-xs text-white/25">
              点击罗盘中的扇区选择星座
            </p>
          </div>

          {/* 右侧：运势面板 */}
          <div>
            {!selectedSign ? (
              /* 未选择星座时的提示 */
              <div className="flex flex-col items-center justify-center py-16 gap-4 text-center rounded-3xl border border-white/8 bg-white/3">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#5749F4]/10 border border-[#5749F4]/20">
                  <Compass className="h-7 w-7 text-[#8B7CF6]" />
                </div>
                <div>
                  <p className="text-base font-medium text-white/70 mb-1">
                    点击罗盘选择您的星座
                  </p>
                  <p className="text-sm text-white/30">
                    获取今日专属星象运势解读
                  </p>
                </div>
                {/* 12星座快速入口 */}
                <div className="mt-2 flex flex-wrap justify-center gap-2 px-4">
                  {Object.values(ZODIAC_DATA).map((info) => (
                    <button
                      key={info.sign}
                      onClick={() => handleSelectSign(info.sign)}
                      className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/50 hover:border-[#5749F4]/50 hover:text-white/80 hover:bg-[#5749F4]/10 transition-all duration-200"
                    >
                      <span>{info.symbol}</span>
                      <span>{info.signCn}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : selectedInfo ? (
              /* 已选择星座时显示运势面板 */
              <ZodiacFortunePanel
                zodiacInfo={selectedInfo}
                fortune={fortune}
                loading={loading}
                error={error}
              />
            ) : null}
          </div>
        </div>

        {/* 合规声明 */}
        <div className="mt-16 text-center">
          <p className="text-xs text-white/20">{COMPLIANCE_TEXT}</p>
        </div>
      </div>
    </main>
  );
}
