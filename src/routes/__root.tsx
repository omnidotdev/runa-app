import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";

import DefaultCatchBoundary from "@/components/layout/DefaultCatchBoundary";
import seo from "@/lib/util/seo";
import { ThemeProvider, useTheme } from "@/providers/ThemeProvider";
import appCss from "@/styles/globals.css?url";

import type { QueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";
import type { Theme } from "@/providers/ThemeProvider";

const getThemeServerFn = createServerFn().handler(async () => {
  return (getCookie("ui-theme") || "light") as Theme;
});

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    loader: () => getThemeServerFn(),
    head: () => ({
      meta: [
        {
          charSet: "utf-8",
        },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },
        ...seo(),
      ],
      links: [{ rel: "stylesheet", href: appCss }],
    }),
    errorComponent: (props) => (
      <RootDocument>
        <DefaultCatchBoundary {...props} />
      </RootDocument>
    ),
    component: RootComponent,
  },
);

function RootComponent() {
  const theme = Route.useLoaderData();

  return (
    <ThemeProvider theme={theme}>
      <RootDocument>
        <Outlet />
      </RootDocument>
    </ThemeProvider>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  const { theme } = useTheme();

  return (
    <html lang="en" className={theme} suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}

        {/* Dev Tools - only included in development */}
        {/* <TanStackRouterDevtools position="top-right" /> */}
        <ReactQueryDevtools />
        <Scripts />
      </body>
    </html>
  );
}
