import { parseDate } from "@ark-ui/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { ChevronLeftIcon, ChevronRightIcon, EditIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DatePickerContent,
  DatePickerContext,
  DatePickerControl,
  DatePickerNextTrigger,
  DatePickerPositioner,
  DatePickerPrevTrigger,
  DatePickerRangeText,
  DatePickerRoot,
  DatePickerTable,
  DatePickerTableBody,
  DatePickerTableCell,
  DatePickerTableCellTrigger,
  DatePickerTableHead,
  DatePickerTableHeader,
  DatePickerTableRow,
  DatePickerTrigger,
  DatePickerView,
  DatePickerViewControl,
  DatePickerViewTrigger,
} from "@/components/ui/date-picker";
import { useUpdateTaskMutation } from "@/generated/graphql";
import projectOptions from "@/lib/options/project.options";
import taskOptions from "@/lib/options/task.options";

// TODO: timezone issue with date picker? Off by one.

const UpdateDueDate = () => {
  const { projectId, taskId } = useParams({
    from: "/_auth/workspaces/$workspaceId/projects/$projectId/$taskId",
  });

  const { data: task } = useSuspenseQuery({
    ...taskOptions(taskId),
    select: (data) => data?.task,
  });

  const { mutate: updateTask } = useUpdateTaskMutation({
    meta: {
      invalidates: [
        taskOptions(taskId).queryKey,
        projectOptions(projectId).queryKey,
      ],
    },
  });

  return (
    <DatePickerRoot
      positioning={{ sameWidth: true }}
      defaultValue={task?.dueDate ? [parseDate(new Date(task?.dueDate))] : []}
      onValueChange={({ value }) =>
        value.length
          ? updateTask({
              rowId: taskId,
              patch: { dueDate: new Date(value[0].toString()) },
            })
          : updateTask({ rowId: taskId, patch: { dueDate: null } })
      }
    >
      <DatePickerControl>
        <DatePickerTrigger asChild className="ml-0 h-9 w-fit">
          <Button
            variant="ghost"
            className="group h-fit py-0 font-normal text-base-500 hover:bg-transparent has-[>svg]:px-0 dark:text-base-400"
          >
            Due Date
            <EditIcon className="size-3.5" />
          </Button>
        </DatePickerTrigger>
      </DatePickerControl>

      <DatePickerPositioner>
        <DatePickerContent>
          <DatePickerView className="flex flex-col gap-3" view="day">
            <DatePickerContext>
              {(datePicker) => (
                <>
                  <DatePickerViewControl>
                    <DatePickerPrevTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <ChevronLeftIcon />
                      </Button>
                    </DatePickerPrevTrigger>

                    <DatePickerViewTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <DatePickerRangeText />
                      </Button>
                    </DatePickerViewTrigger>

                    <DatePickerNextTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <ChevronRightIcon />
                      </Button>
                    </DatePickerNextTrigger>
                  </DatePickerViewControl>

                  <DatePickerTable>
                    <DatePickerTableHead>
                      <DatePickerTableRow>
                        {datePicker.weekDays.map((weekDay, id) => (
                          // biome-ignore lint/suspicious/noArrayIndexKey: simple index
                          <DatePickerTableHeader key={id}>
                            {weekDay.narrow}
                          </DatePickerTableHeader>
                        ))}
                      </DatePickerTableRow>
                    </DatePickerTableHead>
                    <DatePickerTableBody>
                      {datePicker.weeks.map((week, id) => (
                        // biome-ignore lint/suspicious/noArrayIndexKey: simple index
                        <DatePickerTableRow key={id}>
                          {week.map((day, id) => (
                            <DatePickerTableCell
                              // biome-ignore lint/suspicious/noArrayIndexKey: simple index
                              key={id}
                              value={day}
                              className="size-8 border"
                            >
                              <DatePickerTableCellTrigger className="hover:bg-primary-50 data-[outside-range]:opacity-40 hover:data-[outside-range]:bg-transparent dark:hover:bg-primary-950">
                                {day.day}
                              </DatePickerTableCellTrigger>
                            </DatePickerTableCell>
                          ))}
                        </DatePickerTableRow>
                      ))}
                    </DatePickerTableBody>
                  </DatePickerTable>
                </>
              )}
            </DatePickerContext>
          </DatePickerView>

          <DatePickerView className="flex flex-col gap-3" view="month">
            <DatePickerContext>
              {(datePicker) => (
                <>
                  <DatePickerViewControl>
                    <DatePickerPrevTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <ChevronLeftIcon />
                      </Button>
                    </DatePickerPrevTrigger>

                    <DatePickerViewTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <DatePickerRangeText />
                      </Button>
                    </DatePickerViewTrigger>

                    <DatePickerNextTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <ChevronRightIcon />
                      </Button>
                    </DatePickerNextTrigger>
                  </DatePickerViewControl>

                  <DatePickerTable>
                    <DatePickerTableBody>
                      {datePicker
                        .getMonthsGrid({ columns: 4, format: "short" })
                        .map((months, id) => (
                          // biome-ignore lint/suspicious/noArrayIndexKey: simple index
                          <DatePickerTableRow key={id}>
                            {months.map((month, id) => (
                              <DatePickerTableCell
                                // biome-ignore lint/suspicious/noArrayIndexKey: simple index
                                key={id}
                                value={month.value}
                              >
                                <DatePickerTableCellTrigger>
                                  {month.label}
                                </DatePickerTableCellTrigger>
                              </DatePickerTableCell>
                            ))}
                          </DatePickerTableRow>
                        ))}
                    </DatePickerTableBody>
                  </DatePickerTable>
                </>
              )}
            </DatePickerContext>
          </DatePickerView>

          <DatePickerView className="flex flex-col gap-3" view="year">
            <DatePickerContext>
              {(datePicker) => (
                <>
                  <DatePickerViewControl>
                    <DatePickerPrevTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <ChevronLeftIcon />
                      </Button>
                    </DatePickerPrevTrigger>

                    <DatePickerViewTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <DatePickerRangeText />
                      </Button>
                    </DatePickerViewTrigger>

                    <DatePickerNextTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <ChevronRightIcon />
                      </Button>
                    </DatePickerNextTrigger>
                  </DatePickerViewControl>

                  <DatePickerTable>
                    <DatePickerTableBody>
                      {datePicker
                        .getYearsGrid({ columns: 4 })
                        .map((years, id) => (
                          // biome-ignore lint/suspicious/noArrayIndexKey: simple index
                          <DatePickerTableRow key={id}>
                            {years.map((year, id) => (
                              <DatePickerTableCell
                                // biome-ignore lint/suspicious/noArrayIndexKey: simple index
                                key={id}
                                value={year.value}
                              >
                                <DatePickerTableCellTrigger>
                                  {year.label}
                                </DatePickerTableCellTrigger>
                              </DatePickerTableCell>
                            ))}
                          </DatePickerTableRow>
                        ))}
                    </DatePickerTableBody>
                  </DatePickerTable>
                </>
              )}
            </DatePickerContext>
          </DatePickerView>
        </DatePickerContent>
      </DatePickerPositioner>
    </DatePickerRoot>
  );
};

export default UpdateDueDate;
