// @ts-nocheck
import { GraphQLClient, RequestOptions } from 'graphql-request';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
type GraphQLClientRequestHeaders = RequestOptions['requestHeaders'];
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Cursor: { input: string; output: string; }
  Datetime: { input: Date; output: Date; }
  JSON: { input: any; output: any; }
  UUID: { input: string; output: string; }
};

export type Assignee = Node & {
  __typename?: 'Assignee';
  createdAt?: Maybe<Scalars['Datetime']['output']>;
  deletedAt?: Maybe<Scalars['Datetime']['output']>;
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  id: Scalars['ID']['output'];
  rowId: Scalars['UUID']['output'];
  /** Reads a single `Task` that is related to this `Assignee`. */
  task?: Maybe<Task>;
  taskId: Scalars['UUID']['output'];
  updatedAt?: Maybe<Scalars['Datetime']['output']>;
  /** Reads a single `User` that is related to this `Assignee`. */
  user?: Maybe<User>;
  userId: Scalars['UUID']['output'];
};

/**
 * A condition to be used against `Assignee` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type AssigneeCondition = {
  /** Checks for equality with the object’s `rowId` field. */
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `taskId` field. */
  taskId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `userId` field. */
  userId?: InputMaybe<Scalars['UUID']['input']>;
};

/** A connection to a list of `Assignee` values. */
export type AssigneeConnection = {
  __typename?: 'AssigneeConnection';
  /** A list of edges which contains the `Assignee` and cursor to aid in pagination. */
  edges: Array<Maybe<AssigneeEdge>>;
  /** A list of `Assignee` objects. */
  nodes: Array<Maybe<Assignee>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Assignee` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `Assignee` edge in the connection. */
export type AssigneeEdge = {
  __typename?: 'AssigneeEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Assignee` at the end of the edge. */
  node?: Maybe<Assignee>;
};

/** A filter to be used against `Assignee` object types. All fields are combined with a logical ‘and.’ */
export type AssigneeFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<AssigneeFilter>>;
  /** Negates the expression. */
  not?: InputMaybe<AssigneeFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<AssigneeFilter>>;
  /** Filter by the object’s `rowId` field. */
  rowId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `task` relation. */
  task?: InputMaybe<TaskFilter>;
  /** Filter by the object’s `taskId` field. */
  taskId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `user` relation. */
  user?: InputMaybe<UserFilter>;
  /** Filter by the object’s `userId` field. */
  userId?: InputMaybe<UuidFilter>;
};

/** An input for mutations affecting `Assignee` */
export type AssigneeInput = {
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  deletedAt?: InputMaybe<Scalars['Datetime']['input']>;
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  taskId: Scalars['UUID']['input'];
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
  userId: Scalars['UUID']['input'];
};

/** Methods to use when ordering `Assignee`. */
export enum AssigneeOrderBy {
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  RowIdAsc = 'ROW_ID_ASC',
  RowIdDesc = 'ROW_ID_DESC',
  TaskIdAsc = 'TASK_ID_ASC',
  TaskIdDesc = 'TASK_ID_DESC',
  UserIdAsc = 'USER_ID_ASC',
  UserIdDesc = 'USER_ID_DESC'
}

/** Represents an update to a `Assignee`. Fields that are set will be updated. */
export type AssigneePatch = {
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  deletedAt?: InputMaybe<Scalars['Datetime']['input']>;
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  taskId?: InputMaybe<Scalars['UUID']['input']>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
  userId?: InputMaybe<Scalars['UUID']['input']>;
};

export type Column = Node & {
  __typename?: 'Column';
  createdAt?: Maybe<Scalars['Datetime']['output']>;
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  id: Scalars['ID']['output'];
  /** Reads a single `Project` that is related to this `Column`. */
  project?: Maybe<Project>;
  projectId: Scalars['UUID']['output'];
  rowId: Scalars['UUID']['output'];
  /** Reads and enables pagination through a set of `Task`. */
  tasks: TaskConnection;
  title: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['Datetime']['output']>;
};


export type ColumnTasksArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<TaskCondition>;
  filter?: InputMaybe<TaskFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<TaskOrderBy>>;
};

/** A condition to be used against `Column` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type ColumnCondition = {
  /** Checks for equality with the object’s `projectId` field. */
  projectId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `rowId` field. */
  rowId?: InputMaybe<Scalars['UUID']['input']>;
};

/** A connection to a list of `Column` values. */
export type ColumnConnection = {
  __typename?: 'ColumnConnection';
  /** A list of edges which contains the `Column` and cursor to aid in pagination. */
  edges: Array<Maybe<ColumnEdge>>;
  /** A list of `Column` objects. */
  nodes: Array<Maybe<Column>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Column` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `Column` edge in the connection. */
export type ColumnEdge = {
  __typename?: 'ColumnEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Column` at the end of the edge. */
  node?: Maybe<Column>;
};

/** A filter to be used against `Column` object types. All fields are combined with a logical ‘and.’ */
export type ColumnFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<ColumnFilter>>;
  /** Negates the expression. */
  not?: InputMaybe<ColumnFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<ColumnFilter>>;
  /** Filter by the object’s `project` relation. */
  project?: InputMaybe<ProjectFilter>;
  /** Filter by the object’s `projectId` field. */
  projectId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `rowId` field. */
  rowId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `tasks` relation. */
  tasks?: InputMaybe<ColumnToManyTaskFilter>;
  /** Some related `tasks` exist. */
  tasksExist?: InputMaybe<Scalars['Boolean']['input']>;
};

/** An input for mutations affecting `Column` */
export type ColumnInput = {
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  projectId: Scalars['UUID']['input'];
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  title: Scalars['String']['input'];
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
};

/** Methods to use when ordering `Column`. */
export enum ColumnOrderBy {
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  ProjectIdAsc = 'PROJECT_ID_ASC',
  ProjectIdDesc = 'PROJECT_ID_DESC',
  RowIdAsc = 'ROW_ID_ASC',
  RowIdDesc = 'ROW_ID_DESC'
}

/** Represents an update to a `Column`. Fields that are set will be updated. */
export type ColumnPatch = {
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  projectId?: InputMaybe<Scalars['UUID']['input']>;
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
};

/** A filter to be used against many `Task` object types. All fields are combined with a logical ‘and.’ */
export type ColumnToManyTaskFilter = {
  /** Every related `Task` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<TaskFilter>;
  /** No related `Task` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<TaskFilter>;
  /** Some related `Task` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<TaskFilter>;
};

/** All input for the create `Assignee` mutation. */
export type CreateAssigneeInput = {
  /** The `Assignee` to be created by this mutation. */
  assignee: AssigneeInput;
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
};

/** The output of our create `Assignee` mutation. */
export type CreateAssigneePayload = {
  __typename?: 'CreateAssigneePayload';
  /** The `Assignee` that was created by this mutation. */
  assignee?: Maybe<Assignee>;
  /** An edge for our `Assignee`. May be used by Relay 1. */
  assigneeEdge?: Maybe<AssigneeEdge>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our create `Assignee` mutation. */
export type CreateAssigneePayloadAssigneeEdgeArgs = {
  orderBy?: Array<AssigneeOrderBy>;
};

/** All input for the create `Column` mutation. */
export type CreateColumnInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The `Column` to be created by this mutation. */
  column: ColumnInput;
};

/** The output of our create `Column` mutation. */
export type CreateColumnPayload = {
  __typename?: 'CreateColumnPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `Column` that was created by this mutation. */
  column?: Maybe<Column>;
  /** An edge for our `Column`. May be used by Relay 1. */
  columnEdge?: Maybe<ColumnEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our create `Column` mutation. */
export type CreateColumnPayloadColumnEdgeArgs = {
  orderBy?: Array<ColumnOrderBy>;
};

/** All input for the create `Post` mutation. */
export type CreatePostInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The `Post` to be created by this mutation. */
  post: PostInput;
};

/** The output of our create `Post` mutation. */
export type CreatePostPayload = {
  __typename?: 'CreatePostPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `Post` that was created by this mutation. */
  post?: Maybe<Post>;
  /** An edge for our `Post`. May be used by Relay 1. */
  postEdge?: Maybe<PostEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our create `Post` mutation. */
export type CreatePostPayloadPostEdgeArgs = {
  orderBy?: Array<PostOrderBy>;
};

/** All input for the create `Project` mutation. */
export type CreateProjectInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The `Project` to be created by this mutation. */
  project: ProjectInput;
};

/** The output of our create `Project` mutation. */
export type CreateProjectPayload = {
  __typename?: 'CreateProjectPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `Project` that was created by this mutation. */
  project?: Maybe<Project>;
  /** An edge for our `Project`. May be used by Relay 1. */
  projectEdge?: Maybe<ProjectEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our create `Project` mutation. */
export type CreateProjectPayloadProjectEdgeArgs = {
  orderBy?: Array<ProjectOrderBy>;
};

/** All input for the create `Task` mutation. */
export type CreateTaskInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The `Task` to be created by this mutation. */
  task: TaskInput;
};

/** The output of our create `Task` mutation. */
export type CreateTaskPayload = {
  __typename?: 'CreateTaskPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `Task` that was created by this mutation. */
  task?: Maybe<Task>;
  /** An edge for our `Task`. May be used by Relay 1. */
  taskEdge?: Maybe<TaskEdge>;
};


/** The output of our create `Task` mutation. */
export type CreateTaskPayloadTaskEdgeArgs = {
  orderBy?: Array<TaskOrderBy>;
};

/** All input for the create `User` mutation. */
export type CreateUserInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The `User` to be created by this mutation. */
  user: UserInput;
};

