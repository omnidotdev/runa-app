import { Switch as SwitchRoot } from "@ark-ui/react/switch";

import { cn } from "@/lib/utils";

import type { SwitchCheckedChangeDetails } from "@ark-ui/react/switch";
import type { ComponentProps } from "react";

interface SwitchProps
  extends Omit<ComponentProps<typeof SwitchRoot.Root>, "onCheckedChange"> {
  onCheckedChange?: (checked: boolean) => void;
}

const Switch = ({ className, onCheckedChange, ...rest }: SwitchProps) => (
  <SwitchRoot.Root
    className={cn("inline-flex items-center gap-2", className)}
    onCheckedChange={(details: SwitchCheckedChangeDetails) =>
      onCheckedChange?.(details.checked)
    }
    {...rest}
  >
    <SwitchRoot.Control className="inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent bg-base-200 transition-colors data-[state=checked]:bg-primary-500 dark:bg-base-700 dark:data-[state=checked]:bg-primary-500">
      <SwitchRoot.Thumb className="pointer-events-none block size-4 rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0" />
    </SwitchRoot.Control>
    <SwitchRoot.HiddenInput />
  </SwitchRoot.Root>
);

export { Switch };
