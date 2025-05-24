import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import { login, logout } from "./api/auth";
import { LoginSchema } from "./app/login/_types/login";

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
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
          const payload = {
            username: credentials?.username as string,
            password: credentials?.password as string,
          };

          const validationResult = await LoginSchema.safeParseAsync(payload);
          if (!validationResult.success) {
            console.error("Sign in validation eror");
            return null;
          }

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
      if (user) {
        return { ...token, ...user };
      }

      if (trigger === "update" && session) {
        return { ...token, ...session };
      }

      return token;
    },
    async session({ session, token }) {
      session.user = token as any;
      return session;
    },
    // async authorized({ auth }) {
    //   return !!auth;
    // },
  },
  events: {
    async signOut(event) {
      const token = "token" in event ? event.token : null;
      try {
        const result = await logout();

        if (result.success !== false) {
          console.log("Backend logout successful");
        } else {
          console.warn("Backend logout failed:", result.error);
        }
      } catch (error) {
        console.error("Logout event error:", error);
      }
    },
  },
});
