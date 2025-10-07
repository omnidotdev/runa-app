import { useSuspenseQuery } from "@tanstack/react-query";
import { useLoaderData, useRouteContext } from "@tanstack/react-router";
import {
  CheckIcon,
  MoreHorizontalIcon,
  PenLineIcon,
  PipetteIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

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
import { Tooltip } from "@/components/ui/tooltip";
import {
  Role,
  useCreateLabelMutation,
  useDeleteLabelMutation,
  useUpdateLabelMutation,
} from "@/generated/graphql";
import { colors } from "@/lib/constants/colors";
import useForm from "@/lib/hooks/useForm";
import workspaceOptions from "@/lib/options/workspace.options";
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

  const { projectId, workspaceId } = useLoaderData({
    from: "/_auth/workspaces/$workspaceSlug/projects/$projectSlug/settings",
  });

  const { session } = useRouteContext({
    from: "/_auth/workspaces/$workspaceSlug/projects/$projectSlug/settings",
  });

  const { data: role } = useSuspenseQuery({
    ...workspaceOptions({ rowId: workspaceId, userId: session?.user?.rowId! }),
    select: (data) => data.workspace?.workspaceUsers?.nodes?.[0]?.role,
  });

  const isMember = role === Role.Member;

  const [isHovering, setIsHovering] = useState(false);

  const { mutate: updateLabel } = useUpdateLabelMutation({
      meta: {
        invalidates: [["all"]],
      },
    }),
    { mutate: deleteLabel } = useDeleteLabelMutation({
      meta: {
        invalidates: [["all"]],
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
        invalidates: [["all"]],
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
      color: label.color ?? "#09b8b5",
    },
    onSubmit: ({ value, formApi }) => {
      if (label.rowId === "pending") {
        createLabel({
          input: {
            label: {
              projectId,
              name: value.name,
              color: value.color,
            },
          },
        });
      } else {
        setLocalLabels((prev) =>
          prev.map((c) =>
            c.rowId === label.rowId
              ? { ...c, name: value.name, color: value.color }
              : c,
          ),
        );

        updateLabel({
          rowId: label.rowId!,
          patch: {
            color: value.color,
            name: value.name,
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
        "group flex h-10 w-full items-center px-2",
        isActive || label.rowId === "pending" ? "bg-accent" : "hover:bg-accent",
        hasActiveLabel && !isActive && "pointer-events-none",
      )}
    >
      <form.Field name="color">
        {(field) => (
          <ColorPickerRoot
            positioning={{
              strategy: "fixed",
              placement: "bottom",
            }}
            value={parseColor(field.state.value ?? "#09b8b5")}
            onValueChange={({ value }) => {
              field.handleChange(value.toString("hex"));
            }}
            disabled={!isActive}
          >
            <ColorPickerControl className="ml-5.5 flex items-center disabled:cursor-default">
              <ColorPickerTrigger className="size-4 rounded-full outline-none transition-[color,box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-default">
                <ColorPickerTransparencyGrid />
                <ColorPickerValueSwatch />
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
            ref={inputRef}
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
            disabled={!isActive}
            placeholder="Enter a label name..."
            className="ml-3 rounded border-0 shadow-none focus-visible:ring-offset-0 disabled:cursor-default disabled:opacity-100"
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
            <div className="ml-2 flex items-center justify-center">
              <Tooltip tooltip="Cancel">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    onSetActive(null);
                    form.reset();
                  }}
                  disabled={isSubmitting}
                  className="focus-visible:ring-offset-0"
                >
                  <XIcon />
                </Button>
              </Tooltip>

              <Tooltip tooltip="Save">
                <Button
                  type="submit"
                  variant="ghost"
                  size="icon"
                  disabled={!canSubmit || isSubmitting || isDefaultValue}
                  className="focus-visible:ring-offset-0"
                >
                  <CheckIcon />
                </Button>
              </Tooltip>
            </div>
          )}
        </form.Subscribe>
      )}
    </form>
  );
};

export default LabelForm;
