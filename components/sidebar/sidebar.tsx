"use client";

import { Box, Flex, Heading, Spacer } from "@chakra-ui/react";
import { NavItem } from "./nav-item";
import Hamburger from "./hamburger";

export const Sidebar = ({ navItems }: any) => {
  return (
    <Box className="w-1/6 min-h-screen space-y-4 px-4 py-6 border-r border-gray-100">
      <Flex align="center" mb={4}>
        <Heading fontSize="2xl" fontWeight="bold">
          Dashboard
        </Heading>
        <Spacer />
        <Hamburger />
      </Flex>

      <Flex direction="column" justifyContent="space-between" gapY="4">
        {navItems.map((item: any) => (
          <NavItem key={item.name} icon={item.icon} path={item.path}>
            {item.name}
          </NavItem>
        ))}
      </Flex>
    </Box>
  );
};
