import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { parse } from "graphql";
import { GraphQLClient, gql } from "graphql-request";
import { z } from "zod";

import { getAuth } from "@/lib/auth/getAuth";
import { API_GRAPHQL_URL } from "@/lib/config/env.config";

import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import type { Variables } from "graphql-request";

type FetchOptions = {
  /** Request cache setting. */
  cache?: RequestCache;
};

const graphqlInputSchema = z.object({
  query: z.string(),
  variables: z.unknown().optional(),
});

/**
 * Server function that executes GraphQL requests with authentication.
 * Runs entirely on the server to avoid client-side RPC deserialization issues.
 */
export const executeGraphQL = createServerFn({ method: "POST" })
  .inputValidator((data) => graphqlInputSchema.parse(data))
  // @ts-expect-error - TanStack Start types are complex, but this pattern works (same as organizations.ts)
  .handler(async ({ data }) => {
    const request = getRequest();
    const session = await getAuth(request);

    const client = new GraphQLClient(API_GRAPHQL_URL!, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.accessToken ?? ""}`,
      },
    });

    const document: TypedDocumentNode<unknown, Variables> = parse(
      gql`${data.query}`,
    );

    return client.request({
      document,
      variables: data.variables as Variables,
    });
  });

/**
 * GraphQL fetch wrapper. This is a wrapper around `graphql-request` that adds support for request options.
 * ! NB: this wrapper is not meant to be used directly. It is intended to be used by GraphQL Code Generator as a custom fetch implementation.
 */
export const graphqlFetch =
  <TData, TVariables>(
    query: string,
    variables?: TVariables,
    _options?: (HeadersInit & FetchOptions) | FetchOptions,
  ) =>
  async (): Promise<TData> => {
    const result = await executeGraphQL({ data: { query, variables } });

    return result as TData;
  };
