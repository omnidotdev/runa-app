import { ColumnHeader } from "@/components/core";
import {
  boardColumnStyles,
  boardContainerStyles,
  boardLayoutStyles,
} from "@/lib/board/styles";
import useInertialScroll from "@/lib/hooks/useInertialScroll";
import PublicBoardItem from "./PublicBoardItem";

import type { ProjectQuery, TasksQuery } from "@/generated/graphql";

interface Props {
  project: NonNullable<ProjectQuery["project"]>;
  tasks: NonNullable<TasksQuery["tasks"]>["nodes"];
}

const PublicBoard = ({ project, tasks }: Props) => {
  const {
    scrollContainerRef,
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
    handleMouseLeave,
  } = useInertialScroll();

  return (
    <div
      ref={scrollContainerRef}
      className={`${boardContainerStyles.base} ${boardContainerStyles.background}`}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className={boardLayoutStyles.innerPadding}>
        <div className={boardLayoutStyles.columnsGap}>
          {project.columns?.nodes?.map((column) => (
            <div key={column.rowId} className={boardColumnStyles.wrapper}>
              <ColumnHeader
                title={column.title}
                count={column.tasks?.totalCount ?? 0}
                icon={column.icon}
              />

              <div className="flex h-full overflow-hidden">
                <div className={boardColumnStyles.droppable}>
                  <div className={boardColumnStyles.itemsContainer}>
                    {tasks
                      .filter((task) => task.columnId === column.rowId)
                      .map((task) => (
                        <PublicBoardItem
                          key={task.rowId}
                          task={task}
                          displayId={`${project.prefix ?? "PROJ"}-${task.number}`}
                        />
                      ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PublicBoard;
