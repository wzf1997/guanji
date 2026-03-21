import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "登录 | 观己",
  description: "登录观己，开启你的命理之旅",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
