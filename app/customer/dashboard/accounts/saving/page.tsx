import SavingAccountForm from "@/app/customer/_components/SavingAccountForm";
import { Box, Flex, Heading } from "@chakra-ui/react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const CreateSavingAccountPage = async () => {
  return (
    <Box>
      <Flex alignItems="center" gap={3} mb={6}>
        <Link href="/customer/dashboard/accounts">
          <ArrowLeft size={20} />
        </Link>
        <Heading userSelect="none">
          Create Saving Account
        </Heading>
      </Flex>
      <SavingAccountForm />
    </Box>
  );
};

export default CreateSavingAccountPage;
