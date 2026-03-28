"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Loader2, AlertCircle, Brain, ChevronLeft, RotateCcw, Check, BookmarkPlus, ChevronRight, Sparkles } from "lucide-react";
import MbtiProgress from "@/components/mbti/MbtiProgress";
import MbtiQuestionCard from "@/components/mbti/MbtiQuestionCard";
import MbtiResultDisplay from "@/components/mbti/MbtiResultDisplay";
import { useMbtiStore } from "@/store/useMbtiStore";
import { MBTI_QUESTIONS } from "@/lib/data/mbtiQuestions";
import type { MbtiResult } from "@/types";

type PageStep = "intro" | "quiz" | "result";

// ==========================================
//  引导页
// ==========================================
function IntroSection({ onStart }: { onStart: () => void }) {
  const features = [
    { icon: "☯", title: "命理×心理双重解读", desc: "将16种人格与东方五行哲学深度融合" },
    { icon: "✦", title: "60题深度测评", desc: "精准覆盖EI / SN / TF / JP四个维度" },
    { icon: "◈", title: "AI个性化解析", desc: "AI命理师为你生成专属性格报告" },
  ];

  return (
    <div className="max-w-lg mx-auto text-center space-y-8">
      {/* 标题区 */}
      <div>
        <div className="w-16 h-16 rounded-2xl bg-[#5749F4]/20 border border-[#5749F4]/30 flex items-center justify-center mx-auto mb-4">
          <Brain size={28} className="text-[#5749F4]" />
        </div>
        <h1 className="text-3xl font-black text-[var(--foreground)] mb-3 tracking-wide">
          MBTI 性格测试
        </h1>
        <p className="text-[var(--muted-foreground)] text-sm leading-6">
          探索你的性格密码，发现与东方命理的神秘联结
        </p>
      </div>

      {/* 特性卡片 */}
      <div className="space-y-3 text-left">
        {features.map((f) => (
          <div
            key={f.title}
            className="flex items-start gap-4 rounded-2xl border border-white/10 bg-[var(--card)] p-4"
          >
            <span className="text-xl text-[#5749F4] mt-0.5 flex-shrink-0">{f.icon}</span>
            <div>
              <p className="text-sm font-semibold text-[var(--foreground)]">{f.title}</p>
              <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 提示 */}
      <p className="text-xs text-[var(--muted-foreground)]">
        共 60 题 · 约需 8-10 分钟 · 按第一直觉作答效果最佳
      </p>

      {/* 开始按钮 */}
      <button
        onClick={onStart}
        className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#5749F4] to-indigo-500 text-white text-base font-bold flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-[#5749F4]/20"
      >
        开始测试
        <ChevronRight size={18} />
      </button>
    </div>
  );
}

// ==========================================
//  主页面
// ==========================================
export default function MbtiPage() {
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;

  const [step, setStep] = useState<PageStep>("intro");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    answers,
    currentIndex,
    result,
    setAnswer,
    goToNext,
    goToPrev,
    setResult,
    reset,
  } = useMbtiStore();

  const currentQuestion = MBTI_QUESTIONS[currentIndex];
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : undefined;
  const isLastQuestion = currentIndex === MBTI_QUESTIONS.length - 1;

  // 如果 store 中已有结果，直接显示结果页
  useEffect(() => {
    if (result) {
      setStep("result");
    }
  }, []);

  // 选择答案后 0.2s 自动前进（最后一题除外）
  const handleSelect = useCallback(
    (choice: "A" | "B") => {
      if (!currentQuestion) return;
      setAnswer(currentQuestion.id, choice);

      if (!isLastQuestion) {
        setTimeout(() => {
          goToNext();
        }, 200);
      }
    },
    [currentQuestion, isLastQuestion, setAnswer, goToNext]
  );

  // 提交并请求 AI 解读
  const handleSubmit = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/mbti", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "解析失败");
      }
      const data: MbtiResult & { elementReading?: string } = await res.json();
      setResult(data);
      setStep("result");
    } catch (err: any) {
      setError(err.message || "测试解析失败，请重试");
    } finally {
      setIsLoading(false);
    }
  };

  // 重新测试
  const handleRetry = () => {
    reset();
    setStep("intro");
    setError("");
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* 顶部彩色细条 */}
      <div className="h-1 w-full bg-gradient-to-r from-[#5749F4] via-purple-400 to-indigo-400" />

      {/* Header */}
      <header className="border-b border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[#5749F4] text-xl">☯</span>
            <span className="font-bold text-[var(--foreground)] tracking-wider">观己</span>
            <span className="text-[var(--muted-foreground)] text-sm mx-2">/</span>
            <span className="text-sm text-[var(--muted-foreground)]">MBTI 测试</span>
          </div>
          {(step === "quiz" || step === "result") && (
            <button
              onClick={handleRetry}
              className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
            >
              <RotateCcw size={13} />
              重新测试
            </button>
          )}
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* 引导页 */}
        {step === "intro" && (
          <IntroSection onStart={() => setStep("quiz")} />
        )}

        {/* 答题页 */}
        {step === "quiz" && !isLoading && (
          <div className="space-y-6">
            {/* 进度条 */}
            <MbtiProgress currentIndex={currentIndex} total={MBTI_QUESTIONS.length} />

            {/* 错误提示 */}
            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 flex items-center gap-2 text-sm text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            {/* 题目卡片 */}
            {currentQuestion && (
              <MbtiQuestionCard
                question={currentQuestion}
                selectedAnswer={currentAnswer}
                onSelect={handleSelect}
              />
            )}

            {/* 底部导航 */}
            <div className="flex items-center gap-3 pt-2">
              {/* 上一题按钮 */}
              {currentIndex > 0 && (
                <button
                  onClick={goToPrev}
                  className="flex items-center gap-1.5 px-4 h-12 rounded-xl border border-white/10 bg-[var(--card)] text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:border-white/20 transition-all"
                >
                  <ChevronLeft size={16} />
                  上一题
                </button>
              )}

              {/* 最后一题：查看结果按钮 */}
              {isLastQuestion && currentAnswer && (
                <button
                  onClick={handleSubmit}
                  className="flex-1 h-12 rounded-xl bg-gradient-to-r from-[#5749F4] to-indigo-500 text-white text-sm font-bold flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-[#5749F4]/20"
                >
                  <Sparkles size={16} />
                  查看结果
                </button>
              )}

              {/* 非最后一题且已回答：手动前进按钮（正常自动前进，此处作备用） */}
              {!isLastQuestion && currentAnswer && (
                <button
                  onClick={goToNext}
                  className="flex-1 h-12 rounded-xl border border-white/10 bg-[var(--card)] text-sm text-[var(--foreground)] flex items-center justify-center gap-1.5 hover:bg-white/5 transition-all"
                >
                  下一题
                  <ChevronRight size={16} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* 加载中 */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-24 gap-5">
            <div className="relative">
              <Loader2 className="h-10 w-10 animate-spin text-[#5749F4]" />
              <div className="absolute inset-0 rounded-full bg-[#5749F4]/10 blur-xl" />
            </div>
            <div className="text-center">
              <p className="text-base font-semibold text-[var(--foreground)] mb-1">
                AI 命理师正在解析您的人格密码…
              </p>
              <p className="text-sm text-[var(--muted-foreground)]">
                融合 16 种人格理论与东方五行哲学
              </p>
            </div>
          </div>
        )}

        {/* 结果页 */}
        {step === "result" && result && !isLoading && (
          <div className="space-y-6">
            {/* 结果展示 */}
            <MbtiResultDisplay result={result as MbtiResult & { elementReading?: string }} />

            {/* 底部操作栏 */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleRetry}
                className="flex-1 h-12 rounded-xl border border-white/10 bg-[var(--card)] text-sm text-[var(--foreground)] flex items-center justify-center gap-2 hover:bg-white/5 transition-colors active:scale-[0.98]"
              >
                <RotateCcw size={15} />
                重新测试
              </button>
              <div className="flex-1 h-12 rounded-xl border border-white/10 bg-[var(--card)] text-sm flex items-center justify-center gap-2">
                {isLoggedIn ? (
                  <>
                    <Check size={15} className="text-green-400" />
                    <span className="text-green-400">已自动保存到档案</span>
                  </>
                ) : (
                  <>
                    <BookmarkPlus size={15} className="text-[var(--muted-foreground)]" />
                    <span className="text-[var(--muted-foreground)]">登录后自动保存</span>
                  </>
                )}
              </div>
            </div>

            <div className="h-8" />
          </div>
        )}
      </main>
    </div>
  );
}
