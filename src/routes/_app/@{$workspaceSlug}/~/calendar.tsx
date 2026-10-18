import { createFileRoute, notFound } from "@tanstack/react-router";
import { useMemo } from "react";

import CalendarView from "@/components/calendar/CalendarView";
import MyCalendarFeedButton from "@/components/calendar/MyCalendarFeedButton";
import {
  useMyCalendarTasksQuery,
  useTaskQuery,
  useTasksQuery,
  useUpdateTaskMutation,
} from "@/generated/graphql";
import { BASE_URL } from "@/lib/config/env.config";
import createMetaTags from "@/lib/util/createMetaTags";
import { storedDueDate } from "@/lib/util/dueDate";
import getQueryKeyPrefix from "@/lib/util/getQueryKeyPrefix";
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

  const { mutate: updateTask } = useUpdateTaskMutation({
    meta: {
      invalidates: [
        getQueryKeyPrefix(useMyCalendarTasksQuery),
        getQueryKeyPrefix(useTasksQuery),
        getQueryKeyPrefix(useTaskQuery),
      ],
    },
  });

  const calendarTasks = useMemo(
    () =>
      taskNodes.map((task) => ({
        id: task.rowId,
        title: stripMarkup(task.content ?? "") || "Untitled",
        dueDate: task.dueDate,
        priority: task.priority,
        labelColors:
          task.taskLabels?.nodes
            ?.map((node) => node.label?.color)
            .filter((color): color is string => Boolean(color)) ?? [],
      })),
    [taskNodes],
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

  const onReschedule = (taskId: string, dayKey: string) =>
    updateTask({ rowId: taskId, patch: { dueDate: storedDueDate(dayKey) } });

  return (
    <div className="no-scrollbar relative h-full overflow-auto px-4 py-8 lg:p-12">
      <div className="mb-4 ml-2 flex items-center justify-between lg:ml-0">
        <h1 className="font-semibold text-xl">My calendar</h1>
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
