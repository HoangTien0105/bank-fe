import { getUser, updateUser } from "@/api/test";
import { Box, Button, Text } from "@chakra-ui/react";
import { revalidatePath } from "next/cache";

const TestPage = async ({ params }: { params: { userId: string } }) => {
  const { userId } = await params;
  const user = await getUser(userId);

  return (
    <Box>
      <Text className="text-2xl">Username: {user.name}</Text>
      <form
        action={async (formData: FormData) => {
          "use server";
          console.log("Formdata", formData);
          const newName = formData.get("name") as string;
          await updateUser(userId, newName);
          revalidatePath(`/test/${userId}`);
        }}
      >
        <input
          className="text-white border border-gray-500 mx-2"
          placeholder="Your name"
          type="text"
          name="name"
        />
        <Button type="submit" colorPalette="blue" className="mx-2">
          Submit
        </Button>
      </form>
    </Box>
  );
};

export default TestPage;
