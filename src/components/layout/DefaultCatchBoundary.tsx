import {
  ErrorComponent,
  Link,
  rootRouteId,
  useMatch,
  useRouter,
} from "@tanstack/react-router";

import type { ErrorComponentProps } from "@tanstack/react-router";

const DefaultCatchBoundary = ({ error }: ErrorComponentProps) => {
  const router = useRouter();
  const isRoot = useMatch({
    strict: false,
    select: (state) => state.id === rootRouteId,
  });

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-6 p-4">
      <ErrorComponent error={error} />
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => {
            router.invalidate();
          }}
          className="rounded bg-gray-600 px-2 py-1 font-extrabold text-white uppercase dark:bg-gray-700"
        >
          Try Again
        </button>
        {isRoot ? (
          <Link
            to="/"
            className="cursor-pointer rounded-lg bg-primary-600 px-4 py-2 font-medium text-base text-white shadow-md transition-all hover:bg-primary-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2"
          >
            Home
          </Link>
        ) : (
          <Link
            to="/"
            className="cursor-pointer rounded-lg bg-primary-600 px-4 py-2 font-medium text-base text-white shadow-md transition-all hover:bg-primary-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2"
            onClick={(e) => {
              e.preventDefault();
              window.history.back();
            }}
          >
            Go Back
          </Link>
        )}
      </div>
    </div>
  );
};

export default DefaultCatchBoundary;
