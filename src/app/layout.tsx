import "@mantine/core/styles.css";
import { Inter } from "next/font/google";
import { ColorSchemeScript } from "@mantine/core";
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
  order,
  ...props
}: {
  children: React.ReactNode;
  order: React.ReactNode;
}) {
  console.log(props);
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript defaultColorScheme="light" />
      </head>
      <body>
        <Providers>
          {children}
          {order}
        </Providers>
      </body>
    </html>
  );
}
