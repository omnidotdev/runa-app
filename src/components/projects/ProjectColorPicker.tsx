import { useSuspenseQuery } from "@tanstack/react-query";
import { useLoaderData, useRouteContext } from "@tanstack/react-router";
import { PipetteIcon } from "lucide-react";
import { useState } from "react";

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
import {
  useCreateUserPreferenceMutation,
  useProjectsSidebarQuery,
  useUpdateUserPreferenceMutation,
} from "@/generated/graphql";
import { colors } from "@/lib/constants/colors";
import useForm from "@/lib/hooks/useForm";
import userPreferencesOptions from "@/lib/options/userPreferences.options";
import getQueryKeyPrefix from "@/lib/util/getQueryKeyPrefix";

import type { ComponentProps } from "react";

const ProjectColorPicker = (props: ComponentProps<typeof ColorPickerRoot>) => {
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

  const userPreferencesQueryKey = userPreferencesOptions({
    userId: session?.user?.rowId!,
    projectId,
  }).queryKey;

  const { mutate: updateUserPreferences } = useUpdateUserPreferenceMutation({
    meta: {
      invalidates: [
        userPreferencesQueryKey,
        getQueryKeyPrefix(useProjectsSidebarQuery),
      ],
    },
  });

  const { mutate: createUserPreference } = useCreateUserPreferenceMutation({
    meta: {
      invalidates: [
        userPreferencesQueryKey,
        getQueryKeyPrefix(useProjectsSidebarQuery),
      ],
    },
  });

  const form = useForm({
    defaultValues: {
      color: userPreferences?.color ?? "#e4a21b",
    },
    onSubmit: ({ value }) => {
      if (!userPreferences) {
        createUserPreference({
          input: {
            userPreference: {
              userId: session?.user?.rowId!,
              projectId,
              color: value.color,
            },
          },
        });
      } else {
        updateUserPreferences({
          rowId: userPreferences.rowId,
          patch: {
            color: value.color,
          },
        });
      }

      setIsUpdatingColorPreferences(false);
    },
  });

  return (
    <div className="flex flex-col gap-2">
      <form.Field name="color">
        {(field) => (
          <ColorPickerRoot
            positioning={{
              strategy: "fixed",
              placement: "bottom-start",
            }}
            value={parseColor(field.state.value ?? "#e4a21b")}
            onValueChange={({ value }) => {
              setIsUpdatingColorPreferences(true);
              field.handleChange(value.toString("hex"));
            }}
            open={isUpdatingColorPreferences}
            onOpenChange={(open) => {
              if (!open) {
                setIsUpdatingColorPreferences(open);
                form.reset();
              }
            }}
            onPointerDownOutside={() => setIsUpdatingColorPreferences(false)}
            {...props}
          >
            <ColorPickerControl className="relative flex items-center disabled:cursor-default">
              <ColorPickerTrigger
                onClick={() => {
                  if (props.disabled) return;
                  setIsUpdatingColorPreferences(!isUpdatingColorPreferences);
                }}
                className="relative flex size-9 items-center justify-center rounded-md border border-transparent transition-all hover:border-primary hover:bg-accent focus-visible:rounded-md focus-visible:border-2 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-offset-0 focus-visible:ring-offset-background disabled:cursor-default data-[state=open]:border-primary data-[state=open]:ring-0"
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
                    id="color-picker-input"
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

                <form.Subscribe
                  selector={(state) => [
                    state.canSubmit,
                    state.isSubmitting,
                    state.isDefaultValue,
                  ]}
                >
                  {([canSubmit, isSubmitting, isDefaultValue]) => (
                    <div className="mt-4 flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setIsUpdatingColorPreferences(false);
                          form.reset();
                        }}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>

                      <Button
                        type="button"
                        size="sm"
                        disabled={!canSubmit || isSubmitting || isDefaultValue}
                        onClick={() => form.handleSubmit()}
                      >
                        Save
                      </Button>
                    </div>
                  )}
                </form.Subscribe>
              </ColorPickerContent>
            </ColorPickerPositioner>
            <ColorPickerHiddenInput />
          </ColorPickerRoot>
        )}
      </form.Field>
    </div>
  );
};

export default ProjectColorPicker;
