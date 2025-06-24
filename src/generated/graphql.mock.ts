// @ts-nocheck
import * as Types from './generated';

import { graphql, type GraphQLResponseResolver, type RequestHandlerOptions } from 'msw'

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockCreateTaskMutation(
 *   ({ query, variables }) => {
 *     const { input } = variables;
 *     return HttpResponse.json({
 *       data: { createTask }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockCreateTaskMutation = (resolver: GraphQLResponseResolver<Types.CreateTaskMutation, Types.CreateTaskMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<Types.CreateTaskMutation, Types.CreateTaskMutationVariables>(
    'CreateTask',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockDeleteTaskMutation(
 *   ({ query, variables }) => {
 *     const { rowId } = variables;
 *     return HttpResponse.json({
 *       data: { deleteTask }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockDeleteTaskMutation = (resolver: GraphQLResponseResolver<Types.DeleteTaskMutation, Types.DeleteTaskMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<Types.DeleteTaskMutation, Types.DeleteTaskMutationVariables>(
    'DeleteTask',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockUpdateTaskMutation(
 *   ({ query, variables }) => {
 *     const { rowId, patch } = variables;
 *     return HttpResponse.json({
 *       data: { updateTask }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockUpdateTaskMutation = (resolver: GraphQLResponseResolver<Types.UpdateTaskMutation, Types.UpdateTaskMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<Types.UpdateTaskMutation, Types.UpdateTaskMutationVariables>(
    'UpdateTask',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockCreateWorkspaceMutation(
 *   ({ query, variables }) => {
 *     const { input } = variables;
 *     return HttpResponse.json({
 *       data: { createWorkspace }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockCreateWorkspaceMutation = (resolver: GraphQLResponseResolver<Types.CreateWorkspaceMutation, Types.CreateWorkspaceMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<Types.CreateWorkspaceMutation, Types.CreateWorkspaceMutationVariables>(
    'CreateWorkspace',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockDeleteWorkspaceMutation(
 *   ({ query, variables }) => {
 *     const { rowId } = variables;
 *     return HttpResponse.json({
 *       data: { deleteWorkspace }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockDeleteWorkspaceMutation = (resolver: GraphQLResponseResolver<Types.DeleteWorkspaceMutation, Types.DeleteWorkspaceMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<Types.DeleteWorkspaceMutation, Types.DeleteWorkspaceMutationVariables>(
    'DeleteWorkspace',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockProjectQuery(
 *   ({ query, variables }) => {
 *     const { rowId } = variables;
 *     return HttpResponse.json({
 *       data: { project }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockProjectQuery = (resolver: GraphQLResponseResolver<Types.ProjectQuery, Types.ProjectQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.ProjectQuery, Types.ProjectQueryVariables>(
    'Project',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockTasksQuery(
 *   ({ query, variables }) => {
 *     return HttpResponse.json({
 *       data: { tasks }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockTasksQuery = (resolver: GraphQLResponseResolver<Types.TasksQuery, Types.TasksQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.TasksQuery, Types.TasksQueryVariables>(
    'Tasks',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockWorkspaceQuery(
 *   ({ query, variables }) => {
 *     const { rowId } = variables;
 *     return HttpResponse.json({
 *       data: { workspace }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockWorkspaceQuery = (resolver: GraphQLResponseResolver<Types.WorkspaceQuery, Types.WorkspaceQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.WorkspaceQuery, Types.WorkspaceQueryVariables>(
    'Workspace',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockWorkspacesQuery(
 *   ({ query, variables }) => {
 *     return HttpResponse.json({
 *       data: { workspaces }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockWorkspacesQuery = (resolver: GraphQLResponseResolver<Types.WorkspacesQuery, Types.WorkspacesQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.WorkspacesQuery, Types.WorkspacesQueryVariables>(
    'Workspaces',
    resolver,
    options
  )
