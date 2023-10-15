import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { Analytics } from "@vercel/analytics/react";
import { Inter } from "next/font/google";
import {
  ColorSchemeScript,
  AppShell,
  Flex,
  Text,
  AppShellHeader,
  AppShellMain,
} from "@mantine/core";
import { Providers } from "@/lib/providers";

export const metadata = {
  title: "Product Case Study",
  description: "🤯",
};

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript defaultColorScheme="light" />
      </head>
      <body>
        <Providers>
          <AppShell header={{ height: 60 }} padding="md">
            <AppShellHeader className="flex flex-row">
              <Flex
                align="center"
                gap="md"
                style={{
                  height: 60,
                  padding: "1rem",
                }}
              >
                <Text
                  size="xl"
                  fw={900}
                  variant="gradient"
                  gradient={{ from: "blue", to: "cyan", deg: 90 }}
                  component="h1"
                >
                  Product Case Study
                </Text>
              </Flex>
            </AppShellHeader>
            <AppShellMain maw={1536} style={{ margin: "0 auto" }}>
              {children}
              {modal}
            </AppShellMain>
          </AppShell>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
