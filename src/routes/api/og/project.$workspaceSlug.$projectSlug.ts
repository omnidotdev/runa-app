import { createFileRoute } from "@tanstack/react-router";
import { parse } from "graphql";
import { gql } from "graphql-request";
import satori from "satori";
import sharp from "sharp";

import { ProjectBySlugDocument } from "@/generated/graphql";
import { AUTH_BASE_URL } from "@/lib/config/env.config";
import { getGraphQLClient } from "@/lib/graphql/graphqlClientFactory";

import type { ReactNode } from "react";
import type {
  ProjectBySlugQuery,
  ProjectBySlugQueryVariables,
} from "@/generated/graphql";

const WIDTH = 1200;
const HEIGHT = 630;
const DEFAULT_ACCENT = "#F59E0B";

let fontCache: ArrayBuffer | null = null;

const fetchFont = async (): Promise<ArrayBuffer> => {
  if (fontCache) return fontCache;

  const response = await fetch(
    "https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-700-normal.woff",
  );
  fontCache = await response.arrayBuffer();

  return fontCache;
};

const resolveOrganizationId = async (slug: string): Promise<string | null> => {
  try {
    const response = await fetch(
      `${AUTH_BASE_URL}/api/organization/by-slug/${encodeURIComponent(slug)}`,
    );
    if (!response.ok) return null;
    const org = await response.json();
    return org?.id ?? null;
  } catch {
    return null;
  }
};

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

const renderOgImage = async (
  project: NonNullable<ProjectBySlugQuery["projectBySlugAndOrganizationId"]>,
  workspaceSlug: string,
): Promise<Uint8Array> => {
  const fontData = await fetchFont();
  const accent = project.color || DEFAULT_ACCENT;

  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 80px",
          background:
            "linear-gradient(145deg, #0a0a0a 0%, #141414 50%, #0a0a0a 100%)",
          fontFamily: "Inter",
          color: "#ffffff",
        },
        children: [
          // Top: workspace badge
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                alignItems: "center",
                gap: "12px",
              },
              children: [
                {
                  type: "div",
                  props: {
                    style: {
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      backgroundColor: accent,
                    },
                  },
                },
                {
                  type: "span",
                  props: {
                    style: {
                      fontSize: "20px",
                      color: "#a0a0a0",
                      letterSpacing: "0.05em",
                    },
                    children: workspaceSlug,
                  },
                },
              ],
            },
          },
          // Middle: project name + description
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                flex: 1,
                justifyContent: "center",
              },
              children: [
                {
                  type: "div",
                  props: {
                    style: {
                      fontSize: "72px",
                      fontWeight: 700,
                      color: accent,
                      lineHeight: 1.1,
                      letterSpacing: "-0.02em",
                    },
                    children:
                      project.name.length > 30
                        ? `${project.name.slice(0, 30)}...`
                        : project.name,
                  },
                },
                ...(project.description
                  ? [
                      {
                        type: "div",
                        props: {
                          style: {
                            fontSize: "28px",
                            color: "#a0a0a0",
                            lineHeight: 1.4,
                          },
                          children:
                            project.description.length > 100
                              ? `${project.description.slice(0, 100)}...`
                              : project.description,
                        },
                      },
                    ]
                  : []),
              ],
            },
          },
          // Bottom: Runa branding
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              },
              children: [
                {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    },
                    children: [
                      {
                        type: "span",
                        props: {
                          style: { fontSize: "28px" },
                          children: "\uD83C\uDF19",
                        },
                      },
                      {
                        type: "span",
                        props: {
                          style: {
                            fontSize: "24px",
                            fontWeight: 700,
                            color: "#ffffff",
                          },
                          children: "Runa",
                        },
                      },
                      {
                        type: "span",
                        props: {
                          style: {
                            fontSize: "20px",
                            color: "#666666",
                          },
                          children: "by Omni",
                        },
                      },
                    ],
                  },
                },
                {
                  type: "span",
                  props: {
                    style: {
                      fontSize: "18px",
                      color: "#666666",
                    },
                    children: "runa.omni.dev",
                  },
                },
              ],
            },
          },
        ],
      },
    } as ReactNode,
    {
      width: WIDTH,
      height: HEIGHT,
      fonts: [
        {
          name: "Inter",
          data: fontData,
          weight: 700,
          style: "normal",
        },
      ],
    },
  );

  const buffer = await sharp(Buffer.from(svg)).png().toBuffer();

  return new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
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

        const imageBuffer = await renderOgImage(project, workspaceSlug);

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
