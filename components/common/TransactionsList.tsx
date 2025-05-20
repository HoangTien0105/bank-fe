"use client";

import { Transaction } from "@/types/transaction";
import { useEffect, useState } from "react";
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
import { getAllTransactions } from "@/api/transaction";
import { PaginationRequest } from "@/types/pagination";

interface TransactionsListProps {
  customerId?: string;
  title?: string;
  showSearch?: boolean;
  variant?: "customer" | "admin";
}

const TransactionsList = ({
  customerId,
  title = "Transactions list",
  showSearch = true,
  variant = "customer",
}: TransactionsListProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setIsLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState(""); // Cho keyword gọi API
  const [searchInput, setSearchInput] = useState(""); // Cho thanh search
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const headerBg = useColorModeValue("gray.100", "gray.800");
  const hoverBg = useColorModeValue("gray.50", "gray.700");

  useEffect(() => {
    fetchTransactions();
  }, [currentPage, customerId, searchKeyword]);

  const handleSearch = () => {
    setSearchKeyword(searchInput);
    setCurrentPage(1);
  };

  const clearSearch = () => {
    setSearchInput("");
    setSearchKeyword("");
    setCurrentPage(1);
  };

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);

      //Tinhs toán offet dựa vào trang htai
      const offset = (currentPage - 1) * itemsPerPage;

      // Prepare pagination request
      const paginationParams: PaginationRequest = {
        offset: offset,
        limit: itemsPerPage,
      };

      if (searchKeyword) {
        paginationParams.keyword = searchKeyword;
      }

      const response = await getAllTransactions(paginationParams);

      if (response) {
        setTransactions(response.results || []);
        setTotalItems(response.totalRows);
        setTotalPages(response.totalPages);
      } else {
        setTransactions([]);
        setTotalItems(0);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (details: { page: number }) => {
    setCurrentPage(details.page);
  };

  const endElement = (
    <Flex alignItems="center" gap={1}>
      {searchInput && (
        <IconButton
          aria-label="Delete"
          onClick={clearSearch}
          size="sm"
          variant="ghost"
          color="gray.500"
          me={-2}
        >
          <LuX />
        </IconButton>
      )}
      <IconButton
        aria-label="Search"
        onClick={handleSearch}
        size="sm"
        variant="ghost"
        color="gray.500"
        me={-2}
      >
        <LuSearch />
      </IconButton>
    </Flex>
  );

  return (
    <Box
      w="full"
      maxW={variant === "customer" ? "4xl" : "full"}
      margin={variant === "customer" ? "auto" : "0"}
    >
      <Flex
        justifyContent="space-between"
        mb={6}
        alignItems="center"
        flexWrap="wrap"
        gap={3}
      >
        <Heading size="md">{title}</Heading>

        {showSearch && (
          <InputGroup maxW="300px" endElement={endElement}>
            <Input
              placeholder="Enter description"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </InputGroup>
        )}
      </Flex>
      {loading ? (
        <Flex justifyContent="center" my={10}>
          <Spinner size="xl" color="blue.500" />
        </Flex>
      ) : transactions.length === 0 ? (
        <Box textAlign="center" py={10}>
          <Text fontSize="lg">No transactions founded</Text>
        </Box>
      ) : (
        <Stack spaceY={4}>
          <Box
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            boxShadow="sm"
            position="relative"
          >
            <Table.ScrollArea borderWidth="1px" maxW="4xl">
              <Table.Root size="lg">
                <Table.Header
                  position="sticky"
                  top={0}
                  bg={headerBg}
                  zIndex={1}
                  boxShadow="sm"
                >
                  <Table.Row>
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
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {transactions.map((item, index) => (
                    <Table.Row
                      key={item.id}
                      cursor="pointer"
                      _hover={{ bg: hoverBg }}
                      transition="background-color 0.2s"
                    >
                      <Table.Cell>
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </Table.Cell>
                      <Table.Cell>{item.type}</Table.Cell>
                      <Table.Cell fontWeight="medium">
                        {item.amount.toLocaleString("vn-VN", {
                          minimumFractionDigits: 2,
                        })}{" "}
                        VNĐ
                      </Table.Cell>
                      <Table.Cell>{item.location}</Table.Cell>
                      <Table.Cell>
                        {new Date(item.transactionDate).toLocaleDateString()}
                      </Table.Cell>
                      <Table.Cell>{item.description}</Table.Cell>
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
    </Box>
  );
};

export default TransactionsList;
