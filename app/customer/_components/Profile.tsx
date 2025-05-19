"use client"

import { Avatar, Badge, Box, Button, Card, CardBody, Flex, Heading, Text, VStack } from "@chakra-ui/react";
import { CustomerProfile } from "../_types/customer";
import { useEffect } from "react";


interface CustomerProfileProps {
  profile: CustomerProfile;
}

const Profile = ({profile}: CustomerProfileProps) => {
   useEffect(() => {
        console.log('Profile data changed:', profile);
        // Có thể thêm logic cập nhật state nội bộ nếu cần
    }, [profile]); // Chạy lại khi profile thay đổi

    return(
    <Box p={6} w="full">
      <VStack>
        <Flex w="full" alignItems="center" gap={4}>
          <Avatar.Root>
            <Avatar.Fallback name="User Avatar" />
            <Avatar.Image src="https://i.pravatar.cc/150?img=23" />
          </Avatar.Root>

          <Box>
            <Heading size="md">{profile.name}</Heading>
            <Text color="gray.500">Member since {profile.createDate}</Text>
            <Badge colorScheme="green" mt={2}>
              Active
            </Badge>
          </Box>
        </Flex>

        <Box w="full" mt={4}>
          <Heading size="sm" mb={4}>
            Personal Information
          </Heading>

          <Card.Root>
            <CardBody>
              <VStack>
                <Flex justifyContent="space-between" w="full">
                  <Text fontWeight="medium" color="gray.600">
                    Email
                  </Text>
                  <Text>{profile.email}</Text>
                </Flex>
                <Flex justifyContent="space-between" w="full">
                  <Text fontWeight="medium" color="gray.600">
                    Phone
                  </Text>
                  <Text>{profile.phone}</Text>
                </Flex>
                <Flex justifyContent="space-between" w="full">
                  <Text fontWeight="medium" color="gray.600">
                    Address
                  </Text>
                  <Text>{profile.address}</Text>
                </Flex>
              </VStack>
            </CardBody>
          </Card.Root>
        </Box>

        <Flex w="full" justifyContent="flex-end" mt={4}>
          <Button colorScheme="blue" size="sm">
            Edit Profile
          </Button>
        </Flex>
      </VStack>
    </Box>
    )
}

export default Profile;