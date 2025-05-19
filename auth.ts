import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { login } from "./api/auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        username: { label: "Username", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          // Tránh gọi API nếu không credentials
          if (!credentials?.username || !credentials?.password) {
            return null;
          }

          const payload = {
            username: credentials?.username as string,
            password: credentials?.password as string,
          };
          const data = await login(payload);

          if (data?.success) {
            return data?.response;
          }
        } catch (error) {
          console.error("NextAuth authorize error", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Khi đăng nhập lần đầu
      if (user) {
        return { ...token, ...user };
      }

      // Khi gọi update session
      if (trigger === "update" && session) {
        return { ...token, ...session };
      }

      return token;
    },

    async session({ session, token }) {
      session.user = token as any;
      return session;
    },
  },
});
