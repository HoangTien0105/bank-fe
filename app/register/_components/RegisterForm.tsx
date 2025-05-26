"use client";

import { PasswordInput } from "@/components/ui/password-input";
import {
  Button,
  Field,
  Fieldset,
  Flex,
  Input,
  Text,
  Textarea,
  Box,
  VStack,
  HStack,
  Separator,
} from "@chakra-ui/react";
import { useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { RegisterSchema, TRegisterSchema } from "../_types/register";
import { registerAction } from "../action";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toaster } from "@/components/ui/toaster";
import Link from "next/link";

const RegisterForm = () => {
  const router = useRouter();
  const [state, action, isPending] = useActionState(registerAction, {
    success: false,
    message: "",
  });

  console.log("Register state:", state);

  const {
    register,
    formState: { errors },
  } = useForm<TRegisterSchema>({
    resolver: zodResolver(RegisterSchema),
  });

  useEffect(() => {
    if (!state.message) return;

    if (state?.success) {
      Promise.resolve().then(() => {
        toaster.success({
          title: state.message,
          duration: 3000,
          closable: true,
        });
      });
      router.push("/login");
    } else {
      Promise.resolve().then(() => {
        toaster.error({
          title: state.message,
          duration: 3000,
          closable: true,
        });
      });
    }
  }, [state, router]);

  return (
    <Flex justify="center" align="center" minH="100vh" p={4}>
      <Box
        w="full"
        maxW="500px"
        bg="gray.900"
        rounded="lg"
        shadow="lg"
        border="1px solid"
        borderColor="gray.700"
        overflow="hidden"
        userSelect="none"
      >
        <form action={action}>
          <Box px={8} py={6} borderBottom="1px solid" borderColor="gray.700">
            <Text
              fontSize="2xl"
              fontWeight="bold"
              color="white"
              textAlign="center"
              mb={2}
            >
              Create your account
            </Text>
            <Text
              fontSize="sm"
              color="gray.400"
              textAlign="center"
            >
              Fill in the information below to get started
            </Text>
          </Box>

          <Box px={8} py={6}>
            <VStack gap={6}>
              <Fieldset.Root w="full">
                <VStack gap={5} align="stretch">
                  <Box>
                    <Text
                      fontSize="sm"
                      fontWeight="semibold"
                      color="gray.300"
                      mb={4}
                      textTransform="uppercase"
                      letterSpacing="wide"
                    >
                      Personal Information
                    </Text>
                    
                    <VStack gap={4}>
                      <Field.Root invalid={!!errors.name}>
                        <Field.Label color="gray.300" fontSize="sm" fontWeight="medium">
                          Full Name
                        </Field.Label>
                        <Input
                          type="text"
                          disabled={isPending}
                          placeholder="Enter your full name"
                          size="lg"
                          bg="gray.800"
                          border="1px solid"
                          borderColor="gray.600"
                          color="white"
                          rounded="md"
                          _placeholder={{ color: "gray.400" }}
                          _hover={{ borderColor: "blue.400" }}
                          _focus={{ 
                            borderColor: "blue.500",
                            boxShadow: "0 0 0 1px #3182ce"
                          }}
                          transition="all 0.2s"
                          {...register("name")}
                        />
                        <Field.ErrorText color="red.400" fontSize="sm">
                          {errors?.name?.message}
                        </Field.ErrorText>
                      </Field.Root>

                      <Field.Root invalid={!!errors.email}>
                        <Field.Label color="gray.300" fontSize="sm" fontWeight="medium">
                          Email
                        </Field.Label>
                        <Input
                          type="email"
                          disabled={isPending}
                          placeholder="Enter your email"
                          size="lg"
                          bg="gray.800"
                          border="1px solid"
                          borderColor="gray.600"
                          color="white"
                          rounded="md"
                          _placeholder={{ color: "gray.400" }}
                          _hover={{ borderColor: "blue.400" }}
                          _focus={{ 
                            borderColor: "blue.500",
                            boxShadow: "0 0 0 1px #3182ce"
                          }}
                          transition="all 0.2s"
                          {...register("email")}
                        />
                        <Field.ErrorText color="red.400" fontSize="sm">
                          {errors?.email?.message}
                        </Field.ErrorText>
                      </Field.Root>

                      <HStack gap={4}>
                        <Field.Root flex={1} invalid={!!errors.citizenId}>
                          <Field.Label color="gray.300" fontSize="sm" fontWeight="medium">
                            Citizen ID
                          </Field.Label>
                          <Input
                            type="text"
                            disabled={isPending}
                            placeholder="Enter your citizen ID"
                            size="lg"
                            bg="gray.800"
                            border="1px solid"
                            borderColor="gray.600"
                            color="white"
                            rounded="md"
                            _placeholder={{ color: "gray.400" }}
                            _hover={{ borderColor: "blue.400" }}
                            _focus={{ 
                              borderColor: "blue.500",
                              boxShadow: "0 0 0 1px #3182ce"
                            }}
                            transition="all 0.2s"
                            {...register("citizenId")}
                          />
                          <Field.ErrorText color="red.400" fontSize="sm">
                            {errors?.citizenId?.message}
                          </Field.ErrorText>
                        </Field.Root>

                        <Field.Root flex={1} invalid={!!errors.phone}>
                          <Field.Label color="gray.300" fontSize="sm" fontWeight="medium">
                            Phone Number
                          </Field.Label>
                          <Input
                            type="tel"
                            disabled={isPending}
                            placeholder="Enter your phone number"
                            size="lg"
                            bg="gray.800"
                            border="1px solid"
                            borderColor="gray.600"
                            color="white"
                            rounded="md"
                            _placeholder={{ color: "gray.400" }}
                            _hover={{ borderColor: "blue.400" }}
                            _focus={{ 
                              borderColor: "blue.500",
                              boxShadow: "0 0 0 1px #3182ce"
                            }}
                            transition="all 0.2s"
                            {...register("phone")}
                          />
                          <Field.ErrorText color="red.400" fontSize="sm">
                            {errors?.phone?.message}
                          </Field.ErrorText>
                        </Field.Root>
                      </HStack>

                      <Field.Root invalid={!!errors.address}>
                        <Field.Label color="gray.300" fontSize="sm" fontWeight="medium">
                          Address
                        </Field.Label>
                        <Textarea
                          disabled={isPending}
                          placeholder="Enter your address"
                          size="lg"
                          bg="gray.800"
                          border="1px solid"
                          borderColor="gray.600"
                          color="white"
                          rounded="md"
                          resize="none"
                          rows={3}
                          _placeholder={{ color: "gray.400" }}
                          _hover={{ borderColor: "blue.400" }}
                          _focus={{ 
                            borderColor: "blue.500",
                            boxShadow: "0 0 0 1px #3182ce"
                          }}
                          transition="all 0.2s"
                          {...register("address")}
                        />
                        <Field.ErrorText color="red.400" fontSize="sm">
                          {errors?.address?.message}
                        </Field.ErrorText>
                      </Field.Root>
                    </VStack>
                  </Box>

                  <Separator borderColor="gray.600" />

                  <Box>
                    <Text
                      fontSize="sm"
                      fontWeight="semibold"
                      color="gray.300"
                      mb={4}
                      textTransform="uppercase"
                      letterSpacing="wide"
                    >
                      Account Security
                    </Text>

                    <VStack gap={4}>
                      <HStack gap={4}>
                        <Field.Root flex={1} invalid={!!errors.password}>
                          <Field.Label color="gray.300" fontSize="sm" fontWeight="medium">
                            Password
                          </Field.Label>
                          <PasswordInput
                            disabled={isPending}
                            placeholder="Enter your password"
                            size="lg"
                            bg="gray.800"
                            border="1px solid"
                            borderColor="gray.600"
                            color="white"
                            rounded="md"
                            _placeholder={{ color: "gray.400" }}
                            _hover={{ borderColor: "blue.400" }}
                            _focus={{ 
                              borderColor: "blue.500",
                              boxShadow: "0 0 0 1px #3182ce"
                            }}
                            transition="all 0.2s"
                            {...register("password")}
                          />
                          <Field.ErrorText color="red.400" fontSize="sm">
                            {errors?.password?.message}
                          </Field.ErrorText>
                        </Field.Root>

                        <Field.Root flex={1} invalid={!!errors.confirmPassword}>
                          <Field.Label color="gray.300" fontSize="sm" fontWeight="medium">
                            Confirm Password
                          </Field.Label>
                          <PasswordInput
                            disabled={isPending}
                            placeholder="Confirm your password"
                            size="lg"
                            bg="gray.800"
                            border="1px solid"
                            borderColor="gray.600"
                            color="white"
                            rounded="md"
                            _placeholder={{ color: "gray.400" }}
                            _hover={{ borderColor: "blue.400" }}
                            _focus={{ 
                              borderColor: "blue.500",
                              boxShadow: "0 0 0 1px #3182ce"
                            }}
                            transition="all 0.2s"
                            {...register("confirmPassword")}
                          />
                          <Field.ErrorText color="red.400" fontSize="sm">
                            {errors?.confirmPassword?.message}
                          </Field.ErrorText>
                        </Field.Root>
                      </HStack>
                    </VStack>
                  </Box>
                </VStack>
              </Fieldset.Root>

              <Button
                colorScheme="blue"
                size="lg"
                width="full"
                type="submit"
                loading={isPending}
                loadingText="Creating account..."
                h={12}
                fontSize="md"
                fontWeight="semibold"
                rounded="md"
                _hover={{
                  transform: "translateY(-1px)",
                  boxShadow: "lg"
                }}
                transition="all 0.2s"
                mt={2}
              >
                Create Account
              </Button>

              <Separator borderColor="gray.600" />

              <HStack justify="center" gap={2}>
                <Text color="gray.400" fontSize="sm">
                  Already have an account?
                </Text>
                <Link href="/login">
                  <Text
                    color="blue.400"
                    fontWeight="medium"
                    fontSize="sm"
                    _hover={{ 
                      color: "blue.300",
                      textDecoration: "underline"
                    }}
                    transition="all 0.2s"
                  >
                    Login
                  </Text>
                </Link>
              </HStack>
            </VStack>
          </Box>
        </form>
      </Box>
    </Flex>
  );
};

export default RegisterForm;