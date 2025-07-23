import {
  ColorPicker as ArkColorPicker,
  parseColor,
} from "@ark-ui/react/color-picker";
import { tv } from "tailwind-variants";

import { cn } from "@/lib/utils";

import type { ComponentProps } from "react";

const colorPickerVariants = tv({
  slots: {
    root: "flex flex-col gap-1.5",
    label: "font-medium text-foreground text-sm",
    control: "flex items-center gap-2",
    channelInput: "flex h-9 w-full rounded-md border bg-transparent px-3 py-1",
    valueText: "text-muted-foreground text-sm",
    trigger:
      "relative h-9 w-9 shrink-0 cursor-pointer overflow-hidden rounded-md border border-input",
    valueSwatch: "h-full w-full",
    positioner: "z-50",
    content:
      "fade-in-0 zoom-in-95 data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 flex w-80 animate-in flex-col gap-3 overflow-hidden rounded-md border bg-popover p-4 text-popover-foreground shadow-md data-[state=closed]:animate-out",
    area: "relative h-[150px] w-full",
    areaBackground: "h-full w-full rounded-md",
    areaThumb: "absolute h-5 w-5 rounded-full border-2 border-white shadow-lg",
    channelSlider: "h-4 w-full",
    channelSliderTrack: "relative h-4 w-full rounded-md",
    channelSliderThumb:
      "-translate-y-1/2 -translate-x-1/2 absolute top-1/2 h-5 w-5 rounded-full border-2 border-white shadow-sm",
    swatchGroup: "flex flex-wrap gap-2",
    swatchTrigger: "cursor-pointer",
    swatch: "h-6 w-6 rounded-md border border-gray-200",
    swatchIndicator:
      "flex h-full w-full items-center justify-center text-white",
    transparencyGrid: "absolute inset-0 rounded-md",
    formatTrigger:
      "inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md border border-input bg-background px-4 py-2 font-medium text-sm shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
    formatSelect:
      "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
    eyeDropperTrigger:
      "flex h-9 w-9 items-center justify-center rounded-md border border-input bg-transparent text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
    pickerView: "flex w-full flex-1 gap-2",
  },
});

const {
  root,
  label,
  control,
  channelInput,
  valueText,
  trigger,
  valueSwatch,
  positioner,
  content,
  area,
  areaBackground,
  areaThumb,
  channelSlider,
  channelSliderTrack,
  channelSliderThumb,
  swatchGroup,
  swatchTrigger,
  swatch,
  swatchIndicator,
  transparencyGrid,
  formatTrigger,
  formatSelect,
  eyeDropperTrigger,
  pickerView,
} = colorPickerVariants();

const ColorPickerRoot = ({
  className,
  ...rest
}: ComponentProps<typeof ArkColorPicker.Root>) => (
  <ArkColorPicker.Root className={cn(root(), className)} {...rest} />
);

const ColorPickerLabel = ({
  className,
  ...rest
}: ComponentProps<typeof ArkColorPicker.Label>) => (
  <ArkColorPicker.Label className={cn(label(), className)} {...rest} />
);

const ColorPickerControl = ({
  className,
  ...rest
}: ComponentProps<typeof ArkColorPicker.Control>) => (
  <ArkColorPicker.Control className={cn(control(), className)} {...rest} />
);

const ColorPickerChannelInput = ({
  className,
  ...rest
}: ComponentProps<typeof ArkColorPicker.ChannelInput>) => (
  <ArkColorPicker.ChannelInput
    className={cn(channelInput(), className)}
    {...rest}
  />
);

const ColorPickerValueText = ({
  className,
  ...rest
}: ComponentProps<typeof ArkColorPicker.ValueText>) => (
  <ArkColorPicker.ValueText className={cn(valueText(), className)} {...rest} />
);

const ColorPickerTrigger = ({
  className,
  ...rest
}: ComponentProps<typeof ArkColorPicker.Trigger>) => (
  <ArkColorPicker.Trigger className={cn(trigger(), className)} {...rest} />
);

const ColorPickerValueSwatch = ({
  className,
  ...rest
}: ComponentProps<typeof ArkColorPicker.ValueSwatch>) => (
  <ArkColorPicker.ValueSwatch
    className={cn(valueSwatch(), className)}
    {...rest}
  />
);

const ColorPickerPositioner = ({
  className,
  ...rest
}: ComponentProps<typeof ArkColorPicker.Positioner>) => (
  <ArkColorPicker.Positioner
    className={cn(positioner(), className)}
    {...rest}
  />
);

const ColorPickerContent = ({
  className,
  ...rest
}: ComponentProps<typeof ArkColorPicker.Content>) => (
  <ArkColorPicker.Content className={cn(content(), className)} {...rest} />
);

const ColorPickerArea = ({
  className,
  ...rest
}: ComponentProps<typeof ArkColorPicker.Area>) => (
  <ArkColorPicker.Area className={cn(area(), className)} {...rest} />
);

