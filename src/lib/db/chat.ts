import { createServiceRoleClient } from "@/lib/supabase";

// 创建新会话
export async function createChatSession(userId: string, title = "新对话") {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("chat_sessions")
    .insert({ user_id: userId, title })
    .select("id")
    .single();

  if (error) {
    console.error("[DB:chat] createChatSession error:", error.message);
    return null;
  }
  return data?.id ?? null;
}

// 获取用户会话列表
export async function getUserChatSessions(userId: string, limit = 20) {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("chat_sessions")
    .select("id, title, message_count, created_at, updated_at")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[DB:chat] getUserChatSessions error:", error.message);
    return [];
  }
  return data ?? [];
}

// 获取会话详情（验证所有权）
export async function getChatSession(sessionId: string, userId: string) {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("chat_sessions")
    .select("*")
    .eq("id", sessionId)
    .eq("user_id", userId)
    .single();

  if (error) return null;
  return data;
}

// 获取会话消息（最近 N 条）
export async function getChatMessages(sessionId: string, limit = 30) {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("chat_messages")
    .select("role, content, created_at")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true })
    .limit(limit);

  if (error) {
    console.error("[DB:chat] getChatMessages error:", error.message);
    return [];
  }
  return data ?? [];
}

// 保存消息到会话
export async function saveChatMessage(params: {
  sessionId: string;
  role: "user" | "assistant";
  content: string;
}) {
  const supabase = createServiceRoleClient();
  const { error } = await supabase.from("chat_messages").insert({
    session_id: params.sessionId,
    role: params.role,
    content: params.content,
  });

  if (error) {
    console.error("[DB:chat] saveChatMessage error:", error.message);
  }

  // 更新会话的 updated_at 和消息计数
  await supabase
    .from("chat_sessions")
    .update({
      updated_at: new Date().toISOString(),
      message_count: supabase.rpc("message_count" as any),
    })
    .eq("id", params.sessionId);
}
