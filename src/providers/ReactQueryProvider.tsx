"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { getQueryClient } from "../utils/graphql-client";

import type { ReactNode } from "react";

interface ReactQueryProviderProps {
  children: ReactNode;
}

export function ReactQueryProvider({ children }: ReactQueryProviderProps) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}

      {/* React Query Dev Tools - only included in development */}
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}
