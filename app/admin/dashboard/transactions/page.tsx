import { getAllTransactions } from "@/api/transaction";
import { formatDateTime } from "@/utils/date";
import { Box, Heading, Table } from "@chakra-ui/react";

const TransactionsPage = async () => {
  const response = await getAllTransactions();
  const items = response.results;

  return (
    <Box>
      <Heading size="lg" mb={6}>
        All Transactions
      </Heading>
      <Table.Root size="sm">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>ID</Table.ColumnHeader>
            <Table.ColumnHeader>Type</Table.ColumnHeader>
            <Table.ColumnHeader>Amount</Table.ColumnHeader>
            <Table.ColumnHeader>Transaction Date</Table.ColumnHeader>
            <Table.ColumnHeader>Fee</Table.ColumnHeader>
            <Table.ColumnHeader>Location</Table.ColumnHeader>
            <Table.ColumnHeader>Description</Table.ColumnHeader>
            <Table.ColumnHeader>Created Date</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {items.map((item) => (
            <Table.Row key={item.id}>
              <Table.Cell>{item.id}</Table.Cell>
              <Table.Cell>{item.type}</Table.Cell>
              <Table.Cell>{item.amount}</Table.Cell>
              <Table.Cell>{formatDateTime(item.transactionDate)}</Table.Cell>
              <Table.Cell>{item.fee || "N/A"}</Table.Cell>
              <Table.Cell>{item.location}</Table.Cell>
              <Table.Cell>{item.description}</Table.Cell>
              <Table.Cell>{formatDateTime(item.createDate)}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
};

export default TransactionsPage;
