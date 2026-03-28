# 「观己」API 接口测试文档

## 测试环境配置

| 变量 | 值 |
|------|-----|
| BASE_URL | `http://localhost:3000` |
| Cookie | 登录后从浏览器 DevTools > Application > Cookies 获取 `next-auth.session-token` |

---

## 接口列表

### 1. GET /api/session - 获取当前会话

```bash
curl -X GET http://localhost:3000/api/session \
  -H "Cookie: next-auth.session-token=YOUR_TOKEN"
```

**正常响应（已登录）:**
```json
{
  "user": {
    "id": "uuid-xxx",
    "name": "测试用户",
    "email": "test@example.com",
    "tier": "free",
    "aiChatRemaining": 10
  }
}
```

**异常场景:**
- 未登录 → `{ "user": null }`

---

### 2. GET /api/user/profile - 获取用户信息

```bash
curl -X GET http://localhost:3000/api/user/profile \
  -H "Cookie: next-auth.session-token=YOUR_TOKEN"
```

**正常响应:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-xxx",
    "email": "test@example.com",
    "name": "测试用户",
    "tier": "free",
    "aiChatRemaining": 10,
    "aiChatTotal": 10
  }
}
```

**测试用例:**
- ✅ 已登录用户 → 返回用户信息
- ❌ 未登录 → `{"success":false,"error":{"code":"AUTH_REQUIRED","message":"请先登录"}}`

---

### 3. GET /api/user/quota - 查询 AI 配额

```bash
curl -X GET http://localhost:3000/api/user/quota \
  -H "Cookie: next-auth.session-token=YOUR_TOKEN"
```

**正常响应:**
```json
{
  "success": true,
  "data": {
    "remaining": 8,
    "total": 10,
    "tier": "free"
  }
}
```

---

### 4. POST /api/bazi - 八字排盘

```bash
curl -X POST http://localhost:3000/api/bazi \
  -H "Content-Type: application/json" \
  -d '{
    "name": "张三",
    "gender": "male",
    "birthYear": 1990,
    "birthMonth": 8,
    "birthDay": 15,
    "birthHour": 12,
    "birthPlace": "北京",
    "isLunar": false
  }'
```

**正常响应:**
```json
{
  "yearPillar": { "tianGan": "庚", "diZhi": "午", "wuXing": "金" },
  "monthPillar": { "tianGan": "甲", "diZhi": "申", "wuXing": "木" },
  "dayPillar": { "tianGan": "壬", "diZhi": "子", "wuXing": "水" },
  "hourPillar": { "tianGan": "庚", "diZhi": "午", "wuXing": "金" },
  "dayMaster": "壬",
  "wuXingBalance": { "木": 20, "火": 15, "土": 10, "金": 30, "水": 25 },
  "basicReading": ["整体格局：...", "性格特点：...", "近期运势：..."]
}
```

**测试用例:**
- ✅ 完整参数 → 返回排盘结果
- ✅ 已登录用户 → 排盘结果自动保存到数据库
- ❌ 缺少 name → `{ "error": "参数不完整" }` (400)
- ❌ 缺少 birthYear → `{ "error": "参数不完整" }` (400)

---

### 5. GET /api/bazi/history - 八字历史记录

```bash
curl -X GET http://localhost:3000/api/bazi/history \
  -H "Cookie: next-auth.session-token=YOUR_TOKEN"
```

**正常响应:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-xxx",
      "name": "张三",
      "gender": "male",
      "birth_year": 1990,
      "birth_month": 8,
      "birth_day": 15,
      "day_master": "壬",
      "summary": "整体格局：...",
      "created_at": "2026-03-21T12:00:00Z"
    }
  ]
}
```

---

### 6. GET /api/fortune - 今日运势

```bash
curl -X GET http://localhost:3000/api/fortune
```

**正常响应:**
```json
{
  "date": "2026年3月21日",
  "ganzhi": "丙午年 · 乙卯月 · 丁亥日",
  "weekday": "周六",
  "overallStars": 4,
  "overallScore": "4.2",
  "overallSummary": "今日阳气渐升，诸事顺遂...",
  "yi": ["签合同", "拜访贵人", "学习进修", "运动健身", "整理家居"],
  "ji": ["争执口角", "轻率投资", "熬夜劳累", "远行奔波"],
  "dimensions": [...],
  "dailySign": {
    "quote": "厚德载物，自强不息",
    "luckyColor": "金黄色",
    "luckyNumber": 6,
    "luckyDirection": "正南方"
  }
}
```

**测试用例:**
- ✅ 首次请求 → 调用 AI 生成并缓存到 DB
- ✅ 第二次请求 → 从 DB 缓存返回（验证：看响应速度明显更快）

---

