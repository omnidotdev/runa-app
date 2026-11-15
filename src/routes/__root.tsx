import { useSessionRefresh } from "@omnidotdev/providers/react";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

import CommandPalette from "@/components/core/CommandPalette";
import KeyboardShortcutsDialog from "@/components/core/KeyboardShortcutsDialog";
import { DefaultCatchBoundary, NotFound } from "@/components/layout";
import { Toaster } from "@/components/ui/sonner";
import app from "@/lib/config/app.config";
import getClientEnv from "@/lib/config/clientEnv";
import { BASE_URL } from "@/lib/config/env.config";
import appCss from "@/lib/styles/globals.css?url";
import createMetaTags from "@/lib/util/createMetaTags";
import ThemeProvider from "@/providers/ThemeProvider";
import { fetchSession } from "@/server/functions/auth";
import { getTheme } from "@/server/functions/theme";

import type { QueryClient } from "@tanstack/react-query";
import type { Session } from "better-auth/types";
import type { ReactNode } from "react";

interface ExtendedUser {
  id: string;
  email: string;
  name?: string;
  image?: string;
  rowId?: string;
  identityProviderId?: string;
}

import type { OrganizationClaim } from "@omnidotdev/providers/auth";

interface ExtendedSession extends Omit<Session, "user"> {
  user: ExtendedUser;
  accessToken?: string;
  organizations?: OrganizationClaim[];
}

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  session: ExtendedSession | null;
  authDegraded: boolean;
}>()({
  beforeLoad: async () => {
    const { session, authDegraded } = await fetchSession();
    return { session, authDegraded };
  },
  loader: async () => {
    const theme = await getTheme();
    // Get client env vars on server to inject into HTML
    const clientEnv = getClientEnv();
    return { theme, clientEnv };
  },
  head: ({ loaderData }) => ({
    scripts: [
      {
        // Inject runtime env vars for client-side access
        children: `window.__ENV__=${JSON.stringify(loaderData?.clientEnv ?? {})};`,
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: app.name,
          url: BASE_URL,
          description: app.description,
        }),
      },
    ],
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        name: "apple-mobile-web-app-title",
        content: app.name,
      },
      ...createMetaTags(),
    ],
    links: [
      { rel: "canonical", href: BASE_URL },
      { rel: "stylesheet", href: appCss },
      // Scalable SVG favicon (preferred by modern browsers); the PNG/ICO
      // entries below remain as fallbacks for clients without SVG icon support
      {
        rel: "icon",
        type: "image/svg+xml",
        href: "/runa-mark.svg",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon-16x16.png",
      },
      {
        rel: "icon",
        type: "image/png",
        href: "/favicon-96x96.png",
        sizes: "96x96",
      },
      {
        rel: "shortcut icon",
        href: "/favicon.ico",
      },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png",
      },
      {
        rel: "manifest",
        href: "/site.webmanifest",
      },
    ],
  }),
  errorComponent: DefaultCatchBoundary,
  // Render 404s in-shell: a thrown `notFound()` renders here inside RootDocument
  // (globals + layout), not as a bare unstyled page. Pairs with the router's
  // `defaultNotFoundComponent` for unmatched routes.
  notFoundComponent: () => <NotFound />,
  component: RootComponent,
});

function RootComponent() {
  // Keep the OAuth access token fresh while the user is idle
  useSessionRefresh(fetchSession);

  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  const { theme } = Route.useLoaderData();

  return (
    <html lang="en" className={theme}>
      <head>
        <HeadContent />
      </head>
      <body>
        <ThemeProvider theme={theme}>
          {children}

          <CommandPalette />

          <KeyboardShortcutsDialog />

          <Toaster position="top-center" richColors />
        </ThemeProvider>

        {/* dev tools (only included in development) */}
        {import.meta.env.DEV && (
          <TanStackDevtools
            plugins={[
              {
                name: "Router",
                render: <TanStackRouterDevtoolsPanel />,
                defaultOpen: true,
              },
              {
                name: "Query",
                render: <ReactQueryDevtoolsPanel />,
              },
            ]}
          />
        )}

        <Scripts />
      </body>
    </html>
  );
}
