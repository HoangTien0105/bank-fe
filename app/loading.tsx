import { Box, Spinner, Text, VStack } from "@chakra-ui/react";

const Loading = () => {
  return (
    <Box className="flex min-h-screen justify-center items-center">
      <VStack colorPalette="blue">
        <Spinner color="colorPalette.600" />
        <Text color="colorPalette.600">Loading...</Text>
      </VStack>{" "}
    </Box>
  );
};

export default Loading;
