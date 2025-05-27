import { getAllAlerts } from "@/api/alert";
import PaginationComponent from "@/components/common/Pagination";
import { Alert } from "@/types/alert";
import { formatDateTime } from "@/utils/date";
import {
  Box,
  Heading,
  Table,
  Badge,
  Text,
  Flex,
  Field,
  Input,
  Button,
} from "@chakra-ui/react";
import Link from "next/link";
import { redirect } from "next/navigation";

interface AlertsPageProps {
  searchParams?: {
    page?: string;
    keyword?: string;
    alertType?: string;
    status?: string;
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

async function handleSearch(formData: FormData) {
  "use server";

  const keyword = formData.get("keyword")?.toString() || "";
  const alertType = formData.get("alertType")?.toString() || "";
  const status = formData.get("status")?.toString() || "";

  const searchParams = new URLSearchParams();
  if (keyword) searchParams.set("keyword", keyword);
  if (alertType) searchParams.set("alertType", alertType);
  if (status) searchParams.set("status", status);
  searchParams.set("page", "1");

  redirect(`/admin/dashboard/alerts?${searchParams.toString()}`);
}

const AlertsPage = async ({ searchParams }: AlertsPageProps) => {
  const itemsPerPage = 10;
  const params = await searchParams;
  const currentPage = Number(params?.page) || 1;
  const offset = (currentPage - 1) * itemsPerPage;
  const keyword = params?.keyword;
  const alertType = params?.alertType;
  const status = params?.status;

  const response = await getAllAlerts({
    offset,
    limit: itemsPerPage,
    keyword: keyword,
    type: alertType,
    status: status,
  });

  console.log(response);

  const alerts = response?.results || [];
  const totalPages = response?.totalPages || 1;

  return (
    <Box userSelect="none">
      <Heading size="lg" mb={6}>
        All Alerts
      </Heading>

      <Box mb={6} p={4} borderWidth="1px" borderRadius="lg">
        <form action={handleSearch}>
          <Flex direction={{ base: "column", md: "row" }} gap={4} mb={4}>
            <Field.Root flex={1}>
              <Field.Label>Keyword</Field.Label>
              <Input
                name="keyword"
                placeholder="Search"
                defaultValue={keyword || ""}
              />
            </Field.Root>

            <Field.Root flex={1}>
              <Field.Label>Type</Field.Label>
              <Input
                name="alertType"
                placeholder="Type"
                defaultValue={alertType || ""}
              />
            </Field.Root>

            <Field.Root flex={1}>
              <Field.Label>Status</Field.Label>
              <Input
                name="status"
                placeholder="Status"
                defaultValue={status || ""}
              />
            </Field.Root>
          </Flex>

          <Flex direction={{ base: "column", md: "row" }} gap={4} mb={4}>
            <Field.Root flex={1} display="flex" alignItems="flex-end">
              <Button type="submit" colorScheme="blue" width="full">
                Search
              </Button>
            </Field.Root>
          </Flex>
        </form>
      </Box>

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
              {alerts.map((alert: Alert) => (
                <Table.Row key={alert.id} cursor="pointer">
                  <Table.Cell>
                    <Link href={`/admin/dashboard/alerts/${alert.id}`}>
                      <Text
                        color="blue.500"
                        _hover={{ textDecoration: "underline" }}
                      >
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
                    {alert.processedDate
                      ? formatDateTime(alert.processedDate)
                      : "N/A"}
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
