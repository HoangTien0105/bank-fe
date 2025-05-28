import { getAllCustomers } from "@/api/customer";
import {
  Box,
  Flex,
  Heading,

  Table,
} from "@chakra-ui/react";
import CreateCustomerDialog from "./_components/CreateCustomerDialog";
import { CustomerPageProps } from "@/types/customer";
import PaginationComponent from "@/components/common/Pagination";
import SearchForm from "./_components/SearchForm";

const CustomersPage = async ({ searchParams = {} }: CustomerPageProps) => {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page) : 1;
  const itemsPerPage = 10;
  const offset = (page - 1) * itemsPerPage;

  const apiParams = {
    offset,
    limit: itemsPerPage,
    keyword: params.keyword,
    location: params.location,
    sortBy: params.sortBy,
    sortDirection: params.sortDirection as "ASC" | "DESC" | undefined,
  };

  const response = await getAllCustomers(apiParams);
  const items = response.results;
  const totalItems = response?.totalRows || 0;
  const totalPages = response?.totalPages || 1;

  return (
    <Box>
      <Flex direction="column" justifyContent="space-between">
        <Heading size="lg" mb={6}>
          All Customers
        </Heading>
        <CreateCustomerDialog />
        <SearchForm
          initialValues={{
            keyword: params.keyword,
            location: params.location,
            sortBy: params.sortBy,
            sortDirection: params.sortDirection,
          }}
        />
      </Flex>
      <>
        <Table.Root size="sm">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>ID</Table.ColumnHeader>
              <Table.ColumnHeader>Name</Table.ColumnHeader>
              <Table.ColumnHeader>Email</Table.ColumnHeader>
              <Table.ColumnHeader>Citizen ID</Table.ColumnHeader>
              <Table.ColumnHeader>Phone</Table.ColumnHeader>
              <Table.ColumnHeader>Address</Table.ColumnHeader>
              <Table.ColumnHeader>Created Date</Table.ColumnHeader>
              <Table.ColumnHeader>Type</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {items.map((item) => (
              <Table.Row key={item.id}>
                <Table.Cell>{item.id}</Table.Cell>
                <Table.Cell>{item.name}</Table.Cell>
                <Table.Cell>{item.email}</Table.Cell>
                <Table.Cell>{item.citizenId}</Table.Cell>
                <Table.Cell>{item.phone}</Table.Cell>
                <Table.Cell>{item.address}</Table.Cell>
                <Table.Cell>{item.createDate}</Table.Cell>
                <Table.Cell>{item.customerType}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
        {totalPages > 1 && (
          <PaginationComponent
            currentPage={page}
            totalPages={totalPages}
          />
        )}
      </>
    </Box>
  );
};

export default CustomersPage;
