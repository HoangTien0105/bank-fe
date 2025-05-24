import { getAllTransactions } from "@/api/transaction";
import SearchForm from "@/components/transactions/SearchForm";
import TransactionsList from "@/components/transactions/TransactionsList";
import { Box, Flex, Spinner } from "@chakra-ui/react";
import { Suspense } from "react";

interface TransactionsPageProps {
  searchParams?: {
    page?: string;
    keyword?: string;
    location?: string;
    minAmount?: string;
    maxAmount?: string;
    sortBy?: string;
    sortDirection?: string;
  };
}

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

  async function handleSearch(formData: FormData) {
    'use server';
    
    const searchParams = new URLSearchParams();
    const keyword = formData.get('keyword');
    const location = formData.get('location');
    const minAmount = formData.get('minAmount');
    const maxAmount = formData.get('maxAmount');
    const sortBy = formData.get('sortBy');
    const sortDirection = formData.get('sortDirection');

    if (keyword) searchParams.set('keyword', keyword.toString());
    if (location) searchParams.set('location', location.toString());
    if (minAmount) searchParams.set('minAmount', minAmount.toString());
    if (maxAmount) searchParams.set('maxAmount', maxAmount.toString());
    if (sortBy) searchParams.set('sortBy', sortBy.toString());
    if (sortDirection) searchParams.set('sortDirection', sortDirection.toString());

    return searchParams.toString();
  }
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
            variant="customer"
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
