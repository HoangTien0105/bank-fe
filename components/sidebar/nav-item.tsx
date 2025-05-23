"use client";

import { Box, Flex, Icon, Text } from "@chakra-ui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItemProps {
  icon: React.ElementType;
  children: React.ReactNode;
  path: string;
}

export const NavItem = ({ icon, children, path }: NavItemProps) => {
  const pathName = usePathname();
  const isActive = pathName === path;

  return (
    <Box
      className={`w-full px-4 py-2 rounded-lg transition-colors duration-200 ${
        isActive ? "bg-gray-100" : "hover:bg-gray-200"
      }`}
    >
      <Link href={path}>
        <Flex align="center">
          <Icon
            as={icon}
            fontSize="xl"
            color={isActive ? "blue.500" : "gray.600"}
            _groupHover={{
              color: "blue.500",
            }}
          />
          <Text
            ml={4}
            fontWeight={isActive ? "bold" : "medium"}
            color={isActive ? "blue.500" : "gray.600"}
            _groupHover={{
              color: "blue.500",
            }}
          >
            {children}
          </Text>
        </Flex>
      </Link>
    </Box>
  );
};
