import { auth } from "@/auth";
import { Box, Heading } from "@chakra-ui/react";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function CustomerLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  if (!session?.user || session.user.role !== "CUSTOMER") {
    redirect("/login");
  }

  return (
    <Box p={6} height="100vh" position="relative" >
      <Heading mb={4}>Dashboard</Heading>
      {children}
    </Box>
  );
}
