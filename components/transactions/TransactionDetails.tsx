"use client";

import { Transaction } from "@/types/transaction";
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogCloseTrigger,
  Grid,
  Heading,
  Text,
} from "@chakra-ui/react";
import { LuX } from "react-icons/lu";

interface TransactionDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}

const TransactionDetail = ({
  isOpen,
  onClose,
  transaction,
}: TransactionDetailsDialogProps) => {
  return (
    <Dialog.Root open={isOpen} >
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content maxW="2xl">
          <Dialog.Header>
            <Heading size="md" userSelect="none">Transactions details</Heading>
            <DialogCloseTrigger asChild>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <LuX />
              </Button>
            </DialogCloseTrigger>
          </Dialog.Header>

          <Dialog.Body>
            {transaction ? (
              <Card.Root userSelect="none">
                <Card.Body>
                  <Grid templateColumns="1fr 1fr" gap={4}>
                    <Box>
                      <Text fontWeight="bold">Id:</Text>
                      <Text>{transaction.id}</Text>
                    </Box>
                    <Box>
                      <Text fontWeight="bold">Type</Text>
                      <Text>{transaction.type}</Text>
                    </Box>
                    <Box>
                      <Text fontWeight="bold">Amount:</Text>
                      <Text>
                        {typeof transaction.amount === "number"
                          ? transaction.amount.toLocaleString("vn-VN", {
                              minimumFractionDigits: 2,
                            })
                          : transaction.amount}{" "}
                        VNĐ
                      </Text>
                    </Box>
                    <Box>
                      <Text fontWeight="bold">Loaction:</Text>
                      <Text>{transaction.location}</Text>
                    </Box>
                    <Box>
                      <Text fontWeight="bold">Date:</Text>
                      <Text>
                        {new Date(
                          transaction.transactionDate
                        ).toLocaleDateString()}
                      </Text>
                    </Box>
                    <Box>
                      <Text fontWeight="bold">Description:</Text>
                      <Text>{transaction.description}</Text>
                    </Box>
                    <Box>
                      <Text fontWeight="bold">From account:</Text>
                      <Text>{transaction.fromAccountId}</Text>
                    </Box>
                    <Box>
                      <Text fontWeight="bold">To account:</Text>
                      <Text>{transaction.toAccountId}</Text>
                    </Box>
                  </Grid>
                </Card.Body>
              </Card.Root>
            ) : (
              <Text>Transaction not found</Text>
            )}
          </Dialog.Body>

          <Dialog.Footer>
            <Button onClick={onClose}>Close</Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};

export default TransactionDetail;
