import { Box, Button, Menu, Portal, Tabs } from "@chakra-ui/react";
import { signOut } from "next-auth/react";
import { ReactNode, useEffect, useState } from "react";

interface MenuItem {
  id: string;
  label: string;
  icon?: ReactNode;
  children?: ReactNode;
  data?: any;
}

interface NavigationProps {
  items: MenuItem[];
  defaultValue?: string;
  onMenuItemClick?: (item: MenuItem) => void;
  renderContent: (itemId: string, data?: any) => ReactNode;
}

const Navigation = ({
  items = [],
  defaultValue = "profile",
  onMenuItemClick,
  renderContent,
}: NavigationProps) => {
  const [activeTab, setActiveTab] = useState(defaultValue);
  // Cập nhật activeTab khi defaultValue thay đổi từ bên ngoài
  useEffect(() => {
    setActiveTab(defaultValue);
  }, [defaultValue]);

  const handleTabChange = (item: MenuItem) => {
    setActiveTab(item.id);
    onMenuItemClick?.(item);
  };

  return (
    <Tabs.Root
      orientation="vertical"
      value={activeTab}
      defaultValue={defaultValue}
      overflowY="hidden"
      height="calc(100vh - 100px)"
    >
      <Tabs.List height="100%">
        {items.map((item) => (
          <Tabs.Trigger
            key={item.id}
            value={item.id}
            onClick={() => handleTabChange(item)}
          >
            {item.icon}
            {item.label}
          </Tabs.Trigger>
        ))}

        <Tabs.Indicator bg="bg.muted" rounded="l3" p="1" />

        <Box mt="auto" position="absolute" bottom="4" left="4" right="4">
          <Menu.Root positioning={{ placement: "top-start" }}>
            <Menu.Trigger asChild>
              <Button variant="outline" size="sm">
                Open menu
              </Button>
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner>
                <Menu.Content>
                  <Menu.Item
                    value="logout"
                    color="fg.error"
                    _hover={{ bg: "bg.error", color: "fg.error" }}
                    onSelect={async () => {
                      try {
                        await signOut();
                      } catch (error) {
                        console.error("Logout error:", error);
                      }
                    }}
                  >
                    Logout
                  </Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
        </Box>
      </Tabs.List>
      {items.map((item) => (
        <Tabs.Content key={item.id} value={item.id}>
          {renderContent(item.id, item.data)}
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
};

export default Navigation;
