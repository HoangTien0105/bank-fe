"use client";

import { PasswordInput } from "@/components/ui/password-input";
import { toaster } from "@/components/ui/toaster";
import {
  Button,
  Field,
  Fieldset,
  Flex,
  Image,
  Input,
  Stack,
} from "@chakra-ui/react";
import { useActionState, useState } from "react";
import { useForm } from "react-hook-form";
import { LoginSchema, TLoginSchema } from "../_types/login";
import { loginAction } from "../actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [state, action] = useActionState(loginAction, {
    message: "",
  });

  console.log(state);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TLoginSchema>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: TLoginSchema) => {
    try {
      setIsLoading(true);

      await signIn("credentials", {
        username: data.username,
        password: data.password,
      });

      toaster.success({
        title: "Login success",
        duration: 3000,
        closable: true,
      });
    } catch (error) {
      toaster.error({
        title: "Login failed",
        description:
          error instanceof Error
            ? error.message
            : "Please review your information",
        duration: 3000,
        closable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form action={action} onSubmit={handleSubmit(onSubmit)}>
      <Stack className="flex flex-row justify-center max-w-4xl mx-auto border border-gray-700 rounded-lg shadow-lg bg-gray-900 overflow-hidden">
        <Flex className="p-8 flex-col flex-1 flex space-y-6 justify-center">
          <Fieldset.Root className="mb-6" invalid={!!errors.username}>
            <Fieldset.Legend>Sign in to your account</Fieldset.Legend>
            <Field.Root className="mb-6" invalid={!!errors.username}>
              <Field.Label>Username</Field.Label>
              <Input
                type="text"
                disabled={isLoading}
                placeholder="Enter your email or phone number"
                {...register("username")}
              />
              <Field.ErrorText>{errors?.username?.message}</Field.ErrorText>
            </Field.Root>

            <Field.Root className="mb-6" invalid={!!errors.password}>
              <Field.Label>Password</Field.Label>
              <PasswordInput
                disabled={isLoading}
                placeholder="Enter your password"
                {...register("password")}
              />
              <Field.ErrorText>{errors?.password?.message}</Field.ErrorText>
            </Field.Root>
          </Fieldset.Root>

          <Button
            colorScheme="blue"
            size="md"
            width="full"
            type="submit"
            loading={isLoading}
            loadingText="Login..."
          >
            Sign in
          </Button>
        </Flex>
        <Flex className="flex-1 hidden md:block caret-transparent">
          <Image
            alt={"Login Image"}
            objectFit={"cover"}
            height="100%"
            width="100%"
            src={
              "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80"
            }
          />
        </Flex>
      </Stack>
    </form>
  );
};

export default LoginForm;
