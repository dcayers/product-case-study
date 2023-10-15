import { ApolloProvider } from "./ApolloProvider";
import { ThemeProvider } from "./ThemeProvider";

export function Providers({ children }: React.PropsWithChildren) {
  return (
    <ThemeProvider>
      <ApolloProvider>{children}</ApolloProvider>
    </ThemeProvider>
  );
}
