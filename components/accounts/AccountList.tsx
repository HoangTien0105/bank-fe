"use client";

import { Accounts } from "@/types/accounts";
import { useState } from "react";
import { useColorModeValue } from "../ui/color-mode";
import {
  Box,
  ButtonGroup,
  Flex,
  Heading,
  IconButton,
  Pagination,
  Spinner,
  Stack,
  Table,
  Text,
} from "@chakra-ui/react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import AccountDetail from "./AccountDetails";

interface AccountsListProps {
  accounts: Accounts[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  isLoading?: boolean;
  customerId?: string;
  title?: string;
  showSearch?: boolean;
  onPageChange?: (page: number) => void;
}

const AccountsList = ({
  accounts = [],
  totalItems = 0,
  totalPages = 1,
  currentPage = 1,
  isLoading = false,
  customerId,
  title = "Accounts list",
  showSearch = true,
  onPageChange,
}: AccountsListProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const itemsPerPage = 8;

  const [selectedAccount, setSelectedAccount] = useState<Accounts | null>(null);
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

  const handleAccountClick = (account: Accounts) => {
    setSelectedAccount(account);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <Box w="full" maxW={"full"} margin={"auto"}>
      <Flex
        justifyContent="space-between"
        mb={6}
        alignItems="center"
        flexWrap="wrap"
        gap={3}
      >
        <Heading size="md" userSelect="none">
          {title}
        </Heading>
      </Flex>
      {isLoading ? (
        <Flex justifyContent="center" my={10}>
          <Spinner size="xl" color="blue.500" />
        </Flex>
      ) : accounts.length === 0 ? (
        <Box textAlign="center" py={10}>
          <Text fontSize="lg">No accounts found</Text>
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
                    <Table.ColumnHeader>Account Type</Table.ColumnHeader>
                    <Table.ColumnHeader>Balance Type</Table.ColumnHeader>
                    <Table.ColumnHeader minWidth={"150px"}>
                      Balance
                    </Table.ColumnHeader>
                    <Table.ColumnHeader>Transaction Limit</Table.ColumnHeader>
                    <Table.ColumnHeader>Open Date</Table.ColumnHeader>
                    <Table.ColumnHeader>Status</Table.ColumnHeader>
                    <Table.ColumnHeader>Interest Rate</Table.ColumnHeader>
                    <Table.ColumnHeader>Maturity Date</Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>

                <Table.Body userSelect="none">
                  {accounts.map((item, index) => (
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
                      onClick={() => handleAccountClick(item)}
                    >
                      <Table.Cell>
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </Table.Cell>
                      <Table.Cell>{item.accountType}</Table.Cell>
                      <Table.Cell>{item.balanceType}</Table.Cell>
                      <Table.Cell suppressHydrationWarning>
                        {typeof item.balance === "number"
                          ? item.balance.toLocaleString("vn-VN", {
                              minimumFractionDigits: 2,
                            })
                          : item.balance}{" "}
                        VNĐ
                      </Table.Cell>
                      <Table.Cell>
                        {typeof item.transactionLimit === "number"
                          ? item.transactionLimit.toLocaleString("vn-VN")
                          : item.transactionLimit}{" "}
                        VNĐ
                      </Table.Cell>
                      <Table.Cell suppressHydrationWarning>
                        {new Date(item.openDate).toLocaleDateString()}
                      </Table.Cell>
                      <Table.Cell suppressHydrationWarning>
                        {item.status}
                      </Table.Cell>
                      <Table.Cell>
                        {item.interestRate !== null
                          ? `${item.interestRate}%`
                          : "N/A"}
                      </Table.Cell>
                      <Table.Cell>
                        {item.maturiryDate
                          ? new Date(item.maturiryDate).toLocaleDateString()
                          : "N/A"}
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

      <AccountDetail
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        account={selectedAccount}
      />
    </Box>
  );
};

export default AccountsList;
