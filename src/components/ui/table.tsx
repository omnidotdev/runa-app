import { tv } from "tailwind-variants";

import { cn } from "@/lib/utils";

import type { ComponentProps } from "react";

const tableVariants = tv({
  slots: {
    container: "relative w-full overflow-auto no-scrollbar",
    root: "w-full caption-bottom text-sm",
    header: "[&_tr]:border-b h-8",
    body: "[&_tr:last-child]:border-0",
    footer: "border-t bg-muted/50 [&>tr]:last:border-b-0",
    row: "border-b hover:bg-muted/50 data-[state=selected]:bg-muted",
    head: "whitespace-nowrap p-1 text-left align-middle font-medium text-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
    cell: "whitespace-nowrap font-light align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
    caption: "mt-4 text-muted-foreground text-sm",
  },
});

const { container, root, header, body, footer, row, head, cell, caption } =
  tableVariants();

interface TableProps extends ComponentProps<"table"> {
  containerProps?: string;
}

const Table = ({ containerProps, className, ...rest }: TableProps) => (
  <div data-slot="table-container" className={cn(container(), containerProps)}>
    <table data-slot="table" className={cn(root(), className)} {...rest} />
  </div>
);

const TableHeader = ({ className, ...rest }: ComponentProps<"thead">) => (
  <thead
    data-slot="table-header"
    className={cn(header(), className)}
    {...rest}
  />
);

const TableBody = ({ className, ...rest }: ComponentProps<"tbody">) => (
  <tbody data-slot="table-body" className={cn(body(), className)} {...rest} />
);

const TableFooter = ({ className, ...rest }: ComponentProps<"tfoot">) => (
  <tfoot
    data-slot="table-footer"
    className={cn(footer(), className)}
    {...rest}
  />
);

const TableRow = ({ className, ...rest }: ComponentProps<"tr">) => (
  <tr data-slot="table-row" className={cn(row(), className)} {...rest} />
);

const TableHead = ({ className, ...rest }: ComponentProps<"th">) => (
  <th data-slot="table-head" className={cn(head(), className)} {...rest} />
);

const TableCell = ({ className, ...rest }: ComponentProps<"td">) => (
  <td data-slot="table-cell" className={cn(cell(), className)} {...rest} />
);

const TableCaption = ({ className, ...rest }: ComponentProps<"caption">) => (
  <caption
    data-slot="table-caption"
    className={cn(caption(), className)}
    {...rest}
  />
);

export {
  Table,
  TableHeader,
  TableBody,
  /** @knipignore */
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  /** @knipignore */
  TableCaption,
};
