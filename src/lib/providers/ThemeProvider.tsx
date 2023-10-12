"use client";
import { MantineProvider } from "@mantine/core";
import { theme } from "../theme";

export function ThemeProvider({ children }: React.PropsWithChildren) {
  return (
    <MantineProvider theme={theme} defaultColorScheme="light">
      {children}
    </MantineProvider>
  );
}