/** The output of our create `User` mutation. */
export type CreateUserPayload = {
  __typename?: 'CreateUserPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `User` that was created by this mutation. */
  user?: Maybe<User>;
  /** An edge for our `User`. May be used by Relay 1. */
  userEdge?: Maybe<UserEdge>;
};


/** The output of our create `User` mutation. */
export type CreateUserPayloadUserEdgeArgs = {
  orderBy?: Array<UserOrderBy>;
};

/** All input for the create `Workspace` mutation. */
export type CreateWorkspaceInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The `Workspace` to be created by this mutation. */
  workspace: WorkspaceInput;
};

/** The output of our create `Workspace` mutation. */
export type CreateWorkspacePayload = {
  __typename?: 'CreateWorkspacePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `Workspace` that was created by this mutation. */
  workspace?: Maybe<Workspace>;
  /** An edge for our `Workspace`. May be used by Relay 1. */
  workspaceEdge?: Maybe<WorkspaceEdge>;
};


/** The output of our create `Workspace` mutation. */
export type CreateWorkspacePayloadWorkspaceEdgeArgs = {
  orderBy?: Array<WorkspaceOrderBy>;
};

/** All input for the create `WorkspaceUser` mutation. */
export type CreateWorkspaceUserInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The `WorkspaceUser` to be created by this mutation. */
  workspaceUser: WorkspaceUserInput;
};

/** The output of our create `WorkspaceUser` mutation. */
export type CreateWorkspaceUserPayload = {
  __typename?: 'CreateWorkspaceUserPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `WorkspaceUser` that was created by this mutation. */
  workspaceUser?: Maybe<WorkspaceUser>;
  /** An edge for our `WorkspaceUser`. May be used by Relay 1. */
  workspaceUserEdge?: Maybe<WorkspaceUserEdge>;
};


/** The output of our create `WorkspaceUser` mutation. */
export type CreateWorkspaceUserPayloadWorkspaceUserEdgeArgs = {
  orderBy?: Array<WorkspaceUserOrderBy>;
};

/** All input for the `deleteAssigneeById` mutation. */
export type DeleteAssigneeByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `Assignee` to be deleted. */
  id: Scalars['ID']['input'];
};

/** All input for the `deleteAssignee` mutation. */
export type DeleteAssigneeInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  rowId: Scalars['UUID']['input'];
};

/** The output of our delete `Assignee` mutation. */
export type DeleteAssigneePayload = {
  __typename?: 'DeleteAssigneePayload';
  /** The `Assignee` that was deleted by this mutation. */
  assignee?: Maybe<Assignee>;
  /** An edge for our `Assignee`. May be used by Relay 1. */
  assigneeEdge?: Maybe<AssigneeEdge>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  deletedAssigneeId?: Maybe<Scalars['ID']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our delete `Assignee` mutation. */
export type DeleteAssigneePayloadAssigneeEdgeArgs = {
  orderBy?: Array<AssigneeOrderBy>;
};

/** All input for the `deleteColumnById` mutation. */
export type DeleteColumnByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `Column` to be deleted. */
  id: Scalars['ID']['input'];
};

/** All input for the `deleteColumn` mutation. */
export type DeleteColumnInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  rowId: Scalars['UUID']['input'];
};

/** The output of our delete `Column` mutation. */
export type DeleteColumnPayload = {
  __typename?: 'DeleteColumnPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `Column` that was deleted by this mutation. */
  column?: Maybe<Column>;
  /** An edge for our `Column`. May be used by Relay 1. */
  columnEdge?: Maybe<ColumnEdge>;
  deletedColumnId?: Maybe<Scalars['ID']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our delete `Column` mutation. */
export type DeleteColumnPayloadColumnEdgeArgs = {
  orderBy?: Array<ColumnOrderBy>;
};

/** All input for the `deletePostById` mutation. */
export type DeletePostByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `Post` to be deleted. */
  id: Scalars['ID']['input'];
};

/** All input for the `deletePost` mutation. */
export type DeletePostInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  rowId: Scalars['UUID']['input'];
};

/** The output of our delete `Post` mutation. */
export type DeletePostPayload = {
  __typename?: 'DeletePostPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  deletedPostId?: Maybe<Scalars['ID']['output']>;
  /** The `Post` that was deleted by this mutation. */
  post?: Maybe<Post>;
  /** An edge for our `Post`. May be used by Relay 1. */
  postEdge?: Maybe<PostEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our delete `Post` mutation. */
export type DeletePostPayloadPostEdgeArgs = {
  orderBy?: Array<PostOrderBy>;
};

/** All input for the `deleteProjectById` mutation. */
export type DeleteProjectByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `Project` to be deleted. */
  id: Scalars['ID']['input'];
};

/** All input for the `deleteProject` mutation. */
export type DeleteProjectInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  rowId: Scalars['UUID']['input'];
};

/** The output of our delete `Project` mutation. */
export type DeleteProjectPayload = {
  __typename?: 'DeleteProjectPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  deletedProjectId?: Maybe<Scalars['ID']['output']>;
  /** The `Project` that was deleted by this mutation. */
  project?: Maybe<Project>;
  /** An edge for our `Project`. May be used by Relay 1. */
  projectEdge?: Maybe<ProjectEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our delete `Project` mutation. */
export type DeleteProjectPayloadProjectEdgeArgs = {
  orderBy?: Array<ProjectOrderBy>;
};

/** All input for the `deleteTaskById` mutation. */
export type DeleteTaskByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `Task` to be deleted. */
  id: Scalars['ID']['input'];
};

/** All input for the `deleteTask` mutation. */
export type DeleteTaskInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  rowId: Scalars['UUID']['input'];
};

/** The output of our delete `Task` mutation. */
export type DeleteTaskPayload = {
  __typename?: 'DeleteTaskPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  deletedTaskId?: Maybe<Scalars['ID']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `Task` that was deleted by this mutation. */
  task?: Maybe<Task>;
  /** An edge for our `Task`. May be used by Relay 1. */
  taskEdge?: Maybe<TaskEdge>;
};


/** The output of our delete `Task` mutation. */
export type DeleteTaskPayloadTaskEdgeArgs = {
  orderBy?: Array<TaskOrderBy>;
};

/** All input for the `deleteUserById` mutation. */
export type DeleteUserByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `User` to be deleted. */
  id: Scalars['ID']['input'];
};

/** All input for the `deleteUserByIdentityProviderId` mutation. */
export type DeleteUserByIdentityProviderIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  identityProviderId: Scalars['UUID']['input'];
};

/** All input for the `deleteUser` mutation. */
export type DeleteUserInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  rowId: Scalars['UUID']['input'];
};

/** The output of our delete `User` mutation. */
export type DeleteUserPayload = {
  __typename?: 'DeleteUserPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  deletedUserId?: Maybe<Scalars['ID']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `User` that was deleted by this mutation. */
  user?: Maybe<User>;
  /** An edge for our `User`. May be used by Relay 1. */
  userEdge?: Maybe<UserEdge>;
};


/** The output of our delete `User` mutation. */
export type DeleteUserPayloadUserEdgeArgs = {
  orderBy?: Array<UserOrderBy>;
};

