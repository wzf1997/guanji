import { createServiceRoleClient } from "@/lib/supabase";

export type QuotaResult =
  | { success: true; remaining: number }
  | { success: false; errorCode: "QUOTA_EXHAUSTED" | "USER_NOT_FOUND" | "DB_ERROR" };

// 获取用户信息
export async function getUserById(userId: string) {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();
  if (error) return null;
  return data;
}

// 原子性扣减 AI 对话次数
export async function decrementAiChatQuota(userId: string): Promise<QuotaResult> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase.rpc("decrement_ai_chat_remaining", {
    p_user_id: userId,
  });
  if (error) {
    console.error("[DB:users] decrementAiChatQuota error:", error.message);
    return { success: false, errorCode: "DB_ERROR" };
  }
  const result = data?.[0];
  if (!result) return { success: false, errorCode: "USER_NOT_FOUND" };
  if (!result.success) {
    return { success: false, errorCode: result.error_code as "QUOTA_EXHAUSTED" | "USER_NOT_FOUND" };
  }
  return { success: true, remaining: result.remaining };
}

// 归还 AI 对话次数（AI 调用失败时退款）
export async function refundAiChatQuota(userId: string): Promise<void> {
  const supabase = createServiceRoleClient();
  await supabase.rpc("increment_ai_chat_remaining", { p_user_id: userId });
}

// 查询用户剩余配额
export async function getAiChatQuota(userId: string) {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("users")
    .select("ai_chat_remaining, ai_chat_total, tier")
    .eq("id", userId)
    .single();
  if (error || !data) return null;
  return {
    remaining: data.ai_chat_remaining,
    total: data.ai_chat_total,
    tier: data.tier,
  };
}
