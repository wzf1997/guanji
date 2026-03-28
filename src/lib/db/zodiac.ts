import { createServiceRoleClient } from "@/lib/supabase";

// 按 (zodiac_sign, date) 查询缓存
export async function getZodiacFortuneCached(sign: string, date: string) {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("zodiac_fortune_cache")
    .select("fortune_json")
    .eq("zodiac_sign", sign)
    .eq("date", date)
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();

  if (error) {
    console.error("[DB:zodiac] getZodiacFortuneCached error:", error.message);
    return null;
  }
  return data?.fortune_json ?? null;
}

// 写入缓存（过期时间设为次日凌晨4点，上海时区）
export async function saveZodiacFortuneCache(
  sign: string,
  date: string,
  data: object
) {
  const supabase = createServiceRoleClient();

  // 计算过期时间：次日凌晨4:00（上海时区）
  const now = new Date();
  const tomorrow = new Date(
    new Date(now).toLocaleDateString("en-CA", { timeZone: "Asia/Shanghai" }) +
      "T04:00:00+08:00"
  );
  if (tomorrow <= now) {
    tomorrow.setDate(tomorrow.getDate() + 1);
  }

  const { error } = await supabase.from("zodiac_fortune_cache").upsert(
    {
      zodiac_sign: sign,
      date,
      fortune_json: data,
      created_at: now.toISOString(),
      expires_at: tomorrow.toISOString(),
    },
    { onConflict: "zodiac_sign,date" }
  );

  if (error) {
    console.error("[DB:zodiac] saveZodiacFortuneCache error:", error.message);
  }
}
