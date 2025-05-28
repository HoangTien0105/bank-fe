"use client";

import {
  Box,
  Button,
  Card,
  createListCollection,
  Field,
  Fieldset,
  Flex,
  Heading,
  NumberInput,
  NumberInputInput,
  Select,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import { depositMoneyForCustomer, getCheckingAccountByCustomerId, withdrawMoneyForCustomer } from "../action";

interface FormData {
  amount: number;
  accountId: string;
  location: string;
  operationType: "Deposit" | "Withdraw";
}

interface AccountInfo {
  id: string;
  accountType: string;
  accountNumber: string;
  balance: number;
}

const locations = createListCollection({
  items: [
    { label: "Phú Nhuận", value: "Phú Nhuận" },
    { label: "Bình Thạnh", value: "Bình Thạnh" },
  ],
});

const operationTypes = createListCollection({
  items: [
    { label: "Deposit", value: "Deposit" },
    { label: "Withdraw", value: "Withdraw" },
  ],
});

const FundsForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    amount: 0,
    accountId: "",
    location: "Phú Nhuận",
    operationType: "Deposit",
  });

  const [checkingAccount, setCheckingAccount] = useState<AccountInfo | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmStep, setIsConfirmStep] = useState(false);
  const [isLoadingAccount, setIsLoadingAccount] = useState(true);
  const [operationResult, setOperationResult] = useState<{
    success: boolean;
    message: string;
    transactionId?: string;
  } | null>(null);

  useEffect(() => {
    const fetchCheckingAccount = async () => {
      setIsLoadingAccount(true);
      try {
        const accountData = await getCheckingAccountByCustomerId();
        if (accountData) {
          const account = Array.isArray(accountData)
            ? accountData[0]
            : accountData;
          setCheckingAccount(account);
          setFormData((prev) => ({
            ...prev,
            accountId: account.id,
          }));
        }
      } catch (error) {
        console.error("Error fetching checking account:", error);
      } finally {
        setIsLoadingAccount(false);
      }
    };

    fetchCheckingAccount();
  }, []);

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSubmit = async () => {
    if (!isConfirmStep) {
      setIsConfirmStep(true);
      return;
    }

    setIsSubmitting(true);
    try {
      const operationData = {
        accountId: formData.accountId,
        amount: formData.amount,
        location: formData.location,
      };

      let result;
      if (formData.operationType === "Deposit") {
        result = await depositMoneyForCustomer(operationData);
      } else {
        result = await withdrawMoneyForCustomer(operationData);
      }

      if (result && result.success) {
        setOperationResult({
          success: true,
          message: `${
            formData.operationType === "Deposit" ? "Deposit" : "Withdrawal"
          } completed successfully`,
          transactionId: result.data.id,
        });

        setTimeout(() => {
          router.push(
            `/customer/dashboard/transactions?keyword=${result.data.id}`
          );
        }, 2000);
      } else {
        setOperationResult({
          success: false,
          message: `${
            formData.operationType === "Deposit" ? "Deposit" : "Withdrawal"
          } failed. Please try again.`,
        });
      }
    } catch (error) {
      console.error(`Error during ${formData.operationType}:`, error);
      setOperationResult({
        success: false,
        message: `An error occurred during ${formData.operationType}. Please try again.`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    setIsConfirmStep(false);
  };

  const getOperationTypeLabel = () => {
    return formData.operationType === "Deposit" ? "Deposit" : "Withdraw";
  };

  const canWithdraw =
    formData.operationType !== "Withdraw" ||
    (checkingAccount && formData.amount <= checkingAccount.balance);

  return (
    <Box>
      <Card.Root>
        <Card.Body>
          {operationResult ? (
            <Stack gap={4} align="center">
              <Heading
                size="md"
                color={operationResult.success ? "green.500" : "red.500"}
              >
                {operationResult.success ? "Success!" : "Error"}
              </Heading>
              <Text>{operationResult.message}</Text>
              {operationResult.success && (
                <Text fontSize="sm">
                  Transaction ID: {operationResult.transactionId}
                </Text>
              )}
              <Text fontSize="sm">Redirecting to transactions page...</Text>
            </Stack>
          ) : !isConfirmStep ? (
            <Stack gap={4} userSelect="none">
              <Field.Root>
                <Field.Label>Operation Type</Field.Label>
                <Select.Root
                  collection={operationTypes}
                  value={[formData.operationType]}
                  onValueChange={(details) =>
                    handleInputChange("operationType", details.value[0])
                  }
                  size="md"
                >
                  <Select.HiddenSelect />
                  <Select.Control>
                    <Select.Trigger>
                      <Select.ValueText placeholder="Select operation type" />
                    </Select.Trigger>
                    <Select.IndicatorGroup>
                      <Select.Indicator />
                    </Select.IndicatorGroup>
                  </Select.Control>
                  <Select.Positioner>
                    <Select.Content>
                      {operationTypes.items.map((type) => (
                        <Select.Item item={type} key={type.value}>
                          <Select.ItemText>{type.label}</Select.ItemText>
                          <Select.ItemIndicator />
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Positioner>
                </Select.Root>
              </Field.Root>

              {checkingAccount && (
                <Box p={3} borderWidth={1} borderRadius="md" bg="gray.700">
                  <Flex justify="space-between">
                    <Text fontWeight="bold" userSelect="none">
                      Your Account:
                    </Text>
                    <Text userSelect="none">{checkingAccount.id}</Text>
                  </Flex>
                </Box>
              )}

              <Field.Root>
                <Field.Label>Amount</Field.Label>
                <NumberInput.Root
                  min={0}
                  value={formData.amount.toString()}
                  onValueChange={(details) => {
                    const value = parseFloat(details.value);
                    handleInputChange("amount", isNaN(value) ? 0 : value);
                  }}
                  width="full"
                >
                  <Flex userSelect="none">
                    <NumberInputInput textAlign="left" />
                    <Box
                      position="absolute"
                      right="0"
                      top="50%"
                      transform="translateY(-50%)"
                      paddingRight="12px"
                      color="gray.500"
                      pointerEvents="none"
                    >
                      VND
                    </Box>
                  </Flex>
                </NumberInput.Root>
                <Field.HelperText userSelect="none">
                  {isLoadingAccount
                    ? "Loading account information..."
                    : checkingAccount
                    ? `Available balance: ${checkingAccount.balance.toLocaleString()}đ`
                    : "Unable to get account information"}
                </Field.HelperText>
                {formData.operationType === "Withdraw" &&
                  checkingAccount &&
                  formData.amount > checkingAccount.balance && (
                    <Text color="red.500" fontSize="sm" mt={1}>
                      Insufficient balance for withdrawal
                    </Text>
                  )}
              </Field.Root>

              <Field.Root userSelect="none">
                <Field.Label >Location</Field.Label>
                <Select.Root
                  collection={locations}
                  value={[formData.location]}
                  onValueChange={(details) =>
                    handleInputChange("location", details.value[0])
                  }
                  size="md"
                >
                  <Select.HiddenSelect />
                  <Select.Control>
                    <Select.Trigger>
                      <Select.ValueText placeholder="Select location" />
                    </Select.Trigger>
                    <Select.IndicatorGroup>
                      <Select.Indicator />
                    </Select.IndicatorGroup>
                  </Select.Control>
                  <Select.Positioner>
                    <Select.Content>
                      {locations.items.map((location) => (
                        <Select.Item item={location} key={location.value}>
                          <Select.ItemText>{location.label}</Select.ItemText>
                          <Select.ItemIndicator />
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Positioner>
                </Select.Root>
              </Field.Root>

              <Button
                colorScheme="blue"
                onClick={handleSubmit}
                disabled={
                  formData.amount <= 0 || !checkingAccount || !canWithdraw
                }
              >
                Submit
              </Button>
            </Stack>
          ) : (
            <Stack gap={4}>
              <Heading size="md">Confirm {getOperationTypeLabel()}</Heading>

              <Box borderWidth={1} borderRadius="md" p={4}>
                <Stack gap={3}>
                  <Flex justify="space-between">
                    <Text fontWeight="bold">Account:</Text>
                    <Text>{checkingAccount?.id}</Text>
                  </Flex>

                  <Flex justify="space-between">
                    <Text fontWeight="bold">Operation:</Text>
                    <Text>{getOperationTypeLabel()}</Text>
                  </Flex>

                  <Flex justify="space-between">
                    <Text fontWeight="bold">Amount:</Text>
                    <Text>{formData.amount.toLocaleString()}đ</Text>
                  </Flex>

                  <Flex justify="space-between">
                    <Text fontWeight="bold">Location:</Text>
                    <Text>{formData.location}</Text>
                  </Flex>
                </Stack>
              </Box>

              <Flex gap={4}>
                <Button variant="outline" onClick={handleBack}>
                  Back
                </Button>
                <Button
                  colorScheme="blue"
                  onClick={handleSubmit}
                  loading={isSubmitting}
                  loadingText="Processing"
                  flex={1}
                >
                  Confirm {getOperationTypeLabel()}
                </Button>
              </Flex>
            </Stack>
          )}
        </Card.Body>
      </Card.Root>
    </Box>
  );
};

export default FundsForm;
