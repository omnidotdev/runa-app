// @ts-nocheck
import * as Types from './generated';

import { graphql, type GraphQLResponseResolver, type RequestHandlerOptions } from 'msw'

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockCreateAssigneeMutation(
 *   ({ query, variables }) => {
 *     const { input } = variables;
 *     return HttpResponse.json({
 *       data: { createAssignee }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockCreateAssigneeMutation = (resolver: GraphQLResponseResolver<Types.CreateAssigneeMutation, Types.CreateAssigneeMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<Types.CreateAssigneeMutation, Types.CreateAssigneeMutationVariables>(
    'CreateAssignee',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockDeleteAssigneeMutation(
 *   ({ query, variables }) => {
 *     const { rowId } = variables;
 *     return HttpResponse.json({
 *       data: { deleteAssignee }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockDeleteAssigneeMutation = (resolver: GraphQLResponseResolver<Types.DeleteAssigneeMutation, Types.DeleteAssigneeMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<Types.DeleteAssigneeMutation, Types.DeleteAssigneeMutationVariables>(
    'DeleteAssignee',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockCreateColumnMutation(
 *   ({ query, variables }) => {
 *     const { input } = variables;
 *     return HttpResponse.json({
 *       data: { createColumn }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockCreateColumnMutation = (resolver: GraphQLResponseResolver<Types.CreateColumnMutation, Types.CreateColumnMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<Types.CreateColumnMutation, Types.CreateColumnMutationVariables>(
    'CreateColumn',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockCreatePostMutation(
 *   ({ query, variables }) => {
 *     const { input } = variables;
 *     return HttpResponse.json({
 *       data: { createPost }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockCreatePostMutation = (resolver: GraphQLResponseResolver<Types.CreatePostMutation, Types.CreatePostMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<Types.CreatePostMutation, Types.CreatePostMutationVariables>(
    'CreatePost',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockCreateProjectMutation(
 *   ({ query, variables }) => {
 *     const { input } = variables;
 *     return HttpResponse.json({
 *       data: { createProject }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockCreateProjectMutation = (resolver: GraphQLResponseResolver<Types.CreateProjectMutation, Types.CreateProjectMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<Types.CreateProjectMutation, Types.CreateProjectMutationVariables>(
    'CreateProject',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockDeleteProjectMutation(
 *   ({ query, variables }) => {
 *     const { rowId } = variables;
 *     return HttpResponse.json({
 *       data: { deleteProject }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockDeleteProjectMutation = (resolver: GraphQLResponseResolver<Types.DeleteProjectMutation, Types.DeleteProjectMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<Types.DeleteProjectMutation, Types.DeleteProjectMutationVariables>(
    'DeleteProject',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockUpdateProjectMutation(
 *   ({ query, variables }) => {
 *     const { rowId, patch } = variables;
 *     return HttpResponse.json({
 *       data: { updateProject }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockUpdateProjectMutation = (resolver: GraphQLResponseResolver<Types.UpdateProjectMutation, Types.UpdateProjectMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<Types.UpdateProjectMutation, Types.UpdateProjectMutationVariables>(
    'UpdateProject',
    resolver,
    options
  )

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
 * mockDeleteWorkspaceUserMutation(
 *   ({ query, variables }) => {
 *     const { userId, workspaceId } = variables;
 *     return HttpResponse.json({
 *       data: { deleteWorkspaceUser }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockDeleteWorkspaceUserMutation = (resolver: GraphQLResponseResolver<Types.DeleteWorkspaceUserMutation, Types.DeleteWorkspaceUserMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<Types.DeleteWorkspaceUserMutation, Types.DeleteWorkspaceUserMutationVariables>(
    'DeleteWorkspaceUser',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockUpdateWorkspaceMutation(
 *   ({ query, variables }) => {
 *     const { rowId, patch } = variables;
 *     return HttpResponse.json({
 *       data: { updateWorkspace }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockUpdateWorkspaceMutation = (resolver: GraphQLResponseResolver<Types.UpdateWorkspaceMutation, Types.UpdateWorkspaceMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<Types.UpdateWorkspaceMutation, Types.UpdateWorkspaceMutationVariables>(
    'UpdateWorkspace',
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
 * mockProjectsQuery(
 *   ({ query, variables }) => {
 *     const { workspaceId, search } = variables;
 *     return HttpResponse.json({
 *       data: { projects }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockProjectsQuery = (resolver: GraphQLResponseResolver<Types.ProjectsQuery, Types.ProjectsQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.ProjectsQuery, Types.ProjectsQueryVariables>(
    'Projects',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockTaskQuery(
 *   ({ query, variables }) => {
 *     const { rowId } = variables;
 *     return HttpResponse.json({
 *       data: { task }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockTaskQuery = (resolver: GraphQLResponseResolver<Types.TaskQuery, Types.TaskQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.TaskQuery, Types.TaskQueryVariables>(
    'Task',
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
 *     const { projectId, search } = variables;
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
 * mockWorkspaceUsersQuery(
 *   ({ query, variables }) => {
 *     const { rowId } = variables;
 *     return HttpResponse.json({
 *       data: { workspaceUsers }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockWorkspaceUsersQuery = (resolver: GraphQLResponseResolver<Types.WorkspaceUsersQuery, Types.WorkspaceUsersQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.WorkspaceUsersQuery, Types.WorkspaceUsersQueryVariables>(
    'WorkspaceUsers',
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
 *     const { limit } = variables;
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
