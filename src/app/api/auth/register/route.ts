import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { createServiceRoleClient } from "@/lib/supabase";
import { ok, fail } from "@/lib/utils/response";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return fail("VALIDATION_FAILED", "用户名和密码不能为空", 400);
    }
    if (username.length < 2 || username.length > 20) {
      return fail("VALIDATION_FAILED", "用户名长度 2-20 位", 400);
    }
    if (!/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(username)) {
      return fail("VALIDATION_FAILED", "用户名只能包含字母、数字、下划线或中文", 400);
    }
    if (password.length < 6) {
      return fail("VALIDATION_FAILED", "密码至少 6 位", 400);
    }

    const supabase = createServiceRoleClient();

    // 用户名查重（存在 name 字段里）
    const { data: existing } = await supabase
      .from("users")
      .select("id")
      .eq("name", username)
      .single();

    if (existing) {
      return fail("RESOURCE_CONFLICT", "该用户名已被使用，换一个试试", 409);
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const { data: user, error } = await supabase
      .from("users")
      .insert({
        name: username,
        email: `${username}_${Date.now()}@guanji.local`, // 内部占位，不对外展示
        password_hash: passwordHash,
        provider: "credentials",
        tier: "free",
        ai_chat_remaining: 10,
        ai_chat_total: 10,
      })
      .select("id, name")
      .single();

    if (error) {
      console.error("[register] insert error:", error.message);
      return fail("SERVER_ERROR", "注册失败，请稍后重试", 500);
    }

    return ok({ id: user.id, username: user.name }, 201);
  } catch (err) {
    console.error("[register] error:", err);
    return fail("SERVER_ERROR", "服务器内部错误", 500);
  }
}
