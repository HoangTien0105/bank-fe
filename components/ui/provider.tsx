"use client";

import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { ColorModeProvider, type ColorModeProviderProps } from "./color-mode";
import { Toaster } from "./toaster";
import { AuthProvider } from "@/contexts/auth-context";
import { SessionProvider } from "next-auth/react";

export function Provider(props: ColorModeProviderProps) {
  return (
    <SessionProvider>
      <ChakraProvider value={defaultSystem}>
        <ColorModeProvider {...props}>
          <AuthProvider>{props.children}</AuthProvider>
        </ColorModeProvider>
        <Toaster />
      </ChakraProvider>
    </SessionProvider>
  );
}
