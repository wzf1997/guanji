import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { BaziChart } from "@/types";

// ==========================================
//  观己 — 八字排盘状态
// ==========================================

export interface BaziFormValues {
  name: string;
  gender: "male" | "female";
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  birthHour: number;   // 0-23
  birthMinute: number;
  isUnknownTime: boolean; // 不知出生时辰
}

interface BaziState {
  // 当前命盘输入表单
  formValues: BaziFormValues | null;

  // 当前显示的命盘结果
  currentChart: BaziChart | null;

  // 历史命盘列表
  chartHistory: BaziChart[];

  // 加载/错误
  isCalculating: boolean;
  error: string | null;

  // Actions
  setFormValues: (values: BaziFormValues) => void;
  setCurrentChart: (chart: BaziChart) => void;
  addToHistory: (chart: BaziChart) => void;
  removeFromHistory: (chartId: string) => void;
  clearHistory: () => void;
  setCalculating: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const DEFAULT_FORM: BaziFormValues = {
  name: "",
  gender: "male",
  birthYear: new Date().getFullYear() - 25,
  birthMonth: 1,
  birthDay: 1,
  birthHour: 12,
  birthMinute: 0,
  isUnknownTime: false,
};

export const useBaziStore = create<BaziState>()(
  devtools(
    persist(
      (set, get) => ({
        formValues: null,
        currentChart: null,
        chartHistory: [],
        isCalculating: false,
        error: null,

        setFormValues: (values) =>
          set({ formValues: values }, false, "bazi/setFormValues"),

        setCurrentChart: (chart) =>
          set({ currentChart: chart, error: null }, false, "bazi/setCurrentChart"),

        addToHistory: (chart) => {
          const existing = get().chartHistory;
          // 去重：同 id 则替换
          const filtered = existing.filter((c) => c.id !== chart.id);
          set(
            { chartHistory: [chart, ...filtered].slice(0, 20) }, // 最多保留20个
            false,
            "bazi/addToHistory"
          );
        },

        removeFromHistory: (chartId) =>
          set(
            (state) => ({
              chartHistory: state.chartHistory.filter((c) => c.id !== chartId),
            }),
            false,
            "bazi/removeFromHistory"
          ),

        clearHistory: () =>
          set({ chartHistory: [], currentChart: null }, false, "bazi/clearHistory"),

        setCalculating: (loading) =>
          set({ isCalculating: loading }, false, "bazi/setCalculating"),

        setError: (error) => set({ error }, false, "bazi/setError"),

        reset: () =>
          set(
            {
              formValues: DEFAULT_FORM,
              currentChart: null,
              isCalculating: false,
              error: null,
            },
            false,
            "bazi/reset"
          ),
      }),
      {
        name: "guanji-bazi",
        partialize: (state) => ({
          chartHistory: state.chartHistory,
          formValues: state.formValues,
        }),
      }
    ),
    { name: "BaziStore" }
  )
);
