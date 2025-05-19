"use client";

import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { ColorModeProvider, type ColorModeProviderProps } from "./color-mode";
import { Toaster } from "./toaster";
import { SessionProvider } from "next-auth/react";

export function Provider(props: ColorModeProviderProps) {
  return (
    <SessionProvider>
      <ChakraProvider value={defaultSystem}>
        <ColorModeProvider {...props}>{props.children}</ColorModeProvider>
        <Toaster />
      </ChakraProvider>
    </SessionProvider>
  );
}
