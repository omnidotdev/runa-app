import { parse } from "graphql";
import { gql } from "graphql-request";

import {
  getCurrentAuthHeaders,
  getGraphQLClient,
} from "@/lib/graphql/graphqlClientFactory";

import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import type { Variables } from "graphql-request";

type FetchOptions = {
  /** Request cache setting. */
  cache?: RequestCache;
};

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
    const client = getGraphQLClient();
    const document: TypedDocumentNode<TData, Variables> = parse(gql`${query}`);

    return client.request({
      document,
      variables: variables as Variables,
      requestHeaders: {
        ...getCurrentAuthHeaders(),
        ...restOptions,
      },
    });
  };
