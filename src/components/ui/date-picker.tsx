import { DatePicker as ArkDatePicker } from "@ark-ui/react/date-picker";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import type { ComponentProps } from "react";

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
  <ArkDatePicker.Root
    className={cn("flex flex-col gap-1.5", className)}
    {...rest}
  />
);

const DatePickerLabel = ({
  className,
  ...rest
}: ComponentProps<typeof ArkDatePicker.Label>) => (
  <ArkDatePicker.Label
    className={cn("font-medium text-sm", className)}
    {...rest}
  />
);

const DatePickerControl = ({
  className,
  ...rest
}: ComponentProps<typeof ArkDatePicker.Control>) => (
  <ArkDatePicker.Control
    className={cn("flex items-center gap-2", className)}
    {...rest}
  />
);

const DatePickerInput = ({
  className,
  ...rest
}: ComponentProps<typeof ArkDatePicker.Input>) => (
  <ArkDatePicker.Input
    className={cn(
      "flex h-10 w-full rounded-md border bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...rest}
  />
);

const DatePickerTrigger = ({
  className,
  ...rest
}: ComponentProps<typeof ArkDatePicker.Trigger>) => (
  <ArkDatePicker.Trigger asChild className={className} {...rest} />
);

const DatePickerClearTrigger = ({
  className,
  ...rest
}: ComponentProps<typeof ArkDatePicker.ClearTrigger>) => (
  <ArkDatePicker.ClearTrigger asChild {...rest}>
    <Button
      variant="ghost"
      size="sm"
      className={cn("h-auto px-2 text-xs", className)}
    >
      Clear
    </Button>
  </ArkDatePicker.ClearTrigger>
);

const DatePickerContent = ({
  className,
  ...rest
}: ComponentProps<typeof ArkDatePicker.Content>) => (
  <ArkDatePicker.Content
    className={cn(
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 z-10 flex w-86 min-w-fit origin-(--transform-origin) flex-col rounded-md border bg-background p-4 shadow-lg duration-300 data-[state=closed]:animate-out data-[state=open]:animate-in",
      className,
    )}
    {...rest}
  />
);

const DatePickerViewControl = ({
  className,
  ...rest
}: ComponentProps<typeof ArkDatePicker.ViewControl>) => (
  <ArkDatePicker.ViewControl
    className={cn("flex items-center justify-between", className)}
    {...rest}
  />
);

const DatePickerViewTrigger = ({
  className,
  ...rest
}: ComponentProps<typeof ArkDatePicker.ViewTrigger>) => (
  <ArkDatePicker.ViewTrigger
    className={cn(
      "flex items-center justify-center rounded-md px-2 py-1 font-medium text-sm",
      className,
    )}
    {...rest}
  />
);

const DatePickerPrevTrigger = ({
  className,
  ...rest
}: ComponentProps<typeof ArkDatePicker.PrevTrigger>) => (
  <ArkDatePicker.PrevTrigger asChild {...rest}>
    <Button variant="ghost" size="icon" className={className}>
      <ChevronLeft className="h-4 w-4" />
    </Button>
  </ArkDatePicker.PrevTrigger>
);

const DatePickerNextTrigger = ({
  className,
  ...rest
}: ComponentProps<typeof ArkDatePicker.NextTrigger>) => (
  <ArkDatePicker.NextTrigger asChild {...rest}>
    <Button variant="ghost" size="icon" className={className}>
      <ChevronRight className="h-4 w-4" />
    </Button>
  </ArkDatePicker.NextTrigger>
);

const DatePickerTable = ({
  className,
  ...rest
}: ComponentProps<typeof ArkDatePicker.Table>) => (
  <ArkDatePicker.Table
    className={cn("-m-1 w-full border-separate border-spacing-1", className)}
    {...rest}
  />
);

const DatePickerTableHeader = ({
  className,
  ...rest
}: ComponentProps<typeof ArkDatePicker.TableHeader>) => (
  <ArkDatePicker.TableHeader
    className={cn("h-10 font-semibold text-sm", className)}
    {...rest}
  />
);

const DatePickerTableCell = ({
  className,
  ...rest
}: ComponentProps<typeof ArkDatePicker.TableCell>) => (
  <ArkDatePicker.TableCell className={cn("text-center", className)} {...rest} />
);

const DatePickerTableCellTrigger = ({
  className,
  ...rest
}: ComponentProps<typeof ArkDatePicker.TableCellTrigger>) => (
  <ArkDatePicker.TableCellTrigger
    className={cn(
      "flex size-full cursor-pointer items-center justify-center rounded border text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background data-selected:bg-primary-200 data-selected:dark:bg-primary-950",

      className,
    )}
    {...rest}
  />
);

/** @knipignore */
export {
  DatePickerRoot,
  DatePickerLabel,
  DatePickerControl,
  DatePickerInput,
  DatePickerTrigger,
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
  DatePickerProvider,
  DatePickerContext,
  DatePickerPositioner,
  DatePickerRangeText,
  DatePickerTableCellTrigger,
};
