import { PipetteIcon } from "lucide-react";

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
} from "@/components/ui/color-picker";
import { Input } from "@/components/ui/input";
import { colors } from "@/lib/constants/colors";

import type { ColorPicker as ArkColorPicker } from "@ark-ui/react/color-picker";
import type { ComponentProps } from "react";

interface Props extends ComponentProps<typeof ArkColorPicker.Root> {
  inputProps?: ComponentProps<typeof Input>;
  colorPickerTriggerProps?: ComponentProps<typeof ArkColorPicker.Trigger>;
  colorPickerControlProps?: ComponentProps<typeof ArkColorPicker.Control>;
  showChannelInput?: boolean;
}

const ColorSelector = ({
  inputProps,
  colorPickerTriggerProps,
  colorPickerControlProps,
  showChannelInput = true,
  ...rest
}: Props) => {
  return (
    <ColorPickerRoot {...rest}>
      <ColorPickerControl
        className="flex items-center gap-2 px-3 outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        {...colorPickerControlProps}
      >
        <ColorPickerTrigger
          className="size-5 rounded-full outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed"
          {...colorPickerTriggerProps}
        >
          <ColorPickerTransparencyGrid />
          <ColorPickerValueSwatch />
        </ColorPickerTrigger>

        {showChannelInput && (
          <ColorPickerChannelInput channel="hex" asChild>
            <Input
              className="rounded border-0 shadow-none disabled:opacity-100"
              {...inputProps}
            />
          </ColorPickerChannelInput>
        )}
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
            <ColorPickerChannelInput channel="hex" className="h-7 text-xs" />
          </ColorPickerView>

          <ColorPickerSwatchGroup>
            {colors.map((color) => (
              <ColorPickerSwatchTrigger key={color} value={color}>
                <ColorPickerSwatch value={color}>
                  <ColorPickerSwatchIndicator>✓</ColorPickerSwatchIndicator>
                </ColorPickerSwatch>
              </ColorPickerSwatchTrigger>
            ))}
          </ColorPickerSwatchGroup>
        </ColorPickerContent>
      </ColorPickerPositioner>
      <ColorPickerHiddenInput />
    </ColorPickerRoot>
  );
};

export default ColorSelector;
