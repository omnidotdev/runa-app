import { CardContent, CardRoot } from "@omnidotdev/thornberry/card";
import { Settings } from "lucide-react";

const CustomizationTab = () => {
  return (
    <CardRoot className="mt-4 border">
      <CardContent className="p-6">
        <div className="p-8 text-center">
          <div className="bg-muted/50 mx-auto mb-6 flex size-16 items-center justify-center rounded-full">
            <Settings className="text-muted-foreground size-8" />
          </div>
          <h3 className="mb-3 text-xl font-bold">Coming Soon</h3>
          <p className="text-muted-foreground mx-auto max-w-md text-sm leading-relaxed">
            Customization options will be available in a future update. You'll
            be able to personalize your workspaces, themes, and preferences.
          </p>
        </div>
      </CardContent>
    </CardRoot>
  );
};

export default CustomizationTab;
