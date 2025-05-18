"use client";

import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { ColorModeProvider, type ColorModeProviderProps } from "./color-mode";
import { Toaster } from "./toaster";
import { AuthProvider } from "@/contexts/auth-context";

export function Provider(props: ColorModeProviderProps) {
  return (
    <ChakraProvider value={defaultSystem}>
      <ColorModeProvider {...props}>
        <AuthProvider>{props.children}</AuthProvider>
      </ColorModeProvider>
      <Toaster />
    </ChakraProvider>
  );
}
