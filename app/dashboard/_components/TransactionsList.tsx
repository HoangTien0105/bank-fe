import { Box, Flex, Heading, Table, TableHeader } from "@chakra-ui/react";
import { Transaction } from "../_types/transaction";

const TransactionsList = ({
  transactions,
}: {
  transactions: Transaction[];
}) => {
  console.log("Transactions:", transactions);
  return (
    <Box p={6} w="full">
      <Flex justifyContent="space-between" mb={6}>
        <Heading size="md">Transaction History</Heading>
      </Flex>

      <Table.Root size="sm">
        <TableHeader>
          <Table.Row>
            <Table.ColumnHeader>ID</Table.ColumnHeader>
            <Table.ColumnHeader>Type</Table.ColumnHeader>
            <Table.ColumnHeader>Amount</Table.ColumnHeader>
            <Table.ColumnHeader>Location</Table.ColumnHeader>
            <Table.ColumnHeader>Transaction Date</Table.ColumnHeader>
            <Table.ColumnHeader>Create Date</Table.ColumnHeader>
            <Table.ColumnHeader>Description</Table.ColumnHeader>
          </Table.Row>
        </TableHeader>
        <Table.Body>
          {transactions.map((tx) => (
            <Table.Row key={tx.id} cursor="pointer">
              <Table.Cell>{tx.id}</Table.Cell>
              <Table.Cell>{tx.type}</Table.Cell>
              <Table.Cell>${tx.amount}</Table.Cell>
              <Table.Cell>{tx.location}</Table.Cell>
              <Table.Cell>
                {new Date(tx.transactionDate).toLocaleDateString()}
              </Table.Cell>
              <Table.Cell>
                {new Date(tx.createDate).toLocaleDateString()}
              </Table.Cell>

              <Table.Cell>{tx.description}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
};

export default TransactionsList;
