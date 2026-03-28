import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { saveBaziChart } from "@/lib/db/bazi";

const SYSTEM_PROMPT = `你是「观己」平台的AI八字排盘大师。精通八字命理、天干地支、五行生克。
用户会提供出生信息，你需要根据其出生年月日时，精确排出四柱八字并给出解读。

请严格按以下JSON格式返回，不要包含任何其他内容，只返回纯JSON：

{
  "yearPillar": { "tianGan": "X", "diZhi": "X", "wuXing": "木/火/土/金/水" },
  "monthPillar": { "tianGan": "X", "diZhi": "X", "wuXing": "木/火/土/金/水" },
  "dayPillar": { "tianGan": "X", "diZhi": "X", "wuXing": "木/火/土/金/水" },
  "hourPillar": { "tianGan": "X", "diZhi": "X", "wuXing": "木/火/土/金/水" },
  "dayMaster": "日主天干",
  "wuXingBalance": { "木": 数字, "火": 数字, "土": 数字, "金": 数字, "水": 数字 },
  "basicReading": [
    "整体格局：200字以内的格局分析，包含日主强弱、用神喜忌",
    "性格特点：150字以内的性格分析",
    "近期运势：150字以内的近期运势分析"
  ]
}

要求：
1. 天干地支必须根据用户出生信息精确推算，遵循万年历规则
2. 五行占比数字之和为100，代表百分比
3. wuXing字段填该柱天干对应的五行（甲乙-木，丙丁-火，戊己-土，庚辛-金，壬癸-水）
4. 解读温和正向，避免制造焦虑
5. 引用正统命理典籍
6. 只返回JSON，不要markdown代码块`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, gender, birthYear, birthMonth, birthDay, birthHour, birthPlace, isLunar } = body;

    if (!name || !birthYear || !birthMonth || !birthDay) {
      return NextResponse.json({ error: "参数不完整" }, { status: 400 });
    }

    const genderText = gender === "male" ? "男" : "女";
    const calendarType = isLunar ? "农历" : "公历";

    const shichenMap: Record<number, string> = {
      0: "子时(23:00-01:00)", 2: "丑时(01:00-03:00)", 4: "寅时(03:00-05:00)",
      6: "卯时(05:00-07:00)", 8: "辰时(07:00-09:00)", 10: "巳时(09:00-11:00)",
      12: "午时(11:00-13:00)", 14: "未时(13:00-15:00)", 16: "申时(15:00-17:00)",
      18: "酉时(17:00-19:00)", 20: "戌时(19:00-21:00)", 22: "亥时(21:00-23:00)",
    };
    const shichen = shichenMap[birthHour] || `${birthHour}时`;

    const userMsg = `请为以下命主排出八字命盘：
姓名：${name}
性别：${genderText}
出生日期：${calendarType} ${birthYear}年${birthMonth}月${birthDay}日
出生时辰：${shichen}
出生地：${birthPlace}`;

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
          { role: "user", content: userMsg },
        ],
        temperature: 0.3,
        stream: false,
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "unknown");
      console.error("[bazi API] upstream error:", res.status, errText);
      return NextResponse.json({ error: "AI 服务暂不可用" }, { status: 502 });
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content ?? "";
    const cleaned = content.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
    const result = JSON.parse(cleaned);

    // 异步保存到数据库（不阻塞响应）
    const session = await getServerSession(authOptions);
    if (session?.user) {
      const userId = (session.user as any).id;
      if (userId) {
        saveBaziChart({
          userId,
          name,
          gender: gender ?? "male",
          birthYear: Number(birthYear),
          birthMonth: Number(birthMonth),
          birthDay: Number(birthDay),
          birthHour: birthHour != null ? Number(birthHour) : undefined,
          birthPlace: birthPlace ?? undefined,
          isLunar: Boolean(isLunar),
          resultJson: result,
        }).catch((err) => console.error("[bazi API] save chart error:", err));
      }
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error("[bazi API] error:", err);
    return NextResponse.json({ error: "排盘失败" }, { status: 500 });
  }
}
