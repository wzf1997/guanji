"use client";

// 50 颗星的预定义数据（固定值，不用 Math.random，避免 SSR hydration mismatch）
// 字段：top(%), left(%), size(px), delay(s), dur(s), type: 'small'|'medium'|'large'
const STARS = [
  { top:  5, left:  8, size: 10, delay: 0.0, dur: 3.2, type: 'small'  },
  { top:  8, left: 23, size: 14, delay: 1.5, dur: 4.1, type: 'medium' },
  { top:  3, left: 42, size:  8, delay: 0.8, dur: 2.8, type: 'small'  },
  { top: 11, left: 61, size: 12, delay: 2.2, dur: 5.0, type: 'medium' },
  { top:  6, left: 78, size: 16, delay: 0.3, dur: 3.7, type: 'large'  },
  { top: 15, left: 15, size:  8, delay: 1.8, dur: 2.5, type: 'small'  },
  { top: 18, left: 35, size: 10, delay: 0.5, dur: 4.4, type: 'small'  },
  { top: 22, left: 55, size: 14, delay: 3.0, dur: 3.1, type: 'medium' },
  { top: 14, left: 88, size:  8, delay: 1.2, dur: 5.2, type: 'small'  },
  { top: 25, left: 72, size: 18, delay: 0.7, dur: 3.8, type: 'large'  },
  { top: 30, left:  5, size: 10, delay: 2.5, dur: 2.9, type: 'small'  },
  { top: 28, left: 28, size: 12, delay: 0.2, dur: 4.6, type: 'medium' },
  { top: 35, left: 48, size:  8, delay: 1.9, dur: 3.3, type: 'small'  },
  { top: 32, left: 65, size: 14, delay: 0.6, dur: 5.5, type: 'medium' },
  { top: 38, left: 83, size: 10, delay: 3.4, dur: 2.7, type: 'small'  },
  { top: 42, left: 18, size: 16, delay: 1.1, dur: 4.2, type: 'large'  },
  { top: 45, left: 38, size:  8, delay: 2.8, dur: 3.6, type: 'small'  },
  { top: 40, left: 57, size: 12, delay: 0.4, dur: 5.1, type: 'medium' },
  { top: 48, left: 75, size: 10, delay: 1.7, dur: 2.6, type: 'small'  },
  { top: 52, left: 92, size: 14, delay: 0.9, dur: 4.8, type: 'medium' },
  { top: 55, left: 10, size:  8, delay: 3.1, dur: 3.0, type: 'small'  },
  { top: 58, left: 30, size: 20, delay: 0.1, dur: 4.0, type: 'large'  },
  { top: 53, left: 50, size: 10, delay: 2.4, dur: 5.3, type: 'small'  },
  { top: 62, left: 68, size: 12, delay: 1.4, dur: 2.4, type: 'medium' },
  { top: 60, left: 85, size:  8, delay: 0.6, dur: 4.7, type: 'small'  },
  { top: 68, left:  3, size: 14, delay: 3.6, dur: 3.4, type: 'medium' },
  { top: 65, left: 22, size: 10, delay: 1.0, dur: 5.6, type: 'small'  },
  { top: 72, left: 43, size: 16, delay: 2.1, dur: 3.9, type: 'large'  },
  { top: 70, left: 60, size:  8, delay: 0.3, dur: 2.3, type: 'small'  },
  { top: 75, left: 78, size: 12, delay: 1.6, dur: 4.5, type: 'medium' },
  { top: 78, left: 13, size: 10, delay: 2.9, dur: 3.2, type: 'small'  },
  { top: 82, left: 32, size:  8, delay: 0.5, dur: 5.4, type: 'small'  },
  { top: 80, left: 52, size: 14, delay: 1.3, dur: 4.1, type: 'medium' },
  { top: 85, left: 70, size: 10, delay: 3.7, dur: 2.8, type: 'small'  },
  { top: 88, left: 90, size: 18, delay: 0.8, dur: 3.6, type: 'large'  },
  { top: 90, left:  7, size:  8, delay: 2.0, dur: 5.0, type: 'small'  },
  { top: 92, left: 25, size: 12, delay: 1.2, dur: 4.3, type: 'medium' },
  { top: 87, left: 45, size: 10, delay: 0.4, dur: 2.7, type: 'small'  },
  { top: 95, left: 63, size:  8, delay: 3.3, dur: 5.1, type: 'small'  },
  { top: 93, left: 80, size: 14, delay: 1.5, dur: 3.5, type: 'medium' },
  { top: 20, left: 95, size: 10, delay: 2.7, dur: 4.9, type: 'small'  },
  { top: 50, left:  2, size:  8, delay: 0.2, dur: 2.5, type: 'small'  },
  { top: 37, left: 97, size: 12, delay: 1.8, dur: 4.4, type: 'medium' },
  { top: 77, left: 96, size:  8, delay: 3.5, dur: 3.1, type: 'small'  },
  { top: 10, left: 50, size: 16, delay: 0.9, dur: 3.8, type: 'large'  },
  { top: 46, left: 28, size:  8, delay: 2.3, dur: 5.2, type: 'small'  },
  { top: 67, left: 40, size: 12, delay: 1.1, dur: 4.6, type: 'medium' },
  { top: 84, left: 55, size: 10, delay: 0.7, dur: 2.9, type: 'small'  },
  { top: 19, left: 70, size:  8, delay: 3.9, dur: 5.5, type: 'small'  },
  { top: 56, left: 18, size: 14, delay: 1.4, dur: 3.3, type: 'medium' },
] as const;

