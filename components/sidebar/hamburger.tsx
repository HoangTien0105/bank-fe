import { clearSession } from "@/utils/session";
import { Button, Menu, Portal } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { HiCog } from "react-icons/hi";

export const Hamburger = async () => {

  const handleLogout = async () => {
    try {
      // Gọi clearSession để xử lý logout ở backend
      await clearSession();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

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
              _hover={{ bg: "bg.error", color: "fg.error", cursor: "pointer" }}
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
