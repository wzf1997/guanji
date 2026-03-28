"use client";

import { useEffect, useState } from "react";
import { ZODIAC_DATA, ZODIAC_ORDER } from "@/lib/data/zodiacData";

interface ZodiacCompassProps {
  selectedSign: string | null;
  onSelectSign: (sign: string) => void;
  todaySign?: string; // 今日高亮星座（用户自身）
}

// 极坐标转笛卡尔坐标（从正上方0°开始，顺时针）
function polarToCartesian(
  cx: number,
  cy: number,
  r: number,
  angleDeg: number
) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

// 生成扇形路径（饼图切片）
function describeSlice(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number
) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle <= 180 ? 0 : 1;
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y} Z`;
}

// 生成圆弧路径（仅弧线，不封闭）
function describeArc(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number
) {
  const start = polarToCartesian(cx, cy, r, startAngle);
  const end = polarToCartesian(cx, cy, r, endAngle);
  const largeArc = endAngle - startAngle <= 180 ? 0 : 1;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`;
}

export default function ZodiacCompass({
  selectedSign,
  onSelectSign,
  todaySign,
}: ZodiacCompassProps) {
  const [mounted, setMounted] = useState(false);
  const [hoveredSign, setHoveredSign] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cx = 200;
  const cy = 200;
  const outerR = 160;
  const innerR = 72;
  const textR = 128; // 文字放置半径
  const symbolR = 108; // 符号放置半径
  const labelR = 148; // 中文名放置半径（外圈）

  const total = ZODIAC_ORDER.length; // 12
  const sliceAngle = 360 / total; // 30°

  // 同心装饰圆半径
  const decorR1 = 170;
  const decorR2 = 65;

  return (
    <div className="relative flex items-center justify-center">
      <svg
        viewBox="0 0 400 400"
        className={`w-full max-w-[400px] transition-opacity duration-700 ${
          mounted ? "opacity-100" : "opacity-0"
        }`}
        style={{ filter: "drop-shadow(0 0 24px rgba(87,73,244,0.25))" }}
      >
        <defs>
          {/* 选中扇形渐变 */}
          <radialGradient id="selectedGrad" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#7C6BF8" />
            <stop offset="100%" stopColor="#5749F4" />
          </radialGradient>
          {/* 今日星座金色渐变 */}
          <radialGradient id="todayGrad" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#F59E0B" />
          </radialGradient>
          {/* 默认扇形渐变 */}
          <radialGradient id="defaultGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1e1a3a" />
            <stop offset="100%" stopColor="#16123a" />
          </radialGradient>
          {/* Hover 渐变 */}
          <radialGradient id="hoverGrad" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#2d2860" />
            <stop offset="100%" stopColor="#221e50" />
          </radialGradient>
          {/* 中心圆渐变 */}
          <radialGradient id="centerGrad" cx="50%" cy="20%" r="80%">
            <stop offset="0%" stopColor="#2a2460" />
            <stop offset="100%" stopColor="#0d0b1e" />
          </radialGradient>
          {/* 发光滤镜 */}
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 外装饰圆 */}
        <circle
          cx={cx}
          cy={cy}
          r={decorR1}
          fill="none"
          stroke="rgba(87,73,244,0.2)"
          strokeWidth="1"
          strokeDasharray="4 6"
        />

        {/* 12个扇形切片 */}
        {ZODIAC_ORDER.map((sign, i) => {
          const startAngle = i * sliceAngle;
          const endAngle = (i + 1) * sliceAngle;
          const midAngle = startAngle + sliceAngle / 2;
          const isSelected = selectedSign === sign;
          const isToday = todaySign === sign;
          const isHovered = hoveredSign === sign;

          const info = ZODIAC_DATA[sign];

          // 符号位置
          const symPos = polarToCartesian(cx, cy, symbolR, midAngle);
          // 中文名位置（更靠外）
          const lblPos = polarToCartesian(cx, cy, labelR, midAngle);

          // 文字旋转角度（让文字朝外）
          const textRotate = midAngle > 180 ? midAngle + 90 : midAngle - 90;

          // 扇形填充色
          let sliceFill: string;
          if (isSelected) {
            sliceFill = "url(#selectedGrad)";
          } else if (isToday) {
            sliceFill = "url(#todayGrad)";
          } else if (isHovered) {
            sliceFill = "url(#hoverGrad)";
          } else {
            sliceFill = "url(#defaultGrad)";
          }

          // 轻微缩放选中项（通过 transform-origin）
          const scale = isSelected ? "scale(1.04)" : "scale(1)";
          const transformOrigin = `${cx}px ${cy}px`;

          return (
            <g
              key={sign}
              onClick={() => onSelectSign(sign)}
              onMouseEnter={() => setHoveredSign(sign)}
              onMouseLeave={() => setHoveredSign(null)}
              style={{
                cursor: "pointer",
                transform: scale,
                transformOrigin,
                transition: "transform 0.2s ease",
              }}
            >
              {/* 扇形主体 */}
              <path
                d={describeSlice(cx, cy, outerR, startAngle, endAngle)}
                fill={sliceFill}
                stroke="rgba(87,73,244,0.35)"
                strokeWidth={isSelected ? "1.5" : "0.8"}
                style={{ transition: "all 0.25s ease" }}
              />

              {/* 今日星座：外圈高亮弧 */}
              {isToday && (
                <path
                  d={describeArc(cx, cy, outerR + 5, startAngle + 1, endAngle - 1)}
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="3"
                  strokeLinecap="round"
                  filter="url(#goldGlow)"
                />
              )}

              {/* 星座符号 */}
              <text
                x={symPos.x}
                y={symPos.y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={isSelected ? "16" : "13"}
                fill={
                  isSelected
                    ? "#ffffff"
                    : isToday
                    ? "#F59E0B"
                    : "rgba(255,255,255,0.75)"
                }
                fontWeight={isSelected ? "600" : "400"}
                filter={isSelected || isToday ? "url(#glow)" : undefined}
                style={{ transition: "all 0.25s ease", userSelect: "none" }}
              >
                {info.symbol}
              </text>

              {/* 中文名（外圈，旋转对齐） */}
              <text
                x={lblPos.x}
                y={lblPos.y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="7.5"
                fill={
                  isSelected
                    ? "#c4bbff"
                    : isToday
                    ? "#FCD34D"
                    : "rgba(255,255,255,0.40)"
                }
                transform={`rotate(${textRotate}, ${lblPos.x}, ${lblPos.y})`}
                style={{ transition: "all 0.25s ease", userSelect: "none" }}
              >
                {info.signCn}
              </text>
            </g>
          );
        })}

        {/* 内圆遮罩 */}
        <circle
          cx={cx}
          cy={cy}
          r={innerR}
          fill="url(#centerGrad)"
          stroke="rgba(87,73,244,0.5)"
          strokeWidth="1.5"
        />

        {/* 内圆装饰圆 */}
        <circle
          cx={cx}
          cy={cy}
          r={decorR2}
          fill="none"
          stroke="rgba(87,73,244,0.3)"
          strokeWidth="0.8"
          strokeDasharray="3 5"
        />

        {/* 中心内容 */}
        {selectedSign && ZODIAC_DATA[selectedSign] ? (
          <>
            {/* 选中星座大符号 */}
            <text
              x={cx}
              y={cy - 10}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="28"
              fill={todaySign === selectedSign ? "#F59E0B" : "#A78BFA"}
              filter="url(#glow)"
              style={{ userSelect: "none" }}
            >
              {ZODIAC_DATA[selectedSign].symbol}
            </text>
            {/* 星座中文名 */}
            <text
              x={cx}
              y={cy + 22}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="10"
              fill="rgba(255,255,255,0.65)"
              style={{ userSelect: "none" }}
            >
              {ZODIAC_DATA[selectedSign].signCn}
            </text>
          </>
        ) : (
          <>
            {/* 未选中显示「观己」 */}
            <text
              x={cx}
              y={cy - 6}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="16"
              fontWeight="600"
              fill="rgba(167,139,250,0.7)"
              style={{ userSelect: "none", letterSpacing: "4px" }}
            >
              观己
            </text>
            <text
              x={cx}
              y={cy + 14}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="8"
              fill="rgba(255,255,255,0.25)"
              style={{ userSelect: "none" }}
            >
              点击选择星座
            </text>
          </>
        )}

        {/* 中心十字装饰线 */}
        <line
          x1={cx - 8}
          y1={cy}
          x2={cx + 8}
          y2={cy}
          stroke="rgba(87,73,244,0.3)"
          strokeWidth="0.5"
        />
        <line
          x1={cx}
          y1={cy - 8}
          x2={cx}
          y2={cy + 8}
          stroke="rgba(87,73,244,0.3)"
          strokeWidth="0.5"
        />
      </svg>
    </div>
  );
}
