"use client";

import { Transaction } from "@/types/transaction";
import { useState } from "react";
import { useColorModeValue } from "../ui/color-mode";
import {
  Box,
  ButtonGroup,
  Flex,
  Heading,
  IconButton,
  Input,
  InputGroup,
  Pagination,
  Spinner,
  Stack,
  Table,
  Text,
} from "@chakra-ui/react";
import { LuChevronLeft, LuChevronRight, LuSearch, LuX } from "react-icons/lu";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import TransactionDetail from "./TransactionDetails";

interface TransactionsListProps {
  transactions: Transaction[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  isLoading?: boolean;
  customerId?: string;
  title?: string;
  showSearch?: boolean;
  onPageChange?: (page: number) => void;
}

const TransactionsList = ({
  transactions = [],
  totalItems = 0,
  totalPages = 1,
  currentPage = 1,
  isLoading = false,
  customerId,
  title = "Transactions list",
  showSearch = true,
  onPageChange,
}: TransactionsListProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const itemsPerPage = 8;

  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const headerBg = useColorModeValue("gray.100", "gray.800");
  const hoverBg = useColorModeValue("gray.50", "gray.600");

  const handlePageChange = (details: { page: number }) => {
    if (onPageChange) {
      onPageChange(details.page);
    } else {
      // Fallback to client-side navigation if no callback provided
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", details.page.toString());
      router.push(`${pathname}?${params.toString()}`);
    }
  };

  const handleTransactionClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <Box
      w="full"
      maxW={"full"}
      margin={"auto"}
    >
      <Flex
        justifyContent="space-between"
        mb={6}
        alignItems="center"
        flexWrap="wrap"
        gap={3}
      >
        <Heading size="md" userSelect="none">{title}</Heading>
      </Flex>
      {isLoading ? (
        <Flex justifyContent="center" my={10}>
          <Spinner size="xl" color="blue.500" />
        </Flex>
      ) : transactions.length === 0 ? (
        <Box textAlign="center" py={10}>
          <Text fontSize="lg">No transactions found</Text>
        </Box>
      ) : (
        <Stack spaceY={4}>
          <Box
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            boxShadow="sm"
            position="relative"
            userSelect="none"
          >
            <Table.ScrollArea borderWidth="1px" maxW="full">
              <Table.Root size="lg">
                <Table.Header
                  position="sticky"
                  top={0}
                  bg={headerBg}
                  zIndex={1}
                  boxShadow="sm"
                  suppressHydrationWarning
                >
                  <Table.Row userSelect="none">
                    <Table.ColumnHeader>ID</Table.ColumnHeader>
                    <Table.ColumnHeader>Type</Table.ColumnHeader>
                    <Table.ColumnHeader minWidth={"150px"}>
                      Amount
                    </Table.ColumnHeader>
                    <Table.ColumnHeader minWidth={"250px"}>
                      Location
                    </Table.ColumnHeader>
                    <Table.ColumnHeader>Transaction Date</Table.ColumnHeader>
                    <Table.ColumnHeader minWidth={"250px"}>
                      Description
                    </Table.ColumnHeader>
                    <Table.ColumnHeader>From</Table.ColumnHeader>
                    <Table.ColumnHeader>To</Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>

                <Table.Body userSelect="none">
                  {transactions.map((item, index) => (
                    <Table.Row
                      key={item.id}
                      cursor="pointer"
                      suppressHydrationWarning
                      _hover={{
                        bg: hoverBg,
                        transform: "translateY(-1px)",
                        boxShadow: "sm",
                        transition: "all 0.2s ease-in-out",
                      }}
                      onClick={() => handleTransactionClick(item)}
                    >
                      <Table.Cell>
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </Table.Cell>
                      <Table.Cell>{item.type}</Table.Cell>
                      <Table.Cell suppressHydrationWarning>
                        {typeof item.amount === "number"
                          ? item.amount.toLocaleString("vn-VN", {
                              minimumFractionDigits: 2,
                            })
                          : item.amount}{" "}
                        VNĐ
                      </Table.Cell>
                      <Table.Cell>{item.location}</Table.Cell>
                      <Table.Cell suppressHydrationWarning>
                        {new Date(item.transactionDate).toLocaleDateString()}
                      </Table.Cell>
                      <Table.Cell>{item.description}</Table.Cell>
                      <Table.Cell>
                        {item.fromAccountId !== null
                          ? item.fromAccountId
                          : "NULL"}
                      </Table.Cell>
                      <Table.Cell>
                        {item.toAccountId !== null ? item.toAccountId : "NULL"}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Table.ScrollArea>
          </Box>

          <Pagination.Root
            count={totalItems}
            pageSize={itemsPerPage}
            page={currentPage}
            onPageChange={handlePageChange}
          >
            <ButtonGroup variant="ghost" size="sm" wrap="wrap">
              <Pagination.PrevTrigger asChild>
                <IconButton>
                  <LuChevronLeft />
                </IconButton>
              </Pagination.PrevTrigger>

              <Pagination.Items
                render={(page) => (
                  <IconButton variant={{ base: "ghost", _selected: "outline" }}>
                    {page.value}
                  </IconButton>
                )}
              ></Pagination.Items>

              <Pagination.NextTrigger asChild>
                <IconButton>
                  <LuChevronRight />
                </IconButton>
              </Pagination.NextTrigger>
            </ButtonGroup>
          </Pagination.Root>
        </Stack>
      )}

      <TransactionDetail
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        transaction={selectedTransaction}
      />
    </Box>
  );
};

export default TransactionsList;
