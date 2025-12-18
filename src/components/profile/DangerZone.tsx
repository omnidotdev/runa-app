import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DialogBackdrop,
  DialogCloseTrigger,
  DialogContent,
  DialogDescription,
  DialogPositioner,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const DangerZone = () => {
  return (
    <div className="mt-8 rounded-xl border border-destructive/20 bg-destructive/5 p-6">
      <div className="flex flex-col gap-4">
        <h3 className="font-bold text-destructive text-xl">Danger Zone</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Permanently delete all of your associated data
        </p>
      </div>

      <DialogRoot>
        <DialogTrigger asChild>
          <Button
            variant="destructive"
            className="mt-4 text-background"
            // TODO: determine proper disabled state
            disabled
          >
            Delete Account
          </Button>
        </DialogTrigger>
        <DialogBackdrop />
        <DialogPositioner>
          <DialogContent className="w-full max-w-md rounded-lg bg-background">
            <DialogCloseTrigger />

            <div className="mb-1 flex flex-col gap-4">
              <div className="flex size-10 items-center justify-center rounded-full border border-destructive bg-destructive/10">
                <AlertTriangle className="size-5 text-destructive" />
              </div>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                This will permanently cancel any active subscription and delete
                all associated data. This action cannot be undone.
              </DialogDescription>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <DialogCloseTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </DialogCloseTrigger>

              <DialogCloseTrigger asChild>
                <Button
                  type="submit"
                  variant="destructive"
                  // TODO: enable
                  disabled
                >
                  Delete Account
                </Button>
              </DialogCloseTrigger>
            </div>
          </DialogContent>
        </DialogPositioner>
      </DialogRoot>
    </div>
  );
};

export default DangerZone;
