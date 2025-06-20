import { Inter } from "next/font/google";

import ReactQueryProvider from "@/providers/ReactQueryProvider";
import ThemeProvider from "@/providers/ThemeProvider";

import type { Metadata } from "next";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Runa",
  description: "A beautiful Kanban board application",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <ReactQueryProvider>{children}</ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
