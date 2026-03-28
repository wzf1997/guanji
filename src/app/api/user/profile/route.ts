import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserById } from "@/lib/db/users";
import { ok, unauthorized, serverError } from "@/lib/utils/response";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return unauthorized();

    const userId = (session.user as any).id as string;
    const user = await getUserById(userId);
    if (!user) return unauthorized("用户不存在");

    return ok({
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatar_url,
      tier: user.tier,
      aiChatRemaining: user.ai_chat_remaining,
      aiChatTotal: user.ai_chat_total,
      membershipExpiresAt: user.membership_expires_at,
      createdAt: user.created_at,
    });
  } catch (err) {
    console.error("[user/profile GET] error:", err);
    return serverError();
  }
}
