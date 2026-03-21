import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/providers/SessionProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "观己 · 观己知序，安住当下",
  description:
    "基于东方命理哲学，结合现代心理科学，为你提供温和共情的人生参考。",
  keywords: ["命理", "八字", "运势", "AI命理师", "观己", "心理", "东方哲学"],
  openGraph: {
    title: "观己 · 观己知序，安住当下",
    description: "东方命理 × 现代心理学双轨解读，帮助都市群体化解焦虑、辅助决策",
    locale: "zh_CN",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className={`${inter.className} antialiased`}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
