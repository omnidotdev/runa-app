import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import DefaultCatchBoundary from "@/components/layout/DefaultCatchBoundary";
import seo from "@/lib/util/seo";
import { ThemeProvider } from "@/providers/ThemeProvider";
import appCss from "@/styles/globals.css?url";

import type { QueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";

const RootDocument = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <ThemeProvider
          defaultTheme="system"
          attribute="class"
          // NB: See https://github.com/pacocoursey/next-themes?tab=readme-ov-file#disable-transitions-on-theme-change
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>

        {/* Dev Tools - only included in development */}
        <TanStackRouterDevtools position="top-right" />
        <ReactQueryDevtools />
        <Scripts />
      </body>
    </html>
  );
};

const RootComponent = () => {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
};

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
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
