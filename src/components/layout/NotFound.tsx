import Link from "@/components/core/Link";
import { Button } from "@/components/ui/button";

import type { ReactNode } from "react";

const NotFound = ({ children }: { children?: ReactNode }) => (
  <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4 p-2">
    <div className="text-6xl">404</div>
    <div className="text-gray-600 dark:text-gray-400">
      {children || <p>Page Not Found</p>}
    </div>
    <p className="flex flex-wrap items-center gap-2">
      <Button onClick={() => window.history.back()}>Go back</Button>

      <Link to="/" variant="outline">
        Start Over
      </Link>
    </p>
  </div>
);

export default NotFound;
