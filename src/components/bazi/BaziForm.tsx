"use client";

import { useState } from "react";
import { Loader2, Info } from "lucide-react";
import type { BaziInfo } from "@/app/(main)/bazi/page";

// ─── 常量数据 ────────────────────────────────────────────────
const SHICHEN_LIST = [
  { label: "子时", range: "23:00 – 01:00", hour: 0 },
  { label: "丑时", range: "01:00 – 03:00", hour: 2 },
  { label: "寅时", range: "03:00 – 05:00", hour: 4 },
  { label: "卯时", range: "05:00 – 07:00", hour: 6 },
  { label: "辰时", range: "07:00 – 09:00", hour: 8 },
  { label: "巳时", range: "09:00 – 11:00", hour: 10 },
  { label: "午时", range: "11:00 – 13:00", hour: 12 },
  { label: "未时", range: "13:00 – 15:00", hour: 14 },
  { label: "申时", range: "15:00 – 17:00", hour: 16 },
  { label: "酉时", range: "17:00 – 19:00", hour: 18 },
  { label: "戌时", range: "19:00 – 21:00", hour: 20 },
  { label: "亥时", range: "21:00 – 23:00", hour: 22 },
];

const PROVINCES: Record<string, string[]> = {
  北京市: ["东城区", "西城区", "朝阳区", "海淀区", "丰台区"],
  上海市: ["黄浦区", "徐汇区", "长宁区", "静安区", "浦东新区"],
  广东省: ["广州市", "深圳市", "佛山市", "东莞市", "珠海市"],
  浙江省: ["杭州市", "宁波市", "温州市", "嘉兴市", "绍兴市"],
  江苏省: ["南京市", "苏州市", "无锡市", "常州市", "南通市"],
  四川省: ["成都市", "绵阳市", "德阳市", "宜宾市", "南充市"],
  湖北省: ["武汉市", "宜昌市", "襄阳市", "荆州市", "黄石市"],
  陕西省: ["西安市", "咸阳市", "宝鸡市", "延安市", "汉中市"],
  河南省: ["郑州市", "洛阳市", "开封市", "南阳市", "新乡市"],
  山东省: ["济南市", "青岛市", "烟台市", "潍坊市", "淄博市"],
};

