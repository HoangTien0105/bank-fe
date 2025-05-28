"use client";

import { Sidebar } from "@/components/sidebar/sidebar";
import { Box } from "@chakra-ui/react";
import { FaMoneyBill, FaMoneyCheck } from "react-icons/fa";
import { FiCreditCard, FiDollarSign, FiHome } from "react-icons/fi";

const navItems = [
  { name: "Home", icon: FiHome, path: "/customer/dashboard" },
  {
    name: "Deposit/Withdraw",
    icon: FaMoneyBill,
    path: "/customer/dashboard/funds",
  },
  {
    name: "Transfer",
    icon: FaMoneyCheck,
    path: "/customer/dashboard/transfer",
  },
  {
    name: "Transactions",
    icon: FiDollarSign,
    path: "/customer/dashboard/transactions",
  },
  {
    name: "Accounts",
    icon: FiCreditCard,
    path: "/customer/dashboard/accounts",
  },
];

const CustomerDashboardLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <Box className="w-full flex min-h-screen m-2">
      <Sidebar navItems={navItems} />

      {/* Main content */}
      <Box className="w-5/6 p-6">{children}</Box>
    </Box>
  );
};

export default CustomerDashboardLayout;
