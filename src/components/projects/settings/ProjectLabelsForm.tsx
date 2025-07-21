import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { PlusIcon, TagIcon, Trash2Icon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import * as z from "zod/v4";

import ColorSelector from "@/components/core/selectors/ColorSelector";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useCreateLabelMutation,
  useDeleteLabelMutation,
  useUpdateLabelMutation,
} from "@/generated/graphql";
import useForm from "@/lib/hooks/useForm";
import labelsOptions from "@/lib/options/labels.options";
import { getLabelClasses } from "@/lib/util/getLabelClasses";
import { cn } from "@/lib/utils";

import type { ColumnDef, RowData } from "@tanstack/react-table";
import type { LabelFragment as Label } from "@/generated/graphql";

const columnHelper = createColumnHelper<Label>();

declare module "@tanstack/react-table" {
  // biome-ignore lint/correctness/noUnusedVariables: Not sure
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void;
  }
}

// https://tanstack.com/table/v8/docs/framework/react/examples/editable-data
const defaultColumn: Partial<ColumnDef<Label>> = {
  cell: ({ getValue, row: { index }, column: { id }, table }) => {
    const initialValue = getValue();
    const [value, setValue] = useState(initialValue);

    const onBlur = () => {
      table.options.meta?.updateData(index, id, value);
    };

    useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);

    return (
      <Input
        value={value as string}
        onChange={(e) => setValue(e.target.value)}
        onBlur={onBlur}
        placeholder="Enter a label name..."
        className="rounded-none border-none font-light text-xs shadow-none placeholder:opacity-50 focus-visible:ring-0 disabled:opacity-100"
      />
    );
  },
};

const ProjectLabelsForm = () => {
  const { projectId } = useParams({
    from: "/_auth/workspaces/$workspaceId/projects/$projectId/settings",
  });

  const { data: labels } = useQuery({
    ...labelsOptions({ projectId }),
    select: (data) => data?.labels?.nodes,
  });

  const { mutate: createLabel } = useCreateLabelMutation({
    meta: {
      invalidates: [["all"]],
    },
  });
  const { mutate: updateLabel } = useUpdateLabelMutation({
    meta: {
      invalidates: [["all"]],
    },
  });
  const { mutate: deleteLabel } = useDeleteLabelMutation({
    meta: {
      invalidates: [["all"]],
    },
  });

  const { Field, Subscribe, handleSubmit } = useForm({
    defaultValues: {
      name: "",
      color: "gray",
    },
    onSubmit: ({ value, formApi }) => {
      createLabel({
        input: {
          label: {
            projectId,
            name: value.name,
            color: value.color,
          },
        },
      });

      formApi.reset();
    },
  });

  const columns = useMemo(
    () => [
      columnHelper.accessor("color", {
        header: "Color",
        cell: (info) => (
          <ColorSelector
            value={[info.getValue() || "blue"]}
            onValueChange={(details) => {
              updateLabel({
                rowId: info.row.original.rowId!,
                patch: {
                  color: details.value[0],
                },
              });
            }}
            triggerValue={info.getValue()}
          />
        ),
        footer: () => (
          <Field name="color">
            {(field) => (
              <ColorSelector
                value={[field.state.value]}
                onValueChange={(details) => {
                  field.handleChange(details.value[0] || "blue");
                }}
                triggerValue={field.state.value}
              />
            )}
          </Field>
        ),
      }),
      columnHelper.accessor("name", {
        header: "Name",
        footer: () => (
          <Field
            name="name"
            validators={{
              onChangeAsyncDebounceMs: 300,
              onChangeAsync: z.string().min(1),
            }}
          >
            {(field) => (
              <Input
                id="name"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Enter a label name..."
                className="rounded-none border-none text-xs shadow-none placeholder:opacity-50 focus-visible:ring-0 disabled:opacity-100"
              />
            )}
          </Field>
        ),
      }),
      columnHelper.accessor("rowId", {
        header: "",
        cell: ({ row }) => (
          <div className="flex items-center justify-center">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-base-400 hover:text-red-500 dark:hover:text-red-400"
              onClick={() =>
                deleteLabel({
                  rowId: row.original.rowId!,
                })
              }
            >
              <Trash2Icon className="size-4" />
            </Button>
          </div>
        ),
        footer: () => (
          <div className="flex items-center justify-center">
            <Subscribe
              selector={(state) => [
                state.canSubmit,
                state.isSubmitting,
                state.isDirty,
              ]}
            >
              {([canSubmit, isSubmitting, isDirty]) => (
                <Button
                  size="icon"
                  type="submit"
                  className="h-7 w-7"
                  disabled={!canSubmit || isSubmitting || !isDirty}
                >
                  <PlusIcon className="size-4" />
                </Button>
              )}
            </Subscribe>
          </div>
        ),
      }),
    ],
    [updateLabel, Field, Subscribe, deleteLabel],
  );

  const table = useReactTable({
    data: labels || [],
    columns,
    defaultColumn,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      updateData: (rowIndex, columnId, value) => {
        updateLabel({
          rowId: labels?.[rowIndex]?.rowId!,
          patch: {
            [columnId]: value,
          },
        });
      },
    },
  });

  return (
    <div className="flex flex-col gap-3">
      <h2 className="flex items-center gap-2 font-medium text-base-700 text-sm dark:text-base-300">
        Project Labels
      </h2>

      <div className="flex items-center gap-2">
        {labels?.map((label) => {
          const colors = getLabelClasses(label.color);

          return (
            <Badge
              key={label.name}
              size="sm"
              variant="outline"
              className={cn("border-border/50", colors.bg, colors.text)}
            >
              <TagIcon className={cn("!size-2.5", colors.icon)} />
              <span className="font-medium text-[10px]">{label.name}</span>
            </Badge>
          );
        })}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleSubmit();
        }}
        className="mt-2 flex-1 rounded-md border"
      >
        <Table>
          <TableHeader className="[&_tr]:border-b-0">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => (
                  <TableHead
                    key={header.id}
                    className={cn(
                      "border-b px-3",
                      index < 1 ? "border-border border-r" : "",
                    )}
                    style={{
                      width:
                        header.id === "color"
                          ? "150px"
                          : header.id === "rowId"
                            ? "40px"
                            : "auto",
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}

            {table.getFooterGroups().map((footerGroup) => (
              <TableRow key={footerGroup.id}>
                {footerGroup.headers.map((header, index) => (
                  <TableCell
                    key={header.id}
                    className={
                      index < 1 ? "border-border border-r" : "border-0"
                    }
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.footer,
                          header.getContext(),
                        )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell, index) => (
                  <TableCell
                    key={cell.id}
                    className={cn(
                      "",
                      index < 1 ? "border-border border-r" : "",
                    )}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </form>
    </div>
  );
};

export default ProjectLabelsForm;
