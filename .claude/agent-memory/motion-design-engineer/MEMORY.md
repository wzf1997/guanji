# 观己 App 动效工程记忆

## 项目基本信息
- 框架：Next.js + Tailwind CSS（App Router）
- 全局样式：/Users/admin/guanji/src/app/globals.css
- 首页：/Users/admin/guanji/src/app/(main)/page.tsx
- 组件目录：/Users/admin/guanji/src/components/

## 品牌动效规范（已确认）
- 主色：#5749F4（紫蓝）/ #8B7CF6 / #C084FC（紫色渐变）/ #F59E0B（金色点缀）
- 背景：#0d0b1e（深紫黑）
- 风格：东方神秘美学，慢而优雅，不刺眼，opacity 变化范围 0.2~0.8
- 禁止：快速闪烁、夸张弹跳、高饱和色光效

## 已实施的动效方案（2026-03-21）

### Keyframes（globals.css）
| 名称 | 用途 | 参数 |
|------|------|------|
| fadeInUp | Hero/卡片入场 | 0.6s cubic-bezier(0.16,1,0.3,1) both |
| twinkleA/B/C | 保留供旧散点星兼容 | opacity 变化，5s/9s/4s infinite |
| twinkle | 兼容旧散点星 | 同 twinkleA，--twinkle-duration 变量控制 |
| rotateSlow | 八卦环旋转 | 30s linear infinite |
| shimmer | 扫光效果 | 0.8s cubic-bezier(0.4,0,0.2,1) forwards，hover 触发 |
| pulseGlow | 光晕呼吸 | 4s ease-in-out infinite alternate，scale 0.95↔1.05 |
| starSparkle | 四芒星闪烁（StarField.tsx） | opacity+scale+rotate，每帧含 translate(-50%,-50%) |

### 工具类
- .animate-fade-in-up：Hero 入场，animationDelay 用 inline style 各元素独立设置
- .animate-twinkle：兼容旧散点星（Hero 内），--twinkle-duration CSS 变量控制
- .animate-rotate-slow：八卦环旋转（30s/圈）
- .animate-pulse-glow：中心光晕呼吸
- .feature-card-bar + .group:hover .feature-card-bar：顶部扫光条

### 全局星空背景（2026-03-21 重写）
- 组件：/Users/admin/guanji/src/components/layout/StarField.tsx（"use client"）
- 50 颗硬编码四芒星，SVG polygon 8 点，inner 腰比 = size × 0.18
- 容器：position:fixed, inset:0, z-index:0, pointerEvents:none
- 每颗星：position:absolute, top/left 用 %（相对视口），transform:translate(-50%,-50%)
- 动画：animationName=starSparkle，奇偶交替 alternate/alternate-reverse
- 光晕：CSS filter drop-shadow，大星双层紫色，中星白光，小星柔和白
- 旧方案（box-shadow vw/vh）已废弃：vw/vh 在 box-shadow 偏移中无效，导致所有星堆叠在原点

### Hero 入场时序（animationDelay）
- hero-badge：0s
- hero-title：0.15s
- hero-subtitle：0.3s
- hero-desc：0.45s
- hero-cta：0.6s
- hero-social-proof：0.75s

## 技术约定

### Server Component 兼容
- 页面为 Server Component，不可引入 'use client' 或 JS 动画库
- IntersectionObserver 无法使用，用固定 animationDelay 序列模拟滚动触发效果
- CSS 变量（如 --twinkle-duration）可通过 inline style 传入，TypeScript 中需 ["--var-name" as string] 写法

### 性能规范
- 所有动效优先使用 transform 和 opacity（GPU 合成层，不触发 layout/paint）
- shimmer 用 background-position 变化（背景渲染，开销可接受）
- 避免对 top/left/width/height 做动画

### 文件写入方式
- 工具限制：Write/Edit 工具需先用工具本身读取文件才能写入
- 追加内容：用 tee -a + heredoc 追加到已有文件末尾
- 完整重写：用 python3 脚本直接写文件（绕过工具读取限制）
- TypeScript 验证：npx tsc --noEmit --skipLibCheck

## 常见问题
- CSS 变量在 TSX 中：style={{ ["--var-name" as string]: value }}（避免类型错误）
- Tailwind arbitrary animation：[animation:xxx_yyy_zzz] 语法可用，但不如 globals.css 工具类可维护
- .group:hover 子选择器：父元素必须有 group className，观己项目 Feature 卡片原有 group 可直接复用
