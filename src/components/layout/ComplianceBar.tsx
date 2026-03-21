"use client";

import { useState } from "react";
import { X, Info } from "lucide-react";

export default function ComplianceBar() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-amber-500/20 bg-[#0d0b1e]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex items-start gap-2 sm:items-center">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-400/70 sm:mt-0" />
          <p className="text-xs leading-relaxed text-white/40">
            <span className="text-amber-400/70 font-medium">温馨提示：</span>
            本平台内容仅供娱乐参考，不构成任何专业建议。命理解读请理性参考，重大决策请咨询专业人士。
            <button
              className="ml-1 text-[#8B7CF6] hover:underline"
              onClick={() => {}}
            >
              了解详情
            </button>
          </p>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="shrink-0 p-1 rounded text-white/30 hover:text-white/60 hover:bg-white/5 transition-colors"
          aria-label="关闭提示"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
