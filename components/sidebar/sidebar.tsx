"use client";

import {
  FiCompass,
  FiHome,
  FiSettings,
  FiStar,
  FiTrendingUp,
  FiUser,
} from "react-icons/fi";
import { Box, Flex, Heading } from "@chakra-ui/react";
import { NavItem } from "./nav-item";

export const Sidebar = () => {
  const navItems = [
    { name: "Home", icon: FiHome, path: "/admin/dashboard" },
    { name: "Accounts", icon: FiUser, path: "/admin/dashboard/accounts" },
    { name: "Analytics", icon: FiTrendingUp, path: "/analytics" },
    { name: "Explore", icon: FiCompass, path: "/explore" },
    { name: "Favorites", icon: FiStar, path: "/favorites" },
    { name: "Settings", icon: FiSettings, path: "/settings" },
  ];

  return (
    <Box className="w-1/6 min-h-screen space-y-4 px-4 py-6 border-r border-gray-100">
      <Heading fontSize="2xl" fontWeight="bold">
        Dashboard
      </Heading>

      <Flex direction="column" justifyContent="space-between" gapY="4">
        {navItems.map((item) => (
          <NavItem key={item.name} icon={item.icon} path={item.path}>
            {item.name}
          </NavItem>
        ))}
      </Flex>
    </Box>
  );
};
