"use client";

import { Box, Button, Heading, Menu, Portal, Tabs } from "@chakra-ui/react";
import { LuBanknote, LuList, LuUser } from "react-icons/lu";
import TransactionsList from "./_components/TransactionsList";
import Profile from "./_components/Profile";
import BankAccountsList from "./_components/BankAccountsList";
import { UserProfile } from "./_types/user";
import { BankAccount } from "./_types/bankAccount";
import { Transaction } from "./_types/transaction";
import { useAuth } from "@/contexts/auth-context";
import { useState } from "react";
import Navigation from "@/components/common/Navigation";

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

const mockTransactions: Transaction[] = [
  {
    id: "tx-001",
    date: new Date().toISOString().split("T")[0],
    description: "Grocery Store",
    amount: 87.35,
    type: "debit",
    category: "Food",
  },
  {
    id: "tx-002",
    date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
    description: "Salary Deposit",
    amount: 3500.0,
    type: "credit",
    category: "Income",
  },
  {
    id: "tx-003",
    date: new Date(Date.now() - 2 * 86400000).toISOString().split("T")[0],
    description: "Electric Bill",
    amount: 124.79,
    type: "debit",
    category: "Utilities",
  },
  {
    id: "tx-004",
    date: new Date(Date.now() - 3 * 86400000).toISOString().split("T")[0],
    description: "Restaurant",
    amount: 65.2,
    type: "debit",
    category: "Dining",
  },
  {
    id: "tx-005",
    date: new Date(Date.now() - 4 * 86400000).toISOString().split("T")[0],
    description: "Online Shopping",
    amount: 159.99,
    type: "debit",
    category: "Shopping",
  },
];

const Page = () => {
  const { logout } = useAuth();
  const [menuItems, setMenuItems] = useState([
    {
      id: 'profile',
      label: 'Profile',
      icon: <LuUser />,
      children: <Profile profile={mockUserProfile} />
    },
    {
      id: 'bank-accounts',
      label: 'Bank Accounts',
      icon: <LuBanknote />,
      children: <BankAccountsList bankAccounts={mockBankAccounts} />
    },
    {
      id: 'transactions',
      label: 'Transactions',
      icon: <LuList />,
      children: <TransactionsList transactions={mockTransactions} />
    }
  ]);


  return (
    <Box p={6} height="100vh" position="relative">
      <Heading mb={4}>Dashboard</Heading>
      <Navigation items={menuItems}/>
    </Box>
  );
};

export default Page;
