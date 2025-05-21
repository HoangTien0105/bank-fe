import { auth, signIn, signOut } from "@/auth";

export interface SessionToken {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

export const getSession = async () => {
  return await auth();
};

export const updateSession = async (token: Partial<SessionToken>) => {
  const session = await auth();
  if (!session) return null;

  const updatedToken = {
    accessToken: token.accessToken || session.user.accessToken,
    refreshToken: token.refreshToken || session.user.refreshToken,
    tokenType: token.tokenType || session.user.tokenType,
    expiresIn: token.expiresIn || session.user.expiresIn,
  };

  return await signIn("credentials", {
    ...updatedToken,
    redirect: false,
  });
};

export const clearSession = async () => {
  await signOut();
};

