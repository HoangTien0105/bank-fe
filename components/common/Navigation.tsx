import { useAuth } from "@/contexts/auth-context";
import { Box, Button, Menu, Portal, Tabs } from "@chakra-ui/react";
import { ReactNode } from "react";

interface MenuItem {
  id: string;
  label: string;
  icon?: ReactNode;
  children?: ReactNode;
}

interface NavigationProps {
  items: MenuItem[];
  defaultValue?: string;
  onMenuItemClick?: (item: MenuItem) => void;
}

const Navigation = ({
  items = [],
  defaultValue = "profile",
  onMenuItemClick,
}: NavigationProps) => {
  const { logout } = useAuth();

  return (
    <Tabs.Root
      orientation="vertical"
      defaultValue={defaultValue}
      overflowY="hidden"
      height="calc(100vh - 100px)"
    >
      <Tabs.List height="100%">
        {items.map((item) => (
          <Tabs.Trigger
            key={item.id}
            value={item.id}
            onClick={() => onMenuItemClick?.(item)}
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
                        await logout();
                      } catch (error) {
                        console.error('Logout error:', error);
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
      {items.map(item => (
        <Tabs.Content key={item.id} value={item.id}>
          {item.children}
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
};

export default Navigation;