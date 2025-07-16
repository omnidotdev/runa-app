import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import DefaultCatchBoundary from "@/components/layout/DefaultCatchBoundary";
import ClientHintCheck from "@/components/scripts/ClientHintCheck";
import { useTheme } from "@/lib/hooks/useTheme";
import { themeQueryKey } from "@/lib/options/theme.options";
import { getRequestInfo } from "@/lib/util/requestInfo";
import seo from "@/lib/util/seo";
import appCss from "@/styles/globals.css?url";

import type { QueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";
import type { Theme } from "@/lib/util/theme";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    loader: async ({ context: { queryClient } }) => {
      const requestInfo = await getRequestInfo();

      queryClient.setQueryData(
        themeQueryKey,
        requestInfo.userPreferences.theme,
      );

      return { requestInfo };
    },
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
    errorComponent: (props) => <DefaultCatchBoundary {...props} />,
    component: RootComponent,
  },
);

function RootComponent() {
  const { theme } = useTheme();

  return (
    <RootDocument theme={theme}>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({
  children,
  theme,
}: Readonly<{ children: ReactNode; theme: Theme }>) {
  return (
    <html lang="en" className={theme} suppressHydrationWarning>
      <head>
        <ClientHintCheck />
        <HeadContent />
      </head>
      <body>
        {children}

        {/* Dev Tools - only included in development */}
        <TanStackRouterDevtools position="top-right" />
        <ReactQueryDevtools />
        <Scripts />
      </body>
    </html>
  );
}
