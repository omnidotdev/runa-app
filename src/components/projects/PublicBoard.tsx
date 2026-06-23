import LabelIcon from "@/components/core/LabelIcon";
import {
  Board,
  BoardColumn,
  BoardColumnBody,
  BoardColumnEmpty,
  BoardColumnHeader,
} from "@/components/ui/board";
import { resolveBackgroundStyle } from "@/lib/constants/backgrounds";
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
  return (
    <Board
      className="h-full px-4"
      style={resolveBackgroundStyle(project?.background)}
    >
      {project.columns?.nodes?.map((column) => {
        const columnTasks = tasks.filter(
          (task) => task.columnId === column.rowId,
        );

        return (
          <BoardColumn key={column.rowId}>
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
