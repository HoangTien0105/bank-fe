"use client";

import { Sidebar } from "@/components/sidebar/sidebar";
import { Box } from "@chakra-ui/react";
import { FiHome, FiUser } from "react-icons/fi";

const navItems = [
  { name: "Home", icon: FiHome, path: "/admin/dashboard" },
  { name: "Accounts", icon: FiUser, path: "/admin/dashboard/accounts" },
];

const AdminDashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box className="w-full flex min-h-screen m-2">
      <Sidebar navItems={navItems} />

      {/* Main content */}
      <Box className="w-5/6 p-6">{children}</Box>
    </Box>
  );
};

export default AdminDashboardLayout;
