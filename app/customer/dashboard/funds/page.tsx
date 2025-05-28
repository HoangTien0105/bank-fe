import { Box, Heading } from "@chakra-ui/react";
import FundsForm from "../../_components/FundsForm";

const FundsPage = async () => {
  return (
    <Box>
      <Heading mb={6} userSelect="none">Funds page</Heading>
      <FundsForm />
    </Box>
  );
};

export default FundsPage;
