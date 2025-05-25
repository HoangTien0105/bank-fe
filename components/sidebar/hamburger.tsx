"use client";

import { Button, Menu, Portal } from "@chakra-ui/react";
import { HiCog } from "react-icons/hi";
import { handleLogout } from "./action";

export const Hamburger = () => {
  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <Button
          suppressHydrationWarning
          shadow="md"
          borderRadius="md"
          cursor="pointer"
          variant="outline"
          size="sm"
        >
          <HiCog />
        </Button>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.Item
              value="logout"
              color="fg.error"
              _hover={{
                bg: "bg.error",
                color: "fg.error",
                cursor: "pointer",
              }}
              onClick={async () => {
                await handleLogout();
              }}
            >
              Logout
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
};

export default Hamburger;
