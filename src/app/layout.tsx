import { Inter } from "next/font/google";

import type { Metadata } from "next";
import "./globals.css";

import ReactQueryProvider from "@/providers/ReactQueryProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Runa",
  description: "A beautiful Kanban board application",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body className={`${inter.className} dark:bg-gray-900`}>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
};

export default RootLayout;
