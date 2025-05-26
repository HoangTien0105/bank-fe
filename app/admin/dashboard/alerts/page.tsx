import { getAllAlerts } from "@/api/alert";
import PaginationComponent from "@/components/common/Pagination";
import { Alert } from "@/types/alert";
import { formatDateTime } from "@/utils/date";
import { Box, Heading, Table, Badge, Text } from "@chakra-ui/react";
import Link from "next/link";

interface AlertsPageProps {
  searchParams?: {
    page?: string;
  };
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "NEW":
      return "red";
    case "IN_PROGRESS":
      return "yellow";
    case "RESOLVED":
      return "green";
    default:
      return "gray";
  }
};

const AlertsPage = async ({ searchParams }: AlertsPageProps) => {
  const itemsPerPage = 10;
  const page = await searchParams;
  const currentPage = Number(page?.page) || 1;
  const offset = (currentPage - 1) * itemsPerPage;

  const response = await getAllAlerts({
    offset,
    limit: itemsPerPage,
    sortBy: "createDate",
    sortDirection: "DESC"
  });

  const alerts = response?.results || [];
  const totalPages = response?.totalPages || 1;

  return (
    <Box userSelect="none">
      <Heading size="lg" mb={6}>
        All Alerts
      </Heading>
      
      {alerts.length === 0 ? (
        <Box textAlign="center" py={10}>
          <Text fontSize="lg">No alerts found</Text>
        </Box>
      ) : (
        <>
          <Table.Root size="sm" userSelect="none">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>ID</Table.ColumnHeader>
                <Table.ColumnHeader>Transaction</Table.ColumnHeader>
                <Table.ColumnHeader>Alert Type</Table.ColumnHeader>
                <Table.ColumnHeader>Description</Table.ColumnHeader>
                <Table.ColumnHeader>Status</Table.ColumnHeader>
                <Table.ColumnHeader>Created Date</Table.ColumnHeader>
                <Table.ColumnHeader>Processed Date</Table.ColumnHeader>
                <Table.ColumnHeader>Processed By</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {alerts.map((alert : Alert) => (
                <Table.Row key={alert.id} cursor="pointer">
                  <Table.Cell>
                    <Link href={`/admin/dashboard/alerts/${alert.id}`}>
                      <Text color="blue.500" _hover={{ textDecoration: "underline" }}>
                        {alert.id}
                      </Text>
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{alert.transaction}</Table.Cell>
                  <Table.Cell>{alert.alertType}</Table.Cell>
                  <Table.Cell maxW="300px" truncate>
                    {alert.description}
                  </Table.Cell>
                  <Table.Cell>
                    <Badge colorPalette={getStatusColor(alert.status)}>
                      {alert.status}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>{formatDateTime(alert.createDate)}</Table.Cell>
                  <Table.Cell>
                    {alert.processedDate ? formatDateTime(alert.processedDate) : "N/A"}
                  </Table.Cell>
                  <Table.Cell>{alert.processedBy || "N/A"}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>

          {totalPages > 1 && (
            <PaginationComponent
              currentPage={currentPage}
              totalPages={totalPages}
            />
          )}
        </>
      )}
    </Box>
  );
};

export default AlertsPage;