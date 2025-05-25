import { Box, Heading } from "@chakra-ui/react";
import TransferForm from "../../_components/TransferForm";

const TransferPage = async () => {
  return (
    <Box>
      <Heading mb={6}>Transfer</Heading>
      <TransferForm />
    </Box>
  );
};

export default TransferPage;
