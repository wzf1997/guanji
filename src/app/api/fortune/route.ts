import { NextResponse } from "next/server";
import { getFortuneCacheByDate, saveFortuneCacheByDate } from "@/lib/db/fortune";

const SYSTEM_PROMPT = `你是「观己」平台的AI运势分析师。你精通八字命理、紫微斗数等东方命理体系。
现在需要你生成今日运势内容。请严格按以下JSON格式返回，不要包含任何其他内容，只返回纯JSON：

{
  "date": "YYYY年M月D日",
  "ganzhi": "X年 · X月 · X日（用天干地支表示当日干支）",
  "weekday": "周X",
  "overallStars": 数字1-5,
  "overallScore": "X.X",
  "overallSummary": "50字以内的今日综合运势概述",
  "yi": ["宜做的事情1", "宜做的事情2", "宜做的事情3", "宜做的事情4", "宜做的事情5"],
  "ji": ["忌做的事情1", "忌做的事情2", "忌做的事情3", "忌做的事情4"],
  "dailyTip": "80字以内的今日开运小贴士，结合五行流转",
  "dimensions": [
    {
      "label": "事业运",
      "stars": 数字1-5,
      "summary": "6字以内摘要",
      "interpretation": "80字以内的详细解读",
      "advice": "50字以内的可落地建议"
    },
    {
      "label": "感情运",
      "stars": 数字1-5,
      "summary": "6字以内摘要",
      "interpretation": "80字以内的详细解读",
      "advice": "50字以内的可落地建议"
    },
    {
      "label": "财富运",
      "stars": 数字1-5,
      "summary": "6字以内摘要",
      "interpretation": "80字以内的详细解读",
      "advice": "50字以内的可落地建议"
    },
    {
      "label": "健康运",
      "stars": 数字1-5,
      "summary": "6字以内摘要",
      "interpretation": "80字以内的详细解读",
      "advice": "50字以内的可落地建议"
    }
  ],
  "dailySign": {
    "quote": "一句富有东方哲学意蕴的格言，20字左右",
    "openingTip": "30字以内的开运提示",
    "luckyColor": "开运颜色名称",
    "luckyNumber": 数字1-9,
    "luckyDirection": "方位"
  }
}

要求：
1. 根据今天的真实日期生成对应干支
2. 内容温和正向，避免制造焦虑
3. 星级评分要有差异化，不要全部一样
4. 只返回JSON，不要markdown代码块`;

export async function GET() {
  try {
    // 今日日期（上海时区）
    const dateStr = new Date().toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: "Asia/Shanghai",
    }).replace(/\//g, "-");

    // 先查数据库缓存
    const cached = await getFortuneCacheByDate(dateStr);
    if (cached) {
      return NextResponse.json(cached, {
        headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=1800" },
      });
    }

    const today = new Date().toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
      timeZone: "Asia/Shanghai",
    });

    const apiUrl = process.env.DEEPSEEK_API_URL || "https://api.deepseek.com/chat/completions";
    const apiKey = process.env.DEEPSEEK_API_KEY!;
    const model = (process.env.DEEPSEEK_MODEL || "deepseek-chat").trim();

    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `今天是${today}，请生成今日运势。` },
        ],
        temperature: 0.8,
        stream: false,
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "unknown");
      console.error("[fortune API] upstream error:", res.status, errText);
      return NextResponse.json({ error: "AI 服务暂不可用" }, { status: 502 });
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content ?? "";

    const cleaned = content.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
    const fortune = JSON.parse(cleaned);

    // 异步保存到数据库缓存
    saveFortuneCacheByDate(dateStr, fortune).catch((err) =>
      console.error("[fortune API] save cache error:", err)
    );

    return NextResponse.json(fortune, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=1800",
      },
    });
  } catch (err) {
    console.error("[fortune API] error:", err);
    return NextResponse.json({ error: "生成运势失败" }, { status: 500 });
  }
}
