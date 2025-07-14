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
  BigFloat: { input: any; output: any; }
  BigInt: { input: string; output: string; }
  Cursor: { input: string; output: string; }
  Datetime: { input: Date; output: Date; }
  UUID: { input: string; output: string; }
};

export type Assignee = Node & {
  __typename?: 'Assignee';
  createdAt: Scalars['Datetime']['output'];
  deletedAt?: Maybe<Scalars['Datetime']['output']>;
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  id: Scalars['ID']['output'];
  rowId: Scalars['UUID']['output'];
  /** Reads a single `Task` that is related to this `Assignee`. */
  task?: Maybe<Task>;
  taskId: Scalars['UUID']['output'];
  updatedAt: Scalars['Datetime']['output'];
  /** Reads a single `User` that is related to this `Assignee`. */
  user?: Maybe<User>;
  userId: Scalars['UUID']['output'];
};

export type AssigneeAggregates = {
  __typename?: 'AssigneeAggregates';
  /** Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset) */
  distinctCount?: Maybe<AssigneeDistinctCountAggregates>;
  keys?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

/** A filter to be used against aggregates of `Assignee` object types. */
export type AssigneeAggregatesFilter = {
  /** Distinct count aggregate over matching `Assignee` objects. */
  distinctCount?: InputMaybe<AssigneeDistinctCountAggregateFilter>;
  /** A filter that must pass for the relevant `Assignee` object to be included within the aggregate. */
  filter?: InputMaybe<AssigneeFilter>;
};

/**
 * A condition to be used against `Assignee` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type AssigneeCondition = {
  /** Checks for equality with the object’s `createdAt` field. */
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `deletedAt` field. */
  deletedAt?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `rowId` field. */
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `taskId` field. */
  taskId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `updatedAt` field. */
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `userId` field. */
  userId?: InputMaybe<Scalars['UUID']['input']>;
};

/** A connection to a list of `Assignee` values. */
export type AssigneeConnection = {
  __typename?: 'AssigneeConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<AssigneeAggregates>;
  /** A list of edges which contains the `Assignee` and cursor to aid in pagination. */
  edges: Array<AssigneeEdge>;
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<Array<AssigneeAggregates>>;
  /** A list of `Assignee` objects. */
  nodes: Array<Assignee>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Assignee` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `Assignee` values. */
export type AssigneeConnectionGroupedAggregatesArgs = {
  groupBy: Array<AssigneeGroupBy>;
  having?: InputMaybe<AssigneeHavingInput>;
};

export type AssigneeDistinctCountAggregateFilter = {
  createdAt?: InputMaybe<BigIntFilter>;
  deletedAt?: InputMaybe<BigIntFilter>;
  rowId?: InputMaybe<BigIntFilter>;
  taskId?: InputMaybe<BigIntFilter>;
  updatedAt?: InputMaybe<BigIntFilter>;
  userId?: InputMaybe<BigIntFilter>;
};

export type AssigneeDistinctCountAggregates = {
  __typename?: 'AssigneeDistinctCountAggregates';
  /** Distinct count of createdAt across the matching connection */
  createdAt?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of deletedAt across the matching connection */
  deletedAt?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of rowId across the matching connection */
  rowId?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of taskId across the matching connection */
  taskId?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of updatedAt across the matching connection */
  updatedAt?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of userId across the matching connection */
  userId?: Maybe<Scalars['BigInt']['output']>;
};

/** A `Assignee` edge in the connection. */
export type AssigneeEdge = {
  __typename?: 'AssigneeEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Assignee` at the end of the edge. */
  node: Assignee;
};

/** A filter to be used against `Assignee` object types. All fields are combined with a logical ‘and.’ */
export type AssigneeFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<AssigneeFilter>>;
  /** Filter by the object’s `createdAt` field. */
  createdAt?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `deletedAt` field. */
  deletedAt?: InputMaybe<DatetimeFilter>;
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
  /** Filter by the object’s `updatedAt` field. */
  updatedAt?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `user` relation. */
  user?: InputMaybe<UserFilter>;
  /** Filter by the object’s `userId` field. */
  userId?: InputMaybe<UuidFilter>;
};

/** Grouping methods for `Assignee` for usage during aggregation. */
export enum AssigneeGroupBy {
  CreatedAt = 'CREATED_AT',
  CreatedAtTruncatedToDay = 'CREATED_AT_TRUNCATED_TO_DAY',
  CreatedAtTruncatedToHour = 'CREATED_AT_TRUNCATED_TO_HOUR',
  DeletedAt = 'DELETED_AT',
  DeletedAtTruncatedToDay = 'DELETED_AT_TRUNCATED_TO_DAY',
  DeletedAtTruncatedToHour = 'DELETED_AT_TRUNCATED_TO_HOUR',
  TaskId = 'TASK_ID',
  UpdatedAt = 'UPDATED_AT',
  UpdatedAtTruncatedToDay = 'UPDATED_AT_TRUNCATED_TO_DAY',
  UpdatedAtTruncatedToHour = 'UPDATED_AT_TRUNCATED_TO_HOUR',
  UserId = 'USER_ID'
}

export type AssigneeHavingAverageInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  deletedAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type AssigneeHavingDistinctCountInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  deletedAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

/** Conditions for `Assignee` aggregates. */
export type AssigneeHavingInput = {
  AND?: InputMaybe<Array<AssigneeHavingInput>>;
  OR?: InputMaybe<Array<AssigneeHavingInput>>;
  average?: InputMaybe<AssigneeHavingAverageInput>;
  distinctCount?: InputMaybe<AssigneeHavingDistinctCountInput>;
  max?: InputMaybe<AssigneeHavingMaxInput>;
  min?: InputMaybe<AssigneeHavingMinInput>;
  stddevPopulation?: InputMaybe<AssigneeHavingStddevPopulationInput>;
  stddevSample?: InputMaybe<AssigneeHavingStddevSampleInput>;
  sum?: InputMaybe<AssigneeHavingSumInput>;
  variancePopulation?: InputMaybe<AssigneeHavingVariancePopulationInput>;
  varianceSample?: InputMaybe<AssigneeHavingVarianceSampleInput>;
};

export type AssigneeHavingMaxInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  deletedAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type AssigneeHavingMinInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  deletedAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type AssigneeHavingStddevPopulationInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  deletedAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type AssigneeHavingStddevSampleInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  deletedAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type AssigneeHavingSumInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  deletedAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type AssigneeHavingVariancePopulationInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  deletedAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type AssigneeHavingVarianceSampleInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  deletedAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
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
  CreatedAtAsc = 'CREATED_AT_ASC',
  CreatedAtDesc = 'CREATED_AT_DESC',
  DeletedAtAsc = 'DELETED_AT_ASC',
  DeletedAtDesc = 'DELETED_AT_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  RowIdAsc = 'ROW_ID_ASC',
  RowIdDesc = 'ROW_ID_DESC',
  TaskIdAsc = 'TASK_ID_ASC',
  TaskIdDesc = 'TASK_ID_DESC',
  UpdatedAtAsc = 'UPDATED_AT_ASC',
  UpdatedAtDesc = 'UPDATED_AT_DESC',
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

/** A filter to be used against BigFloat fields. All fields are combined with a logical ‘and.’ */
export type BigFloatFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['BigFloat']['input']>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['BigFloat']['input']>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['BigFloat']['input']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['BigFloat']['input']>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars['BigFloat']['input']>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['BigFloat']['input']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['BigFloat']['input']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['BigFloat']['input']>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['BigFloat']['input']>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['BigFloat']['input']>>;
};

