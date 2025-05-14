import { Box, Heading, Tabs } from "@chakra-ui/react";
import { LuBanknote, LuList, LuUser } from "react-icons/lu";
import TransactionsList from "./_components/TransactionsList";

const mockTransactions: Transaction[] = [
  {
    id: "tx-001",
    date: "2025-05-13",
    description: "Grocery Store",
    amount: 87.35,
    type: "debit",
    category: "Food",
  },
  {
    id: "tx-002",
    date: "2025-05-12",
    description: "Salary Deposit",
    amount: 3500.0,
    type: "credit",
    category: "Income",
  },
  {
    id: "tx-003",
    date: "2025-05-10",
    description: "Electric Bill",
    amount: 124.79,
    type: "debit",
    category: "Utilities",
  },
  {
    id: "tx-004",
    date: "2025-05-08",
    description: "Restaurant",
    amount: 65.2,
    type: "debit",
    category: "Dining",
  },
  {
    id: "tx-005",
    date: "2025-05-05",
    description: "Online Shopping",
    amount: 159.99,
    type: "debit",
    category: "Shopping",
  },
];

const Page = () => {
  return (
    <Box p={6}>
      <Heading mb={4}>Dashboard</Heading>
      <Tabs.Root orientation="vertical" defaultValue="profile">
        <Tabs.List>
          <Tabs.Trigger value="profile">
            <LuUser />
            Profile
          </Tabs.Trigger>

          <Tabs.Trigger value="bank-accounts">
            <LuBanknote />
            Bank Accounts
          </Tabs.Trigger>

          <Tabs.Trigger value="transactions">
            <LuList />
            Transactions
          </Tabs.Trigger>

          <Tabs.Indicator />
        </Tabs.List>

        <Tabs.Content value="profile">Your Profile</Tabs.Content>
        <Tabs.Content value="bank-accounts">Bank accounts</Tabs.Content>
        <Tabs.Content value="transactions">
          <TransactionsList transactions={mockTransactions} />
        </Tabs.Content>
      </Tabs.Root>
    </Box>
  );
};

export default Page;
