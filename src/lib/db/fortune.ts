import { createServiceRoleClient } from "@/lib/supabase";

// 从缓存获取今日运势
export async function getFortuneCacheByDate(date: string) {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("fortune_cache")
    .select("fortune_json")
    .eq("date", date)
    .gt("expires_at", new Date().toISOString())
    .single();

  if (error || !data) return null;
  return data.fortune_json;
}

// 保存运势到缓存
export async function saveFortuneCacheByDate(date: string, fortuneJson: Record<string, unknown>) {
  const supabase = createServiceRoleClient();
  const expiresAt = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString();
  const { error } = await supabase
    .from("fortune_cache")
    .upsert(
      { date, fortune_json: fortuneJson, expires_at: expiresAt },
      { onConflict: "date" }
    );

  if (error) {
    console.error("[DB:fortune] saveFortuneCacheByDate error:", error.message);
  }
}
