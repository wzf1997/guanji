// ==========================================
//  观己 — 全局常量
// ==========================================

export const SITE_NAME = "观己";
export const SITE_TAGLINE = "观己知命，顺势而为";
export const SITE_DESCRIPTION =
  "基于东方命理哲学的人生决策参考平台";

/** 合规免责声明 — 必须全站展示 */
export const COMPLIANCE_TEXT =
  "本产品内容仅供娱乐参考，不构成任何决策建议，不宣扬封建迷信";

// 导航菜单
export const NAV_LINKS = [
  { href: "/fortune", label: "每日运势", icon: "Star" },
  { href: "/bazi", label: "八字排盘", icon: "BookOpen" },
  { href: "/ai-chat", label: "AI对话", icon: "MessageCircle" },
  { href: "/profile", label: "个人档案", icon: "User" },
  { href: "/membership", label: "会员", icon: "Crown" },
] as const;

// 会员等级
export const MEMBERSHIP_TIERS = {
  FREE: "free",
  BASIC: "basic",
  PRO: "pro",
} as const;

export type MembershipTier = (typeof MEMBERSHIP_TIERS)[keyof typeof MEMBERSHIP_TIERS];

// AI 对话配置
export const AI_CHAT_CONFIG = {
  FREE_DAILY_LIMIT: 3,      // 免费用户每日对话次数
  BASIC_DAILY_LIMIT: 20,
  PRO_DAILY_LIMIT: -1,      // -1 = 无限制
  MAX_MESSAGE_LENGTH: 500,
} as const;

// 八字天干地支
export const HEAVENLY_STEMS = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"] as const;
export const EARTHLY_BRANCHES = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"] as const;
export const FIVE_ELEMENTS = ["木", "火", "土", "金", "水"] as const;
export const ZODIAC_ANIMALS = ["鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"] as const;

// 运势方向
export const FORTUNE_DIRECTIONS = {
  CAREER: "事业运",
  WEALTH: "财运",
  LOVE: "感情运",
  HEALTH: "健康运",
  STUDY: "学业运",
} as const;

// 违规词汇黑名单（前端展示层过滤）
export const FORBIDDEN_WORDS = ["算命", "改命", "必中", "化解", "消灾", "保佑"] as const;

// API 路径前缀
export const API_PREFIX = "/api/v1";
