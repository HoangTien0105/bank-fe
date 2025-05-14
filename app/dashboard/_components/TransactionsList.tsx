import {
  Badge,
  Box,
  Flex,
  Heading,
  Table,
  TableHeader,
} from "@chakra-ui/react";
import { Transaction } from "../_types/transaction";

const TransactionsList = ({
  transactions,
}: {
  transactions: Transaction[];
}) => {
  return (
    <Box p={6} w="full">
      <Flex justifyContent="space-between" mb={6}>
        <Heading size="md">Transaction History</Heading>
      </Flex>

      <Table.Root size="sm">
        <TableHeader>
          <Table.Row>
            <Table.ColumnHeader>Date</Table.ColumnHeader>
            <Table.ColumnHeader>Description</Table.ColumnHeader>
            <Table.ColumnHeader>Category</Table.ColumnHeader>
            <Table.ColumnHeader>Amount</Table.ColumnHeader>
          </Table.Row>
        </TableHeader>
        <Table.Body>
          {transactions.map((tx) => (
            <Table.Row key={tx.id} _hover={{ bg: "gray.50" }} cursor="pointer">
              <Table.Cell>{new Date(tx.date).toLocaleDateString()}</Table.Cell>
              <Table.Cell>{tx.description}</Table.Cell>
              <Table.Cell>
                <Badge colorScheme={tx.type === "credit" ? "green" : "blue"}>
                  {tx.category}
                </Badge>
              </Table.Cell>
              <Table.Cell
                color={tx.type === "credit" ? "green.500" : "red.500"}
                fontWeight="medium"
              >
                {tx.type === "credit" ? "+" : "-"}${tx.amount.toFixed(2)}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
};

export default TransactionsList;
