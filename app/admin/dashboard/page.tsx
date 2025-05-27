import { Box, Card, Flex, Heading, Text } from "@chakra-ui/react";
import StatsCharts from "../_components/StatsChart";
import { getTotalStats } from "../action";

const DashboardPage = async () => {
  const response = await getTotalStats();
  const adminTotalStats = response.response;

  return (
    <Box className="">
      <Heading size="2xl" mb={6}>
        Home
      </Heading>

      <Flex
        wrap="wrap"
        alignItems="center"
        justifyContent="space-evenly"
        gap={4}
      >
        <Card.Root size="lg" className="bg-gray-800 shadow-md">
          <Card.Header>
            <Text>Total Customers</Text>
          </Card.Header>
          <Card.Body>
            <Text>{adminTotalStats?.totalUsers}</Text>
          </Card.Body>
        </Card.Root>

        <Card.Root size="lg" className="bg-gray-800 shadow-md">
          <Card.Header>
            <Text>Total Transactions</Text>
          </Card.Header>
          <Card.Body>
            <Text>{adminTotalStats?.totalTransactions}</Text>
          </Card.Body>
        </Card.Root>

        <Card.Root size="lg" className="bg-gray-800 shadow-md">
          <Card.Header>
            <Text>Total Alerts</Text>
          </Card.Header>
          <Card.Body>
            <Text>{adminTotalStats?.totalAlerts}</Text>
          </Card.Body>
        </Card.Root>
      </Flex>

      <StatsCharts />
    </Box>
  );
};

export default DashboardPage;
