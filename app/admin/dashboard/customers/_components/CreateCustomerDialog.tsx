"use client";

import {
  Button,
  Dialog,
  Field,
  Fieldset,
  Input,
  Portal,
  Stack,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { createCustomerAction } from "../actions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateCustomerSchema,
  TCreateCustomerSchema,
} from "../_types/create-customer";
import { toaster } from "@/components/ui/toaster";

const CreateCustomerDialog = () => {
  const router = useRouter();
  const [state, action, isPending] = useActionState(createCustomerAction, {
    success: false,
    message: "",
  });

  console.log("Create customer state:", state);

  const {
    register,
    formState: { errors },
  } = useForm<TCreateCustomerSchema>({
    resolver: zodResolver(CreateCustomerSchema),
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
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button variant="outline">Add Customer</Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <form action={action}>
              <Dialog.Header>
                <Dialog.Title>Add New Customer</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body pb="4">
                <Stack gap="4">
                  <Fieldset.Root>
                    <Field.Root>
                      <Field.Label>Name</Field.Label>
                      <Input
                        type="text"
                        disabled={isPending}
                        placeholder="Name"
                        {...register("name")}
                      />
                      <Field.ErrorText>{errors?.name?.message}</Field.ErrorText>
                    </Field.Root>
                    <Field.Root>
                      <Field.Label>Email</Field.Label>
                      <Input
                        type="email"
                        disabled={isPending}
                        placeholder="Email"
                        {...register("email")}
                      />
                      <Field.ErrorText>
                        {errors?.email?.message}
                      </Field.ErrorText>
                    </Field.Root>
                    <Field.Root>
                      <Field.Label>Citizen ID</Field.Label>
                      <Input
                        type="text"
                        disabled={isPending}
                        placeholder="Citizen ID"
                        {...register("citizenId")}
                      />
                      <Field.ErrorText>
                        {errors?.citizenId?.message}
                      </Field.ErrorText>
                    </Field.Root>
                    <Field.Root>
                      <Field.Label>Phone</Field.Label>
                      <Input
                        type="text"
                        disabled={isPending}
                        placeholder="Phone"
                        {...register("phone")}
                      />
                      <Field.ErrorText>
                        {errors?.phone?.message}
                      </Field.ErrorText>
                    </Field.Root>
                    <Field.Root>
                      <Field.Label>Address</Field.Label>
                      <Input
                        type="text"
                        disabled={isPending}
                        placeholder="Address"
                        {...register("address")}
                      />
                      <Field.ErrorText>
                        {errors?.address?.message}
                      </Field.ErrorText>
                    </Field.Root>
                    <Field.Root>
                      <Field.Label>Password</Field.Label>
                      <Input
                        type="password"
                        disabled={isPending}
                        placeholder="Password"
                        {...register("password")}
                      />
                      <Field.ErrorText>
                        {errors?.password?.message}
                      </Field.ErrorText>
                    </Field.Root>
                    <Field.Root>
                      <Field.Label>Confirm Password</Field.Label>
                      <Input
                        type="password"
                        disabled={isPending}
                        placeholder="Confirm Password"
                        {...register("confirmPassword")}
                      />
                      <Field.ErrorText>
                        {errors?.confirmPassword?.message}
                      </Field.ErrorText>
                    </Field.Root>
                    <Field.Root>
                      <Field.Label>Customer Type</Field.Label>
                      <Input
                        type="text"
                        disabled={isPending}
                        placeholder="Customer Type"
                        {...register("customerType")}
                      />
                      <Field.ErrorText>
                        {errors?.customerType?.message}
                      </Field.ErrorText>
                    </Field.Root>
                  </Fieldset.Root>
                </Stack>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button variant="outline">Cancel</Button>
                </Dialog.ActionTrigger>
                <Button type="submit">Add</Button>
              </Dialog.Footer>
            </form>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default CreateCustomerDialog;
