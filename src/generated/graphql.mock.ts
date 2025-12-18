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
 * mockDeleteColumnMutation(
 *   ({ query, variables }) => {
 *     const { rowId } = variables;
 *     return HttpResponse.json({
 *       data: { deleteColumn }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockDeleteColumnMutation = (resolver: GraphQLResponseResolver<Types.DeleteColumnMutation, Types.DeleteColumnMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<Types.DeleteColumnMutation, Types.DeleteColumnMutationVariables>(
    'DeleteColumn',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockUpdateColumnMutation(
 *   ({ query, variables }) => {
 *     const { rowId, patch } = variables;
 *     return HttpResponse.json({
 *       data: { updateColumn }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockUpdateColumnMutation = (resolver: GraphQLResponseResolver<Types.UpdateColumnMutation, Types.UpdateColumnMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<Types.UpdateColumnMutation, Types.UpdateColumnMutationVariables>(
    'UpdateColumn',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockCreatePostEmojiMutation(
 *   ({ query, variables }) => {
 *     const { input } = variables;
 *     return HttpResponse.json({
 *       data: { createEmoji }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockCreatePostEmojiMutation = (resolver: GraphQLResponseResolver<Types.CreatePostEmojiMutation, Types.CreatePostEmojiMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<Types.CreatePostEmojiMutation, Types.CreatePostEmojiMutationVariables>(
    'CreatePostEmoji',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockDeletePostEmojiMutation(
 *   ({ query, variables }) => {
 *     const { rowId } = variables;
 *     return HttpResponse.json({
 *       data: { deleteEmoji }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockDeletePostEmojiMutation = (resolver: GraphQLResponseResolver<Types.DeletePostEmojiMutation, Types.DeletePostEmojiMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<Types.DeletePostEmojiMutation, Types.DeletePostEmojiMutationVariables>(
    'DeletePostEmoji',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockUpdatePostEmojiMutation(
 *   ({ query, variables }) => {
 *     const { input } = variables;
 *     return HttpResponse.json({
 *       data: { updateEmoji }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockUpdatePostEmojiMutation = (resolver: GraphQLResponseResolver<Types.UpdatePostEmojiMutation, Types.UpdatePostEmojiMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<Types.UpdatePostEmojiMutation, Types.UpdatePostEmojiMutationVariables>(
    'UpdatePostEmoji',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockCreateInvitationMutation(
 *   ({ query, variables }) => {
 *     const { input } = variables;
 *     return HttpResponse.json({
 *       data: { createInvitation }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockCreateInvitationMutation = (resolver: GraphQLResponseResolver<Types.CreateInvitationMutation, Types.CreateInvitationMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<Types.CreateInvitationMutation, Types.CreateInvitationMutationVariables>(
    'CreateInvitation',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockDeleteInvitationMutation(
 *   ({ query, variables }) => {
 *     const { rowId } = variables;
 *     return HttpResponse.json({
 *       data: { deleteInvitation }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockDeleteInvitationMutation = (resolver: GraphQLResponseResolver<Types.DeleteInvitationMutation, Types.DeleteInvitationMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<Types.DeleteInvitationMutation, Types.DeleteInvitationMutationVariables>(
    'DeleteInvitation',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockCreateLabelMutation(
 *   ({ query, variables }) => {
 *     const { input } = variables;
 *     return HttpResponse.json({
 *       data: { createLabel }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockCreateLabelMutation = (resolver: GraphQLResponseResolver<Types.CreateLabelMutation, Types.CreateLabelMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<Types.CreateLabelMutation, Types.CreateLabelMutationVariables>(
    'CreateLabel',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockDeleteLabelMutation(
 *   ({ query, variables }) => {
 *     const { rowId } = variables;
 *     return HttpResponse.json({
 *       data: { deleteLabel }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockDeleteLabelMutation = (resolver: GraphQLResponseResolver<Types.DeleteLabelMutation, Types.DeleteLabelMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<Types.DeleteLabelMutation, Types.DeleteLabelMutationVariables>(
    'DeleteLabel',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockUpdateLabelMutation(
 *   ({ query, variables }) => {
 *     const { rowId, patch } = variables;
 *     return HttpResponse.json({
 *       data: { updateLabel }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockUpdateLabelMutation = (resolver: GraphQLResponseResolver<Types.UpdateLabelMutation, Types.UpdateLabelMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<Types.UpdateLabelMutation, Types.UpdateLabelMutationVariables>(
    'UpdateLabel',
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
 * mockDeletePostMutation(
 *   ({ query, variables }) => {
 *     const { rowId } = variables;
 *     return HttpResponse.json({
 *       data: { deletePost }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockDeletePostMutation = (resolver: GraphQLResponseResolver<Types.DeletePostMutation, Types.DeletePostMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<Types.DeletePostMutation, Types.DeletePostMutationVariables>(
    'DeletePost',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockUpdatePostMutation(
 *   ({ query, variables }) => {
 *     const { input } = variables;
 *     return HttpResponse.json({
 *       data: { updatePost }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockUpdatePostMutation = (resolver: GraphQLResponseResolver<Types.UpdatePostMutation, Types.UpdatePostMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<Types.UpdatePostMutation, Types.UpdatePostMutationVariables>(
    'UpdatePost',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockCreateProjectColumnMutation(
 *   ({ query, variables }) => {
 *     const { input } = variables;
 *     return HttpResponse.json({
 *       data: { createProjectColumn }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockCreateProjectColumnMutation = (resolver: GraphQLResponseResolver<Types.CreateProjectColumnMutation, Types.CreateProjectColumnMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<Types.CreateProjectColumnMutation, Types.CreateProjectColumnMutationVariables>(
    'CreateProjectColumn',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockDeleteProjectColumnMutation(
 *   ({ query, variables }) => {
 *     const { rowId } = variables;
 *     return HttpResponse.json({
 *       data: { deleteProjectColumn }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockDeleteProjectColumnMutation = (resolver: GraphQLResponseResolver<Types.DeleteProjectColumnMutation, Types.DeleteProjectColumnMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<Types.DeleteProjectColumnMutation, Types.DeleteProjectColumnMutationVariables>(
    'DeleteProjectColumn',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockUpdateProjectColumnMutation(
 *   ({ query, variables }) => {
 *     const { rowId, patch } = variables;
 *     return HttpResponse.json({
 *       data: { updateProjectColumn }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockUpdateProjectColumnMutation = (resolver: GraphQLResponseResolver<Types.UpdateProjectColumnMutation, Types.UpdateProjectColumnMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<Types.UpdateProjectColumnMutation, Types.UpdateProjectColumnMutationVariables>(
    'UpdateProjectColumn',
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
 * mockCreateTaskLabelMutation(
 *   ({ query, variables }) => {
 *     const { input } = variables;
 *     return HttpResponse.json({
 *       data: { createTaskLabel }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockCreateTaskLabelMutation = (resolver: GraphQLResponseResolver<Types.CreateTaskLabelMutation, Types.CreateTaskLabelMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<Types.CreateTaskLabelMutation, Types.CreateTaskLabelMutationVariables>(
    'CreateTaskLabel',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockDeleteTaskLabelMutation(
 *   ({ query, variables }) => {
 *     const { rowId } = variables;
 *     return HttpResponse.json({
 *       data: { deleteTaskLabel }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockDeleteTaskLabelMutation = (resolver: GraphQLResponseResolver<Types.DeleteTaskLabelMutation, Types.DeleteTaskLabelMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<Types.DeleteTaskLabelMutation, Types.DeleteTaskLabelMutationVariables>(
    'DeleteTaskLabel',
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
 * mockCreateUserPreferenceMutation(
 *   ({ query, variables }) => {
 *     const { input } = variables;
 *     return HttpResponse.json({
 *       data: { createUserPreference }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockCreateUserPreferenceMutation = (resolver: GraphQLResponseResolver<Types.CreateUserPreferenceMutation, Types.CreateUserPreferenceMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<Types.CreateUserPreferenceMutation, Types.CreateUserPreferenceMutationVariables>(
    'CreateUserPreference',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockUpdateUserPreferenceMutation(
 *   ({ query, variables }) => {
 *     const { rowId, patch } = variables;
 *     return HttpResponse.json({
 *       data: { updateUserPreference }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockUpdateUserPreferenceMutation = (resolver: GraphQLResponseResolver<Types.UpdateUserPreferenceMutation, Types.UpdateUserPreferenceMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<Types.UpdateUserPreferenceMutation, Types.UpdateUserPreferenceMutationVariables>(
    'UpdateUserPreference',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockDeleteUserMutation(
 *   ({ query, variables }) => {
 *     const { id } = variables;
 *     return HttpResponse.json({
 *       data: { deleteUser }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockDeleteUserMutation = (resolver: GraphQLResponseResolver<Types.DeleteUserMutation, Types.DeleteUserMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<Types.DeleteUserMutation, Types.DeleteUserMutationVariables>(
    'DeleteUser',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockCreateWorkspaceUserMutation(
 *   ({ query, variables }) => {
 *     const { input } = variables;
 *     return HttpResponse.json({
 *       data: { createWorkspaceUser }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockCreateWorkspaceUserMutation = (resolver: GraphQLResponseResolver<Types.CreateWorkspaceUserMutation, Types.CreateWorkspaceUserMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<Types.CreateWorkspaceUserMutation, Types.CreateWorkspaceUserMutationVariables>(
    'CreateWorkspaceUser',
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
 * mockUpdateWorkspaceUserMutation(
 *   ({ query, variables }) => {
 *     const { input } = variables;
 *     return HttpResponse.json({
 *       data: { updateWorkspaceUser }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockUpdateWorkspaceUserMutation = (resolver: GraphQLResponseResolver<Types.UpdateWorkspaceUserMutation, Types.UpdateWorkspaceUserMutationVariables>, options?: RequestHandlerOptions) =>
  graphql.mutation<Types.UpdateWorkspaceUserMutation, Types.UpdateWorkspaceUserMutationVariables>(
    'UpdateWorkspaceUser',
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
 * mockColumnQuery(
 *   ({ query, variables }) => {
 *     const { columnId } = variables;
 *     return HttpResponse.json({
 *       data: { column }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockColumnQuery = (resolver: GraphQLResponseResolver<Types.ColumnQuery, Types.ColumnQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.ColumnQuery, Types.ColumnQueryVariables>(
    'Column',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockColumnsQuery(
 *   ({ query, variables }) => {
 *     const { projectId } = variables;
 *     return HttpResponse.json({
 *       data: { columns }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockColumnsQuery = (resolver: GraphQLResponseResolver<Types.ColumnsQuery, Types.ColumnsQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.ColumnsQuery, Types.ColumnsQueryVariables>(
    'Columns',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockPostEmojisQuery(
 *   ({ query, variables }) => {
 *     const { postId, userId } = variables;
 *     return HttpResponse.json({
 *       data: { emojis, users }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockPostEmojisQuery = (resolver: GraphQLResponseResolver<Types.PostEmojisQuery, Types.PostEmojisQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.PostEmojisQuery, Types.PostEmojisQueryVariables>(
    'PostEmojis',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockUserEmojisQuery(
 *   ({ query, variables }) => {
 *     const { postId, userId } = variables;
 *     return HttpResponse.json({
 *       data: { emojis }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockUserEmojisQuery = (resolver: GraphQLResponseResolver<Types.UserEmojisQuery, Types.UserEmojisQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.UserEmojisQuery, Types.UserEmojisQueryVariables>(
    'UserEmojis',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockInvitationsQuery(
 *   ({ query, variables }) => {
 *     const { email } = variables;
 *     return HttpResponse.json({
 *       data: { invitations }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockInvitationsQuery = (resolver: GraphQLResponseResolver<Types.InvitationsQuery, Types.InvitationsQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.InvitationsQuery, Types.InvitationsQueryVariables>(
    'Invitations',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockLabelsQuery(
 *   ({ query, variables }) => {
 *     const { projectId } = variables;
 *     return HttpResponse.json({
 *       data: { labels }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockLabelsQuery = (resolver: GraphQLResponseResolver<Types.LabelsQuery, Types.LabelsQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.LabelsQuery, Types.LabelsQueryVariables>(
    'Labels',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockProjectColumnsQuery(
 *   ({ query, variables }) => {
 *     const { workspaceId, search } = variables;
 *     return HttpResponse.json({
 *       data: { projectColumns }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockProjectColumnsQuery = (resolver: GraphQLResponseResolver<Types.ProjectColumnsQuery, Types.ProjectColumnsQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.ProjectColumnsQuery, Types.ProjectColumnsQueryVariables>(
    'ProjectColumns',
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
 *     const { projectId, search, assignees, labels, priorities } = variables;
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
 * mockUserPreferencesQuery(
 *   ({ query, variables }) => {
 *     const { userId, projectId } = variables;
 *     return HttpResponse.json({
 *       data: { userPreferenceByUserIdAndProjectId }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockUserPreferencesQuery = (resolver: GraphQLResponseResolver<Types.UserPreferencesQuery, Types.UserPreferencesQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.UserPreferencesQuery, Types.UserPreferencesQueryVariables>(
    'UserPreferences',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockUserQuery(
 *   ({ query, variables }) => {
 *     const { userId } = variables;
 *     return HttpResponse.json({
 *       data: { user }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockUserQuery = (resolver: GraphQLResponseResolver<Types.UserQuery, Types.UserQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.UserQuery, Types.UserQueryVariables>(
    'User',
    resolver,
    options
  )

/**
 * @param resolver A function that accepts [resolver arguments](https://mswjs.io/docs/api/graphql#resolver-argument) and must always return the instruction on what to do with the intercepted request. ([see more](https://mswjs.io/docs/concepts/response-resolver#resolver-instructions))
 * @param options Options object to customize the behavior of the mock. ([see more](https://mswjs.io/docs/api/graphql#handler-options))
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockUserByIdentityProviderIdQuery(
 *   ({ query, variables }) => {
 *     const { identityProviderId } = variables;
 *     return HttpResponse.json({
 *       data: { userByIdentityProviderId }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockUserByIdentityProviderIdQuery = (resolver: GraphQLResponseResolver<Types.UserByIdentityProviderIdQuery, Types.UserByIdentityProviderIdQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.UserByIdentityProviderIdQuery, Types.UserByIdentityProviderIdQueryVariables>(
    'UserByIdentityProviderId',
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
 *     const { workspaceId, filter, orderBy } = variables;
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
 * mockWorkspaceQuery(
 *   ({ query, variables }) => {
 *     const { rowId, userId } = variables;
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
 * mockWorkspaceBySlugQuery(
 *   ({ query, variables }) => {
 *     const { slug, projectSlug } = variables;
 *     return HttpResponse.json({
 *       data: { workspaceBySlug }
 *     })
 *   },
 *   requestOptions
 * )
 */
export const mockWorkspaceBySlugQuery = (resolver: GraphQLResponseResolver<Types.WorkspaceBySlugQuery, Types.WorkspaceBySlugQueryVariables>, options?: RequestHandlerOptions) =>
  graphql.query<Types.WorkspaceBySlugQuery, Types.WorkspaceBySlugQueryVariables>(
    'WorkspaceBySlug',
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
 *     const { userId, limit } = variables;
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
