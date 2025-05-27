"use server";

import { getAlertById, updateAlertStatus } from "@/api/alert";
import { formatDateTime } from "@/utils/date";
import {
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  Grid,
  GridItem,
  Heading,
  Text,
  VStack,
  Badge,
  Select,
  Textarea,
  Stack,
  createListCollection,
} from "@chakra-ui/react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import AlertStatusSelect from "@/app/admin/_components/AlertStatusSelect";

interface AlertDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "NEW":
      return "red";
    case "PROCESSING":
      return "yellow";
    case "RESOLVED":
      return "green";
    default:
      return "gray";
  }
};

const AlertDetailsPage = async ({ params }: AlertDetailsPageProps) => {
  const { id } = await params;
  const alert = await getAlertById(id);
  const alertTypesItems = [
    { label: "PROCESSING", value: "PROCESSING" },
    { label: "RESOLVED", value: "RESOLVED" },
    { label: "IGNORED", value: "IGNORED" },
  ];

  if (!alert) {
    return (
      <Box textAlign="center" py={10}>
        <Text fontSize="lg">Alert not found</Text>
      </Box>
    );
  }

  async function handleStatusUpdate(formData: FormData) {
    "use server";

    const status = formData.get("status") as string;
    const notes = formData.get("notes") as string;

    try {
      await updateAlertStatus(id, { status, notes });
      revalidatePath(`/admin/dashboard/alerts/${id}`);
      revalidatePath("/admin/dashboard/alerts");
    } catch (error) {
      console.error("Error updating alert status:", error);
    }
  }

  const cardBg = "bg";
  const alertTypes = createListCollection({
    items: alertTypesItems,
  });

  return (
    <Box w="full" maxW="4xl" margin="auto" userSelect="none">
      <Stack>
        <Card.Root
          bg={cardBg}
          borderWidth="1px"
          borderRadius="lg"
          overflow="hidden"
          boxShadow="md"
        >
          <CardBody>
            <VStack align="stretch" gap={6}>
              <Flex justifyContent="space-between" alignItems="center">
                <Flex alignItems="center" gap={2}>
                  <Link href="/admin/dashboard/alerts">
                    <ArrowLeft size={20} />
                  </Link>
                  <Heading size="md">Alert Details</Heading>
                </Flex>
                <Badge colorPalette={getStatusColor(alert.status)} size="lg">
                  {alert.status}
                </Badge>
              </Flex>

              <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                <GridItem>
                  <Box>
                    <Text fontSize="sm" color="gray.500">
                      Alert ID
                    </Text>
                    <Text fontWeight="medium">{alert.id}</Text>
                  </Box>
                </GridItem>
                <GridItem>
                  <Box>
                    <Text fontSize="sm" color="gray.500">
                      Transaction ID
                    </Text>
                    <Text fontWeight="medium">{alert.transaction}</Text>
                  </Box>
                </GridItem>
                <GridItem>
                  <Box>
                    <Text fontSize="sm" color="gray.500">
                      Alert Type
                    </Text>
                    <Text fontWeight="medium">{alert.alertType}</Text>
                  </Box>
                </GridItem>
                <GridItem>
                  <Box>
                    <Text fontSize="sm" color="gray.500">
                      Created Date
                    </Text>
                    <Text fontWeight="medium">
                      {formatDateTime(alert.createDate)}
                    </Text>
                  </Box>
                </GridItem>
                {alert.processedDate && (
                  <GridItem>
                    <Box>
                      <Text fontSize="sm" color="gray.500">
                        Processed Date
                      </Text>
                      <Text fontWeight="medium">
                        {formatDateTime(alert.processedDate)}
                      </Text>
                    </Box>
                  </GridItem>
                )}
                {alert.processedBy && (
                  <GridItem>
                    <Box>
                      <Text fontSize="sm" color="gray.500">
                        Processed By
                      </Text>
                      <Text fontWeight="medium">{alert.processedBy}</Text>
                    </Box>
                  </GridItem>
                )}
              </Grid>

              <Box>
                <Text fontSize="sm" color="gray.500" mb={2}>
                  Description
                </Text>
                <Text>{alert.description}</Text>
              </Box>

              {alert.resolutionNotes && (
                <Box>
                  <Text fontSize="sm" color="gray.500" mb={2}>
                    Resolution Notes
                  </Text>
                  <Text>{alert.resolutionNotes}</Text>
                </Box>
              )}

              <Box>
                <Heading size="sm" mb={4}>
                  Update Status
                </Heading>
                <form action={handleStatusUpdate}>
                  <VStack align="stretch" gap={4}>
                    <AlertStatusSelect
                      defaultValue={alert.status}
                      name="status"
                    />
                    <Box>
                      <Text fontSize="sm" color="gray.500" mb={2}>
                        Notes
                      </Text>
                      <Textarea
                        name="notes"
                        placeholder="Add resolution notes..."
                        defaultValue={alert.resolutionNotes || ""}
                        rows={4}
                      />
                    </Box>
                    <Button type="submit" colorScheme="blue" size="sm">
                      Update Status
                    </Button>
                  </VStack>
                </form>
              </Box>
            </VStack>
          </CardBody>
        </Card.Root>
      </Stack>
    </Box>
  );
};

export default AlertDetailsPage;
