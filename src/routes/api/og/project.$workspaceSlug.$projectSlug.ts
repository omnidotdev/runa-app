import { createFileRoute } from "@tanstack/react-router";
import { parse } from "graphql";
import { gql } from "graphql-request";

import { ProjectBySlugDocument } from "@/generated/graphql";
import { getGraphQLClient } from "@/lib/graphql/graphqlClientFactory";
import { renderOgImage, resolveOrganizationId } from "@/lib/og/renderOgImage";

import type {
  ProjectBySlugQuery,
  ProjectBySlugQueryVariables,
} from "@/generated/graphql";

const fetchProject = async (
  slug: string,
  organizationId: string,
): Promise<ProjectBySlugQuery["projectBySlugAndOrganizationId"] | null> => {
  try {
    const client = getGraphQLClient();
    const document = parse(gql`${ProjectBySlugDocument}`);
    const data = await client.request<ProjectBySlugQuery>(document, {
      slug,
      organizationId,
    } satisfies ProjectBySlugQueryVariables);
    return data.projectBySlugAndOrganizationId ?? null;
  } catch {
    return null;
  }
};

export const Route = createFileRoute(
  "/api/og/project/$workspaceSlug/$projectSlug",
)({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const { workspaceSlug, projectSlug } = params;

        const organizationId = await resolveOrganizationId(workspaceSlug);
        if (!organizationId) {
          return new Response("Not found", { status: 404 });
        }

        const project = await fetchProject(projectSlug, organizationId);
        if (!project) {
          return new Response("Not found", { status: 404 });
        }

        const imageBuffer = await renderOgImage({
          title: project.name,
          description: project.description,
          workspaceSlug,
          accent: project.color,
        });

        return new Response(imageBuffer as unknown as BodyInit, {
          headers: {
            "Content-Type": "image/png",
            "Cache-Control": "public, max-age=3600, s-maxage=86400",
          },
        });
      },
    },
  },
});
