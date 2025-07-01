import { parseDate } from "@ark-ui/react";
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
import { withForm } from "@/lib/hooks/useForm";

const CreateTaskDatePicker = withForm({
  defaultValues: {
    title: "",
    description: "",
    labels: [] as {
      name: string;
      color: string;
      checked: boolean;
    }[],
    assignees: [] as string[],
    dueDate: "",
  },
  render: ({ form }) => {
    return (
      <form.Field name="dueDate">
        {(field) => (
          <DatePickerRoot
            positioning={{ sameWidth: true }}
            className="mb-8"
            value={
              field.state.value.length ? [parseDate(field.state.value)] : []
            }
            onValueChange={({ value }) =>
              value.length
                ? field.handleChange(value[0].toString())
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
                                  // biome-ignore lint/suspicious/noArrayIndexKey: simple index
                                  <DatePickerTableCell key={id} value={day}>
                                    <DatePickerTableCellTrigger>
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
