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
  Input,
  InputGroup,
  List,
  ListItem,
  NumberInput,
  NumberInputInput,
  Select,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  getCheckingAccountByCustomerId,
  searchCustomerInfo,
  transferMoneyForCustomer,
} from "../action";
import { useRouter } from "next/navigation";

interface ReceiverInfo {
  id: string;
  name: string;
  email: string;
  phone: string;
  accountId: string;
}

interface TransferFormData {
  amount: number;
  message: string;
  receiverId: string;
  fromAccountId: string;
  location: string;
  searchValue: string;
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

const TransferForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<TransferFormData>({
    amount: 0,
    message: "",
    receiverId: "",
    fromAccountId: "",
    location: "Phú Nhuận",
    searchValue: "",
  });

  const [foundReceivers, setFoundReceivers] = useState<ReceiverInfo[]>([]);
  const [selectedReceiver, setSelectedReceiver] = useState<ReceiverInfo | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [checkingAccount, setCheckingAccount] = useState<AccountInfo | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmStep, setIsConfirmStep] = useState(false);
  const [isLoadingAccount, setIsLoadingAccount] = useState(true);
  const [transferResult, setTransferResult] = useState<{
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
          // Thiết lập fromAccountId khi tài khoản được tải
          setFormData((prev) => ({
            ...prev,
            fromAccountId: account.id,
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

  useEffect(() => {
    if (!selectedReceiver && formData.searchValue.trim().length > 0) {
      const timeoutId = setTimeout(async () => {
        setIsSearching(true);
        try {
          const response = await searchCustomerInfo(formData.searchValue);
          setFoundReceivers(response.results || []);
        } catch (error) {
          console.error("Error searching for recipient:", error);
          setFoundReceivers([]);
        } finally {
          setIsSearching(false);
        }
      }, 500);

      return () => clearTimeout(timeoutId);
    } else if (formData.searchValue.trim().length === 0) {
      setFoundReceivers([]);
    }
  }, [formData.searchValue, selectedReceiver]);

  const handleSearchReceiver = (receiver: ReceiverInfo) => {
    setSelectedReceiver(receiver);
    setFormData({
      ...formData,
      receiverId: receiver.accountId,
    });
    setFoundReceivers([]);
  };

  const handleInputChange = (field: keyof TransferFormData, value: any) => {
    setFormData({
      ...formData,
      [field]: value,
    });

    if (field === "searchValue") {
      setSelectedReceiver(null);
    }
  };

  const handleClearReceiver = () => {
    setSelectedReceiver(null);
    setFormData({
      ...formData,
      receiverId: "",
      searchValue: "",
    });
    setFoundReceivers([]);
  };

  const handleSubmit = async () => {
    if (!isConfirmStep) {
      setIsConfirmStep(true);
      return;
    }

    setIsSubmitting(true);
    try {
      const transferData = {
        fromAccountId: formData.fromAccountId,
        toAccountId: formData.receiverId,
        amount: formData.amount,
        description: formData.message,
        location: formData.location,
      };

      const result = await transferMoneyForCustomer(transferData);

      if (result) {
        setTransferResult({
          success: true,
          message: "Transfer completed successfully",
          transactionId: result.data.id,
        });

        setTimeout(() => {
          router.push(
            `/customer/dashboard/transactions?keyword=${result.data.id}`
          );
        }, 2000);
      } else {
        setTransferResult({
          success: false,
          message: "Transfer failed. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error during transfer:", error);
      setTransferResult({
        success: false,
        message: "An error occurred during transfer. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    setIsConfirmStep(false);
  };

  return (
    <Box>
      <Card.Root>
        <Card.Body>
          {transferResult ? (
            <Stack gap={4} align="center">
              <Heading
                size="md"
                color={transferResult.success ? "green.500" : "red.500"}
              >
                {transferResult.success ? "Sucess!" : "Error"}
              </Heading>
              <Text>{transferResult.message}</Text>
              {transferResult.success && (
                <Text fontSize="sm">
                  Transaction ID: {transferResult.transactionId}
                </Text>
              )}
              <Text fontSize="sm">
                Redirecting to transaction page:
              </Text>
            </Stack>
          ) : !isConfirmStep ? (
            <Stack gap={4}>
              <Fieldset.Root>
                <Fieldset.Legend userSelect="none">Receiver Info</Fieldset.Legend>
                <Box position="relative">
                  <InputGroup userSelect="none">
                    <Input
                      placeholder="Input receiver information"
                      value={formData.searchValue}
                      onChange={(e) =>
                        handleInputChange("searchValue", e.target.value)
                      }
                    />
                  </InputGroup>

                  {isSearching && <Text fontSize="sm">Searching...</Text>}
                  {foundReceivers.length > 0 && !selectedReceiver && (
                    <Box
                      position="absolute"
                      zIndex={10}
                      top="100%"
                      left={0}
                      right={0}
                      mt={2}
                      borderWidth={1}
                      borderRadius="md"
                      p={2}
                      maxH="200px"
                      overflowY="auto"
                      boxShadow="md"
                      bg="gray.800"
                    >
                      <List.Root>
                        {foundReceivers.map((receiver) => (
                          <ListItem
                            key={receiver.id}
                            p={2}
                            cursor="pointer"
                            _hover={{
                              bg: "gray.700",
                              transition: "all 0.2s ease-in-out",
                            }}
                            borderBottom="1px"
                            borderColor="gray.600"
                            _last={{ borderBottom: "none" }}
                            onClick={() => handleSearchReceiver(receiver)}
                          >
                            <Text fontWeight="bold" color="white">
                              {receiver.accountId}
                            </Text>
                            <Text fontSize="sm" color="gray.300">
                              {receiver.name}
                            </Text>
                            <Text fontSize="sm" color="gray.400">
                              {receiver.phone}
                            </Text>
                          </ListItem>
                        ))}
                      </List.Root>
                    </Box>
                  )}

                  {selectedReceiver && (
                    <Box mt={2} p={2} borderWidth={1} borderRadius="md">
                      <Flex justify="space-between">
                        <Box>
                          <Text fontWeight="bold" userSelect="none">
                            Account: {selectedReceiver.accountId}
                          </Text>
                          <Text fontSize="sm" userSelect="none">{selectedReceiver.name}</Text>
                          <Text fontSize="sm" userSelect="none">
                            Phone: {selectedReceiver.phone}
                          </Text>
                        </Box>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={handleClearReceiver}
                        >
                          Change
                        </Button>
                      </Flex>
                    </Box>
                  )}
                </Box>
              </Fieldset.Root>
              {checkingAccount && (
                <Box p={3} borderWidth={1} borderRadius="md" bg="gray.700">
                  <Flex justify="space-between">
                    <Text fontWeight="bold" userSelect="none">Your Account:</Text>
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
              </Field.Root>

              <Field.Root>
                <Field.Label>Location</Field.Label>
                <Select.Root
                  collection={locations}
                  value={[formData.location]}
                  onValueChange={(details) =>
                    handleInputChange("location", details.value[0])
                  }
                  size="md"
                  userSelect="none"
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

              <Field.Root userSelect="none">
                <Field.Label>Message</Field.Label>
                <Textarea
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  placeholder="Enter transfer message or purpose"
                />
              </Field.Root>

              <Button
                colorScheme="blue"
                onClick={() => {
                  console.log(formData);
                  handleSubmit();
                }}
                disabled={
                  !selectedReceiver ||
                  formData.amount <= 0 ||
                  !checkingAccount ||
                  formData.amount > checkingAccount.balance
                }
              >
                Submit
              </Button>
            </Stack>
          ) : (
            <Stack gap={4}>
              <Heading size="md">Confirm Transfer</Heading>

              <Box borderWidth={1} borderRadius="md" p={4}>
                <Stack gap={3}>
                  <Flex justify="space-between">
                    <Text fontWeight="bold">From Account:</Text>
                    <Text>{checkingAccount?.id}</Text>
                  </Flex>

                  <Flex justify="space-between">
                    <Text fontWeight="bold">To Account:</Text>
                    <Text>
                      {selectedReceiver?.accountId} ({selectedReceiver?.name})
                    </Text>
                  </Flex>

                  <Flex justify="space-between">
                    <Text fontWeight="bold">Amount:</Text>
                    <Text>{formData.amount.toLocaleString()}đ</Text>
                  </Flex>

                  <Flex justify="space-between">
                    <Text fontWeight="bold">Message:</Text>
                    <Text>{formData.message || "(No message)"}</Text>
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
                  Confirm Transfer
                </Button>
              </Flex>
            </Stack>
          )}
        </Card.Body>
      </Card.Root>
    </Box>
  );
};
export default TransferForm;
