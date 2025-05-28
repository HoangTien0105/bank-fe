import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { login, logout, refreshTokenV2 } from "./api/auth";
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
        username: {},
        password: {},
        accessToken: {},
        refreshToken: {},
        tokenType: {},
        expiresIn: {},
      },
      authorize: async (credentials) => {
        if (credentials?.username && credentials?.password) {
          try {
            const validationResult =
              await LoginSchema.safeParseAsync(credentials);
            if (!validationResult.success) {
              console.error("Sign in validation eror");
              return null;
            }

            console.log("Auth validation result data:", validationResult.data);

            const data = await login(validationResult.data);

            if (data?.success) {
              return data?.response;
            }
          } catch (error) {
            console.error("NextAuth authorize error", error);
            return null;
          }
        }

        if (credentials?.accessToken && credentials?.refreshToken) {
          return {
            accessToken: credentials.accessToken,
            refreshToken: credentials.refreshToken,
            tokenType: credentials.tokenType || "Bearer",
            expiresIn: credentials.expiresIn || 3600,
          };
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
  },
  events: {
    async signOut() {
      try {
        const result = await logout();

        if (result.success) {
          console.log("Backend logout successful");
        } else {
          console.error("Backend logout failed:", result.error);
        }
      } catch (error) {
        console.error("Logout event error:", error);
      }
    },
  },
});
