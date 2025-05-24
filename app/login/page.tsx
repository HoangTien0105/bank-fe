import { Box } from "@chakra-ui/react";
import LoginForm from "./_components/LoginForm";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const Page = async () => {
  const session = await auth();
  if (session) {
    redirect(`/${session.user.role.toLowerCase()}/dashboard`);
  }

  return (
    <Box className="flex min-h-screen justify-center items-center">
      <LoginForm />
    </Box>
  );
};

export default Page;