// ─── 子组件：标签 ────────────────────────────────────────────
function Label({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}

// ─── 子组件：输入框 ──────────────────────────────────────────
function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full h-11 px-4 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] text-sm placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)] transition-all ${props.className ?? ""}`}
    />
  );
}

// ─── 子组件：Select ──────────────────────────────────────────
function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`w-full h-11 px-4 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)] transition-all appearance-none cursor-pointer ${props.className ?? ""}`}
    />
  );
}

// ─── Props ───────────────────────────────────────────────────
interface BaziFormProps {
  onSubmit: (info: BaziInfo) => void;
  isLoading: boolean;
}

// ─── 主组件 ──────────────────────────────────────────────────
export default function BaziForm({ onSubmit, isLoading }: BaziFormProps) {
  const [isLunar, setIsLunar] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    name: "",
    gender: "male" as "male" | "female",
    birthYear: new Date().getFullYear() - 25,
    birthMonth: 6,
    birthDay: 15,
    birthHour: 8,
  });

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "请输入姓名";
    if (!selectedProvince) e.province = "请选择省份";
    if (!selectedCity) e.city = "请选择城市";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      ...form,
      birthPlace: `${selectedProvince}${selectedCity}`,
      isLunar,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-6"
    >
      {/* 姓名 */}
      <div>
        <Label required>姓名</Label>
        <Input
          placeholder="请输入您的姓名"
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
        />
        {errors.name && (
          <p className="text-xs text-red-500 mt-1">{errors.name}</p>
        )}
      </div>

      {/* 性别 */}
      <div>
        <Label required>性别</Label>
        <div className="grid grid-cols-2 gap-3">
          {(["male", "female"] as const).map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => set("gender", g)}
              className={`h-11 rounded-xl border text-sm font-medium transition-all ${
                form.gender === g
                  ? "border-[var(--primary)] bg-[var(--primary)]/8 text-[var(--primary)]"
                  : "border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--primary)]/50"
              }`}
            >
              {g === "male" ? "♂ 男" : "♀ 女"}
            </button>
          ))}
        </div>
      </div>

      {/* 出生日期 */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label required>出生日期</Label>
          {/* 公历/农历 Tab */}
          <div className="flex rounded-lg border border-[var(--border)] overflow-hidden">
            {[
              { key: false, label: "公历" },
              { key: true, label: "农历" },
            ].map(({ key, label }) => (
              <button
                key={String(key)}
                type="button"
                onClick={() => setIsLunar(key)}
                className={`px-3 py-1 text-xs transition-all ${
                  isLunar === key
                    ? "bg-[var(--primary)] text-white"
                    : "text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="relative">
            <Input
              type="number"
              placeholder="年"
              min={1900}
              max={2100}
              value={form.birthYear}
              onChange={(e) => set("birthYear", Number(e.target.value))}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--muted-foreground)] pointer-events-none">
              年
            </span>
          </div>
          <div className="relative">
            <Select
              value={form.birthMonth}
              onChange={(e) => set("birthMonth", Number(e.target.value))}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>
                  {isLunar
                    ? ["正", "二", "三", "四", "五", "六", "七", "八", "九", "十", "冬", "腊"][m - 1] + "月"
                    : `${m}月`}
                </option>
              ))}
            </Select>
          </div>
          <div className="relative">
            <Select
              value={form.birthDay}
              onChange={(e) => set("birthDay", Number(e.target.value))}
            >
              {Array.from({ length: 30 }, (_, i) => i + 1).map((d) => (
                <option key={d} value={d}>
                  {d}日
                </option>
              ))}
            </Select>
          </div>
        </div>
      </div>

      {/* 出生时辰 */}
      <div>
        <Label required>出生时辰</Label>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {SHICHEN_LIST.map((s) => (
            <button
              key={s.label}
              type="button"
              onClick={() => set("birthHour", s.hour)}
              className={`rounded-xl border py-2.5 px-1 text-center transition-all ${
                form.birthHour === s.hour
                  ? "border-[var(--primary)] bg-[var(--primary)]/8 text-[var(--primary)]"
                  : "border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--primary)]/40"
              }`}
            >
              <p className="text-sm font-semibold">{s.label}</p>
              <p className="text-[10px] mt-0.5 opacity-70">{s.range}</p>
            </button>
          ))}
        </div>
      </div>

      {/* 出生省市 */}
      <div>
        <Label required>出生省市</Label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Select
              value={selectedProvince}
              onChange={(e) => {
                setSelectedProvince(e.target.value);
                setSelectedCity("");
                setErrors((prev) => ({ ...prev, province: "" }));
              }}
            >
              <option value="">请选择省份</option>
              {Object.keys(PROVINCES).map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </Select>
            {errors.province && (
              <p className="text-xs text-red-500 mt-1">{errors.province}</p>
            )}
          </div>
          <div>
            <Select
              value={selectedCity}
              disabled={!selectedProvince}
              onChange={(e) => {
                setSelectedCity(e.target.value);
                setErrors((prev) => ({ ...prev, city: "" }));
              }}
            >
              <option value="">请选择城市</option>
              {(PROVINCES[selectedProvince] ?? []).map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
            {errors.city && (
              <p className="text-xs text-red-500 mt-1">{errors.city}</p>
            )}
          </div>
        </div>
      </div>

      {/* 真太阳时提示 */}
      <div className="flex items-start gap-2 px-4 py-3 rounded-xl bg-[var(--primary)]/6 border border-[var(--primary)]/20">
        <Info size={14} className="text-[var(--primary)] mt-0.5 flex-shrink-0" />
        <p className="text-xs text-[var(--primary)] leading-5">
          系统将根据您的出生地自动进行{" "}
          <strong>真太阳时换算</strong>，以获得更精准的命盘结果。
        </p>
      </div>

      {/* 提交按钮 */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full h-12 rounded-2xl bg-[var(--primary)] text-white font-semibold text-base flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            正在排盘中…
          </>
        ) : (
          <>
            <span>☯</span>
            生成我的命盘
          </>
        )}
      </button>
    </form>
  );
}
