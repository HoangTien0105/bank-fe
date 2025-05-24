import { getAccountById } from "@/api/account";
import { getTransactionsByAccountById } from "@/api/transaction";
import TransactionsList from "@/components/transactions/TransactionsList";
import {
  Box,
  Card,
  CardBody,
  Flex,
  Grid,
  GridItem,
  Heading,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { ArrowLeft, CreditCard } from "lucide-react";
import Link from "next/link";
import { BiCalendar } from "react-icons/bi";
import { FaLandmark } from "react-icons/fa";
import { LuArrowUpDown } from "react-icons/lu";

interface AccountDetailsPageProps {
  params: {
    id: string;
  };
  searchParams?: {
    page?: string;
    // sortBy?: string;
    // sortDirection?: string;
  };
}

const AccountDetailsPage = async ({
  params,
  searchParams = {},
}: AccountDetailsPageProps) => {
  const { id } = params;
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const itemsPerPage = 8;
  const offset = (page - 1) * itemsPerPage;

  const account = await getAccountById(id);

  const apiParams = {
    offset,
    limit: itemsPerPage,
  };

  const response = await getTransactionsByAccountById(id, apiParams);
  console.log(response);
  const transactions = response?.results || [];
  const totalItems = response?.totalRows || 0;
  const totalPages = response?.totalPages || 1;

  const cardBg = "bg";
  const cardHoverBg = "bg.muted";
  const iconBg = "blue.subtle";
  const iconColor = "blue.solid";

  if (!account) {
    return (
      <Box textAlign="center" py={10}>
        <Text fontSize="lg">Account not found</Text>
      </Box>
    );
  }

  return (
    <Box w="full" maxW="4xl" margin="auto">
      <Stack>
        <Card.Root
          bg={cardBg}
          borderWidth="1px"
          borderRadius="lg"
          overflow="hidden"
          boxShadow="md"
        >
          <CardBody>
            <VStack align="stretch">
              <Flex justifyContent="space-between" alignItems="center">
                <Flex alignItems="center" gap={2}>
                  <Link href="/customer/dashboard/accounts">
                    <ArrowLeft size={20} />
                  </Link>
                  <Heading size="md">{account.accountType}</Heading>
                </Flex>
                <Text fontWeight="bold" fontSize="xl">
                  {account.balance.toLocaleString("vi-VN", {
                    minimumFractionDigits: 2,
                  })}{" "}
                  VND
                </Text>
              </Flex>

              <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                <GridItem>
                  <Flex alignItems="center" gap={3}>
                    <Box p={2} bg={iconBg} borderRadius="md">
                      <CreditCard size={20} color={iconColor} />
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.500">
                        Num
                      </Text>
                      <Text fontWeight="medium">{account.id}</Text>
                    </Box>
                  </Flex>
                </GridItem>
                <GridItem>
                  <Flex alignItems="center" gap={3}>
                    <Box p={2} bg={iconBg} borderRadius="md">
                      <BiCalendar size={20} color={iconColor} />
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.500">
                        Open date
                      </Text>
                      <Text fontWeight="medium">
                        {new Date(account.openDate).toLocaleDateString()}
                      </Text>
                    </Box>
                  </Flex>
                </GridItem>

                <GridItem>
                  <Flex alignItems="center" gap={3}>
                    <Box p={2} bg={iconBg} borderRadius="md">
                      <LuArrowUpDown size={20} color={iconColor} />
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.500">
                        Transaction Limit
                      </Text>
                      <Text fontWeight="medium">
                        {account.transactionLimit !== null
                          ? account.transactionLimit.toLocaleString("vi-VN")
                          : "NULL"}{" "}
                        VND
                      </Text>
                    </Box>
                  </Flex>
                </GridItem>

                <GridItem>
                  <Flex alignItems="center" gap={3}>
                    <Box p={2} bg={iconBg} borderRadius="md">
                      <FaLandmark size={20} color={iconColor} />
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.500">
                        Interest rate
                      </Text>
                      <Text fontWeight="medium">{account.interestRate}%</Text>
                    </Box>
                  </Flex>
                </GridItem>
              </Grid>
            </VStack>
          </CardBody>
        </Card.Root>
        <Box>
          <TransactionsList
            transactions={transactions}
            totalItems={totalItems}
            totalPages={totalPages}
            currentPage={page}
            title={`Transaction details - ${account.accountType}`}
          />
        </Box>
      </Stack>
    </Box>
  );
};

export default AccountDetailsPage;
