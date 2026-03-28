import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { createServiceRoleClient } from "@/lib/supabase";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30天
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "用户名", type: "text" },
        password: { label: "密码", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        const supabase = createServiceRoleClient();
        // 通过 name 字段查找用户名登录的用户
        const { data: user } = await supabase
          .from("users")
          .select("id, email, name, avatar_url, password_hash, tier, ai_chat_remaining")
          .eq("name", credentials.username)
          .eq("provider", "credentials")
          .single();

        if (!user?.password_hash) return null;

        const valid = await bcrypt.compare(credentials.password, user.password_hash);
        if (!valid) return null;

        supabase.from("users").update({ last_login_at: new Date().toISOString() })
          .eq("id", user.id).then();

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.avatar_url,
          supabaseId: user.id,
          tier: user.tier,
          aiChatRemaining: user.ai_chat_remaining,
        } as any;
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    // 登录时同步用户到 Supabase（仅 OAuth 走这里，Credentials 已在 authorize 里处理）
    async signIn({ user, account }) {
      if (!account || account.type === "credentials") return true; // Credentials 直接放行
      if (!user.email) return false;
      try {
        const supabase = createServiceRoleClient();
        const providerId = account?.providerAccountId ?? user.id;
        const { data, error } = await supabase.rpc("get_or_create_user", {
          p_provider_id: providerId,
          p_email: user.email,
          p_name: user.name ?? null,
          p_avatar_url: user.image ?? null,
          p_provider: account?.provider ?? "oauth",
        });
        if (error) {
          console.error("[Auth] Supabase sync error:", error.message);
          // 同步失败仍允许登录，避免用户体验受损
          return true;
        }
        if (data?.[0]) {
          (user as any).supabaseId = data[0].id;
          (user as any).tier = data[0].tier;
          (user as any).aiChatRemaining = data[0].ai_chat_remaining;
        }
        return true;
      } catch (err) {
        console.error("[Auth] Unexpected signIn error:", err);
        return false;
      }
    },

    // JWT：将 Supabase 用户数据写入 token
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.supabaseId = (user as any).supabaseId ?? user.id;
        token.tier = (user as any).tier ?? "free";
        token.aiChatRemaining = (user as any).aiChatRemaining ?? 0;
      }
      // 支持客户端手动刷新 session（如扣减 AI 次数后更新）
      if (trigger === "update" && session?.aiChatRemaining !== undefined) {
        token.aiChatRemaining = session.aiChatRemaining;
      }
      return token;
    },

    // Session：将 token 数据暴露给客户端
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.supabaseId ?? token.sub;
        (session.user as any).tier = token.tier ?? "free";
        (session.user as any).aiChatRemaining = token.aiChatRemaining ?? 0;
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (url.startsWith(baseUrl)) return url;
      return `${baseUrl}/bazi`;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
