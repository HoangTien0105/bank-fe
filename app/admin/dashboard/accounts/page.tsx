import { getAllAccounts } from "@/api/account";
import AccountsList from "@/components/accounts/AccountList";
import SearchForm from "@/components/accounts/SearchForm";
import { AccountPageProps } from "@/types/accounts";
import { Box, Flex, Spinner } from "@chakra-ui/react";
import { Suspense } from "react";

const AccountPage = async ({ searchParams = {} }: AccountPageProps) => {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page) : 1;
  const itemsPerPage = 8;
  const offset = (page - 1) * itemsPerPage;

  const apiParams = {
    offset,
    limit: itemsPerPage,
    keyword: params.keyword,
    balanceType: params.balanceType,
    accountType: params.accountType,
    sortBy: params.sortBy,
    sortDirection: params.sortDirection as "ASC" | "DESC" | undefined,
  };

  const response = await getAllAccounts(apiParams);
  const accounts = response?.results || [];
  const totalItems = response?.totalRows || 0;
  const totalPages = response?.totalPages || 1;

  return (
    <Box p={6}>
      <Flex direction="column" gap={6}>
        <Suspense fallback={<Spinner size="xl" />}>
          <SearchForm
            initialValues={{
              keyword: params.keyword,
              balanceType: params.balanceType,
              accountType: params.accountType,
              sortBy: params.sortBy,
              sortDirection: params.sortDirection,
            }}
          />

          <AccountsList
            title="Accounts"
            accounts={accounts}
            totalItems={totalItems}
            totalPages={totalPages}
            currentPage={page}
          />
        </Suspense>
      </Flex>
    </Box>
  );
};

export default AccountPage;