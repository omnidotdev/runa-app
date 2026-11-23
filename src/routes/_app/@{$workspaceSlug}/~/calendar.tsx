import { createFileRoute, notFound } from "@tanstack/react-router";
import { useMemo } from "react";

import CalendarView from "@/components/calendar/CalendarView";
import MyCalendarFeedButton from "@/components/calendar/MyCalendarFeedButton";
import { useMyCalendarTasksQuery } from "@/generated/graphql";
import { BASE_URL } from "@/lib/config/env.config";
import useRescheduleTask from "@/lib/hooks/useRescheduleTask";
import useToday from "@/lib/hooks/useToday";
import createMetaTags from "@/lib/util/createMetaTags";
import { rescheduledDueDate } from "@/lib/util/dueDate";
import isTaskOverdue from "@/lib/util/isTaskOverdue";
import { buildTaskKey, stripMarkup } from "@/lib/util/taskUrl";

export const Route = createFileRoute("/_app/@{$workspaceSlug}/~/calendar")({
  loader: ({ context: { organizationId } }) => {
    if (!organizationId) throw notFound();
    return { organizationId };
  },
  head: ({ params }) => ({
    meta: createMetaTags({
      title: "My Calendar",
      description: "Your tasks with due dates across every project.",
      url: `${BASE_URL}/@${params.workspaceSlug}/~/calendar`,
    }),
  }),
  component: MyCalendarPage,
});

function MyCalendarPage() {
  const { organizationId } = Route.useLoaderData();
  const { workspaceSlug } = Route.useParams();
  const { session } = Route.useRouteContext();
  const navigate = Route.useNavigate();

  const userId = session?.user?.rowId;

  const { data } = useMyCalendarTasksQuery(
    { organizationId, userId: userId! },
    { enabled: !!userId },
  );
  const taskNodes = data?.tasks?.nodes ?? [];

  const reschedule = useRescheduleTask();
  const today = useToday();

  const calendarTasks = useMemo(
    () =>
      taskNodes.map((task) => ({
        id: task.rowId,
        title: stripMarkup(task.content ?? "") || "Untitled",
        dueDate: task.dueDate,
        dueHasTime: task.dueHasTime,
        priority: task.priority,
        labelColors:
          task.taskLabels?.nodes
            ?.map((node) => node.label?.color)
            .filter((color): color is string => Boolean(color)) ?? [],
        assignees:
          task.assignees?.nodes
            ?.filter((node) => node.user)
            .map((node) => ({
              name: node.user!.name,
              src: node.user!.avatarUrl,
            })) ?? [],
        isDone: task.column?.isDone ?? false,
        isOverdue: isTaskOverdue(
          task.dueDate,
          task.dueHasTime,
          task.column?.isDone ?? false,
          today,
        ),
      })),
    [taskNodes, today],
  );

  // Clicking a task opens it in its own project (this view spans all of them).
  const onSelectTask = (taskId: string) => {
    const task = taskNodes.find((candidate) => candidate.rowId === taskId);
    if (!task?.project) return;
    navigate({
      to: "/@{$workspaceSlug}/$projectSlug/$taskId",
      params: {
        workspaceSlug,
        projectSlug: task.project.slug,
        taskId: buildTaskKey({
          prefix: task.project.prefix,
          number: task.number!,
          content: task.content,
        }),
      },
    });
  };

  // a timed task keeps its time-of-day, an all-day task stays all-day
  const onReschedule = (taskId: string, dayKey: string) => {
    const task = taskNodes.find((candidate) => candidate.rowId === taskId);
    reschedule(
      taskId,
      rescheduledDueDate(dayKey, {
        dueDate: task?.dueDate,
        dueHasTime: task?.dueHasTime,
      }),
    );
  };

  return (
    <div className="relative h-full overflow-auto px-4 py-8 lg:p-12">
      <div className="mb-4 ml-2 flex items-center justify-between lg:ml-0">
        <h1 className="text-xl font-semibold">My calendar</h1>
        <MyCalendarFeedButton organizationId={organizationId} />
      </div>
      <CalendarView
        tasks={calendarTasks}
        onSelectTask={onSelectTask}
        onReschedule={onReschedule}
      />
    </div>
  );
}
