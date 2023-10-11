"use client";
import { useMemo } from "react";
import {
  UrqlProvider,
  ssrExchange,
  cacheExchange,
  fetchExchange,
  createClient,
} from "@urql/next";
import { useDisclosure } from "@mantine/hooks";
import { AppShell, Burger, Flex, Text } from "@mantine/core";

export default function Template({ children }: { children: React.ReactNode }) {
  const [opened, { toggle }] = useDisclosure();
  const [client, ssr] = useMemo(() => {
    const ssr = ssrExchange();
    const client = createClient({
      url: "/api/graphql",
      exchanges: [cacheExchange, ssr, fetchExchange],
      suspense: true,
    });

    return [client, ssr];
  }, []);
  return (
    <UrqlProvider client={client} ssr={ssr}>
      <AppShell
        header={{ height: 60 }}
        // navbar={{
        //   width: 300,
        //   breakpoint: "sm",
        //   collapsed: { mobile: !opened },
        // }}
        padding="md"
      >
        <AppShell.Header className="flex flex-row">
          <Flex align="center" gap="md">
            <Burger opened={opened} onClick={toggle} size="lg" />
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
    </UrqlProvider>
  );
}
