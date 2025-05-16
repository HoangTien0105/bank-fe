import { getUser, updateUser } from "@/api/test";
import { Box, Button, Text } from "@chakra-ui/react";

const TestPage = async ({ params }: { params: { userId: string } }) => {
  const user = await getUser(params.userId);

  return (
    <Box>
      <Text className="text-2xl">Username: {user.name}</Text>
      <form
        action={async (formData: FormData) => {
          "use server";
          const newName = formData.get("name") as string;
          await updateUser(params.userId, newName);
        }}
      >
        <input
          className="bg-white text-black-400 border-gray-500 mx-2"
          type="text"
          name="name"
        />
        <Button colorPalette="blue" className="mx-2">
          Submit
        </Button>
      </form>
    </Box>
  );
};

export default TestPage;
