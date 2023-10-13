"use client";
import { AppShell, Flex, Text } from "@mantine/core";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header className="flex flex-row">
        <Flex
          align="center"
          gap="md"
          style={{
            height: 60,
            padding: '1rem'
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
      </AppShell.Header>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
