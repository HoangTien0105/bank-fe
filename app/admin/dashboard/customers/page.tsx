import { getAllCustomers } from "@/api/customer";
import { Box, Flex, Heading, Table } from "@chakra-ui/react";
import CreateCustomerDialog from "./_components/CreateCustomerDialog";

const CustomersPage = async () => {
  const response = await getAllCustomers();
  const items = response.results;

  return (
    <Box>
      <Flex direction="column" justifyContent="space-between">
        <Heading size="lg" mb={6}>
          All Customers
        </Heading>
        <CreateCustomerDialog />
      </Flex>
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
    </Box>
  );
};

export default CustomersPage;
