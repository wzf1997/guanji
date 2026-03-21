import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import type { User, MembershipTier } from "@/types";
import { AI_CHAT_CONFIG, MEMBERSHIP_TIERS } from "@/lib/constants";

// ==========================================
//  观己 — 用户全局状态
// ==========================================

interface UserState {
  // 认证状态
  isLoggedIn: boolean;
  isLoading: boolean;
  user: User | null;
  authError: string | null;

  // 对话次数（每日重置）
  aiChatUsedToday: number;
  aiChatLastResetDate: string; // YYYY-MM-DD

  // Actions
  login: (user: User) => void;
  logout: () => void;
  updateUser: (partial: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
  setAuthError: (error: string | null) => void;
  incrementAiChatUsed: () => void;
  resetAiChatIfNewDay: () => void;

  // Derived getters (computed)
  getRemainingAiChats: () => number;
  canUseAiChat: () => boolean;
  isPro: () => boolean;
}

function getDailyLimit(tier: MembershipTier): number {
  switch (tier) {
    case MEMBERSHIP_TIERS.PRO:
      return AI_CHAT_CONFIG.PRO_DAILY_LIMIT;
    case MEMBERSHIP_TIERS.BASIC:
      return AI_CHAT_CONFIG.BASIC_DAILY_LIMIT;
    default:
      return AI_CHAT_CONFIG.FREE_DAILY_LIMIT;
  }
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        isLoggedIn: false,
        isLoading: false,
        user: null,
        authError: null,
        aiChatUsedToday: 0,
        aiChatLastResetDate: todayStr(),

        // ---- Actions ----

        login: (user) => {
          set(
            {
              isLoggedIn: true,
              user,
              authError: null,
              aiChatUsedToday: 0,
              aiChatLastResetDate: todayStr(),
            },
            false,
            "user/login"
          );
        },

        logout: () => {
          set(
            {
              isLoggedIn: false,
              user: null,
              authError: null,
              aiChatUsedToday: 0,
              aiChatLastResetDate: todayStr(),
            },
            false,
            "user/logout"
          );
        },

        updateUser: (partial) => {
          const current = get().user;
          if (!current) return;
          set({ user: { ...current, ...partial } }, false, "user/update");
        },

        setLoading: (loading) => set({ isLoading: loading }, false, "user/setLoading"),

        setAuthError: (error) => set({ authError: error }, false, "user/setAuthError"),

        incrementAiChatUsed: () => {
          get().resetAiChatIfNewDay();
          set(
            (state) => ({ aiChatUsedToday: state.aiChatUsedToday + 1 }),
            false,
            "user/incrementAiChat"
          );
        },

        resetAiChatIfNewDay: () => {
          const today = todayStr();
          if (get().aiChatLastResetDate !== today) {
            set(
              { aiChatUsedToday: 0, aiChatLastResetDate: today },
              false,
              "user/resetAiChat"
            );
          }
        },

        // ---- Derived ----

        getRemainingAiChats: () => {
          const { user, aiChatUsedToday } = get();
          const tier = user?.membershipTier ?? "free";
          const limit = getDailyLimit(tier);
          if (limit === -1) return Infinity;
          return Math.max(0, limit - aiChatUsedToday);
        },

        canUseAiChat: () => {
          const remaining = get().getRemainingAiChats();
          return remaining === Infinity || remaining > 0;
        },

        isPro: () => get().user?.membershipTier === MEMBERSHIP_TIERS.PRO,
      }),
      {
        name: "guanji-user",
        partialize: (state) => ({
          isLoggedIn: state.isLoggedIn,
          user: state.user,
          aiChatUsedToday: state.aiChatUsedToday,
          aiChatLastResetDate: state.aiChatLastResetDate,
        }),
      }
    ),
    { name: "UserStore" }
  )
);
