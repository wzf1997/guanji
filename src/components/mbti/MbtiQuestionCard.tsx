"use client";

import type { MbtiQuestion } from "@/types";

// ==========================================
//  观己 — MBTI 单题卡片组件
// ==========================================

interface MbtiQuestionCardProps {
  question: MbtiQuestion;
  selectedAnswer: "A" | "B" | undefined;
  onSelect: (choice: "A" | "B") => void;
}

export default function MbtiQuestionCard({
  question,
  selectedAnswer,
  onSelect,
}: MbtiQuestionCardProps) {
  return (
    <div className="w-full">
      {/* 题目文字 */}
      <div className="text-center mb-8 px-2">
        <p className="text-lg font-medium text-[var(--foreground)] leading-8">
          {question.text}
        </p>
      </div>

      {/* 选项 */}
      <div className="space-y-4">
        {(["A", "B"] as const).map((choice) => {
          const text = choice === "A" ? question.optionA : question.optionB;
          const isSelected = selectedAnswer === choice;

          return (
            <button
              key={choice}
              onClick={() => onSelect(choice)}
              className={`w-full text-left px-5 py-5 rounded-2xl border transition-all duration-200 active:scale-[0.98] ${
                isSelected
                  ? "border-[#5749F4] bg-gradient-to-br from-[#5749F4]/20 to-indigo-500/10 shadow-lg shadow-[#5749F4]/10"
                  : "border-white/10 bg-[var(--card)] hover:border-white/20 hover:bg-white/5"
              }`}
            >
              <div className="flex items-start gap-4">
                {/* 选项字母标识 */}
                <span
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    isSelected
                      ? "bg-[#5749F4] text-white"
                      : "bg-white/10 text-[var(--muted-foreground)]"
                  }`}
                >
                  {choice}
                </span>
                {/* 选项文字 */}
                <span
                  className={`flex-1 text-sm leading-6 pt-1 transition-colors ${
                    isSelected
                      ? "text-[var(--foreground)]"
                      : "text-[var(--muted-foreground)]"
                  }`}
                >
                  {text}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
