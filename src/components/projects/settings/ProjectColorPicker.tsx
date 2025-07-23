import { parseColor } from "@ark-ui/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useLoaderData, useRouteContext } from "@tanstack/react-router";
import { MoreHorizontalIcon, UndoIcon } from "lucide-react";
import { useState } from "react";

import ColorSelector from "@/components/core/selectors/ColorSelector";
import { Button } from "@/components/ui/button";
import {
  CollapsibleContent,
  CollapsibleRoot,
} from "@/components/ui/collapsible";
import {
  MenuContent,
  MenuItem,
  MenuPositioner,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu";
import { useUpdateUserPreferenceMutation } from "@/generated/graphql";
import useForm from "@/lib/hooks/useForm";
import userPreferencesOptions from "@/lib/options/userPreferences.options";

const ProjectColorPicker = () => {
  const { projectId } = useLoaderData({
    from: "/_auth/workspaces/$workspaceSlug/projects/$projectSlug/settings",
  });

  const { session } = useRouteContext({
    from: "/_auth/workspaces/$workspaceSlug/projects/$projectSlug/settings",
  });

  const [isUpdatingColorPreferences, setIsUpdatingColorPreferences] =
    useState(false);

  const { data: userPreferences } = useSuspenseQuery({
    ...userPreferencesOptions({
      userId: session?.user?.rowId!,
      projectId,
    }),
    select: (data) => data?.userPreferenceByUserIdAndProjectId,
  });

  const { mutate: updateUserPreferences } = useUpdateUserPreferenceMutation({
    meta: {
      invalidates: [["all"]],
    },
  });

  const form = useForm({
    defaultValues: {
      color: userPreferences?.color ?? "#09b8b5",
    },
    onSubmit: ({ value, formApi }) => {
      updateUserPreferences({
        rowId: userPreferences?.rowId!,
        patch: {
          color: value.color,
        },
      });

      setIsUpdatingColorPreferences(false);
      formApi.reset();
    },
  });

  return (
    <div className="flex max-w-1/2 flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-medium text-base-700 text-sm dark:text-base-300">
          Project Color
        </h2>
        <MenuRoot
          positioning={{
            strategy: "fixed",
            placement: "top",
          }}
        >
          <MenuTrigger asChild>
            <Button variant="ghost" size="xs" className="size-5">
              <MoreHorizontalIcon className="size-4" />
            </Button>
          </MenuTrigger>

          <MenuPositioner>
            <MenuContent className="focus-within:outline-none">
              <MenuItem
                value="reset"
                className="flex cursor-pointer items-center gap-2"
                onClick={() => {
                  updateUserPreferences({
                    rowId: userPreferences?.rowId!,
                    patch: {
                      color: "#09b8b5",
                    },
                  });
                }}
              >
                <UndoIcon />
                <span> Reset to defaults</span>
              </MenuItem>
            </MenuContent>
          </MenuPositioner>
        </MenuRoot>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <form.Field name="color">
          {(field) => (
            <ColorSelector
              value={parseColor(field.state.value ?? "#09b8b5")}
              onValueChange={({ value }) => {
                setIsUpdatingColorPreferences(true);
                field.handleChange(value.toString("hex"));
              }}
              inputProps={{
                className: "border",
              }}
              colorPickerControlProps={{ className: "flex flex-row-reverse" }}
              colorPickerProps={{
                className: "h-9 w-9",
              }}
            />
          )}
        </form.Field>

        <CollapsibleRoot
          open={isUpdatingColorPreferences}
          onOpenChange={({ open }) => setIsUpdatingColorPreferences(open)}
        >
          <CollapsibleContent className="mt-4 flex justify-end gap-2">
            <Button
              variant="ghost"
              onClick={() => {
                setIsUpdatingColorPreferences(false);
                form.reset();
              }}
            >
              Cancel
            </Button>

            <form.Subscribe
              selector={(state) => [
                state.canSubmit,
                state.isSubmitting,
                state.isDirty,
              ]}
            >
              {([canSubmit, isSubmitting, isDirty]) => (
                <Button
                  type="submit"
                  disabled={!canSubmit || isSubmitting || !isDirty}
                >
                  Update
                </Button>
              )}
            </form.Subscribe>
          </CollapsibleContent>
        </CollapsibleRoot>
      </form>
    </div>
  );
};

export default ProjectColorPicker;
