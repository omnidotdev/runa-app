import { Settings } from "lucide-react";

import { CardContent, CardRoot } from "@/components/ui/card";

const CustomizationTab = () => {
  return (
    <CardRoot className="mt-4 border">
      <CardContent className="p-6">
        <div className="p-8 text-center">
          <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-muted/50">
            <Settings className="size-8 text-muted-foreground" />
          </div>
          <h3 className="mb-3 font-bold text-xl">Coming Soon</h3>
          <p className="mx-auto max-w-md text-muted-foreground text-sm leading-relaxed">
            Customization options will be available in a future update. You'll
            be able to personalize your workspaces, themes, and preferences.
          </p>
        </div>
      </CardContent>
    </CardRoot>
  );
};

export default CustomizationTab;
