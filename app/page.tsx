import { auth, signIn, signOut } from "@/auth";
import { Button, Field, Fieldset, Heading, Input } from "@chakra-ui/react";

const SignIn = async () => {
  const session = await auth();
  console.log("Session: ", session);
  return (
    <form
      action={async (formData: FormData) => {
        "use server";
        await signIn("credentials", formData, { redirectTo: "/dashboard" });
      }}
    >
      <Fieldset.Root className="mx-2 my-2" size="lg" maxW="md">
        <Heading>Sign In</Heading>

        <Fieldset.Content>
          <Field.Root>
            <Field.Label>Username</Field.Label>
            <Input name="username" type="email" />
          </Field.Root>

          <Field.Root>
            <Field.Label>Password</Field.Label>
            <Input name="password" type="password" />
          </Field.Root>
        </Fieldset.Content>

        <Button type="submit" alignSelf="flex-start">
          Submit
        </Button>
        <Button
          alignSelf="flex-start"
          onClick={async () => {
            "use server";
            await signOut();
          }}
        >
          Logout
        </Button>
      </Fieldset.Root>
    </form>
  );
};

export default SignIn;
