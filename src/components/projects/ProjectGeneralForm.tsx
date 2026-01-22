import { useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { CheckIcon, PenLineIcon, XIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";

import { Tooltip } from "@/components/core";
import { ProjectColorPicker } from "@/components/projects";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useProjectQuery,
  useProjectsQuery,
  useUpdateProjectMutation,
} from "@/generated/graphql";
import getSdk from "@/lib/graphql/getSdk";
import { useCurrentUserRole } from "@/lib/hooks/useCurrentUserRole";
import useForm from "@/lib/hooks/useForm";
import projectOptions from "@/lib/options/project.options";
import { Role } from "@/lib/permissions";
import generateSlug from "@/lib/util/generateSlug";
import getQueryKeyPrefix from "@/lib/util/getQueryKeyPrefix";
import { cn } from "@/lib/utils";

const routeApi = getRouteApi(
  "/_auth/workspaces/$workspaceSlug/projects/$projectSlug/settings",
);

export default function ProjectGeneralForm() {
  const { workspaceSlug, projectSlug } = routeApi.useParams();
  const { projectId, organizationId } = routeApi.useLoaderData();
  const navigate = routeApi.useNavigate();

  const inputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);

  const role = useCurrentUserRole(organizationId);
  const isMember = role === Role.Member;

  const { data: project } = useSuspenseQuery({
    ...projectOptions({ rowId: projectId }),
    select: (data) => data?.project,
  });

  const { mutate: updateProject } = useUpdateProjectMutation({
    meta: {
      invalidates: [
        getQueryKeyPrefix(useProjectQuery),
        getQueryKeyPrefix(useProjectsQuery),
      ],
    },
    onSuccess: (_data, variables) => {
      if (variables.patch.slug && variables.patch.slug !== projectSlug) {
        navigate({
          to: "/workspaces/$workspaceSlug/projects/$projectSlug/settings",
          params: { workspaceSlug, projectSlug: variables.patch.slug },
          replace: true,
        });
      }
    },
  });

  const form = useForm({
    defaultValues: {
      name: project?.name ?? "",
      prefix: project?.prefix ?? "",
      description: project?.description ?? "",
    },
    onSubmit: async ({ value }) => {
      const editNameSchema = z
        .object({
          name: z
            .string()
            .min(3, { error: "Name must be at least 3 characters." }),
          currentSlug: z.string(),
        })
        .check(async (ctx) => {
          const sdk = await getSdk();
          const updatedSlug = generateSlug(ctx.value.name);

          if (!updatedSlug?.length || updatedSlug === ctx.value.currentSlug)
            return z.NEVER;

          const { projects } = await sdk.Projects({ organizationId });

          if (projects?.nodes?.some((p) => p.slug === updatedSlug)) {
            ctx.issues.push({
              code: "custom",
              message: "Project slug already exists for this workspace.",
              input: ctx.value.name,
            });
          }
        });

      const prefixSchema = z
        .string()
        .min(3, { error: "Prefix must be at least 3 characters." });

      const nameResult = await editNameSchema.safeParseAsync({
        name: value.name.trim(),
        currentSlug: project?.slug,
      });

      if (!nameResult.success) {
        setParseError(nameResult.error.issues[0].message);
        return;
      }

      const prefixResult = await prefixSchema.safeParseAsync(
        value.prefix.trim(),
      );

      if (!prefixResult.success) {
        setParseError(prefixResult.error.issues[0].message);
        return;
      }

      setParseError(null);
      updateProject({
        rowId: projectId,
        patch: {
          name: value.name.trim(),
          slug: generateSlug(value.name.trim()),
          prefix: value.prefix.trim(),
          description: value.description.trim() || null,
        },
      });

      setIsEditing(false);
    },
  });

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.setSelectionRange(
        inputRef.current.value.length,
        inputRef.current.value.length,
      );
    }
  }, [isEditing]);

  const handleCancel = () => {
    setIsEditing(false);
    setParseError(null);
    form.reset();
  };

  return (
    <div className="flex flex-col">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="flex flex-col divide-y"
      >
        <div className="flex h-10 items-center justify-between pb-1">
          <h2 className="ml-2 flex items-center gap-2 font-medium text-base-700 text-sm lg:ml-0 dark:text-base-300">
            General
          </h2>

          {!isMember && !isEditing && (
            <Tooltip
              positioning={{ placement: "left" }}
              tooltip="Edit project details"
              trigger={
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Edit project details"
                  className="mr-2 size-7"
                  onClick={() => setIsEditing(true)}
                >
                  <PenLineIcon className="size-4" />
                </Button>
              }
            />
          )}
          {isEditing && (
            <div className="flex items-center justify-between px-2 py-2">
              <div>
                {parseError && (
                  <p className="text-red-500 text-sm">{parseError}</p>
                )}
              </div>

              <form.Subscribe
                selector={(state) => [
                  state.canSubmit,
                  state.isSubmitting,
                  state.isDefaultValue,
                ]}
              >
                {([canSubmit, isSubmitting, isDefaultValue]) => (
                  <div className="ml-2 flex items-center justify-center gap-1">
                    <Tooltip
                      tooltip="Cancel"
                      trigger={
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleCancel}
                          disabled={isSubmitting}
                          className="size-7 hover:text-destructive focus-visible:ring-offset-0"
                        >
                          <XIcon className="size-4" />
                        </Button>
                      }
                    />
                    <Tooltip
                      tooltip="Save"
                      trigger={
                        <Button
                          type="submit"
                          variant="ghost"
                          size="icon"
                          disabled={
                            !canSubmit || isSubmitting || isDefaultValue
                          }
                          className="size-7 hover:text-green-500 focus-visible:ring-offset-0"
                        >
                          <CheckIcon className="size-4" />
                        </Button>
                      }
                    />
                  </div>
                )}
              </form.Subscribe>
            </div>
          )}
        </div>

        <div
          className={cn(
            "group flex h-10 w-full items-center",
            isEditing && "bg-accent",
          )}
        >
          <div className="flex w-24 shrink-0 items-center pl-2 lg:pl-0">
            <span className="text-base-500 text-sm">Name</span>
          </div>

          <div className="flex flex-1 items-center gap-2">
            <ProjectColorPicker />

            <form.Field name="name">
              {(field) => (
                <Input
                  ref={inputRef}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  disabled={!isEditing}
                  placeholder="Project name"
                  className="rounded border-0 shadow-none focus-visible:ring-offset-0 disabled:cursor-default disabled:opacity-100"
                  autoComplete="off"
                />
              )}
            </form.Field>
          </div>
        </div>

        <div
          className={cn(
            "group flex h-10 w-full items-center",
            isEditing && "bg-accent",
          )}
        >
          <div className="flex w-24 shrink-0 items-center pl-2 lg:pl-0">
            <span className="text-base-500 text-sm">Prefix</span>
          </div>

          <form.Field name="prefix">
            {(field) => (
              <Input
                value={field.state.value}
                onChange={(e) =>
                  field.handleChange(e.target.value.toUpperCase())
                }
                disabled={!isEditing}
                placeholder="PROJ"
                className="rounded border-0 font-mono shadow-none focus-visible:ring-offset-0 disabled:cursor-default disabled:opacity-100"
                autoComplete="off"
              />
            )}
          </form.Field>
        </div>

        <div
          className={cn(
            "group flex h-10 w-full items-center",
            isEditing && "bg-accent",
          )}
        >
          <div className="flex w-24 shrink-0 items-center pl-2 lg:pl-0">
            <span className="text-base-500 text-sm">Description</span>
          </div>

          <form.Field name="description">
            {(field) => (
              <Input
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                disabled={!isEditing}
                placeholder="Add a short description..."
                className="rounded border-0 shadow-none focus-visible:ring-offset-0 disabled:cursor-default disabled:opacity-100"
                autoComplete="off"
              />
            )}
          </form.Field>
        </div>
      </form>
    </div>
  );
}
