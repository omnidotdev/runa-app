import { parseAbsoluteToLocal } from "@internationalized/date";
import { format, parseISO } from "date-fns";
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

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
import { taskFormDefaults } from "@/lib/constants/taskFormDefaults";
import { withForm } from "@/lib/hooks/useForm";

const CreateTaskDatePicker = withForm({
  defaultValues: taskFormDefaults,
  render: ({ form }) => {
    return (
      <form.Field name="dueDate">
        {(field) => (
          <DatePickerRoot
            positioning={{ sameWidth: true }}
            value={
              field.state.value.length
                ? [parseAbsoluteToLocal(field.state.value)]
                : []
            }
            onValueChange={({ value }) =>
              value.length
                ? field.handleChange(
                    new Date(
                      value[0].add({ days: 1 }).toString(),
                    ).toISOString(),
                  )
                : field.handleChange("")
            }
          >
            <DatePickerControl>
              <DatePickerTrigger asChild className="ml-0 h-9 w-fit">
                <Button variant="outline">
                  <CalendarIcon className="size-4" />
                  {field.state.value.length
                    ? // TODO: timezone handling
                      format(parseISO(field.state.value), "MMM d, yyyy")
                    : "Set due date"}
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
        )}
      </form.Field>
    );
  },
});

export default CreateTaskDatePicker;
