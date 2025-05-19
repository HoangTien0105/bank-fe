"use client"

import { Box } from "@chakra-ui/react";
import LoginForm from "./_components/LoginForm";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

const Page = () => {
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    //Kiểm tra người dùng đã đăng nhập chưa
    if (session?.user) {
      router.push("/dashboard");
    }
  }, [session, router]);

  return (
    <Box className="flex min-h-screen justify-center items-center p-4 bg-black">
      <LoginForm />
    </Box>
  );
};

export default Page;
