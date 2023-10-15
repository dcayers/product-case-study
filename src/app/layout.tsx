import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { redirect } from "next/navigation";
import { Inter } from "next/font/google";
import { getSession } from "@auth0/nextjs-auth0";
import { Analytics } from "@vercel/analytics/react";
import {
  ColorSchemeScript,
  AppShell,
  Flex,
  Text,
  AppShellHeader,
  AppShellMain,
  Button,
} from "@mantine/core";
import { Providers } from "@/lib/providers";
import Link from "next/link";

export const metadata = {
  title: "Product Case Study",
  description: "🤯",
};

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export default async function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/api/auth/login");
  }

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
                justify="space-between"
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
                <Button component={Link} href="/api/auth/logout">
                  Logout
                </Button>
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
