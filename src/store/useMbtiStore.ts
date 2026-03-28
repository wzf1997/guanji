import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { MbtiAnswers, MbtiResult } from "@/types";

// ==========================================
//  观己 — MBTI 测试状态
// ==========================================

const TOTAL_QUESTIONS = 60;

interface MbtiState {
  // 答题状态
  answers: MbtiAnswers;
  currentIndex: number; // 0-based，当前题目索引

  // 测试结果
  result: MbtiResult | null;

  // 加载/错误
  isLoading: boolean;
  error: string | null;

  // Actions
  setAnswer: (questionId: string, choice: "A" | "B") => void;
  goToNext: () => void;
  goToPrev: () => void;
  setResult: (result: MbtiResult) => void;
  reset: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Computed helpers
  canGoNext: () => boolean;
  isLastQuestion: () => boolean;
  answeredCount: () => number;
}

export const useMbtiStore = create<MbtiState>()(
  devtools(
    persist(
      (set, get) => ({
        answers: {},
        currentIndex: 0,
        result: null,
        isLoading: false,
        error: null,

        setAnswer: (questionId, choice) =>
          set(
            (state) => ({
              answers: { ...state.answers, [questionId]: choice },
            }),
            false,
            "mbti/setAnswer"
          ),

        goToNext: () =>
          set(
            (state) => ({
              currentIndex: Math.min(state.currentIndex + 1, TOTAL_QUESTIONS - 1),
            }),
            false,
            "mbti/goToNext"
          ),

        goToPrev: () =>
          set(
            (state) => ({
              currentIndex: Math.max(state.currentIndex - 1, 0),
            }),
            false,
            "mbti/goToPrev"
          ),

        setResult: (result) =>
          set({ result, error: null }, false, "mbti/setResult"),

        setLoading: (loading) =>
          set({ isLoading: loading }, false, "mbti/setLoading"),

        setError: (error) => set({ error }, false, "mbti/setError"),

        reset: () =>
          set(
            {
              answers: {},
              currentIndex: 0,
              result: null,
              isLoading: false,
              error: null,
            },
            false,
            "mbti/reset"
          ),

        canGoNext: () => {
          const state = get();
          const questions = Object.keys(state.answers);
          // 当前题已作答才能前进
          // 题目 id 格式 q01, q02... currentIndex+1 对应 q0X
          const currentId = `q${String(state.currentIndex + 1).padStart(2, "0")}`;
          return currentId in state.answers;
        },

        isLastQuestion: () => {
          return get().currentIndex === TOTAL_QUESTIONS - 1;
        },

        answeredCount: () => {
          return Object.keys(get().answers).length;
        },
      }),
      {
        name: "guanji-mbti",
        partialize: (state) => ({
          answers: state.answers,
          currentIndex: state.currentIndex,
          result: state.result,
        }),
      }
    ),
    { name: "MbtiStore" }
  )
);
