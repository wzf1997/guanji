import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ComplianceBar from "@/components/layout/ComplianceBar";

export const metadata: Metadata = {
  title: {
    template: "%s | 观己",
    default: "观己 · 观己知序，安住当下",
  },
  description:
    "基于东方命理哲学，结合现代心理科学，为你提供温和共情的人生参考。八字排盘、AI命理师、每日运势，帮助都市群体化解焦虑、辅助决策。",
};

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
      <ComplianceBar />
    </>
  );
}
