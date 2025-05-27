import { getAllAccounts } from "@/api/account";
import PaginationComponent from "@/components/common/Pagination";
import { Accounts } from "@/types/accounts";
import {
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  Heading,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { ChevronRight, CreditCard, Plus } from "lucide-react";
import Link from "next/link";

interface AccountsPageProps {
  searchParams?: {
    page?: string;
  };
}

const AccountsPage = async ({ searchParams }: AccountsPageProps) => {
  const itemsPerPage = 5;
  const page = await searchParams;
  const currentPage = Number(page?.page) || 1;
  const offset = (currentPage - 1) * itemsPerPage;

  const response = await getAllAccounts({
    offset,
    limit: itemsPerPage,
    sortBy: "type",
    sortDirection: "ASC"
  });

  const accounts = response?.results || [];
  const totalPages = response?.totalPages || 1;

  const cardBg = "bg";
  const cardHoverBg = "bg.muted";
  const iconBg = "blue.subtle";
  const iconColor = "blue.solid";

  return (
    <Box w="full" maxW="4xl" margin="auto">
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Heading size="md">Your accounts</Heading>
        <Link href="/customer/dashboard/accounts/saving">
          <Button colorScheme="blue" size="sm">
            <Plus size={16} />
            Create saving accounts
          </Button>
        </Link>
      </Flex>
      {accounts.length === 0 ? (
        <Box textAlign="center" py={10}>
          <Text fontSize="lg">You don't have any accounts</Text>
        </Box>
      ) : (
        <Stack>
          <VStack align="stretch" userSelect="none">
            {accounts.map((account: Accounts) => (
              <Card.Root
                key={account.id}
                bg={cardBg}
                borderWidth="1px"
                borderRadius="lg"
                overflow="hidden"
                boxShadow="sm"
                _hover={{
                  shadow: "md",
                  bg: cardHoverBg,
                  transform: "translateY(-2px)",
                }}
                transition="all 0.2s ease-in-out"
              >
                <CardBody>
                  <Flex justifyContent="space-between" alignItems="center">
                    <Box>
                      <Flex alignItems="center" gap={3}>
                        <Box p={2} bg={iconBg} borderRadius="md">
                          <CreditCard size={20} color={iconColor} />
                        </Box>
                        <Box>
                          <Text fontWeight="medium">{account.accountType}</Text>
                          <Text fontSize="sm" color="gray.500">
                            {account.id}
                          </Text>
                        </Box>
                      </Flex>
                    </Box>
                    <Box textAlign="right">
                      <VStack fontWeight="bold" fontSize="lg" userSelect="none">
                        {account.balance.toLocaleString("vi-VN", {
                          minimumFractionDigits: 2,
                        })}{" "}
                        VND
                        <Flex
                          alignItems="center"
                          justifyContent="flex-end"
                          color="blue.500"
                          mt={1}
                          w="full"
                          gap={1}
                          userSelect="none"
                        >
                          <Link
                            href={`/customer/dashboard/accounts/${account.id}`}
                            key={account.id}
                            color="blue.500"
                          >
                            View details
                          </Link>
                          <ChevronRight size={16} />
                        </Flex>
                      </VStack>
                    </Box>
                  </Flex>
                </CardBody>
              </Card.Root>
            ))}
          </VStack>

          {totalPages > 1 && (
            <PaginationComponent
              currentPage={currentPage}
              totalPages={totalPages}
            />
          )}
        </Stack>
      )}
    </Box>
  );
};

export default AccountsPage;