// 四芒星 SVG：中心 (0,0)，4 个长尖（上下左右）+ 4 个短尖（斜角方向）
// inner 控制腰部收窄程度，0.18 × size 产生典型 sparkle 比例
function SparkleIcon({ size, color }: { size: number; color: string }) {
  const half = size / 2;
  const inner = size * 0.18;
  const pts = [
    [0, -half],       // 上长尖
    [inner, -inner],  // 右上短
    [half, 0],        // 右长尖
    [inner, inner],   // 右下短
    [0, half],        // 下长尖
    [-inner, inner],  // 左下短
    [-half, 0],       // 左长尖
    [-inner, -inner], // 左上短
  ]
    .map(([x, y]) => `${x},${y}`)
    .join(" ");

  return (
    <svg
      width={size}
      height={size}
      viewBox={`${-half} ${-half} ${size} ${size}`}
      style={{ overflow: "visible" }}
      aria-hidden="true"
    >
      <polygon points={pts} fill={color} />
    </svg>
  );
}

export default function StarField() {
  return (
    <div
      aria-hidden="true"
      className="star-field-container"
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        overflow: "hidden",
      }}
    >
      {STARS.map((star, i) => {
        const color =
          star.type === "large"
            ? "rgba(220,210,255,0.95)"
            : star.type === "medium"
            ? "rgba(255,255,255,0.85)"
            : "rgba(255,255,255,0.70)";

        const glowFilter =
          star.type === "large"
            ? `drop-shadow(0 0 ${star.size * 0.5}px rgba(180,160,255,0.9)) drop-shadow(0 0 ${star.size}px rgba(120,100,255,0.5))`
            : star.type === "medium"
            ? `drop-shadow(0 0 ${star.size * 0.4}px rgba(255,255,255,0.7))`
            : `drop-shadow(0 0 ${star.size * 0.3}px rgba(255,255,255,0.5))`;

        const sizeClass =
          star.type === "large"
            ? "star-lg"
            : star.type === "medium"
            ? "star-md"
            : "star-sm";

        return (
          <div
            key={i}
            className={sizeClass}
            style={{
              position: "absolute",
              top: `${star.top}%`,
              left: `${star.left}%`,
              transform: "translate(-50%, -50%)",
              filter: glowFilter,
              animationName: "starSparkle",
              animationDuration: `${star.dur}s`,
              animationDelay: `${star.delay}s`,
              animationTimingFunction: "ease-in-out",
              animationIterationCount: "infinite",
              animationDirection: i % 2 === 0 ? "alternate" : "alternate-reverse",
            }}
          >
            <SparkleIcon size={star.size} color={color} />
          </div>
        );
      })}
    </div>
  );
}
