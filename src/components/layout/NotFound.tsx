import { Link } from "@tanstack/react-router";

import type { ReactNode } from "react";

const NotFound = ({ children }: { children?: ReactNode }) => (
  <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4 p-2">
    <div className="text-6xl">404</div>
    <div className="text-gray-600 dark:text-gray-400">
      {children || <p>Page Not Found</p>}
    </div>
    <p className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => window.history.back()}
        className="cursor-pointer rounded-lg bg-primary-600 px-4 py-2 font-medium text-base text-white shadow-md transition-all hover:bg-primary-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2"
      >
        Go back
      </button>
      <Link
        to="/"
        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-center font-medium text-base text-primary-600 shadow-sm hover:bg-gray-50 hover:shadow dark:border-gray-700 dark:bg-gray-800 dark:text-primary-400 dark:hover:bg-gray-700"
      >
        Start Over
      </Link>
    </p>
  </div>
);

export default NotFound;
