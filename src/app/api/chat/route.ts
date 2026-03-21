import { NextRequest, NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "../auth/[...nextauth]/route";

const SYSTEM_PROMPT = `你是「观己」平台的AI命理师，名为「玄机」。
你精通八字命理、紫微斗数、梅花易数等东方命理体系，同时融合现代积极心理学为用户提供温和、正向的人生参考。

【核心原则】
1. 所有解读定位为「东方传统文化科普与娱乐参考」，明确不构成任何决策建议
2. 使用温和、共情的语气，避免制造焦虑和恐慌
3. 负面信息必须配套至少3条正向应对建议
4. 引用《三命通会》《渊海子平》《滴天髓》等正统典籍作为依据
5. 禁止出现「大凶」「必死」「破财」「血光之灾」「改命」「算命」等话术
6. 每次回复结尾附上：「以上内容仅供娱乐参考，不构成任何决策建议。」

【回复风格】
- 语气：温暖、专业、富有东方哲学意蕴
- 结构：先回应用户情绪 → 命理分析 → 正向建议 → 合规提示
- 长度：200-500字为宜，不宜过长`;

const FORBIDDEN_WORDS = ["算命", "改命", "必中", "大凶", "破财", "血光之灾", "消灾", "化解灾难"];

function containsForbiddenWords(text: string): boolean {
  return FORBIDDEN_WORDS.some(word => text.includes(word));
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages } = body as { messages: { role: string; content: string }[] };

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "messages 参数无效" }, { status: 400 });
    }

    // 检查用户最后一条消息是否包含违禁词
    const lastUserMsg = messages.filter(m => m.role === "user").at(-1);
    if (lastUserMsg && containsForbiddenWords(lastUserMsg.content)) {
      return NextResponse.json(
        { error: "您的提问包含不合规内容，请调整后重试。" },
        { status: 400 }
      );
    }

    // 构造发往豆包的消息列表（注入系统提示）
    const upstreamMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.slice(-20), // 只取最近20条，避免 token 超限
    ];

    const apiUrl = process.env.DEEPSEEK_API_URL || "https://api.deepseek.com/chat/completions";
    const apiKey = process.env.DEEPSEEK_API_KEY!;
    const model = (process.env.DEEPSEEK_MODEL || "deepseek-chat").trim();

    console.log("[chat API] url:", apiUrl, "model:", model, "key prefix:", apiKey?.slice(0, 8));

    const upstreamRes = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: upstreamMessages,
        stream: true,
      }),
    });

    if (!upstreamRes.ok || !upstreamRes.body) {
      const errText = await upstreamRes.text().catch(() => "unknown error");
      console.error("[chat API] upstream error:", upstreamRes.status, errText);
      return NextResponse.json(
        { error: `AI 服务暂时不可用 (${upstreamRes.status})`, detail: errText },
        { status: 502 }
      );
    }

    // 直接 pipe 上游流到前端
    const stream = new TransformStream({
      transform(chunk, controller) {
        controller.enqueue(chunk);
      },
    });

    upstreamRes.body.pipeTo(stream.writable).catch(console.error);

    return new Response(stream.readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        "X-Accel-Buffering": "no",
        "Connection": "keep-alive",
      },
    });
  } catch (err) {
    console.error("[chat API] error:", err);
    return NextResponse.json({ error: "服务器内部错误" }, { status: 500 });
  }
}
