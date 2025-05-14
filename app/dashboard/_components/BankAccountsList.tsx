import {
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import { ChevronRight, CreditCard } from "lucide-react";
import { BankAccount } from "../_types/bankAccount";

const BankAccountsList = ({
  bankAccounts,
}: {
  bankAccounts: BankAccount[];
}) => {
  return (
    <Box padding="6" w="100%">
      <Flex justifyContent="space-between" mb={6}>
        <Heading size="md">Your Accounts</Heading>
        <Button colorScheme="blue" size="sm">
          Add Account
        </Button>
      </Flex>

      <VStack>
        {bankAccounts.map((account) => (
          <Card.Root
            width="100%"
            key={account.id}
            variant="outline"
            _hover={{ shadow: "md" }}
            transition="all 0.2s"
          >
            <CardBody>
              <Flex justifyContent="space-between" alignItems="center">
                <Box>
                  <Flex alignItems="center" gap={3}>
                    <Box p={2} bg="blue.50" borderRadius="md">
                      <CreditCard size={20} color="#3182ce" />
                    </Box>
                    <Box>
                      <Text fontWeight="medium">{account.accountType}</Text>
                      <Text fontSize="sm" color="gray.500">
                        {account.accountNumber}
                      </Text>
                    </Box>
                  </Flex>
                </Box>
                <Box textAlign="right">
                  <Text fontWeight="bold" fontSize="lg">
                    {account.currency}{" "}
                    {account.balance.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </Text>
                  <Flex
                    alignItems="center"
                    justifyContent="flex-end"
                    color="blue.500"
                    mt={1}
                  >
                    <Text fontSize="sm">View Details</Text>
                    <ChevronRight size={16} />
                  </Flex>
                </Box>
              </Flex>
            </CardBody>
          </Card.Root>
        ))}
      </VStack>
    </Box>
  );
};

export default BankAccountsList;
