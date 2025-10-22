// TODO: remove `use client` from registry build
import { DatePicker as ArkDatePicker } from "@ark-ui/react/date-picker";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { tv } from "tailwind-variants";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import type { ComponentProps } from "react";

const datePickerVariants = tv({
  slots: {
    root: "flex flex-col gap-1.5",
    label: "font-medium text-sm",
    control: "flex items-center gap-2",
    input:
      "flex h-10 w-full rounded-md border border-base-300 bg-transparent px-3 py-2 text-sm placeholder:text-base-500 focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50",
    trigger: "ml-2 h-10 w-10",
    clearTrigger: "h-auto px-2 text-xs",
    content:
      "z-10 flex w-[344px] min-w-fit flex-col gap-3 rounded-md border bg-base-50 p-4 shadow-lg dark:bg-base-950 origin-[var(--transform-origin)] data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-300 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 origin-[var(--transform-origin)] data-[state=closed]:animate-out data-[state=open]:animate-in",
    viewControl: "flex items-center justify-between",
    viewTrigger:
      "flex items-center justify-center rounded-md px-2 py-1 font-medium text-sm",
    table: "-m-1 w-full border-separate border-spacing-1",
    tableHeader: "h-10 font-semibold text-sm",
    tableCell: "text-center ",
    tableCellTrigger:
      "size-full flex border text-xs rounded cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background items-center justify-center data-[selected]:bg-primary-200 data-[selected]:dark:bg-primary-950",
  },
});

const {
  root,
  label,
  control,
  input,
  trigger,
  clearTrigger,
  content,
  viewControl,
  viewTrigger,
  table,
  tableHeader,
  tableCell,
  tableCellTrigger,
} = datePickerVariants();

const DatePickerProvider = ArkDatePicker.RootProvider;
const DatePickerContext = ArkDatePicker.Context;
const DatePickerPositioner = ArkDatePicker.Positioner;
const DatePickerRangeText = ArkDatePicker.RangeText;
const DatePickerView = ArkDatePicker.View;
const DatePickerTableBody = ArkDatePicker.TableBody;
const DatePickerTableHead = ArkDatePicker.TableHead;
const DatePickerTableRow = ArkDatePicker.TableRow;

const DatePickerRoot = ({
  className,
  ...rest
}: ComponentProps<typeof ArkDatePicker.Root>) => (
  <ArkDatePicker.Root className={cn(root(), className)} {...rest} />
);

const DatePickerLabel = ({
  className,
  ...rest
}: ComponentProps<typeof ArkDatePicker.Label>) => (
  <ArkDatePicker.Label className={cn(label(), className)} {...rest} />
);

const DatePickerControl = ({
  className,
  ...rest
}: ComponentProps<typeof ArkDatePicker.Control>) => (
  <ArkDatePicker.Control className={cn(control(), className)} {...rest} />
);

const DatePickerInput = ({
  className,
  ...rest
}: ComponentProps<typeof ArkDatePicker.Input>) => (
  <ArkDatePicker.Input className={cn(input(), className)} {...rest} />
);

const DatePickerTrigger = ({
  className,
  ...rest
}: ComponentProps<typeof ArkDatePicker.Trigger>) => (
  <ArkDatePicker.Trigger className={cn(trigger(), className)} {...rest} />
);

const DatePickerClearTrigger = ({
  className,
  ...rest
}: ComponentProps<typeof ArkDatePicker.ClearTrigger>) => (
  <ArkDatePicker.ClearTrigger asChild {...rest}>
    <Button variant="ghost" size="sm" className={cn(clearTrigger(), className)}>
      Clear
    </Button>
  </ArkDatePicker.ClearTrigger>
);

const DatePickerContent = ({
  className,
  ...rest
}: ComponentProps<typeof ArkDatePicker.Content>) => (
  <ArkDatePicker.Content className={cn(content(), className)} {...rest} />
);

const DatePickerViewControl = ({
  className,
  ...rest
}: ComponentProps<typeof ArkDatePicker.ViewControl>) => (
  <ArkDatePicker.ViewControl
    className={cn(viewControl(), className)}
    {...rest}
  />
);

const DatePickerViewTrigger = ({
  className,
  ...rest
}: ComponentProps<typeof ArkDatePicker.ViewTrigger>) => (
  <ArkDatePicker.ViewTrigger
    className={cn(viewTrigger(), className)}
    {...rest}
  />
);

const DatePickerPrevTrigger = ({
  className,
  ...rest
}: ComponentProps<typeof ArkDatePicker.PrevTrigger>) => (
  <ArkDatePicker.PrevTrigger asChild {...rest}>
    <Button variant="ghost" size="icon" className={cn(className)}>
      <ChevronLeftIcon className="size-4" />
    </Button>
  </ArkDatePicker.PrevTrigger>
);

const DatePickerNextTrigger = ({
  className,
  ...rest
}: ComponentProps<typeof ArkDatePicker.NextTrigger>) => (
  <ArkDatePicker.NextTrigger asChild {...rest}>
    <Button variant="ghost" size="icon" className={cn(className)}>
      <ChevronRightIcon className="size-4" />
    </Button>
  </ArkDatePicker.NextTrigger>
);

const DatePickerTable = ({
  className,
  ...rest
}: ComponentProps<typeof ArkDatePicker.Table>) => (
  <ArkDatePicker.Table className={cn(table(), className)} {...rest} />
);

const DatePickerTableHeader = ({
  className,
  ...rest
}: ComponentProps<typeof ArkDatePicker.TableHeader>) => (
  <ArkDatePicker.TableHeader
    className={cn(tableHeader(), className)}
    {...rest}
  />
);

const DatePickerTableCell = ({
  className,
  ...rest
}: ComponentProps<typeof ArkDatePicker.TableCell>) => (
  <ArkDatePicker.TableCell className={cn(tableCell(), className)} {...rest} />
);

const DatePickerTableCellTrigger = ({
  className,
  ...rest
}: ComponentProps<typeof ArkDatePicker.TableCellTrigger>) => (
  <ArkDatePicker.TableCellTrigger
    className={cn(tableCellTrigger(), className)}
    {...rest}
  />
);

export {
  DatePickerRoot,
  /** @knipignore */
  DatePickerLabel,
  DatePickerControl,
  /** @knipignore */
  DatePickerInput,
  DatePickerTrigger,
  /** @knipignore */
  DatePickerClearTrigger,
  DatePickerContent,
  DatePickerView,
  DatePickerViewControl,
  DatePickerViewTrigger,
  DatePickerPrevTrigger,
  DatePickerNextTrigger,
  DatePickerTable,
  DatePickerTableHead,
  DatePickerTableRow,
  DatePickerTableHeader,
  DatePickerTableBody,
  DatePickerTableCell,
  /** @knipignore */
  DatePickerProvider,
  DatePickerContext,
  DatePickerPositioner,
  DatePickerRangeText,
  DatePickerTableCellTrigger,
};