const ColorPickerAreaBackground = ({
  className,
  ...rest
}: ComponentProps<typeof ArkColorPicker.AreaBackground>) => (
  <ArkColorPicker.AreaBackground
    className={cn(areaBackground(), className)}
    {...rest}
  />
);

const ColorPickerAreaThumb = ({
  className,
  ...rest
}: ComponentProps<typeof ArkColorPicker.AreaThumb>) => (
  <ArkColorPicker.AreaThumb className={cn(areaThumb(), className)} {...rest} />
);

const ColorPickerChannelSlider = ({
  className,
  ...rest
}: ComponentProps<typeof ArkColorPicker.ChannelSlider>) => (
  <ArkColorPicker.ChannelSlider
    className={cn(channelSlider(), className)}
    {...rest}
  />
);

const ColorPickerChannelSliderTrack = ({
  className,
  ...rest
}: ComponentProps<typeof ArkColorPicker.ChannelSliderTrack>) => (
  <ArkColorPicker.ChannelSliderTrack
    className={cn(channelSliderTrack(), className)}
    {...rest}
  />
);

const ColorPickerChannelSliderThumb = ({
  className,
  ...rest
}: ComponentProps<typeof ArkColorPicker.ChannelSliderThumb>) => (
  <ArkColorPicker.ChannelSliderThumb
    className={cn(channelSliderThumb(), className)}
    {...rest}
  />
);

const ColorPickerSwatchGroup = ({
  className,
  ...rest
}: ComponentProps<typeof ArkColorPicker.SwatchGroup>) => (
  <ArkColorPicker.SwatchGroup
    className={cn(swatchGroup(), className)}
    {...rest}
  />
);

const ColorPickerSwatchTrigger = ({
  className,
  ...rest
}: ComponentProps<typeof ArkColorPicker.SwatchTrigger>) => (
  <ArkColorPicker.SwatchTrigger
    className={cn(swatchTrigger(), className)}
    {...rest}
  />
);

const ColorPickerSwatch = ({
  className,
  ...rest
}: ComponentProps<typeof ArkColorPicker.Swatch>) => (
  <ArkColorPicker.Swatch className={cn(swatch(), className)} {...rest} />
);

const ColorPickerSwatchIndicator = ({
  className,
  ...rest
}: ComponentProps<typeof ArkColorPicker.SwatchIndicator>) => (
  <ArkColorPicker.SwatchIndicator
    className={cn(swatchIndicator(), className)}
    {...rest}
  />
);

const ColorPickerTransparencyGrid = ({
  className,
  ...rest
}: ComponentProps<typeof ArkColorPicker.TransparencyGrid>) => (
  <ArkColorPicker.TransparencyGrid
    className={cn(transparencyGrid(), className)}
    {...rest}
  />
);

const ColorPickerFormatTrigger = ({
  className,
  ...rest
}: ComponentProps<typeof ArkColorPicker.FormatTrigger>) => (
  <ArkColorPicker.FormatTrigger
    className={cn(formatTrigger(), className)}
    {...rest}
  />
);

const ColorPickerFormatSelect = ({
  className,
  ...rest
}: ComponentProps<typeof ArkColorPicker.FormatSelect>) => (
  <ArkColorPicker.FormatSelect
    className={cn(formatSelect(), className)}
    {...rest}
  />
);

const ColorPickerView = ({
  className,
  ...rest
}: ComponentProps<typeof ArkColorPicker.View>) => (
  <ArkColorPicker.View className={cn(pickerView(), className)} {...rest} />
);

const ColorPickerEyeDropperTrigger = ({
  className,
  ...rest
}: ComponentProps<typeof ArkColorPicker.EyeDropperTrigger>) => (
  <div>
    <ArkColorPicker.EyeDropperTrigger
      className={cn(eyeDropperTrigger(), className)}
      {...rest}
    />
  </div>
);

const ColorPickerHiddenInput = ArkColorPicker.HiddenInput;
const ColorPickerProvider = ArkColorPicker.RootProvider;

export {
  ColorPickerRoot,
  ColorPickerLabel,
  ColorPickerControl,
  ColorPickerChannelInput,
  ColorPickerValueText,
  ColorPickerTrigger,
  ColorPickerValueSwatch,
  ColorPickerPositioner,
  ColorPickerContent,
  ColorPickerArea,
  ColorPickerAreaBackground,
  ColorPickerAreaThumb,
  ColorPickerChannelSlider,
  ColorPickerSwatchGroup,
  ColorPickerSwatchTrigger,
  ColorPickerSwatch,
  ColorPickerSwatchIndicator,
  ColorPickerTransparencyGrid,
  ColorPickerFormatTrigger,
  ColorPickerFormatSelect,
  ColorPickerView,
  ColorPickerEyeDropperTrigger,
  ColorPickerHiddenInput,
  ColorPickerChannelSliderTrack,
  ColorPickerChannelSliderThumb,
  ColorPickerProvider,
  // Re-export parseColor for convenience in usage
  parseColor,
};
