import dayjs from "dayjs";

import { ColumnSelector, PrioritySelector } from "@/components/core";
import LabelIcon from "@/components/core/LabelIcon";
import {
  AvatarFallback,
  AvatarImage,
  AvatarRoot,
} from "@/components/ui/avatar";
import capitalizeFirstLetter from "@/lib/util/capitalizeFirstLetter";
import AssigneesPopover from "./AssigneesPopover";
import DueDatePopover from "./DueDatePopover";
import LabelsPopover from "./LabelsPopover";
import PriorityIcon from "./PriorityIcon";
import { PropertyRow, PropertyTrigger, PropertyValue } from "./propertyRow";

import type { TaskPatch, TaskQuery } from "@/generated/graphql";

type Task = NonNullable<TaskQuery["task"]>;

interface Props {
  task: Task;
  projectId: string;
  editable: boolean;
  /** Apply a direct patch (status/priority). No-op in the read-only view. */
  onPatch: (patch: TaskPatch) => void;
}

const TaskProperties = ({ task, projectId, editable, onPatch }: Props) => (
  <div className="flex w-full flex-col gap-1">
    <PropertyRow label="Status">
      {editable ? (
        <ColumnSelector
          projectId={projectId}
          defaultValue={[task.columnId!]}
          onValueChange={({ value }) => onPatch({ columnId: value[0] })}
          trigger={
            <PropertyTrigger>
              <LabelIcon
                icon={task.column?.icon ?? "lucide:circle"}
                className="size-4"
              />
              <span className="truncate">{task.column?.title}</span>
            </PropertyTrigger>
          }
        />
      ) : (
        <PropertyValue>
          <LabelIcon
            icon={task.column?.icon ?? "lucide:circle"}
            className="size-4"
          />
          <span className="truncate">{task.column?.title}</span>
        </PropertyValue>
      )}
    </PropertyRow>

    <PropertyRow label="Priority">
      {editable ? (
        <PrioritySelector
          defaultValue={[task.priority!]}
          triggerValue={task.priority ?? undefined}
          onValueChange={({ value }) => onPatch({ priority: value[0] })}
          trigger={
            <PropertyTrigger>
              <PriorityIcon priority={task.priority ?? undefined} />
              <span className="truncate">
                {capitalizeFirstLetter(task.priority ?? "")}
              </span>
            </PropertyTrigger>
          }
        />
      ) : (
        <PropertyValue>
          <PriorityIcon priority={task.priority ?? undefined} />
          <span className="truncate">
            {capitalizeFirstLetter(task.priority ?? "")}
          </span>
        </PropertyValue>
      )}
    </PropertyRow>

    <PropertyRow label="Assignees">
      <AssigneesPopover
        taskId={task.rowId}
        assignees={task.assignees?.nodes ?? []}
        editable={editable}
      />
    </PropertyRow>

    <PropertyRow label="Labels">
      <LabelsPopover
        taskId={task.rowId}
        projectId={projectId}
        taskLabels={task.taskLabels?.nodes ?? []}
        editable={editable}
      />
    </PropertyRow>

    <PropertyRow label="Due date">
      <DueDatePopover
        taskId={task.rowId}
        dueDate={task.dueDate}
        editable={editable}
      />
    </PropertyRow>

    <div className="my-2 border-t" />

    <PropertyRow label="Created">
      <PropertyValue className="text-muted-foreground">
        {dayjs(task.createdAt).format("MMM D, YYYY")}
      </PropertyValue>
    </PropertyRow>

    <PropertyRow label="Updated">
      <PropertyValue className="text-muted-foreground">
        {dayjs(task.updatedAt).format("MMM D, YYYY")}
      </PropertyValue>
    </PropertyRow>

    <PropertyRow label="Author">
      <PropertyValue>
        <AvatarRoot className="size-5 rounded-full border bg-background font-medium text-[10px]">
          <AvatarImage
            src={task.author?.avatarUrl ?? undefined}
            alt={task.author?.name ?? undefined}
          />
          <AvatarFallback>
            {task.author?.name?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </AvatarRoot>
        <span className="truncate">{task.author?.name ?? "Anonymous"}</span>
      </PropertyValue>
    </PropertyRow>
  </div>
);

export default TaskProperties;