/** All input for the `deleteWorkspaceById` mutation. */
export type DeleteWorkspaceByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `Workspace` to be deleted. */
  id: Scalars['ID']['input'];
};

/** All input for the `deleteWorkspace` mutation. */
export type DeleteWorkspaceInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  rowId: Scalars['UUID']['input'];
};

/** The output of our delete `Workspace` mutation. */
export type DeleteWorkspacePayload = {
  __typename?: 'DeleteWorkspacePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  deletedWorkspaceId?: Maybe<Scalars['ID']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `Workspace` that was deleted by this mutation. */
  workspace?: Maybe<Workspace>;
  /** An edge for our `Workspace`. May be used by Relay 1. */
  workspaceEdge?: Maybe<WorkspaceEdge>;
};


/** The output of our delete `Workspace` mutation. */
export type DeleteWorkspacePayloadWorkspaceEdgeArgs = {
  orderBy?: Array<WorkspaceOrderBy>;
};

/** All input for the `deleteWorkspaceUserById` mutation. */
export type DeleteWorkspaceUserByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `WorkspaceUser` to be deleted. */
  id: Scalars['ID']['input'];
};

/** All input for the `deleteWorkspaceUser` mutation. */
export type DeleteWorkspaceUserInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  userId: Scalars['UUID']['input'];
  workspaceId: Scalars['UUID']['input'];
};

/** The output of our delete `WorkspaceUser` mutation. */
export type DeleteWorkspaceUserPayload = {
  __typename?: 'DeleteWorkspaceUserPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  deletedWorkspaceUserId?: Maybe<Scalars['ID']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `WorkspaceUser` that was deleted by this mutation. */
  workspaceUser?: Maybe<WorkspaceUser>;
  /** An edge for our `WorkspaceUser`. May be used by Relay 1. */
  workspaceUserEdge?: Maybe<WorkspaceUserEdge>;
};


/** The output of our delete `WorkspaceUser` mutation. */
export type DeleteWorkspaceUserPayloadWorkspaceUserEdgeArgs = {
  orderBy?: Array<WorkspaceUserOrderBy>;
};

