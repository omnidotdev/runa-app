import { parse } from "graphql";
import { GraphQLClient, gql } from "graphql-request";

import { API_GRAPHQL_URL } from "@/lib/config/env.config";

import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import type { Variables } from "graphql-request";

type FetchOptions = {
  /** Request cache setting. */
  cache?: RequestCache;
};

// Module-level token storage for client-side requests
let cachedAccessToken: string | null = null;

/**
 * Set the access token for GraphQL requests.
 * Called during SSR/hydration to pass the token to client-side code.
 */
export const setGraphQLAccessToken = (token: string | null | undefined) => {
  cachedAccessToken = token ?? null;
};

/**
 * Get the current access token.
 */
export const getGraphQLAccessToken = () => cachedAccessToken;

/**
 * GraphQL fetch wrapper. This is a wrapper around `graphql-request` that adds support for request options.
 * ! NB: this wrapper is not meant to be used directly. It is intended to be used by GraphQL Code Generator as a custom fetch implementation.
 */
export const graphqlFetch =
  <TData, TVariables>(
    query: string,
    variables?: TVariables,
    options?: (HeadersInit & FetchOptions) | FetchOptions,
  ) =>
  async (): Promise<TData> => {
    const { cache, ...restOptions } = options || {};

    const client = new GraphQLClient(API_GRAPHQL_URL!, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cachedAccessToken ?? ""}`,
        ...restOptions,
      },
      cache,
    });

    const document: TypedDocumentNode<TData, Variables> = parse(gql`${query}`);

    return client.request({
      document,
      variables: variables as Variables,
    });
  };
