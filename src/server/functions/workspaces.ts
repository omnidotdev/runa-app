import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { Role } from "@/generated/graphql";
import getSdk from "@/lib/graphql/getSdk";
import { authMiddleware } from "@/server/middleware";

const DEFAULT_PROJECT_COLUMNS = [
  { title: "Planned", index: 0, emoji: "🗓" },
  { title: "In Progress", index: 1, emoji: "🚧" },
  { title: "Completed", index: 2, emoji: "✅" },
];

const provisionWorkspaceSchema = z.object({
  organizationId: z.string().uuid(),
});

/**
 * Auto-provision a workspace for an organization.
 * Creates workspace, owner membership, and default project columns.
 * This is idempotent - if workspace already exists, returns the existing one.
 */
export const provisionWorkspace = createServerFn({ method: "POST" })
  .inputValidator((data) => provisionWorkspaceSchema.parse(data))
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    const sdk = await getSdk();

    // Check if workspace already exists for this org
    const { workspaceByOrganizationId: existingWorkspace } =
      await sdk.WorkspaceByOrganizationId({
        organizationId: data.organizationId,
      });

    if (existingWorkspace) {
      return {
        workspace: existingWorkspace,
        created: false,
      };
    }

    // Create workspace
    const { createWorkspace } = await sdk.CreateWorkspace({
      input: {
        workspace: {
          organizationId: data.organizationId,
        },
      },
    });

    const workspaceId = createWorkspace?.workspace?.rowId;
    if (!workspaceId) {
      throw new Error("Failed to create workspace");
    }

    // Create owner membership
    await sdk.CreateMember({
      input: {
        member: {
          userId: context.session.user.rowId!,
          workspaceId,
          role: Role.Owner,
        },
      },
    });

    // Create default project columns
    await Promise.all(
      DEFAULT_PROJECT_COLUMNS.map((column) =>
        sdk.CreateProjectColumn({
          input: {
            projectColumn: {
              ...column,
              workspaceId,
            },
          },
        }),
      ),
    );

    return {
      workspace: createWorkspace?.workspace,
      created: true,
    };
  });
