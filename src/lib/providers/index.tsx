"use client";
import { ApolloProvider } from "./ApolloProvider";
import { ThemeProvider } from "./ThemeProvider";
import { UserProvider } from "@auth0/nextjs-auth0/client";

export function Providers({ children }: React.PropsWithChildren) {
  return (
    <UserProvider>
      <ThemeProvider>
        <ApolloProvider>{children}</ApolloProvider>
      </ThemeProvider>
    </UserProvider>
  );
}
