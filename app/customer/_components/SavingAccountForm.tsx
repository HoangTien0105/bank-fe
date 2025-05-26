"use client";

import {
  Box,
  Button,
  Card,
  createListCollection,
  Field,
  Flex,
  Heading,
  NumberInput,
  NumberInputInput,
  Select,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  calculateExpectedInterest,
  createSavingAccountAction,
  getCheckingAccountByCustomerId,
  getSavingTerm,
} from "../action";

interface FormData {
  sourceAccountId: string;
  amount: number;
  termMonths: number;
  monthlyDepositAmount: number;
}

interface AccountInfo {
  id: string;
  balance: number;
}

interface SavingTerm {
  id: string;
  termMonths: number;
  interestRate: number;
  description: string;
}

const SavingAccountForm = () => {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    sourceAccountId: "",
    amount: 0,
    termMonths: 0,
    monthlyDepositAmount: 0,
  });
  const [checkingAccount, setCheckingAccount] = useState<AccountInfo | null>(
    null
  );
  const [savingTerms, setSavingTerms] = useState<SavingTerm[]>([]);
  const [selectedTerm, setSelectedTerm] = useState<SavingTerm | null>(null);
  const [isLoadingAccount, setIsLoadingAccount] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmStep, setIsConfirmStep] = useState(false);
  const [isLoadingTerms, setIsLoadingTerms] = useState(true);
  const [isCalculatingInterest, setIsCalculatingInterest] = useState(false);
  const [interestCalculation, setInterestCalculation] = useState<Number | null>(
    null
  );
  const [operationResult, setOperationResult] = useState<{
    success: boolean;
    message: string;
    accountId?: string;
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
            sourceAccountId: account.id,
          }));
        }
      } catch (error) {
        console.error("Error fetching checking account:", error);
      } finally {
        setIsLoadingAccount(false);
      }
    };

    const fetchSavingTerms = async () => {
      setIsLoadingTerms(true);
      try {
        const termsData = await getSavingTerm();
        if (termsData && termsData.length > 0) {
          setSavingTerms(termsData);
        }
      } catch (error) {
        console.error("Error fetching saving terms:", error);
      } finally {
        setIsLoadingTerms(false);
      }
    };

    fetchCheckingAccount();
    fetchSavingTerms();
  }, []);

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData({
      ...formData,
      [field]: value,
    });

    // Cập nhật selectedTerm khi termMonths thay đổi
    if (field === "termMonths") {
      const term = savingTerms.find((term) => term.termMonths === value);
      setSelectedTerm(term || null);
    }
  };

  const calculateExpectedAmount = async () => {
    if (!selectedTerm) return;

    setIsCalculatingInterest(true);
    try {
      const result = await calculateExpectedInterest({
        principal: formData.amount,
        months: formData.termMonths,
        annualRate: selectedTerm.interestRate,
        monthlyDeposit: formData.monthlyDepositAmount,
      });

      console.log(result);
      setInterestCalculation(result);
    } catch (error) {
      console.error("Error calculating interest rate:", error);
    } finally {
      setIsCalculatingInterest(false);
    }
  };

  const handleSubmit = async () => {
    if (!isConfirmStep) {
      setIsConfirmStep(true);
      calculateExpectedAmount();
      return;
    }

    setIsSubmitting(true);
    try {
      const requestData = {
        sourceAccountId: formData.sourceAccountId,
        amount: formData.amount,
        termMonths: formData.termMonths,
        ...(formData.monthlyDepositAmount > 0 && {
          monthlyDepositAmount: formData.monthlyDepositAmount,
        }),
      };
      
      const result = await createSavingAccountAction(requestData);

      if (result && result.success) {
        setOperationResult({
          success: true,
          message: "Saving account created successfully",
          accountId: result.data.id,
        });

        setTimeout(() => {
          router.push(`/customer/dashboard/accounts/${result.data.id}`);
        }, 2000);
      } else {
        setOperationResult({
          success: false,
          message: "Failed to create saving account. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error creating saving account:", error);
      setOperationResult({
        success: false,
        message: "An error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    setIsConfirmStep(false);
    setInterestCalculation(null);
  };

  const canCreateAccount =
    formData.amount > 0 &&
    formData.termMonths > 0 &&
    checkingAccount &&
    formData.amount <= checkingAccount.balance;
  return (
    <Box>
      <Card.Root>
        <Card.Body>
          {operationResult ? (
            <Stack gap={4} align="center" userSelect="none">
              <Heading
                size="md"
                color={operationResult.success ? "green.500" : "red.500"}
              >
                {operationResult.success ? "Success!" : "Error"}
              </Heading>
              <Text>{operationResult.message}</Text>
              {operationResult.success && (
                <Text fontSize="sm">
                  Account ID: {operationResult.accountId}
                </Text>
              )}
              <Text fontSize="sm">Redirecting to account details page...</Text>
            </Stack>
          ) : !isConfirmStep ? (
            <Stack gap={4} userSelect="none">
              <Heading size="md">Create Saving Account</Heading>

              {checkingAccount && (
                <Box p={3} borderWidth={1} borderRadius="md" bg="gray.700">
                  <Flex justify="space-between">
                    <Text fontWeight="bold" userSelect="none">
                      Source Account:
                    </Text>
                    <Text userSelect="none">{checkingAccount.id}</Text>
                  </Flex>
                </Box>
              )}

              <Field.Root>
                <Field.Label>Initial Deposit Amount</Field.Label>
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
                {checkingAccount &&
                  formData.amount > checkingAccount.balance && (
                    <Text color="red.500" fontSize="sm" mt={1}>
                      Insufficient balance for initial deposit
                    </Text>
                  )}
              </Field.Root>

              <Field.Root>
                <Field.Label>Term (Months)</Field.Label>
                <Select.Root
                  value={
                    formData.termMonths ? [formData.termMonths.toString()] : []
                  }
                  onValueChange={(details) => {
                    const value = parseInt(details.value[0]);
                    handleInputChange("termMonths", value);
                  }}
                  size="md"
                  collection={createListCollection({
                    items: savingTerms.map((term) => ({
                      label: `${term.termMonths} months (${term.interestRate}%)`,
                      value: term.termMonths.toString(),
                    })),
                  })}
                >
                  <Select.HiddenSelect />
                  <Select.Control>
                    <Select.Trigger>
                      <Select.ValueText placeholder="Select term" />
                    </Select.Trigger>
                    <Select.IndicatorGroup>
                      <Select.Indicator />
                    </Select.IndicatorGroup>
                  </Select.Control>
                  <Select.Positioner>
                    <Select.Content>
                      {isLoadingTerms ? (
                        <Box p={2} textAlign="center">
                          <Spinner size="sm" />
                        </Box>
                      ) : (
                        savingTerms.map((term) => (
                          <Select.Item
                            key={term.id}
                            item={{
                              label: `${term.termMonths} months (${term.interestRate}%)`,
                              value: term.termMonths.toString(),
                            }}
                          >
                            <Select.ItemText>
                              {term.termMonths} months ({term.interestRate}%)
                            </Select.ItemText>
                            <Select.ItemIndicator />
                          </Select.Item>
                        ))
                      )}
                    </Select.Content>
                  </Select.Positioner>
                </Select.Root>
                {selectedTerm && (
                  <Field.HelperText>
                    Interest Rate: {selectedTerm.interestRate}%
                  </Field.HelperText>
                )}
              </Field.Root>

              <Field.Root>
                <Field.Label>Monthly Deposit Amount</Field.Label>
                <NumberInput.Root
                  min={0}
                  value={formData.monthlyDepositAmount.toString()}
                  onValueChange={(details) => {
                    const value = parseFloat(details.value);
                    handleInputChange(
                      "monthlyDepositAmount",
                      isNaN(value) ? 0 : value
                    );
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
                <Field.HelperText>
                  Optional: Amount to deposit monthly
                </Field.HelperText>
              </Field.Root>

              <Button
                colorScheme="blue"
                onClick={handleSubmit}
                disabled={!canCreateAccount}
              >
                Continue
              </Button>
            </Stack>
          ) : (
            <Stack gap={4}>
              <Heading size="md">Confirm Saving Account Creation</Heading>

              <Box borderWidth={1} borderRadius="md" p={4}>
                <Stack gap={3}>
                  <Flex justify="space-between">
                    <Text fontWeight="bold">Source Account:</Text>
                    <Text>{checkingAccount?.id}</Text>
                  </Flex>

                  <Flex justify="space-between">
                    <Text fontWeight="bold">Initial Deposit:</Text>
                    <Text>{formData.amount.toLocaleString()}đ</Text>
                  </Flex>

                  <Flex justify="space-between">
                    <Text fontWeight="bold">Term:</Text>
                    <Text>{formData.termMonths} months</Text>
                  </Flex>

                  <Flex justify="space-between">
                    <Text fontWeight="bold">Interest Rate:</Text>
                    <Text>{selectedTerm?.interestRate}%</Text>
                  </Flex>

                  <Flex justify="space-between">
                    <Text fontWeight="bold">Monthly Deposit:</Text>
                    <Text>
                      {formData.monthlyDepositAmount.toLocaleString()}đ
                    </Text>
                  </Flex>

                  {/* Hiển thị số tiền dự đoán */}
                  {isCalculatingInterest ? (
                    <Flex justify="center" py={2}>
                      <Spinner size="sm" />
                      <Text ml={2}>Calculating expected amount...</Text>
                    </Flex>
                  ) : interestCalculation ? (
                    <>
                      <Flex justify="space-between">
                        <Text fontWeight="bold">Interest Rate:</Text>
                        <Text color="green.400">
                          {selectedTerm?.interestRate}%
                        </Text>
                      </Flex>
                      <Flex justify="space-between">
                        <Text fontWeight="bold">Expected Total Amount:</Text>
                        <Text color="green.400" fontWeight="bold">
                          {interestCalculation.toLocaleString()}đ
                        </Text>
                      </Flex>
                    </>
                  ) : null}
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
                  Create Saving Account
                </Button>
              </Flex>
            </Stack>
          )}
        </Card.Body>
      </Card.Root>
    </Box>
  );
};

export default SavingAccountForm;
