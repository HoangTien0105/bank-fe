import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { login } from "./api/auth";

enum UserRole {
  ADMIN = "ADMIN",
  CUSTOMER = "CUSTOMER"
}

const ROLE_REDIRECTS: Record<UserRole, String> = {
  [UserRole.ADMIN]: "/dashboard",
  [UserRole.CUSTOMER]: "/customer/dashboard"
}

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

    // async redirect({url , baseUrl}) {
    //   //Nếu đã đăng nhập, điều hướng theo role
    //   const session = await auth();
    //   if(session?.user?.role){
    //     const userRole = session.user.role as UserRole;
    //     if(Object.values(UserRole).includes(userRole)){
    //       const roleRedirect = ROLE_REDIRECTS[userRole];
    //       return `${baseUrl}${roleRedirect}`;
    //     }
    //   }

    //   return `${baseUrl}/dashboard`;
    // }
  },
});
