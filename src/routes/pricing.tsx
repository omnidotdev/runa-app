import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Check } from "lucide-react";

import seo from "@/utils/seo";

const Pricing = () => {
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-600 text-sm hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </div>

        <div className="mb-16 text-center">
          <h1 className="mb-4 font-bold text-4xl text-gray-900 dark:text-gray-100">
            Simple, transparent pricing
          </h1>
          <p className="text-gray-600 text-xl dark:text-gray-400">
            Free and open source forever. Pay only for what you need.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
          <div className="rounded-lg bg-white shadow-lg dark:bg-gray-800">
            <div className="flex h-full flex-col p-8">
              <h2 className="mb-4 font-bold text-2xl text-gray-900 dark:text-gray-100">
                Self-Hosted
              </h2>
              <div className="mb-8 flex items-baseline">
                <span className="font-bold text-4xl text-gray-900 dark:text-gray-100">
                  $0
                </span>
                <span className="ml-1 text-gray-500 dark:text-gray-400">
                  /forever
                </span>
              </div>
              <p className="mb-8 text-gray-600 dark:text-gray-400">
                Host Runa on your own infrastructure with full control over your
                data.
              </p>
              <ul className="mb-8 flex-1 space-y-4">
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                  <span className="text-gray-600 dark:text-gray-400">
                    Unlimited projects and tasks
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                  <span className="text-gray-600 dark:text-gray-400">
                    Full source code access
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                  <span className="text-gray-600 dark:text-gray-400">
                    Self-hosted deployment
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                  <span className="text-gray-600 dark:text-gray-400">
                    Community support
                  </span>
                </li>
              </ul>
              <a
                href="https://github.com/omnidotdev/runa"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full rounded-md bg-primary-500 px-4 py-3 text-center font-medium text-white hover:bg-primary-600"
              >
                View on GitHub
              </a>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border-2 border-primary-500 bg-white shadow-lg dark:bg-gray-800">
            <div className="p-8">
              <h2 className="mb-4 font-bold text-2xl text-gray-900 dark:text-gray-100">
                Cloud
              </h2>
              <div className="mb-8 flex items-baseline">
                <span className="font-bold text-4xl text-gray-900 dark:text-gray-100">
                  $8
                </span>
                <span className="ml-1 text-gray-500 dark:text-gray-400">
                  /user/month
                </span>
              </div>
              <p className="mb-8 text-gray-600 dark:text-gray-400">
                Let us handle the infrastructure while you focus on your
                projects.
              </p>
              <ul className="mb-8 space-y-4">
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                  <span className="text-gray-600 dark:text-gray-400">
                    Everything in Self-Hosted
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                  <span className="text-gray-600 dark:text-gray-400">
                    Managed cloud hosting
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                  <span className="text-gray-600 dark:text-gray-400">
                    Automatic backups & updates
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                  <span className="text-gray-600 dark:text-gray-400">
                    Priority support
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                  <span className="text-gray-600 dark:text-gray-400">
                    30-day free trial
                  </span>
                </li>
              </ul>
              {/* TODO */}
              {/* <button
                type="button"
                onClick={() => navigate({ to: "/signup" })}
                className="block w-full rounded-md bg-primary-500 px-4 py-3 text-center font-medium text-white hover:bg-primary-600"
              >
                Start Free Trial
              </button> */}
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h2 className="mb-4 font-bold text-2xl text-gray-900 dark:text-gray-100">
            Frequently Asked Questions
          </h2>
          <div className="mx-auto mt-8 grid max-w-3xl gap-6">
            <div className="text-left">
              <h3 className="mb-2 font-medium text-gray-900 text-lg dark:text-gray-100">
                What's included in the free trial?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                The 30-day free trial includes all Cloud features with no
                limitations. No credit card required.
              </p>
            </div>
            <div className="text-left">
              <h3 className="mb-2 font-medium text-gray-900 text-lg dark:text-gray-100">
                Can I cancel at any time?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Yes, you can cancel your subscription at any time. You'll
                continue to have access until the end of your billing period.
              </p>
            </div>
            <div className="text-left">
              <h3 className="mb-2 font-medium text-gray-900 text-lg dark:text-gray-100">
                What happens to my data if I cancel?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                You can export all your data at any time. After cancellation,
                your data will be retained for 30 days before being permanently
                deleted.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [...seo({ title: "Pricing" })],
  }),
  component: Pricing,
});
