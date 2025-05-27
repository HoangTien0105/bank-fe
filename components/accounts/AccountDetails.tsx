"use client";

import { Accounts } from "@/types/accounts";
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

interface AccountDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  account: Accounts | null;
}

const AccountDetail = ({
  isOpen,
  onClose,
  account,
}: AccountDetailsDialogProps) => {
  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content maxW="2xl">
          <Dialog.Header>
            <Heading size="md" userSelect="none">Account details</Heading>
            <DialogCloseTrigger asChild>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <LuX />
              </Button>
            </DialogCloseTrigger>
          </Dialog.Header>

          <Dialog.Body>
            {account ? (
              <Card.Root userSelect="none">
                <Card.Body>
                  <Grid templateColumns="1fr 1fr" gap={4}>
                    <Box>
                      <Text fontWeight="bold">Id:</Text>
                      <Text>{account.id}</Text>
                    </Box>
                    <Box>
                      <Text fontWeight="bold">Account Type:</Text>
                      <Text>{account.accountType}</Text>
                    </Box>
                    <Box>
                      <Text fontWeight="bold">Balance Type:</Text>
                      <Text>{account.balanceType}</Text>
                    </Box>
                    <Box>
                      <Text fontWeight="bold">Balance:</Text>
                      <Text>
                        {typeof account.balance === "number"
                          ? account.balance.toLocaleString("vn-VN", {
                              minimumFractionDigits: 2,
                            })
                          : account.balance}{" "}
                        VNĐ
                      </Text>
                    </Box>
                    <Box>
                      <Text fontWeight="bold">Transaction Limit:</Text>
                      <Text>
                        {typeof account.transactionLimit === "number"
                          ? account.transactionLimit.toLocaleString("vn-VN")
                          : account.transactionLimit}{" "}
                        VNĐ
                      </Text>
                    </Box>
                    <Box>
                      <Text fontWeight="bold">Open Date:</Text>
                      <Text>
                        {new Date(account.openDate).toLocaleDateString()}
                      </Text>
                    </Box>
                    <Box>
                      <Text fontWeight="bold">Interest Rate:</Text>
                      <Text>
                        {account.interestRate !== null ? `${account.interestRate}%` : "N/A"}
                      </Text>
                    </Box>
                    <Box>
                      <Text fontWeight="bold">Maturity Date:</Text>
                      <Text>
                        {account.maturiryDate
                          ? new Date(account.maturiryDate).toLocaleDateString()
                          : "N/A"}
                      </Text>
                    </Box>
                    <Box>
                      <Text fontWeight="bold">Source Account:</Text>
                      <Text>{account.sourceAccount || "N/A"}</Text>
                    </Box>
                    <Box>
                      <Text fontWeight="bold">Saving Schedule Day:</Text>
                      <Text>{account.savingScheduleDay !== null ? account.savingScheduleDay : "N/A"}</Text>
                    </Box>
                    <Box>
                      <Text fontWeight="bold">Monthly Deposit Amount:</Text>
                      <Text>
                        {account.monthlyDepositAmount !== null
                          ? `${account.monthlyDepositAmount.toLocaleString("vn-VN")} VNĐ`
                          : "N/A"}
                      </Text>
                    </Box>
                  </Grid>
                </Card.Body>
              </Card.Root>
            ) : (
              <Text>Account not found</Text>
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

export default AccountDetail;