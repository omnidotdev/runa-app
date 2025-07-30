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
import { useUpdateUserPreferenceMutation } from "@/generated/graphql";
import { colors } from "@/lib/constants/colors";
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
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="flex items-center gap-2"
    >
      <form.Field name="color">
        {(field) => (
          <ColorPickerRoot
            positioning={{
              strategy: "fixed",
              placement: "bottom-start",
            }}
            value={parseColor(field.state.value ?? "#09b8b5")}
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
          >
            <ColorPickerControl className="relative flex size-6 items-center disabled:cursor-default">
              <ColorPickerTrigger
                onClick={() =>
                  setIsUpdatingColorPreferences(!isUpdatingColorPreferences)
                }
                className="size-6 disabled:cursor-default"
              >
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
                    state.isDirty,
                  ]}
                >
                  {([canSubmit, isSubmitting, isDirty]) => (
                    <div className="mt-2 flex items-center justify-end gap-2">
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
                        type="submit"
                        size="sm"
                        disabled={!canSubmit || isSubmitting || !isDirty}
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
    </form>
  );
};

export default ProjectColorPicker;
