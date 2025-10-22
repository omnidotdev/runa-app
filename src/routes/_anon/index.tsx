import { createFileRoute, redirect } from "@tanstack/react-router";
import {
  ArrowRightIcon,
  CalendarIcon,
  ChartNoAxesColumnIncreasingIcon,
  ChevronRight,
  ListIcon,
  TagIcon,
  UserIcon,
  UsersIcon,
  WorkflowIcon,
} from "lucide-react";
import { useRef } from "react";
import { match } from "ts-pattern";

import Link from "@/components/core/Link";
import Label from "@/components/shared/Label";
import PriorityIcon from "@/components/tasks/PriorityIcon";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TextGenerateEffect } from "@/components/ui/text-generate-efftect";
import { signIn } from "@/lib/auth/signIn";
import { BASE_URL } from "@/lib/config/env.config";
import { cn } from "@/lib/utils";

import type { ReactNode } from "react";

interface Feature {
  title: string;
  description: string;
  icon: ReactNode;
  color: "primary" | "amber" | "fuchsia" | "emerald";
}

const features: Feature[] = [
  {
    title: "Task Management",
    description:
      "Organize and track your tasks with flexible views and intuitive workflows.",
    icon: <ListIcon className="text-primary-500" size={24} />,
    color: "primary",
  },
  {
    title: "Team Collaboration",
    description:
      "Collaborate effortlessly with team members through comments, mentions, and assignments.",
    icon: <UsersIcon className="text-fuchsia-500" size={24} />,
    color: "fuchsia",
  },
  {
    title: "Customizable Workflows",
    description:
      "Create custom workflows that match your team's processes and project needs.",
    icon: <WorkflowIcon className="text-emerald-500" size={24} />,
    color: "emerald",
  },
  {
    title: "Project Analytics",
    description:
      "Get insights into your team's performance with detailed analytics and progress tracking.",
    icon: (
      <ChartNoAxesColumnIncreasingIcon className="text-amber-500" size={24} />
    ),
    color: "amber",
  },
];

const mockData = [
  {
    displayId: "RUNA-24",
    title: "Waiting on vendor API access",
    color: "text-red-600",
    wrapper: "-skew-y-16 mt-8 cursor-default",
    priority: "Low",
    assignees: [
      {
        name: "Eve",
        avatarUrl: "/avatars/eve.png",
      },
    ],
  },
  {
    displayId: "RUNA-26",
    title: "Build user authentication flow",
    color: "text-yellow-600",
    wrapper: "-skew-y-16 -ml-80 mt-16 cursor-default",
    priority: "Medium",
    labels: [{ name: "Frontend", color: "#60a5fa", rowId: "lbl1" }],
    assignees: [
      {
        name: "Beau",
        avatarUrl: "https://api.dicebear.com/9.x/adventurer/svg?seed=Eden",
      },
      {
        name: "Abby",
        avatarUrl:
          "https://api.dicebear.com/9.x/adventurer/svg?seed=Christopher",
      },
    ],
  },
  {
    displayId: "RUNA-27",
    title: "Finalize dashboard design system",
    color: "text-green-600",
    wrapper: "-skew-y-16 -ml-80 mt-24 cursor-default",
    priority: "High",
    labels: [
      { name: "Design", color: "#a78bfa", rowId: "lbl2" },
      { name: "Research", color: "#f472b6", rowId: "lbl3" },
      { name: "Planning", color: "#34d399", rowId: "lbl4" },
    ],
  },
];

export const Route = createFileRoute("/_anon/")({
  beforeLoad: ({ context: { session } }) => {
    if (session) throw redirect({ to: "/workspaces" });
  },
  component: HomePage,
});

