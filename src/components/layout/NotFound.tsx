import { NotFoundPage } from "@omnidotdev/thornberry/not-found";

import { Logo } from "@/components/core";
import app from "@/lib/config/app.config";

import type { PropsWithChildren } from "react";

/**
 * 404 not found. Renders the shared Omni `<NotFoundPage>` (in-shell,
 * theme-aware, prominent "404"), branded with Runa's wordmark and gear-moon
 * logomark. Route-level callers pass a label as `children`, surfaced as the
 * page description (e.g. "Workspace Not Found"); the default copy shows when
 * none is provided. Home points at the app root.
 */
const NotFound = ({ children }: PropsWithChildren) => (
  <NotFoundPage
    appName={app.name}
    appLogo={<Logo className="size-8 text-primary-500" />}
    description={children}
  />
);

export default NotFound;
