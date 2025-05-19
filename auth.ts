import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { login } from "./api/auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
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
    async jwt({ token, user }) {
      return { ...token, ...user };
    },

    async session({ session, token }) {
      session.user = token as any;
      return session;
    },
  },
});
