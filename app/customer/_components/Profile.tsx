import {
  Avatar,
  Badge,
  Box,
  Card,
  CardBody,
  Flex,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import { CustomerProfile } from "../_types/customer";
import { formatDate } from "@/utils/date";

interface ProfileProps {
  profile: CustomerProfile | null;
}

const Profile = ({ profile }: ProfileProps) => {
  return (
    <Box w="full" maxW="4xl" margin="auto">
      <VStack>
        <Flex
          w="full"
          alignItems="center"
          gap={6}
          bg="gray.800"
          p={8}
          rounded="2xl"
          shadow="2xl"
          borderWidth="1px"
          borderColor="gray.700"
          position="relative"
          _before={{
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bg: "linear-gradient(45deg, rgba(60,110,255,0.05), rgba(50,50,50,0.1))",
            borderRadius: "2xl",
            pointerEvents: "none",
          }}
        >
          <Avatar.Root size="2xl">
            <Avatar.Fallback name="User Avatar" />
            <Avatar.Image src="https://i.pravatar.cc/150?img=23" />
          </Avatar.Root>

          <Box>
            <Heading size="lg" mb={3} color="gray.100">
              {profile?.name}
            </Heading>
            <Text color="gray.400" fontSize="md">
              Member since{" "}
              {profile?.createDate ? formatDate(profile.createDate) : ""}
            </Text>
            <Flex gap={3} mt={4}>
              <Badge
                colorScheme="green"
                px={4}
                py={1}
                rounded="full"
                bg="green.500"
                color="white"
                textTransform="none"
                fontSize="sm"
              >
                {profile?.customerType}
              </Badge>
              <Badge
                colorScheme="blue"
                px={4}
                py={1}
                rounded="full"
                bg="blue.500"
                color="white"
                textTransform="none"
                fontSize="sm"
              >
                {profile?.role}
              </Badge>
            </Flex>
          </Box>
        </Flex>

        <Box w="full">
          <Heading size="md" mb={6} color="gray.200">
            Personal Information
          </Heading>

          <Card.Root
            bg="gray.800"
            rounded="2xl"
            shadow="2xl"
            borderWidth="1px"
            borderColor="gray.700"
            overflow="hidden"
            position="relative"
            _before={{
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bg: "linear-gradient(45deg, rgba(60,110,255,0.05), rgba(50,50,50,0.1))",
              borderRadius: "2xl",
              pointerEvents: "none",
            }}
          >
            <CardBody p={8}>
              <VStack>
                <Flex
                  justifyContent="space-between"
                  w="full"
                  p={2}
                  _hover={{ bg: "gray.700" }}
                  rounded="xl"
                  transition="all 0.3s"
                >
                  <Text fontWeight="medium" color="gray.400">
                    Email
                  </Text>
                  <Text color="gray.100">{profile?.email}</Text>
                </Flex>
                <Flex
                  justifyContent="space-between"
                  w="full"
                  p={2}
                  _hover={{ bg: "gray.700" }}
                  rounded="xl"
                  transition="all 0.3s"
                >
                  <Text fontWeight="medium" color="gray.400">
                    Citizen ID
                  </Text>
                  <Text color="gray.100">{profile?.citizenId}</Text>
                </Flex>
                <Flex
                  justifyContent="space-between"
                  w="full"
                  p={2}
                  _hover={{ bg: "gray.700" }}
                  rounded="xl"
                  transition="all 0.3s"
                >
                  <Text fontWeight="medium" color="gray.400">
                    Phone
                  </Text>
                  <Text color="gray.100">{profile?.phone}</Text>
                </Flex>
                <Flex
                  justifyContent="space-between"
                  w="full"
                  p={2}
                  _hover={{ bg: "gray.700" }}
                  rounded="xl"
                  transition="all 0.3s"
                >
                  <Text fontWeight="medium" color="gray.400">
                    Address
                  </Text>
                  <Text color="gray.100">{profile?.address}</Text>
                </Flex>
              </VStack>
            </CardBody>
          </Card.Root>
        </Box>
      </VStack>
    </Box>
  );
};

export default Profile;
