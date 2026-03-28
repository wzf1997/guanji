import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAiChatQuota } from "@/lib/db/users";
import { ok, unauthorized, serverError } from "@/lib/utils/response";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return unauthorized();

    const userId = (session.user as any).id as string;
    const quota = await getAiChatQuota(userId);
    if (!quota) return unauthorized("用户不存在");

    return ok(quota);
  } catch (err) {
    console.error("[user/quota GET] error:", err);
    return serverError();
  }
}