### 7. POST /api/chat - AI 命理师对话（SSE 流式）

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=YOUR_TOKEN" \
  --no-buffer \
  -d '{
    "messages": [
      { "role": "user", "content": "我是1990年8月15日午时出生，想了解我的命运" }
    ]
  }'
```

**正常响应（SSE 流式）:**
```
data: {"choices":[{"delta":{"content":"您好"}...}]}
data: {"choices":[{"delta":{"content":"，根据"}...}]}
...
data: [DONE]
```

**测试用例:**
- ✅ 已登录 + 有配额 → 流式返回 AI 回复
- ❌ 未登录 → `{"success":false,"error":{"code":"AUTH_REQUIRED","message":"请先登录后才能使用 AI 命理师"}}` (401)
- ❌ 配额耗尽 → `{"success":false,"error":{"code":"QUOTA_EXHAUSTED","message":"AI 对话次数已用完，请充值升级"}}` (402)
- ❌ 包含违禁词 → `{"error":"您的提问包含不合规内容，请调整后重试。"}` (400)

---

## Postman Collection（JSON 格式）

将以下内容保存为 `guanji-api.postman_collection.json`，导入 Postman 使用：

```json
{
  "info": {
    "name": "观己 API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    { "key": "BASE_URL", "value": "http://localhost:3000" },
    { "key": "SESSION_TOKEN", "value": "your-session-token-here" }
  ],
  "item": [
    {
      "name": "获取当前会话",
      "request": {
        "method": "GET",
        "url": "{{BASE_URL}}/api/session",
        "header": [{ "key": "Cookie", "value": "next-auth.session-token={{SESSION_TOKEN}}" }]
      }
    },
    {
      "name": "获取用户信息",
      "request": {
        "method": "GET",
        "url": "{{BASE_URL}}/api/user/profile",
        "header": [{ "key": "Cookie", "value": "next-auth.session-token={{SESSION_TOKEN}}" }]
      }
    },
    {
      "name": "查询 AI 配额",
      "request": {
        "method": "GET",
        "url": "{{BASE_URL}}/api/user/quota",
        "header": [{ "key": "Cookie", "value": "next-auth.session-token={{SESSION_TOKEN}}" }]
      }
    },
    {
      "name": "八字排盘",
      "request": {
        "method": "POST",
        "url": "{{BASE_URL}}/api/bazi",
        "header": [
          { "key": "Content-Type", "value": "application/json" },
          { "key": "Cookie", "value": "next-auth.session-token={{SESSION_TOKEN}}" }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\"name\":\"张三\",\"gender\":\"male\",\"birthYear\":1990,\"birthMonth\":8,\"birthDay\":15,\"birthHour\":12,\"birthPlace\":\"北京\",\"isLunar\":false}"
        }
      }
    },
    {
      "name": "八字历史记录",
      "request": {
        "method": "GET",
        "url": "{{BASE_URL}}/api/bazi/history",
        "header": [{ "key": "Cookie", "value": "next-auth.session-token={{SESSION_TOKEN}}" }]
      }
    },
    {
      "name": "今日运势",
      "request": {
        "method": "GET",
        "url": "{{BASE_URL}}/api/fortune"
      }
    },
    {
      "name": "AI 命理师对话",
      "request": {
        "method": "POST",
        "url": "{{BASE_URL}}/api/chat",
        "header": [
          { "key": "Content-Type", "value": "application/json" },
          { "key": "Cookie", "value": "next-auth.session-token={{SESSION_TOKEN}}" }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\"messages\":[{\"role\":\"user\",\"content\":\"我1990年8月15日午时生，想了解近期运势\"}]}"
        }
      }
    }
  ]
}
```

---

## 前后端联调说明

### Session Token 获取方式
1. 用 GitHub/Google 登录后，打开浏览器 DevTools
2. Application > Cookies > localhost:3000
3. 复制 `next-auth.session-token` 的值

### 新增接口一览（接入 Supabase 后）

| 接口 | 方法 | 认证 | 说明 |
|------|------|------|------|
| `/api/user/profile` | GET | 必须 | 获取用户完整信息（含会员状态） |
| `/api/user/quota` | GET | 必须 | 查询 AI 剩余次数 |
| `/api/bazi/history` | GET | 必须 | 获取八字排盘历史 |

### 前端对接变更点

1. **登录后自动同步**: 无需前端额外处理，`auth.ts` 已在 `signIn` 回调中自动创建/更新 Supabase 用户
2. **AI 配额实时显示**: 每次发送消息后，调用 `GET /api/user/quota` 刷新剩余次数
3. **Session 中的新字段**: `session.user.tier` 和 `session.user.aiChatRemaining` 已可直接使用
4. **配额不足提示**: chat 接口返回 402 时，前端显示升级会员弹窗
5. **八字历史**: 登录用户的排盘结果自动持久化，前端可调用 `/api/bazi/history` 展示历史记录
