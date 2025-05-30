import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      accessToken: string;
      refreshToken: string;
      tokenType: string;
      expiresIn: number;
      role: string;
    };
  }
}
