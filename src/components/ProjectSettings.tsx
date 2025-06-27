import { useForm } from "@tanstack/react-form";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { SettingsIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DialogBackdrop,
  DialogCloseTrigger,
  DialogContent,
  DialogPositioner,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useUpdateProjectMutation } from "@/generated/graphql";
import projectOptions from "@/lib/options/project.options";
import getQueryClient from "@/utils/getQueryClient";

const ProjectSettings = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { projectId } = useParams({
    from: "/_auth/workspaces/$workspaceId/projects/$projectId/",
  });

  const queryClient = getQueryClient();

  const { data: project } = useSuspenseQuery({
    ...projectOptions(projectId),
    select: (data) => data?.project,
  });

  const { mutate: updateProject } = useUpdateProjectMutation({
    onSettled: () => {
      reset();
      setIsOpen(false);

      return queryClient.invalidateQueries();
    },
  });

  const { Field, Subscribe, handleSubmit, reset } = useForm({
    defaultValues: {
      name: project?.name || "",
      prefix: project?.prefix || "",
      description: project?.description || "",
    },
    onSubmit: ({ value }) => {
      updateProject({
        rowId: projectId,
        patch: {
          name: value.name,
          prefix: value.prefix,
          description: value.description,
        },
      });
    },
  });

  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={({ open }) => setIsOpen(open)}
      initialFocusEl={() => null}
    >
      <DialogTrigger asChild>
        <Button variant="outline">
          <SettingsIcon className="h-4 w-4" />
          Settings
        </Button>
      </DialogTrigger>
      <DialogBackdrop />
      <DialogPositioner>
        <DialogContent>
          <DialogCloseTrigger />
          <DialogTitle>Project Settings</DialogTitle>
          <form
            className="flex flex-col gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleSubmit();
            }}
          >
            <Field name="name">
              {(field) => (
                <div>
                  <label
                    htmlFor="name"
                    className="mb-1 block font-medium text-base-700 text-sm dark:text-base-300"
                  >
                    Project Name
                  </label>
                  <Input
                    id="name"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Runa"
                  />
                </div>
              )}
            </Field>

            <Field name="prefix">
              {(field) => (
                <div>
                  <label
                    htmlFor="prefix"
                    className="mb-1 block font-medium text-base-700 text-sm dark:text-base-300"
                  >
                    Project Prefix
                  </label>
                  <Input
                    id="prefix"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="PROJ"
                  />
                </div>
              )}
            </Field>

            <Field name="description">
              {(field) => (
                <div>
                  <label
                    htmlFor="description"
                    className="mb-1 block font-medium text-base-700 text-sm dark:text-base-300"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    rows={4}
                    className="w-full rounded-md border border-input bg-transparent p-3 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:font-medium file:text-foreground file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  />
                </div>
              )}
            </Field>

            <div className="flex justify-end gap-2">
              <DialogCloseTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </DialogCloseTrigger>

              <Subscribe
                selector={(state) => [
                  state.canSubmit,
                  state.isSubmitting,
                  state.isDirty,
                ]}
              >
                {([canSubmit, isSubmitting, isDirty]) => (
                  <Button
                    type="submit"
                    disabled={!canSubmit || isSubmitting || !isDirty}
                  >
                    Save Changes
                  </Button>
                )}
              </Subscribe>
            </div>
          </form>
        </DialogContent>
      </DialogPositioner>
    </DialogRoot>
  );
};

export default ProjectSettings;