function HomePage() {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div className="relative size-full">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <section
          className="flex min-h-screen flex-col items-center justify-center gap-8 lg:h-screen lg:flex-row"
          ref={ref}
        >
          <div className="h-auto w-full max-w-3xl">
            <Badge
              variant="subtle"
              className="mx-auto mb-5 flex w-fit rounded-full lg:mx-0"
            >
              Introducing Runa
            </Badge>

            <h1 className="mb-8 text-center font-extrabold text-4xl text-base-900 lg:text-left dark:text-white">
              Transform Your Projects into{" "}
              <span className="relative whitespace-nowrap text-primary-600 dark:text-primary-400">
                <span className="relative z-10">Success Stories</span>
              </span>
            </h1>

            <TextGenerateEffect
              words={`Streamline your workflow, collaborate seamlessly, and deliver projects on time with our intuitive Kanban board solution.`}
              className="mx-auto mb-12 max-w-2xl text-center text-base-600 leading-relaxed lg:text-left lg:text-xl dark:text-base-400"
            />

            <div className="flex w-full items-center justify-center gap-4 lg:justify-start">
              <Button
                className="h-full w-fit rounded-xl px-6 py-3 has-[>svg]:px-6"
                onClick={() => signIn({ redirectUrl: BASE_URL })}
              >
                Get Started <ArrowRightIcon className="ml-1" />
              </Button>

              <Link
                to="/pricing"
                variant="ghost"
                className="h-full w-fit rounded-xl bg-transparent px-8 py-3"
              >
                View Pricing
              </Link>
            </div>
          </div>
          <div className="lg:-mt-8 mx-auto mt-16 max-w-6xl">
            <div className="-space-x-4 flex scale-90 select-none lg:scale-100">
              {mockData.map((item) => (
                <div key={item.title} className={item.wrapper}>
                  <div className="hover:-translate-y-8 flex h-40 w-sm skew-y-8 flex-col rounded-xl border bg-background p-4 transition-transform duration-500 hover:shadow-sm dark:bg-base-900">
                    <div className="flex items-center gap-2 font-medium">
                      <span className="flex-shrink-0 font-medium font-mono text-base-400 text-xs dark:text-base-400">
                        {item.displayId}
                      </span>
                      <PriorityIcon
                        priority={item.priority}
                        className="scale-75 opacity-50"
                      />

                      <div className="ml-auto">
                        {item.assignees?.length ? (
                          <div className="-space-x-5 flex">
                            {item.assignees.map((assignee) => (
                              <div
                                key={assignee.name}
                                className="flex h-8 items-center gap-2"
                              >
                                <Avatar
                                  fallback={assignee?.name?.charAt(0)}
                                  src={assignee?.avatarUrl ?? undefined}
                                  alt={assignee?.name}
                                  className="size-8 rounded-full border-2 bg-background font-medium text-xs"
                                />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <UserIcon className="rounded-full border border-border border-dashed bg-transparent p-1 text-muted-foreground" />
                        )}
                      </div>
                    </div>

                    <div className="h-2" />

                    <p className="text-base-600 text-sm dark:text-base-400">
                      {item.title}
                    </p>

                    <div className="mt-auto flex w-full items-center justify-between">
                      {item.labels?.length ? (
                        <div className="flex items-center gap-2">
                          {item.labels.map((label) => (
                            <Label key={label.name} label={label} />
                          ))}
                        </div>
                      ) : (
                        <Badge
                          size="sm"
                          variant="outline"
                          className="border-border border-dashed"
                        >
                          <TagIcon className="!size-2.5" />
                        </Badge>
                      )}

                      <Badge
                        size="sm"
                        variant="outline"
                        className="h-5 w-fit place-self-end border-border border-dashed"
                      >
                        <CalendarIcon className="!size-2.5" />
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="my-32 flex min-h-[80vh] flex-col items-center justify-center lg:mt-0">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto flex flex-col gap-8 text-center lg:flex-row lg:text-left">
              <h2 className="font-bold text-3xl leading-tight md:text-4xl">
                Everything you need to stay organized
              </h2>

              <div className="flex flex-col justify-end">
                <p className="text-base-600 text-lg dark:text-base-400">
                  Powerful features that rival expensive alternatives and open
                  source.
                  <span>
                    <Link
                      to="/pricing"
                      className=" items-center gap-1 bg-transparent text-lg text-primary-500 shadow-none hover:bg-transparent"
                    >
                      Make the switch
                      <ChevronRight size={16} />
                    </Link>
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4">
            {features.map(({ title, description, icon, color }) => {
              const { iconBg } = match(color)
                .with("primary", () => ({
                  iconBg: "bg-primary-100 dark:bg-primary-900/50",
                }))
                .with("amber", () => ({
                  iconBg: "bg-amber-100 dark:bg-amber-900/50",
                }))
                .with("fuchsia", () => ({
                  iconBg: "bg-fuchsia-100 dark:bg-fuchsia-900/50",
                }))
                .with("emerald", () => ({
                  iconBg: "bg-emerald-100 dark:bg-emerald-900/50",
                }))
                .exhaustive();

              return (
                <Card
                  key={title}
                  title={title}
                  description={description}
                  icon={
                    <div
                      className={cn(
                        "mb-4 flex h-12 w-12 items-center justify-center rounded-xl",
                        iconBg,
                      )}
                    >
                      {icon}
                    </div>
                  }
                  className="cursor-default rounded-3xl border bg-background p-6 shadow-none transition-transform hover:bg-base-100 dark:bg-base-900 dark:hover:bg-base-800"
                  headerProps={{ className: "gap-4 p-0 pt-2" }}
                />
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
