import { TanstackDevtools } from "@tanstack/react-devtools";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

import DefaultCatchBoundary from "@/components/layout/DefaultCatchBoundary";
import ClientHintCheck from "@/components/scripts/ClientHintCheck";
import { Toaster } from "@/components/ui/sonner";
import fetchSession from "@/lib/auth/fetchSession";
import useTheme from "@/lib/hooks/useTheme";
import { themeQueryKey } from "@/lib/options/theme.options";
import { getRequestInfo } from "@/lib/util/requestInfo";
import seo from "@/lib/util/seo";
import appCss from "@/styles/globals.css?url";

import type { Session } from "@auth/core/types";
import type { QueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";
import type { Theme } from "@/lib/util/theme";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  session: Session | null;
}>()({
  beforeLoad: async () => {
    const { session } = await fetchSession();

    return { session };
  },
  loader: async ({ context: { queryClient } }) => {
    const requestInfo = await getRequestInfo();

    queryClient.setQueryData(themeQueryKey, requestInfo.userPreferences.theme);

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
  errorComponent: DefaultCatchBoundary,
  component: RootComponent,
});

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
    <html lang="en" className={theme}>
      <head>
        <ClientHintCheck />
        <HeadContent />
      </head>
      <body>
        {children}

        <Toaster position="top-center" richColors />
        {/* Dev Tools - only included in development */}
        <TanstackDevtools
          plugins={[
            {
              name: "Tanstack Query",
              render: <ReactQueryDevtoolsPanel />,
            },
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  );
}
