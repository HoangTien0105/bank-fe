"use client";

import { Box, Flex, Heading } from "@chakra-ui/react";
import { NavItem } from "./nav-item";

export const Sidebar = ({ navItems }: any) => {
  return (
    <Box className="w-1/6 min-h-screen space-y-4 px-4 py-6 border-r border-gray-100">
      <Heading fontSize="2xl" fontWeight="bold">
        Dashboard
      </Heading>

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
