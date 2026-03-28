import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserBaziCharts } from "@/lib/db/bazi";
import { ok, unauthorized, serverError } from "@/lib/utils/response";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return unauthorized();

    const userId = (session.user as any).id as string;
    const charts = await getUserBaziCharts(userId, 20);

    return ok(charts);
  } catch (err) {
    console.error("[bazi/history GET] error:", err);
    return serverError();
  }
}
