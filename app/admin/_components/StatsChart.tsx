"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Grid,
  GridItem,
  Select,
  Flex,
  Text,
  Spinner,
  Center,
  createListCollection,
  Button,
} from "@chakra-ui/react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { AdminStatsData } from "@/types/adminStats";
import { exportAdminStatsAction, getAdminStatsAction } from "../action";

interface StatsChartsProps {
  initialStartDate?: string;
  initialEndDate?: string;
}

const StatsCharts = ({
  initialStartDate = "01-05-2025",
  initialEndDate = "30-05-2025",
}: StatsChartsProps) => {
  const [data, setData] = useState<AdminStatsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(initialStartDate);
  const [exporting, setExporting] = useState(false);
  const [endDate, setEndDate] = useState(initialEndDate);

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getAdminStatsAction(startDate, endDate);
      console.log(result);
      if (result && result.response && Array.isArray(result.response)) {
        const formattedData = result.response.map((item) => ({
          ...item,
          date: new Date(item.date).toLocaleDateString("vi-VN", {
            month: "short",
            day: "numeric",
          }),
        }));
        setData(formattedData);
        console.log(data);
      } else if (Array.isArray(result)) {
        const formattedData = result.map((item) => ({
          ...item,
          date: new Date(item.date).toLocaleDateString("vi-VN", {
            month: "short",
            day: "numeric",
          }),
        }));
        setData(formattedData);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Center h="400px">
        <Spinner size="xl" />
      </Center>
    );
  }

  const handleExportExcel = async () => {
    setExporting(true);
    try {
      const result = await exportAdminStatsAction(startDate, endDate);

      if (!result.success || !result.data) {
        alert(result.message || "Something went wrong");
        return;
      }

      // Tạo URL và download file
      const url = window.URL.createObjectURL(result.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = `admin-stats-${startDate}-to-${endDate}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Error exporting Excel:", error);
      alert("Có lỗi xảy ra khi xuất file Excel");
    } finally {
      setExporting(false);
    }
  };
  return (
    <Box w="full" mt={6}>
      <Card.Root mb={6}>
        <CardBody>
          <Flex gap={4} align="center" wrap="wrap" justify="space-between">
            <Flex gap={4} align="center" wrap="wrap">
              <Box>
                <Text fontSize="sm" mb={1}>
                  From Date
                </Text>
                <input
                  type="date"
                  value={startDate.split("-").reverse().join("-")}
                  onChange={(e) => {
                    const [year, month, day] = e.target.value.split("-");
                    setStartDate(`${day}-${month}-${year}`);
                  }}
                  style={{
                    padding: "8px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                  }}
                />
              </Box>
              <Box>
                <Text fontSize="sm" mb={1}>
                  To Date
                </Text>
                <input
                  type="date"
                  value={endDate.split("-").reverse().join("-")}
                  onChange={(e) => {
                    const [year, month, day] = e.target.value.split("-");
                    setEndDate(`${day}-${month}-${year}`);
                  }}
                  style={{
                    padding: "8px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                  }}
                />
              </Box>
            </Flex>

            <Button
              onClick={handleExportExcel}
              loading={exporting}
              colorScheme="green"
              size="md"
              disabled={!startDate || !endDate || exporting}
            >
              {exporting ? "Exporting..." : "Export"}
            </Button>
          </Flex>
        </CardBody>
      </Card.Root>

      <Grid templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }} gap={6}>
        <GridItem>
          <Card.Root>
            <CardHeader>
              <Heading size="md">Total transactions</Heading>
            </CardHeader>
            <CardBody>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    name="Total Transactions"
                    dataKey="totalTransactions"
                    stroke="#3182ce"
                    strokeWidth={2}
                    dot={{ fill: "#3182ce" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardBody>
          </Card.Root>
        </GridItem>

        <GridItem>
          <Card.Root>
            <CardHeader>
              <Heading size="md">Total customer</Heading>
            </CardHeader>
            <CardBody>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    data={data}
                    name="Total customer"
                    type="monotone"
                    dataKey="totalCustomers"
                    stroke="#38a169"
                    strokeWidth={2}
                    dot={{ fill: "#38a169" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardBody>
          </Card.Root>
        </GridItem>

        <GridItem colSpan={{ base: 1, lg: 2 }}>
          <Card.Root>
            <CardHeader>
              <Heading size="md">
                Transaction Amount Analysis (Max/Avg/Min)
              </Heading>
            </CardHeader>
            <CardBody>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis width={120} />
                  <Tooltip
                    formatter={(value, name) => [
                      value ? `${Number(value).toLocaleString()} VND` : "N/A",
                      name,
                    ]}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="maxTransactionAmount"
                    stroke="#e53e3e"
                    strokeWidth={2}
                    name="Max amount"
                    connectNulls={true}
                    dot={{ fill: "#e53e3e", r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="avgTransactionAmount"
                    stroke="#d69e2e"
                    strokeWidth={2}
                    name="Average amount"
                    connectNulls={true}
                    dot={{ fill: "#d69e2e", r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="minTransactionAmount"
                    stroke="#805ad5"
                    strokeWidth={2}
                    name="Min amount"
                    connectNulls={true}
                    dot={{ fill: "#805ad5", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardBody>
          </Card.Root>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default StatsCharts;
