"use client";

import { getAllAccounts } from "@/api/account";
import { useColorModeValue } from "@/components/ui/color-mode";
import { Accounts } from "@/types/accounts";
import { PaginationRequest } from "@/types/pagination";
import {
  Box,
  ButtonGroup,
  Card,
  CardBody,
  Flex,
  Heading,
  IconButton,
  Input,
  InputGroup,
  Pagination,
  Spinner,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { ChevronRight, CreditCard } from "lucide-react";
import { useEffect, useState } from "react";
import { LuChevronLeft, LuChevronRight, LuSearch, LuX } from "react-icons/lu";

interface AccountsListProps {
  customerId?: string;
  title?: string;
  showSearch?: boolean;
}

const AccountsList = ({
  customerId,
  title = "Your accounts",
  showSearch = true,
}: AccountsListProps) => {
  const [accounts, setAccounts] = useState<Accounts[]>([]);
  const [loading, setIsLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const cardBg = useColorModeValue("white", "gray.800");
  const cardHoverBg = useColorModeValue("gray.50", "gray.700");
  const iconBg = useColorModeValue("blue.50", "blue.900");
  const iconColor = useColorModeValue("blue.500", "blue.200");

  useEffect(() => {
    fetchAccounts();
  }, [currentPage, customerId, searchKeyword]);

  const fetchAccounts = async () => {
    try {
      setIsLoading(true);

      // Tính toán offset dựa vào trang hiện tại
      const offset = (currentPage - 1) * itemsPerPage;

      // Prepare pagination request
      const paginationParams: PaginationRequest = {
        offset: offset,
        limit: itemsPerPage,
      };

      if (searchKeyword) {
        paginationParams.keyword = searchKeyword;
      }

      const response = await getAllAccounts(paginationParams);

      if (response) {
        setAccounts(response.results || []);
        setTotalItems(response.totalRows);
        setTotalPages(response.totalPages);
      } else {
        setAccounts([]);
        setTotalItems(0);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (details: { page: number }) => {
    setCurrentPage(details.page);
  };

  const handleSearch = () => {
    setSearchKeyword(searchInput);
    setCurrentPage(1);
  };

  const clearSearch = () => {
    setSearchInput("");
    setSearchKeyword("");
    setCurrentPage(1);
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
    <Box w="full" maxW="4xl" margin="auto">
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
              placeholder="Search accounts"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter"}
            ></Input>
          </InputGroup>
        )}
      </Flex>
      {loading ? (
        <Flex justifyContent="center" my={10}>
          <Spinner size="xl" color="blue.500" />
        </Flex>
      ) : accounts.length === 0 ? (
        <Box textAlign="center" py={10}>
          <Text fontSize="lg">You don't have any accounts</Text>
        </Box>
      ) : (
        <Stack>
          <VStack align="stretch">
            {accounts.map((account) => (
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
                      <VStack fontWeight="bold" fontSize="lg">
                        {account.balance.toLocaleString("vi-VN", {
                          minimumFractionDigits: 2,
                        })}
                        <Flex
                          alignItems="center"
                          justifyContent="flex-end"
                          color="blue.500"
                          mt={1}
                        >
                          <Text fontSize="sm">View details</Text>
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
            <Pagination.Root
              count={totalItems}
              pageSize={itemsPerPage}
              page={currentPage}
              onPageChange={handlePageChange}
            >
              <Flex justifyContent="center" mt={4}>
                <ButtonGroup variant="ghost" size="sm" wrap="wrap">
                  <Pagination.PrevTrigger asChild>
                    <IconButton aria-label="Previous page">
                      <LuChevronLeft />
                    </IconButton>
                  </Pagination.PrevTrigger>

                  <Pagination.Items
                    render={(page) => (
                      <IconButton
                        aria-label={`Page ${page.value}`}
                        variant={{ base: "ghost", _selected: "outline" }}
                      >
                        {page.value}
                      </IconButton>
                    )}
                  ></Pagination.Items>

                  <Pagination.NextTrigger asChild>
                    <IconButton aria-label="Next page">
                      <LuChevronRight />
                    </IconButton>
                  </Pagination.NextTrigger>
                </ButtonGroup>
              </Flex>
            </Pagination.Root>
          )}
        </Stack>
      )}
    </Box>
  );
};

export default AccountsList;
