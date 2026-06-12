import { createFileRoute } from "@tanstack/react-router";
import { parse } from "graphql";
import { gql } from "graphql-request";

import { getGraphQLClient } from "@/lib/graphql/graphqlClientFactory";
import { renderOgImage, resolveOrganizationId } from "@/lib/og/renderOgImage";
import { buildTaskDisplayKey, stripMarkup } from "@/lib/util/taskUrl";

type OgTask = {
  number: number;
  content?: string | null;
  description?: string | null;
  column?: { title?: string | null } | null;
};

type OgTaskProject = {
  name: string;
  color?: string | null;
  prefix?: string | null;
  tasks: { nodes: OgTask[] };
};

const OG_TASK_QUERY = `
  query OgTask($slug: String!, $organizationId: String!, $number: Int!) {
    projectBySlugAndOrganizationId(slug: $slug, organizationId: $organizationId) {
      name
      color
      prefix
      tasks(condition: { number: $number }, first: 1) {
        nodes {
          number
          content
          description
          column {
            title
          }
        }
      }
    }
  }
`;

const fetchTask = async (
  slug: string,
  organizationId: string,
  number: number,
): Promise<{ project: OgTaskProject; task: OgTask } | null> => {
  try {
    const client = getGraphQLClient();
    const document = parse(gql`${OG_TASK_QUERY}`);
    const data = await client.request<{
      projectBySlugAndOrganizationId?: OgTaskProject | null;
    }>(document, { slug, organizationId, number });
    const project = data.projectBySlugAndOrganizationId;
    const task = project?.tasks.nodes[0];
    if (!project || !task) return null;
    return { project, task };
  } catch {
    return null;
  }
};

export const Route = createFileRoute(
  "/api/og/task/$workspaceSlug/$projectSlug/$number",
)({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const { workspaceSlug, projectSlug, number: numberParam } = params;

        const number = Number(numberParam);
        if (!Number.isInteger(number)) {
          return new Response("Not found", { status: 404 });
        }

        const organizationId = await resolveOrganizationId(workspaceSlug);
        if (!organizationId) {
          return new Response("Not found", { status: 404 });
        }

        const result = await fetchTask(projectSlug, organizationId, number);
        if (!result) {
          return new Response("Not found", { status: 404 });
        }

        const { project, task } = result;
        const key = buildTaskDisplayKey({
          prefix: project.prefix,
          number: task.number,
        });
        const column = task.column?.title;
        const eyebrow = column ? `${key} · ${column}` : key;
        const title = task.content ? stripMarkup(task.content) : "Task";

        const imageBuffer = await renderOgImage({
          title: title || "Task",
          description: task.description ? stripMarkup(task.description) : null,
          workspaceSlug,
          eyebrow,
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
