"use client";

import { useColorModeValue } from "../ui/color-mode";
import { clearSession } from "@/utils/session";
import { Menu, Portal } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { FaHamburger } from "react-icons/fa";

export const Hamburger = () => {
  const router = useRouter();
  const menuBg = useColorModeValue("white", "gray.800");

  const handleLogout = async () => {
    await clearSession();
    router.push("/login");
  };

  return (
    <Menu.Root>
      <Menu.Trigger bg={menuBg} shadow="md" borderRadius="md" asChild>
        <FaHamburger size={12} />
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.Item
              value="logout"
              color="fg.error"
              _hover={{ bg: "bg.error", color: "fg.error" }}
              onClick={handleLogout}
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
