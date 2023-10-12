import { ApolloProvider } from "./ApolloProvider";
import { ThemeProvider } from "./ThemeProvider";

export function Providers({ children }: React.PropsWithChildren) {
  return (
    <ApolloProvider>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </ApolloProvider>
  )
}