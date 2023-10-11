import '@mantine/core/styles.css';
import { Inter } from "next/font/google";

import { MantineProvider, ColorSchemeScript } from '@mantine/core';

export const metadata = {
  title: 'Product Case Study',
  description: '🤯',
};

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider>{children}</MantineProvider>
      </body>
    </html>
  );
}
