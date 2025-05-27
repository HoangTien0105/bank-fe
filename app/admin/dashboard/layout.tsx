"use client";

import { Sidebar } from "@/components/sidebar/sidebar";
import { Box } from "@chakra-ui/react";
import { FiAlertOctagon, FiDollarSign, FiHome, FiUser } from "react-icons/fi";

const navItems = [
  { name: "Home", icon: FiHome, path: "/admin/dashboard" },
  { name: "Alerts", icon: FiAlertOctagon, path: "/admin/dashboard/alerts" },
  { name: "Customers", icon: FiUser, path: "/admin/dashboard/customers" },
  {
    name: "Transactions",
    icon: FiDollarSign,
    path: "/admin/dashboard/transactions",
  },
];

const AdminDashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box className="w-full flex min-h-screen m-2">
      <Sidebar navItems={navItems} />

      <Box className="w-5/6 p-6">{children}</Box>
    </Box>
  );
};

export default AdminDashboardLayout;
