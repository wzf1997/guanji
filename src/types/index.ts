// ==========================================
//  观己 — 核心类型定义
// ==========================================

// ---- 用户 & 认证 ----

export type MembershipTier = "free" | "basic" | "pro";

export interface User {
  id: string;
  nickname: string;
  avatarUrl?: string;
  email?: string;
  phone?: string;
  membershipTier: MembershipTier;
  membershipExpiresAt?: string; // ISO date string
  createdAt: string;
  /** 今日剩余 AI 对话次数 */
  aiChatRemaining: number;
}

// ---- 八字命盘 ----

export type HeavenlyStem = "甲" | "乙" | "丙" | "丁" | "戊" | "己" | "庚" | "辛" | "壬" | "癸";
export type EarthlyBranch = "子" | "丑" | "寅" | "卯" | "辰" | "巳" | "午" | "未" | "申" | "酉" | "戌" | "亥";
export type FiveElement = "木" | "火" | "土" | "金" | "水";

export interface GanZhi {
  stem: HeavenlyStem;
  branch: EarthlyBranch;
  element: FiveElement;
}

export interface BaziPillar {
  ganZhi: GanZhi;
  label: "年柱" | "月柱" | "日柱" | "时柱";
  hidden: HeavenlyStem[]; // 地支藏干
}

export interface FiveElementBalance {
  wood: number;   // 0–100
  fire: number;
  earth: number;
  metal: number;
  water: number;
}

export interface BaziChart {
  id: string;
  userId: string;
  birthDateTime: string; // ISO string
  gender: "male" | "female";
  pillars: [BaziPillar, BaziPillar, BaziPillar, BaziPillar]; // 年月日时
  dayMaster: HeavenlyStem; // 日主
  fiveElementBalance: FiveElementBalance;
  luckyElements: FiveElement[];
  summary: string; // AI生成的命盘摘要
  createdAt: string;
}

// ---- 每日运势 ----

export type FortuneLevel = 1 | 2 | 3 | 4 | 5; // 1=较差 5=极佳

export interface FortuneItem {
  dimension: string; // "事业运" | "财运" | ...
  level: FortuneLevel;
  summary: string;
  advice: string;
}

export interface FortuneData {
  date: string; // YYYY-MM-DD
  userId?: string;
  overallLevel: FortuneLevel;
  lunarDate: string;   // 农历日期
  ganZhiDay: string;   // 干支日
  suitableFor: string[]; // 宜
  avoidFor: string[];    // 忌
  luckyColor: string;
  luckyNumber: number;
  items: FortuneItem[];
  dailyQuote: string;   // 每日寄语
}

// ---- AI 命理师对话 ----

export type ChatRole = "user" | "assistant" | "system";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: string; // ISO string
  isLoading?: boolean;
  error?: string;
}

export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

// ---- 轻量测试 ----

export interface QuizOption {
  id: string;
  text: string;
  value: string;
}

export interface QuizQuestion {
  id: string;
  text: string;
  options: QuizOption[];
}

export interface QuizResult {
  id: string;
  type: string;
  title: string;
  description: string;
  elementAffinity: FiveElement;
  traits: string[];
}

// ---- 会员套餐 ----

export interface MembershipPlan {
  id: string;
  tier: Exclude<MembershipTier, "free">;
  name: string;
  price: number;          // 元/月
  originalPrice?: number;
  features: string[];
  aiChatLimit: number;    // -1 = 无限
  highlighted: boolean;   // 推荐标识
}

// ---- 通用 API 响应 ----

export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
