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
  colorPickerProps?: ComponentProps<typeof ArkColorPicker.Trigger>;
  colorPickerControlProps?: ComponentProps<typeof ArkColorPicker.Control>;
}

const ColorSelector = ({
  inputProps,
  colorPickerProps,
  colorPickerControlProps,
  ...rest
}: Props) => {
  return (
    <ColorPickerRoot {...rest}>
      <ColorPickerControl className="px-3" {...colorPickerControlProps}>
        <ColorPickerTrigger
          className="size-5 rounded-full"
          {...colorPickerProps}
        >
          <ColorPickerTransparencyGrid />
          <ColorPickerValueSwatch />
        </ColorPickerTrigger>

        <ColorPickerChannelInput channel="hex" asChild>
          <Input
            className="rounded-none border-0 shadow-none focus-visible:ring-0"
            {...inputProps}
          />
        </ColorPickerChannelInput>
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
