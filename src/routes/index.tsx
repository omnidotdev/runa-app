import { createFileRoute, Link } from "@tanstack/react-router";

import ThemeToggle from "@/components/ThemeToggle";

const Home = () => (
  <div className="relative min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
    {/* Background elements */}
    <div className="absolute inset-0">
      <div
        className="absolute inset-0 z-0 opacity-50 dark:opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='200' height='200' patternUnits='userSpaceOnUse' patternTransform='rotate(12)'%3E%3Cpath d='M 200 0 L 0 0 0 200' fill='none' stroke='rgba(37, 99, 235, 0.45)' stroke-width='2.5' class='light-stroke'/%3E%3Cpath d='M 200 0 L 0 0 0 200' fill='none' stroke='rgba(96, 165, 250, 0.55)' stroke-width='2.5' class='dark-stroke' style='display:none'/%3E%3C/pattern%3E%3CradialGradient id='fade' cx='50%25' cy='50%25' r='70%25' fx='50%25' fy='50%25'%3E%3Cstop offset='0%25' style='stop-color:white;stop-opacity:0' /%3E%3Cstop offset='70%25' style='stop-color:white;stop-opacity:1' /%3E%3C/radialGradient%3E%3Cmask id='mask' x='0' y='0' width='100%25' height='100%25'%3E%3Crect x='0' y='0' width='100%25' height='100%25' fill='url(%23fade)'/%3E%3C/mask%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)' mask='url(%23mask)'/%3E%3Cstyle%3E@media (prefers-color-scheme: dark) { .light-stroke { display: none; } .dark-stroke { display: block !important; } }%3C/style%3E%3C/svg%3E")`,
          backgroundSize: "cover",
        }}
      ></div>
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-100/70 via-transparent to-gray-100/70 dark:from-gray-800/70 dark:via-transparent dark:to-gray-800/70"></div>
    </div>

    {/* Navigation */}
    <nav className="relative z-10 border-gray-200 border-b bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex items-center">
            <h1 className="font-bold text-primary-600 text-xl dark:text-primary-400">
              Runa
            </h1>
          </div>
          <div className="flex items-center space-x-6">
            <ThemeToggle />
            {/* TODO */}
            {/* <Link
              to="/docs"
              className="font-medium text-gray-600 text-sm hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
            >
              Docs
            </Link> */}
            <Link
              to="/dashboard"
              className="rounded-md bg-primary-600 px-4 py-2 font-medium text-sm text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </nav>

    <main className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Hero section */}
      <div className="py-20 md:py-28 lg:py-36">
        <div className="relative z-10 max-w-3xl">
          <div className="mb-5 inline-block rounded-full bg-primary-100 px-3 py-1 font-semibold text-primary-700 text-xs shadow-sm dark:bg-primary-900/30 dark:text-primary-300">
            Introducing Runa
          </div>
          <h1 className="mb-8 font-extrabold text-4xl text-gray-900 sm:text-5xl md:text-6xl dark:text-white">
            Transform Your Projects into{" "}
            <span className="relative whitespace-nowrap text-primary-600 dark:text-primary-400">
              <span className="relative z-10">Success Stories</span>
              <span className="-inset-1 -skew-y-3 -z-10 absolute rounded-sm bg-primary-100 dark:bg-primary-900/40"></span>
            </span>
          </h1>
          <p className="mb-12 max-w-2xl text-gray-600 text-xl leading-relaxed dark:text-gray-400">
            Streamline your workflow, collaborate seamlessly, and deliver
            projects on time with our intuitive Kanban board solution.
          </p>
          <div className="flex flex-col gap-5 sm:flex-row">
            <Link
              to="/dashboard"
              className="group cursor-pointer rounded-lg bg-primary-600 px-8 py-4 font-medium text-base text-white shadow-md transition-all hover:bg-primary-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2"
            >
              Get Started{" "}
              <span className="ml-1 inline-block transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
            <Link
              to="/pricing"
              className="rounded-lg border border-gray-300 bg-white px-8 py-4 text-center font-medium text-base text-primary-600 shadow-sm hover:bg-gray-50 hover:shadow dark:border-gray-700 dark:bg-gray-800 dark:text-primary-400 dark:hover:bg-gray-700"
            >
              View Pricing
            </Link>
          </div>
        </div>

        {/* Features grid */}
        <div className="relative z-10 mt-32">
          <div className="mb-16 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <h2 className="relative inline-block font-bold text-2xl text-gray-900 dark:text-white">
              <span>Everything you need to manage projects effectively</span>
              <span className="-bottom-2 absolute right-0 left-0 h-1 rounded-full bg-primary-600/30 dark:bg-primary-600/40"></span>
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl border border-gray-200 bg-white p-7 shadow-sm transition-transform hover:translate-y-[-2px] hover:border-primary-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-primary-800">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900/50">
                <svg
                  className="h-6 w-6 text-primary-600 dark:text-primary-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-label="Task Management Icon"
                >
                  <title>Task Management Icon</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 10h16M4 14h16M4 18h16"
                  />
                </svg>
              </div>
              <h3 className="mb-2 font-semibold text-gray-900 text-lg dark:text-gray-100">
                Task Management
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Organize and track your tasks with flexible views and intuitive
                workflows.
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-7 shadow-sm transition-transform hover:translate-y-[-2px] hover:border-purple-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-purple-800">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/50">
                <svg
                  className="h-6 w-6 text-purple-600 dark:text-purple-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-label="Team Collaboration Icon"
                >
                  <title>Team Collaboration Icon</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 font-semibold text-gray-900 text-lg dark:text-gray-100">
                Team Collaboration
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Collaborate effortlessly with team members through comments,
                mentions, and assignments.
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-7 shadow-sm transition-transform hover:translate-y-[-2px] hover:border-green-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-green-800">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/50">
                <svg
                  className="h-6 w-6 text-emerald-600 dark:text-emerald-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-label="Customizable Workflows Icon"
                >
                  <title>Customizable Workflows Icon</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="mb-2 font-semibold text-gray-900 text-lg dark:text-gray-100">
                Customizable Workflows
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Create custom workflows that match your team's processes and
                project needs.
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-7 shadow-sm transition-transform hover:translate-y-[-2px] hover:border-amber-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-amber-800">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/50">
                <svg
                  className="h-6 w-6 text-amber-600 dark:text-amber-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-label="Project Analytics Icon"
                >
                  <title>Project Analytics Icon</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 font-semibold text-gray-900 text-lg dark:text-gray-100">
                Project Analytics
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Get insights into your team's performance with detailed
                analytics and progress tracking.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
);

export const Route = createFileRoute("/")({
  component: Home,
});
