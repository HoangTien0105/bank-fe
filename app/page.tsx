import { auth, signOut } from "@/auth";
import { Box, Button, Heading } from "@chakra-ui/react";

const Home = async () => {
  const session = await auth();
  console.log("Session:", session);

  return (
    <Box className="text-center">
      <Heading>Welcome to TienDaDen Bank</Heading>
      <Button
        onClick={async () => {
          "use server";
          await signOut();
        }}
      >
        Sign out
      </Button>
    </Box>
  );
};
export default Home;
