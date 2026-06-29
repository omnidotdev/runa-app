import {
  Board,
  BoardColumn,
  BoardColumnBody,
  BoardColumnEmpty,
  BoardColumnHeader,
} from "@omnidotdev/thornberry/board";

import LabelIcon from "@/components/core/LabelIcon";
import { API_BASE_URL } from "@/lib/config/env.config";
import { resolveBackgroundStyle } from "@/lib/constants/backgrounds";
import { cn } from "@/lib/utils";
import PublicBoardItem from "./PublicBoardItem";

import type { ProjectQuery, TasksQuery } from "@/generated/graphql";

interface Props {
  project: NonNullable<ProjectQuery["project"]>;
  tasks: NonNullable<TasksQuery["tasks"]>["nodes"];
}

/**
 * Read-only public project board, rendered with the shared board primitives
 * (columns by status, momentum drag-to-scroll). The same shell powers Backfeed's
 * roadmap; here it is fed Runa tasks grouped by column.
 */
const PublicBoard = ({ project, tasks }: Props) => {
  const boardBackground = resolveBackgroundStyle(project?.background, {
    assetBaseUrl: API_BASE_URL,
  });
  const hasBackground = Boolean(boardBackground);

  return (
    <Board className="h-full px-4" style={boardBackground}>
      {project.columns?.nodes?.map((column) => {
        const columnTasks = tasks.filter(
          (task) => task.columnId === column.rowId,
        );

        return (
          <BoardColumn
            key={column.rowId}
            className={cn(hasBackground && "bg-background/65 backdrop-blur-md")}
          >
            <BoardColumnHeader
              title={column.title}
              count={column.tasks?.totalCount ?? 0}
              icon={
                <LabelIcon
                  icon={column.icon}
                  className="size-4 shrink-0 text-muted-foreground"
                />
              }
            />

            <BoardColumnBody>
              {columnTasks.length ? (
                columnTasks.map((task) => (
                  <PublicBoardItem
                    key={task.rowId}
                    task={task}
                    displayId={`${project.prefix ?? "PROJ"}-${task.number}`}
                  />
                ))
              ) : (
                <BoardColumnEmpty>No tasks</BoardColumnEmpty>
              )}
            </BoardColumnBody>
          </BoardColumn>
        );
      })}
    </Board>
  );
};

export default PublicBoard;
