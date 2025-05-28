// app/api/auth/update-session/route.ts
import { NextRequest, NextResponse } from "next/server";
import { signIn } from "@/auth";

export async function POST(req: NextRequest) {
  const data = await req.json();

  await signIn("credentials", {
    ...data,
    redirect: false,
  });

  return NextResponse.json({ success: true });
}