/** A filter to be used against BigInt fields. All fields are combined with a logical ‘and.’ */
export type BigIntFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['BigInt']['input']>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['BigInt']['input']>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['BigInt']['input']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['BigInt']['input']>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['BigInt']['input']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['BigInt']['input']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['BigInt']['input']>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['BigInt']['input']>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export type Column = Node & {
  __typename?: 'Column';
  createdAt: Scalars['Datetime']['output'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  id: Scalars['ID']['output'];
  index: Scalars['Int']['output'];
  /** Reads a single `Project` that is related to this `Column`. */
  project?: Maybe<Project>;
  projectId: Scalars['UUID']['output'];
  rowId: Scalars['UUID']['output'];
  /** Reads and enables pagination through a set of `Task`. */
  tasks: TaskConnection;
  title: Scalars['String']['output'];
  updatedAt: Scalars['Datetime']['output'];
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

export type ColumnAggregates = {
  __typename?: 'ColumnAggregates';
  /** Mean average aggregates across the matching connection (ignoring before/after/first/last/offset) */
  average?: Maybe<ColumnAverageAggregates>;
  /** Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset) */
  distinctCount?: Maybe<ColumnDistinctCountAggregates>;
  keys?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** Maximum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  max?: Maybe<ColumnMaxAggregates>;
  /** Minimum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  min?: Maybe<ColumnMinAggregates>;
  /** Population standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevPopulation?: Maybe<ColumnStddevPopulationAggregates>;
  /** Sample standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevSample?: Maybe<ColumnStddevSampleAggregates>;
  /** Sum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  sum?: Maybe<ColumnSumAggregates>;
  /** Population variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  variancePopulation?: Maybe<ColumnVariancePopulationAggregates>;
  /** Sample variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  varianceSample?: Maybe<ColumnVarianceSampleAggregates>;
};

/** A filter to be used against aggregates of `Column` object types. */
export type ColumnAggregatesFilter = {
  /** Mean average aggregate over matching `Column` objects. */
  average?: InputMaybe<ColumnAverageAggregateFilter>;
  /** Distinct count aggregate over matching `Column` objects. */
  distinctCount?: InputMaybe<ColumnDistinctCountAggregateFilter>;
  /** A filter that must pass for the relevant `Column` object to be included within the aggregate. */
  filter?: InputMaybe<ColumnFilter>;
  /** Maximum aggregate over matching `Column` objects. */
  max?: InputMaybe<ColumnMaxAggregateFilter>;
  /** Minimum aggregate over matching `Column` objects. */
  min?: InputMaybe<ColumnMinAggregateFilter>;
  /** Population standard deviation aggregate over matching `Column` objects. */
  stddevPopulation?: InputMaybe<ColumnStddevPopulationAggregateFilter>;
  /** Sample standard deviation aggregate over matching `Column` objects. */
  stddevSample?: InputMaybe<ColumnStddevSampleAggregateFilter>;
  /** Sum aggregate over matching `Column` objects. */
  sum?: InputMaybe<ColumnSumAggregateFilter>;
  /** Population variance aggregate over matching `Column` objects. */
  variancePopulation?: InputMaybe<ColumnVariancePopulationAggregateFilter>;
  /** Sample variance aggregate over matching `Column` objects. */
  varianceSample?: InputMaybe<ColumnVarianceSampleAggregateFilter>;
};

export type ColumnAverageAggregateFilter = {
  index?: InputMaybe<BigFloatFilter>;
};

export type ColumnAverageAggregates = {
  __typename?: 'ColumnAverageAggregates';
  /** Mean average of index across the matching connection */
  index?: Maybe<Scalars['BigFloat']['output']>;
};

/** A condition to be used against `Column` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type ColumnCondition = {
  /** Checks for equality with the object’s `createdAt` field. */
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `index` field. */
  index?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `projectId` field. */
  projectId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `rowId` field. */
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `title` field. */
  title?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `updatedAt` field. */
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
};

/** A connection to a list of `Column` values. */
export type ColumnConnection = {
  __typename?: 'ColumnConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<ColumnAggregates>;
  /** A list of edges which contains the `Column` and cursor to aid in pagination. */
  edges: Array<ColumnEdge>;
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<Array<ColumnAggregates>>;
  /** A list of `Column` objects. */
  nodes: Array<Column>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Column` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `Column` values. */
export type ColumnConnectionGroupedAggregatesArgs = {
  groupBy: Array<ColumnGroupBy>;
  having?: InputMaybe<ColumnHavingInput>;
};

export type ColumnDistinctCountAggregateFilter = {
  createdAt?: InputMaybe<BigIntFilter>;
  index?: InputMaybe<BigIntFilter>;
  projectId?: InputMaybe<BigIntFilter>;
  rowId?: InputMaybe<BigIntFilter>;
  title?: InputMaybe<BigIntFilter>;
  updatedAt?: InputMaybe<BigIntFilter>;
};

export type ColumnDistinctCountAggregates = {
  __typename?: 'ColumnDistinctCountAggregates';
  /** Distinct count of createdAt across the matching connection */
  createdAt?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of index across the matching connection */
  index?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of projectId across the matching connection */
  projectId?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of rowId across the matching connection */
  rowId?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of title across the matching connection */
  title?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of updatedAt across the matching connection */
  updatedAt?: Maybe<Scalars['BigInt']['output']>;
};

/** A `Column` edge in the connection. */
export type ColumnEdge = {
  __typename?: 'ColumnEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Column` at the end of the edge. */
  node: Column;
};

/** A filter to be used against `Column` object types. All fields are combined with a logical ‘and.’ */
export type ColumnFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<ColumnFilter>>;
  /** Filter by the object’s `createdAt` field. */
  createdAt?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `index` field. */
  index?: InputMaybe<IntFilter>;
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
  /** Filter by the object’s `title` field. */
  title?: InputMaybe<StringFilter>;
  /** Filter by the object’s `updatedAt` field. */
  updatedAt?: InputMaybe<DatetimeFilter>;
};

/** Grouping methods for `Column` for usage during aggregation. */
export enum ColumnGroupBy {
  CreatedAt = 'CREATED_AT',
  CreatedAtTruncatedToDay = 'CREATED_AT_TRUNCATED_TO_DAY',
  CreatedAtTruncatedToHour = 'CREATED_AT_TRUNCATED_TO_HOUR',
  Index = 'INDEX',
  ProjectId = 'PROJECT_ID',
  Title = 'TITLE',
  UpdatedAt = 'UPDATED_AT',
  UpdatedAtTruncatedToDay = 'UPDATED_AT_TRUNCATED_TO_DAY',
  UpdatedAtTruncatedToHour = 'UPDATED_AT_TRUNCATED_TO_HOUR'
}

export type ColumnHavingAverageInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  index?: InputMaybe<HavingIntFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type ColumnHavingDistinctCountInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  index?: InputMaybe<HavingIntFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

/** Conditions for `Column` aggregates. */
export type ColumnHavingInput = {
  AND?: InputMaybe<Array<ColumnHavingInput>>;
  OR?: InputMaybe<Array<ColumnHavingInput>>;
  average?: InputMaybe<ColumnHavingAverageInput>;
  distinctCount?: InputMaybe<ColumnHavingDistinctCountInput>;
  max?: InputMaybe<ColumnHavingMaxInput>;
  min?: InputMaybe<ColumnHavingMinInput>;
  stddevPopulation?: InputMaybe<ColumnHavingStddevPopulationInput>;
  stddevSample?: InputMaybe<ColumnHavingStddevSampleInput>;
  sum?: InputMaybe<ColumnHavingSumInput>;
  variancePopulation?: InputMaybe<ColumnHavingVariancePopulationInput>;
  varianceSample?: InputMaybe<ColumnHavingVarianceSampleInput>;
};

export type ColumnHavingMaxInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  index?: InputMaybe<HavingIntFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type ColumnHavingMinInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  index?: InputMaybe<HavingIntFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type ColumnHavingStddevPopulationInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  index?: InputMaybe<HavingIntFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type ColumnHavingStddevSampleInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  index?: InputMaybe<HavingIntFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type ColumnHavingSumInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  index?: InputMaybe<HavingIntFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type ColumnHavingVariancePopulationInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  index?: InputMaybe<HavingIntFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type ColumnHavingVarianceSampleInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  index?: InputMaybe<HavingIntFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

/** An input for mutations affecting `Column` */
export type ColumnInput = {
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  index?: InputMaybe<Scalars['Int']['input']>;
  projectId: Scalars['UUID']['input'];
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  title: Scalars['String']['input'];
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
};

export type ColumnMaxAggregateFilter = {
  index?: InputMaybe<IntFilter>;
};

export type ColumnMaxAggregates = {
  __typename?: 'ColumnMaxAggregates';
  /** Maximum of index across the matching connection */
  index?: Maybe<Scalars['Int']['output']>;
};

export type ColumnMinAggregateFilter = {
  index?: InputMaybe<IntFilter>;
};

export type ColumnMinAggregates = {
  __typename?: 'ColumnMinAggregates';
  /** Minimum of index across the matching connection */
  index?: Maybe<Scalars['Int']['output']>;
};

/** Methods to use when ordering `Column`. */
export enum ColumnOrderBy {
  CreatedAtAsc = 'CREATED_AT_ASC',
  CreatedAtDesc = 'CREATED_AT_DESC',
  IndexAsc = 'INDEX_ASC',
  IndexDesc = 'INDEX_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  ProjectIdAsc = 'PROJECT_ID_ASC',
  ProjectIdDesc = 'PROJECT_ID_DESC',
  RowIdAsc = 'ROW_ID_ASC',
  RowIdDesc = 'ROW_ID_DESC',
  TasksAverageColumnIndexAsc = 'TASKS_AVERAGE_COLUMN_INDEX_ASC',
  TasksAverageColumnIndexDesc = 'TASKS_AVERAGE_COLUMN_INDEX_DESC',
  TasksCountAsc = 'TASKS_COUNT_ASC',
  TasksCountDesc = 'TASKS_COUNT_DESC',
  TasksDistinctCountAuthorIdAsc = 'TASKS_DISTINCT_COUNT_AUTHOR_ID_ASC',
  TasksDistinctCountAuthorIdDesc = 'TASKS_DISTINCT_COUNT_AUTHOR_ID_DESC',
  TasksDistinctCountColumnIdAsc = 'TASKS_DISTINCT_COUNT_COLUMN_ID_ASC',
  TasksDistinctCountColumnIdDesc = 'TASKS_DISTINCT_COUNT_COLUMN_ID_DESC',
  TasksDistinctCountColumnIndexAsc = 'TASKS_DISTINCT_COUNT_COLUMN_INDEX_ASC',
  TasksDistinctCountColumnIndexDesc = 'TASKS_DISTINCT_COUNT_COLUMN_INDEX_DESC',
  TasksDistinctCountContentAsc = 'TASKS_DISTINCT_COUNT_CONTENT_ASC',
  TasksDistinctCountContentDesc = 'TASKS_DISTINCT_COUNT_CONTENT_DESC',
  TasksDistinctCountCreatedAtAsc = 'TASKS_DISTINCT_COUNT_CREATED_AT_ASC',
  TasksDistinctCountCreatedAtDesc = 'TASKS_DISTINCT_COUNT_CREATED_AT_DESC',
  TasksDistinctCountDescriptionAsc = 'TASKS_DISTINCT_COUNT_DESCRIPTION_ASC',
  TasksDistinctCountDescriptionDesc = 'TASKS_DISTINCT_COUNT_DESCRIPTION_DESC',
  TasksDistinctCountDueDateAsc = 'TASKS_DISTINCT_COUNT_DUE_DATE_ASC',
  TasksDistinctCountDueDateDesc = 'TASKS_DISTINCT_COUNT_DUE_DATE_DESC',
  TasksDistinctCountPriorityAsc = 'TASKS_DISTINCT_COUNT_PRIORITY_ASC',
  TasksDistinctCountPriorityDesc = 'TASKS_DISTINCT_COUNT_PRIORITY_DESC',
  TasksDistinctCountProjectIdAsc = 'TASKS_DISTINCT_COUNT_PROJECT_ID_ASC',
  TasksDistinctCountProjectIdDesc = 'TASKS_DISTINCT_COUNT_PROJECT_ID_DESC',
  TasksDistinctCountRowIdAsc = 'TASKS_DISTINCT_COUNT_ROW_ID_ASC',
  TasksDistinctCountRowIdDesc = 'TASKS_DISTINCT_COUNT_ROW_ID_DESC',
  TasksDistinctCountUpdatedAtAsc = 'TASKS_DISTINCT_COUNT_UPDATED_AT_ASC',
  TasksDistinctCountUpdatedAtDesc = 'TASKS_DISTINCT_COUNT_UPDATED_AT_DESC',
  TasksMaxColumnIndexAsc = 'TASKS_MAX_COLUMN_INDEX_ASC',
  TasksMaxColumnIndexDesc = 'TASKS_MAX_COLUMN_INDEX_DESC',
  TasksMinColumnIndexAsc = 'TASKS_MIN_COLUMN_INDEX_ASC',
  TasksMinColumnIndexDesc = 'TASKS_MIN_COLUMN_INDEX_DESC',
  TasksStddevPopulationColumnIndexAsc = 'TASKS_STDDEV_POPULATION_COLUMN_INDEX_ASC',
  TasksStddevPopulationColumnIndexDesc = 'TASKS_STDDEV_POPULATION_COLUMN_INDEX_DESC',
  TasksStddevSampleColumnIndexAsc = 'TASKS_STDDEV_SAMPLE_COLUMN_INDEX_ASC',
  TasksStddevSampleColumnIndexDesc = 'TASKS_STDDEV_SAMPLE_COLUMN_INDEX_DESC',
  TasksSumColumnIndexAsc = 'TASKS_SUM_COLUMN_INDEX_ASC',
  TasksSumColumnIndexDesc = 'TASKS_SUM_COLUMN_INDEX_DESC',
  TasksVariancePopulationColumnIndexAsc = 'TASKS_VARIANCE_POPULATION_COLUMN_INDEX_ASC',
  TasksVariancePopulationColumnIndexDesc = 'TASKS_VARIANCE_POPULATION_COLUMN_INDEX_DESC',
  TasksVarianceSampleColumnIndexAsc = 'TASKS_VARIANCE_SAMPLE_COLUMN_INDEX_ASC',
  TasksVarianceSampleColumnIndexDesc = 'TASKS_VARIANCE_SAMPLE_COLUMN_INDEX_DESC',
  TitleAsc = 'TITLE_ASC',
  TitleDesc = 'TITLE_DESC',
  UpdatedAtAsc = 'UPDATED_AT_ASC',
  UpdatedAtDesc = 'UPDATED_AT_DESC'
}

/** Represents an update to a `Column`. Fields that are set will be updated. */
export type ColumnPatch = {
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  index?: InputMaybe<Scalars['Int']['input']>;
  projectId?: InputMaybe<Scalars['UUID']['input']>;
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
};

export type ColumnStddevPopulationAggregateFilter = {
  index?: InputMaybe<BigFloatFilter>;
};

export type ColumnStddevPopulationAggregates = {
  __typename?: 'ColumnStddevPopulationAggregates';
  /** Population standard deviation of index across the matching connection */
  index?: Maybe<Scalars['BigFloat']['output']>;
};

export type ColumnStddevSampleAggregateFilter = {
  index?: InputMaybe<BigFloatFilter>;
};

export type ColumnStddevSampleAggregates = {
  __typename?: 'ColumnStddevSampleAggregates';
  /** Sample standard deviation of index across the matching connection */
  index?: Maybe<Scalars['BigFloat']['output']>;
};

export type ColumnSumAggregateFilter = {
  index?: InputMaybe<BigIntFilter>;
};

export type ColumnSumAggregates = {
  __typename?: 'ColumnSumAggregates';
  /** Sum of index across the matching connection */
  index: Scalars['BigInt']['output'];
};

/** A filter to be used against many `Task` object types. All fields are combined with a logical ‘and.’ */
export type ColumnToManyTaskFilter = {
  /** Aggregates across related `Task` match the filter criteria. */
  aggregates?: InputMaybe<TaskAggregatesFilter>;
  /** Every related `Task` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<TaskFilter>;
  /** No related `Task` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<TaskFilter>;
  /** Some related `Task` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<TaskFilter>;
};

export type ColumnVariancePopulationAggregateFilter = {
  index?: InputMaybe<BigFloatFilter>;
};

export type ColumnVariancePopulationAggregates = {
  __typename?: 'ColumnVariancePopulationAggregates';
  /** Population variance of index across the matching connection */
  index?: Maybe<Scalars['BigFloat']['output']>;
};

export type ColumnVarianceSampleAggregateFilter = {
  index?: InputMaybe<BigFloatFilter>;
};

export type ColumnVarianceSampleAggregates = {
  __typename?: 'ColumnVarianceSampleAggregates';
  /** Sample variance of index across the matching connection */
  index?: Maybe<Scalars['BigFloat']['output']>;
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

/** All input for the create `Label` mutation. */
export type CreateLabelInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The `Label` to be created by this mutation. */
  label: LabelInput;
};

/** The output of our create `Label` mutation. */
export type CreateLabelPayload = {
  __typename?: 'CreateLabelPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `Label` that was created by this mutation. */
  label?: Maybe<Label>;
  /** An edge for our `Label`. May be used by Relay 1. */
  labelEdge?: Maybe<LabelEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our create `Label` mutation. */
export type CreateLabelPayloadLabelEdgeArgs = {
  orderBy?: Array<LabelOrderBy>;
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

/** All input for the create `TaskLabel` mutation. */
export type CreateTaskLabelInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The `TaskLabel` to be created by this mutation. */
  taskLabel: TaskLabelInput;
};

/** The output of our create `TaskLabel` mutation. */
export type CreateTaskLabelPayload = {
  __typename?: 'CreateTaskLabelPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `TaskLabel` that was created by this mutation. */
  taskLabel?: Maybe<TaskLabel>;
  /** An edge for our `TaskLabel`. May be used by Relay 1. */
  taskLabelEdge?: Maybe<TaskLabelEdge>;
};


/** The output of our create `TaskLabel` mutation. */
export type CreateTaskLabelPayloadTaskLabelEdgeArgs = {
  orderBy?: Array<TaskLabelOrderBy>;
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

/** A filter to be used against Datetime fields. All fields are combined with a logical ‘and.’ */
export type DatetimeFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['Datetime']['input']>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['Datetime']['input']>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['Datetime']['input']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['Datetime']['input']>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars['Datetime']['input']>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['Datetime']['input']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['Datetime']['input']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['Datetime']['input']>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['Datetime']['input']>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['Datetime']['input']>>;
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

/** All input for the `deleteLabelById` mutation. */
export type DeleteLabelByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `Label` to be deleted. */
  id: Scalars['ID']['input'];
};

/** All input for the `deleteLabel` mutation. */
export type DeleteLabelInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  rowId: Scalars['UUID']['input'];
};

/** The output of our delete `Label` mutation. */
export type DeleteLabelPayload = {
  __typename?: 'DeleteLabelPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  deletedLabelId?: Maybe<Scalars['ID']['output']>;
  /** The `Label` that was deleted by this mutation. */
  label?: Maybe<Label>;
  /** An edge for our `Label`. May be used by Relay 1. */
  labelEdge?: Maybe<LabelEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our delete `Label` mutation. */
export type DeleteLabelPayloadLabelEdgeArgs = {
  orderBy?: Array<LabelOrderBy>;
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

/** All input for the `deleteTaskLabelById` mutation. */
export type DeleteTaskLabelByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `TaskLabel` to be deleted. */
  id: Scalars['ID']['input'];
};

/** All input for the `deleteTaskLabel` mutation. */
export type DeleteTaskLabelInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  rowId: Scalars['UUID']['input'];
};

/** The output of our delete `TaskLabel` mutation. */
export type DeleteTaskLabelPayload = {
  __typename?: 'DeleteTaskLabelPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  deletedTaskLabelId?: Maybe<Scalars['ID']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `TaskLabel` that was deleted by this mutation. */
  taskLabel?: Maybe<TaskLabel>;
  /** An edge for our `TaskLabel`. May be used by Relay 1. */
  taskLabelEdge?: Maybe<TaskLabelEdge>;
};


/** The output of our delete `TaskLabel` mutation. */
export type DeleteTaskLabelPayloadTaskLabelEdgeArgs = {
  orderBy?: Array<TaskLabelOrderBy>;
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

export type HavingDatetimeFilter = {
  equalTo?: InputMaybe<Scalars['Datetime']['input']>;
  greaterThan?: InputMaybe<Scalars['Datetime']['input']>;
  greaterThanOrEqualTo?: InputMaybe<Scalars['Datetime']['input']>;
  lessThan?: InputMaybe<Scalars['Datetime']['input']>;
  lessThanOrEqualTo?: InputMaybe<Scalars['Datetime']['input']>;
  notEqualTo?: InputMaybe<Scalars['Datetime']['input']>;
};

export type HavingIntFilter = {
  equalTo?: InputMaybe<Scalars['Int']['input']>;
  greaterThan?: InputMaybe<Scalars['Int']['input']>;
  greaterThanOrEqualTo?: InputMaybe<Scalars['Int']['input']>;
  lessThan?: InputMaybe<Scalars['Int']['input']>;
  lessThanOrEqualTo?: InputMaybe<Scalars['Int']['input']>;
  notEqualTo?: InputMaybe<Scalars['Int']['input']>;
};

/** A filter to be used against Int fields. All fields are combined with a logical ‘and.’ */
export type IntFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['Int']['input']>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['Int']['input']>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['Int']['input']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['Int']['input']>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars['Int']['input']>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['Int']['input']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['Int']['input']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['Int']['input']>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['Int']['input']>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type Label = Node & {
  __typename?: 'Label';
  color: Scalars['String']['output'];
  createdAt: Scalars['Datetime']['output'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  /** Reads a single `Project` that is related to this `Label`. */
  project?: Maybe<Project>;
  projectId: Scalars['UUID']['output'];
  rowId: Scalars['UUID']['output'];
  /** Reads and enables pagination through a set of `TaskLabel`. */
  taskLabels: TaskLabelConnection;
  updatedAt: Scalars['Datetime']['output'];
};


export type LabelTaskLabelsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<TaskLabelCondition>;
  filter?: InputMaybe<TaskLabelFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<TaskLabelOrderBy>>;
};

export type LabelAggregates = {
  __typename?: 'LabelAggregates';
  /** Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset) */
  distinctCount?: Maybe<LabelDistinctCountAggregates>;
  keys?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

/** A filter to be used against aggregates of `Label` object types. */
export type LabelAggregatesFilter = {
  /** Distinct count aggregate over matching `Label` objects. */
  distinctCount?: InputMaybe<LabelDistinctCountAggregateFilter>;
  /** A filter that must pass for the relevant `Label` object to be included within the aggregate. */
  filter?: InputMaybe<LabelFilter>;
};

/** A condition to be used against `Label` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type LabelCondition = {
  /** Checks for equality with the object’s `color` field. */
  color?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `createdAt` field. */
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `name` field. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `projectId` field. */
  projectId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `rowId` field. */
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `updatedAt` field. */
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
};

/** A connection to a list of `Label` values. */
export type LabelConnection = {
  __typename?: 'LabelConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<LabelAggregates>;
  /** A list of edges which contains the `Label` and cursor to aid in pagination. */
  edges: Array<LabelEdge>;
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<Array<LabelAggregates>>;
  /** A list of `Label` objects. */
  nodes: Array<Label>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Label` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `Label` values. */
export type LabelConnectionGroupedAggregatesArgs = {
  groupBy: Array<LabelGroupBy>;
  having?: InputMaybe<LabelHavingInput>;
};

export type LabelDistinctCountAggregateFilter = {
  color?: InputMaybe<BigIntFilter>;
  createdAt?: InputMaybe<BigIntFilter>;
  name?: InputMaybe<BigIntFilter>;
  projectId?: InputMaybe<BigIntFilter>;
  rowId?: InputMaybe<BigIntFilter>;
  updatedAt?: InputMaybe<BigIntFilter>;
};

export type LabelDistinctCountAggregates = {
  __typename?: 'LabelDistinctCountAggregates';
  /** Distinct count of color across the matching connection */
  color?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of createdAt across the matching connection */
  createdAt?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of name across the matching connection */
  name?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of projectId across the matching connection */
  projectId?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of rowId across the matching connection */
  rowId?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of updatedAt across the matching connection */
  updatedAt?: Maybe<Scalars['BigInt']['output']>;
};

/** A `Label` edge in the connection. */
export type LabelEdge = {
  __typename?: 'LabelEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Label` at the end of the edge. */
  node: Label;
};

/** A filter to be used against `Label` object types. All fields are combined with a logical ‘and.’ */
export type LabelFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<LabelFilter>>;
  /** Filter by the object’s `color` field. */
  color?: InputMaybe<StringFilter>;
  /** Filter by the object’s `createdAt` field. */
  createdAt?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `name` field. */
  name?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<LabelFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<LabelFilter>>;
  /** Filter by the object’s `project` relation. */
  project?: InputMaybe<ProjectFilter>;
  /** Filter by the object’s `projectId` field. */
  projectId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `rowId` field. */
  rowId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `taskLabels` relation. */
  taskLabels?: InputMaybe<LabelToManyTaskLabelFilter>;
  /** Some related `taskLabels` exist. */
  taskLabelsExist?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `updatedAt` field. */
  updatedAt?: InputMaybe<DatetimeFilter>;
};

/** Grouping methods for `Label` for usage during aggregation. */
export enum LabelGroupBy {
  Color = 'COLOR',
  CreatedAt = 'CREATED_AT',
  CreatedAtTruncatedToDay = 'CREATED_AT_TRUNCATED_TO_DAY',
  CreatedAtTruncatedToHour = 'CREATED_AT_TRUNCATED_TO_HOUR',
  Name = 'NAME',
  ProjectId = 'PROJECT_ID',
  UpdatedAt = 'UPDATED_AT',
  UpdatedAtTruncatedToDay = 'UPDATED_AT_TRUNCATED_TO_DAY',
  UpdatedAtTruncatedToHour = 'UPDATED_AT_TRUNCATED_TO_HOUR'
}

export type LabelHavingAverageInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type LabelHavingDistinctCountInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

/** Conditions for `Label` aggregates. */
export type LabelHavingInput = {
  AND?: InputMaybe<Array<LabelHavingInput>>;
  OR?: InputMaybe<Array<LabelHavingInput>>;
  average?: InputMaybe<LabelHavingAverageInput>;
  distinctCount?: InputMaybe<LabelHavingDistinctCountInput>;
  max?: InputMaybe<LabelHavingMaxInput>;
  min?: InputMaybe<LabelHavingMinInput>;
  stddevPopulation?: InputMaybe<LabelHavingStddevPopulationInput>;
  stddevSample?: InputMaybe<LabelHavingStddevSampleInput>;
  sum?: InputMaybe<LabelHavingSumInput>;
  variancePopulation?: InputMaybe<LabelHavingVariancePopulationInput>;
  varianceSample?: InputMaybe<LabelHavingVarianceSampleInput>;
};

export type LabelHavingMaxInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type LabelHavingMinInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type LabelHavingStddevPopulationInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type LabelHavingStddevSampleInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type LabelHavingSumInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type LabelHavingVariancePopulationInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type LabelHavingVarianceSampleInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

/** An input for mutations affecting `Label` */
export type LabelInput = {
  color: Scalars['String']['input'];
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  name: Scalars['String']['input'];
  projectId: Scalars['UUID']['input'];
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
};

/** Methods to use when ordering `Label`. */
export enum LabelOrderBy {
  ColorAsc = 'COLOR_ASC',
  ColorDesc = 'COLOR_DESC',
  CreatedAtAsc = 'CREATED_AT_ASC',
  CreatedAtDesc = 'CREATED_AT_DESC',
  NameAsc = 'NAME_ASC',
  NameDesc = 'NAME_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  ProjectIdAsc = 'PROJECT_ID_ASC',
  ProjectIdDesc = 'PROJECT_ID_DESC',
  RowIdAsc = 'ROW_ID_ASC',
  RowIdDesc = 'ROW_ID_DESC',
  TaskLabelsCountAsc = 'TASK_LABELS_COUNT_ASC',
  TaskLabelsCountDesc = 'TASK_LABELS_COUNT_DESC',
  TaskLabelsDistinctCountCreatedAtAsc = 'TASK_LABELS_DISTINCT_COUNT_CREATED_AT_ASC',
  TaskLabelsDistinctCountCreatedAtDesc = 'TASK_LABELS_DISTINCT_COUNT_CREATED_AT_DESC',
  TaskLabelsDistinctCountLabelIdAsc = 'TASK_LABELS_DISTINCT_COUNT_LABEL_ID_ASC',
  TaskLabelsDistinctCountLabelIdDesc = 'TASK_LABELS_DISTINCT_COUNT_LABEL_ID_DESC',
  TaskLabelsDistinctCountRowIdAsc = 'TASK_LABELS_DISTINCT_COUNT_ROW_ID_ASC',
  TaskLabelsDistinctCountRowIdDesc = 'TASK_LABELS_DISTINCT_COUNT_ROW_ID_DESC',
  TaskLabelsDistinctCountTaskIdAsc = 'TASK_LABELS_DISTINCT_COUNT_TASK_ID_ASC',
  TaskLabelsDistinctCountTaskIdDesc = 'TASK_LABELS_DISTINCT_COUNT_TASK_ID_DESC',
  TaskLabelsDistinctCountUpdatedAtAsc = 'TASK_LABELS_DISTINCT_COUNT_UPDATED_AT_ASC',
  TaskLabelsDistinctCountUpdatedAtDesc = 'TASK_LABELS_DISTINCT_COUNT_UPDATED_AT_DESC',
  UpdatedAtAsc = 'UPDATED_AT_ASC',
  UpdatedAtDesc = 'UPDATED_AT_DESC'
}

/** Represents an update to a `Label`. Fields that are set will be updated. */
export type LabelPatch = {
  color?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  projectId?: InputMaybe<Scalars['UUID']['input']>;
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
};

/** A filter to be used against many `TaskLabel` object types. All fields are combined with a logical ‘and.’ */
export type LabelToManyTaskLabelFilter = {
  /** Aggregates across related `TaskLabel` match the filter criteria. */
  aggregates?: InputMaybe<TaskLabelAggregatesFilter>;
  /** Every related `TaskLabel` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<TaskLabelFilter>;
  /** No related `TaskLabel` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<TaskLabelFilter>;
  /** Some related `TaskLabel` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<TaskLabelFilter>;
};

/** The root mutation type which contains root level fields which mutate data. */
export type Mutation = {
  __typename?: 'Mutation';
  /** Creates a single `Assignee`. */
  createAssignee?: Maybe<CreateAssigneePayload>;
  /** Creates a single `Column`. */
  createColumn?: Maybe<CreateColumnPayload>;
  /** Creates a single `Label`. */
  createLabel?: Maybe<CreateLabelPayload>;
  /** Creates a single `Post`. */
  createPost?: Maybe<CreatePostPayload>;
  /** Creates a single `Project`. */
  createProject?: Maybe<CreateProjectPayload>;
  /** Creates a single `Task`. */
  createTask?: Maybe<CreateTaskPayload>;
  /** Creates a single `TaskLabel`. */
  createTaskLabel?: Maybe<CreateTaskLabelPayload>;
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
  /** Deletes a single `Label` using a unique key. */
  deleteLabel?: Maybe<DeleteLabelPayload>;
  /** Deletes a single `Label` using its globally unique id. */
  deleteLabelById?: Maybe<DeleteLabelPayload>;
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
  /** Deletes a single `TaskLabel` using a unique key. */
  deleteTaskLabel?: Maybe<DeleteTaskLabelPayload>;
  /** Deletes a single `TaskLabel` using its globally unique id. */
  deleteTaskLabelById?: Maybe<DeleteTaskLabelPayload>;
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
  /** Updates a single `Label` using a unique key and a patch. */
  updateLabel?: Maybe<UpdateLabelPayload>;
  /** Updates a single `Label` using its globally unique id and a patch. */
  updateLabelById?: Maybe<UpdateLabelPayload>;
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
  /** Updates a single `TaskLabel` using a unique key and a patch. */
  updateTaskLabel?: Maybe<UpdateTaskLabelPayload>;
  /** Updates a single `TaskLabel` using its globally unique id and a patch. */
  updateTaskLabelById?: Maybe<UpdateTaskLabelPayload>;
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
export type MutationCreateLabelArgs = {
  input: CreateLabelInput;
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
export type MutationCreateTaskLabelArgs = {
  input: CreateTaskLabelInput;
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
export type MutationDeleteLabelArgs = {
  input: DeleteLabelInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteLabelByIdArgs = {
  input: DeleteLabelByIdInput;
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
export type MutationDeleteTaskLabelArgs = {
  input: DeleteTaskLabelInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteTaskLabelByIdArgs = {
  input: DeleteTaskLabelByIdInput;
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
export type MutationUpdateLabelArgs = {
  input: UpdateLabelInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateLabelByIdArgs = {
  input: UpdateLabelByIdInput;
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
export type MutationUpdateTaskLabelArgs = {
  input: UpdateTaskLabelInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateTaskLabelByIdArgs = {
  input: UpdateTaskLabelByIdInput;
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
  createdAt: Scalars['Datetime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  id: Scalars['ID']['output'];
  rowId: Scalars['UUID']['output'];
  /** Reads a single `Task` that is related to this `Post`. */
  task?: Maybe<Task>;
  taskId: Scalars['UUID']['output'];
  title?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['Datetime']['output'];
};

export type PostAggregates = {
  __typename?: 'PostAggregates';
  /** Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset) */
  distinctCount?: Maybe<PostDistinctCountAggregates>;
  keys?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

/** A filter to be used against aggregates of `Post` object types. */
export type PostAggregatesFilter = {
  /** Distinct count aggregate over matching `Post` objects. */
  distinctCount?: InputMaybe<PostDistinctCountAggregateFilter>;
  /** A filter that must pass for the relevant `Post` object to be included within the aggregate. */
  filter?: InputMaybe<PostFilter>;
};

/** A condition to be used against `Post` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type PostCondition = {
  /** Checks for equality with the object’s `authorId` field. */
  authorId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `createdAt` field. */
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `description` field. */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `rowId` field. */
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `taskId` field. */
  taskId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `title` field. */
  title?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `updatedAt` field. */
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
};

/** A connection to a list of `Post` values. */
export type PostConnection = {
  __typename?: 'PostConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<PostAggregates>;
  /** A list of edges which contains the `Post` and cursor to aid in pagination. */
  edges: Array<PostEdge>;
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<Array<PostAggregates>>;
  /** A list of `Post` objects. */
  nodes: Array<Post>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Post` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `Post` values. */
export type PostConnectionGroupedAggregatesArgs = {
  groupBy: Array<PostGroupBy>;
  having?: InputMaybe<PostHavingInput>;
};

export type PostDistinctCountAggregateFilter = {
  authorId?: InputMaybe<BigIntFilter>;
  createdAt?: InputMaybe<BigIntFilter>;
  description?: InputMaybe<BigIntFilter>;
  rowId?: InputMaybe<BigIntFilter>;
  taskId?: InputMaybe<BigIntFilter>;
  title?: InputMaybe<BigIntFilter>;
  updatedAt?: InputMaybe<BigIntFilter>;
};

export type PostDistinctCountAggregates = {
  __typename?: 'PostDistinctCountAggregates';
  /** Distinct count of authorId across the matching connection */
  authorId?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of createdAt across the matching connection */
  createdAt?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of description across the matching connection */
  description?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of rowId across the matching connection */
  rowId?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of taskId across the matching connection */
  taskId?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of title across the matching connection */
  title?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of updatedAt across the matching connection */
  updatedAt?: Maybe<Scalars['BigInt']['output']>;
};

/** A `Post` edge in the connection. */
export type PostEdge = {
  __typename?: 'PostEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Post` at the end of the edge. */
  node: Post;
};

/** A filter to be used against `Post` object types. All fields are combined with a logical ‘and.’ */
export type PostFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<PostFilter>>;
  /** Filter by the object’s `author` relation. */
  author?: InputMaybe<UserFilter>;
  /** Filter by the object’s `authorId` field. */
  authorId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `createdAt` field. */
  createdAt?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `description` field. */
  description?: InputMaybe<StringFilter>;
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
  /** Filter by the object’s `title` field. */
  title?: InputMaybe<StringFilter>;
  /** Filter by the object’s `updatedAt` field. */
  updatedAt?: InputMaybe<DatetimeFilter>;
};

/** Grouping methods for `Post` for usage during aggregation. */
export enum PostGroupBy {
  AuthorId = 'AUTHOR_ID',
  CreatedAt = 'CREATED_AT',
  CreatedAtTruncatedToDay = 'CREATED_AT_TRUNCATED_TO_DAY',
  CreatedAtTruncatedToHour = 'CREATED_AT_TRUNCATED_TO_HOUR',
  Description = 'DESCRIPTION',
  TaskId = 'TASK_ID',
  Title = 'TITLE',
  UpdatedAt = 'UPDATED_AT',
  UpdatedAtTruncatedToDay = 'UPDATED_AT_TRUNCATED_TO_DAY',
  UpdatedAtTruncatedToHour = 'UPDATED_AT_TRUNCATED_TO_HOUR'
}

export type PostHavingAverageInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type PostHavingDistinctCountInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

/** Conditions for `Post` aggregates. */
export type PostHavingInput = {
  AND?: InputMaybe<Array<PostHavingInput>>;
  OR?: InputMaybe<Array<PostHavingInput>>;
  average?: InputMaybe<PostHavingAverageInput>;
  distinctCount?: InputMaybe<PostHavingDistinctCountInput>;
  max?: InputMaybe<PostHavingMaxInput>;
  min?: InputMaybe<PostHavingMinInput>;
  stddevPopulation?: InputMaybe<PostHavingStddevPopulationInput>;
  stddevSample?: InputMaybe<PostHavingStddevSampleInput>;
  sum?: InputMaybe<PostHavingSumInput>;
  variancePopulation?: InputMaybe<PostHavingVariancePopulationInput>;
  varianceSample?: InputMaybe<PostHavingVarianceSampleInput>;
};

export type PostHavingMaxInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type PostHavingMinInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type PostHavingStddevPopulationInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type PostHavingStddevSampleInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type PostHavingSumInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type PostHavingVariancePopulationInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type PostHavingVarianceSampleInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
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
  CreatedAtAsc = 'CREATED_AT_ASC',
  CreatedAtDesc = 'CREATED_AT_DESC',
  DescriptionAsc = 'DESCRIPTION_ASC',
  DescriptionDesc = 'DESCRIPTION_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  RowIdAsc = 'ROW_ID_ASC',
  RowIdDesc = 'ROW_ID_DESC',
  TaskIdAsc = 'TASK_ID_ASC',
  TaskIdDesc = 'TASK_ID_DESC',
  TitleAsc = 'TITLE_ASC',
  TitleDesc = 'TITLE_DESC',
  UpdatedAtAsc = 'UPDATED_AT_ASC',
  UpdatedAtDesc = 'UPDATED_AT_DESC'
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
  createdAt: Scalars['Datetime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  id: Scalars['ID']['output'];
  /** Reads and enables pagination through a set of `Label`. */
  labels: LabelConnection;
  name: Scalars['String']['output'];
  prefix?: Maybe<Scalars['String']['output']>;
  rowId: Scalars['UUID']['output'];
  status: ProjectStatus;
  /** Reads and enables pagination through a set of `Task`. */
  tasks: TaskConnection;
  updatedAt: Scalars['Datetime']['output'];
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


export type ProjectLabelsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<LabelCondition>;
  filter?: InputMaybe<LabelFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<LabelOrderBy>>;
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

export type ProjectAggregates = {
  __typename?: 'ProjectAggregates';
  /** Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset) */
  distinctCount?: Maybe<ProjectDistinctCountAggregates>;
  keys?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

/** A filter to be used against aggregates of `Project` object types. */
export type ProjectAggregatesFilter = {
  /** Distinct count aggregate over matching `Project` objects. */
  distinctCount?: InputMaybe<ProjectDistinctCountAggregateFilter>;
  /** A filter that must pass for the relevant `Project` object to be included within the aggregate. */
  filter?: InputMaybe<ProjectFilter>;
};

/** A condition to be used against `Project` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type ProjectCondition = {
  /** Checks for equality with the object’s `color` field. */
  color?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `createdAt` field. */
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `description` field. */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `name` field. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `prefix` field. */
  prefix?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `rowId` field. */
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `status` field. */
  status?: InputMaybe<ProjectStatus>;
  /** Checks for equality with the object’s `updatedAt` field. */
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `viewMode` field. */
  viewMode?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `workspaceId` field. */
  workspaceId?: InputMaybe<Scalars['UUID']['input']>;
};

/** A connection to a list of `Project` values. */
export type ProjectConnection = {
  __typename?: 'ProjectConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<ProjectAggregates>;
  /** A list of edges which contains the `Project` and cursor to aid in pagination. */
  edges: Array<ProjectEdge>;
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<Array<ProjectAggregates>>;
  /** A list of `Project` objects. */
  nodes: Array<Project>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Project` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `Project` values. */
export type ProjectConnectionGroupedAggregatesArgs = {
  groupBy: Array<ProjectGroupBy>;
  having?: InputMaybe<ProjectHavingInput>;
};

export type ProjectDistinctCountAggregateFilter = {
  color?: InputMaybe<BigIntFilter>;
  createdAt?: InputMaybe<BigIntFilter>;
  description?: InputMaybe<BigIntFilter>;
  name?: InputMaybe<BigIntFilter>;
  prefix?: InputMaybe<BigIntFilter>;
  rowId?: InputMaybe<BigIntFilter>;
  status?: InputMaybe<BigIntFilter>;
  updatedAt?: InputMaybe<BigIntFilter>;
  viewMode?: InputMaybe<BigIntFilter>;
  workspaceId?: InputMaybe<BigIntFilter>;
};

export type ProjectDistinctCountAggregates = {
  __typename?: 'ProjectDistinctCountAggregates';
  /** Distinct count of color across the matching connection */
  color?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of createdAt across the matching connection */
  createdAt?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of description across the matching connection */
  description?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of name across the matching connection */
  name?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of prefix across the matching connection */
  prefix?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of rowId across the matching connection */
  rowId?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of status across the matching connection */
  status?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of updatedAt across the matching connection */
  updatedAt?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of viewMode across the matching connection */
  viewMode?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of workspaceId across the matching connection */
  workspaceId?: Maybe<Scalars['BigInt']['output']>;
};

/** A `Project` edge in the connection. */
export type ProjectEdge = {
  __typename?: 'ProjectEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Project` at the end of the edge. */
  node: Project;
};

/** A filter to be used against `Project` object types. All fields are combined with a logical ‘and.’ */
export type ProjectFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<ProjectFilter>>;
  /** Filter by the object’s `color` field. */
  color?: InputMaybe<StringFilter>;
  /** Filter by the object’s `columns` relation. */
  columns?: InputMaybe<ProjectToManyColumnFilter>;
  /** Some related `columns` exist. */
  columnsExist?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `createdAt` field. */
  createdAt?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `description` field. */
  description?: InputMaybe<StringFilter>;
  /** Filter by the object’s `labels` relation. */
  labels?: InputMaybe<ProjectToManyLabelFilter>;
  /** Some related `labels` exist. */
  labelsExist?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `name` field. */
  name?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<ProjectFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<ProjectFilter>>;
  /** Filter by the object’s `prefix` field. */
  prefix?: InputMaybe<StringFilter>;
  /** Filter by the object’s `rowId` field. */
  rowId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `status` field. */
  status?: InputMaybe<ProjectStatusFilter>;
  /** Filter by the object’s `tasks` relation. */
  tasks?: InputMaybe<ProjectToManyTaskFilter>;
  /** Some related `tasks` exist. */
  tasksExist?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `updatedAt` field. */
  updatedAt?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `viewMode` field. */
  viewMode?: InputMaybe<StringFilter>;
  /** Filter by the object’s `workspace` relation. */
  workspace?: InputMaybe<WorkspaceFilter>;
  /** Filter by the object’s `workspaceId` field. */
  workspaceId?: InputMaybe<UuidFilter>;
};

/** Grouping methods for `Project` for usage during aggregation. */
export enum ProjectGroupBy {
  Color = 'COLOR',
  CreatedAt = 'CREATED_AT',
  CreatedAtTruncatedToDay = 'CREATED_AT_TRUNCATED_TO_DAY',
  CreatedAtTruncatedToHour = 'CREATED_AT_TRUNCATED_TO_HOUR',
  Description = 'DESCRIPTION',
  Name = 'NAME',
  Prefix = 'PREFIX',
  Status = 'STATUS',
  UpdatedAt = 'UPDATED_AT',
  UpdatedAtTruncatedToDay = 'UPDATED_AT_TRUNCATED_TO_DAY',
  UpdatedAtTruncatedToHour = 'UPDATED_AT_TRUNCATED_TO_HOUR',
  ViewMode = 'VIEW_MODE',
  WorkspaceId = 'WORKSPACE_ID'
}

export type ProjectHavingAverageInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type ProjectHavingDistinctCountInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

/** Conditions for `Project` aggregates. */
export type ProjectHavingInput = {
  AND?: InputMaybe<Array<ProjectHavingInput>>;
  OR?: InputMaybe<Array<ProjectHavingInput>>;
  average?: InputMaybe<ProjectHavingAverageInput>;
  distinctCount?: InputMaybe<ProjectHavingDistinctCountInput>;
  max?: InputMaybe<ProjectHavingMaxInput>;
  min?: InputMaybe<ProjectHavingMinInput>;
  stddevPopulation?: InputMaybe<ProjectHavingStddevPopulationInput>;
  stddevSample?: InputMaybe<ProjectHavingStddevSampleInput>;
  sum?: InputMaybe<ProjectHavingSumInput>;
  variancePopulation?: InputMaybe<ProjectHavingVariancePopulationInput>;
  varianceSample?: InputMaybe<ProjectHavingVarianceSampleInput>;
};

export type ProjectHavingMaxInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type ProjectHavingMinInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type ProjectHavingStddevPopulationInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type ProjectHavingStddevSampleInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type ProjectHavingSumInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type ProjectHavingVariancePopulationInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type ProjectHavingVarianceSampleInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

/** An input for mutations affecting `Project` */
export type ProjectInput = {
  color?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  prefix?: InputMaybe<Scalars['String']['input']>;
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  status?: InputMaybe<ProjectStatus>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
  viewMode?: InputMaybe<Scalars['String']['input']>;
  workspaceId: Scalars['UUID']['input'];
};

/** Methods to use when ordering `Project`. */
export enum ProjectOrderBy {
  ColorAsc = 'COLOR_ASC',
  ColorDesc = 'COLOR_DESC',
  ColumnsAverageIndexAsc = 'COLUMNS_AVERAGE_INDEX_ASC',
  ColumnsAverageIndexDesc = 'COLUMNS_AVERAGE_INDEX_DESC',
  ColumnsCountAsc = 'COLUMNS_COUNT_ASC',
  ColumnsCountDesc = 'COLUMNS_COUNT_DESC',
  ColumnsDistinctCountCreatedAtAsc = 'COLUMNS_DISTINCT_COUNT_CREATED_AT_ASC',
  ColumnsDistinctCountCreatedAtDesc = 'COLUMNS_DISTINCT_COUNT_CREATED_AT_DESC',
  ColumnsDistinctCountIndexAsc = 'COLUMNS_DISTINCT_COUNT_INDEX_ASC',
  ColumnsDistinctCountIndexDesc = 'COLUMNS_DISTINCT_COUNT_INDEX_DESC',
  ColumnsDistinctCountProjectIdAsc = 'COLUMNS_DISTINCT_COUNT_PROJECT_ID_ASC',
  ColumnsDistinctCountProjectIdDesc = 'COLUMNS_DISTINCT_COUNT_PROJECT_ID_DESC',
  ColumnsDistinctCountRowIdAsc = 'COLUMNS_DISTINCT_COUNT_ROW_ID_ASC',
  ColumnsDistinctCountRowIdDesc = 'COLUMNS_DISTINCT_COUNT_ROW_ID_DESC',
  ColumnsDistinctCountTitleAsc = 'COLUMNS_DISTINCT_COUNT_TITLE_ASC',
  ColumnsDistinctCountTitleDesc = 'COLUMNS_DISTINCT_COUNT_TITLE_DESC',
  ColumnsDistinctCountUpdatedAtAsc = 'COLUMNS_DISTINCT_COUNT_UPDATED_AT_ASC',
  ColumnsDistinctCountUpdatedAtDesc = 'COLUMNS_DISTINCT_COUNT_UPDATED_AT_DESC',
  ColumnsMaxIndexAsc = 'COLUMNS_MAX_INDEX_ASC',
  ColumnsMaxIndexDesc = 'COLUMNS_MAX_INDEX_DESC',
  ColumnsMinIndexAsc = 'COLUMNS_MIN_INDEX_ASC',
  ColumnsMinIndexDesc = 'COLUMNS_MIN_INDEX_DESC',
  ColumnsStddevPopulationIndexAsc = 'COLUMNS_STDDEV_POPULATION_INDEX_ASC',
  ColumnsStddevPopulationIndexDesc = 'COLUMNS_STDDEV_POPULATION_INDEX_DESC',
  ColumnsStddevSampleIndexAsc = 'COLUMNS_STDDEV_SAMPLE_INDEX_ASC',
  ColumnsStddevSampleIndexDesc = 'COLUMNS_STDDEV_SAMPLE_INDEX_DESC',
  ColumnsSumIndexAsc = 'COLUMNS_SUM_INDEX_ASC',
  ColumnsSumIndexDesc = 'COLUMNS_SUM_INDEX_DESC',
  ColumnsVariancePopulationIndexAsc = 'COLUMNS_VARIANCE_POPULATION_INDEX_ASC',
  ColumnsVariancePopulationIndexDesc = 'COLUMNS_VARIANCE_POPULATION_INDEX_DESC',
  ColumnsVarianceSampleIndexAsc = 'COLUMNS_VARIANCE_SAMPLE_INDEX_ASC',
  ColumnsVarianceSampleIndexDesc = 'COLUMNS_VARIANCE_SAMPLE_INDEX_DESC',
  CreatedAtAsc = 'CREATED_AT_ASC',
  CreatedAtDesc = 'CREATED_AT_DESC',
  DescriptionAsc = 'DESCRIPTION_ASC',
  DescriptionDesc = 'DESCRIPTION_DESC',
  LabelsCountAsc = 'LABELS_COUNT_ASC',
  LabelsCountDesc = 'LABELS_COUNT_DESC',
  LabelsDistinctCountColorAsc = 'LABELS_DISTINCT_COUNT_COLOR_ASC',
  LabelsDistinctCountColorDesc = 'LABELS_DISTINCT_COUNT_COLOR_DESC',
  LabelsDistinctCountCreatedAtAsc = 'LABELS_DISTINCT_COUNT_CREATED_AT_ASC',
  LabelsDistinctCountCreatedAtDesc = 'LABELS_DISTINCT_COUNT_CREATED_AT_DESC',
  LabelsDistinctCountNameAsc = 'LABELS_DISTINCT_COUNT_NAME_ASC',
  LabelsDistinctCountNameDesc = 'LABELS_DISTINCT_COUNT_NAME_DESC',
  LabelsDistinctCountProjectIdAsc = 'LABELS_DISTINCT_COUNT_PROJECT_ID_ASC',
  LabelsDistinctCountProjectIdDesc = 'LABELS_DISTINCT_COUNT_PROJECT_ID_DESC',
  LabelsDistinctCountRowIdAsc = 'LABELS_DISTINCT_COUNT_ROW_ID_ASC',
  LabelsDistinctCountRowIdDesc = 'LABELS_DISTINCT_COUNT_ROW_ID_DESC',
  LabelsDistinctCountUpdatedAtAsc = 'LABELS_DISTINCT_COUNT_UPDATED_AT_ASC',
  LabelsDistinctCountUpdatedAtDesc = 'LABELS_DISTINCT_COUNT_UPDATED_AT_DESC',
  NameAsc = 'NAME_ASC',
  NameDesc = 'NAME_DESC',
  Natural = 'NATURAL',
  PrefixAsc = 'PREFIX_ASC',
  PrefixDesc = 'PREFIX_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  RowIdAsc = 'ROW_ID_ASC',
  RowIdDesc = 'ROW_ID_DESC',
  StatusAsc = 'STATUS_ASC',
  StatusDesc = 'STATUS_DESC',
  TasksAverageColumnIndexAsc = 'TASKS_AVERAGE_COLUMN_INDEX_ASC',
  TasksAverageColumnIndexDesc = 'TASKS_AVERAGE_COLUMN_INDEX_DESC',
  TasksCountAsc = 'TASKS_COUNT_ASC',
  TasksCountDesc = 'TASKS_COUNT_DESC',
  TasksDistinctCountAuthorIdAsc = 'TASKS_DISTINCT_COUNT_AUTHOR_ID_ASC',
  TasksDistinctCountAuthorIdDesc = 'TASKS_DISTINCT_COUNT_AUTHOR_ID_DESC',
  TasksDistinctCountColumnIdAsc = 'TASKS_DISTINCT_COUNT_COLUMN_ID_ASC',
  TasksDistinctCountColumnIdDesc = 'TASKS_DISTINCT_COUNT_COLUMN_ID_DESC',
  TasksDistinctCountColumnIndexAsc = 'TASKS_DISTINCT_COUNT_COLUMN_INDEX_ASC',
  TasksDistinctCountColumnIndexDesc = 'TASKS_DISTINCT_COUNT_COLUMN_INDEX_DESC',
  TasksDistinctCountContentAsc = 'TASKS_DISTINCT_COUNT_CONTENT_ASC',
  TasksDistinctCountContentDesc = 'TASKS_DISTINCT_COUNT_CONTENT_DESC',
  TasksDistinctCountCreatedAtAsc = 'TASKS_DISTINCT_COUNT_CREATED_AT_ASC',
  TasksDistinctCountCreatedAtDesc = 'TASKS_DISTINCT_COUNT_CREATED_AT_DESC',
  TasksDistinctCountDescriptionAsc = 'TASKS_DISTINCT_COUNT_DESCRIPTION_ASC',
  TasksDistinctCountDescriptionDesc = 'TASKS_DISTINCT_COUNT_DESCRIPTION_DESC',
  TasksDistinctCountDueDateAsc = 'TASKS_DISTINCT_COUNT_DUE_DATE_ASC',
  TasksDistinctCountDueDateDesc = 'TASKS_DISTINCT_COUNT_DUE_DATE_DESC',
  TasksDistinctCountPriorityAsc = 'TASKS_DISTINCT_COUNT_PRIORITY_ASC',
  TasksDistinctCountPriorityDesc = 'TASKS_DISTINCT_COUNT_PRIORITY_DESC',
  TasksDistinctCountProjectIdAsc = 'TASKS_DISTINCT_COUNT_PROJECT_ID_ASC',
  TasksDistinctCountProjectIdDesc = 'TASKS_DISTINCT_COUNT_PROJECT_ID_DESC',
  TasksDistinctCountRowIdAsc = 'TASKS_DISTINCT_COUNT_ROW_ID_ASC',
  TasksDistinctCountRowIdDesc = 'TASKS_DISTINCT_COUNT_ROW_ID_DESC',
  TasksDistinctCountUpdatedAtAsc = 'TASKS_DISTINCT_COUNT_UPDATED_AT_ASC',
  TasksDistinctCountUpdatedAtDesc = 'TASKS_DISTINCT_COUNT_UPDATED_AT_DESC',
  TasksMaxColumnIndexAsc = 'TASKS_MAX_COLUMN_INDEX_ASC',
  TasksMaxColumnIndexDesc = 'TASKS_MAX_COLUMN_INDEX_DESC',
  TasksMinColumnIndexAsc = 'TASKS_MIN_COLUMN_INDEX_ASC',
  TasksMinColumnIndexDesc = 'TASKS_MIN_COLUMN_INDEX_DESC',
  TasksStddevPopulationColumnIndexAsc = 'TASKS_STDDEV_POPULATION_COLUMN_INDEX_ASC',
  TasksStddevPopulationColumnIndexDesc = 'TASKS_STDDEV_POPULATION_COLUMN_INDEX_DESC',
  TasksStddevSampleColumnIndexAsc = 'TASKS_STDDEV_SAMPLE_COLUMN_INDEX_ASC',
  TasksStddevSampleColumnIndexDesc = 'TASKS_STDDEV_SAMPLE_COLUMN_INDEX_DESC',
  TasksSumColumnIndexAsc = 'TASKS_SUM_COLUMN_INDEX_ASC',
  TasksSumColumnIndexDesc = 'TASKS_SUM_COLUMN_INDEX_DESC',
  TasksVariancePopulationColumnIndexAsc = 'TASKS_VARIANCE_POPULATION_COLUMN_INDEX_ASC',
  TasksVariancePopulationColumnIndexDesc = 'TASKS_VARIANCE_POPULATION_COLUMN_INDEX_DESC',
  TasksVarianceSampleColumnIndexAsc = 'TASKS_VARIANCE_SAMPLE_COLUMN_INDEX_ASC',
  TasksVarianceSampleColumnIndexDesc = 'TASKS_VARIANCE_SAMPLE_COLUMN_INDEX_DESC',
  UpdatedAtAsc = 'UPDATED_AT_ASC',
  UpdatedAtDesc = 'UPDATED_AT_DESC',
  ViewModeAsc = 'VIEW_MODE_ASC',
  ViewModeDesc = 'VIEW_MODE_DESC',
  WorkspaceIdAsc = 'WORKSPACE_ID_ASC',
  WorkspaceIdDesc = 'WORKSPACE_ID_DESC'
}

/** Represents an update to a `Project`. Fields that are set will be updated. */
export type ProjectPatch = {
  color?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  prefix?: InputMaybe<Scalars['String']['input']>;
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  status?: InputMaybe<ProjectStatus>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
  viewMode?: InputMaybe<Scalars['String']['input']>;
  workspaceId?: InputMaybe<Scalars['UUID']['input']>;
};

export enum ProjectStatus {
  Completed = 'completed',
  InProgress = 'in_progress',
  Planned = 'planned'
}

/** A filter to be used against ProjectStatus fields. All fields are combined with a logical ‘and.’ */
export type ProjectStatusFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<ProjectStatus>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<ProjectStatus>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<ProjectStatus>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<ProjectStatus>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<ProjectStatus>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<ProjectStatus>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<ProjectStatus>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<ProjectStatus>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<ProjectStatus>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<ProjectStatus>>;
};

/** A filter to be used against many `Column` object types. All fields are combined with a logical ‘and.’ */
export type ProjectToManyColumnFilter = {
  /** Aggregates across related `Column` match the filter criteria. */
  aggregates?: InputMaybe<ColumnAggregatesFilter>;
  /** Every related `Column` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<ColumnFilter>;
  /** No related `Column` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<ColumnFilter>;
  /** Some related `Column` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<ColumnFilter>;
};

/** A filter to be used against many `Label` object types. All fields are combined with a logical ‘and.’ */
export type ProjectToManyLabelFilter = {
  /** Aggregates across related `Label` match the filter criteria. */
  aggregates?: InputMaybe<LabelAggregatesFilter>;
  /** Every related `Label` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<LabelFilter>;
  /** No related `Label` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<LabelFilter>;
  /** Some related `Label` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<LabelFilter>;
};

/** A filter to be used against many `Task` object types. All fields are combined with a logical ‘and.’ */
export type ProjectToManyTaskFilter = {
  /** Aggregates across related `Task` match the filter criteria. */
  aggregates?: InputMaybe<TaskAggregatesFilter>;
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
  /** Get a single `Label`. */
  label?: Maybe<Label>;
  /** Reads a single `Label` using its globally unique `ID`. */
  labelById?: Maybe<Label>;
  /** Reads and enables pagination through a set of `Label`. */
  labels?: Maybe<LabelConnection>;
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
  /** Get a single `TaskLabel`. */
  taskLabel?: Maybe<TaskLabel>;
  /** Reads a single `TaskLabel` using its globally unique `ID`. */
  taskLabelById?: Maybe<TaskLabel>;
  /** Reads and enables pagination through a set of `TaskLabel`. */
  taskLabels?: Maybe<TaskLabelConnection>;
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
export type QueryLabelArgs = {
  rowId: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryLabelByIdArgs = {
  id: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryLabelsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<LabelCondition>;
  filter?: InputMaybe<LabelFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<LabelOrderBy>>;
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
export type QueryTaskLabelArgs = {
  rowId: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryTaskLabelByIdArgs = {
  id: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryTaskLabelsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<TaskLabelCondition>;
  filter?: InputMaybe<TaskLabelFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<TaskLabelOrderBy>>;
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

/** A filter to be used against String fields. All fields are combined with a logical ‘and.’ */
export type StringFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['String']['input']>;
  /** Not equal to the specified value, treating null like an ordinary value (case-insensitive). */
  distinctFromInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Ends with the specified string (case-sensitive). */
  endsWith?: InputMaybe<Scalars['String']['input']>;
  /** Ends with the specified string (case-insensitive). */
  endsWithInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['String']['input']>;
  /** Equal to the specified value (case-insensitive). */
  equalToInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['String']['input']>;
  /** Greater than the specified value (case-insensitive). */
  greaterThanInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['String']['input']>;
  /** Greater than or equal to the specified value (case-insensitive). */
  greaterThanOrEqualToInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Included in the specified list (case-insensitive). */
  inInsensitive?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Contains the specified string (case-sensitive). */
  includes?: InputMaybe<Scalars['String']['input']>;
  /** Contains the specified string (case-insensitive). */
  includesInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['String']['input']>;
  /** Less than the specified value (case-insensitive). */
  lessThanInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['String']['input']>;
  /** Less than or equal to the specified value (case-insensitive). */
  lessThanOrEqualToInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Matches the specified pattern (case-sensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  like?: InputMaybe<Scalars['String']['input']>;
  /** Matches the specified pattern (case-insensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  likeInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['String']['input']>;
  /** Equal to the specified value, treating null like an ordinary value (case-insensitive). */
  notDistinctFromInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Does not end with the specified string (case-sensitive). */
  notEndsWith?: InputMaybe<Scalars['String']['input']>;
  /** Does not end with the specified string (case-insensitive). */
  notEndsWithInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['String']['input']>;
  /** Not equal to the specified value (case-insensitive). */
  notEqualToInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Not included in the specified list (case-insensitive). */
  notInInsensitive?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Does not contain the specified string (case-sensitive). */
  notIncludes?: InputMaybe<Scalars['String']['input']>;
  /** Does not contain the specified string (case-insensitive). */
  notIncludesInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Does not match the specified pattern (case-sensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  notLike?: InputMaybe<Scalars['String']['input']>;
  /** Does not match the specified pattern (case-insensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  notLikeInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Does not start with the specified string (case-sensitive). */
  notStartsWith?: InputMaybe<Scalars['String']['input']>;
  /** Does not start with the specified string (case-insensitive). */
  notStartsWithInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Starts with the specified string (case-sensitive). */
  startsWith?: InputMaybe<Scalars['String']['input']>;
  /** Starts with the specified string (case-insensitive). */
  startsWithInsensitive?: InputMaybe<Scalars['String']['input']>;
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
  columnIndex: Scalars['Int']['output'];
  content: Scalars['String']['output'];
  createdAt: Scalars['Datetime']['output'];
  description: Scalars['String']['output'];
  dueDate?: Maybe<Scalars['Datetime']['output']>;
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  id: Scalars['ID']['output'];
  /** Reads and enables pagination through a set of `Post`. */
  posts: PostConnection;
  priority: Scalars['String']['output'];
  /** Reads a single `Project` that is related to this `Task`. */
  project?: Maybe<Project>;
  projectId: Scalars['UUID']['output'];
  rowId: Scalars['UUID']['output'];
  /** Reads and enables pagination through a set of `TaskLabel`. */
  taskLabels: TaskLabelConnection;
  updatedAt: Scalars['Datetime']['output'];
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


export type TaskTaskLabelsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<TaskLabelCondition>;
  filter?: InputMaybe<TaskLabelFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<TaskLabelOrderBy>>;
};

export type TaskAggregates = {
  __typename?: 'TaskAggregates';
  /** Mean average aggregates across the matching connection (ignoring before/after/first/last/offset) */
  average?: Maybe<TaskAverageAggregates>;
  /** Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset) */
  distinctCount?: Maybe<TaskDistinctCountAggregates>;
  keys?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** Maximum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  max?: Maybe<TaskMaxAggregates>;
  /** Minimum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  min?: Maybe<TaskMinAggregates>;
  /** Population standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevPopulation?: Maybe<TaskStddevPopulationAggregates>;
  /** Sample standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevSample?: Maybe<TaskStddevSampleAggregates>;
  /** Sum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  sum?: Maybe<TaskSumAggregates>;
  /** Population variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  variancePopulation?: Maybe<TaskVariancePopulationAggregates>;
  /** Sample variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  varianceSample?: Maybe<TaskVarianceSampleAggregates>;
};

/** A filter to be used against aggregates of `Task` object types. */
export type TaskAggregatesFilter = {
  /** Mean average aggregate over matching `Task` objects. */
  average?: InputMaybe<TaskAverageAggregateFilter>;
  /** Distinct count aggregate over matching `Task` objects. */
  distinctCount?: InputMaybe<TaskDistinctCountAggregateFilter>;
  /** A filter that must pass for the relevant `Task` object to be included within the aggregate. */
  filter?: InputMaybe<TaskFilter>;
  /** Maximum aggregate over matching `Task` objects. */
  max?: InputMaybe<TaskMaxAggregateFilter>;
  /** Minimum aggregate over matching `Task` objects. */
  min?: InputMaybe<TaskMinAggregateFilter>;
  /** Population standard deviation aggregate over matching `Task` objects. */
  stddevPopulation?: InputMaybe<TaskStddevPopulationAggregateFilter>;
  /** Sample standard deviation aggregate over matching `Task` objects. */
  stddevSample?: InputMaybe<TaskStddevSampleAggregateFilter>;
  /** Sum aggregate over matching `Task` objects. */
  sum?: InputMaybe<TaskSumAggregateFilter>;
  /** Population variance aggregate over matching `Task` objects. */
  variancePopulation?: InputMaybe<TaskVariancePopulationAggregateFilter>;
  /** Sample variance aggregate over matching `Task` objects. */
  varianceSample?: InputMaybe<TaskVarianceSampleAggregateFilter>;
};

export type TaskAverageAggregateFilter = {
  columnIndex?: InputMaybe<BigFloatFilter>;
};

export type TaskAverageAggregates = {
  __typename?: 'TaskAverageAggregates';
  /** Mean average of columnIndex across the matching connection */
  columnIndex?: Maybe<Scalars['BigFloat']['output']>;
};

/** A condition to be used against `Task` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type TaskCondition = {
  /** Checks for equality with the object’s `authorId` field. */
  authorId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `columnId` field. */
  columnId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `columnIndex` field. */
  columnIndex?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `content` field. */
  content?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `createdAt` field. */
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `description` field. */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `dueDate` field. */
  dueDate?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `priority` field. */
  priority?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `projectId` field. */
  projectId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `rowId` field. */
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `updatedAt` field. */
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
};

/** A connection to a list of `Task` values. */
export type TaskConnection = {
  __typename?: 'TaskConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<TaskAggregates>;
  /** A list of edges which contains the `Task` and cursor to aid in pagination. */
  edges: Array<TaskEdge>;
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<Array<TaskAggregates>>;
  /** A list of `Task` objects. */
  nodes: Array<Task>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Task` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `Task` values. */
export type TaskConnectionGroupedAggregatesArgs = {
  groupBy: Array<TaskGroupBy>;
  having?: InputMaybe<TaskHavingInput>;
};

export type TaskDistinctCountAggregateFilter = {
  authorId?: InputMaybe<BigIntFilter>;
  columnId?: InputMaybe<BigIntFilter>;
  columnIndex?: InputMaybe<BigIntFilter>;
  content?: InputMaybe<BigIntFilter>;
  createdAt?: InputMaybe<BigIntFilter>;
  description?: InputMaybe<BigIntFilter>;
  dueDate?: InputMaybe<BigIntFilter>;
  priority?: InputMaybe<BigIntFilter>;
  projectId?: InputMaybe<BigIntFilter>;
  rowId?: InputMaybe<BigIntFilter>;
  updatedAt?: InputMaybe<BigIntFilter>;
};

export type TaskDistinctCountAggregates = {
  __typename?: 'TaskDistinctCountAggregates';
  /** Distinct count of authorId across the matching connection */
  authorId?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of columnId across the matching connection */
  columnId?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of columnIndex across the matching connection */
  columnIndex?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of content across the matching connection */
  content?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of createdAt across the matching connection */
  createdAt?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of description across the matching connection */
  description?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of dueDate across the matching connection */
  dueDate?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of priority across the matching connection */
  priority?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of projectId across the matching connection */
  projectId?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of rowId across the matching connection */
  rowId?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of updatedAt across the matching connection */
  updatedAt?: Maybe<Scalars['BigInt']['output']>;
};

/** A `Task` edge in the connection. */
export type TaskEdge = {
  __typename?: 'TaskEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Task` at the end of the edge. */
  node: Task;
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
  /** Filter by the object’s `authorId` field. */
  authorId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `column` relation. */
  column?: InputMaybe<ColumnFilter>;
  /** Filter by the object’s `columnId` field. */
  columnId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `columnIndex` field. */
  columnIndex?: InputMaybe<IntFilter>;
  /** Filter by the object’s `content` field. */
  content?: InputMaybe<StringFilter>;
  /** Filter by the object’s `createdAt` field. */
  createdAt?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `description` field. */
  description?: InputMaybe<StringFilter>;
  /** Filter by the object’s `dueDate` field. */
  dueDate?: InputMaybe<DatetimeFilter>;
  /** Negates the expression. */
  not?: InputMaybe<TaskFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<TaskFilter>>;
  /** Filter by the object’s `posts` relation. */
  posts?: InputMaybe<TaskToManyPostFilter>;
  /** Some related `posts` exist. */
  postsExist?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `priority` field. */
  priority?: InputMaybe<StringFilter>;
  /** Filter by the object’s `project` relation. */
  project?: InputMaybe<ProjectFilter>;
  /** Filter by the object’s `projectId` field. */
  projectId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `rowId` field. */
  rowId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `taskLabels` relation. */
  taskLabels?: InputMaybe<TaskToManyTaskLabelFilter>;
  /** Some related `taskLabels` exist. */
  taskLabelsExist?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `updatedAt` field. */
  updatedAt?: InputMaybe<DatetimeFilter>;
};

/** Grouping methods for `Task` for usage during aggregation. */
export enum TaskGroupBy {
  AuthorId = 'AUTHOR_ID',
  ColumnId = 'COLUMN_ID',
  ColumnIndex = 'COLUMN_INDEX',
  Content = 'CONTENT',
  CreatedAt = 'CREATED_AT',
  CreatedAtTruncatedToDay = 'CREATED_AT_TRUNCATED_TO_DAY',
  CreatedAtTruncatedToHour = 'CREATED_AT_TRUNCATED_TO_HOUR',
  Description = 'DESCRIPTION',
  DueDate = 'DUE_DATE',
  DueDateTruncatedToDay = 'DUE_DATE_TRUNCATED_TO_DAY',
  DueDateTruncatedToHour = 'DUE_DATE_TRUNCATED_TO_HOUR',
  Priority = 'PRIORITY',
  ProjectId = 'PROJECT_ID',
  UpdatedAt = 'UPDATED_AT',
  UpdatedAtTruncatedToDay = 'UPDATED_AT_TRUNCATED_TO_DAY',
  UpdatedAtTruncatedToHour = 'UPDATED_AT_TRUNCATED_TO_HOUR'
}

export type TaskHavingAverageInput = {
  columnIndex?: InputMaybe<HavingIntFilter>;
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  dueDate?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type TaskHavingDistinctCountInput = {
  columnIndex?: InputMaybe<HavingIntFilter>;
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  dueDate?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

/** Conditions for `Task` aggregates. */
export type TaskHavingInput = {
  AND?: InputMaybe<Array<TaskHavingInput>>;
  OR?: InputMaybe<Array<TaskHavingInput>>;
  average?: InputMaybe<TaskHavingAverageInput>;
  distinctCount?: InputMaybe<TaskHavingDistinctCountInput>;
  max?: InputMaybe<TaskHavingMaxInput>;
  min?: InputMaybe<TaskHavingMinInput>;
  stddevPopulation?: InputMaybe<TaskHavingStddevPopulationInput>;
  stddevSample?: InputMaybe<TaskHavingStddevSampleInput>;
  sum?: InputMaybe<TaskHavingSumInput>;
  variancePopulation?: InputMaybe<TaskHavingVariancePopulationInput>;
  varianceSample?: InputMaybe<TaskHavingVarianceSampleInput>;
};

export type TaskHavingMaxInput = {
  columnIndex?: InputMaybe<HavingIntFilter>;
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  dueDate?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type TaskHavingMinInput = {
  columnIndex?: InputMaybe<HavingIntFilter>;
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  dueDate?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type TaskHavingStddevPopulationInput = {
  columnIndex?: InputMaybe<HavingIntFilter>;
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  dueDate?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type TaskHavingStddevSampleInput = {
  columnIndex?: InputMaybe<HavingIntFilter>;
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  dueDate?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type TaskHavingSumInput = {
  columnIndex?: InputMaybe<HavingIntFilter>;
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  dueDate?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type TaskHavingVariancePopulationInput = {
  columnIndex?: InputMaybe<HavingIntFilter>;
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  dueDate?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type TaskHavingVarianceSampleInput = {
  columnIndex?: InputMaybe<HavingIntFilter>;
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  dueDate?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

/** An input for mutations affecting `Task` */
export type TaskInput = {
  authorId: Scalars['UUID']['input'];
  columnId: Scalars['UUID']['input'];
  columnIndex?: InputMaybe<Scalars['Int']['input']>;
  content: Scalars['String']['input'];
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  description: Scalars['String']['input'];
  dueDate?: InputMaybe<Scalars['Datetime']['input']>;
  priority?: InputMaybe<Scalars['String']['input']>;
  projectId: Scalars['UUID']['input'];
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
};

export type TaskLabel = Node & {
  __typename?: 'TaskLabel';
  createdAt: Scalars['Datetime']['output'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  id: Scalars['ID']['output'];
  /** Reads a single `Label` that is related to this `TaskLabel`. */
  label?: Maybe<Label>;
  labelId: Scalars['UUID']['output'];
  rowId: Scalars['UUID']['output'];
  /** Reads a single `Task` that is related to this `TaskLabel`. */
  task?: Maybe<Task>;
  taskId: Scalars['UUID']['output'];
  updatedAt: Scalars['Datetime']['output'];
};

export type TaskLabelAggregates = {
  __typename?: 'TaskLabelAggregates';
  /** Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset) */
  distinctCount?: Maybe<TaskLabelDistinctCountAggregates>;
  keys?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

/** A filter to be used against aggregates of `TaskLabel` object types. */
export type TaskLabelAggregatesFilter = {
  /** Distinct count aggregate over matching `TaskLabel` objects. */
  distinctCount?: InputMaybe<TaskLabelDistinctCountAggregateFilter>;
  /** A filter that must pass for the relevant `TaskLabel` object to be included within the aggregate. */
  filter?: InputMaybe<TaskLabelFilter>;
};

/**
 * A condition to be used against `TaskLabel` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type TaskLabelCondition = {
  /** Checks for equality with the object’s `createdAt` field. */
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `labelId` field. */
  labelId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `rowId` field. */
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `taskId` field. */
  taskId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `updatedAt` field. */
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
};

/** A connection to a list of `TaskLabel` values. */
export type TaskLabelConnection = {
  __typename?: 'TaskLabelConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<TaskLabelAggregates>;
  /** A list of edges which contains the `TaskLabel` and cursor to aid in pagination. */
  edges: Array<TaskLabelEdge>;
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<Array<TaskLabelAggregates>>;
  /** A list of `TaskLabel` objects. */
  nodes: Array<TaskLabel>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `TaskLabel` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `TaskLabel` values. */
export type TaskLabelConnectionGroupedAggregatesArgs = {
  groupBy: Array<TaskLabelGroupBy>;
  having?: InputMaybe<TaskLabelHavingInput>;
};

export type TaskLabelDistinctCountAggregateFilter = {
  createdAt?: InputMaybe<BigIntFilter>;
  labelId?: InputMaybe<BigIntFilter>;
  rowId?: InputMaybe<BigIntFilter>;
  taskId?: InputMaybe<BigIntFilter>;
  updatedAt?: InputMaybe<BigIntFilter>;
};

export type TaskLabelDistinctCountAggregates = {
  __typename?: 'TaskLabelDistinctCountAggregates';
  /** Distinct count of createdAt across the matching connection */
  createdAt?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of labelId across the matching connection */
  labelId?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of rowId across the matching connection */
  rowId?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of taskId across the matching connection */
  taskId?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of updatedAt across the matching connection */
  updatedAt?: Maybe<Scalars['BigInt']['output']>;
};

/** A `TaskLabel` edge in the connection. */
export type TaskLabelEdge = {
  __typename?: 'TaskLabelEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `TaskLabel` at the end of the edge. */
  node: TaskLabel;
};

/** A filter to be used against `TaskLabel` object types. All fields are combined with a logical ‘and.’ */
export type TaskLabelFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<TaskLabelFilter>>;
  /** Filter by the object’s `createdAt` field. */
  createdAt?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `label` relation. */
  label?: InputMaybe<LabelFilter>;
  /** Filter by the object’s `labelId` field. */
  labelId?: InputMaybe<UuidFilter>;
  /** Negates the expression. */
  not?: InputMaybe<TaskLabelFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<TaskLabelFilter>>;
  /** Filter by the object’s `rowId` field. */
  rowId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `task` relation. */
  task?: InputMaybe<TaskFilter>;
  /** Filter by the object’s `taskId` field. */
  taskId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `updatedAt` field. */
  updatedAt?: InputMaybe<DatetimeFilter>;
};

/** Grouping methods for `TaskLabel` for usage during aggregation. */
export enum TaskLabelGroupBy {
  CreatedAt = 'CREATED_AT',
  CreatedAtTruncatedToDay = 'CREATED_AT_TRUNCATED_TO_DAY',
  CreatedAtTruncatedToHour = 'CREATED_AT_TRUNCATED_TO_HOUR',
  LabelId = 'LABEL_ID',
  TaskId = 'TASK_ID',
  UpdatedAt = 'UPDATED_AT',
  UpdatedAtTruncatedToDay = 'UPDATED_AT_TRUNCATED_TO_DAY',
  UpdatedAtTruncatedToHour = 'UPDATED_AT_TRUNCATED_TO_HOUR'
}

export type TaskLabelHavingAverageInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type TaskLabelHavingDistinctCountInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

/** Conditions for `TaskLabel` aggregates. */
export type TaskLabelHavingInput = {
  AND?: InputMaybe<Array<TaskLabelHavingInput>>;
  OR?: InputMaybe<Array<TaskLabelHavingInput>>;
  average?: InputMaybe<TaskLabelHavingAverageInput>;
  distinctCount?: InputMaybe<TaskLabelHavingDistinctCountInput>;
  max?: InputMaybe<TaskLabelHavingMaxInput>;
  min?: InputMaybe<TaskLabelHavingMinInput>;
  stddevPopulation?: InputMaybe<TaskLabelHavingStddevPopulationInput>;
  stddevSample?: InputMaybe<TaskLabelHavingStddevSampleInput>;
  sum?: InputMaybe<TaskLabelHavingSumInput>;
  variancePopulation?: InputMaybe<TaskLabelHavingVariancePopulationInput>;
  varianceSample?: InputMaybe<TaskLabelHavingVarianceSampleInput>;
};

export type TaskLabelHavingMaxInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type TaskLabelHavingMinInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type TaskLabelHavingStddevPopulationInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type TaskLabelHavingStddevSampleInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type TaskLabelHavingSumInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type TaskLabelHavingVariancePopulationInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type TaskLabelHavingVarianceSampleInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

/** An input for mutations affecting `TaskLabel` */
export type TaskLabelInput = {
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  labelId: Scalars['UUID']['input'];
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  taskId: Scalars['UUID']['input'];
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
};

/** Methods to use when ordering `TaskLabel`. */
export enum TaskLabelOrderBy {
  CreatedAtAsc = 'CREATED_AT_ASC',
  CreatedAtDesc = 'CREATED_AT_DESC',
  LabelIdAsc = 'LABEL_ID_ASC',
  LabelIdDesc = 'LABEL_ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  RowIdAsc = 'ROW_ID_ASC',
  RowIdDesc = 'ROW_ID_DESC',
  TaskIdAsc = 'TASK_ID_ASC',
  TaskIdDesc = 'TASK_ID_DESC',
  UpdatedAtAsc = 'UPDATED_AT_ASC',
  UpdatedAtDesc = 'UPDATED_AT_DESC'
}

/** Represents an update to a `TaskLabel`. Fields that are set will be updated. */
export type TaskLabelPatch = {
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  labelId?: InputMaybe<Scalars['UUID']['input']>;
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  taskId?: InputMaybe<Scalars['UUID']['input']>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
};

export type TaskMaxAggregateFilter = {
  columnIndex?: InputMaybe<IntFilter>;
};

export type TaskMaxAggregates = {
  __typename?: 'TaskMaxAggregates';
  /** Maximum of columnIndex across the matching connection */
  columnIndex?: Maybe<Scalars['Int']['output']>;
};

export type TaskMinAggregateFilter = {
  columnIndex?: InputMaybe<IntFilter>;
};

export type TaskMinAggregates = {
  __typename?: 'TaskMinAggregates';
  /** Minimum of columnIndex across the matching connection */
  columnIndex?: Maybe<Scalars['Int']['output']>;
};

/** Methods to use when ordering `Task`. */
export enum TaskOrderBy {
  AssigneesCountAsc = 'ASSIGNEES_COUNT_ASC',
  AssigneesCountDesc = 'ASSIGNEES_COUNT_DESC',
  AssigneesDistinctCountCreatedAtAsc = 'ASSIGNEES_DISTINCT_COUNT_CREATED_AT_ASC',
  AssigneesDistinctCountCreatedAtDesc = 'ASSIGNEES_DISTINCT_COUNT_CREATED_AT_DESC',
  AssigneesDistinctCountDeletedAtAsc = 'ASSIGNEES_DISTINCT_COUNT_DELETED_AT_ASC',
  AssigneesDistinctCountDeletedAtDesc = 'ASSIGNEES_DISTINCT_COUNT_DELETED_AT_DESC',
  AssigneesDistinctCountRowIdAsc = 'ASSIGNEES_DISTINCT_COUNT_ROW_ID_ASC',
  AssigneesDistinctCountRowIdDesc = 'ASSIGNEES_DISTINCT_COUNT_ROW_ID_DESC',
  AssigneesDistinctCountTaskIdAsc = 'ASSIGNEES_DISTINCT_COUNT_TASK_ID_ASC',
  AssigneesDistinctCountTaskIdDesc = 'ASSIGNEES_DISTINCT_COUNT_TASK_ID_DESC',
  AssigneesDistinctCountUpdatedAtAsc = 'ASSIGNEES_DISTINCT_COUNT_UPDATED_AT_ASC',
  AssigneesDistinctCountUpdatedAtDesc = 'ASSIGNEES_DISTINCT_COUNT_UPDATED_AT_DESC',
  AssigneesDistinctCountUserIdAsc = 'ASSIGNEES_DISTINCT_COUNT_USER_ID_ASC',
  AssigneesDistinctCountUserIdDesc = 'ASSIGNEES_DISTINCT_COUNT_USER_ID_DESC',
  AuthorIdAsc = 'AUTHOR_ID_ASC',
  AuthorIdDesc = 'AUTHOR_ID_DESC',
  ColumnIdAsc = 'COLUMN_ID_ASC',
  ColumnIdDesc = 'COLUMN_ID_DESC',
  ColumnIndexAsc = 'COLUMN_INDEX_ASC',
  ColumnIndexDesc = 'COLUMN_INDEX_DESC',
  ContentAsc = 'CONTENT_ASC',
  ContentDesc = 'CONTENT_DESC',
  CreatedAtAsc = 'CREATED_AT_ASC',
  CreatedAtDesc = 'CREATED_AT_DESC',
  DescriptionAsc = 'DESCRIPTION_ASC',
  DescriptionDesc = 'DESCRIPTION_DESC',
  DueDateAsc = 'DUE_DATE_ASC',
  DueDateDesc = 'DUE_DATE_DESC',
  Natural = 'NATURAL',
  PostsCountAsc = 'POSTS_COUNT_ASC',
  PostsCountDesc = 'POSTS_COUNT_DESC',
  PostsDistinctCountAuthorIdAsc = 'POSTS_DISTINCT_COUNT_AUTHOR_ID_ASC',
  PostsDistinctCountAuthorIdDesc = 'POSTS_DISTINCT_COUNT_AUTHOR_ID_DESC',
  PostsDistinctCountCreatedAtAsc = 'POSTS_DISTINCT_COUNT_CREATED_AT_ASC',
  PostsDistinctCountCreatedAtDesc = 'POSTS_DISTINCT_COUNT_CREATED_AT_DESC',
  PostsDistinctCountDescriptionAsc = 'POSTS_DISTINCT_COUNT_DESCRIPTION_ASC',
  PostsDistinctCountDescriptionDesc = 'POSTS_DISTINCT_COUNT_DESCRIPTION_DESC',
  PostsDistinctCountRowIdAsc = 'POSTS_DISTINCT_COUNT_ROW_ID_ASC',
  PostsDistinctCountRowIdDesc = 'POSTS_DISTINCT_COUNT_ROW_ID_DESC',
  PostsDistinctCountTaskIdAsc = 'POSTS_DISTINCT_COUNT_TASK_ID_ASC',
  PostsDistinctCountTaskIdDesc = 'POSTS_DISTINCT_COUNT_TASK_ID_DESC',
  PostsDistinctCountTitleAsc = 'POSTS_DISTINCT_COUNT_TITLE_ASC',
  PostsDistinctCountTitleDesc = 'POSTS_DISTINCT_COUNT_TITLE_DESC',
  PostsDistinctCountUpdatedAtAsc = 'POSTS_DISTINCT_COUNT_UPDATED_AT_ASC',
  PostsDistinctCountUpdatedAtDesc = 'POSTS_DISTINCT_COUNT_UPDATED_AT_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  PriorityAsc = 'PRIORITY_ASC',
  PriorityDesc = 'PRIORITY_DESC',
  ProjectIdAsc = 'PROJECT_ID_ASC',
  ProjectIdDesc = 'PROJECT_ID_DESC',
  RowIdAsc = 'ROW_ID_ASC',
  RowIdDesc = 'ROW_ID_DESC',
  TaskLabelsCountAsc = 'TASK_LABELS_COUNT_ASC',
  TaskLabelsCountDesc = 'TASK_LABELS_COUNT_DESC',
  TaskLabelsDistinctCountCreatedAtAsc = 'TASK_LABELS_DISTINCT_COUNT_CREATED_AT_ASC',
  TaskLabelsDistinctCountCreatedAtDesc = 'TASK_LABELS_DISTINCT_COUNT_CREATED_AT_DESC',
  TaskLabelsDistinctCountLabelIdAsc = 'TASK_LABELS_DISTINCT_COUNT_LABEL_ID_ASC',
  TaskLabelsDistinctCountLabelIdDesc = 'TASK_LABELS_DISTINCT_COUNT_LABEL_ID_DESC',
  TaskLabelsDistinctCountRowIdAsc = 'TASK_LABELS_DISTINCT_COUNT_ROW_ID_ASC',
  TaskLabelsDistinctCountRowIdDesc = 'TASK_LABELS_DISTINCT_COUNT_ROW_ID_DESC',
  TaskLabelsDistinctCountTaskIdAsc = 'TASK_LABELS_DISTINCT_COUNT_TASK_ID_ASC',
  TaskLabelsDistinctCountTaskIdDesc = 'TASK_LABELS_DISTINCT_COUNT_TASK_ID_DESC',
  TaskLabelsDistinctCountUpdatedAtAsc = 'TASK_LABELS_DISTINCT_COUNT_UPDATED_AT_ASC',
  TaskLabelsDistinctCountUpdatedAtDesc = 'TASK_LABELS_DISTINCT_COUNT_UPDATED_AT_DESC',
  UpdatedAtAsc = 'UPDATED_AT_ASC',
  UpdatedAtDesc = 'UPDATED_AT_DESC'
}

/** Represents an update to a `Task`. Fields that are set will be updated. */
export type TaskPatch = {
  authorId?: InputMaybe<Scalars['UUID']['input']>;
  columnId?: InputMaybe<Scalars['UUID']['input']>;
  columnIndex?: InputMaybe<Scalars['Int']['input']>;
  content?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  dueDate?: InputMaybe<Scalars['Datetime']['input']>;
  priority?: InputMaybe<Scalars['String']['input']>;
  projectId?: InputMaybe<Scalars['UUID']['input']>;
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
};

export type TaskStddevPopulationAggregateFilter = {
  columnIndex?: InputMaybe<BigFloatFilter>;
};

export type TaskStddevPopulationAggregates = {
  __typename?: 'TaskStddevPopulationAggregates';
  /** Population standard deviation of columnIndex across the matching connection */
  columnIndex?: Maybe<Scalars['BigFloat']['output']>;
};

export type TaskStddevSampleAggregateFilter = {
  columnIndex?: InputMaybe<BigFloatFilter>;
};

export type TaskStddevSampleAggregates = {
  __typename?: 'TaskStddevSampleAggregates';
  /** Sample standard deviation of columnIndex across the matching connection */
  columnIndex?: Maybe<Scalars['BigFloat']['output']>;
};

export type TaskSumAggregateFilter = {
  columnIndex?: InputMaybe<BigIntFilter>;
};

export type TaskSumAggregates = {
  __typename?: 'TaskSumAggregates';
  /** Sum of columnIndex across the matching connection */
  columnIndex: Scalars['BigInt']['output'];
};

/** A filter to be used against many `Assignee` object types. All fields are combined with a logical ‘and.’ */
export type TaskToManyAssigneeFilter = {
  /** Aggregates across related `Assignee` match the filter criteria. */
  aggregates?: InputMaybe<AssigneeAggregatesFilter>;
  /** Every related `Assignee` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<AssigneeFilter>;
  /** No related `Assignee` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<AssigneeFilter>;
  /** Some related `Assignee` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<AssigneeFilter>;
};

/** A filter to be used against many `Post` object types. All fields are combined with a logical ‘and.’ */
export type TaskToManyPostFilter = {
  /** Aggregates across related `Post` match the filter criteria. */
  aggregates?: InputMaybe<PostAggregatesFilter>;
  /** Every related `Post` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<PostFilter>;
  /** No related `Post` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<PostFilter>;
  /** Some related `Post` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<PostFilter>;
};

/** A filter to be used against many `TaskLabel` object types. All fields are combined with a logical ‘and.’ */
export type TaskToManyTaskLabelFilter = {
  /** Aggregates across related `TaskLabel` match the filter criteria. */
  aggregates?: InputMaybe<TaskLabelAggregatesFilter>;
  /** Every related `TaskLabel` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<TaskLabelFilter>;
  /** No related `TaskLabel` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<TaskLabelFilter>;
  /** Some related `TaskLabel` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<TaskLabelFilter>;
};

export type TaskVariancePopulationAggregateFilter = {
  columnIndex?: InputMaybe<BigFloatFilter>;
};

export type TaskVariancePopulationAggregates = {
  __typename?: 'TaskVariancePopulationAggregates';
  /** Population variance of columnIndex across the matching connection */
  columnIndex?: Maybe<Scalars['BigFloat']['output']>;
};

export type TaskVarianceSampleAggregateFilter = {
  columnIndex?: InputMaybe<BigFloatFilter>;
};

export type TaskVarianceSampleAggregates = {
  __typename?: 'TaskVarianceSampleAggregates';
  /** Sample variance of columnIndex across the matching connection */
  columnIndex?: Maybe<Scalars['BigFloat']['output']>;
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

/** All input for the `updateLabelById` mutation. */
export type UpdateLabelByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `Label` to be updated. */
  id: Scalars['ID']['input'];
  /** An object where the defined keys will be set on the `Label` being updated. */
  patch: LabelPatch;
};

/** All input for the `updateLabel` mutation. */
export type UpdateLabelInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** An object where the defined keys will be set on the `Label` being updated. */
  patch: LabelPatch;
  rowId: Scalars['UUID']['input'];
};

/** The output of our update `Label` mutation. */
export type UpdateLabelPayload = {
  __typename?: 'UpdateLabelPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `Label` that was updated by this mutation. */
  label?: Maybe<Label>;
  /** An edge for our `Label`. May be used by Relay 1. */
  labelEdge?: Maybe<LabelEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our update `Label` mutation. */
export type UpdateLabelPayloadLabelEdgeArgs = {
  orderBy?: Array<LabelOrderBy>;
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

/** All input for the `updateTaskLabelById` mutation. */
export type UpdateTaskLabelByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `TaskLabel` to be updated. */
  id: Scalars['ID']['input'];
  /** An object where the defined keys will be set on the `TaskLabel` being updated. */
  patch: TaskLabelPatch;
};

/** All input for the `updateTaskLabel` mutation. */
export type UpdateTaskLabelInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** An object where the defined keys will be set on the `TaskLabel` being updated. */
  patch: TaskLabelPatch;
  rowId: Scalars['UUID']['input'];
};

/** The output of our update `TaskLabel` mutation. */
export type UpdateTaskLabelPayload = {
  __typename?: 'UpdateTaskLabelPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `TaskLabel` that was updated by this mutation. */
  taskLabel?: Maybe<TaskLabel>;
  /** An edge for our `TaskLabel`. May be used by Relay 1. */
  taskLabelEdge?: Maybe<TaskLabelEdge>;
};


/** The output of our update `TaskLabel` mutation. */
export type UpdateTaskLabelPayloadTaskLabelEdgeArgs = {
  orderBy?: Array<TaskLabelOrderBy>;
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
  /** Reads and enables pagination through a set of `Task`. */
  authoredTasks: TaskConnection;
  avatarUrl?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Datetime']['output'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  id: Scalars['ID']['output'];
  identityProviderId: Scalars['UUID']['output'];
  name: Scalars['String']['output'];
  rowId: Scalars['UUID']['output'];
  updatedAt: Scalars['Datetime']['output'];
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


export type UserAuthoredTasksArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<TaskCondition>;
  filter?: InputMaybe<TaskFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<TaskOrderBy>>;
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

export type UserAggregates = {
  __typename?: 'UserAggregates';
  /** Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset) */
  distinctCount?: Maybe<UserDistinctCountAggregates>;
  keys?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

/** A condition to be used against `User` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type UserCondition = {
  /** Checks for equality with the object’s `avatarUrl` field. */
  avatarUrl?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `createdAt` field. */
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `identityProviderId` field. */
  identityProviderId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `name` field. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `rowId` field. */
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `updatedAt` field. */
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
};

/** A connection to a list of `User` values. */
export type UserConnection = {
  __typename?: 'UserConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<UserAggregates>;
  /** A list of edges which contains the `User` and cursor to aid in pagination. */
  edges: Array<UserEdge>;
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<Array<UserAggregates>>;
  /** A list of `User` objects. */
  nodes: Array<User>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `User` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `User` values. */
export type UserConnectionGroupedAggregatesArgs = {
  groupBy: Array<UserGroupBy>;
  having?: InputMaybe<UserHavingInput>;
};

export type UserDistinctCountAggregates = {
  __typename?: 'UserDistinctCountAggregates';
  /** Distinct count of avatarUrl across the matching connection */
  avatarUrl?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of createdAt across the matching connection */
  createdAt?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of identityProviderId across the matching connection */
  identityProviderId?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of name across the matching connection */
  name?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of rowId across the matching connection */
  rowId?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of updatedAt across the matching connection */
  updatedAt?: Maybe<Scalars['BigInt']['output']>;
};

/** A `User` edge in the connection. */
export type UserEdge = {
  __typename?: 'UserEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `User` at the end of the edge. */
  node: User;
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
  /** Filter by the object’s `authoredTasks` relation. */
  authoredTasks?: InputMaybe<UserToManyTaskFilter>;
  /** Some related `authoredTasks` exist. */
  authoredTasksExist?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `avatarUrl` field. */
  avatarUrl?: InputMaybe<StringFilter>;
  /** Filter by the object’s `createdAt` field. */
  createdAt?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `identityProviderId` field. */
  identityProviderId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `name` field. */
  name?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<UserFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<UserFilter>>;
  /** Filter by the object’s `rowId` field. */
  rowId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `updatedAt` field. */
  updatedAt?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `workspaceUsers` relation. */
  workspaceUsers?: InputMaybe<UserToManyWorkspaceUserFilter>;
  /** Some related `workspaceUsers` exist. */
  workspaceUsersExist?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Grouping methods for `User` for usage during aggregation. */
export enum UserGroupBy {
  AvatarUrl = 'AVATAR_URL',
  CreatedAt = 'CREATED_AT',
  CreatedAtTruncatedToDay = 'CREATED_AT_TRUNCATED_TO_DAY',
  CreatedAtTruncatedToHour = 'CREATED_AT_TRUNCATED_TO_HOUR',
  Name = 'NAME',
  UpdatedAt = 'UPDATED_AT',
  UpdatedAtTruncatedToDay = 'UPDATED_AT_TRUNCATED_TO_DAY',
  UpdatedAtTruncatedToHour = 'UPDATED_AT_TRUNCATED_TO_HOUR'
}

export type UserHavingAverageInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type UserHavingDistinctCountInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

/** Conditions for `User` aggregates. */
export type UserHavingInput = {
  AND?: InputMaybe<Array<UserHavingInput>>;
  OR?: InputMaybe<Array<UserHavingInput>>;
  average?: InputMaybe<UserHavingAverageInput>;
  distinctCount?: InputMaybe<UserHavingDistinctCountInput>;
  max?: InputMaybe<UserHavingMaxInput>;
  min?: InputMaybe<UserHavingMinInput>;
  stddevPopulation?: InputMaybe<UserHavingStddevPopulationInput>;
  stddevSample?: InputMaybe<UserHavingStddevSampleInput>;
  sum?: InputMaybe<UserHavingSumInput>;
  variancePopulation?: InputMaybe<UserHavingVariancePopulationInput>;
  varianceSample?: InputMaybe<UserHavingVarianceSampleInput>;
};

export type UserHavingMaxInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type UserHavingMinInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type UserHavingStddevPopulationInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type UserHavingStddevSampleInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type UserHavingSumInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type UserHavingVariancePopulationInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type UserHavingVarianceSampleInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
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
  AssigneesCountAsc = 'ASSIGNEES_COUNT_ASC',
  AssigneesCountDesc = 'ASSIGNEES_COUNT_DESC',
  AssigneesDistinctCountCreatedAtAsc = 'ASSIGNEES_DISTINCT_COUNT_CREATED_AT_ASC',
  AssigneesDistinctCountCreatedAtDesc = 'ASSIGNEES_DISTINCT_COUNT_CREATED_AT_DESC',
  AssigneesDistinctCountDeletedAtAsc = 'ASSIGNEES_DISTINCT_COUNT_DELETED_AT_ASC',
  AssigneesDistinctCountDeletedAtDesc = 'ASSIGNEES_DISTINCT_COUNT_DELETED_AT_DESC',
  AssigneesDistinctCountRowIdAsc = 'ASSIGNEES_DISTINCT_COUNT_ROW_ID_ASC',
  AssigneesDistinctCountRowIdDesc = 'ASSIGNEES_DISTINCT_COUNT_ROW_ID_DESC',
  AssigneesDistinctCountTaskIdAsc = 'ASSIGNEES_DISTINCT_COUNT_TASK_ID_ASC',
  AssigneesDistinctCountTaskIdDesc = 'ASSIGNEES_DISTINCT_COUNT_TASK_ID_DESC',
  AssigneesDistinctCountUpdatedAtAsc = 'ASSIGNEES_DISTINCT_COUNT_UPDATED_AT_ASC',
  AssigneesDistinctCountUpdatedAtDesc = 'ASSIGNEES_DISTINCT_COUNT_UPDATED_AT_DESC',
  AssigneesDistinctCountUserIdAsc = 'ASSIGNEES_DISTINCT_COUNT_USER_ID_ASC',
  AssigneesDistinctCountUserIdDesc = 'ASSIGNEES_DISTINCT_COUNT_USER_ID_DESC',
  AuthoredPostsCountAsc = 'AUTHORED_POSTS_COUNT_ASC',
  AuthoredPostsCountDesc = 'AUTHORED_POSTS_COUNT_DESC',
  AuthoredPostsDistinctCountAuthorIdAsc = 'AUTHORED_POSTS_DISTINCT_COUNT_AUTHOR_ID_ASC',
  AuthoredPostsDistinctCountAuthorIdDesc = 'AUTHORED_POSTS_DISTINCT_COUNT_AUTHOR_ID_DESC',
  AuthoredPostsDistinctCountCreatedAtAsc = 'AUTHORED_POSTS_DISTINCT_COUNT_CREATED_AT_ASC',
  AuthoredPostsDistinctCountCreatedAtDesc = 'AUTHORED_POSTS_DISTINCT_COUNT_CREATED_AT_DESC',
  AuthoredPostsDistinctCountDescriptionAsc = 'AUTHORED_POSTS_DISTINCT_COUNT_DESCRIPTION_ASC',
  AuthoredPostsDistinctCountDescriptionDesc = 'AUTHORED_POSTS_DISTINCT_COUNT_DESCRIPTION_DESC',
  AuthoredPostsDistinctCountRowIdAsc = 'AUTHORED_POSTS_DISTINCT_COUNT_ROW_ID_ASC',
  AuthoredPostsDistinctCountRowIdDesc = 'AUTHORED_POSTS_DISTINCT_COUNT_ROW_ID_DESC',
  AuthoredPostsDistinctCountTaskIdAsc = 'AUTHORED_POSTS_DISTINCT_COUNT_TASK_ID_ASC',
  AuthoredPostsDistinctCountTaskIdDesc = 'AUTHORED_POSTS_DISTINCT_COUNT_TASK_ID_DESC',
  AuthoredPostsDistinctCountTitleAsc = 'AUTHORED_POSTS_DISTINCT_COUNT_TITLE_ASC',
  AuthoredPostsDistinctCountTitleDesc = 'AUTHORED_POSTS_DISTINCT_COUNT_TITLE_DESC',
  AuthoredPostsDistinctCountUpdatedAtAsc = 'AUTHORED_POSTS_DISTINCT_COUNT_UPDATED_AT_ASC',
  AuthoredPostsDistinctCountUpdatedAtDesc = 'AUTHORED_POSTS_DISTINCT_COUNT_UPDATED_AT_DESC',
  AuthoredTasksAverageColumnIndexAsc = 'AUTHORED_TASKS_AVERAGE_COLUMN_INDEX_ASC',
  AuthoredTasksAverageColumnIndexDesc = 'AUTHORED_TASKS_AVERAGE_COLUMN_INDEX_DESC',
  AuthoredTasksCountAsc = 'AUTHORED_TASKS_COUNT_ASC',
  AuthoredTasksCountDesc = 'AUTHORED_TASKS_COUNT_DESC',
  AuthoredTasksDistinctCountAuthorIdAsc = 'AUTHORED_TASKS_DISTINCT_COUNT_AUTHOR_ID_ASC',
  AuthoredTasksDistinctCountAuthorIdDesc = 'AUTHORED_TASKS_DISTINCT_COUNT_AUTHOR_ID_DESC',
  AuthoredTasksDistinctCountColumnIdAsc = 'AUTHORED_TASKS_DISTINCT_COUNT_COLUMN_ID_ASC',
  AuthoredTasksDistinctCountColumnIdDesc = 'AUTHORED_TASKS_DISTINCT_COUNT_COLUMN_ID_DESC',
  AuthoredTasksDistinctCountColumnIndexAsc = 'AUTHORED_TASKS_DISTINCT_COUNT_COLUMN_INDEX_ASC',
  AuthoredTasksDistinctCountColumnIndexDesc = 'AUTHORED_TASKS_DISTINCT_COUNT_COLUMN_INDEX_DESC',
  AuthoredTasksDistinctCountContentAsc = 'AUTHORED_TASKS_DISTINCT_COUNT_CONTENT_ASC',
  AuthoredTasksDistinctCountContentDesc = 'AUTHORED_TASKS_DISTINCT_COUNT_CONTENT_DESC',
  AuthoredTasksDistinctCountCreatedAtAsc = 'AUTHORED_TASKS_DISTINCT_COUNT_CREATED_AT_ASC',
  AuthoredTasksDistinctCountCreatedAtDesc = 'AUTHORED_TASKS_DISTINCT_COUNT_CREATED_AT_DESC',
  AuthoredTasksDistinctCountDescriptionAsc = 'AUTHORED_TASKS_DISTINCT_COUNT_DESCRIPTION_ASC',
  AuthoredTasksDistinctCountDescriptionDesc = 'AUTHORED_TASKS_DISTINCT_COUNT_DESCRIPTION_DESC',
  AuthoredTasksDistinctCountDueDateAsc = 'AUTHORED_TASKS_DISTINCT_COUNT_DUE_DATE_ASC',
  AuthoredTasksDistinctCountDueDateDesc = 'AUTHORED_TASKS_DISTINCT_COUNT_DUE_DATE_DESC',
  AuthoredTasksDistinctCountPriorityAsc = 'AUTHORED_TASKS_DISTINCT_COUNT_PRIORITY_ASC',
  AuthoredTasksDistinctCountPriorityDesc = 'AUTHORED_TASKS_DISTINCT_COUNT_PRIORITY_DESC',
  AuthoredTasksDistinctCountProjectIdAsc = 'AUTHORED_TASKS_DISTINCT_COUNT_PROJECT_ID_ASC',
  AuthoredTasksDistinctCountProjectIdDesc = 'AUTHORED_TASKS_DISTINCT_COUNT_PROJECT_ID_DESC',
  AuthoredTasksDistinctCountRowIdAsc = 'AUTHORED_TASKS_DISTINCT_COUNT_ROW_ID_ASC',
  AuthoredTasksDistinctCountRowIdDesc = 'AUTHORED_TASKS_DISTINCT_COUNT_ROW_ID_DESC',
  AuthoredTasksDistinctCountUpdatedAtAsc = 'AUTHORED_TASKS_DISTINCT_COUNT_UPDATED_AT_ASC',
  AuthoredTasksDistinctCountUpdatedAtDesc = 'AUTHORED_TASKS_DISTINCT_COUNT_UPDATED_AT_DESC',
  AuthoredTasksMaxColumnIndexAsc = 'AUTHORED_TASKS_MAX_COLUMN_INDEX_ASC',
  AuthoredTasksMaxColumnIndexDesc = 'AUTHORED_TASKS_MAX_COLUMN_INDEX_DESC',
  AuthoredTasksMinColumnIndexAsc = 'AUTHORED_TASKS_MIN_COLUMN_INDEX_ASC',
  AuthoredTasksMinColumnIndexDesc = 'AUTHORED_TASKS_MIN_COLUMN_INDEX_DESC',
  AuthoredTasksStddevPopulationColumnIndexAsc = 'AUTHORED_TASKS_STDDEV_POPULATION_COLUMN_INDEX_ASC',
  AuthoredTasksStddevPopulationColumnIndexDesc = 'AUTHORED_TASKS_STDDEV_POPULATION_COLUMN_INDEX_DESC',
  AuthoredTasksStddevSampleColumnIndexAsc = 'AUTHORED_TASKS_STDDEV_SAMPLE_COLUMN_INDEX_ASC',
  AuthoredTasksStddevSampleColumnIndexDesc = 'AUTHORED_TASKS_STDDEV_SAMPLE_COLUMN_INDEX_DESC',
  AuthoredTasksSumColumnIndexAsc = 'AUTHORED_TASKS_SUM_COLUMN_INDEX_ASC',
  AuthoredTasksSumColumnIndexDesc = 'AUTHORED_TASKS_SUM_COLUMN_INDEX_DESC',
  AuthoredTasksVariancePopulationColumnIndexAsc = 'AUTHORED_TASKS_VARIANCE_POPULATION_COLUMN_INDEX_ASC',
  AuthoredTasksVariancePopulationColumnIndexDesc = 'AUTHORED_TASKS_VARIANCE_POPULATION_COLUMN_INDEX_DESC',
  AuthoredTasksVarianceSampleColumnIndexAsc = 'AUTHORED_TASKS_VARIANCE_SAMPLE_COLUMN_INDEX_ASC',
  AuthoredTasksVarianceSampleColumnIndexDesc = 'AUTHORED_TASKS_VARIANCE_SAMPLE_COLUMN_INDEX_DESC',
  AvatarUrlAsc = 'AVATAR_URL_ASC',
  AvatarUrlDesc = 'AVATAR_URL_DESC',
  CreatedAtAsc = 'CREATED_AT_ASC',
  CreatedAtDesc = 'CREATED_AT_DESC',
  IdentityProviderIdAsc = 'IDENTITY_PROVIDER_ID_ASC',
  IdentityProviderIdDesc = 'IDENTITY_PROVIDER_ID_DESC',
  NameAsc = 'NAME_ASC',
  NameDesc = 'NAME_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  RowIdAsc = 'ROW_ID_ASC',
  RowIdDesc = 'ROW_ID_DESC',
  UpdatedAtAsc = 'UPDATED_AT_ASC',
  UpdatedAtDesc = 'UPDATED_AT_DESC',
  WorkspaceUsersCountAsc = 'WORKSPACE_USERS_COUNT_ASC',
  WorkspaceUsersCountDesc = 'WORKSPACE_USERS_COUNT_DESC',
  WorkspaceUsersDistinctCountCreatedAtAsc = 'WORKSPACE_USERS_DISTINCT_COUNT_CREATED_AT_ASC',
  WorkspaceUsersDistinctCountCreatedAtDesc = 'WORKSPACE_USERS_DISTINCT_COUNT_CREATED_AT_DESC',
  WorkspaceUsersDistinctCountUserIdAsc = 'WORKSPACE_USERS_DISTINCT_COUNT_USER_ID_ASC',
  WorkspaceUsersDistinctCountUserIdDesc = 'WORKSPACE_USERS_DISTINCT_COUNT_USER_ID_DESC',
  WorkspaceUsersDistinctCountWorkspaceIdAsc = 'WORKSPACE_USERS_DISTINCT_COUNT_WORKSPACE_ID_ASC',
  WorkspaceUsersDistinctCountWorkspaceIdDesc = 'WORKSPACE_USERS_DISTINCT_COUNT_WORKSPACE_ID_DESC'
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
  /** Aggregates across related `Assignee` match the filter criteria. */
  aggregates?: InputMaybe<AssigneeAggregatesFilter>;
  /** Every related `Assignee` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<AssigneeFilter>;
  /** No related `Assignee` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<AssigneeFilter>;
  /** Some related `Assignee` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<AssigneeFilter>;
};

/** A filter to be used against many `Post` object types. All fields are combined with a logical ‘and.’ */
export type UserToManyPostFilter = {
  /** Aggregates across related `Post` match the filter criteria. */
  aggregates?: InputMaybe<PostAggregatesFilter>;
  /** Every related `Post` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<PostFilter>;
  /** No related `Post` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<PostFilter>;
  /** Some related `Post` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<PostFilter>;
};

/** A filter to be used against many `Task` object types. All fields are combined with a logical ‘and.’ */
export type UserToManyTaskFilter = {
  /** Aggregates across related `Task` match the filter criteria. */
  aggregates?: InputMaybe<TaskAggregatesFilter>;
  /** Every related `Task` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<TaskFilter>;
  /** No related `Task` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<TaskFilter>;
  /** Some related `Task` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<TaskFilter>;
};

/** A filter to be used against many `WorkspaceUser` object types. All fields are combined with a logical ‘and.’ */
export type UserToManyWorkspaceUserFilter = {
  /** Aggregates across related `WorkspaceUser` match the filter criteria. */
  aggregates?: InputMaybe<WorkspaceUserAggregatesFilter>;
  /** Every related `WorkspaceUser` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<WorkspaceUserFilter>;
  /** No related `WorkspaceUser` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<WorkspaceUserFilter>;
  /** Some related `WorkspaceUser` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<WorkspaceUserFilter>;
};

export type Workspace = Node & {
  __typename?: 'Workspace';
  createdAt: Scalars['Datetime']['output'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  /** Reads and enables pagination through a set of `Project`. */
  projects: ProjectConnection;
  rowId: Scalars['UUID']['output'];
  updatedAt: Scalars['Datetime']['output'];
  viewMode: Scalars['String']['output'];
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

export type WorkspaceAggregates = {
  __typename?: 'WorkspaceAggregates';
  /** Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset) */
  distinctCount?: Maybe<WorkspaceDistinctCountAggregates>;
  keys?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

/**
 * A condition to be used against `Workspace` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type WorkspaceCondition = {
  /** Checks for equality with the object’s `createdAt` field. */
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `name` field. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `rowId` field. */
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `updatedAt` field. */
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `viewMode` field. */
  viewMode?: InputMaybe<Scalars['String']['input']>;
};

/** A connection to a list of `Workspace` values. */
export type WorkspaceConnection = {
  __typename?: 'WorkspaceConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<WorkspaceAggregates>;
  /** A list of edges which contains the `Workspace` and cursor to aid in pagination. */
  edges: Array<WorkspaceEdge>;
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<Array<WorkspaceAggregates>>;
  /** A list of `Workspace` objects. */
  nodes: Array<Workspace>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Workspace` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `Workspace` values. */
export type WorkspaceConnectionGroupedAggregatesArgs = {
  groupBy: Array<WorkspaceGroupBy>;
  having?: InputMaybe<WorkspaceHavingInput>;
};

export type WorkspaceDistinctCountAggregates = {
  __typename?: 'WorkspaceDistinctCountAggregates';
  /** Distinct count of createdAt across the matching connection */
  createdAt?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of name across the matching connection */
  name?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of rowId across the matching connection */
  rowId?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of updatedAt across the matching connection */
  updatedAt?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of viewMode across the matching connection */
  viewMode?: Maybe<Scalars['BigInt']['output']>;
};

/** A `Workspace` edge in the connection. */
export type WorkspaceEdge = {
  __typename?: 'WorkspaceEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Workspace` at the end of the edge. */
  node: Workspace;
};

/** A filter to be used against `Workspace` object types. All fields are combined with a logical ‘and.’ */
export type WorkspaceFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<WorkspaceFilter>>;
  /** Filter by the object’s `createdAt` field. */
  createdAt?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `name` field. */
  name?: InputMaybe<StringFilter>;
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
  /** Filter by the object’s `updatedAt` field. */
  updatedAt?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `viewMode` field. */
  viewMode?: InputMaybe<StringFilter>;
  /** Filter by the object’s `workspaceUsers` relation. */
  workspaceUsers?: InputMaybe<WorkspaceToManyWorkspaceUserFilter>;
  /** Some related `workspaceUsers` exist. */
  workspaceUsersExist?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Grouping methods for `Workspace` for usage during aggregation. */
export enum WorkspaceGroupBy {
  CreatedAt = 'CREATED_AT',
  CreatedAtTruncatedToDay = 'CREATED_AT_TRUNCATED_TO_DAY',
  CreatedAtTruncatedToHour = 'CREATED_AT_TRUNCATED_TO_HOUR',
  Name = 'NAME',
  UpdatedAt = 'UPDATED_AT',
  UpdatedAtTruncatedToDay = 'UPDATED_AT_TRUNCATED_TO_DAY',
  UpdatedAtTruncatedToHour = 'UPDATED_AT_TRUNCATED_TO_HOUR',
  ViewMode = 'VIEW_MODE'
}

export type WorkspaceHavingAverageInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type WorkspaceHavingDistinctCountInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

/** Conditions for `Workspace` aggregates. */
export type WorkspaceHavingInput = {
  AND?: InputMaybe<Array<WorkspaceHavingInput>>;
  OR?: InputMaybe<Array<WorkspaceHavingInput>>;
  average?: InputMaybe<WorkspaceHavingAverageInput>;
  distinctCount?: InputMaybe<WorkspaceHavingDistinctCountInput>;
  max?: InputMaybe<WorkspaceHavingMaxInput>;
  min?: InputMaybe<WorkspaceHavingMinInput>;
  stddevPopulation?: InputMaybe<WorkspaceHavingStddevPopulationInput>;
  stddevSample?: InputMaybe<WorkspaceHavingStddevSampleInput>;
  sum?: InputMaybe<WorkspaceHavingSumInput>;
  variancePopulation?: InputMaybe<WorkspaceHavingVariancePopulationInput>;
  varianceSample?: InputMaybe<WorkspaceHavingVarianceSampleInput>;
};

export type WorkspaceHavingMaxInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type WorkspaceHavingMinInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type WorkspaceHavingStddevPopulationInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type WorkspaceHavingStddevSampleInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type WorkspaceHavingSumInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type WorkspaceHavingVariancePopulationInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type WorkspaceHavingVarianceSampleInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

/** An input for mutations affecting `Workspace` */
export type WorkspaceInput = {
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  name: Scalars['String']['input'];
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
  viewMode?: InputMaybe<Scalars['String']['input']>;
};

/** Methods to use when ordering `Workspace`. */
export enum WorkspaceOrderBy {
  CreatedAtAsc = 'CREATED_AT_ASC',
  CreatedAtDesc = 'CREATED_AT_DESC',
  NameAsc = 'NAME_ASC',
  NameDesc = 'NAME_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  ProjectsCountAsc = 'PROJECTS_COUNT_ASC',
  ProjectsCountDesc = 'PROJECTS_COUNT_DESC',
  ProjectsDistinctCountColorAsc = 'PROJECTS_DISTINCT_COUNT_COLOR_ASC',
  ProjectsDistinctCountColorDesc = 'PROJECTS_DISTINCT_COUNT_COLOR_DESC',
  ProjectsDistinctCountCreatedAtAsc = 'PROJECTS_DISTINCT_COUNT_CREATED_AT_ASC',
  ProjectsDistinctCountCreatedAtDesc = 'PROJECTS_DISTINCT_COUNT_CREATED_AT_DESC',
  ProjectsDistinctCountDescriptionAsc = 'PROJECTS_DISTINCT_COUNT_DESCRIPTION_ASC',
  ProjectsDistinctCountDescriptionDesc = 'PROJECTS_DISTINCT_COUNT_DESCRIPTION_DESC',
  ProjectsDistinctCountNameAsc = 'PROJECTS_DISTINCT_COUNT_NAME_ASC',
  ProjectsDistinctCountNameDesc = 'PROJECTS_DISTINCT_COUNT_NAME_DESC',
  ProjectsDistinctCountPrefixAsc = 'PROJECTS_DISTINCT_COUNT_PREFIX_ASC',
  ProjectsDistinctCountPrefixDesc = 'PROJECTS_DISTINCT_COUNT_PREFIX_DESC',
  ProjectsDistinctCountRowIdAsc = 'PROJECTS_DISTINCT_COUNT_ROW_ID_ASC',
  ProjectsDistinctCountRowIdDesc = 'PROJECTS_DISTINCT_COUNT_ROW_ID_DESC',
  ProjectsDistinctCountStatusAsc = 'PROJECTS_DISTINCT_COUNT_STATUS_ASC',
  ProjectsDistinctCountStatusDesc = 'PROJECTS_DISTINCT_COUNT_STATUS_DESC',
  ProjectsDistinctCountUpdatedAtAsc = 'PROJECTS_DISTINCT_COUNT_UPDATED_AT_ASC',
  ProjectsDistinctCountUpdatedAtDesc = 'PROJECTS_DISTINCT_COUNT_UPDATED_AT_DESC',
  ProjectsDistinctCountViewModeAsc = 'PROJECTS_DISTINCT_COUNT_VIEW_MODE_ASC',
  ProjectsDistinctCountViewModeDesc = 'PROJECTS_DISTINCT_COUNT_VIEW_MODE_DESC',
  ProjectsDistinctCountWorkspaceIdAsc = 'PROJECTS_DISTINCT_COUNT_WORKSPACE_ID_ASC',
  ProjectsDistinctCountWorkspaceIdDesc = 'PROJECTS_DISTINCT_COUNT_WORKSPACE_ID_DESC',
  RowIdAsc = 'ROW_ID_ASC',
  RowIdDesc = 'ROW_ID_DESC',
  UpdatedAtAsc = 'UPDATED_AT_ASC',
  UpdatedAtDesc = 'UPDATED_AT_DESC',
  ViewModeAsc = 'VIEW_MODE_ASC',
  ViewModeDesc = 'VIEW_MODE_DESC',
  WorkspaceUsersCountAsc = 'WORKSPACE_USERS_COUNT_ASC',
  WorkspaceUsersCountDesc = 'WORKSPACE_USERS_COUNT_DESC',
  WorkspaceUsersDistinctCountCreatedAtAsc = 'WORKSPACE_USERS_DISTINCT_COUNT_CREATED_AT_ASC',
  WorkspaceUsersDistinctCountCreatedAtDesc = 'WORKSPACE_USERS_DISTINCT_COUNT_CREATED_AT_DESC',
  WorkspaceUsersDistinctCountUserIdAsc = 'WORKSPACE_USERS_DISTINCT_COUNT_USER_ID_ASC',
  WorkspaceUsersDistinctCountUserIdDesc = 'WORKSPACE_USERS_DISTINCT_COUNT_USER_ID_DESC',
  WorkspaceUsersDistinctCountWorkspaceIdAsc = 'WORKSPACE_USERS_DISTINCT_COUNT_WORKSPACE_ID_ASC',
  WorkspaceUsersDistinctCountWorkspaceIdDesc = 'WORKSPACE_USERS_DISTINCT_COUNT_WORKSPACE_ID_DESC'
}

/** Represents an update to a `Workspace`. Fields that are set will be updated. */
export type WorkspacePatch = {
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
  viewMode?: InputMaybe<Scalars['String']['input']>;
};

/** A filter to be used against many `Project` object types. All fields are combined with a logical ‘and.’ */
export type WorkspaceToManyProjectFilter = {
  /** Aggregates across related `Project` match the filter criteria. */
  aggregates?: InputMaybe<ProjectAggregatesFilter>;
  /** Every related `Project` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<ProjectFilter>;
  /** No related `Project` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<ProjectFilter>;
  /** Some related `Project` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<ProjectFilter>;
};

/** A filter to be used against many `WorkspaceUser` object types. All fields are combined with a logical ‘and.’ */
export type WorkspaceToManyWorkspaceUserFilter = {
  /** Aggregates across related `WorkspaceUser` match the filter criteria. */
  aggregates?: InputMaybe<WorkspaceUserAggregatesFilter>;
  /** Every related `WorkspaceUser` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<WorkspaceUserFilter>;
  /** No related `WorkspaceUser` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<WorkspaceUserFilter>;
  /** Some related `WorkspaceUser` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<WorkspaceUserFilter>;
};

export type WorkspaceUser = Node & {
  __typename?: 'WorkspaceUser';
  createdAt: Scalars['Datetime']['output'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  id: Scalars['ID']['output'];
  /** Reads a single `User` that is related to this `WorkspaceUser`. */
  user?: Maybe<User>;
  userId: Scalars['UUID']['output'];
  /** Reads a single `Workspace` that is related to this `WorkspaceUser`. */
  workspace?: Maybe<Workspace>;
  workspaceId: Scalars['UUID']['output'];
};

export type WorkspaceUserAggregates = {
  __typename?: 'WorkspaceUserAggregates';
  /** Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset) */
  distinctCount?: Maybe<WorkspaceUserDistinctCountAggregates>;
  keys?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

/** A filter to be used against aggregates of `WorkspaceUser` object types. */
export type WorkspaceUserAggregatesFilter = {
  /** Distinct count aggregate over matching `WorkspaceUser` objects. */
  distinctCount?: InputMaybe<WorkspaceUserDistinctCountAggregateFilter>;
  /** A filter that must pass for the relevant `WorkspaceUser` object to be included within the aggregate. */
  filter?: InputMaybe<WorkspaceUserFilter>;
};

/**
 * A condition to be used against `WorkspaceUser` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type WorkspaceUserCondition = {
  /** Checks for equality with the object’s `createdAt` field. */
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `userId` field. */
  userId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `workspaceId` field. */
  workspaceId?: InputMaybe<Scalars['UUID']['input']>;
};

/** A connection to a list of `WorkspaceUser` values. */
export type WorkspaceUserConnection = {
  __typename?: 'WorkspaceUserConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<WorkspaceUserAggregates>;
  /** A list of edges which contains the `WorkspaceUser` and cursor to aid in pagination. */
  edges: Array<WorkspaceUserEdge>;
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<Array<WorkspaceUserAggregates>>;
  /** A list of `WorkspaceUser` objects. */
  nodes: Array<WorkspaceUser>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `WorkspaceUser` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `WorkspaceUser` values. */
export type WorkspaceUserConnectionGroupedAggregatesArgs = {
  groupBy: Array<WorkspaceUserGroupBy>;
  having?: InputMaybe<WorkspaceUserHavingInput>;
};

export type WorkspaceUserDistinctCountAggregateFilter = {
  createdAt?: InputMaybe<BigIntFilter>;
  userId?: InputMaybe<BigIntFilter>;
  workspaceId?: InputMaybe<BigIntFilter>;
};

export type WorkspaceUserDistinctCountAggregates = {
  __typename?: 'WorkspaceUserDistinctCountAggregates';
  /** Distinct count of createdAt across the matching connection */
  createdAt?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of userId across the matching connection */
  userId?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of workspaceId across the matching connection */
  workspaceId?: Maybe<Scalars['BigInt']['output']>;
};

/** A `WorkspaceUser` edge in the connection. */
export type WorkspaceUserEdge = {
  __typename?: 'WorkspaceUserEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `WorkspaceUser` at the end of the edge. */
  node: WorkspaceUser;
};

/** A filter to be used against `WorkspaceUser` object types. All fields are combined with a logical ‘and.’ */
export type WorkspaceUserFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<WorkspaceUserFilter>>;
  /** Filter by the object’s `createdAt` field. */
  createdAt?: InputMaybe<DatetimeFilter>;
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

/** Grouping methods for `WorkspaceUser` for usage during aggregation. */
export enum WorkspaceUserGroupBy {
  CreatedAt = 'CREATED_AT',
  CreatedAtTruncatedToDay = 'CREATED_AT_TRUNCATED_TO_DAY',
  CreatedAtTruncatedToHour = 'CREATED_AT_TRUNCATED_TO_HOUR',
  UserId = 'USER_ID',
  WorkspaceId = 'WORKSPACE_ID'
}

export type WorkspaceUserHavingAverageInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
};

export type WorkspaceUserHavingDistinctCountInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
};

/** Conditions for `WorkspaceUser` aggregates. */
export type WorkspaceUserHavingInput = {
  AND?: InputMaybe<Array<WorkspaceUserHavingInput>>;
  OR?: InputMaybe<Array<WorkspaceUserHavingInput>>;
  average?: InputMaybe<WorkspaceUserHavingAverageInput>;
  distinctCount?: InputMaybe<WorkspaceUserHavingDistinctCountInput>;
  max?: InputMaybe<WorkspaceUserHavingMaxInput>;
  min?: InputMaybe<WorkspaceUserHavingMinInput>;
  stddevPopulation?: InputMaybe<WorkspaceUserHavingStddevPopulationInput>;
  stddevSample?: InputMaybe<WorkspaceUserHavingStddevSampleInput>;
  sum?: InputMaybe<WorkspaceUserHavingSumInput>;
  variancePopulation?: InputMaybe<WorkspaceUserHavingVariancePopulationInput>;
  varianceSample?: InputMaybe<WorkspaceUserHavingVarianceSampleInput>;
};

export type WorkspaceUserHavingMaxInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
};

export type WorkspaceUserHavingMinInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
};

export type WorkspaceUserHavingStddevPopulationInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
};

export type WorkspaceUserHavingStddevSampleInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
};

export type WorkspaceUserHavingSumInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
};

export type WorkspaceUserHavingVariancePopulationInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
};

export type WorkspaceUserHavingVarianceSampleInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
};

/** An input for mutations affecting `WorkspaceUser` */
export type WorkspaceUserInput = {
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  userId: Scalars['UUID']['input'];
  workspaceId: Scalars['UUID']['input'];
};

/** Methods to use when ordering `WorkspaceUser`. */
export enum WorkspaceUserOrderBy {
  CreatedAtAsc = 'CREATED_AT_ASC',
  CreatedAtDesc = 'CREATED_AT_DESC',
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

export type LabelFragment = { __typename?: 'Label', color: string, name: string, rowId: string };

export type ProjectFragment = { __typename?: 'Project', rowId: string, name: string, description?: string | null, status: ProjectStatus, color?: string | null, prefix?: string | null, columns: { __typename?: 'ColumnConnection', nodes: Array<{ __typename?: 'Column', allTasks: { __typename?: 'TaskConnection', totalCount: number }, completedTasks: { __typename?: 'TaskConnection', totalCount: number } }> } };

export type CreateAssigneeMutationVariables = Exact<{
  input: CreateAssigneeInput;
}>;


export type CreateAssigneeMutation = { __typename?: 'Mutation', createAssignee?: { __typename?: 'CreateAssigneePayload', assignee?: { __typename?: 'Assignee', rowId: string } | null } | null };

export type DeleteAssigneeMutationVariables = Exact<{
  rowId: Scalars['UUID']['input'];
}>;


export type DeleteAssigneeMutation = { __typename?: 'Mutation', deleteAssignee?: { __typename?: 'DeleteAssigneePayload', assignee?: { __typename?: 'Assignee', rowId: string } | null } | null };

export type CreateColumnMutationVariables = Exact<{
  input: CreateColumnInput;
}>;


export type CreateColumnMutation = { __typename?: 'Mutation', createColumn?: { __typename?: 'CreateColumnPayload', column?: { __typename?: 'Column', rowId: string } | null } | null };

export type CreateLabelMutationVariables = Exact<{
  input: CreateLabelInput;
}>;


export type CreateLabelMutation = { __typename?: 'Mutation', createLabel?: { __typename?: 'CreateLabelPayload', label?: { __typename?: 'Label', rowId: string, name: string, color: string } | null } | null };

export type DeleteLabelMutationVariables = Exact<{
  rowId: Scalars['UUID']['input'];
}>;


export type DeleteLabelMutation = { __typename?: 'Mutation', deleteLabel?: { __typename?: 'DeleteLabelPayload', clientMutationId?: string | null } | null };

export type UpdateLabelMutationVariables = Exact<{
  rowId: Scalars['UUID']['input'];
  patch: LabelPatch;
}>;


export type UpdateLabelMutation = { __typename?: 'Mutation', updateLabel?: { __typename?: 'UpdateLabelPayload', label?: { __typename?: 'Label', rowId: string } | null } | null };

export type CreatePostMutationVariables = Exact<{
  input: CreatePostInput;
}>;


export type CreatePostMutation = { __typename?: 'Mutation', createPost?: { __typename?: 'CreatePostPayload', post?: { __typename?: 'Post', rowId: string } | null } | null };

export type CreateProjectMutationVariables = Exact<{
  input: CreateProjectInput;
}>;


export type CreateProjectMutation = { __typename?: 'Mutation', createProject?: { __typename?: 'CreateProjectPayload', project?: { __typename?: 'Project', rowId: string } | null } | null };

export type DeleteProjectMutationVariables = Exact<{
  rowId: Scalars['UUID']['input'];
}>;


export type DeleteProjectMutation = { __typename?: 'Mutation', deleteProject?: { __typename?: 'DeleteProjectPayload', clientMutationId?: string | null } | null };

export type UpdateProjectMutationVariables = Exact<{
  rowId: Scalars['UUID']['input'];
  patch: ProjectPatch;
}>;


export type UpdateProjectMutation = { __typename?: 'Mutation', updateProject?: { __typename?: 'UpdateProjectPayload', project?: { __typename?: 'Project', rowId: string } | null } | null };

export type CreateTaskLabelMutationVariables = Exact<{
  input: CreateTaskLabelInput;
}>;


export type CreateTaskLabelMutation = { __typename?: 'Mutation', createTaskLabel?: { __typename?: 'CreateTaskLabelPayload', taskLabel?: { __typename?: 'TaskLabel', rowId: string } | null } | null };

export type DeleteTaskLabelMutationVariables = Exact<{
  rowId: Scalars['UUID']['input'];
}>;


export type DeleteTaskLabelMutation = { __typename?: 'Mutation', deleteTaskLabel?: { __typename?: 'DeleteTaskLabelPayload', clientMutationId?: string | null } | null };

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

export type CreateWorkspaceMutationVariables = Exact<{
  input: CreateWorkspaceInput;
}>;


export type CreateWorkspaceMutation = { __typename?: 'Mutation', createWorkspace?: { __typename?: 'CreateWorkspacePayload', workspace?: { __typename?: 'Workspace', rowId: string } | null } | null };

export type DeleteWorkspaceMutationVariables = Exact<{
  rowId: Scalars['UUID']['input'];
}>;


export type DeleteWorkspaceMutation = { __typename?: 'Mutation', deleteWorkspace?: { __typename?: 'DeleteWorkspacePayload', clientMutationId?: string | null } | null };

export type DeleteWorkspaceUserMutationVariables = Exact<{
  userId: Scalars['UUID']['input'];
  workspaceId: Scalars['UUID']['input'];
}>;


export type DeleteWorkspaceUserMutation = { __typename?: 'Mutation', deleteWorkspaceUser?: { __typename?: 'DeleteWorkspaceUserPayload', clientMutationId?: string | null } | null };

export type UpdateWorkspaceMutationVariables = Exact<{
  rowId: Scalars['UUID']['input'];
  patch: WorkspacePatch;
}>;


export type UpdateWorkspaceMutation = { __typename?: 'Mutation', updateWorkspace?: { __typename?: 'UpdateWorkspacePayload', workspace?: { __typename?: 'Workspace', rowId: string } | null } | null };

export type LabelsQueryVariables = Exact<{
  projectId: Scalars['UUID']['input'];
}>;


export type LabelsQuery = { __typename?: 'Query', labels?: { __typename?: 'LabelConnection', nodes: Array<{ __typename?: 'Label', color: string, name: string, rowId: string }> } | null };

export type ProjectQueryVariables = Exact<{
  rowId: Scalars['UUID']['input'];
}>;


export type ProjectQuery = { __typename?: 'Query', project?: { __typename?: 'Project', rowId: string, name: string, description?: string | null, prefix?: string | null, color?: string | null, viewMode: string, labels: { __typename?: 'LabelConnection', nodes: Array<{ __typename?: 'Label', name: string, color: string, rowId: string }> }, columns: { __typename?: 'ColumnConnection', nodes: Array<{ __typename?: 'Column', rowId: string, index: number, title: string, tasks: { __typename?: 'TaskConnection', totalCount: number, nodes: Array<{ __typename?: 'Task', rowId: string, createdAt: Date }> } }> } } | null };

export type ProjectsQueryVariables = Exact<{
  workspaceId: Scalars['UUID']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
}>;


export type ProjectsQuery = { __typename?: 'Query', projects?: { __typename?: 'ProjectConnection', nodes: Array<{ __typename?: 'Project', rowId: string, name: string, description?: string | null, status: ProjectStatus, color?: string | null, prefix?: string | null, columns: { __typename?: 'ColumnConnection', nodes: Array<{ __typename?: 'Column', allTasks: { __typename?: 'TaskConnection', totalCount: number }, completedTasks: { __typename?: 'TaskConnection', totalCount: number } }> } }> } | null };

export type TaskQueryVariables = Exact<{
  rowId: Scalars['UUID']['input'];
}>;


export type TaskQuery = { __typename?: 'Query', task?: { __typename?: 'Task', rowId: string, columnId: string, columnIndex: number, content: string, description: string, priority: string, createdAt: Date, updatedAt: Date, dueDate?: Date | null, taskLabels: { __typename?: 'TaskLabelConnection', nodes: Array<{ __typename?: 'TaskLabel', rowId: string, label?: { __typename?: 'Label', color: string, name: string, rowId: string } | null }> }, posts: { __typename?: 'PostConnection', totalCount: number, nodes: Array<{ __typename?: 'Post', rowId: string, title?: string | null, description?: string | null, createdAt: Date, author?: { __typename?: 'User', name: string, avatarUrl?: string | null } | null }> }, column?: { __typename?: 'Column', title: string } | null, author?: { __typename?: 'User', name: string, avatarUrl?: string | null } | null, assignees: { __typename?: 'AssigneeConnection', nodes: Array<{ __typename?: 'Assignee', rowId: string, user?: { __typename?: 'User', rowId: string, name: string, avatarUrl?: string | null } | null }> } } | null };

export type TasksQueryVariables = Exact<{
  projectId: Scalars['UUID']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
  assignees?: InputMaybe<TaskToManyAssigneeFilter>;
  labels?: InputMaybe<TaskToManyTaskLabelFilter>;
  priorities?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type TasksQuery = { __typename?: 'Query', tasks?: { __typename?: 'TaskConnection', nodes: Array<{ __typename?: 'Task', rowId: string, projectId: string, columnId: string, columnIndex: number, content: string, priority: string, dueDate?: Date | null, taskLabels: { __typename?: 'TaskLabelConnection', nodes: Array<{ __typename?: 'TaskLabel', label?: { __typename?: 'Label', color: string, name: string, rowId: string } | null }> }, assignees: { __typename?: 'AssigneeConnection', nodes: Array<{ __typename?: 'Assignee', rowId: string, user?: { __typename?: 'User', rowId: string, name: string, avatarUrl?: string | null } | null }> } }> } | null };

export type WorkspaceQueryVariables = Exact<{
  rowId: Scalars['UUID']['input'];
}>;


export type WorkspaceQuery = { __typename?: 'Query', workspace?: { __typename?: 'Workspace', rowId: string, name: string, viewMode: string, projects: { __typename?: 'ProjectConnection', nodes: Array<{ __typename?: 'Project', rowId: string, name: string, color?: string | null, viewMode: string }> } } | null };

export type WorkspaceUsersQueryVariables = Exact<{
  rowId: Scalars['UUID']['input'];
}>;


export type WorkspaceUsersQuery = { __typename?: 'Query', workspaceUsers?: { __typename?: 'WorkspaceUserConnection', nodes: Array<{ __typename?: 'WorkspaceUser', user?: { __typename?: 'User', name: string, avatarUrl?: string | null, rowId: string } | null }> } | null };

export type WorkspacesQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type WorkspacesQuery = { __typename?: 'Query', workspaces?: { __typename?: 'WorkspaceConnection', nodes: Array<{ __typename?: 'Workspace', rowId: string, name: string, workspaceUsers: { __typename?: 'WorkspaceUserConnection', totalCount: number } }> } | null };

export const LabelFragmentDoc = gql`
    fragment Label on Label {
  color
  name
  rowId
}
    `;
export const ProjectFragmentDoc = gql`
    fragment Project on Project {
  rowId
  name
  description
  status
  color
  prefix
  columns {
    nodes {
      allTasks: tasks {
        totalCount
      }
      completedTasks: tasks(filter: {column: {title: {equalTo: "Done"}}}) {
        totalCount
      }
    }
  }
}
    `;
export const CreateAssigneeDocument = gql`
    mutation CreateAssignee($input: CreateAssigneeInput!) {
  createAssignee(input: $input) {
    assignee {
      rowId
    }
  }
}
    `;
export const DeleteAssigneeDocument = gql`
    mutation DeleteAssignee($rowId: UUID!) {
  deleteAssignee(input: {rowId: $rowId}) {
    assignee {
      rowId
    }
  }
}
    `;
export const CreateColumnDocument = gql`
    mutation CreateColumn($input: CreateColumnInput!) {
  createColumn(input: $input) {
    column {
      rowId
    }
  }
}
    `;
export const CreateLabelDocument = gql`
    mutation CreateLabel($input: CreateLabelInput!) {
  createLabel(input: $input) {
    label {
      rowId
      name
      color
    }
  }
}
    `;
export const DeleteLabelDocument = gql`
    mutation DeleteLabel($rowId: UUID!) {
  deleteLabel(input: {rowId: $rowId}) {
    clientMutationId
  }
}
    `;
export const UpdateLabelDocument = gql`
    mutation UpdateLabel($rowId: UUID!, $patch: LabelPatch!) {
  updateLabel(input: {rowId: $rowId, patch: $patch}) {
    label {
      rowId
    }
  }
}
    `;
export const CreatePostDocument = gql`
    mutation CreatePost($input: CreatePostInput!) {
  createPost(input: $input) {
    post {
      rowId
    }
  }
}
    `;
export const CreateProjectDocument = gql`
    mutation CreateProject($input: CreateProjectInput!) {
  createProject(input: $input) {
    project {
      rowId
    }
  }
}
    `;
export const DeleteProjectDocument = gql`
    mutation DeleteProject($rowId: UUID!) {
  deleteProject(input: {rowId: $rowId}) {
    clientMutationId
  }
}
    `;
export const UpdateProjectDocument = gql`
    mutation UpdateProject($rowId: UUID!, $patch: ProjectPatch!) {
  updateProject(input: {rowId: $rowId, patch: $patch}) {
    project {
      rowId
    }
  }
}
    `;
export const CreateTaskLabelDocument = gql`
    mutation CreateTaskLabel($input: CreateTaskLabelInput!) {
  createTaskLabel(input: $input) {
    taskLabel {
      rowId
    }
  }
}
    `;
export const DeleteTaskLabelDocument = gql`
    mutation DeleteTaskLabel($rowId: UUID!) {
  deleteTaskLabel(input: {rowId: $rowId}) {
    clientMutationId
  }
}
    `;
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
export const CreateWorkspaceDocument = gql`
    mutation CreateWorkspace($input: CreateWorkspaceInput!) {
  createWorkspace(input: $input) {
    workspace {
      rowId
    }
  }
}
    `;
export const DeleteWorkspaceDocument = gql`
    mutation DeleteWorkspace($rowId: UUID!) {
  deleteWorkspace(input: {rowId: $rowId}) {
    clientMutationId
  }
}
    `;
export const DeleteWorkspaceUserDocument = gql`
    mutation DeleteWorkspaceUser($userId: UUID!, $workspaceId: UUID!) {
  deleteWorkspaceUser(input: {userId: $userId, workspaceId: $workspaceId}) {
    clientMutationId
  }
}
    `;
export const UpdateWorkspaceDocument = gql`
    mutation UpdateWorkspace($rowId: UUID!, $patch: WorkspacePatch!) {
  updateWorkspace(input: {rowId: $rowId, patch: $patch}) {
    workspace {
      rowId
    }
  }
}
    `;
export const LabelsDocument = gql`
    query Labels($projectId: UUID!) {
  labels(condition: {projectId: $projectId}) {
    nodes {
      ...Label
    }
  }
}
    ${LabelFragmentDoc}`;
export const ProjectDocument = gql`
    query Project($rowId: UUID!) {
  project(rowId: $rowId) {
    rowId
    name
    description
    prefix
    color
    viewMode
    labels {
      nodes {
        name
        color
        rowId
      }
    }
    columns(orderBy: INDEX_ASC) {
      nodes {
        rowId
        index
        title
        tasks {
          totalCount
          nodes {
            rowId
            createdAt
          }
        }
      }
    }
  }
}
    `;
export const ProjectsDocument = gql`
    query Projects($workspaceId: UUID!, $search: String = "") {
  projects(
    condition: {workspaceId: $workspaceId}
    filter: {name: {includesInsensitive: $search}}
  ) {
    nodes {
      ...Project
    }
  }
}
    ${ProjectFragmentDoc}`;
export const TaskDocument = gql`
    query Task($rowId: UUID!) {
  task(rowId: $rowId) {
    rowId
    columnId
    columnIndex
    content
    description
    priority
    createdAt
    updatedAt
    dueDate
    taskLabels {
      nodes {
        rowId
        label {
          ...Label
        }
      }
    }
    posts(orderBy: CREATED_AT_ASC) {
      totalCount
      nodes {
        rowId
        title
        description
        createdAt
        author {
          name
          avatarUrl
        }
      }
    }
    column {
      title
    }
    author {
      name
      avatarUrl
    }
    assignees {
      nodes {
        rowId
        user {
          rowId
          name
          avatarUrl
        }
      }
    }
  }
}
    ${LabelFragmentDoc}`;
export const TasksDocument = gql`
    query Tasks($projectId: UUID!, $search: String = "", $assignees: TaskToManyAssigneeFilter, $labels: TaskToManyTaskLabelFilter, $priorities: [String!]) {
  tasks(
    filter: {projectId: {equalTo: $projectId}, content: {includesInsensitive: $search}, assignees: $assignees, taskLabels: $labels, priority: {in: $priorities}}
    orderBy: COLUMN_INDEX_ASC
  ) {
    nodes {
      rowId
      projectId
      columnId
      columnIndex
      content
      priority
      dueDate
      taskLabels {
        nodes {
          label {
            ...Label
          }
        }
      }
      assignees {
        nodes {
          rowId
          user {
            rowId
            name
            avatarUrl
          }
        }
      }
    }
  }
}
    ${LabelFragmentDoc}`;
export const WorkspaceDocument = gql`
    query Workspace($rowId: UUID!) {
  workspace(rowId: $rowId) {
    rowId
    name
    viewMode
    projects {
      nodes {
        rowId
        name
        color
        viewMode
      }
    }
  }
}
    `;
export const WorkspaceUsersDocument = gql`
    query WorkspaceUsers($rowId: UUID!) {
  workspaceUsers(condition: {workspaceId: $rowId}) {
    nodes {
      user {
        name
        avatarUrl
        rowId
      }
    }
  }
}
    `;
export const WorkspacesDocument = gql`
    query Workspaces($limit: Int) {
  workspaces(orderBy: WORKSPACE_USERS_COUNT_DESC, first: $limit) {
    nodes {
      rowId
      name
      workspaceUsers {
        totalCount
      }
    }
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string, variables?: any) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType, _variables) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    CreateAssignee(variables: CreateAssigneeMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CreateAssigneeMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateAssigneeMutation>({ document: CreateAssigneeDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'CreateAssignee', 'mutation', variables);
    },
    DeleteAssignee(variables: DeleteAssigneeMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DeleteAssigneeMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteAssigneeMutation>({ document: DeleteAssigneeDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'DeleteAssignee', 'mutation', variables);
    },
    CreateColumn(variables: CreateColumnMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CreateColumnMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateColumnMutation>({ document: CreateColumnDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'CreateColumn', 'mutation', variables);
    },
    CreateLabel(variables: CreateLabelMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CreateLabelMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateLabelMutation>({ document: CreateLabelDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'CreateLabel', 'mutation', variables);
    },
    DeleteLabel(variables: DeleteLabelMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DeleteLabelMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteLabelMutation>({ document: DeleteLabelDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'DeleteLabel', 'mutation', variables);
    },
    UpdateLabel(variables: UpdateLabelMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<UpdateLabelMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateLabelMutation>({ document: UpdateLabelDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'UpdateLabel', 'mutation', variables);
    },
    CreatePost(variables: CreatePostMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CreatePostMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreatePostMutation>({ document: CreatePostDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'CreatePost', 'mutation', variables);
    },
    CreateProject(variables: CreateProjectMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CreateProjectMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateProjectMutation>({ document: CreateProjectDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'CreateProject', 'mutation', variables);
    },
    DeleteProject(variables: DeleteProjectMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DeleteProjectMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteProjectMutation>({ document: DeleteProjectDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'DeleteProject', 'mutation', variables);
    },
    UpdateProject(variables: UpdateProjectMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<UpdateProjectMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateProjectMutation>({ document: UpdateProjectDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'UpdateProject', 'mutation', variables);
    },
    CreateTaskLabel(variables: CreateTaskLabelMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CreateTaskLabelMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateTaskLabelMutation>({ document: CreateTaskLabelDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'CreateTaskLabel', 'mutation', variables);
    },
    DeleteTaskLabel(variables: DeleteTaskLabelMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DeleteTaskLabelMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteTaskLabelMutation>({ document: DeleteTaskLabelDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'DeleteTaskLabel', 'mutation', variables);
    },
    CreateTask(variables: CreateTaskMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CreateTaskMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateTaskMutation>({ document: CreateTaskDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'CreateTask', 'mutation', variables);
    },
    DeleteTask(variables: DeleteTaskMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DeleteTaskMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteTaskMutation>({ document: DeleteTaskDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'DeleteTask', 'mutation', variables);
    },
    UpdateTask(variables: UpdateTaskMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<UpdateTaskMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateTaskMutation>({ document: UpdateTaskDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'UpdateTask', 'mutation', variables);
    },
    CreateWorkspace(variables: CreateWorkspaceMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CreateWorkspaceMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateWorkspaceMutation>({ document: CreateWorkspaceDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'CreateWorkspace', 'mutation', variables);
    },
    DeleteWorkspace(variables: DeleteWorkspaceMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DeleteWorkspaceMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteWorkspaceMutation>({ document: DeleteWorkspaceDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'DeleteWorkspace', 'mutation', variables);
    },
    DeleteWorkspaceUser(variables: DeleteWorkspaceUserMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DeleteWorkspaceUserMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteWorkspaceUserMutation>({ document: DeleteWorkspaceUserDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'DeleteWorkspaceUser', 'mutation', variables);
    },
    UpdateWorkspace(variables: UpdateWorkspaceMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<UpdateWorkspaceMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateWorkspaceMutation>({ document: UpdateWorkspaceDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'UpdateWorkspace', 'mutation', variables);
    },
    Labels(variables: LabelsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<LabelsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<LabelsQuery>({ document: LabelsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'Labels', 'query', variables);
    },
    Project(variables: ProjectQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<ProjectQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ProjectQuery>({ document: ProjectDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'Project', 'query', variables);
    },
    Projects(variables: ProjectsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<ProjectsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ProjectsQuery>({ document: ProjectsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'Projects', 'query', variables);
    },
    Task(variables: TaskQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<TaskQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<TaskQuery>({ document: TaskDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'Task', 'query', variables);
    },
    Tasks(variables: TasksQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<TasksQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<TasksQuery>({ document: TasksDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'Tasks', 'query', variables);
    },
    Workspace(variables: WorkspaceQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<WorkspaceQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<WorkspaceQuery>({ document: WorkspaceDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'Workspace', 'query', variables);
    },
    WorkspaceUsers(variables: WorkspaceUsersQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<WorkspaceUsersQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<WorkspaceUsersQuery>({ document: WorkspaceUsersDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'WorkspaceUsers', 'query', variables);
    },
    Workspaces(variables?: WorkspacesQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<WorkspacesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<WorkspacesQuery>({ document: WorkspacesDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'Workspaces', 'query', variables);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;