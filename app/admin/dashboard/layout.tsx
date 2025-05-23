import { Sidebar } from "@/components/sidebar/sidebar";
import { Box } from "@chakra-ui/react";

const AdminDashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box className="w-full flex min-h-screen m-2">
      <Sidebar />

      {/* Main content */}
      <Box className="w-5/6 p-6">{children}</Box>
    </Box>
  );
};

export default AdminDashboardLayout;
