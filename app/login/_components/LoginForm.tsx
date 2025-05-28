"use client";

import { PasswordInput } from "@/components/ui/password-input";
import {
  Button,
  Field,
  Fieldset,
  Flex,
  Image,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { LoginSchema, TLoginSchema } from "../_types/login";
import { loginAction } from "../actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toaster } from "@/components/ui/toaster";
import Link from "next/link";

const LoginForm = () => {
  const router = useRouter();
  const [state, action, isPending] = useActionState(loginAction, {
    success: false,
    message: "",
  });

  console.log("Login state:", state);

  const {
    register,
    formState: { errors },
  } = useForm<TLoginSchema>({
    resolver: zodResolver(LoginSchema),
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
      router.refresh();
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
    <form action={action}>
      <Stack className="flex flex-row justify-center max-w-4xl mx-auto border border-gray-700 rounded-lg shadow-lg bg-gray-900 overflow-hidden">
        <Flex className="p-8 flex-col flex-1 flex space-y-6 justify-center">
          <Fieldset.Root className="mb-6">
            <Fieldset.Legend>Sign in to your account</Fieldset.Legend>
            <Field.Root className="mb-6" invalid={!!errors.username}>
              <Field.Label>Username</Field.Label>
              <Input
                type="text"
                disabled={isPending}
                placeholder="Enter your email or phone number"
                {...register("username")}
              />
              <Field.ErrorText>{errors?.username?.message}</Field.ErrorText>
            </Field.Root>

            <Field.Root className="mb-6" invalid={!!errors.password}>
              <Field.Label>Password</Field.Label>
              <PasswordInput
                disabled={isPending}
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
            loading={isPending}
            loadingText="Login..."
          >
            Sign in
          </Button>

          <Flex justify="center" mt={4}>
            <Text>Don't have an account? </Text>
            <Link
              href="/register"
              className="text-blue-500 hover:text-blue-600 ml-1"
            >
              Register
            </Link>
          </Flex>
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
