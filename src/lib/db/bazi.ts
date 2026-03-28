import { createServiceRoleClient } from "@/lib/supabase";

// 保存八字命盘结果到数据库
export async function saveBaziChart(params: {
  userId: string;
  name: string;
  gender: "male" | "female";
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  birthHour?: number;
  birthPlace?: string;
  isLunar: boolean;
  resultJson: Record<string, unknown>;
}) {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("bazi_charts")
    .insert({
      user_id: params.userId,
      name: params.name,
      gender: params.gender,
      birth_year: params.birthYear,
      birth_month: params.birthMonth,
      birth_day: params.birthDay,
      birth_hour: params.birthHour ?? null,
      birth_place: params.birthPlace ?? null,
      is_lunar: params.isLunar,
      result_json: params.resultJson,
      year_pillar: (params.resultJson as any).yearPillar ?? null,
      month_pillar: (params.resultJson as any).monthPillar ?? null,
      day_pillar: (params.resultJson as any).dayPillar ?? null,
      hour_pillar: (params.resultJson as any).hourPillar ?? null,
      day_master: (params.resultJson as any).dayMaster ?? null,
      five_elements: (params.resultJson as any).wuXingBalance ?? null,
      summary: ((params.resultJson as any).basicReading?.[0] ?? "").slice(0, 500),
    })
    .select("id")
    .single();

  if (error) {
    console.error("[DB:bazi] saveBaziChart error:", error.message);
    return null;
  }
  return data?.id ?? null;
}

// 获取用户的八字历史记录
export async function getUserBaziCharts(userId: string, limit = 10) {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("bazi_charts")
    .select("id, name, gender, birth_year, birth_month, birth_day, day_master, summary, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[DB:bazi] getUserBaziCharts error:", error.message);
    return [];
  }
  return data ?? [];
}

// 获取单条八字命盘详情
export async function getBaziChartById(id: string, userId: string) {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("bazi_charts")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .single();

  if (error) return null;
  return data;
}
