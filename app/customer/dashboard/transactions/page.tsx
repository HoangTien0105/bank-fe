import { getAllTransactions } from "@/api/transaction";
import SearchForm from "@/components/transactions/SearchForm";
import TransactionsList from "@/components/transactions/TransactionsList";
import { TransactionsPageProps } from "@/types/transaction";
import { Box, Flex, Spinner } from "@chakra-ui/react";
import { Suspense } from "react";

const TransactionsPage = async ({
  searchParams = {},
}: TransactionsPageProps) => {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page) : 1;
  const itemsPerPage = 8;
  const offset = (page - 1) * itemsPerPage;

  const apiParams = {
    offset,
    limit: itemsPerPage,
    keyword: params.keyword,
    location: params.location,
    minAmount: params.minAmount
      ? parseFloat(params.minAmount)
      : undefined,
    maxAmount: params.maxAmount
      ? parseFloat(params.maxAmount)
      : undefined,
    sortBy: params.sortBy,
    sortDirection: params.sortDirection as "ASC" | "DESC" | undefined,
  };

  const response = await getAllTransactions(apiParams);
  const transactions = response?.results || [];
  const totalItems = response?.totalRows || 0;
  const totalPages = response?.totalPages || 1;

  return (
    <Box p={6}>
      <Flex direction="column" gap={6}>
        <Suspense fallback={<Spinner size="xl" />}>
          <SearchForm
            initialValues={{
              keyword: params.keyword,
              location: params.location,
              minAmount: params.minAmount,
              maxAmount: params.maxAmount,
              sortBy: params.sortBy,
              sortDirection: params.sortDirection,
            }}
          />

          <TransactionsList
            title="Transaction History"
            transactions={transactions}
            totalItems={totalItems}
            totalPages={totalPages}
            currentPage={page}
          />
        </Suspense>
      </Flex>
    </Box>
  );
};

export default TransactionsPage;
