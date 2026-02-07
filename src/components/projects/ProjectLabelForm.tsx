import { useLoaderData } from "@tanstack/react-router";
import {
  CheckIcon,
  MoreHorizontalIcon,
  PenLineIcon,
  PipetteIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { IconSelector, Tooltip } from "@/components/core";
import { Button } from "@/components/ui/button";
import {
  ColorPickerArea,
  ColorPickerAreaBackground,
  ColorPickerAreaThumb,
  ColorPickerChannelInput,
  ColorPickerChannelSlider,
  ColorPickerChannelSliderThumb,
  ColorPickerChannelSliderTrack,
  ColorPickerContent,
  ColorPickerControl,
  ColorPickerEyeDropperTrigger,
  ColorPickerHiddenInput,
  ColorPickerPositioner,
  ColorPickerRoot,
  ColorPickerSwatch,
  ColorPickerSwatchGroup,
  ColorPickerSwatchIndicator,
  ColorPickerSwatchTrigger,
  ColorPickerTransparencyGrid,
  ColorPickerTrigger,
  ColorPickerValueSwatch,
  ColorPickerView,
  parseColor,
} from "@/components/ui/color-picker";
import { Input } from "@/components/ui/input";
import {
  MenuContent,
  MenuItem,
  MenuPositioner,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu";
import {
  useCreateLabelMutation,
  useDeleteLabelMutation,
  useLabelsQuery,
  useProjectQuery,
  useUpdateLabelMutation,
} from "@/generated/graphql";
import { colors } from "@/lib/constants/colors";
import { useCurrentUserRole } from "@/lib/hooks/useCurrentUserRole";
import useForm from "@/lib/hooks/useForm";
import { Role } from "@/lib/permissions";
import getQueryKeyPrefix from "@/lib/util/getQueryKeyPrefix";
import { cn } from "@/lib/utils";

import type { Dispatch, SetStateAction } from "react";
import type { LabelFragment } from "@/generated/graphql";

interface Props {
  label: LabelFragment;
  isActive: boolean;
  hasActiveLabel?: boolean;
  onSetActive: (rowId: string | null) => void;
  setLocalLabels: Dispatch<SetStateAction<LabelFragment[]>>;
}

const LabelForm = ({
  label,
  isActive,
  onSetActive,
  hasActiveLabel,
  setLocalLabels,
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const { projectId, organizationId } = useLoaderData({
    from: "/_auth/workspaces/$workspaceSlug/projects/$projectSlug/settings",
  });

  // Get role from IDP organization claims
  const role = useCurrentUserRole(organizationId);
  const isMember = role === Role.Member;

  const [isHovering, setIsHovering] = useState(false);

  const { mutate: updateLabel } = useUpdateLabelMutation({
      meta: {
        invalidates: [
          getQueryKeyPrefix(useLabelsQuery),
          getQueryKeyPrefix(useProjectQuery),
        ],
      },
    }),
    { mutate: deleteLabel } = useDeleteLabelMutation({
      meta: {
        invalidates: [
          getQueryKeyPrefix(useLabelsQuery),
          getQueryKeyPrefix(useProjectQuery),
        ],
      },
      onError: (error) => console.error(error),
      onSuccess: (data) => {
        const labelBeingDeleted = data?.deleteLabel?.label;

        if (labelBeingDeleted) {
          setLocalLabels((prev) =>
            prev.filter((label) => label.rowId !== labelBeingDeleted.rowId),
          );
        }
      },
    }),
    { mutate: createLabel } = useCreateLabelMutation({
      meta: {
        invalidates: [
          getQueryKeyPrefix(useLabelsQuery),
          getQueryKeyPrefix(useProjectQuery),
        ],
      },
      onError: (error) => console.error(error),
      onSuccess: (data) => {
        const newLabel = data?.createLabel?.label;

        if (newLabel) {
          setLocalLabels((prev) => [...prev, newLabel]);
        }
      },
    });

  const form = useForm({
    defaultValues: {
      name: label.name,
      color: label.color ?? "#e4a21b",
      icon: label.icon ?? null,
    },
    onSubmit: ({ value, formApi }) => {
      if (label.rowId === "pending") {
        createLabel({
          input: {
            label: {
              projectId,
              name: value.name,
              color: value.color,
              icon: value.icon,
            },
          },
        });
      } else {
        setLocalLabels((prev) =>
          prev.map((c) =>
            c.rowId === label.rowId
              ? { ...c, name: value.name, color: value.color, icon: value.icon }
              : c,
          ),
        );

        updateLabel({
          rowId: label.rowId!,
          patch: {
            color: value.color,
            name: value.name,
            icon: value.icon,
          },
        });
      }

      onSetActive(null);
      formApi.reset();
    },
  });

  useEffect(() => {
    if (isActive && inputRef.current) {
      inputRef.current.focus();
      // Set the caret to the end of the input value
      inputRef.current.setSelectionRange(
        inputRef.current.value.length,
        inputRef.current.value.length,
      );
    }
  }, [isActive]);

  return (
    <form
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className={cn(
        "group flex h-10 w-full items-center gap-2 px-2",
        isActive || label.rowId === "pending" ? "bg-accent" : "hover:bg-accent",
        hasActiveLabel && !isActive && "pointer-events-none",
      )}
    >
      <form.Field name="icon">
        {(field) => (
          <IconSelector
            value={field.state.value}
            onChange={field.handleChange}
            disabled={!isActive}
          />
        )}
      </form.Field>

      <form.Field name="color">
        {(field) => (
          <ColorPickerRoot
            positioning={{
              strategy: "fixed",
              placement: "bottom",
            }}
            value={parseColor(field.state.value ?? "#e4a21b")}
            onValueChange={({ value }) => {
              field.handleChange(value.toString("hex"));
            }}
            disabled={!isActive}
          >
            <ColorPickerControl className="relative flex items-center disabled:cursor-default">
              <ColorPickerTrigger
                className={cn(
                  "relative flex size-9 items-center justify-center rounded-md border border-transparent transition-all hover:border-primary hover:bg-accent focus-visible:rounded-md focus-visible:border-2 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-offset-0 focus-visible:ring-offset-background disabled:cursor-default disabled:border-none data-[state=open]:border-primary data-[state=open]:ring-0",
                  isActive ? "border border-primary" : "pointer-events-none",
                )}
              >
                <div className="size-5 overflow-hidden rounded">
                  <ColorPickerTransparencyGrid />
                  <ColorPickerValueSwatch />
                </div>
              </ColorPickerTrigger>
            </ColorPickerControl>

            <ColorPickerPositioner>
              <ColorPickerContent>
                <ColorPickerArea>
                  <ColorPickerAreaBackground />
                  <ColorPickerAreaThumb />
                </ColorPickerArea>

                <div className="flex w-full items-center gap-4">
                  <ColorPickerEyeDropperTrigger>
                    <PipetteIcon size={14} />
                  </ColorPickerEyeDropperTrigger>

                  <div className="flex h-10 w-full flex-col items-center justify-center gap-2">
                    <ColorPickerChannelSlider channel="hue">
                      <ColorPickerChannelSliderTrack />
                      <ColorPickerChannelSliderThumb />
                    </ColorPickerChannelSlider>
                  </div>
                </div>
                <ColorPickerView format="rgba">
                  <ColorPickerChannelInput
                    channel="hex"
                    className="h-7 text-xs"
                    id="color-picker-input-view"
                    autoComplete="off"
                  />
                </ColorPickerView>

                <ColorPickerSwatchGroup>
                  {colors.map((color) => (
                    <ColorPickerSwatchTrigger key={color} value={color}>
                      <ColorPickerSwatch value={color}>
                        <ColorPickerSwatchIndicator>
                          ✓
                        </ColorPickerSwatchIndicator>
                      </ColorPickerSwatch>
                    </ColorPickerSwatchTrigger>
                  ))}
                </ColorPickerSwatchGroup>
              </ColorPickerContent>
            </ColorPickerPositioner>
            <ColorPickerHiddenInput />
          </ColorPickerRoot>
        )}
      </form.Field>

      <form.Field name="name">
        {(field) => (
          <Input
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
            disabled={!isActive}
            placeholder="Enter a label name..."
            className={cn(
              "rounded border-0 shadow-none focus-visible:border-2 focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-default disabled:opacity-100",
              isActive &&
                "border border-primary bg-background focus-visible:ring-0",
            )}
            id="label-name-input"
            autoComplete="off"
          />
        )}
      </form.Field>

      {!isActive ? (
        <MenuRoot
          positioning={{
            strategy: "fixed",
            placement: "left",
          }}
        >
          <MenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "hidden size-7 text-base-400 opacity-0 group-hover:opacity-100",
                !isMember && "inline-flex",
              )}
              tabIndex={isHovering ? 0 : -1}
            >
              <MoreHorizontalIcon />
            </Button>
          </MenuTrigger>

          <MenuPositioner>
            <MenuContent className="focus-within:outline-none">
              <MenuItem value="edit" onClick={() => onSetActive(label.rowId!)}>
                <PenLineIcon />
                <span> Edit</span>
              </MenuItem>

              <MenuItem
                value="delete"
                variant="destructive"
                onClick={() => {
                  deleteLabel({
                    rowId: label.rowId!,
                  });
                  onSetActive(null);
                }}
              >
                <Trash2Icon />
                <span> Delete </span>
              </MenuItem>
            </MenuContent>
          </MenuPositioner>
        </MenuRoot>
      ) : (
        <form.Subscribe
          selector={(state) => [
            state.canSubmit,
            state.isSubmitting,
            state.isDefaultValue,
          ]}
        >
          {([canSubmit, isSubmitting, isDefaultValue]) => (
            <div className="ml-2 flex items-center justify-center gap-1">
              <Tooltip
                tooltip="Cancel"
                trigger={
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      onSetActive(null);
                      form.reset();
                    }}
                    disabled={isSubmitting}
                    className="size-7 hover:text-destructive focus-visible:ring-offset-0"
                  >
                    <XIcon className="size-4" />
                  </Button>
                }
              />
              <Tooltip
                tooltip="Save"
                trigger={
                  <Button
                    type="submit"
                    variant="ghost"
                    size="icon"
                    disabled={!canSubmit || isSubmitting || isDefaultValue}
                    className="size-7 hover:text-green-500 focus-visible:ring-offset-0"
                  >
                    <CheckIcon className="size-4" />
                  </Button>
                }
              />
            </div>
          )}
        </form.Subscribe>
      )}
    </form>
  );
};

export default LabelForm;
