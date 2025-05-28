'use client';

import { ArrowLeft, Check } from 'lucide-react';
import Link from 'next/link';

export default function Pricing() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
        </div>

        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Free and open source forever. Pay only for what you need.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Self-Hosted
              </h2>
              <div className="flex items-baseline mb-8">
                <span className="text-4xl font-bold text-gray-900 dark:text-gray-100">$0</span>
                <span className="ml-1 text-gray-500 dark:text-gray-400">/forever</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Host Runa on your own infrastructure with full control over your data.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 dark:text-gray-400">Unlimited projects and tasks</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 dark:text-gray-400">Full source code access</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 dark:text-gray-400">Self-hosted deployment</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 dark:text-gray-400">Community support</span>
                </li>
              </ul>
              <a
                href="https://github.com/your-repo/runa"
                className="block w-full py-3 px-4 text-center font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-md"
              >
                View on GitHub
              </a>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border-2 border-primary-500">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Cloud
              </h2>
              <div className="flex items-baseline mb-8">
                <span className="text-4xl font-bold text-gray-900 dark:text-gray-100">$8</span>
                <span className="ml-1 text-gray-500 dark:text-gray-400">/user/month</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Let us handle the infrastructure while you focus on your projects.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 dark:text-gray-400">Everything in Self-Hosted</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 dark:text-gray-400">Managed cloud hosting</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 dark:text-gray-400">Automatic backups & updates</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 dark:text-gray-400">Priority support</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 dark:text-gray-400">30-day free trial</span>
                </li>
              </ul>
              <button
                onClick={() => window.location.href = '/signup'}
                className="block w-full py-3 px-4 text-center font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-md"
              >
                Start Free Trial
              </button>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto mt-8 grid gap-6">
            <div className="text-left">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                What's included in the free trial?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                The 30-day free trial includes all Cloud features with no limitations. No credit card required.
              </p>
            </div>
            <div className="text-left">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                Can I cancel at any time?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.
              </p>
            </div>
            <div className="text-left">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                What happens to my data if I cancel?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                You can export all your data at any time. After cancellation, your data will be retained for 30 days before being permanently deleted.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
