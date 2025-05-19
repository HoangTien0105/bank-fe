import { Box, Heading, Tabs } from "@chakra-ui/react";
import { LuBanknote, LuList, LuUser } from "react-icons/lu";
import TransactionsList from "./_components/TransactionsList";
import Profile from "./_components/Profile";
import BankAccountsList from "./_components/BankAccountsList";
import { UserProfile } from "./_types/user";
import { BankAccount } from "./_types/bankAccount";
import { getAllTransactions } from "@/api/transaction";

const mockUserProfile: UserProfile = {
  id: "user-001",
  name: "Jane Doe",
  email: "jane.doe@example.com",
  phone: "+1 (555) 123-4567",
  address: "123 Main St, Anytown, USA",
  joinedDate: "January 2020",
  avatar: "https://i.pravatar.cc/150?img=23",
};

const mockBankAccounts: BankAccount[] = [
  {
    id: "acc-001",
    accountType: "Checking",
    accountNumber: "****1234",
    balance: 5325.5,
    currency: "USD",
  },
  {
    id: "acc-002",
    accountType: "Savings",
    accountNumber: "****5678",
    balance: 12450.75,
    currency: "USD",
  },
  {
    id: "acc-003",
    accountType: "Investment",
    accountNumber: "****9012",
    balance: 45000.0,
    currency: "USD",
  },
];

const Page = async () => {
  const allTransactionsResponse = await getAllTransactions();

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

        <Tabs.Content value="profile">
          <Profile profile={mockUserProfile} />{" "}
        </Tabs.Content>
        <Tabs.Content value="bank-accounts">
          <BankAccountsList bankAccounts={mockBankAccounts} />
        </Tabs.Content>
        <Tabs.Content value="transactions">
          <TransactionsList transactions={allTransactionsResponse.results} />
        </Tabs.Content>
      </Tabs.Root>
    </Box>
  );
};

export default Page;
