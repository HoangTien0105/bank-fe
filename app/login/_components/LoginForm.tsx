"use client";

import { loginApi } from "@/api/auth";
import { PasswordInput } from "@/components/ui/password-input";
import { toaster } from "@/components/ui/toaster";
import {
  Flex,
  Stack,
  Field,
  Heading,
  Input,
  Button,
  Image,
  Fieldset,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface LoginForm {
  username: string;
  password: string;
}

interface LoginFormProps {
  onLoginSucess?: (data: any) => void;
  onLoginError?: (error: Error) => void;
  isLoading?: boolean;
  defaultValues?: Partial<LoginForm>;
}

const LoginForm = ({
  onLoginSucess,
  onLoginError,
  isLoading : externalLoading = false,
  defaultValues,
}: LoginFormProps) => {
  const [isLoading, setIsLoading] = useState(externalLoading);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    defaultValues,
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setIsLoading(true);

      //Gọi API đăng nhập từ service
      const tokenData = await loginApi(data.username, data.password);

      //Lưu token vào storage
      localStorage.setItem('auth_token', JSON.stringify(tokenData));

      //Hiển thị thông báo thành công
      toaster.success({
        title: "Login success",
        duration: 3000,
        closable: true
      });

      //Gọi callback nếu có
      if(onLoginSucess){
        onLoginSucess(tokenData)
      }

      router.push('/dashboard');
    } catch (error) {
      console.error("Login error: ", error);

      toaster.error({
        title:"Login failed",
        description: error instanceof Error ? error.message : "Please review your information",
        duration: 3000,
        closable: true,
      })

      if(onLoginError && error instanceof Error) {
        onLoginError(error);
      }
    } finally{
      setIsLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack className="flex flex-row justify-center max-w-4xl mx-auto border border-gray-700 rounded-lg shadow-lg bg-gray-900 overflow-hidden">
        <Flex className="p-8 flex-col flex-1 flex space-y-6 justify-center">
          <Heading className="text-2xl text-white mb-6">
            Sign in to your account
          </Heading>

          <Fieldset.Root
            className="mb-6"
            invalid={!!errors.username}
          >
            <Fieldset.Legend>Email / Phone number</Fieldset.Legend>
            <Input
              type="email"
              disabled={isLoading}
              className={errors.username ? "border border-[#f87171]" : ""}
              placeholder="Enter your email or phone number"
              {...register("username", {
                required: "Email is required",
                pattern: {
                  value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                  message: "Email is not valid",
                },
              })}
            />
          </Fieldset.Root>

          <Field.Root className="mb-6" invalid={!!errors.password}>
            <Field.Label>Password</Field.Label>
            <PasswordInput
              disabled={isLoading}
              placeholder="Enter your password"
              {...register("password", {
                required: "Password is required",
              })}
            />
          </Field.Root>

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
          <Button
  onClick={() => {
    toaster.error({
      title: "Test Error",
      description: "This is a test error message",
      duration: 3000,
      closable: true,
    });
  }}
>
  Test Error Toast
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