/** The root mutation type which contains root level fields which mutate data. */
export type Mutation = {
  __typename?: 'Mutation';
  /** Creates a single `Assignee`. */
  createAssignee?: Maybe<CreateAssigneePayload>;
  /** Creates a single `Column`. */
  createColumn?: Maybe<CreateColumnPayload>;
  /** Creates a single `Post`. */
  createPost?: Maybe<CreatePostPayload>;
  /** Creates a single `Project`. */
  createProject?: Maybe<CreateProjectPayload>;
  /** Creates a single `Task`. */
  createTask?: Maybe<CreateTaskPayload>;
  /** Creates a single `User`. */
  createUser?: Maybe<CreateUserPayload>;
  /** Creates a single `Workspace`. */
  createWorkspace?: Maybe<CreateWorkspacePayload>;
  /** Creates a single `WorkspaceUser`. */
  createWorkspaceUser?: Maybe<CreateWorkspaceUserPayload>;
  /** Deletes a single `Assignee` using a unique key. */
  deleteAssignee?: Maybe<DeleteAssigneePayload>;
  /** Deletes a single `Assignee` using its globally unique id. */
  deleteAssigneeById?: Maybe<DeleteAssigneePayload>;
  /** Deletes a single `Column` using a unique key. */
  deleteColumn?: Maybe<DeleteColumnPayload>;
  /** Deletes a single `Column` using its globally unique id. */
  deleteColumnById?: Maybe<DeleteColumnPayload>;
  /** Deletes a single `Post` using a unique key. */
  deletePost?: Maybe<DeletePostPayload>;
  /** Deletes a single `Post` using its globally unique id. */
  deletePostById?: Maybe<DeletePostPayload>;
  /** Deletes a single `Project` using a unique key. */
  deleteProject?: Maybe<DeleteProjectPayload>;
  /** Deletes a single `Project` using its globally unique id. */
  deleteProjectById?: Maybe<DeleteProjectPayload>;
  /** Deletes a single `Task` using a unique key. */
  deleteTask?: Maybe<DeleteTaskPayload>;
  /** Deletes a single `Task` using its globally unique id. */
  deleteTaskById?: Maybe<DeleteTaskPayload>;
  /** Deletes a single `User` using a unique key. */
  deleteUser?: Maybe<DeleteUserPayload>;
  /** Deletes a single `User` using its globally unique id. */
  deleteUserById?: Maybe<DeleteUserPayload>;
  /** Deletes a single `User` using a unique key. */
  deleteUserByIdentityProviderId?: Maybe<DeleteUserPayload>;
  /** Deletes a single `Workspace` using a unique key. */
  deleteWorkspace?: Maybe<DeleteWorkspacePayload>;
  /** Deletes a single `Workspace` using its globally unique id. */
  deleteWorkspaceById?: Maybe<DeleteWorkspacePayload>;
  /** Deletes a single `WorkspaceUser` using a unique key. */
  deleteWorkspaceUser?: Maybe<DeleteWorkspaceUserPayload>;
  /** Deletes a single `WorkspaceUser` using its globally unique id. */
  deleteWorkspaceUserById?: Maybe<DeleteWorkspaceUserPayload>;
  /** Updates a single `Assignee` using a unique key and a patch. */
  updateAssignee?: Maybe<UpdateAssigneePayload>;
  /** Updates a single `Assignee` using its globally unique id and a patch. */
  updateAssigneeById?: Maybe<UpdateAssigneePayload>;
  /** Updates a single `Column` using a unique key and a patch. */
  updateColumn?: Maybe<UpdateColumnPayload>;
  /** Updates a single `Column` using its globally unique id and a patch. */
  updateColumnById?: Maybe<UpdateColumnPayload>;
  /** Updates a single `Post` using a unique key and a patch. */
  updatePost?: Maybe<UpdatePostPayload>;
  /** Updates a single `Post` using its globally unique id and a patch. */
  updatePostById?: Maybe<UpdatePostPayload>;
  /** Updates a single `Project` using a unique key and a patch. */
  updateProject?: Maybe<UpdateProjectPayload>;
  /** Updates a single `Project` using its globally unique id and a patch. */
  updateProjectById?: Maybe<UpdateProjectPayload>;
  /** Updates a single `Task` using a unique key and a patch. */
  updateTask?: Maybe<UpdateTaskPayload>;
  /** Updates a single `Task` using its globally unique id and a patch. */
  updateTaskById?: Maybe<UpdateTaskPayload>;
  /** Updates a single `User` using a unique key and a patch. */
  updateUser?: Maybe<UpdateUserPayload>;
  /** Updates a single `User` using its globally unique id and a patch. */
  updateUserById?: Maybe<UpdateUserPayload>;
  /** Updates a single `User` using a unique key and a patch. */
  updateUserByIdentityProviderId?: Maybe<UpdateUserPayload>;
  /** Updates a single `Workspace` using a unique key and a patch. */
  updateWorkspace?: Maybe<UpdateWorkspacePayload>;
  /** Updates a single `Workspace` using its globally unique id and a patch. */
  updateWorkspaceById?: Maybe<UpdateWorkspacePayload>;
  /** Updates a single `WorkspaceUser` using a unique key and a patch. */
  updateWorkspaceUser?: Maybe<UpdateWorkspaceUserPayload>;
  /** Updates a single `WorkspaceUser` using its globally unique id and a patch. */
  updateWorkspaceUserById?: Maybe<UpdateWorkspaceUserPayload>;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateAssigneeArgs = {
  input: CreateAssigneeInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateColumnArgs = {
  input: CreateColumnInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreatePostArgs = {
  input: CreatePostInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateProjectArgs = {
  input: CreateProjectInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateTaskArgs = {
  input: CreateTaskInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateUserArgs = {
  input: CreateUserInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateWorkspaceArgs = {
  input: CreateWorkspaceInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateWorkspaceUserArgs = {
  input: CreateWorkspaceUserInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteAssigneeArgs = {
  input: DeleteAssigneeInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteAssigneeByIdArgs = {
  input: DeleteAssigneeByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteColumnArgs = {
  input: DeleteColumnInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteColumnByIdArgs = {
  input: DeleteColumnByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeletePostArgs = {
  input: DeletePostInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeletePostByIdArgs = {
  input: DeletePostByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteProjectArgs = {
  input: DeleteProjectInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteProjectByIdArgs = {
  input: DeleteProjectByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteTaskArgs = {
  input: DeleteTaskInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteTaskByIdArgs = {
  input: DeleteTaskByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteUserArgs = {
  input: DeleteUserInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteUserByIdArgs = {
  input: DeleteUserByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteUserByIdentityProviderIdArgs = {
  input: DeleteUserByIdentityProviderIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteWorkspaceArgs = {
  input: DeleteWorkspaceInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteWorkspaceByIdArgs = {
  input: DeleteWorkspaceByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteWorkspaceUserArgs = {
  input: DeleteWorkspaceUserInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteWorkspaceUserByIdArgs = {
  input: DeleteWorkspaceUserByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateAssigneeArgs = {
  input: UpdateAssigneeInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateAssigneeByIdArgs = {
  input: UpdateAssigneeByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateColumnArgs = {
  input: UpdateColumnInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateColumnByIdArgs = {
  input: UpdateColumnByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdatePostArgs = {
  input: UpdatePostInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdatePostByIdArgs = {
  input: UpdatePostByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateProjectArgs = {
  input: UpdateProjectInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateProjectByIdArgs = {
  input: UpdateProjectByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateTaskArgs = {
  input: UpdateTaskInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateTaskByIdArgs = {
  input: UpdateTaskByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateUserByIdArgs = {
  input: UpdateUserByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateUserByIdentityProviderIdArgs = {
  input: UpdateUserByIdentityProviderIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateWorkspaceArgs = {
  input: UpdateWorkspaceInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateWorkspaceByIdArgs = {
  input: UpdateWorkspaceByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateWorkspaceUserArgs = {
  input: UpdateWorkspaceUserInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateWorkspaceUserByIdArgs = {
  input: UpdateWorkspaceUserByIdInput;
};

/** An object with a globally unique `ID`. */
export type Node = {
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  id: Scalars['ID']['output'];
};

/** Information about pagination in a connection. */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['Cursor']['output']>;
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean']['output'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean']['output'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['Cursor']['output']>;
};

export type Post = Node & {
  __typename?: 'Post';
  /** Reads a single `User` that is related to this `Post`. */
  author?: Maybe<User>;
  authorId: Scalars['UUID']['output'];
  createdAt?: Maybe<Scalars['Datetime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  id: Scalars['ID']['output'];
  rowId: Scalars['UUID']['output'];
  /** Reads a single `Task` that is related to this `Post`. */
  task?: Maybe<Task>;
  taskId: Scalars['UUID']['output'];
  title?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['Datetime']['output']>;
};

/** A condition to be used against `Post` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type PostCondition = {
  /** Checks for equality with the object’s `authorId` field. */
  authorId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `rowId` field. */
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `taskId` field. */
  taskId?: InputMaybe<Scalars['UUID']['input']>;
};

/** A connection to a list of `Post` values. */
export type PostConnection = {
  __typename?: 'PostConnection';
  /** A list of edges which contains the `Post` and cursor to aid in pagination. */
  edges: Array<Maybe<PostEdge>>;
  /** A list of `Post` objects. */
  nodes: Array<Maybe<Post>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Post` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `Post` edge in the connection. */
export type PostEdge = {
  __typename?: 'PostEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Post` at the end of the edge. */
  node?: Maybe<Post>;
};

/** A filter to be used against `Post` object types. All fields are combined with a logical ‘and.’ */
export type PostFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<PostFilter>>;
  /** Filter by the object’s `author` relation. */
  author?: InputMaybe<UserFilter>;
  /** Filter by the object’s `authorId` field. */
  authorId?: InputMaybe<UuidFilter>;
  /** Negates the expression. */
  not?: InputMaybe<PostFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<PostFilter>>;
  /** Filter by the object’s `rowId` field. */
  rowId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `task` relation. */
  task?: InputMaybe<TaskFilter>;
  /** Filter by the object’s `taskId` field. */
  taskId?: InputMaybe<UuidFilter>;
};

/** An input for mutations affecting `Post` */
export type PostInput = {
  authorId: Scalars['UUID']['input'];
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  taskId: Scalars['UUID']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
};

/** Methods to use when ordering `Post`. */
export enum PostOrderBy {
  AuthorIdAsc = 'AUTHOR_ID_ASC',
  AuthorIdDesc = 'AUTHOR_ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  RowIdAsc = 'ROW_ID_ASC',
  RowIdDesc = 'ROW_ID_DESC',
  TaskIdAsc = 'TASK_ID_ASC',
  TaskIdDesc = 'TASK_ID_DESC'
}

/** Represents an update to a `Post`. Fields that are set will be updated. */
export type PostPatch = {
  authorId?: InputMaybe<Scalars['UUID']['input']>;
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  taskId?: InputMaybe<Scalars['UUID']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
};

export type Project = Node & {
  __typename?: 'Project';
  color?: Maybe<Scalars['String']['output']>;
  /** Reads and enables pagination through a set of `Column`. */
  columns: ColumnConnection;
  createdAt?: Maybe<Scalars['Datetime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  id: Scalars['ID']['output'];
  labels?: Maybe<Scalars['JSON']['output']>;
  name: Scalars['String']['output'];
  prefix?: Maybe<Scalars['String']['output']>;
  rowId: Scalars['UUID']['output'];
  /** Reads and enables pagination through a set of `Task`. */
  tasks: TaskConnection;
  updatedAt?: Maybe<Scalars['Datetime']['output']>;
  viewMode: Scalars['String']['output'];
  /** Reads a single `Workspace` that is related to this `Project`. */
  workspace?: Maybe<Workspace>;
  workspaceId: Scalars['UUID']['output'];
};


export type ProjectColumnsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<ColumnCondition>;
  filter?: InputMaybe<ColumnFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ColumnOrderBy>>;
};


export type ProjectTasksArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<TaskCondition>;
  filter?: InputMaybe<TaskFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<TaskOrderBy>>;
};

/** A condition to be used against `Project` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type ProjectCondition = {
  /** Checks for equality with the object’s `rowId` field. */
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `workspaceId` field. */
  workspaceId?: InputMaybe<Scalars['UUID']['input']>;
};

/** A connection to a list of `Project` values. */
export type ProjectConnection = {
  __typename?: 'ProjectConnection';
  /** A list of edges which contains the `Project` and cursor to aid in pagination. */
  edges: Array<Maybe<ProjectEdge>>;
  /** A list of `Project` objects. */
  nodes: Array<Maybe<Project>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Project` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `Project` edge in the connection. */
export type ProjectEdge = {
  __typename?: 'ProjectEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Project` at the end of the edge. */
  node?: Maybe<Project>;
};

/** A filter to be used against `Project` object types. All fields are combined with a logical ‘and.’ */
export type ProjectFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<ProjectFilter>>;
  /** Filter by the object’s `columns` relation. */
  columns?: InputMaybe<ProjectToManyColumnFilter>;
  /** Some related `columns` exist. */
  columnsExist?: InputMaybe<Scalars['Boolean']['input']>;
  /** Negates the expression. */
  not?: InputMaybe<ProjectFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<ProjectFilter>>;
  /** Filter by the object’s `rowId` field. */
  rowId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `tasks` relation. */
  tasks?: InputMaybe<ProjectToManyTaskFilter>;
  /** Some related `tasks` exist. */
  tasksExist?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `workspace` relation. */
  workspace?: InputMaybe<WorkspaceFilter>;
  /** Filter by the object’s `workspaceId` field. */
  workspaceId?: InputMaybe<UuidFilter>;
};

/** An input for mutations affecting `Project` */
export type ProjectInput = {
  color?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  labels?: InputMaybe<Scalars['JSON']['input']>;
  name: Scalars['String']['input'];
  prefix?: InputMaybe<Scalars['String']['input']>;
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
  viewMode?: InputMaybe<Scalars['String']['input']>;
  workspaceId: Scalars['UUID']['input'];
};

/** Methods to use when ordering `Project`. */
export enum ProjectOrderBy {
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  RowIdAsc = 'ROW_ID_ASC',
  RowIdDesc = 'ROW_ID_DESC',
  WorkspaceIdAsc = 'WORKSPACE_ID_ASC',
  WorkspaceIdDesc = 'WORKSPACE_ID_DESC'
}

/** Represents an update to a `Project`. Fields that are set will be updated. */
export type ProjectPatch = {
  color?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  labels?: InputMaybe<Scalars['JSON']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  prefix?: InputMaybe<Scalars['String']['input']>;
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
  viewMode?: InputMaybe<Scalars['String']['input']>;
  workspaceId?: InputMaybe<Scalars['UUID']['input']>;
};

/** A filter to be used against many `Column` object types. All fields are combined with a logical ‘and.’ */
export type ProjectToManyColumnFilter = {
  /** Every related `Column` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<ColumnFilter>;
  /** No related `Column` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<ColumnFilter>;
  /** Some related `Column` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<ColumnFilter>;
};

/** A filter to be used against many `Task` object types. All fields are combined with a logical ‘and.’ */
export type ProjectToManyTaskFilter = {
  /** Every related `Task` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<TaskFilter>;
  /** No related `Task` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<TaskFilter>;
  /** Some related `Task` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<TaskFilter>;
};

/** The root query type which gives access points into the data universe. */
export type Query = Node & {
  __typename?: 'Query';
  /** Get a single `Assignee`. */
  assignee?: Maybe<Assignee>;
  /** Reads a single `Assignee` using its globally unique `ID`. */
  assigneeById?: Maybe<Assignee>;
  /** Reads and enables pagination through a set of `Assignee`. */
  assignees?: Maybe<AssigneeConnection>;
  /** Get a single `Column`. */
  column?: Maybe<Column>;
  /** Reads a single `Column` using its globally unique `ID`. */
  columnById?: Maybe<Column>;
  /** Reads and enables pagination through a set of `Column`. */
  columns?: Maybe<ColumnConnection>;
  /** The root query type must be a `Node` to work well with Relay 1 mutations. This just resolves to `query`. */
  id: Scalars['ID']['output'];
  /** Fetches an object given its globally unique `ID`. */
  node?: Maybe<Node>;
  /** Get a single `Post`. */
  post?: Maybe<Post>;
  /** Reads a single `Post` using its globally unique `ID`. */
  postById?: Maybe<Post>;
  /** Reads and enables pagination through a set of `Post`. */
  posts?: Maybe<PostConnection>;
  /** Get a single `Project`. */
  project?: Maybe<Project>;
  /** Reads a single `Project` using its globally unique `ID`. */
  projectById?: Maybe<Project>;
  /** Reads and enables pagination through a set of `Project`. */
  projects?: Maybe<ProjectConnection>;
  /**
   * Exposes the root query type nested one level down. This is helpful for Relay 1
   * which can only query top level fields if they are in a particular form.
   */
  query: Query;
  /** Get a single `Task`. */
  task?: Maybe<Task>;
  /** Reads a single `Task` using its globally unique `ID`. */
  taskById?: Maybe<Task>;
  /** Reads and enables pagination through a set of `Task`. */
  tasks?: Maybe<TaskConnection>;
  /** Get a single `User`. */
  user?: Maybe<User>;
  /** Reads a single `User` using its globally unique `ID`. */
  userById?: Maybe<User>;
  /** Get a single `User`. */
  userByIdentityProviderId?: Maybe<User>;
  /** Reads and enables pagination through a set of `User`. */
  users?: Maybe<UserConnection>;
  /** Get a single `Workspace`. */
  workspace?: Maybe<Workspace>;
  /** Reads a single `Workspace` using its globally unique `ID`. */
  workspaceById?: Maybe<Workspace>;
  /** Get a single `WorkspaceUser`. */
  workspaceUser?: Maybe<WorkspaceUser>;
  /** Reads a single `WorkspaceUser` using its globally unique `ID`. */
  workspaceUserById?: Maybe<WorkspaceUser>;
  /** Reads and enables pagination through a set of `WorkspaceUser`. */
  workspaceUsers?: Maybe<WorkspaceUserConnection>;
  /** Reads and enables pagination through a set of `Workspace`. */
  workspaces?: Maybe<WorkspaceConnection>;
};


/** The root query type which gives access points into the data universe. */
export type QueryAssigneeArgs = {
  rowId: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryAssigneeByIdArgs = {
  id: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryAssigneesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<AssigneeCondition>;
  filter?: InputMaybe<AssigneeFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<AssigneeOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryColumnArgs = {
  rowId: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryColumnByIdArgs = {
  id: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryColumnsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<ColumnCondition>;
  filter?: InputMaybe<ColumnFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ColumnOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryNodeArgs = {
  id: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPostArgs = {
  rowId: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPostByIdArgs = {
  id: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPostsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<PostCondition>;
  filter?: InputMaybe<PostFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PostOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryProjectArgs = {
  rowId: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryProjectByIdArgs = {
  id: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryProjectsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<ProjectCondition>;
  filter?: InputMaybe<ProjectFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ProjectOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryTaskArgs = {
  rowId: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryTaskByIdArgs = {
  id: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryTasksArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<TaskCondition>;
  filter?: InputMaybe<TaskFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<TaskOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryUserArgs = {
  rowId: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryUserByIdArgs = {
  id: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryUserByIdentityProviderIdArgs = {
  identityProviderId: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryUsersArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<UserCondition>;
  filter?: InputMaybe<UserFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<UserOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryWorkspaceArgs = {
  rowId: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryWorkspaceByIdArgs = {
  id: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryWorkspaceUserArgs = {
  userId: Scalars['UUID']['input'];
  workspaceId: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryWorkspaceUserByIdArgs = {
  id: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryWorkspaceUsersArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<WorkspaceUserCondition>;
  filter?: InputMaybe<WorkspaceUserFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<WorkspaceUserOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryWorkspacesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<WorkspaceCondition>;
  filter?: InputMaybe<WorkspaceFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<WorkspaceOrderBy>>;
};

export type Task = Node & {
  __typename?: 'Task';
  /** Reads and enables pagination through a set of `Assignee`. */
  assignees: AssigneeConnection;
  /** Reads a single `User` that is related to this `Task`. */
  author?: Maybe<User>;
  authorId: Scalars['UUID']['output'];
  /** Reads a single `Column` that is related to this `Task`. */
  column?: Maybe<Column>;
  columnId: Scalars['UUID']['output'];
  content: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['Datetime']['output']>;
  description: Scalars['String']['output'];
  dueDate?: Maybe<Scalars['Datetime']['output']>;
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  id: Scalars['ID']['output'];
  labels?: Maybe<Scalars['JSON']['output']>;
  /** Reads and enables pagination through a set of `Post`. */
  posts: PostConnection;
  priority: Scalars['String']['output'];
  /** Reads a single `Project` that is related to this `Task`. */
  project?: Maybe<Project>;
  projectId: Scalars['UUID']['output'];
  rowId: Scalars['UUID']['output'];
  updatedAt?: Maybe<Scalars['Datetime']['output']>;
};


export type TaskAssigneesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<AssigneeCondition>;
  filter?: InputMaybe<AssigneeFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<AssigneeOrderBy>>;
};


export type TaskPostsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<PostCondition>;
  filter?: InputMaybe<PostFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PostOrderBy>>;
};

/** A condition to be used against `Task` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type TaskCondition = {
  /** Checks for equality with the object’s `columnId` field. */
  columnId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `projectId` field. */
  projectId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `rowId` field. */
  rowId?: InputMaybe<Scalars['UUID']['input']>;
};

/** A connection to a list of `Task` values. */
export type TaskConnection = {
  __typename?: 'TaskConnection';
  /** A list of edges which contains the `Task` and cursor to aid in pagination. */
  edges: Array<Maybe<TaskEdge>>;
  /** A list of `Task` objects. */
  nodes: Array<Maybe<Task>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Task` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `Task` edge in the connection. */
export type TaskEdge = {
  __typename?: 'TaskEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Task` at the end of the edge. */
  node?: Maybe<Task>;
};

/** A filter to be used against `Task` object types. All fields are combined with a logical ‘and.’ */
export type TaskFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<TaskFilter>>;
  /** Filter by the object’s `assignees` relation. */
  assignees?: InputMaybe<TaskToManyAssigneeFilter>;
  /** Some related `assignees` exist. */
  assigneesExist?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `author` relation. */
  author?: InputMaybe<UserFilter>;
  /** Filter by the object’s `column` relation. */
  column?: InputMaybe<ColumnFilter>;
  /** Filter by the object’s `columnId` field. */
  columnId?: InputMaybe<UuidFilter>;
  /** Negates the expression. */
  not?: InputMaybe<TaskFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<TaskFilter>>;
  /** Filter by the object’s `posts` relation. */
  posts?: InputMaybe<TaskToManyPostFilter>;
  /** Some related `posts` exist. */
  postsExist?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `project` relation. */
  project?: InputMaybe<ProjectFilter>;
  /** Filter by the object’s `projectId` field. */
  projectId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `rowId` field. */
  rowId?: InputMaybe<UuidFilter>;
};

/** An input for mutations affecting `Task` */
export type TaskInput = {
  authorId: Scalars['UUID']['input'];
  columnId: Scalars['UUID']['input'];
  content: Scalars['String']['input'];
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  description: Scalars['String']['input'];
  dueDate?: InputMaybe<Scalars['Datetime']['input']>;
  labels?: InputMaybe<Scalars['JSON']['input']>;
  priority?: InputMaybe<Scalars['String']['input']>;
  projectId: Scalars['UUID']['input'];
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
};

/** Methods to use when ordering `Task`. */
export enum TaskOrderBy {
  ColumnIdAsc = 'COLUMN_ID_ASC',
  ColumnIdDesc = 'COLUMN_ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  ProjectIdAsc = 'PROJECT_ID_ASC',
  ProjectIdDesc = 'PROJECT_ID_DESC',
  RowIdAsc = 'ROW_ID_ASC',
  RowIdDesc = 'ROW_ID_DESC'
}

/** Represents an update to a `Task`. Fields that are set will be updated. */
export type TaskPatch = {
  authorId?: InputMaybe<Scalars['UUID']['input']>;
  columnId?: InputMaybe<Scalars['UUID']['input']>;
  content?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  dueDate?: InputMaybe<Scalars['Datetime']['input']>;
  labels?: InputMaybe<Scalars['JSON']['input']>;
  priority?: InputMaybe<Scalars['String']['input']>;
  projectId?: InputMaybe<Scalars['UUID']['input']>;
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
};

/** A filter to be used against many `Assignee` object types. All fields are combined with a logical ‘and.’ */
export type TaskToManyAssigneeFilter = {
  /** Every related `Assignee` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<AssigneeFilter>;
  /** No related `Assignee` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<AssigneeFilter>;
  /** Some related `Assignee` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<AssigneeFilter>;
};

/** A filter to be used against many `Post` object types. All fields are combined with a logical ‘and.’ */
export type TaskToManyPostFilter = {
  /** Every related `Post` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<PostFilter>;
  /** No related `Post` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<PostFilter>;
  /** Some related `Post` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<PostFilter>;
};

/** A filter to be used against UUID fields. All fields are combined with a logical ‘and.’ */
export type UuidFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['UUID']['input']>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['UUID']['input']>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['UUID']['input']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['UUID']['input']>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars['UUID']['input']>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['UUID']['input']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['UUID']['input']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['UUID']['input']>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['UUID']['input']>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['UUID']['input']>>;
};

/** All input for the `updateAssigneeById` mutation. */
export type UpdateAssigneeByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `Assignee` to be updated. */
  id: Scalars['ID']['input'];
  /** An object where the defined keys will be set on the `Assignee` being updated. */
  patch: AssigneePatch;
};

/** All input for the `updateAssignee` mutation. */
export type UpdateAssigneeInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** An object where the defined keys will be set on the `Assignee` being updated. */
  patch: AssigneePatch;
  rowId: Scalars['UUID']['input'];
};

/** The output of our update `Assignee` mutation. */
export type UpdateAssigneePayload = {
  __typename?: 'UpdateAssigneePayload';
  /** The `Assignee` that was updated by this mutation. */
  assignee?: Maybe<Assignee>;
  /** An edge for our `Assignee`. May be used by Relay 1. */
  assigneeEdge?: Maybe<AssigneeEdge>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our update `Assignee` mutation. */
export type UpdateAssigneePayloadAssigneeEdgeArgs = {
  orderBy?: Array<AssigneeOrderBy>;
};

/** All input for the `updateColumnById` mutation. */
export type UpdateColumnByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `Column` to be updated. */
  id: Scalars['ID']['input'];
  /** An object where the defined keys will be set on the `Column` being updated. */
  patch: ColumnPatch;
};

/** All input for the `updateColumn` mutation. */
export type UpdateColumnInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** An object where the defined keys will be set on the `Column` being updated. */
  patch: ColumnPatch;
  rowId: Scalars['UUID']['input'];
};

/** The output of our update `Column` mutation. */
export type UpdateColumnPayload = {
  __typename?: 'UpdateColumnPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `Column` that was updated by this mutation. */
  column?: Maybe<Column>;
  /** An edge for our `Column`. May be used by Relay 1. */
  columnEdge?: Maybe<ColumnEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our update `Column` mutation. */
export type UpdateColumnPayloadColumnEdgeArgs = {
  orderBy?: Array<ColumnOrderBy>;
};

/** All input for the `updatePostById` mutation. */
export type UpdatePostByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `Post` to be updated. */
  id: Scalars['ID']['input'];
  /** An object where the defined keys will be set on the `Post` being updated. */
  patch: PostPatch;
};

/** All input for the `updatePost` mutation. */
export type UpdatePostInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** An object where the defined keys will be set on the `Post` being updated. */
  patch: PostPatch;
  rowId: Scalars['UUID']['input'];
};

/** The output of our update `Post` mutation. */
export type UpdatePostPayload = {
  __typename?: 'UpdatePostPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `Post` that was updated by this mutation. */
  post?: Maybe<Post>;
  /** An edge for our `Post`. May be used by Relay 1. */
  postEdge?: Maybe<PostEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our update `Post` mutation. */
export type UpdatePostPayloadPostEdgeArgs = {
  orderBy?: Array<PostOrderBy>;
};

/** All input for the `updateProjectById` mutation. */
export type UpdateProjectByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `Project` to be updated. */
  id: Scalars['ID']['input'];
  /** An object where the defined keys will be set on the `Project` being updated. */
  patch: ProjectPatch;
};

/** All input for the `updateProject` mutation. */
export type UpdateProjectInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** An object where the defined keys will be set on the `Project` being updated. */
  patch: ProjectPatch;
  rowId: Scalars['UUID']['input'];
};

/** The output of our update `Project` mutation. */
export type UpdateProjectPayload = {
  __typename?: 'UpdateProjectPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `Project` that was updated by this mutation. */
  project?: Maybe<Project>;
  /** An edge for our `Project`. May be used by Relay 1. */
  projectEdge?: Maybe<ProjectEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our update `Project` mutation. */
export type UpdateProjectPayloadProjectEdgeArgs = {
  orderBy?: Array<ProjectOrderBy>;
};

/** All input for the `updateTaskById` mutation. */
export type UpdateTaskByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `Task` to be updated. */
  id: Scalars['ID']['input'];
  /** An object where the defined keys will be set on the `Task` being updated. */
  patch: TaskPatch;
};

/** All input for the `updateTask` mutation. */
export type UpdateTaskInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** An object where the defined keys will be set on the `Task` being updated. */
  patch: TaskPatch;
  rowId: Scalars['UUID']['input'];
};

/** The output of our update `Task` mutation. */
export type UpdateTaskPayload = {
  __typename?: 'UpdateTaskPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `Task` that was updated by this mutation. */
  task?: Maybe<Task>;
  /** An edge for our `Task`. May be used by Relay 1. */
  taskEdge?: Maybe<TaskEdge>;
};


/** The output of our update `Task` mutation. */
export type UpdateTaskPayloadTaskEdgeArgs = {
  orderBy?: Array<TaskOrderBy>;
};

/** All input for the `updateUserById` mutation. */
export type UpdateUserByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `User` to be updated. */
  id: Scalars['ID']['input'];
  /** An object where the defined keys will be set on the `User` being updated. */
  patch: UserPatch;
};

/** All input for the `updateUserByIdentityProviderId` mutation. */
export type UpdateUserByIdentityProviderIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  identityProviderId: Scalars['UUID']['input'];
  /** An object where the defined keys will be set on the `User` being updated. */
  patch: UserPatch;
};

/** All input for the `updateUser` mutation. */
export type UpdateUserInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** An object where the defined keys will be set on the `User` being updated. */
  patch: UserPatch;
  rowId: Scalars['UUID']['input'];
};

/** The output of our update `User` mutation. */
export type UpdateUserPayload = {
  __typename?: 'UpdateUserPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `User` that was updated by this mutation. */
  user?: Maybe<User>;
  /** An edge for our `User`. May be used by Relay 1. */
  userEdge?: Maybe<UserEdge>;
};


/** The output of our update `User` mutation. */
export type UpdateUserPayloadUserEdgeArgs = {
  orderBy?: Array<UserOrderBy>;
};

/** All input for the `updateWorkspaceById` mutation. */
export type UpdateWorkspaceByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `Workspace` to be updated. */
  id: Scalars['ID']['input'];
  /** An object where the defined keys will be set on the `Workspace` being updated. */
  patch: WorkspacePatch;
};

/** All input for the `updateWorkspace` mutation. */
export type UpdateWorkspaceInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** An object where the defined keys will be set on the `Workspace` being updated. */
  patch: WorkspacePatch;
  rowId: Scalars['UUID']['input'];
};

/** The output of our update `Workspace` mutation. */
export type UpdateWorkspacePayload = {
  __typename?: 'UpdateWorkspacePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `Workspace` that was updated by this mutation. */
  workspace?: Maybe<Workspace>;
  /** An edge for our `Workspace`. May be used by Relay 1. */
  workspaceEdge?: Maybe<WorkspaceEdge>;
};


/** The output of our update `Workspace` mutation. */
export type UpdateWorkspacePayloadWorkspaceEdgeArgs = {
  orderBy?: Array<WorkspaceOrderBy>;
};

/** All input for the `updateWorkspaceUserById` mutation. */
export type UpdateWorkspaceUserByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `WorkspaceUser` to be updated. */
  id: Scalars['ID']['input'];
  /** An object where the defined keys will be set on the `WorkspaceUser` being updated. */
  patch: WorkspaceUserPatch;
};

/** All input for the `updateWorkspaceUser` mutation. */
export type UpdateWorkspaceUserInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** An object where the defined keys will be set on the `WorkspaceUser` being updated. */
  patch: WorkspaceUserPatch;
  userId: Scalars['UUID']['input'];
  workspaceId: Scalars['UUID']['input'];
};

/** The output of our update `WorkspaceUser` mutation. */
export type UpdateWorkspaceUserPayload = {
  __typename?: 'UpdateWorkspaceUserPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `WorkspaceUser` that was updated by this mutation. */
  workspaceUser?: Maybe<WorkspaceUser>;
  /** An edge for our `WorkspaceUser`. May be used by Relay 1. */
  workspaceUserEdge?: Maybe<WorkspaceUserEdge>;
};


/** The output of our update `WorkspaceUser` mutation. */
export type UpdateWorkspaceUserPayloadWorkspaceUserEdgeArgs = {
  orderBy?: Array<WorkspaceUserOrderBy>;
};

export type User = Node & {
  __typename?: 'User';
  /** Reads and enables pagination through a set of `Assignee`. */
  assignees: AssigneeConnection;
  /** Reads and enables pagination through a set of `Post`. */
  authoredPosts: PostConnection;
  avatarUrl?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['Datetime']['output']>;
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  id: Scalars['ID']['output'];
  identityProviderId: Scalars['UUID']['output'];
  name: Scalars['String']['output'];
  rowId: Scalars['UUID']['output'];
  updatedAt?: Maybe<Scalars['Datetime']['output']>;
  /** Reads and enables pagination through a set of `WorkspaceUser`. */
  workspaceUsers: WorkspaceUserConnection;
};


export type UserAssigneesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<AssigneeCondition>;
  filter?: InputMaybe<AssigneeFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<AssigneeOrderBy>>;
};


export type UserAuthoredPostsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<PostCondition>;
  filter?: InputMaybe<PostFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PostOrderBy>>;
};


export type UserWorkspaceUsersArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<WorkspaceUserCondition>;
  filter?: InputMaybe<WorkspaceUserFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<WorkspaceUserOrderBy>>;
};

/** A condition to be used against `User` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type UserCondition = {
  /** Checks for equality with the object’s `identityProviderId` field. */
  identityProviderId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `rowId` field. */
  rowId?: InputMaybe<Scalars['UUID']['input']>;
};

/** A connection to a list of `User` values. */
export type UserConnection = {
  __typename?: 'UserConnection';
  /** A list of edges which contains the `User` and cursor to aid in pagination. */
  edges: Array<Maybe<UserEdge>>;
  /** A list of `User` objects. */
  nodes: Array<Maybe<User>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `User` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `User` edge in the connection. */
export type UserEdge = {
  __typename?: 'UserEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `User` at the end of the edge. */
  node?: Maybe<User>;
};

/** A filter to be used against `User` object types. All fields are combined with a logical ‘and.’ */
export type UserFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<UserFilter>>;
  /** Filter by the object’s `assignees` relation. */
  assignees?: InputMaybe<UserToManyAssigneeFilter>;
  /** Some related `assignees` exist. */
  assigneesExist?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `authoredPosts` relation. */
  authoredPosts?: InputMaybe<UserToManyPostFilter>;
  /** Some related `authoredPosts` exist. */
  authoredPostsExist?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `identityProviderId` field. */
  identityProviderId?: InputMaybe<UuidFilter>;
  /** Negates the expression. */
  not?: InputMaybe<UserFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<UserFilter>>;
  /** Filter by the object’s `rowId` field. */
  rowId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `workspaceUsers` relation. */
  workspaceUsers?: InputMaybe<UserToManyWorkspaceUserFilter>;
  /** Some related `workspaceUsers` exist. */
  workspaceUsersExist?: InputMaybe<Scalars['Boolean']['input']>;
};

/** An input for mutations affecting `User` */
export type UserInput = {
  avatarUrl?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  identityProviderId: Scalars['UUID']['input'];
  name: Scalars['String']['input'];
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
};

/** Methods to use when ordering `User`. */
export enum UserOrderBy {
  IdentityProviderIdAsc = 'IDENTITY_PROVIDER_ID_ASC',
  IdentityProviderIdDesc = 'IDENTITY_PROVIDER_ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  RowIdAsc = 'ROW_ID_ASC',
  RowIdDesc = 'ROW_ID_DESC'
}

/** Represents an update to a `User`. Fields that are set will be updated. */
export type UserPatch = {
  avatarUrl?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  identityProviderId?: InputMaybe<Scalars['UUID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
};

/** A filter to be used against many `Assignee` object types. All fields are combined with a logical ‘and.’ */
export type UserToManyAssigneeFilter = {
  /** Every related `Assignee` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<AssigneeFilter>;
  /** No related `Assignee` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<AssigneeFilter>;
  /** Some related `Assignee` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<AssigneeFilter>;
};

/** A filter to be used against many `Post` object types. All fields are combined with a logical ‘and.’ */
export type UserToManyPostFilter = {
  /** Every related `Post` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<PostFilter>;
  /** No related `Post` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<PostFilter>;
  /** Some related `Post` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<PostFilter>;
};

/** A filter to be used against many `WorkspaceUser` object types. All fields are combined with a logical ‘and.’ */
export type UserToManyWorkspaceUserFilter = {
  /** Every related `WorkspaceUser` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<WorkspaceUserFilter>;
  /** No related `WorkspaceUser` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<WorkspaceUserFilter>;
  /** Some related `WorkspaceUser` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<WorkspaceUserFilter>;
};

export type Workspace = Node & {
  __typename?: 'Workspace';
  createdAt?: Maybe<Scalars['Datetime']['output']>;
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  /** Reads and enables pagination through a set of `Project`. */
  projects: ProjectConnection;
  rowId: Scalars['UUID']['output'];
  updatedAt?: Maybe<Scalars['Datetime']['output']>;
  /** Reads and enables pagination through a set of `WorkspaceUser`. */
  workspaceUsers: WorkspaceUserConnection;
};


export type WorkspaceProjectsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<ProjectCondition>;
  filter?: InputMaybe<ProjectFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ProjectOrderBy>>;
};


export type WorkspaceWorkspaceUsersArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<WorkspaceUserCondition>;
  filter?: InputMaybe<WorkspaceUserFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<WorkspaceUserOrderBy>>;
};

/**
 * A condition to be used against `Workspace` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type WorkspaceCondition = {
  /** Checks for equality with the object’s `rowId` field. */
  rowId?: InputMaybe<Scalars['UUID']['input']>;
};

/** A connection to a list of `Workspace` values. */
export type WorkspaceConnection = {
  __typename?: 'WorkspaceConnection';
  /** A list of edges which contains the `Workspace` and cursor to aid in pagination. */
  edges: Array<Maybe<WorkspaceEdge>>;
  /** A list of `Workspace` objects. */
  nodes: Array<Maybe<Workspace>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Workspace` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `Workspace` edge in the connection. */
export type WorkspaceEdge = {
  __typename?: 'WorkspaceEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Workspace` at the end of the edge. */
  node?: Maybe<Workspace>;
};

/** A filter to be used against `Workspace` object types. All fields are combined with a logical ‘and.’ */
export type WorkspaceFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<WorkspaceFilter>>;
  /** Negates the expression. */
  not?: InputMaybe<WorkspaceFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<WorkspaceFilter>>;
  /** Filter by the object’s `projects` relation. */
  projects?: InputMaybe<WorkspaceToManyProjectFilter>;
  /** Some related `projects` exist. */
  projectsExist?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `rowId` field. */
  rowId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `workspaceUsers` relation. */
  workspaceUsers?: InputMaybe<WorkspaceToManyWorkspaceUserFilter>;
  /** Some related `workspaceUsers` exist. */
  workspaceUsersExist?: InputMaybe<Scalars['Boolean']['input']>;
};

/** An input for mutations affecting `Workspace` */
export type WorkspaceInput = {
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  name: Scalars['String']['input'];
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
};

/** Methods to use when ordering `Workspace`. */
export enum WorkspaceOrderBy {
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  RowIdAsc = 'ROW_ID_ASC',
  RowIdDesc = 'ROW_ID_DESC'
}

/** Represents an update to a `Workspace`. Fields that are set will be updated. */
export type WorkspacePatch = {
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
};

/** A filter to be used against many `Project` object types. All fields are combined with a logical ‘and.’ */
export type WorkspaceToManyProjectFilter = {
  /** Every related `Project` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<ProjectFilter>;
  /** No related `Project` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<ProjectFilter>;
  /** Some related `Project` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<ProjectFilter>;
};

/** A filter to be used against many `WorkspaceUser` object types. All fields are combined with a logical ‘and.’ */
export type WorkspaceToManyWorkspaceUserFilter = {
  /** Every related `WorkspaceUser` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<WorkspaceUserFilter>;
  /** No related `WorkspaceUser` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<WorkspaceUserFilter>;
  /** Some related `WorkspaceUser` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<WorkspaceUserFilter>;
};

export type WorkspaceUser = Node & {
  __typename?: 'WorkspaceUser';
  createdAt?: Maybe<Scalars['Datetime']['output']>;
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  id: Scalars['ID']['output'];
  /** Reads a single `User` that is related to this `WorkspaceUser`. */
  user?: Maybe<User>;
  userId: Scalars['UUID']['output'];
  /** Reads a single `Workspace` that is related to this `WorkspaceUser`. */
  workspace?: Maybe<Workspace>;
  workspaceId: Scalars['UUID']['output'];
};

/**
 * A condition to be used against `WorkspaceUser` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type WorkspaceUserCondition = {
  /** Checks for equality with the object’s `userId` field. */
  userId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `workspaceId` field. */
  workspaceId?: InputMaybe<Scalars['UUID']['input']>;
};

/** A connection to a list of `WorkspaceUser` values. */
export type WorkspaceUserConnection = {
  __typename?: 'WorkspaceUserConnection';
  /** A list of edges which contains the `WorkspaceUser` and cursor to aid in pagination. */
  edges: Array<Maybe<WorkspaceUserEdge>>;
  /** A list of `WorkspaceUser` objects. */
  nodes: Array<Maybe<WorkspaceUser>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `WorkspaceUser` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `WorkspaceUser` edge in the connection. */
export type WorkspaceUserEdge = {
  __typename?: 'WorkspaceUserEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `WorkspaceUser` at the end of the edge. */
  node?: Maybe<WorkspaceUser>;
};

/** A filter to be used against `WorkspaceUser` object types. All fields are combined with a logical ‘and.’ */
export type WorkspaceUserFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<WorkspaceUserFilter>>;
  /** Negates the expression. */
  not?: InputMaybe<WorkspaceUserFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<WorkspaceUserFilter>>;
  /** Filter by the object’s `user` relation. */
  user?: InputMaybe<UserFilter>;
  /** Filter by the object’s `userId` field. */
  userId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `workspace` relation. */
  workspace?: InputMaybe<WorkspaceFilter>;
  /** Filter by the object’s `workspaceId` field. */
  workspaceId?: InputMaybe<UuidFilter>;
};

/** An input for mutations affecting `WorkspaceUser` */
export type WorkspaceUserInput = {
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  userId: Scalars['UUID']['input'];
  workspaceId: Scalars['UUID']['input'];
};

/** Methods to use when ordering `WorkspaceUser`. */
export enum WorkspaceUserOrderBy {
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  UserIdAsc = 'USER_ID_ASC',
  UserIdDesc = 'USER_ID_DESC',
  WorkspaceIdAsc = 'WORKSPACE_ID_ASC',
  WorkspaceIdDesc = 'WORKSPACE_ID_DESC'
}

/** Represents an update to a `WorkspaceUser`. Fields that are set will be updated. */
export type WorkspaceUserPatch = {
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  userId?: InputMaybe<Scalars['UUID']['input']>;
  workspaceId?: InputMaybe<Scalars['UUID']['input']>;
};

export type CreateTaskMutationVariables = Exact<{
  input: CreateTaskInput;
}>;


export type CreateTaskMutation = { __typename?: 'Mutation', createTask?: { __typename?: 'CreateTaskPayload', task?: { __typename?: 'Task', rowId: string } | null } | null };

export type DeleteTaskMutationVariables = Exact<{
  rowId: Scalars['UUID']['input'];
}>;


export type DeleteTaskMutation = { __typename?: 'Mutation', deleteTask?: { __typename?: 'DeleteTaskPayload', task?: { __typename?: 'Task', rowId: string } | null } | null };

export type UpdateTaskMutationVariables = Exact<{
  rowId: Scalars['UUID']['input'];
  patch: TaskPatch;
}>;


export type UpdateTaskMutation = { __typename?: 'Mutation', updateTask?: { __typename?: 'UpdateTaskPayload', task?: { __typename?: 'Task', rowId: string } | null } | null };

export type TasksQueryVariables = Exact<{ [key: string]: never; }>;


export type TasksQuery = { __typename?: 'Query', tasks?: { __typename?: 'TaskConnection', nodes: Array<{ __typename?: 'Task', rowId: string, content: string, projectId: string, priority: string, createdAt?: Date | null, author?: { __typename?: 'User', rowId: string, name: string, avatarUrl?: string | null } | null, column?: { __typename?: 'Column', rowId: string, title: string } | null } | null> } | null };


export const CreateTaskDocument = gql`
    mutation CreateTask($input: CreateTaskInput!) {
  createTask(input: $input) {
    task {
      rowId
    }
  }
}
    `;
export const DeleteTaskDocument = gql`
    mutation DeleteTask($rowId: UUID!) {
  deleteTask(input: {rowId: $rowId}) {
    task {
      rowId
    }
  }
}
    `;
export const UpdateTaskDocument = gql`
    mutation UpdateTask($rowId: UUID!, $patch: TaskPatch!) {
  updateTask(input: {rowId: $rowId, patch: $patch}) {
    task {
      rowId
    }
  }
}
    `;
export const TasksDocument = gql`
    query Tasks {
  tasks {
    nodes {
      rowId
      content
      author {
        rowId
        name
        avatarUrl
      }
      projectId
      column {
        rowId
        title
      }
      priority
      createdAt
    }
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string, variables?: any) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType, _variables) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    CreateTask(variables: CreateTaskMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CreateTaskMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateTaskMutation>({ document: CreateTaskDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'CreateTask', 'mutation', variables);
    },
    DeleteTask(variables: DeleteTaskMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DeleteTaskMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteTaskMutation>({ document: DeleteTaskDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'DeleteTask', 'mutation', variables);
    },
    UpdateTask(variables: UpdateTaskMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<UpdateTaskMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateTaskMutation>({ document: UpdateTaskDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'UpdateTask', 'mutation', variables);
    },
    Tasks(variables?: TasksQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<TasksQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<TasksQuery>({ document: TasksDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'Tasks', 'query', variables);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;