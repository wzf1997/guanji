import { ZodiacInfo } from "@/types";

export const ZODIAC_DATA: Record<string, ZodiacInfo> = {
  aries: {
    sign: "aries",
    signCn: "白羊座",
    dateRange: "3月21日 - 4月19日",
    element: "火",
    rulingPlanet: "火星",
    symbol: "♈",
    keyTraits: ["勇敢", "直接", "热情", "冲动", "领导力"],
    fiveElementMap: "火",
    color: "#FF4444",
  },
  taurus: {
    sign: "taurus",
    signCn: "金牛座",
    dateRange: "4月20日 - 5月20日",
    element: "土",
    rulingPlanet: "金星",
    symbol: "♉",
    keyTraits: ["稳重", "踏实", "耐心", "固执", "享受"],
    fiveElementMap: "土",
    color: "#8B7355",
  },
  gemini: {
    sign: "gemini",
    signCn: "双子座",
    dateRange: "5月21日 - 6月20日",
    element: "风",
    rulingPlanet: "水星",
    symbol: "♊",
    keyTraits: ["机智", "灵活", "好奇", "多变", "社交"],
    fiveElementMap: "木",
    color: "#FFD700",
  },
  cancer: {
    sign: "cancer",
    signCn: "巨蟹座",
    dateRange: "6月21日 - 7月22日",
    element: "水",
    rulingPlanet: "月亮",
    symbol: "♋",
    keyTraits: ["敏感", "护家", "直觉", "情感", "善良"],
    fiveElementMap: "水",
    color: "#B0C4DE",
  },
  leo: {
    sign: "leo",
    signCn: "狮子座",
    dateRange: "7月23日 - 8月22日",
    element: "火",
    rulingPlanet: "太阳",
    symbol: "♌",
    keyTraits: ["自信", "慷慨", "热情", "领导", "荣耀"],
    fiveElementMap: "火",
    color: "#FFA500",
  },
  virgo: {
    sign: "virgo",
    signCn: "处女座",
    dateRange: "8月23日 - 9月22日",
    element: "土",
    rulingPlanet: "水星",
    symbol: "♍",
    keyTraits: ["细心", "完美", "分析", "实际", "谦逊"],
    fiveElementMap: "土",
    color: "#90EE90",
  },
  libra: {
    sign: "libra",
    signCn: "天秤座",
    dateRange: "9月23日 - 10月22日",
    element: "风",
    rulingPlanet: "金星",
    symbol: "♎",
    keyTraits: ["公平", "优雅", "和谐", "外交", "审美"],
    fiveElementMap: "金",
    color: "#DDA0DD",
  },
  scorpio: {
    sign: "scorpio",
    signCn: "天蝎座",
    dateRange: "10月23日 - 11月21日",
    element: "水",
    rulingPlanet: "冥王星",
    symbol: "♏",
    keyTraits: ["深沉", "神秘", "执着", "洞察", "强烈"],
    fiveElementMap: "水",
    color: "#8B0000",
  },
  sagittarius: {
    sign: "sagittarius",
    signCn: "射手座",
    dateRange: "11月22日 - 12月21日",
    element: "火",
    rulingPlanet: "木星",
    symbol: "♐",
    keyTraits: ["自由", "乐观", "冒险", "直率", "哲学"],
    fiveElementMap: "木",
    color: "#FF8C00",
  },
  capricorn: {
    sign: "capricorn",
    signCn: "摩羯座",
    dateRange: "12月22日 - 1月19日",
    element: "土",
    rulingPlanet: "土星",
    symbol: "♑",
    keyTraits: ["务实", "自律", "坚韧", "负责", "野心"],
    fiveElementMap: "土",
    color: "#696969",
  },
  aquarius: {
    sign: "aquarius",
    signCn: "水瓶座",
    dateRange: "1月20日 - 2月18日",
    element: "风",
    rulingPlanet: "天王星",
    symbol: "♒",
    keyTraits: ["独立", "创新", "人道", "叛逆", "理想"],
    fiveElementMap: "金",
    color: "#4169E1",
  },
  pisces: {
    sign: "pisces",
    signCn: "双鱼座",
    dateRange: "2月19日 - 3月20日",
    element: "水",
    rulingPlanet: "海王星",
    symbol: "♓",
    keyTraits: ["感性", "富有同情", "直觉", "浪漫", "艺术"],
    fiveElementMap: "水",
    color: "#20B2AA",
  },
};

// 12星座顺序列表（罗盘用）
export const ZODIAC_ORDER = [
  "aries", "taurus", "gemini", "cancer",
  "leo", "virgo", "libra", "scorpio",
  "sagittarius", "capricorn", "aquarius", "pisces",
] as const;

// 根据生日计算星座
export function getBirthZodiac(month: number, day: number): string {
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "aries";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "taurus";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "gemini";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "cancer";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "leo";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "virgo";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "libra";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "scorpio";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "sagittarius";
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "capricorn";
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "aquarius";
  return "pisces"; // 2月19日 - 3月20日
}
