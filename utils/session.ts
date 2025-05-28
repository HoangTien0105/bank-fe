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

  await signIn("credentials", {
    ...updatedToken,
    redirect: false,
  });
};

export const updateSessionV2 = async (token: Partial<SessionToken>) => {
  await fetch("http://localhost:3000/api/auth/update-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(token),
  });
};

export const clearSession = async () => {
  await signOut();
};
