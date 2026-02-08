// @ts-nocheck
import { useMutation, useQuery, useSuspenseQuery, useInfiniteQuery, useSuspenseInfiniteQuery, UseMutationOptions, UseQueryOptions, UseSuspenseQueryOptions, UseInfiniteQueryOptions, InfiniteData, UseSuspenseInfiniteQueryOptions } from '@tanstack/react-query';
import { graphqlFetch } from '@/lib/graphql/graphqlFetch';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
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

/** A filter to be used against Boolean fields. All fields are combined with a logical ‘and.’ */
export type BooleanFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['Boolean']['input']>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['Boolean']['input']>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['Boolean']['input']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['Boolean']['input']>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['Boolean']['input']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['Boolean']['input']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['Boolean']['input']>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['Boolean']['input']>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['Boolean']['input']>>;
};

export type Column = Node & {
  __typename?: 'Column';
  createdAt: Scalars['Datetime']['output'];
  icon?: Maybe<Scalars['String']['output']>;
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
  /** Checks for equality with the object’s `icon` field. */
  icon?: InputMaybe<Scalars['String']['input']>;
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
  icon?: InputMaybe<BigIntFilter>;
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
  /** Distinct count of icon across the matching connection */
  icon?: Maybe<Scalars['BigInt']['output']>;
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
  /** Filter by the object’s `icon` field. */
  icon?: InputMaybe<StringFilter>;
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
  Icon = 'ICON',
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
  icon?: InputMaybe<Scalars['String']['input']>;
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
  IconAsc = 'ICON_ASC',
  IconDesc = 'ICON_DESC',
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
  TasksAverageNumberAsc = 'TASKS_AVERAGE_NUMBER_ASC',
  TasksAverageNumberDesc = 'TASKS_AVERAGE_NUMBER_DESC',
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
  TasksDistinctCountNumberAsc = 'TASKS_DISTINCT_COUNT_NUMBER_ASC',
  TasksDistinctCountNumberDesc = 'TASKS_DISTINCT_COUNT_NUMBER_DESC',
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
  TasksMaxNumberAsc = 'TASKS_MAX_NUMBER_ASC',
  TasksMaxNumberDesc = 'TASKS_MAX_NUMBER_DESC',
  TasksMinColumnIndexAsc = 'TASKS_MIN_COLUMN_INDEX_ASC',
  TasksMinColumnIndexDesc = 'TASKS_MIN_COLUMN_INDEX_DESC',
  TasksMinNumberAsc = 'TASKS_MIN_NUMBER_ASC',
  TasksMinNumberDesc = 'TASKS_MIN_NUMBER_DESC',
  TasksStddevPopulationColumnIndexAsc = 'TASKS_STDDEV_POPULATION_COLUMN_INDEX_ASC',
  TasksStddevPopulationColumnIndexDesc = 'TASKS_STDDEV_POPULATION_COLUMN_INDEX_DESC',
  TasksStddevPopulationNumberAsc = 'TASKS_STDDEV_POPULATION_NUMBER_ASC',
  TasksStddevPopulationNumberDesc = 'TASKS_STDDEV_POPULATION_NUMBER_DESC',
  TasksStddevSampleColumnIndexAsc = 'TASKS_STDDEV_SAMPLE_COLUMN_INDEX_ASC',
  TasksStddevSampleColumnIndexDesc = 'TASKS_STDDEV_SAMPLE_COLUMN_INDEX_DESC',
  TasksStddevSampleNumberAsc = 'TASKS_STDDEV_SAMPLE_NUMBER_ASC',
  TasksStddevSampleNumberDesc = 'TASKS_STDDEV_SAMPLE_NUMBER_DESC',
  TasksSumColumnIndexAsc = 'TASKS_SUM_COLUMN_INDEX_ASC',
  TasksSumColumnIndexDesc = 'TASKS_SUM_COLUMN_INDEX_DESC',
  TasksSumNumberAsc = 'TASKS_SUM_NUMBER_ASC',
  TasksSumNumberDesc = 'TASKS_SUM_NUMBER_DESC',
  TasksVariancePopulationColumnIndexAsc = 'TASKS_VARIANCE_POPULATION_COLUMN_INDEX_ASC',
  TasksVariancePopulationColumnIndexDesc = 'TASKS_VARIANCE_POPULATION_COLUMN_INDEX_DESC',
  TasksVariancePopulationNumberAsc = 'TASKS_VARIANCE_POPULATION_NUMBER_ASC',
  TasksVariancePopulationNumberDesc = 'TASKS_VARIANCE_POPULATION_NUMBER_DESC',
  TasksVarianceSampleColumnIndexAsc = 'TASKS_VARIANCE_SAMPLE_COLUMN_INDEX_ASC',
  TasksVarianceSampleColumnIndexDesc = 'TASKS_VARIANCE_SAMPLE_COLUMN_INDEX_DESC',
  TasksVarianceSampleNumberAsc = 'TASKS_VARIANCE_SAMPLE_NUMBER_ASC',
  TasksVarianceSampleNumberDesc = 'TASKS_VARIANCE_SAMPLE_NUMBER_DESC',
  TitleAsc = 'TITLE_ASC',
  TitleDesc = 'TITLE_DESC',
  UpdatedAtAsc = 'UPDATED_AT_ASC',
  UpdatedAtDesc = 'UPDATED_AT_DESC'
}

/** Represents an update to a `Column`. Fields that are set will be updated. */
export type ColumnPatch = {
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  icon?: InputMaybe<Scalars['String']['input']>;
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

/** All input for the create `Emoji` mutation. */
export type CreateEmojiInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The `Emoji` to be created by this mutation. */
  emoji: EmojiInput;
};

/** The output of our create `Emoji` mutation. */
export type CreateEmojiPayload = {
  __typename?: 'CreateEmojiPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `Emoji` that was created by this mutation. */
  emoji?: Maybe<Emoji>;
  /** An edge for our `Emoji`. May be used by Relay 1. */
  emojiEdge?: Maybe<EmojiEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our create `Emoji` mutation. */
export type CreateEmojiPayloadEmojiEdgeArgs = {
  orderBy?: Array<EmojiOrderBy>;
};

/** All input for the create `Invitation` mutation. */
export type CreateInvitationInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The `Invitation` to be created by this mutation. */
  invitation: InvitationInput;
};

/** The output of our create `Invitation` mutation. */
export type CreateInvitationPayload = {
  __typename?: 'CreateInvitationPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `Invitation` that was created by this mutation. */
  invitation?: Maybe<Invitation>;
  /** An edge for our `Invitation`. May be used by Relay 1. */
  invitationEdge?: Maybe<InvitationEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our create `Invitation` mutation. */
export type CreateInvitationPayloadInvitationEdgeArgs = {
  orderBy?: Array<InvitationOrderBy>;
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

/** All input for the create `ProjectColumn` mutation. */
export type CreateProjectColumnInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The `ProjectColumn` to be created by this mutation. */
  projectColumn: ProjectColumnInput;
};

/** The output of our create `ProjectColumn` mutation. */
export type CreateProjectColumnPayload = {
  __typename?: 'CreateProjectColumnPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `ProjectColumn` that was created by this mutation. */
  projectColumn?: Maybe<ProjectColumn>;
  /** An edge for our `ProjectColumn`. May be used by Relay 1. */
  projectColumnEdge?: Maybe<ProjectColumnEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our create `ProjectColumn` mutation. */
export type CreateProjectColumnPayloadProjectColumnEdgeArgs = {
  orderBy?: Array<ProjectColumnOrderBy>;
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

/** All input for the create `ProjectLabel` mutation. */
export type CreateProjectLabelInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The `ProjectLabel` to be created by this mutation. */
  projectLabel: ProjectLabelInput;
};

/** The output of our create `ProjectLabel` mutation. */
export type CreateProjectLabelPayload = {
  __typename?: 'CreateProjectLabelPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `ProjectLabel` that was created by this mutation. */
  projectLabel?: Maybe<ProjectLabel>;
  /** An edge for our `ProjectLabel`. May be used by Relay 1. */
  projectLabelEdge?: Maybe<ProjectLabelEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our create `ProjectLabel` mutation. */
export type CreateProjectLabelPayloadProjectLabelEdgeArgs = {
  orderBy?: Array<ProjectLabelOrderBy>;
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

/** All input for the create `ProjectProjectLabel` mutation. */
export type CreateProjectProjectLabelInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The `ProjectProjectLabel` to be created by this mutation. */
  projectProjectLabel: ProjectProjectLabelInput;
};

/** The output of our create `ProjectProjectLabel` mutation. */
export type CreateProjectProjectLabelPayload = {
  __typename?: 'CreateProjectProjectLabelPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `ProjectProjectLabel` that was created by this mutation. */
  projectProjectLabel?: Maybe<ProjectProjectLabel>;
  /** An edge for our `ProjectProjectLabel`. May be used by Relay 1. */
  projectProjectLabelEdge?: Maybe<ProjectProjectLabelEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our create `ProjectProjectLabel` mutation. */
export type CreateProjectProjectLabelPayloadProjectProjectLabelEdgeArgs = {
  orderBy?: Array<ProjectProjectLabelOrderBy>;
};

/** All input for the create `Setting` mutation. */
export type CreateSettingInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The `Setting` to be created by this mutation. */
  setting: SettingInput;
};

/** The output of our create `Setting` mutation. */
export type CreateSettingPayload = {
  __typename?: 'CreateSettingPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `Setting` that was created by this mutation. */
  setting?: Maybe<Setting>;
  /** An edge for our `Setting`. May be used by Relay 1. */
  settingEdge?: Maybe<SettingEdge>;
};


/** The output of our create `Setting` mutation. */
export type CreateSettingPayloadSettingEdgeArgs = {
  orderBy?: Array<SettingOrderBy>;
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

/** All input for the create `UserOrganization` mutation. */
export type CreateUserOrganizationInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The `UserOrganization` to be created by this mutation. */
  userOrganization: UserOrganizationInput;
};

/** The output of our create `UserOrganization` mutation. */
export type CreateUserOrganizationPayload = {
  __typename?: 'CreateUserOrganizationPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `UserOrganization` that was created by this mutation. */
  userOrganization?: Maybe<UserOrganization>;
  /** An edge for our `UserOrganization`. May be used by Relay 1. */
  userOrganizationEdge?: Maybe<UserOrganizationEdge>;
};


/** The output of our create `UserOrganization` mutation. */
export type CreateUserOrganizationPayloadUserOrganizationEdgeArgs = {
  orderBy?: Array<UserOrganizationOrderBy>;
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

/** All input for the create `UserPreference` mutation. */
export type CreateUserPreferenceInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The `UserPreference` to be created by this mutation. */
  userPreference: UserPreferenceInput;
};

/** The output of our create `UserPreference` mutation. */
export type CreateUserPreferencePayload = {
  __typename?: 'CreateUserPreferencePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `UserPreference` that was created by this mutation. */
  userPreference?: Maybe<UserPreference>;
  /** An edge for our `UserPreference`. May be used by Relay 1. */
  userPreferenceEdge?: Maybe<UserPreferenceEdge>;
};


/** The output of our create `UserPreference` mutation. */
export type CreateUserPreferencePayloadUserPreferenceEdgeArgs = {
  orderBy?: Array<UserPreferenceOrderBy>;
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
  taskId: Scalars['UUID']['input'];
  userId: Scalars['UUID']['input'];
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

/** All input for the `deleteEmojiById` mutation. */
export type DeleteEmojiByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `Emoji` to be deleted. */
  id: Scalars['ID']['input'];
};

/** All input for the `deleteEmoji` mutation. */
export type DeleteEmojiInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  rowId: Scalars['UUID']['input'];
};

/** The output of our delete `Emoji` mutation. */
export type DeleteEmojiPayload = {
  __typename?: 'DeleteEmojiPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  deletedEmojiId?: Maybe<Scalars['ID']['output']>;
  /** The `Emoji` that was deleted by this mutation. */
  emoji?: Maybe<Emoji>;
  /** An edge for our `Emoji`. May be used by Relay 1. */
  emojiEdge?: Maybe<EmojiEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our delete `Emoji` mutation. */
export type DeleteEmojiPayloadEmojiEdgeArgs = {
  orderBy?: Array<EmojiOrderBy>;
};

/** All input for the `deleteInvitationById` mutation. */
export type DeleteInvitationByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `Invitation` to be deleted. */
  id: Scalars['ID']['input'];
};

/** All input for the `deleteInvitation` mutation. */
export type DeleteInvitationInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  rowId: Scalars['UUID']['input'];
};

/** The output of our delete `Invitation` mutation. */
export type DeleteInvitationPayload = {
  __typename?: 'DeleteInvitationPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  deletedInvitationId?: Maybe<Scalars['ID']['output']>;
  /** The `Invitation` that was deleted by this mutation. */
  invitation?: Maybe<Invitation>;
  /** An edge for our `Invitation`. May be used by Relay 1. */
  invitationEdge?: Maybe<InvitationEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our delete `Invitation` mutation. */
export type DeleteInvitationPayloadInvitationEdgeArgs = {
  orderBy?: Array<InvitationOrderBy>;
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

/** All input for the `deleteProjectColumnById` mutation. */
export type DeleteProjectColumnByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `ProjectColumn` to be deleted. */
  id: Scalars['ID']['input'];
};

/** All input for the `deleteProjectColumn` mutation. */
export type DeleteProjectColumnInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  rowId: Scalars['UUID']['input'];
};

/** The output of our delete `ProjectColumn` mutation. */
export type DeleteProjectColumnPayload = {
  __typename?: 'DeleteProjectColumnPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  deletedProjectColumnId?: Maybe<Scalars['ID']['output']>;
  /** The `ProjectColumn` that was deleted by this mutation. */
  projectColumn?: Maybe<ProjectColumn>;
  /** An edge for our `ProjectColumn`. May be used by Relay 1. */
  projectColumnEdge?: Maybe<ProjectColumnEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our delete `ProjectColumn` mutation. */
export type DeleteProjectColumnPayloadProjectColumnEdgeArgs = {
  orderBy?: Array<ProjectColumnOrderBy>;
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

/** All input for the `deleteProjectLabelById` mutation. */
export type DeleteProjectLabelByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `ProjectLabel` to be deleted. */
  id: Scalars['ID']['input'];
};

/** All input for the `deleteProjectLabel` mutation. */
export type DeleteProjectLabelInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  rowId: Scalars['UUID']['input'];
};

/** The output of our delete `ProjectLabel` mutation. */
export type DeleteProjectLabelPayload = {
  __typename?: 'DeleteProjectLabelPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  deletedProjectLabelId?: Maybe<Scalars['ID']['output']>;
  /** The `ProjectLabel` that was deleted by this mutation. */
  projectLabel?: Maybe<ProjectLabel>;
  /** An edge for our `ProjectLabel`. May be used by Relay 1. */
  projectLabelEdge?: Maybe<ProjectLabelEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our delete `ProjectLabel` mutation. */
export type DeleteProjectLabelPayloadProjectLabelEdgeArgs = {
  orderBy?: Array<ProjectLabelOrderBy>;
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

/** All input for the `deleteProjectProjectLabelById` mutation. */
export type DeleteProjectProjectLabelByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `ProjectProjectLabel` to be deleted. */
  id: Scalars['ID']['input'];
};

/** All input for the `deleteProjectProjectLabel` mutation. */
export type DeleteProjectProjectLabelInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  projectId: Scalars['UUID']['input'];
  projectLabelId: Scalars['UUID']['input'];
};

/** The output of our delete `ProjectProjectLabel` mutation. */
export type DeleteProjectProjectLabelPayload = {
  __typename?: 'DeleteProjectProjectLabelPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  deletedProjectProjectLabelId?: Maybe<Scalars['ID']['output']>;
  /** The `ProjectProjectLabel` that was deleted by this mutation. */
  projectProjectLabel?: Maybe<ProjectProjectLabel>;
  /** An edge for our `ProjectProjectLabel`. May be used by Relay 1. */
  projectProjectLabelEdge?: Maybe<ProjectProjectLabelEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our delete `ProjectProjectLabel` mutation. */
export type DeleteProjectProjectLabelPayloadProjectProjectLabelEdgeArgs = {
  orderBy?: Array<ProjectProjectLabelOrderBy>;
};

/** All input for the `deleteSettingById` mutation. */
export type DeleteSettingByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `Setting` to be deleted. */
  id: Scalars['ID']['input'];
};

/** All input for the `deleteSetting` mutation. */
export type DeleteSettingInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  rowId: Scalars['UUID']['input'];
};

/** The output of our delete `Setting` mutation. */
export type DeleteSettingPayload = {
  __typename?: 'DeleteSettingPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  deletedSettingId?: Maybe<Scalars['ID']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `Setting` that was deleted by this mutation. */
  setting?: Maybe<Setting>;
  /** An edge for our `Setting`. May be used by Relay 1. */
  settingEdge?: Maybe<SettingEdge>;
};


/** The output of our delete `Setting` mutation. */
export type DeleteSettingPayloadSettingEdgeArgs = {
  orderBy?: Array<SettingOrderBy>;
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
  labelId: Scalars['UUID']['input'];
  taskId: Scalars['UUID']['input'];
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

/** All input for the `deleteUser` mutation. */
export type DeleteUserInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  rowId: Scalars['UUID']['input'];
};

/** All input for the `deleteUserOrganizationById` mutation. */
export type DeleteUserOrganizationByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `UserOrganization` to be deleted. */
  id: Scalars['ID']['input'];
};

/** All input for the `deleteUserOrganization` mutation. */
export type DeleteUserOrganizationInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  rowId: Scalars['UUID']['input'];
};

/** The output of our delete `UserOrganization` mutation. */
export type DeleteUserOrganizationPayload = {
  __typename?: 'DeleteUserOrganizationPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  deletedUserOrganizationId?: Maybe<Scalars['ID']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `UserOrganization` that was deleted by this mutation. */
  userOrganization?: Maybe<UserOrganization>;
  /** An edge for our `UserOrganization`. May be used by Relay 1. */
  userOrganizationEdge?: Maybe<UserOrganizationEdge>;
};


/** The output of our delete `UserOrganization` mutation. */
export type DeleteUserOrganizationPayloadUserOrganizationEdgeArgs = {
  orderBy?: Array<UserOrganizationOrderBy>;
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

/** All input for the `deleteUserPreferenceById` mutation. */
export type DeleteUserPreferenceByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `UserPreference` to be deleted. */
  id: Scalars['ID']['input'];
};

/** All input for the `deleteUserPreference` mutation. */
export type DeleteUserPreferenceInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  rowId: Scalars['UUID']['input'];
};

/** The output of our delete `UserPreference` mutation. */
export type DeleteUserPreferencePayload = {
  __typename?: 'DeleteUserPreferencePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  deletedUserPreferenceId?: Maybe<Scalars['ID']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `UserPreference` that was deleted by this mutation. */
  userPreference?: Maybe<UserPreference>;
  /** An edge for our `UserPreference`. May be used by Relay 1. */
  userPreferenceEdge?: Maybe<UserPreferenceEdge>;
};


/** The output of our delete `UserPreference` mutation. */
export type DeleteUserPreferencePayloadUserPreferenceEdgeArgs = {
  orderBy?: Array<UserPreferenceOrderBy>;
};

export type Emoji = Node & {
  __typename?: 'Emoji';
  createdAt: Scalars['Datetime']['output'];
  emoji?: Maybe<Scalars['String']['output']>;
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  id: Scalars['ID']['output'];
  /** Reads a single `Post` that is related to this `Emoji`. */
  post?: Maybe<Post>;
  postId: Scalars['UUID']['output'];
  rowId: Scalars['UUID']['output'];
  updatedAt: Scalars['Datetime']['output'];
  /** Reads a single `User` that is related to this `Emoji`. */
  user?: Maybe<User>;
  userId: Scalars['UUID']['output'];
};

export type EmojiAggregates = {
  __typename?: 'EmojiAggregates';
  /** Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset) */
  distinctCount?: Maybe<EmojiDistinctCountAggregates>;
  keys?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

/** A filter to be used against aggregates of `Emoji` object types. */
export type EmojiAggregatesFilter = {
  /** Distinct count aggregate over matching `Emoji` objects. */
  distinctCount?: InputMaybe<EmojiDistinctCountAggregateFilter>;
  /** A filter that must pass for the relevant `Emoji` object to be included within the aggregate. */
  filter?: InputMaybe<EmojiFilter>;
};

/** A condition to be used against `Emoji` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type EmojiCondition = {
  /** Checks for equality with the object’s `createdAt` field. */
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `emoji` field. */
  emoji?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `postId` field. */
  postId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `rowId` field. */
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `updatedAt` field. */
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `userId` field. */
  userId?: InputMaybe<Scalars['UUID']['input']>;
};

/** A connection to a list of `Emoji` values. */
export type EmojiConnection = {
  __typename?: 'EmojiConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<EmojiAggregates>;
  /** A list of edges which contains the `Emoji` and cursor to aid in pagination. */
  edges: Array<EmojiEdge>;
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<Array<EmojiAggregates>>;
  /** A list of `Emoji` objects. */
  nodes: Array<Emoji>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Emoji` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `Emoji` values. */
export type EmojiConnectionGroupedAggregatesArgs = {
  groupBy: Array<EmojiGroupBy>;
  having?: InputMaybe<EmojiHavingInput>;
};

export type EmojiDistinctCountAggregateFilter = {
  createdAt?: InputMaybe<BigIntFilter>;
  emoji?: InputMaybe<BigIntFilter>;
  postId?: InputMaybe<BigIntFilter>;
  rowId?: InputMaybe<BigIntFilter>;
  updatedAt?: InputMaybe<BigIntFilter>;
  userId?: InputMaybe<BigIntFilter>;
};

export type EmojiDistinctCountAggregates = {
  __typename?: 'EmojiDistinctCountAggregates';
  /** Distinct count of createdAt across the matching connection */
  createdAt?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of emoji across the matching connection */
  emoji?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of postId across the matching connection */
  postId?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of rowId across the matching connection */
  rowId?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of updatedAt across the matching connection */
  updatedAt?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of userId across the matching connection */
  userId?: Maybe<Scalars['BigInt']['output']>;
};

/** A `Emoji` edge in the connection. */
export type EmojiEdge = {
  __typename?: 'EmojiEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Emoji` at the end of the edge. */
  node: Emoji;
};

/** A filter to be used against `Emoji` object types. All fields are combined with a logical ‘and.’ */
export type EmojiFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<EmojiFilter>>;
  /** Filter by the object’s `createdAt` field. */
  createdAt?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `emoji` field. */
  emoji?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<EmojiFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<EmojiFilter>>;
  /** Filter by the object’s `post` relation. */
  post?: InputMaybe<PostFilter>;
  /** Filter by the object’s `postId` field. */
  postId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `rowId` field. */
  rowId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `updatedAt` field. */
  updatedAt?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `user` relation. */
  user?: InputMaybe<UserFilter>;
  /** Filter by the object’s `userId` field. */
  userId?: InputMaybe<UuidFilter>;
};

/** Grouping methods for `Emoji` for usage during aggregation. */
export enum EmojiGroupBy {
  CreatedAt = 'CREATED_AT',
  CreatedAtTruncatedToDay = 'CREATED_AT_TRUNCATED_TO_DAY',
  CreatedAtTruncatedToHour = 'CREATED_AT_TRUNCATED_TO_HOUR',
  Emoji = 'EMOJI',
  PostId = 'POST_ID',
  UpdatedAt = 'UPDATED_AT',
  UpdatedAtTruncatedToDay = 'UPDATED_AT_TRUNCATED_TO_DAY',
  UpdatedAtTruncatedToHour = 'UPDATED_AT_TRUNCATED_TO_HOUR',
  UserId = 'USER_ID'
}

export type EmojiHavingAverageInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type EmojiHavingDistinctCountInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

/** Conditions for `Emoji` aggregates. */
export type EmojiHavingInput = {
  AND?: InputMaybe<Array<EmojiHavingInput>>;
  OR?: InputMaybe<Array<EmojiHavingInput>>;
  average?: InputMaybe<EmojiHavingAverageInput>;
  distinctCount?: InputMaybe<EmojiHavingDistinctCountInput>;
  max?: InputMaybe<EmojiHavingMaxInput>;
  min?: InputMaybe<EmojiHavingMinInput>;
  stddevPopulation?: InputMaybe<EmojiHavingStddevPopulationInput>;
  stddevSample?: InputMaybe<EmojiHavingStddevSampleInput>;
  sum?: InputMaybe<EmojiHavingSumInput>;
  variancePopulation?: InputMaybe<EmojiHavingVariancePopulationInput>;
  varianceSample?: InputMaybe<EmojiHavingVarianceSampleInput>;
};

export type EmojiHavingMaxInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type EmojiHavingMinInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type EmojiHavingStddevPopulationInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type EmojiHavingStddevSampleInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type EmojiHavingSumInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type EmojiHavingVariancePopulationInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type EmojiHavingVarianceSampleInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

/** An input for mutations affecting `Emoji` */
export type EmojiInput = {
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  emoji?: InputMaybe<Scalars['String']['input']>;
  postId: Scalars['UUID']['input'];
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
  userId: Scalars['UUID']['input'];
};

/** Methods to use when ordering `Emoji`. */
export enum EmojiOrderBy {
  CreatedAtAsc = 'CREATED_AT_ASC',
  CreatedAtDesc = 'CREATED_AT_DESC',
  EmojiAsc = 'EMOJI_ASC',
  EmojiDesc = 'EMOJI_DESC',
  Natural = 'NATURAL',
  PostIdAsc = 'POST_ID_ASC',
  PostIdDesc = 'POST_ID_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  RowIdAsc = 'ROW_ID_ASC',
  RowIdDesc = 'ROW_ID_DESC',
  UpdatedAtAsc = 'UPDATED_AT_ASC',
  UpdatedAtDesc = 'UPDATED_AT_DESC',
  UserIdAsc = 'USER_ID_ASC',
  UserIdDesc = 'USER_ID_DESC'
}

/** Represents an update to a `Emoji`. Fields that are set will be updated. */
export type EmojiPatch = {
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  emoji?: InputMaybe<Scalars['String']['input']>;
  postId?: InputMaybe<Scalars['UUID']['input']>;
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
  userId?: InputMaybe<Scalars['UUID']['input']>;
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

export type Invitation = Node & {
  __typename?: 'Invitation';
  createdAt: Scalars['Datetime']['output'];
  email?: Maybe<Scalars['String']['output']>;
  expiresAt: Scalars['Datetime']['output'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  id: Scalars['ID']['output'];
  /** Reads a single `User` that is related to this `Invitation`. */
  inviterUser?: Maybe<User>;
  inviterUserId: Scalars['UUID']['output'];
  organizationId: Scalars['String']['output'];
  role: MemberRole;
  rowId: Scalars['UUID']['output'];
  status: InvitationStatus;
  token: Scalars['String']['output'];
};

export type InvitationAggregates = {
  __typename?: 'InvitationAggregates';
  /** Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset) */
  distinctCount?: Maybe<InvitationDistinctCountAggregates>;
  keys?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

/** A filter to be used against aggregates of `Invitation` object types. */
export type InvitationAggregatesFilter = {
  /** Distinct count aggregate over matching `Invitation` objects. */
  distinctCount?: InputMaybe<InvitationDistinctCountAggregateFilter>;
  /** A filter that must pass for the relevant `Invitation` object to be included within the aggregate. */
  filter?: InputMaybe<InvitationFilter>;
};

/**
 * A condition to be used against `Invitation` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type InvitationCondition = {
  /** Checks for equality with the object’s `createdAt` field. */
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `email` field. */
  email?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `expiresAt` field. */
  expiresAt?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `inviterUserId` field. */
  inviterUserId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `organizationId` field. */
  organizationId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `role` field. */
  role?: InputMaybe<MemberRole>;
  /** Checks for equality with the object’s `rowId` field. */
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `status` field. */
  status?: InputMaybe<InvitationStatus>;
  /** Checks for equality with the object’s `token` field. */
  token?: InputMaybe<Scalars['String']['input']>;
};

/** A connection to a list of `Invitation` values. */
export type InvitationConnection = {
  __typename?: 'InvitationConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<InvitationAggregates>;
  /** A list of edges which contains the `Invitation` and cursor to aid in pagination. */
  edges: Array<InvitationEdge>;
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<Array<InvitationAggregates>>;
  /** A list of `Invitation` objects. */
  nodes: Array<Invitation>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Invitation` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `Invitation` values. */
export type InvitationConnectionGroupedAggregatesArgs = {
  groupBy: Array<InvitationGroupBy>;
  having?: InputMaybe<InvitationHavingInput>;
};

export type InvitationDistinctCountAggregateFilter = {
  createdAt?: InputMaybe<BigIntFilter>;
  email?: InputMaybe<BigIntFilter>;
  expiresAt?: InputMaybe<BigIntFilter>;
  inviterUserId?: InputMaybe<BigIntFilter>;
  organizationId?: InputMaybe<BigIntFilter>;
  role?: InputMaybe<BigIntFilter>;
  rowId?: InputMaybe<BigIntFilter>;
  status?: InputMaybe<BigIntFilter>;
  token?: InputMaybe<BigIntFilter>;
};

export type InvitationDistinctCountAggregates = {
  __typename?: 'InvitationDistinctCountAggregates';
  /** Distinct count of createdAt across the matching connection */
  createdAt?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of email across the matching connection */
  email?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of expiresAt across the matching connection */
  expiresAt?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of inviterUserId across the matching connection */
  inviterUserId?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of organizationId across the matching connection */
  organizationId?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of role across the matching connection */
  role?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of rowId across the matching connection */
  rowId?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of status across the matching connection */
  status?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of token across the matching connection */
  token?: Maybe<Scalars['BigInt']['output']>;
};

/** A `Invitation` edge in the connection. */
export type InvitationEdge = {
  __typename?: 'InvitationEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Invitation` at the end of the edge. */
  node: Invitation;
};

/** A filter to be used against `Invitation` object types. All fields are combined with a logical ‘and.’ */
export type InvitationFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<InvitationFilter>>;
  /** Filter by the object’s `createdAt` field. */
  createdAt?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `email` field. */
  email?: InputMaybe<StringFilter>;
  /** Filter by the object’s `expiresAt` field. */
  expiresAt?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `inviterUser` relation. */
  inviterUser?: InputMaybe<UserFilter>;
  /** Filter by the object’s `inviterUserId` field. */
  inviterUserId?: InputMaybe<UuidFilter>;
  /** Negates the expression. */
  not?: InputMaybe<InvitationFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<InvitationFilter>>;
  /** Filter by the object’s `organizationId` field. */
  organizationId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `role` field. */
  role?: InputMaybe<MemberRoleFilter>;
  /** Filter by the object’s `rowId` field. */
  rowId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `status` field. */
  status?: InputMaybe<InvitationStatusFilter>;
  /** Filter by the object’s `token` field. */
  token?: InputMaybe<StringFilter>;
};

/** Grouping methods for `Invitation` for usage during aggregation. */
export enum InvitationGroupBy {
  CreatedAt = 'CREATED_AT',
  CreatedAtTruncatedToDay = 'CREATED_AT_TRUNCATED_TO_DAY',
  CreatedAtTruncatedToHour = 'CREATED_AT_TRUNCATED_TO_HOUR',
  Email = 'EMAIL',
  ExpiresAt = 'EXPIRES_AT',
  ExpiresAtTruncatedToDay = 'EXPIRES_AT_TRUNCATED_TO_DAY',
  ExpiresAtTruncatedToHour = 'EXPIRES_AT_TRUNCATED_TO_HOUR',
  InviterUserId = 'INVITER_USER_ID',
  OrganizationId = 'ORGANIZATION_ID',
  Role = 'ROLE',
  Status = 'STATUS'
}

export type InvitationHavingAverageInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  expiresAt?: InputMaybe<HavingDatetimeFilter>;
};

export type InvitationHavingDistinctCountInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  expiresAt?: InputMaybe<HavingDatetimeFilter>;
};

/** Conditions for `Invitation` aggregates. */
export type InvitationHavingInput = {
  AND?: InputMaybe<Array<InvitationHavingInput>>;
  OR?: InputMaybe<Array<InvitationHavingInput>>;
  average?: InputMaybe<InvitationHavingAverageInput>;
  distinctCount?: InputMaybe<InvitationHavingDistinctCountInput>;
  max?: InputMaybe<InvitationHavingMaxInput>;
  min?: InputMaybe<InvitationHavingMinInput>;
  stddevPopulation?: InputMaybe<InvitationHavingStddevPopulationInput>;
  stddevSample?: InputMaybe<InvitationHavingStddevSampleInput>;
  sum?: InputMaybe<InvitationHavingSumInput>;
  variancePopulation?: InputMaybe<InvitationHavingVariancePopulationInput>;
  varianceSample?: InputMaybe<InvitationHavingVarianceSampleInput>;
};

export type InvitationHavingMaxInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  expiresAt?: InputMaybe<HavingDatetimeFilter>;
};

export type InvitationHavingMinInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  expiresAt?: InputMaybe<HavingDatetimeFilter>;
};

export type InvitationHavingStddevPopulationInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  expiresAt?: InputMaybe<HavingDatetimeFilter>;
};

export type InvitationHavingStddevSampleInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  expiresAt?: InputMaybe<HavingDatetimeFilter>;
};

export type InvitationHavingSumInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  expiresAt?: InputMaybe<HavingDatetimeFilter>;
};

export type InvitationHavingVariancePopulationInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  expiresAt?: InputMaybe<HavingDatetimeFilter>;
};

export type InvitationHavingVarianceSampleInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  expiresAt?: InputMaybe<HavingDatetimeFilter>;
};

/** An input for mutations affecting `Invitation` */
export type InvitationInput = {
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  expiresAt: Scalars['Datetime']['input'];
  inviterUserId: Scalars['UUID']['input'];
  organizationId: Scalars['String']['input'];
  role?: InputMaybe<MemberRole>;
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  status?: InputMaybe<InvitationStatus>;
  token: Scalars['String']['input'];
};

/** Methods to use when ordering `Invitation`. */
export enum InvitationOrderBy {
  CreatedAtAsc = 'CREATED_AT_ASC',
  CreatedAtDesc = 'CREATED_AT_DESC',
  EmailAsc = 'EMAIL_ASC',
  EmailDesc = 'EMAIL_DESC',
  ExpiresAtAsc = 'EXPIRES_AT_ASC',
  ExpiresAtDesc = 'EXPIRES_AT_DESC',
  InviterUserIdAsc = 'INVITER_USER_ID_ASC',
  InviterUserIdDesc = 'INVITER_USER_ID_DESC',
  Natural = 'NATURAL',
  OrganizationIdAsc = 'ORGANIZATION_ID_ASC',
  OrganizationIdDesc = 'ORGANIZATION_ID_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  RowIdAsc = 'ROW_ID_ASC',
  RowIdDesc = 'ROW_ID_DESC',
  TokenAsc = 'TOKEN_ASC',
  TokenDesc = 'TOKEN_DESC'
}

/** Represents an update to a `Invitation`. Fields that are set will be updated. */
export type InvitationPatch = {
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  expiresAt?: InputMaybe<Scalars['Datetime']['input']>;
  inviterUserId?: InputMaybe<Scalars['UUID']['input']>;
  organizationId?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<MemberRole>;
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  status?: InputMaybe<InvitationStatus>;
  token?: InputMaybe<Scalars['String']['input']>;
};

export enum InvitationStatus {
  Accepted = 'accepted',
  Expired = 'expired',
  Pending = 'pending',
  Revoked = 'revoked'
}

/** A filter to be used against InvitationStatus fields. All fields are combined with a logical ‘and.’ */
export type InvitationStatusFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<InvitationStatus>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<InvitationStatus>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<InvitationStatus>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<InvitationStatus>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<InvitationStatus>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<InvitationStatus>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<InvitationStatus>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<InvitationStatus>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<InvitationStatus>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<InvitationStatus>>;
};

export type Label = Node & {
  __typename?: 'Label';
  color: Scalars['String']['output'];
  createdAt: Scalars['Datetime']['output'];
  icon?: Maybe<Scalars['String']['output']>;
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  organizationId?: Maybe<Scalars['String']['output']>;
  /** Reads a single `Project` that is related to this `Label`. */
  project?: Maybe<Project>;
  projectId?: Maybe<Scalars['UUID']['output']>;
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
  /** Checks for equality with the object’s `icon` field. */
  icon?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `name` field. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `organizationId` field. */
  organizationId?: InputMaybe<Scalars['String']['input']>;
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
  icon?: InputMaybe<BigIntFilter>;
  name?: InputMaybe<BigIntFilter>;
  organizationId?: InputMaybe<BigIntFilter>;
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
  /** Distinct count of icon across the matching connection */
  icon?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of name across the matching connection */
  name?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of organizationId across the matching connection */
  organizationId?: Maybe<Scalars['BigInt']['output']>;
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
  /** Filter by the object’s `icon` field. */
  icon?: InputMaybe<StringFilter>;
  /** Filter by the object’s `name` field. */
  name?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<LabelFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<LabelFilter>>;
  /** Filter by the object’s `organizationId` field. */
  organizationId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `project` relation. */
  project?: InputMaybe<ProjectFilter>;
  /** A related `project` exists. */
  projectExists?: InputMaybe<Scalars['Boolean']['input']>;
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
  Icon = 'ICON',
  Name = 'NAME',
  OrganizationId = 'ORGANIZATION_ID',
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
  icon?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  organizationId?: InputMaybe<Scalars['String']['input']>;
  projectId?: InputMaybe<Scalars['UUID']['input']>;
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
};

/** Methods to use when ordering `Label`. */
export enum LabelOrderBy {
  ColorAsc = 'COLOR_ASC',
  ColorDesc = 'COLOR_DESC',
  CreatedAtAsc = 'CREATED_AT_ASC',
  CreatedAtDesc = 'CREATED_AT_DESC',
  IconAsc = 'ICON_ASC',
  IconDesc = 'ICON_DESC',
  NameAsc = 'NAME_ASC',
  NameDesc = 'NAME_DESC',
  Natural = 'NATURAL',
  OrganizationIdAsc = 'ORGANIZATION_ID_ASC',
  OrganizationIdDesc = 'ORGANIZATION_ID_DESC',
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
  icon?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  organizationId?: InputMaybe<Scalars['String']['input']>;
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

export enum MemberRole {
  Admin = 'admin',
  Member = 'member',
  Owner = 'owner'
}

/** A filter to be used against MemberRole fields. All fields are combined with a logical ‘and.’ */
export type MemberRoleFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<MemberRole>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<MemberRole>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<MemberRole>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<MemberRole>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<MemberRole>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<MemberRole>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<MemberRole>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<MemberRole>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<MemberRole>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<MemberRole>>;
};

/** The root mutation type which contains root level fields which mutate data. */
export type Mutation = {
  __typename?: 'Mutation';
  /** Creates a single `Assignee`. */
  createAssignee?: Maybe<CreateAssigneePayload>;
  /** Creates a single `Column`. */
  createColumn?: Maybe<CreateColumnPayload>;
  /** Creates a single `Emoji`. */
  createEmoji?: Maybe<CreateEmojiPayload>;
  /** Creates a single `Invitation`. */
  createInvitation?: Maybe<CreateInvitationPayload>;
  /** Creates a single `Label`. */
  createLabel?: Maybe<CreateLabelPayload>;
  /** Creates a single `Post`. */
  createPost?: Maybe<CreatePostPayload>;
  /** Creates a single `Project`. */
  createProject?: Maybe<CreateProjectPayload>;
  /** Creates a single `ProjectColumn`. */
  createProjectColumn?: Maybe<CreateProjectColumnPayload>;
  /** Creates a single `ProjectLabel`. */
  createProjectLabel?: Maybe<CreateProjectLabelPayload>;
  /** Creates a single `ProjectProjectLabel`. */
  createProjectProjectLabel?: Maybe<CreateProjectProjectLabelPayload>;
  /** Creates a single `Setting`. */
  createSetting?: Maybe<CreateSettingPayload>;
  /** Creates a single `Task`. */
  createTask?: Maybe<CreateTaskPayload>;
  /** Creates a single `TaskLabel`. */
  createTaskLabel?: Maybe<CreateTaskLabelPayload>;
  /** Creates a single `User`. */
  createUser?: Maybe<CreateUserPayload>;
  /** Creates a single `UserOrganization`. */
  createUserOrganization?: Maybe<CreateUserOrganizationPayload>;
  /** Creates a single `UserPreference`. */
  createUserPreference?: Maybe<CreateUserPreferencePayload>;
  /** Deletes a single `Assignee` using a unique key. */
  deleteAssignee?: Maybe<DeleteAssigneePayload>;
  /** Deletes a single `Assignee` using its globally unique id. */
  deleteAssigneeById?: Maybe<DeleteAssigneePayload>;
  /** Deletes a single `Column` using a unique key. */
  deleteColumn?: Maybe<DeleteColumnPayload>;
  /** Deletes a single `Column` using its globally unique id. */
  deleteColumnById?: Maybe<DeleteColumnPayload>;
  /** Deletes a single `Emoji` using a unique key. */
  deleteEmoji?: Maybe<DeleteEmojiPayload>;
  /** Deletes a single `Emoji` using its globally unique id. */
  deleteEmojiById?: Maybe<DeleteEmojiPayload>;
  /** Deletes a single `Invitation` using a unique key. */
  deleteInvitation?: Maybe<DeleteInvitationPayload>;
  /** Deletes a single `Invitation` using its globally unique id. */
  deleteInvitationById?: Maybe<DeleteInvitationPayload>;
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
  /** Deletes a single `ProjectColumn` using a unique key. */
  deleteProjectColumn?: Maybe<DeleteProjectColumnPayload>;
  /** Deletes a single `ProjectColumn` using its globally unique id. */
  deleteProjectColumnById?: Maybe<DeleteProjectColumnPayload>;
  /** Deletes a single `ProjectLabel` using a unique key. */
  deleteProjectLabel?: Maybe<DeleteProjectLabelPayload>;
  /** Deletes a single `ProjectLabel` using its globally unique id. */
  deleteProjectLabelById?: Maybe<DeleteProjectLabelPayload>;
  /** Deletes a single `ProjectProjectLabel` using a unique key. */
  deleteProjectProjectLabel?: Maybe<DeleteProjectProjectLabelPayload>;
  /** Deletes a single `ProjectProjectLabel` using its globally unique id. */
  deleteProjectProjectLabelById?: Maybe<DeleteProjectProjectLabelPayload>;
  /** Deletes a single `Setting` using a unique key. */
  deleteSetting?: Maybe<DeleteSettingPayload>;
  /** Deletes a single `Setting` using its globally unique id. */
  deleteSettingById?: Maybe<DeleteSettingPayload>;
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
  /** Deletes a single `UserOrganization` using a unique key. */
  deleteUserOrganization?: Maybe<DeleteUserOrganizationPayload>;
  /** Deletes a single `UserOrganization` using its globally unique id. */
  deleteUserOrganizationById?: Maybe<DeleteUserOrganizationPayload>;
  /** Deletes a single `UserPreference` using a unique key. */
  deleteUserPreference?: Maybe<DeleteUserPreferencePayload>;
  /** Deletes a single `UserPreference` using its globally unique id. */
  deleteUserPreferenceById?: Maybe<DeleteUserPreferencePayload>;
  /** Updates a single `Assignee` using a unique key and a patch. */
  updateAssignee?: Maybe<UpdateAssigneePayload>;
  /** Updates a single `Assignee` using its globally unique id and a patch. */
  updateAssigneeById?: Maybe<UpdateAssigneePayload>;
  /** Updates a single `Column` using a unique key and a patch. */
  updateColumn?: Maybe<UpdateColumnPayload>;
  /** Updates a single `Column` using its globally unique id and a patch. */
  updateColumnById?: Maybe<UpdateColumnPayload>;
  /** Updates a single `Emoji` using a unique key and a patch. */
  updateEmoji?: Maybe<UpdateEmojiPayload>;
  /** Updates a single `Emoji` using its globally unique id and a patch. */
  updateEmojiById?: Maybe<UpdateEmojiPayload>;
  /** Updates a single `Invitation` using a unique key and a patch. */
  updateInvitation?: Maybe<UpdateInvitationPayload>;
  /** Updates a single `Invitation` using its globally unique id and a patch. */
  updateInvitationById?: Maybe<UpdateInvitationPayload>;
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
  /** Updates a single `ProjectColumn` using a unique key and a patch. */
  updateProjectColumn?: Maybe<UpdateProjectColumnPayload>;
  /** Updates a single `ProjectColumn` using its globally unique id and a patch. */
  updateProjectColumnById?: Maybe<UpdateProjectColumnPayload>;
  /** Updates a single `ProjectLabel` using a unique key and a patch. */
  updateProjectLabel?: Maybe<UpdateProjectLabelPayload>;
  /** Updates a single `ProjectLabel` using its globally unique id and a patch. */
  updateProjectLabelById?: Maybe<UpdateProjectLabelPayload>;
  /** Updates a single `ProjectProjectLabel` using a unique key and a patch. */
  updateProjectProjectLabel?: Maybe<UpdateProjectProjectLabelPayload>;
  /** Updates a single `ProjectProjectLabel` using its globally unique id and a patch. */
  updateProjectProjectLabelById?: Maybe<UpdateProjectProjectLabelPayload>;
  /** Updates a single `Setting` using a unique key and a patch. */
  updateSetting?: Maybe<UpdateSettingPayload>;
  /** Updates a single `Setting` using its globally unique id and a patch. */
  updateSettingById?: Maybe<UpdateSettingPayload>;
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
  /** Updates a single `UserOrganization` using a unique key and a patch. */
  updateUserOrganization?: Maybe<UpdateUserOrganizationPayload>;
  /** Updates a single `UserOrganization` using its globally unique id and a patch. */
  updateUserOrganizationById?: Maybe<UpdateUserOrganizationPayload>;
  /** Updates a single `UserPreference` using a unique key and a patch. */
  updateUserPreference?: Maybe<UpdateUserPreferencePayload>;
  /** Updates a single `UserPreference` using its globally unique id and a patch. */
  updateUserPreferenceById?: Maybe<UpdateUserPreferencePayload>;
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
export type MutationCreateEmojiArgs = {
  input: CreateEmojiInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateInvitationArgs = {
  input: CreateInvitationInput;
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
export type MutationCreateProjectColumnArgs = {
  input: CreateProjectColumnInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateProjectLabelArgs = {
  input: CreateProjectLabelInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateProjectProjectLabelArgs = {
  input: CreateProjectProjectLabelInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateSettingArgs = {
  input: CreateSettingInput;
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
export type MutationCreateUserOrganizationArgs = {
  input: CreateUserOrganizationInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateUserPreferenceArgs = {
  input: CreateUserPreferenceInput;
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
export type MutationDeleteEmojiArgs = {
  input: DeleteEmojiInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteEmojiByIdArgs = {
  input: DeleteEmojiByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteInvitationArgs = {
  input: DeleteInvitationInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteInvitationByIdArgs = {
  input: DeleteInvitationByIdInput;
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
export type MutationDeleteProjectColumnArgs = {
  input: DeleteProjectColumnInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteProjectColumnByIdArgs = {
  input: DeleteProjectColumnByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteProjectLabelArgs = {
  input: DeleteProjectLabelInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteProjectLabelByIdArgs = {
  input: DeleteProjectLabelByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteProjectProjectLabelArgs = {
  input: DeleteProjectProjectLabelInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteProjectProjectLabelByIdArgs = {
  input: DeleteProjectProjectLabelByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteSettingArgs = {
  input: DeleteSettingInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteSettingByIdArgs = {
  input: DeleteSettingByIdInput;
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
export type MutationDeleteUserOrganizationArgs = {
  input: DeleteUserOrganizationInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteUserOrganizationByIdArgs = {
  input: DeleteUserOrganizationByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteUserPreferenceArgs = {
  input: DeleteUserPreferenceInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteUserPreferenceByIdArgs = {
  input: DeleteUserPreferenceByIdInput;
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
export type MutationUpdateEmojiArgs = {
  input: UpdateEmojiInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateEmojiByIdArgs = {
  input: UpdateEmojiByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateInvitationArgs = {
  input: UpdateInvitationInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateInvitationByIdArgs = {
  input: UpdateInvitationByIdInput;
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
export type MutationUpdateProjectColumnArgs = {
  input: UpdateProjectColumnInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateProjectColumnByIdArgs = {
  input: UpdateProjectColumnByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateProjectLabelArgs = {
  input: UpdateProjectLabelInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateProjectLabelByIdArgs = {
  input: UpdateProjectLabelByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateProjectProjectLabelArgs = {
  input: UpdateProjectProjectLabelInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateProjectProjectLabelByIdArgs = {
  input: UpdateProjectProjectLabelByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateSettingArgs = {
  input: UpdateSettingInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateSettingByIdArgs = {
  input: UpdateSettingByIdInput;
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
export type MutationUpdateUserOrganizationArgs = {
  input: UpdateUserOrganizationInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateUserOrganizationByIdArgs = {
  input: UpdateUserOrganizationByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateUserPreferenceArgs = {
  input: UpdateUserPreferenceInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateUserPreferenceByIdArgs = {
  input: UpdateUserPreferenceByIdInput;
};

/** An object with a globally unique `ID`. */
export type Node = {
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  id: Scalars['ID']['output'];
};

/** The currently authenticated user. */
export type Observer = {
  __typename?: 'Observer';
  email: Scalars['String']['output'];
  identityProviderId: Scalars['UUID']['output'];
  name: Scalars['String']['output'];
  rowId: Scalars['UUID']['output'];
};

export enum OrganizationType {
  Personal = 'personal',
  Team = 'team'
}

/** A filter to be used against OrganizationType fields. All fields are combined with a logical ‘and.’ */
export type OrganizationTypeFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<OrganizationType>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<OrganizationType>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<OrganizationType>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<OrganizationType>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<OrganizationType>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<OrganizationType>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<OrganizationType>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<OrganizationType>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<OrganizationType>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<OrganizationType>>;
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
  authorId?: Maybe<Scalars['UUID']['output']>;
  createdAt: Scalars['Datetime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  /** Reads and enables pagination through a set of `Emoji`. */
  emojis: EmojiConnection;
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  id: Scalars['ID']['output'];
  rowId: Scalars['UUID']['output'];
  /** Reads a single `Task` that is related to this `Post`. */
  task?: Maybe<Task>;
  taskId: Scalars['UUID']['output'];
  title?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['Datetime']['output'];
};


export type PostEmojisArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<EmojiCondition>;
  filter?: InputMaybe<EmojiFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<EmojiOrderBy>>;
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
  /** A related `author` exists. */
  authorExists?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `authorId` field. */
  authorId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `createdAt` field. */
  createdAt?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `description` field. */
  description?: InputMaybe<StringFilter>;
  /** Filter by the object’s `emojis` relation. */
  emojis?: InputMaybe<PostToManyEmojiFilter>;
  /** Some related `emojis` exist. */
  emojisExist?: InputMaybe<Scalars['Boolean']['input']>;
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
  authorId?: InputMaybe<Scalars['UUID']['input']>;
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
  EmojisCountAsc = 'EMOJIS_COUNT_ASC',
  EmojisCountDesc = 'EMOJIS_COUNT_DESC',
  EmojisDistinctCountCreatedAtAsc = 'EMOJIS_DISTINCT_COUNT_CREATED_AT_ASC',
  EmojisDistinctCountCreatedAtDesc = 'EMOJIS_DISTINCT_COUNT_CREATED_AT_DESC',
  EmojisDistinctCountEmojiAsc = 'EMOJIS_DISTINCT_COUNT_EMOJI_ASC',
  EmojisDistinctCountEmojiDesc = 'EMOJIS_DISTINCT_COUNT_EMOJI_DESC',
  EmojisDistinctCountPostIdAsc = 'EMOJIS_DISTINCT_COUNT_POST_ID_ASC',
  EmojisDistinctCountPostIdDesc = 'EMOJIS_DISTINCT_COUNT_POST_ID_DESC',
  EmojisDistinctCountRowIdAsc = 'EMOJIS_DISTINCT_COUNT_ROW_ID_ASC',
  EmojisDistinctCountRowIdDesc = 'EMOJIS_DISTINCT_COUNT_ROW_ID_DESC',
  EmojisDistinctCountUpdatedAtAsc = 'EMOJIS_DISTINCT_COUNT_UPDATED_AT_ASC',
  EmojisDistinctCountUpdatedAtDesc = 'EMOJIS_DISTINCT_COUNT_UPDATED_AT_DESC',
  EmojisDistinctCountUserIdAsc = 'EMOJIS_DISTINCT_COUNT_USER_ID_ASC',
  EmojisDistinctCountUserIdDesc = 'EMOJIS_DISTINCT_COUNT_USER_ID_DESC',
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

/** A filter to be used against many `Emoji` object types. All fields are combined with a logical ‘and.’ */
export type PostToManyEmojiFilter = {
  /** Aggregates across related `Emoji` match the filter criteria. */
  aggregates?: InputMaybe<EmojiAggregatesFilter>;
  /** Every related `Emoji` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<EmojiFilter>;
  /** No related `Emoji` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<EmojiFilter>;
  /** Some related `Emoji` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<EmojiFilter>;
};

export type Project = Node & {
  __typename?: 'Project';
  columnIndex: Scalars['Int']['output'];
  /** Reads and enables pagination through a set of `Column`. */
  columns: ColumnConnection;
  createdAt: Scalars['Datetime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  id: Scalars['ID']['output'];
  isPublic: Scalars['Boolean']['output'];
  /** Reads and enables pagination through a set of `Label`. */
  labels: LabelConnection;
  name: Scalars['String']['output'];
  nextTaskNumber: Scalars['Int']['output'];
  organizationId: Scalars['String']['output'];
  prefix?: Maybe<Scalars['String']['output']>;
  /** Reads a single `ProjectColumn` that is related to this `Project`. */
  projectColumn?: Maybe<ProjectColumn>;
  projectColumnId: Scalars['UUID']['output'];
  /** Reads and enables pagination through a set of `ProjectProjectLabel`. */
  projectProjectLabels: ProjectProjectLabelConnection;
  rowId: Scalars['UUID']['output'];
  slug: Scalars['String']['output'];
  /** Reads and enables pagination through a set of `Task`. */
  tasks: TaskConnection;
  updatedAt: Scalars['Datetime']['output'];
  /** Reads and enables pagination through a set of `UserPreference`. */
  userPreferences: UserPreferenceConnection;
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


export type ProjectProjectProjectLabelsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<ProjectProjectLabelCondition>;
  filter?: InputMaybe<ProjectProjectLabelFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ProjectProjectLabelOrderBy>>;
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


export type ProjectUserPreferencesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<UserPreferenceCondition>;
  filter?: InputMaybe<UserPreferenceFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<UserPreferenceOrderBy>>;
};

export type ProjectAggregates = {
  __typename?: 'ProjectAggregates';
  /** Mean average aggregates across the matching connection (ignoring before/after/first/last/offset) */
  average?: Maybe<ProjectAverageAggregates>;
  /** Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset) */
  distinctCount?: Maybe<ProjectDistinctCountAggregates>;
  keys?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** Maximum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  max?: Maybe<ProjectMaxAggregates>;
  /** Minimum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  min?: Maybe<ProjectMinAggregates>;
  /** Population standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevPopulation?: Maybe<ProjectStddevPopulationAggregates>;
  /** Sample standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevSample?: Maybe<ProjectStddevSampleAggregates>;
  /** Sum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  sum?: Maybe<ProjectSumAggregates>;
  /** Population variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  variancePopulation?: Maybe<ProjectVariancePopulationAggregates>;
  /** Sample variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  varianceSample?: Maybe<ProjectVarianceSampleAggregates>;
};

/** A filter to be used against aggregates of `Project` object types. */
export type ProjectAggregatesFilter = {
  /** Mean average aggregate over matching `Project` objects. */
  average?: InputMaybe<ProjectAverageAggregateFilter>;
  /** Distinct count aggregate over matching `Project` objects. */
  distinctCount?: InputMaybe<ProjectDistinctCountAggregateFilter>;
  /** A filter that must pass for the relevant `Project` object to be included within the aggregate. */
  filter?: InputMaybe<ProjectFilter>;
  /** Maximum aggregate over matching `Project` objects. */
  max?: InputMaybe<ProjectMaxAggregateFilter>;
  /** Minimum aggregate over matching `Project` objects. */
  min?: InputMaybe<ProjectMinAggregateFilter>;
  /** Population standard deviation aggregate over matching `Project` objects. */
  stddevPopulation?: InputMaybe<ProjectStddevPopulationAggregateFilter>;
  /** Sample standard deviation aggregate over matching `Project` objects. */
  stddevSample?: InputMaybe<ProjectStddevSampleAggregateFilter>;
  /** Sum aggregate over matching `Project` objects. */
  sum?: InputMaybe<ProjectSumAggregateFilter>;
  /** Population variance aggregate over matching `Project` objects. */
  variancePopulation?: InputMaybe<ProjectVariancePopulationAggregateFilter>;
  /** Sample variance aggregate over matching `Project` objects. */
  varianceSample?: InputMaybe<ProjectVarianceSampleAggregateFilter>;
};

export type ProjectAverageAggregateFilter = {
  columnIndex?: InputMaybe<BigFloatFilter>;
  nextTaskNumber?: InputMaybe<BigFloatFilter>;
};

export type ProjectAverageAggregates = {
  __typename?: 'ProjectAverageAggregates';
  /** Mean average of columnIndex across the matching connection */
  columnIndex?: Maybe<Scalars['BigFloat']['output']>;
  /** Mean average of nextTaskNumber across the matching connection */
  nextTaskNumber?: Maybe<Scalars['BigFloat']['output']>;
};

export type ProjectColumn = Node & {
  __typename?: 'ProjectColumn';
  createdAt: Scalars['Datetime']['output'];
  icon?: Maybe<Scalars['String']['output']>;
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  id: Scalars['ID']['output'];
  index: Scalars['Int']['output'];
  organizationId: Scalars['String']['output'];
  /** Reads and enables pagination through a set of `Project`. */
  projects: ProjectConnection;
  rowId: Scalars['UUID']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['Datetime']['output'];
};


export type ProjectColumnProjectsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<ProjectCondition>;
  filter?: InputMaybe<ProjectFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ProjectOrderBy>>;
};

export type ProjectColumnAggregates = {
  __typename?: 'ProjectColumnAggregates';
  /** Mean average aggregates across the matching connection (ignoring before/after/first/last/offset) */
  average?: Maybe<ProjectColumnAverageAggregates>;
  /** Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset) */
  distinctCount?: Maybe<ProjectColumnDistinctCountAggregates>;
  keys?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** Maximum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  max?: Maybe<ProjectColumnMaxAggregates>;
  /** Minimum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  min?: Maybe<ProjectColumnMinAggregates>;
  /** Population standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevPopulation?: Maybe<ProjectColumnStddevPopulationAggregates>;
  /** Sample standard deviation aggregates across the matching connection (ignoring before/after/first/last/offset) */
  stddevSample?: Maybe<ProjectColumnStddevSampleAggregates>;
  /** Sum aggregates across the matching connection (ignoring before/after/first/last/offset) */
  sum?: Maybe<ProjectColumnSumAggregates>;
  /** Population variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  variancePopulation?: Maybe<ProjectColumnVariancePopulationAggregates>;
  /** Sample variance aggregates across the matching connection (ignoring before/after/first/last/offset) */
  varianceSample?: Maybe<ProjectColumnVarianceSampleAggregates>;
};

export type ProjectColumnAverageAggregates = {
  __typename?: 'ProjectColumnAverageAggregates';
  /** Mean average of index across the matching connection */
  index?: Maybe<Scalars['BigFloat']['output']>;
};

/**
 * A condition to be used against `ProjectColumn` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type ProjectColumnCondition = {
  /** Checks for equality with the object’s `createdAt` field. */
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `icon` field. */
  icon?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `index` field. */
  index?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `organizationId` field. */
  organizationId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `rowId` field. */
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `title` field. */
  title?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `updatedAt` field. */
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
};

/** A connection to a list of `ProjectColumn` values. */
export type ProjectColumnConnection = {
  __typename?: 'ProjectColumnConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<ProjectColumnAggregates>;
  /** A list of edges which contains the `ProjectColumn` and cursor to aid in pagination. */
  edges: Array<ProjectColumnEdge>;
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<Array<ProjectColumnAggregates>>;
  /** A list of `ProjectColumn` objects. */
  nodes: Array<ProjectColumn>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `ProjectColumn` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `ProjectColumn` values. */
export type ProjectColumnConnectionGroupedAggregatesArgs = {
  groupBy: Array<ProjectColumnGroupBy>;
  having?: InputMaybe<ProjectColumnHavingInput>;
};

export type ProjectColumnDistinctCountAggregates = {
  __typename?: 'ProjectColumnDistinctCountAggregates';
  /** Distinct count of createdAt across the matching connection */
  createdAt?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of icon across the matching connection */
  icon?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of index across the matching connection */
  index?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of organizationId across the matching connection */
  organizationId?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of rowId across the matching connection */
  rowId?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of title across the matching connection */
  title?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of updatedAt across the matching connection */
  updatedAt?: Maybe<Scalars['BigInt']['output']>;
};

/** A `ProjectColumn` edge in the connection. */
export type ProjectColumnEdge = {
  __typename?: 'ProjectColumnEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `ProjectColumn` at the end of the edge. */
  node: ProjectColumn;
};

/** A filter to be used against `ProjectColumn` object types. All fields are combined with a logical ‘and.’ */
export type ProjectColumnFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<ProjectColumnFilter>>;
  /** Filter by the object’s `createdAt` field. */
  createdAt?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `icon` field. */
  icon?: InputMaybe<StringFilter>;
  /** Filter by the object’s `index` field. */
  index?: InputMaybe<IntFilter>;
  /** Negates the expression. */
  not?: InputMaybe<ProjectColumnFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<ProjectColumnFilter>>;
  /** Filter by the object’s `organizationId` field. */
  organizationId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `projects` relation. */
  projects?: InputMaybe<ProjectColumnToManyProjectFilter>;
  /** Some related `projects` exist. */
  projectsExist?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `rowId` field. */
  rowId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `title` field. */
  title?: InputMaybe<StringFilter>;
  /** Filter by the object’s `updatedAt` field. */
  updatedAt?: InputMaybe<DatetimeFilter>;
};

/** Grouping methods for `ProjectColumn` for usage during aggregation. */
export enum ProjectColumnGroupBy {
  CreatedAt = 'CREATED_AT',
  CreatedAtTruncatedToDay = 'CREATED_AT_TRUNCATED_TO_DAY',
  CreatedAtTruncatedToHour = 'CREATED_AT_TRUNCATED_TO_HOUR',
  Icon = 'ICON',
  Index = 'INDEX',
  OrganizationId = 'ORGANIZATION_ID',
  Title = 'TITLE',
  UpdatedAt = 'UPDATED_AT',
  UpdatedAtTruncatedToDay = 'UPDATED_AT_TRUNCATED_TO_DAY',
  UpdatedAtTruncatedToHour = 'UPDATED_AT_TRUNCATED_TO_HOUR'
}

export type ProjectColumnHavingAverageInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  index?: InputMaybe<HavingIntFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type ProjectColumnHavingDistinctCountInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  index?: InputMaybe<HavingIntFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

/** Conditions for `ProjectColumn` aggregates. */
export type ProjectColumnHavingInput = {
  AND?: InputMaybe<Array<ProjectColumnHavingInput>>;
  OR?: InputMaybe<Array<ProjectColumnHavingInput>>;
  average?: InputMaybe<ProjectColumnHavingAverageInput>;
  distinctCount?: InputMaybe<ProjectColumnHavingDistinctCountInput>;
  max?: InputMaybe<ProjectColumnHavingMaxInput>;
  min?: InputMaybe<ProjectColumnHavingMinInput>;
  stddevPopulation?: InputMaybe<ProjectColumnHavingStddevPopulationInput>;
  stddevSample?: InputMaybe<ProjectColumnHavingStddevSampleInput>;
  sum?: InputMaybe<ProjectColumnHavingSumInput>;
  variancePopulation?: InputMaybe<ProjectColumnHavingVariancePopulationInput>;
  varianceSample?: InputMaybe<ProjectColumnHavingVarianceSampleInput>;
};

export type ProjectColumnHavingMaxInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  index?: InputMaybe<HavingIntFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type ProjectColumnHavingMinInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  index?: InputMaybe<HavingIntFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type ProjectColumnHavingStddevPopulationInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  index?: InputMaybe<HavingIntFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type ProjectColumnHavingStddevSampleInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  index?: InputMaybe<HavingIntFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type ProjectColumnHavingSumInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  index?: InputMaybe<HavingIntFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type ProjectColumnHavingVariancePopulationInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  index?: InputMaybe<HavingIntFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type ProjectColumnHavingVarianceSampleInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  index?: InputMaybe<HavingIntFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

/** An input for mutations affecting `ProjectColumn` */
export type ProjectColumnInput = {
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  icon?: InputMaybe<Scalars['String']['input']>;
  index?: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['String']['input'];
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  title: Scalars['String']['input'];
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
};

export type ProjectColumnMaxAggregates = {
  __typename?: 'ProjectColumnMaxAggregates';
  /** Maximum of index across the matching connection */
  index?: Maybe<Scalars['Int']['output']>;
};

export type ProjectColumnMinAggregates = {
  __typename?: 'ProjectColumnMinAggregates';
  /** Minimum of index across the matching connection */
  index?: Maybe<Scalars['Int']['output']>;
};

/** Methods to use when ordering `ProjectColumn`. */
export enum ProjectColumnOrderBy {
  CreatedAtAsc = 'CREATED_AT_ASC',
  CreatedAtDesc = 'CREATED_AT_DESC',
  IconAsc = 'ICON_ASC',
  IconDesc = 'ICON_DESC',
  IndexAsc = 'INDEX_ASC',
  IndexDesc = 'INDEX_DESC',
  Natural = 'NATURAL',
  OrganizationIdAsc = 'ORGANIZATION_ID_ASC',
  OrganizationIdDesc = 'ORGANIZATION_ID_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  ProjectsAverageColumnIndexAsc = 'PROJECTS_AVERAGE_COLUMN_INDEX_ASC',
  ProjectsAverageColumnIndexDesc = 'PROJECTS_AVERAGE_COLUMN_INDEX_DESC',
  ProjectsAverageNextTaskNumberAsc = 'PROJECTS_AVERAGE_NEXT_TASK_NUMBER_ASC',
  ProjectsAverageNextTaskNumberDesc = 'PROJECTS_AVERAGE_NEXT_TASK_NUMBER_DESC',
  ProjectsCountAsc = 'PROJECTS_COUNT_ASC',
  ProjectsCountDesc = 'PROJECTS_COUNT_DESC',
  ProjectsDistinctCountColumnIndexAsc = 'PROJECTS_DISTINCT_COUNT_COLUMN_INDEX_ASC',
  ProjectsDistinctCountColumnIndexDesc = 'PROJECTS_DISTINCT_COUNT_COLUMN_INDEX_DESC',
  ProjectsDistinctCountCreatedAtAsc = 'PROJECTS_DISTINCT_COUNT_CREATED_AT_ASC',
  ProjectsDistinctCountCreatedAtDesc = 'PROJECTS_DISTINCT_COUNT_CREATED_AT_DESC',
  ProjectsDistinctCountDescriptionAsc = 'PROJECTS_DISTINCT_COUNT_DESCRIPTION_ASC',
  ProjectsDistinctCountDescriptionDesc = 'PROJECTS_DISTINCT_COUNT_DESCRIPTION_DESC',
  ProjectsDistinctCountIsPublicAsc = 'PROJECTS_DISTINCT_COUNT_IS_PUBLIC_ASC',
  ProjectsDistinctCountIsPublicDesc = 'PROJECTS_DISTINCT_COUNT_IS_PUBLIC_DESC',
  ProjectsDistinctCountNameAsc = 'PROJECTS_DISTINCT_COUNT_NAME_ASC',
  ProjectsDistinctCountNameDesc = 'PROJECTS_DISTINCT_COUNT_NAME_DESC',
  ProjectsDistinctCountNextTaskNumberAsc = 'PROJECTS_DISTINCT_COUNT_NEXT_TASK_NUMBER_ASC',
  ProjectsDistinctCountNextTaskNumberDesc = 'PROJECTS_DISTINCT_COUNT_NEXT_TASK_NUMBER_DESC',
  ProjectsDistinctCountOrganizationIdAsc = 'PROJECTS_DISTINCT_COUNT_ORGANIZATION_ID_ASC',
  ProjectsDistinctCountOrganizationIdDesc = 'PROJECTS_DISTINCT_COUNT_ORGANIZATION_ID_DESC',
  ProjectsDistinctCountPrefixAsc = 'PROJECTS_DISTINCT_COUNT_PREFIX_ASC',
  ProjectsDistinctCountPrefixDesc = 'PROJECTS_DISTINCT_COUNT_PREFIX_DESC',
  ProjectsDistinctCountProjectColumnIdAsc = 'PROJECTS_DISTINCT_COUNT_PROJECT_COLUMN_ID_ASC',
  ProjectsDistinctCountProjectColumnIdDesc = 'PROJECTS_DISTINCT_COUNT_PROJECT_COLUMN_ID_DESC',
  ProjectsDistinctCountRowIdAsc = 'PROJECTS_DISTINCT_COUNT_ROW_ID_ASC',
  ProjectsDistinctCountRowIdDesc = 'PROJECTS_DISTINCT_COUNT_ROW_ID_DESC',
  ProjectsDistinctCountSlugAsc = 'PROJECTS_DISTINCT_COUNT_SLUG_ASC',
  ProjectsDistinctCountSlugDesc = 'PROJECTS_DISTINCT_COUNT_SLUG_DESC',
  ProjectsDistinctCountUpdatedAtAsc = 'PROJECTS_DISTINCT_COUNT_UPDATED_AT_ASC',
  ProjectsDistinctCountUpdatedAtDesc = 'PROJECTS_DISTINCT_COUNT_UPDATED_AT_DESC',
  ProjectsMaxColumnIndexAsc = 'PROJECTS_MAX_COLUMN_INDEX_ASC',
  ProjectsMaxColumnIndexDesc = 'PROJECTS_MAX_COLUMN_INDEX_DESC',
  ProjectsMaxNextTaskNumberAsc = 'PROJECTS_MAX_NEXT_TASK_NUMBER_ASC',
  ProjectsMaxNextTaskNumberDesc = 'PROJECTS_MAX_NEXT_TASK_NUMBER_DESC',
  ProjectsMinColumnIndexAsc = 'PROJECTS_MIN_COLUMN_INDEX_ASC',
  ProjectsMinColumnIndexDesc = 'PROJECTS_MIN_COLUMN_INDEX_DESC',
  ProjectsMinNextTaskNumberAsc = 'PROJECTS_MIN_NEXT_TASK_NUMBER_ASC',
  ProjectsMinNextTaskNumberDesc = 'PROJECTS_MIN_NEXT_TASK_NUMBER_DESC',
  ProjectsStddevPopulationColumnIndexAsc = 'PROJECTS_STDDEV_POPULATION_COLUMN_INDEX_ASC',
  ProjectsStddevPopulationColumnIndexDesc = 'PROJECTS_STDDEV_POPULATION_COLUMN_INDEX_DESC',
  ProjectsStddevPopulationNextTaskNumberAsc = 'PROJECTS_STDDEV_POPULATION_NEXT_TASK_NUMBER_ASC',
  ProjectsStddevPopulationNextTaskNumberDesc = 'PROJECTS_STDDEV_POPULATION_NEXT_TASK_NUMBER_DESC',
  ProjectsStddevSampleColumnIndexAsc = 'PROJECTS_STDDEV_SAMPLE_COLUMN_INDEX_ASC',
  ProjectsStddevSampleColumnIndexDesc = 'PROJECTS_STDDEV_SAMPLE_COLUMN_INDEX_DESC',
  ProjectsStddevSampleNextTaskNumberAsc = 'PROJECTS_STDDEV_SAMPLE_NEXT_TASK_NUMBER_ASC',
  ProjectsStddevSampleNextTaskNumberDesc = 'PROJECTS_STDDEV_SAMPLE_NEXT_TASK_NUMBER_DESC',
  ProjectsSumColumnIndexAsc = 'PROJECTS_SUM_COLUMN_INDEX_ASC',
  ProjectsSumColumnIndexDesc = 'PROJECTS_SUM_COLUMN_INDEX_DESC',
  ProjectsSumNextTaskNumberAsc = 'PROJECTS_SUM_NEXT_TASK_NUMBER_ASC',
  ProjectsSumNextTaskNumberDesc = 'PROJECTS_SUM_NEXT_TASK_NUMBER_DESC',
  ProjectsVariancePopulationColumnIndexAsc = 'PROJECTS_VARIANCE_POPULATION_COLUMN_INDEX_ASC',
  ProjectsVariancePopulationColumnIndexDesc = 'PROJECTS_VARIANCE_POPULATION_COLUMN_INDEX_DESC',
  ProjectsVariancePopulationNextTaskNumberAsc = 'PROJECTS_VARIANCE_POPULATION_NEXT_TASK_NUMBER_ASC',
  ProjectsVariancePopulationNextTaskNumberDesc = 'PROJECTS_VARIANCE_POPULATION_NEXT_TASK_NUMBER_DESC',
  ProjectsVarianceSampleColumnIndexAsc = 'PROJECTS_VARIANCE_SAMPLE_COLUMN_INDEX_ASC',
  ProjectsVarianceSampleColumnIndexDesc = 'PROJECTS_VARIANCE_SAMPLE_COLUMN_INDEX_DESC',
  ProjectsVarianceSampleNextTaskNumberAsc = 'PROJECTS_VARIANCE_SAMPLE_NEXT_TASK_NUMBER_ASC',
  ProjectsVarianceSampleNextTaskNumberDesc = 'PROJECTS_VARIANCE_SAMPLE_NEXT_TASK_NUMBER_DESC',
  RowIdAsc = 'ROW_ID_ASC',
  RowIdDesc = 'ROW_ID_DESC',
  TitleAsc = 'TITLE_ASC',
  TitleDesc = 'TITLE_DESC',
  UpdatedAtAsc = 'UPDATED_AT_ASC',
  UpdatedAtDesc = 'UPDATED_AT_DESC'
}

/** Represents an update to a `ProjectColumn`. Fields that are set will be updated. */
export type ProjectColumnPatch = {
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  icon?: InputMaybe<Scalars['String']['input']>;
  index?: InputMaybe<Scalars['Int']['input']>;
  organizationId?: InputMaybe<Scalars['String']['input']>;
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
};

export type ProjectColumnStddevPopulationAggregates = {
  __typename?: 'ProjectColumnStddevPopulationAggregates';
  /** Population standard deviation of index across the matching connection */
  index?: Maybe<Scalars['BigFloat']['output']>;
};

export type ProjectColumnStddevSampleAggregates = {
  __typename?: 'ProjectColumnStddevSampleAggregates';
  /** Sample standard deviation of index across the matching connection */
  index?: Maybe<Scalars['BigFloat']['output']>;
};

export type ProjectColumnSumAggregates = {
  __typename?: 'ProjectColumnSumAggregates';
  /** Sum of index across the matching connection */
  index: Scalars['BigInt']['output'];
};

/** A filter to be used against many `Project` object types. All fields are combined with a logical ‘and.’ */
export type ProjectColumnToManyProjectFilter = {
  /** Aggregates across related `Project` match the filter criteria. */
  aggregates?: InputMaybe<ProjectAggregatesFilter>;
  /** Every related `Project` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<ProjectFilter>;
  /** No related `Project` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<ProjectFilter>;
  /** Some related `Project` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<ProjectFilter>;
};

export type ProjectColumnVariancePopulationAggregates = {
  __typename?: 'ProjectColumnVariancePopulationAggregates';
  /** Population variance of index across the matching connection */
  index?: Maybe<Scalars['BigFloat']['output']>;
};

export type ProjectColumnVarianceSampleAggregates = {
  __typename?: 'ProjectColumnVarianceSampleAggregates';
  /** Sample variance of index across the matching connection */
  index?: Maybe<Scalars['BigFloat']['output']>;
};

/** A condition to be used against `Project` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type ProjectCondition = {
  /** Checks for equality with the object’s `columnIndex` field. */
  columnIndex?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `createdAt` field. */
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `description` field. */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `isPublic` field. */
  isPublic?: InputMaybe<Scalars['Boolean']['input']>;
  /** Checks for equality with the object’s `name` field. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `nextTaskNumber` field. */
  nextTaskNumber?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `organizationId` field. */
  organizationId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `prefix` field. */
  prefix?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `projectColumnId` field. */
  projectColumnId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `rowId` field. */
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `slug` field. */
  slug?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `updatedAt` field. */
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
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
  columnIndex?: InputMaybe<BigIntFilter>;
  createdAt?: InputMaybe<BigIntFilter>;
  description?: InputMaybe<BigIntFilter>;
  isPublic?: InputMaybe<BigIntFilter>;
  name?: InputMaybe<BigIntFilter>;
  nextTaskNumber?: InputMaybe<BigIntFilter>;
  organizationId?: InputMaybe<BigIntFilter>;
  prefix?: InputMaybe<BigIntFilter>;
  projectColumnId?: InputMaybe<BigIntFilter>;
  rowId?: InputMaybe<BigIntFilter>;
  slug?: InputMaybe<BigIntFilter>;
  updatedAt?: InputMaybe<BigIntFilter>;
};

export type ProjectDistinctCountAggregates = {
  __typename?: 'ProjectDistinctCountAggregates';
  /** Distinct count of columnIndex across the matching connection */
  columnIndex?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of createdAt across the matching connection */
  createdAt?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of description across the matching connection */
  description?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of isPublic across the matching connection */
  isPublic?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of name across the matching connection */
  name?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of nextTaskNumber across the matching connection */
  nextTaskNumber?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of organizationId across the matching connection */
  organizationId?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of prefix across the matching connection */
  prefix?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of projectColumnId across the matching connection */
  projectColumnId?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of rowId across the matching connection */
  rowId?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of slug across the matching connection */
  slug?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of updatedAt across the matching connection */
  updatedAt?: Maybe<Scalars['BigInt']['output']>;
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
  /** Filter by the object’s `columnIndex` field. */
  columnIndex?: InputMaybe<IntFilter>;
  /** Filter by the object’s `columns` relation. */
  columns?: InputMaybe<ProjectToManyColumnFilter>;
  /** Some related `columns` exist. */
  columnsExist?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `createdAt` field. */
  createdAt?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `description` field. */
  description?: InputMaybe<StringFilter>;
  /** Filter by the object’s `isPublic` field. */
  isPublic?: InputMaybe<BooleanFilter>;
  /** Filter by the object’s `labels` relation. */
  labels?: InputMaybe<ProjectToManyLabelFilter>;
  /** Some related `labels` exist. */
  labelsExist?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `name` field. */
  name?: InputMaybe<StringFilter>;
  /** Filter by the object’s `nextTaskNumber` field. */
  nextTaskNumber?: InputMaybe<IntFilter>;
  /** Negates the expression. */
  not?: InputMaybe<ProjectFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<ProjectFilter>>;
  /** Filter by the object’s `organizationId` field. */
  organizationId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `prefix` field. */
  prefix?: InputMaybe<StringFilter>;
  /** Filter by the object’s `projectColumn` relation. */
  projectColumn?: InputMaybe<ProjectColumnFilter>;
  /** Filter by the object’s `projectColumnId` field. */
  projectColumnId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `projectProjectLabels` relation. */
  projectProjectLabels?: InputMaybe<ProjectToManyProjectProjectLabelFilter>;
  /** Some related `projectProjectLabels` exist. */
  projectProjectLabelsExist?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `rowId` field. */
  rowId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `slug` field. */
  slug?: InputMaybe<StringFilter>;
  /** Filter by the object’s `tasks` relation. */
  tasks?: InputMaybe<ProjectToManyTaskFilter>;
  /** Some related `tasks` exist. */
  tasksExist?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `updatedAt` field. */
  updatedAt?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `userPreferences` relation. */
  userPreferences?: InputMaybe<ProjectToManyUserPreferenceFilter>;
  /** Some related `userPreferences` exist. */
  userPreferencesExist?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Grouping methods for `Project` for usage during aggregation. */
export enum ProjectGroupBy {
  ColumnIndex = 'COLUMN_INDEX',
  CreatedAt = 'CREATED_AT',
  CreatedAtTruncatedToDay = 'CREATED_AT_TRUNCATED_TO_DAY',
  CreatedAtTruncatedToHour = 'CREATED_AT_TRUNCATED_TO_HOUR',
  Description = 'DESCRIPTION',
  IsPublic = 'IS_PUBLIC',
  Name = 'NAME',
  NextTaskNumber = 'NEXT_TASK_NUMBER',
  OrganizationId = 'ORGANIZATION_ID',
  Prefix = 'PREFIX',
  ProjectColumnId = 'PROJECT_COLUMN_ID',
  Slug = 'SLUG',
  UpdatedAt = 'UPDATED_AT',
  UpdatedAtTruncatedToDay = 'UPDATED_AT_TRUNCATED_TO_DAY',
  UpdatedAtTruncatedToHour = 'UPDATED_AT_TRUNCATED_TO_HOUR'
}

export type ProjectHavingAverageInput = {
  columnIndex?: InputMaybe<HavingIntFilter>;
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  nextTaskNumber?: InputMaybe<HavingIntFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type ProjectHavingDistinctCountInput = {
  columnIndex?: InputMaybe<HavingIntFilter>;
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  nextTaskNumber?: InputMaybe<HavingIntFilter>;
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
  columnIndex?: InputMaybe<HavingIntFilter>;
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  nextTaskNumber?: InputMaybe<HavingIntFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type ProjectHavingMinInput = {
  columnIndex?: InputMaybe<HavingIntFilter>;
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  nextTaskNumber?: InputMaybe<HavingIntFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type ProjectHavingStddevPopulationInput = {
  columnIndex?: InputMaybe<HavingIntFilter>;
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  nextTaskNumber?: InputMaybe<HavingIntFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type ProjectHavingStddevSampleInput = {
  columnIndex?: InputMaybe<HavingIntFilter>;
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  nextTaskNumber?: InputMaybe<HavingIntFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type ProjectHavingSumInput = {
  columnIndex?: InputMaybe<HavingIntFilter>;
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  nextTaskNumber?: InputMaybe<HavingIntFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type ProjectHavingVariancePopulationInput = {
  columnIndex?: InputMaybe<HavingIntFilter>;
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  nextTaskNumber?: InputMaybe<HavingIntFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type ProjectHavingVarianceSampleInput = {
  columnIndex?: InputMaybe<HavingIntFilter>;
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  nextTaskNumber?: InputMaybe<HavingIntFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

/** An input for mutations affecting `Project` */
export type ProjectInput = {
  columnIndex?: InputMaybe<Scalars['Int']['input']>;
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  isPublic?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
  nextTaskNumber?: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['String']['input'];
  prefix?: InputMaybe<Scalars['String']['input']>;
  projectColumnId: Scalars['UUID']['input'];
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  slug: Scalars['String']['input'];
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
};

export type ProjectLabel = Node & {
  __typename?: 'ProjectLabel';
  color: Scalars['String']['output'];
  createdAt: Scalars['Datetime']['output'];
  icon?: Maybe<Scalars['String']['output']>;
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  organizationId: Scalars['String']['output'];
  /** Reads and enables pagination through a set of `ProjectProjectLabel`. */
  projectProjectLabels: ProjectProjectLabelConnection;
  rowId: Scalars['UUID']['output'];
  updatedAt: Scalars['Datetime']['output'];
};


export type ProjectLabelProjectProjectLabelsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<ProjectProjectLabelCondition>;
  filter?: InputMaybe<ProjectProjectLabelFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ProjectProjectLabelOrderBy>>;
};

export type ProjectLabelAggregates = {
  __typename?: 'ProjectLabelAggregates';
  /** Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset) */
  distinctCount?: Maybe<ProjectLabelDistinctCountAggregates>;
  keys?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

/**
 * A condition to be used against `ProjectLabel` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type ProjectLabelCondition = {
  /** Checks for equality with the object’s `color` field. */
  color?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `createdAt` field. */
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `icon` field. */
  icon?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `name` field. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `organizationId` field. */
  organizationId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `rowId` field. */
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `updatedAt` field. */
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
};

/** A connection to a list of `ProjectLabel` values. */
export type ProjectLabelConnection = {
  __typename?: 'ProjectLabelConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<ProjectLabelAggregates>;
  /** A list of edges which contains the `ProjectLabel` and cursor to aid in pagination. */
  edges: Array<ProjectLabelEdge>;
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<Array<ProjectLabelAggregates>>;
  /** A list of `ProjectLabel` objects. */
  nodes: Array<ProjectLabel>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `ProjectLabel` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `ProjectLabel` values. */
export type ProjectLabelConnectionGroupedAggregatesArgs = {
  groupBy: Array<ProjectLabelGroupBy>;
  having?: InputMaybe<ProjectLabelHavingInput>;
};

export type ProjectLabelDistinctCountAggregates = {
  __typename?: 'ProjectLabelDistinctCountAggregates';
  /** Distinct count of color across the matching connection */
  color?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of createdAt across the matching connection */
  createdAt?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of icon across the matching connection */
  icon?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of name across the matching connection */
  name?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of organizationId across the matching connection */
  organizationId?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of rowId across the matching connection */
  rowId?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of updatedAt across the matching connection */
  updatedAt?: Maybe<Scalars['BigInt']['output']>;
};

/** A `ProjectLabel` edge in the connection. */
export type ProjectLabelEdge = {
  __typename?: 'ProjectLabelEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `ProjectLabel` at the end of the edge. */
  node: ProjectLabel;
};

/** A filter to be used against `ProjectLabel` object types. All fields are combined with a logical ‘and.’ */
export type ProjectLabelFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<ProjectLabelFilter>>;
  /** Filter by the object’s `color` field. */
  color?: InputMaybe<StringFilter>;
  /** Filter by the object’s `createdAt` field. */
  createdAt?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `icon` field. */
  icon?: InputMaybe<StringFilter>;
  /** Filter by the object’s `name` field. */
  name?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<ProjectLabelFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<ProjectLabelFilter>>;
  /** Filter by the object’s `organizationId` field. */
  organizationId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `projectProjectLabels` relation. */
  projectProjectLabels?: InputMaybe<ProjectLabelToManyProjectProjectLabelFilter>;
  /** Some related `projectProjectLabels` exist. */
  projectProjectLabelsExist?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `rowId` field. */
  rowId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `updatedAt` field. */
  updatedAt?: InputMaybe<DatetimeFilter>;
};

/** Grouping methods for `ProjectLabel` for usage during aggregation. */
export enum ProjectLabelGroupBy {
  Color = 'COLOR',
  CreatedAt = 'CREATED_AT',
  CreatedAtTruncatedToDay = 'CREATED_AT_TRUNCATED_TO_DAY',
  CreatedAtTruncatedToHour = 'CREATED_AT_TRUNCATED_TO_HOUR',
  Icon = 'ICON',
  Name = 'NAME',
  OrganizationId = 'ORGANIZATION_ID',
  UpdatedAt = 'UPDATED_AT',
  UpdatedAtTruncatedToDay = 'UPDATED_AT_TRUNCATED_TO_DAY',
  UpdatedAtTruncatedToHour = 'UPDATED_AT_TRUNCATED_TO_HOUR'
}

export type ProjectLabelHavingAverageInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type ProjectLabelHavingDistinctCountInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

/** Conditions for `ProjectLabel` aggregates. */
export type ProjectLabelHavingInput = {
  AND?: InputMaybe<Array<ProjectLabelHavingInput>>;
  OR?: InputMaybe<Array<ProjectLabelHavingInput>>;
  average?: InputMaybe<ProjectLabelHavingAverageInput>;
  distinctCount?: InputMaybe<ProjectLabelHavingDistinctCountInput>;
  max?: InputMaybe<ProjectLabelHavingMaxInput>;
  min?: InputMaybe<ProjectLabelHavingMinInput>;
  stddevPopulation?: InputMaybe<ProjectLabelHavingStddevPopulationInput>;
  stddevSample?: InputMaybe<ProjectLabelHavingStddevSampleInput>;
  sum?: InputMaybe<ProjectLabelHavingSumInput>;
  variancePopulation?: InputMaybe<ProjectLabelHavingVariancePopulationInput>;
  varianceSample?: InputMaybe<ProjectLabelHavingVarianceSampleInput>;
};

export type ProjectLabelHavingMaxInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type ProjectLabelHavingMinInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type ProjectLabelHavingStddevPopulationInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type ProjectLabelHavingStddevSampleInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type ProjectLabelHavingSumInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type ProjectLabelHavingVariancePopulationInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type ProjectLabelHavingVarianceSampleInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

/** An input for mutations affecting `ProjectLabel` */
export type ProjectLabelInput = {
  color: Scalars['String']['input'];
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  icon?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  organizationId: Scalars['String']['input'];
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
};

/** Methods to use when ordering `ProjectLabel`. */
export enum ProjectLabelOrderBy {
  ColorAsc = 'COLOR_ASC',
  ColorDesc = 'COLOR_DESC',
  CreatedAtAsc = 'CREATED_AT_ASC',
  CreatedAtDesc = 'CREATED_AT_DESC',
  IconAsc = 'ICON_ASC',
  IconDesc = 'ICON_DESC',
  NameAsc = 'NAME_ASC',
  NameDesc = 'NAME_DESC',
  Natural = 'NATURAL',
  OrganizationIdAsc = 'ORGANIZATION_ID_ASC',
  OrganizationIdDesc = 'ORGANIZATION_ID_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  ProjectProjectLabelsCountAsc = 'PROJECT_PROJECT_LABELS_COUNT_ASC',
  ProjectProjectLabelsCountDesc = 'PROJECT_PROJECT_LABELS_COUNT_DESC',
  ProjectProjectLabelsDistinctCountCreatedAtAsc = 'PROJECT_PROJECT_LABELS_DISTINCT_COUNT_CREATED_AT_ASC',
  ProjectProjectLabelsDistinctCountCreatedAtDesc = 'PROJECT_PROJECT_LABELS_DISTINCT_COUNT_CREATED_AT_DESC',
  ProjectProjectLabelsDistinctCountProjectIdAsc = 'PROJECT_PROJECT_LABELS_DISTINCT_COUNT_PROJECT_ID_ASC',
  ProjectProjectLabelsDistinctCountProjectIdDesc = 'PROJECT_PROJECT_LABELS_DISTINCT_COUNT_PROJECT_ID_DESC',
  ProjectProjectLabelsDistinctCountProjectLabelIdAsc = 'PROJECT_PROJECT_LABELS_DISTINCT_COUNT_PROJECT_LABEL_ID_ASC',
  ProjectProjectLabelsDistinctCountProjectLabelIdDesc = 'PROJECT_PROJECT_LABELS_DISTINCT_COUNT_PROJECT_LABEL_ID_DESC',
  RowIdAsc = 'ROW_ID_ASC',
  RowIdDesc = 'ROW_ID_DESC',
  UpdatedAtAsc = 'UPDATED_AT_ASC',
  UpdatedAtDesc = 'UPDATED_AT_DESC'
}

/** Represents an update to a `ProjectLabel`. Fields that are set will be updated. */
export type ProjectLabelPatch = {
  color?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  icon?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  organizationId?: InputMaybe<Scalars['String']['input']>;
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
};

/** A filter to be used against many `ProjectProjectLabel` object types. All fields are combined with a logical ‘and.’ */
export type ProjectLabelToManyProjectProjectLabelFilter = {
  /** Aggregates across related `ProjectProjectLabel` match the filter criteria. */
  aggregates?: InputMaybe<ProjectProjectLabelAggregatesFilter>;
  /** Every related `ProjectProjectLabel` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<ProjectProjectLabelFilter>;
  /** No related `ProjectProjectLabel` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<ProjectProjectLabelFilter>;
  /** Some related `ProjectProjectLabel` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<ProjectProjectLabelFilter>;
};

export type ProjectMaxAggregateFilter = {
  columnIndex?: InputMaybe<IntFilter>;
  nextTaskNumber?: InputMaybe<IntFilter>;
};

export type ProjectMaxAggregates = {
  __typename?: 'ProjectMaxAggregates';
  /** Maximum of columnIndex across the matching connection */
  columnIndex?: Maybe<Scalars['Int']['output']>;
  /** Maximum of nextTaskNumber across the matching connection */
  nextTaskNumber?: Maybe<Scalars['Int']['output']>;
};

export type ProjectMinAggregateFilter = {
  columnIndex?: InputMaybe<IntFilter>;
  nextTaskNumber?: InputMaybe<IntFilter>;
};

export type ProjectMinAggregates = {
  __typename?: 'ProjectMinAggregates';
  /** Minimum of columnIndex across the matching connection */
  columnIndex?: Maybe<Scalars['Int']['output']>;
  /** Minimum of nextTaskNumber across the matching connection */
  nextTaskNumber?: Maybe<Scalars['Int']['output']>;
};

/** Methods to use when ordering `Project`. */
export enum ProjectOrderBy {
  ColumnsAverageIndexAsc = 'COLUMNS_AVERAGE_INDEX_ASC',
  ColumnsAverageIndexDesc = 'COLUMNS_AVERAGE_INDEX_DESC',
  ColumnsCountAsc = 'COLUMNS_COUNT_ASC',
  ColumnsCountDesc = 'COLUMNS_COUNT_DESC',
  ColumnsDistinctCountCreatedAtAsc = 'COLUMNS_DISTINCT_COUNT_CREATED_AT_ASC',
  ColumnsDistinctCountCreatedAtDesc = 'COLUMNS_DISTINCT_COUNT_CREATED_AT_DESC',
  ColumnsDistinctCountIconAsc = 'COLUMNS_DISTINCT_COUNT_ICON_ASC',
  ColumnsDistinctCountIconDesc = 'COLUMNS_DISTINCT_COUNT_ICON_DESC',
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
  ColumnIndexAsc = 'COLUMN_INDEX_ASC',
  ColumnIndexDesc = 'COLUMN_INDEX_DESC',
  CreatedAtAsc = 'CREATED_AT_ASC',
  CreatedAtDesc = 'CREATED_AT_DESC',
  DescriptionAsc = 'DESCRIPTION_ASC',
  DescriptionDesc = 'DESCRIPTION_DESC',
  IsPublicAsc = 'IS_PUBLIC_ASC',
  IsPublicDesc = 'IS_PUBLIC_DESC',
  LabelsCountAsc = 'LABELS_COUNT_ASC',
  LabelsCountDesc = 'LABELS_COUNT_DESC',
  LabelsDistinctCountColorAsc = 'LABELS_DISTINCT_COUNT_COLOR_ASC',
  LabelsDistinctCountColorDesc = 'LABELS_DISTINCT_COUNT_COLOR_DESC',
  LabelsDistinctCountCreatedAtAsc = 'LABELS_DISTINCT_COUNT_CREATED_AT_ASC',
  LabelsDistinctCountCreatedAtDesc = 'LABELS_DISTINCT_COUNT_CREATED_AT_DESC',
  LabelsDistinctCountIconAsc = 'LABELS_DISTINCT_COUNT_ICON_ASC',
  LabelsDistinctCountIconDesc = 'LABELS_DISTINCT_COUNT_ICON_DESC',
  LabelsDistinctCountNameAsc = 'LABELS_DISTINCT_COUNT_NAME_ASC',
  LabelsDistinctCountNameDesc = 'LABELS_DISTINCT_COUNT_NAME_DESC',
  LabelsDistinctCountOrganizationIdAsc = 'LABELS_DISTINCT_COUNT_ORGANIZATION_ID_ASC',
  LabelsDistinctCountOrganizationIdDesc = 'LABELS_DISTINCT_COUNT_ORGANIZATION_ID_DESC',
  LabelsDistinctCountProjectIdAsc = 'LABELS_DISTINCT_COUNT_PROJECT_ID_ASC',
  LabelsDistinctCountProjectIdDesc = 'LABELS_DISTINCT_COUNT_PROJECT_ID_DESC',
  LabelsDistinctCountRowIdAsc = 'LABELS_DISTINCT_COUNT_ROW_ID_ASC',
  LabelsDistinctCountRowIdDesc = 'LABELS_DISTINCT_COUNT_ROW_ID_DESC',
  LabelsDistinctCountUpdatedAtAsc = 'LABELS_DISTINCT_COUNT_UPDATED_AT_ASC',
  LabelsDistinctCountUpdatedAtDesc = 'LABELS_DISTINCT_COUNT_UPDATED_AT_DESC',
  NameAsc = 'NAME_ASC',
  NameDesc = 'NAME_DESC',
  Natural = 'NATURAL',
  NextTaskNumberAsc = 'NEXT_TASK_NUMBER_ASC',
  NextTaskNumberDesc = 'NEXT_TASK_NUMBER_DESC',
  OrganizationIdAsc = 'ORGANIZATION_ID_ASC',
  OrganizationIdDesc = 'ORGANIZATION_ID_DESC',
  PrefixAsc = 'PREFIX_ASC',
  PrefixDesc = 'PREFIX_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  ProjectColumnIdAsc = 'PROJECT_COLUMN_ID_ASC',
  ProjectColumnIdDesc = 'PROJECT_COLUMN_ID_DESC',
  ProjectProjectLabelsCountAsc = 'PROJECT_PROJECT_LABELS_COUNT_ASC',
  ProjectProjectLabelsCountDesc = 'PROJECT_PROJECT_LABELS_COUNT_DESC',
  ProjectProjectLabelsDistinctCountCreatedAtAsc = 'PROJECT_PROJECT_LABELS_DISTINCT_COUNT_CREATED_AT_ASC',
  ProjectProjectLabelsDistinctCountCreatedAtDesc = 'PROJECT_PROJECT_LABELS_DISTINCT_COUNT_CREATED_AT_DESC',
  ProjectProjectLabelsDistinctCountProjectIdAsc = 'PROJECT_PROJECT_LABELS_DISTINCT_COUNT_PROJECT_ID_ASC',
  ProjectProjectLabelsDistinctCountProjectIdDesc = 'PROJECT_PROJECT_LABELS_DISTINCT_COUNT_PROJECT_ID_DESC',
  ProjectProjectLabelsDistinctCountProjectLabelIdAsc = 'PROJECT_PROJECT_LABELS_DISTINCT_COUNT_PROJECT_LABEL_ID_ASC',
  ProjectProjectLabelsDistinctCountProjectLabelIdDesc = 'PROJECT_PROJECT_LABELS_DISTINCT_COUNT_PROJECT_LABEL_ID_DESC',
  RowIdAsc = 'ROW_ID_ASC',
  RowIdDesc = 'ROW_ID_DESC',
  SlugAsc = 'SLUG_ASC',
  SlugDesc = 'SLUG_DESC',
  TasksAverageColumnIndexAsc = 'TASKS_AVERAGE_COLUMN_INDEX_ASC',
  TasksAverageColumnIndexDesc = 'TASKS_AVERAGE_COLUMN_INDEX_DESC',
  TasksAverageNumberAsc = 'TASKS_AVERAGE_NUMBER_ASC',
  TasksAverageNumberDesc = 'TASKS_AVERAGE_NUMBER_DESC',
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
  TasksDistinctCountNumberAsc = 'TASKS_DISTINCT_COUNT_NUMBER_ASC',
  TasksDistinctCountNumberDesc = 'TASKS_DISTINCT_COUNT_NUMBER_DESC',
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
  TasksMaxNumberAsc = 'TASKS_MAX_NUMBER_ASC',
  TasksMaxNumberDesc = 'TASKS_MAX_NUMBER_DESC',
  TasksMinColumnIndexAsc = 'TASKS_MIN_COLUMN_INDEX_ASC',
  TasksMinColumnIndexDesc = 'TASKS_MIN_COLUMN_INDEX_DESC',
  TasksMinNumberAsc = 'TASKS_MIN_NUMBER_ASC',
  TasksMinNumberDesc = 'TASKS_MIN_NUMBER_DESC',
  TasksStddevPopulationColumnIndexAsc = 'TASKS_STDDEV_POPULATION_COLUMN_INDEX_ASC',
  TasksStddevPopulationColumnIndexDesc = 'TASKS_STDDEV_POPULATION_COLUMN_INDEX_DESC',
  TasksStddevPopulationNumberAsc = 'TASKS_STDDEV_POPULATION_NUMBER_ASC',
  TasksStddevPopulationNumberDesc = 'TASKS_STDDEV_POPULATION_NUMBER_DESC',
  TasksStddevSampleColumnIndexAsc = 'TASKS_STDDEV_SAMPLE_COLUMN_INDEX_ASC',
  TasksStddevSampleColumnIndexDesc = 'TASKS_STDDEV_SAMPLE_COLUMN_INDEX_DESC',
  TasksStddevSampleNumberAsc = 'TASKS_STDDEV_SAMPLE_NUMBER_ASC',
  TasksStddevSampleNumberDesc = 'TASKS_STDDEV_SAMPLE_NUMBER_DESC',
  TasksSumColumnIndexAsc = 'TASKS_SUM_COLUMN_INDEX_ASC',
  TasksSumColumnIndexDesc = 'TASKS_SUM_COLUMN_INDEX_DESC',
  TasksSumNumberAsc = 'TASKS_SUM_NUMBER_ASC',
  TasksSumNumberDesc = 'TASKS_SUM_NUMBER_DESC',
  TasksVariancePopulationColumnIndexAsc = 'TASKS_VARIANCE_POPULATION_COLUMN_INDEX_ASC',
  TasksVariancePopulationColumnIndexDesc = 'TASKS_VARIANCE_POPULATION_COLUMN_INDEX_DESC',
  TasksVariancePopulationNumberAsc = 'TASKS_VARIANCE_POPULATION_NUMBER_ASC',
  TasksVariancePopulationNumberDesc = 'TASKS_VARIANCE_POPULATION_NUMBER_DESC',
  TasksVarianceSampleColumnIndexAsc = 'TASKS_VARIANCE_SAMPLE_COLUMN_INDEX_ASC',
  TasksVarianceSampleColumnIndexDesc = 'TASKS_VARIANCE_SAMPLE_COLUMN_INDEX_DESC',
  TasksVarianceSampleNumberAsc = 'TASKS_VARIANCE_SAMPLE_NUMBER_ASC',
  TasksVarianceSampleNumberDesc = 'TASKS_VARIANCE_SAMPLE_NUMBER_DESC',
  UpdatedAtAsc = 'UPDATED_AT_ASC',
  UpdatedAtDesc = 'UPDATED_AT_DESC',
  UserPreferencesCountAsc = 'USER_PREFERENCES_COUNT_ASC',
  UserPreferencesCountDesc = 'USER_PREFERENCES_COUNT_DESC',
  UserPreferencesDistinctCountColorAsc = 'USER_PREFERENCES_DISTINCT_COUNT_COLOR_ASC',
  UserPreferencesDistinctCountColorDesc = 'USER_PREFERENCES_DISTINCT_COUNT_COLOR_DESC',
  UserPreferencesDistinctCountCreatedAtAsc = 'USER_PREFERENCES_DISTINCT_COUNT_CREATED_AT_ASC',
  UserPreferencesDistinctCountCreatedAtDesc = 'USER_PREFERENCES_DISTINCT_COUNT_CREATED_AT_DESC',
  UserPreferencesDistinctCountHiddenColumnIdsAsc = 'USER_PREFERENCES_DISTINCT_COUNT_HIDDEN_COLUMN_IDS_ASC',
  UserPreferencesDistinctCountHiddenColumnIdsDesc = 'USER_PREFERENCES_DISTINCT_COUNT_HIDDEN_COLUMN_IDS_DESC',
  UserPreferencesDistinctCountProjectIdAsc = 'USER_PREFERENCES_DISTINCT_COUNT_PROJECT_ID_ASC',
  UserPreferencesDistinctCountProjectIdDesc = 'USER_PREFERENCES_DISTINCT_COUNT_PROJECT_ID_DESC',
  UserPreferencesDistinctCountRowIdAsc = 'USER_PREFERENCES_DISTINCT_COUNT_ROW_ID_ASC',
  UserPreferencesDistinctCountRowIdDesc = 'USER_PREFERENCES_DISTINCT_COUNT_ROW_ID_DESC',
  UserPreferencesDistinctCountUpdatedAtAsc = 'USER_PREFERENCES_DISTINCT_COUNT_UPDATED_AT_ASC',
  UserPreferencesDistinctCountUpdatedAtDesc = 'USER_PREFERENCES_DISTINCT_COUNT_UPDATED_AT_DESC',
  UserPreferencesDistinctCountUserIdAsc = 'USER_PREFERENCES_DISTINCT_COUNT_USER_ID_ASC',
  UserPreferencesDistinctCountUserIdDesc = 'USER_PREFERENCES_DISTINCT_COUNT_USER_ID_DESC',
  UserPreferencesDistinctCountViewModeAsc = 'USER_PREFERENCES_DISTINCT_COUNT_VIEW_MODE_ASC',
  UserPreferencesDistinctCountViewModeDesc = 'USER_PREFERENCES_DISTINCT_COUNT_VIEW_MODE_DESC'
}

/** Represents an update to a `Project`. Fields that are set will be updated. */
export type ProjectPatch = {
  columnIndex?: InputMaybe<Scalars['Int']['input']>;
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  isPublic?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  nextTaskNumber?: InputMaybe<Scalars['Int']['input']>;
  organizationId?: InputMaybe<Scalars['String']['input']>;
  prefix?: InputMaybe<Scalars['String']['input']>;
  projectColumnId?: InputMaybe<Scalars['UUID']['input']>;
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
};

export type ProjectProjectLabel = Node & {
  __typename?: 'ProjectProjectLabel';
  createdAt: Scalars['Datetime']['output'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  id: Scalars['ID']['output'];
  /** Reads a single `Project` that is related to this `ProjectProjectLabel`. */
  project?: Maybe<Project>;
  projectId: Scalars['UUID']['output'];
  /** Reads a single `ProjectLabel` that is related to this `ProjectProjectLabel`. */
  projectLabel?: Maybe<ProjectLabel>;
  projectLabelId: Scalars['UUID']['output'];
};

export type ProjectProjectLabelAggregates = {
  __typename?: 'ProjectProjectLabelAggregates';
  /** Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset) */
  distinctCount?: Maybe<ProjectProjectLabelDistinctCountAggregates>;
  keys?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

/** A filter to be used against aggregates of `ProjectProjectLabel` object types. */
export type ProjectProjectLabelAggregatesFilter = {
  /** Distinct count aggregate over matching `ProjectProjectLabel` objects. */
  distinctCount?: InputMaybe<ProjectProjectLabelDistinctCountAggregateFilter>;
  /** A filter that must pass for the relevant `ProjectProjectLabel` object to be included within the aggregate. */
  filter?: InputMaybe<ProjectProjectLabelFilter>;
};

/**
 * A condition to be used against `ProjectProjectLabel` object types. All fields
 * are tested for equality and combined with a logical ‘and.’
 */
export type ProjectProjectLabelCondition = {
  /** Checks for equality with the object’s `createdAt` field. */
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `projectId` field. */
  projectId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `projectLabelId` field. */
  projectLabelId?: InputMaybe<Scalars['UUID']['input']>;
};

/** A connection to a list of `ProjectProjectLabel` values. */
export type ProjectProjectLabelConnection = {
  __typename?: 'ProjectProjectLabelConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<ProjectProjectLabelAggregates>;
  /** A list of edges which contains the `ProjectProjectLabel` and cursor to aid in pagination. */
  edges: Array<ProjectProjectLabelEdge>;
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<Array<ProjectProjectLabelAggregates>>;
  /** A list of `ProjectProjectLabel` objects. */
  nodes: Array<ProjectProjectLabel>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `ProjectProjectLabel` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `ProjectProjectLabel` values. */
export type ProjectProjectLabelConnectionGroupedAggregatesArgs = {
  groupBy: Array<ProjectProjectLabelGroupBy>;
  having?: InputMaybe<ProjectProjectLabelHavingInput>;
};

export type ProjectProjectLabelDistinctCountAggregateFilter = {
  createdAt?: InputMaybe<BigIntFilter>;
  projectId?: InputMaybe<BigIntFilter>;
  projectLabelId?: InputMaybe<BigIntFilter>;
};

export type ProjectProjectLabelDistinctCountAggregates = {
  __typename?: 'ProjectProjectLabelDistinctCountAggregates';
  /** Distinct count of createdAt across the matching connection */
  createdAt?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of projectId across the matching connection */
  projectId?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of projectLabelId across the matching connection */
  projectLabelId?: Maybe<Scalars['BigInt']['output']>;
};

/** A `ProjectProjectLabel` edge in the connection. */
export type ProjectProjectLabelEdge = {
  __typename?: 'ProjectProjectLabelEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `ProjectProjectLabel` at the end of the edge. */
  node: ProjectProjectLabel;
};

/** A filter to be used against `ProjectProjectLabel` object types. All fields are combined with a logical ‘and.’ */
export type ProjectProjectLabelFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<ProjectProjectLabelFilter>>;
  /** Filter by the object’s `createdAt` field. */
  createdAt?: InputMaybe<DatetimeFilter>;
  /** Negates the expression. */
  not?: InputMaybe<ProjectProjectLabelFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<ProjectProjectLabelFilter>>;
  /** Filter by the object’s `project` relation. */
  project?: InputMaybe<ProjectFilter>;
  /** Filter by the object’s `projectId` field. */
  projectId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `projectLabel` relation. */
  projectLabel?: InputMaybe<ProjectLabelFilter>;
  /** Filter by the object’s `projectLabelId` field. */
  projectLabelId?: InputMaybe<UuidFilter>;
};

/** Grouping methods for `ProjectProjectLabel` for usage during aggregation. */
export enum ProjectProjectLabelGroupBy {
  CreatedAt = 'CREATED_AT',
  CreatedAtTruncatedToDay = 'CREATED_AT_TRUNCATED_TO_DAY',
  CreatedAtTruncatedToHour = 'CREATED_AT_TRUNCATED_TO_HOUR',
  ProjectId = 'PROJECT_ID',
  ProjectLabelId = 'PROJECT_LABEL_ID'
}

export type ProjectProjectLabelHavingAverageInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
};

export type ProjectProjectLabelHavingDistinctCountInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
};

/** Conditions for `ProjectProjectLabel` aggregates. */
export type ProjectProjectLabelHavingInput = {
  AND?: InputMaybe<Array<ProjectProjectLabelHavingInput>>;
  OR?: InputMaybe<Array<ProjectProjectLabelHavingInput>>;
  average?: InputMaybe<ProjectProjectLabelHavingAverageInput>;
  distinctCount?: InputMaybe<ProjectProjectLabelHavingDistinctCountInput>;
  max?: InputMaybe<ProjectProjectLabelHavingMaxInput>;
  min?: InputMaybe<ProjectProjectLabelHavingMinInput>;
  stddevPopulation?: InputMaybe<ProjectProjectLabelHavingStddevPopulationInput>;
  stddevSample?: InputMaybe<ProjectProjectLabelHavingStddevSampleInput>;
  sum?: InputMaybe<ProjectProjectLabelHavingSumInput>;
  variancePopulation?: InputMaybe<ProjectProjectLabelHavingVariancePopulationInput>;
  varianceSample?: InputMaybe<ProjectProjectLabelHavingVarianceSampleInput>;
};

export type ProjectProjectLabelHavingMaxInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
};

export type ProjectProjectLabelHavingMinInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
};

export type ProjectProjectLabelHavingStddevPopulationInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
};

export type ProjectProjectLabelHavingStddevSampleInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
};

export type ProjectProjectLabelHavingSumInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
};

export type ProjectProjectLabelHavingVariancePopulationInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
};

export type ProjectProjectLabelHavingVarianceSampleInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
};

/** An input for mutations affecting `ProjectProjectLabel` */
export type ProjectProjectLabelInput = {
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  projectId: Scalars['UUID']['input'];
  projectLabelId: Scalars['UUID']['input'];
};

/** Methods to use when ordering `ProjectProjectLabel`. */
export enum ProjectProjectLabelOrderBy {
  CreatedAtAsc = 'CREATED_AT_ASC',
  CreatedAtDesc = 'CREATED_AT_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  ProjectIdAsc = 'PROJECT_ID_ASC',
  ProjectIdDesc = 'PROJECT_ID_DESC',
  ProjectLabelIdAsc = 'PROJECT_LABEL_ID_ASC',
  ProjectLabelIdDesc = 'PROJECT_LABEL_ID_DESC'
}

/** Represents an update to a `ProjectProjectLabel`. Fields that are set will be updated. */
export type ProjectProjectLabelPatch = {
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  projectId?: InputMaybe<Scalars['UUID']['input']>;
  projectLabelId?: InputMaybe<Scalars['UUID']['input']>;
};

export type ProjectStddevPopulationAggregateFilter = {
  columnIndex?: InputMaybe<BigFloatFilter>;
  nextTaskNumber?: InputMaybe<BigFloatFilter>;
};

export type ProjectStddevPopulationAggregates = {
  __typename?: 'ProjectStddevPopulationAggregates';
  /** Population standard deviation of columnIndex across the matching connection */
  columnIndex?: Maybe<Scalars['BigFloat']['output']>;
  /** Population standard deviation of nextTaskNumber across the matching connection */
  nextTaskNumber?: Maybe<Scalars['BigFloat']['output']>;
};

export type ProjectStddevSampleAggregateFilter = {
  columnIndex?: InputMaybe<BigFloatFilter>;
  nextTaskNumber?: InputMaybe<BigFloatFilter>;
};

export type ProjectStddevSampleAggregates = {
  __typename?: 'ProjectStddevSampleAggregates';
  /** Sample standard deviation of columnIndex across the matching connection */
  columnIndex?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample standard deviation of nextTaskNumber across the matching connection */
  nextTaskNumber?: Maybe<Scalars['BigFloat']['output']>;
};

export type ProjectSumAggregateFilter = {
  columnIndex?: InputMaybe<BigIntFilter>;
  nextTaskNumber?: InputMaybe<BigIntFilter>;
};

export type ProjectSumAggregates = {
  __typename?: 'ProjectSumAggregates';
  /** Sum of columnIndex across the matching connection */
  columnIndex: Scalars['BigInt']['output'];
  /** Sum of nextTaskNumber across the matching connection */
  nextTaskNumber: Scalars['BigInt']['output'];
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

/** A filter to be used against many `ProjectProjectLabel` object types. All fields are combined with a logical ‘and.’ */
export type ProjectToManyProjectProjectLabelFilter = {
  /** Aggregates across related `ProjectProjectLabel` match the filter criteria. */
  aggregates?: InputMaybe<ProjectProjectLabelAggregatesFilter>;
  /** Every related `ProjectProjectLabel` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<ProjectProjectLabelFilter>;
  /** No related `ProjectProjectLabel` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<ProjectProjectLabelFilter>;
  /** Some related `ProjectProjectLabel` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<ProjectProjectLabelFilter>;
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

/** A filter to be used against many `UserPreference` object types. All fields are combined with a logical ‘and.’ */
export type ProjectToManyUserPreferenceFilter = {
  /** Aggregates across related `UserPreference` match the filter criteria. */
  aggregates?: InputMaybe<UserPreferenceAggregatesFilter>;
  /** Every related `UserPreference` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<UserPreferenceFilter>;
  /** No related `UserPreference` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<UserPreferenceFilter>;
  /** Some related `UserPreference` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<UserPreferenceFilter>;
};

export type ProjectVariancePopulationAggregateFilter = {
  columnIndex?: InputMaybe<BigFloatFilter>;
  nextTaskNumber?: InputMaybe<BigFloatFilter>;
};

export type ProjectVariancePopulationAggregates = {
  __typename?: 'ProjectVariancePopulationAggregates';
  /** Population variance of columnIndex across the matching connection */
  columnIndex?: Maybe<Scalars['BigFloat']['output']>;
  /** Population variance of nextTaskNumber across the matching connection */
  nextTaskNumber?: Maybe<Scalars['BigFloat']['output']>;
};

export type ProjectVarianceSampleAggregateFilter = {
  columnIndex?: InputMaybe<BigFloatFilter>;
  nextTaskNumber?: InputMaybe<BigFloatFilter>;
};

export type ProjectVarianceSampleAggregates = {
  __typename?: 'ProjectVarianceSampleAggregates';
  /** Sample variance of columnIndex across the matching connection */
  columnIndex?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample variance of nextTaskNumber across the matching connection */
  nextTaskNumber?: Maybe<Scalars['BigFloat']['output']>;
};

/** The root query type which gives access points into the data universe. */
export type Query = Node & {
  __typename?: 'Query';
  /** Get a single `Assignee`. */
  assignee?: Maybe<Assignee>;
  /** Reads a single `Assignee` using its globally unique `ID`. */
  assigneeById?: Maybe<Assignee>;
  /** Get a single `Assignee`. */
  assigneeByTaskIdAndUserId?: Maybe<Assignee>;
  /** Reads and enables pagination through a set of `Assignee`. */
  assignees?: Maybe<AssigneeConnection>;
  /** Get a single `Column`. */
  column?: Maybe<Column>;
  /** Reads a single `Column` using its globally unique `ID`. */
  columnById?: Maybe<Column>;
  /** Reads and enables pagination through a set of `Column`. */
  columns?: Maybe<ColumnConnection>;
  /** Get a single `Emoji`. */
  emoji?: Maybe<Emoji>;
  /** Reads a single `Emoji` using its globally unique `ID`. */
  emojiById?: Maybe<Emoji>;
  /** Reads and enables pagination through a set of `Emoji`. */
  emojis?: Maybe<EmojiConnection>;
  /** The root query type must be a `Node` to work well with Relay 1 mutations. This just resolves to `query`. */
  id: Scalars['ID']['output'];
  /** Get a single `Invitation`. */
  invitation?: Maybe<Invitation>;
  /** Reads a single `Invitation` using its globally unique `ID`. */
  invitationById?: Maybe<Invitation>;
  /** Get a single `Invitation`. */
  invitationByToken?: Maybe<Invitation>;
  /** Reads and enables pagination through a set of `Invitation`. */
  invitations?: Maybe<InvitationConnection>;
  /** Get a single `Label`. */
  label?: Maybe<Label>;
  /** Reads a single `Label` using its globally unique `ID`. */
  labelById?: Maybe<Label>;
  /** Reads and enables pagination through a set of `Label`. */
  labels?: Maybe<LabelConnection>;
  /** Fetches an object given its globally unique `ID`. */
  node?: Maybe<Node>;
  /**
   * Returns the currently authenticated user (observer).
   * Returns null if not authenticated.
   */
  observer?: Maybe<Observer>;
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
  /** Get a single `Project`. */
  projectBySlugAndOrganizationId?: Maybe<Project>;
  /** Get a single `ProjectColumn`. */
  projectColumn?: Maybe<ProjectColumn>;
  /** Reads a single `ProjectColumn` using its globally unique `ID`. */
  projectColumnById?: Maybe<ProjectColumn>;
  /** Reads and enables pagination through a set of `ProjectColumn`. */
  projectColumns?: Maybe<ProjectColumnConnection>;
  /** Get a single `ProjectLabel`. */
  projectLabel?: Maybe<ProjectLabel>;
  /** Reads a single `ProjectLabel` using its globally unique `ID`. */
  projectLabelById?: Maybe<ProjectLabel>;
  /** Reads and enables pagination through a set of `ProjectLabel`. */
  projectLabels?: Maybe<ProjectLabelConnection>;
  /** Get a single `ProjectProjectLabel`. */
  projectProjectLabel?: Maybe<ProjectProjectLabel>;
  /** Reads a single `ProjectProjectLabel` using its globally unique `ID`. */
  projectProjectLabelById?: Maybe<ProjectProjectLabel>;
  /** Reads and enables pagination through a set of `ProjectProjectLabel`. */
  projectProjectLabels?: Maybe<ProjectProjectLabelConnection>;
  /** Reads and enables pagination through a set of `Project`. */
  projects?: Maybe<ProjectConnection>;
  /**
   * Exposes the root query type nested one level down. This is helpful for Relay 1
   * which can only query top level fields if they are in a particular form.
   */
  query: Query;
  /** Get a single `Setting`. */
  setting?: Maybe<Setting>;
  /** Reads a single `Setting` using its globally unique `ID`. */
  settingById?: Maybe<Setting>;
  /** Get a single `Setting`. */
  settingByOrganizationId?: Maybe<Setting>;
  /** Reads and enables pagination through a set of `Setting`. */
  settings?: Maybe<SettingConnection>;
  /** Get a single `Task`. */
  task?: Maybe<Task>;
  /** Reads a single `Task` using its globally unique `ID`. */
  taskById?: Maybe<Task>;
  /** Get a single `Task`. */
  taskByProjectIdAndNumber?: Maybe<Task>;
  /** Get a single `TaskLabel`. */
  taskLabel?: Maybe<TaskLabel>;
  /** Reads a single `TaskLabel` using its globally unique `ID`. */
  taskLabelById?: Maybe<TaskLabel>;
  /** Get a single `TaskLabel`. */
  taskLabelByTaskIdAndLabelId?: Maybe<TaskLabel>;
  /** Reads and enables pagination through a set of `TaskLabel`. */
  taskLabels?: Maybe<TaskLabelConnection>;
  /** Reads and enables pagination through a set of `Task`. */
  tasks?: Maybe<TaskConnection>;
  /** Get a single `User`. */
  user?: Maybe<User>;
  /** Get a single `User`. */
  userByEmail?: Maybe<User>;
  /** Reads a single `User` using its globally unique `ID`. */
  userById?: Maybe<User>;
  /** Get a single `User`. */
  userByIdentityProviderId?: Maybe<User>;
  /** Get a single `UserOrganization`. */
  userOrganization?: Maybe<UserOrganization>;
  /** Reads a single `UserOrganization` using its globally unique `ID`. */
  userOrganizationById?: Maybe<UserOrganization>;
  /** Get a single `UserOrganization`. */
  userOrganizationByUserIdAndOrganizationId?: Maybe<UserOrganization>;
  /** Reads and enables pagination through a set of `UserOrganization`. */
  userOrganizations?: Maybe<UserOrganizationConnection>;
  /** Get a single `UserPreference`. */
  userPreference?: Maybe<UserPreference>;
  /** Reads a single `UserPreference` using its globally unique `ID`. */
  userPreferenceById?: Maybe<UserPreference>;
  /** Get a single `UserPreference`. */
  userPreferenceByUserIdAndProjectId?: Maybe<UserPreference>;
  /** Reads and enables pagination through a set of `UserPreference`. */
  userPreferences?: Maybe<UserPreferenceConnection>;
  /** Reads and enables pagination through a set of `User`. */
  users?: Maybe<UserConnection>;
};


/** The root query type which gives access points into the data universe. */
export type QueryAssigneeArgs = {
  taskId: Scalars['UUID']['input'];
  userId: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryAssigneeByIdArgs = {
  id: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryAssigneeByTaskIdAndUserIdArgs = {
  taskId: Scalars['UUID']['input'];
  userId: Scalars['UUID']['input'];
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
export type QueryEmojiArgs = {
  rowId: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryEmojiByIdArgs = {
  id: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryEmojisArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<EmojiCondition>;
  filter?: InputMaybe<EmojiFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<EmojiOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryInvitationArgs = {
  rowId: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryInvitationByIdArgs = {
  id: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryInvitationByTokenArgs = {
  token: Scalars['String']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryInvitationsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<InvitationCondition>;
  filter?: InputMaybe<InvitationFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<InvitationOrderBy>>;
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
export type QueryProjectBySlugAndOrganizationIdArgs = {
  organizationId: Scalars['String']['input'];
  slug: Scalars['String']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryProjectColumnArgs = {
  rowId: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryProjectColumnByIdArgs = {
  id: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryProjectColumnsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<ProjectColumnCondition>;
  filter?: InputMaybe<ProjectColumnFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ProjectColumnOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryProjectLabelArgs = {
  rowId: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryProjectLabelByIdArgs = {
  id: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryProjectLabelsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<ProjectLabelCondition>;
  filter?: InputMaybe<ProjectLabelFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ProjectLabelOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryProjectProjectLabelArgs = {
  projectId: Scalars['UUID']['input'];
  projectLabelId: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryProjectProjectLabelByIdArgs = {
  id: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryProjectProjectLabelsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<ProjectProjectLabelCondition>;
  filter?: InputMaybe<ProjectProjectLabelFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ProjectProjectLabelOrderBy>>;
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
export type QuerySettingArgs = {
  rowId: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QuerySettingByIdArgs = {
  id: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QuerySettingByOrganizationIdArgs = {
  organizationId: Scalars['String']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QuerySettingsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<SettingCondition>;
  filter?: InputMaybe<SettingFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<SettingOrderBy>>;
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
export type QueryTaskByProjectIdAndNumberArgs = {
  number: Scalars['Int']['input'];
  projectId: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryTaskLabelArgs = {
  labelId: Scalars['UUID']['input'];
  taskId: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryTaskLabelByIdArgs = {
  id: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryTaskLabelByTaskIdAndLabelIdArgs = {
  labelId: Scalars['UUID']['input'];
  taskId: Scalars['UUID']['input'];
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
export type QueryUserByEmailArgs = {
  email: Scalars['String']['input'];
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
export type QueryUserOrganizationArgs = {
  rowId: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryUserOrganizationByIdArgs = {
  id: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryUserOrganizationByUserIdAndOrganizationIdArgs = {
  organizationId: Scalars['String']['input'];
  userId: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryUserOrganizationsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<UserOrganizationCondition>;
  filter?: InputMaybe<UserOrganizationFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<UserOrganizationOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryUserPreferenceArgs = {
  rowId: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryUserPreferenceByIdArgs = {
  id: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryUserPreferenceByUserIdAndProjectIdArgs = {
  projectId: Scalars['UUID']['input'];
  userId: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryUserPreferencesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<UserPreferenceCondition>;
  filter?: InputMaybe<UserPreferenceFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<UserPreferenceOrderBy>>;
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

export type Setting = Node & {
  __typename?: 'Setting';
  billingAccountId?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Datetime']['output'];
  deletedAt?: Maybe<Scalars['Datetime']['output']>;
  deletionReason?: Maybe<Scalars['String']['output']>;
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  id: Scalars['ID']['output'];
  organizationId: Scalars['String']['output'];
  rowId: Scalars['UUID']['output'];
  subscriptionId?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['Datetime']['output'];
  viewMode: Scalars['String']['output'];
};

export type SettingAggregates = {
  __typename?: 'SettingAggregates';
  /** Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset) */
  distinctCount?: Maybe<SettingDistinctCountAggregates>;
  keys?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

/** A condition to be used against `Setting` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type SettingCondition = {
  /** Checks for equality with the object’s `billingAccountId` field. */
  billingAccountId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `createdAt` field. */
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `deletedAt` field. */
  deletedAt?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `deletionReason` field. */
  deletionReason?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `organizationId` field. */
  organizationId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `rowId` field. */
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `subscriptionId` field. */
  subscriptionId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `updatedAt` field. */
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `viewMode` field. */
  viewMode?: InputMaybe<Scalars['String']['input']>;
};

/** A connection to a list of `Setting` values. */
export type SettingConnection = {
  __typename?: 'SettingConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<SettingAggregates>;
  /** A list of edges which contains the `Setting` and cursor to aid in pagination. */
  edges: Array<SettingEdge>;
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<Array<SettingAggregates>>;
  /** A list of `Setting` objects. */
  nodes: Array<Setting>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Setting` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `Setting` values. */
export type SettingConnectionGroupedAggregatesArgs = {
  groupBy: Array<SettingGroupBy>;
  having?: InputMaybe<SettingHavingInput>;
};

export type SettingDistinctCountAggregates = {
  __typename?: 'SettingDistinctCountAggregates';
  /** Distinct count of billingAccountId across the matching connection */
  billingAccountId?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of createdAt across the matching connection */
  createdAt?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of deletedAt across the matching connection */
  deletedAt?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of deletionReason across the matching connection */
  deletionReason?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of organizationId across the matching connection */
  organizationId?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of rowId across the matching connection */
  rowId?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of subscriptionId across the matching connection */
  subscriptionId?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of updatedAt across the matching connection */
  updatedAt?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of viewMode across the matching connection */
  viewMode?: Maybe<Scalars['BigInt']['output']>;
};

/** A `Setting` edge in the connection. */
export type SettingEdge = {
  __typename?: 'SettingEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Setting` at the end of the edge. */
  node: Setting;
};

/** A filter to be used against `Setting` object types. All fields are combined with a logical ‘and.’ */
export type SettingFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<SettingFilter>>;
  /** Filter by the object’s `billingAccountId` field. */
  billingAccountId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `createdAt` field. */
  createdAt?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `deletedAt` field. */
  deletedAt?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `deletionReason` field. */
  deletionReason?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<SettingFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<SettingFilter>>;
  /** Filter by the object’s `organizationId` field. */
  organizationId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `rowId` field. */
  rowId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `subscriptionId` field. */
  subscriptionId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `updatedAt` field. */
  updatedAt?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `viewMode` field. */
  viewMode?: InputMaybe<StringFilter>;
};

/** Grouping methods for `Setting` for usage during aggregation. */
export enum SettingGroupBy {
  BillingAccountId = 'BILLING_ACCOUNT_ID',
  CreatedAt = 'CREATED_AT',
  CreatedAtTruncatedToDay = 'CREATED_AT_TRUNCATED_TO_DAY',
  CreatedAtTruncatedToHour = 'CREATED_AT_TRUNCATED_TO_HOUR',
  DeletedAt = 'DELETED_AT',
  DeletedAtTruncatedToDay = 'DELETED_AT_TRUNCATED_TO_DAY',
  DeletedAtTruncatedToHour = 'DELETED_AT_TRUNCATED_TO_HOUR',
  DeletionReason = 'DELETION_REASON',
  SubscriptionId = 'SUBSCRIPTION_ID',
  UpdatedAt = 'UPDATED_AT',
  UpdatedAtTruncatedToDay = 'UPDATED_AT_TRUNCATED_TO_DAY',
  UpdatedAtTruncatedToHour = 'UPDATED_AT_TRUNCATED_TO_HOUR',
  ViewMode = 'VIEW_MODE'
}

export type SettingHavingAverageInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  deletedAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type SettingHavingDistinctCountInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  deletedAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

/** Conditions for `Setting` aggregates. */
export type SettingHavingInput = {
  AND?: InputMaybe<Array<SettingHavingInput>>;
  OR?: InputMaybe<Array<SettingHavingInput>>;
  average?: InputMaybe<SettingHavingAverageInput>;
  distinctCount?: InputMaybe<SettingHavingDistinctCountInput>;
  max?: InputMaybe<SettingHavingMaxInput>;
  min?: InputMaybe<SettingHavingMinInput>;
  stddevPopulation?: InputMaybe<SettingHavingStddevPopulationInput>;
  stddevSample?: InputMaybe<SettingHavingStddevSampleInput>;
  sum?: InputMaybe<SettingHavingSumInput>;
  variancePopulation?: InputMaybe<SettingHavingVariancePopulationInput>;
  varianceSample?: InputMaybe<SettingHavingVarianceSampleInput>;
};

export type SettingHavingMaxInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  deletedAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type SettingHavingMinInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  deletedAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type SettingHavingStddevPopulationInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  deletedAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type SettingHavingStddevSampleInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  deletedAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type SettingHavingSumInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  deletedAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type SettingHavingVariancePopulationInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  deletedAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type SettingHavingVarianceSampleInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  deletedAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

/** An input for mutations affecting `Setting` */
export type SettingInput = {
  billingAccountId?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  deletedAt?: InputMaybe<Scalars['Datetime']['input']>;
  deletionReason?: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['String']['input'];
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  subscriptionId?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
  viewMode?: InputMaybe<Scalars['String']['input']>;
};

/** Methods to use when ordering `Setting`. */
export enum SettingOrderBy {
  BillingAccountIdAsc = 'BILLING_ACCOUNT_ID_ASC',
  BillingAccountIdDesc = 'BILLING_ACCOUNT_ID_DESC',
  CreatedAtAsc = 'CREATED_AT_ASC',
  CreatedAtDesc = 'CREATED_AT_DESC',
  DeletedAtAsc = 'DELETED_AT_ASC',
  DeletedAtDesc = 'DELETED_AT_DESC',
  DeletionReasonAsc = 'DELETION_REASON_ASC',
  DeletionReasonDesc = 'DELETION_REASON_DESC',
  Natural = 'NATURAL',
  OrganizationIdAsc = 'ORGANIZATION_ID_ASC',
  OrganizationIdDesc = 'ORGANIZATION_ID_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  RowIdAsc = 'ROW_ID_ASC',
  RowIdDesc = 'ROW_ID_DESC',
  SubscriptionIdAsc = 'SUBSCRIPTION_ID_ASC',
  SubscriptionIdDesc = 'SUBSCRIPTION_ID_DESC',
  UpdatedAtAsc = 'UPDATED_AT_ASC',
  UpdatedAtDesc = 'UPDATED_AT_DESC',
  ViewModeAsc = 'VIEW_MODE_ASC',
  ViewModeDesc = 'VIEW_MODE_DESC'
}

/** Represents an update to a `Setting`. Fields that are set will be updated. */
export type SettingPatch = {
  billingAccountId?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  deletedAt?: InputMaybe<Scalars['Datetime']['input']>;
  deletionReason?: InputMaybe<Scalars['String']['input']>;
  organizationId?: InputMaybe<Scalars['String']['input']>;
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  subscriptionId?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
  viewMode?: InputMaybe<Scalars['String']['input']>;
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

/** A filter to be used against String List fields. All fields are combined with a logical ‘and.’ */
export type StringListFilter = {
  /** Any array item is equal to the specified value. */
  anyEqualTo?: InputMaybe<Scalars['String']['input']>;
  /** Any array item is greater than the specified value. */
  anyGreaterThan?: InputMaybe<Scalars['String']['input']>;
  /** Any array item is greater than or equal to the specified value. */
  anyGreaterThanOrEqualTo?: InputMaybe<Scalars['String']['input']>;
  /** Any array item is less than the specified value. */
  anyLessThan?: InputMaybe<Scalars['String']['input']>;
  /** Any array item is less than or equal to the specified value. */
  anyLessThanOrEqualTo?: InputMaybe<Scalars['String']['input']>;
  /** Any array item is not equal to the specified value. */
  anyNotEqualTo?: InputMaybe<Scalars['String']['input']>;
  /** Contained by the specified list of values. */
  containedBy?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** Contains the specified list of values. */
  contains?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** Overlaps the specified list of values. */
  overlaps?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type Task = Node & {
  __typename?: 'Task';
  /** Reads and enables pagination through a set of `Assignee`. */
  assignees: AssigneeConnection;
  /** Reads a single `User` that is related to this `Task`. */
  author?: Maybe<User>;
  authorId?: Maybe<Scalars['UUID']['output']>;
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
  number?: Maybe<Scalars['Int']['output']>;
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
  number?: InputMaybe<BigFloatFilter>;
};

export type TaskAverageAggregates = {
  __typename?: 'TaskAverageAggregates';
  /** Mean average of columnIndex across the matching connection */
  columnIndex?: Maybe<Scalars['BigFloat']['output']>;
  /** Mean average of number across the matching connection */
  number?: Maybe<Scalars['BigFloat']['output']>;
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
  /** Checks for equality with the object’s `number` field. */
  number?: InputMaybe<Scalars['Int']['input']>;
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
  number?: InputMaybe<BigIntFilter>;
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
  /** Distinct count of number across the matching connection */
  number?: Maybe<Scalars['BigInt']['output']>;
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
  /** A related `author` exists. */
  authorExists?: InputMaybe<Scalars['Boolean']['input']>;
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
  /** Filter by the object’s `number` field. */
  number?: InputMaybe<IntFilter>;
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
  Number = 'NUMBER',
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
  number?: InputMaybe<HavingIntFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type TaskHavingDistinctCountInput = {
  columnIndex?: InputMaybe<HavingIntFilter>;
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  dueDate?: InputMaybe<HavingDatetimeFilter>;
  number?: InputMaybe<HavingIntFilter>;
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
  number?: InputMaybe<HavingIntFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type TaskHavingMinInput = {
  columnIndex?: InputMaybe<HavingIntFilter>;
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  dueDate?: InputMaybe<HavingDatetimeFilter>;
  number?: InputMaybe<HavingIntFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type TaskHavingStddevPopulationInput = {
  columnIndex?: InputMaybe<HavingIntFilter>;
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  dueDate?: InputMaybe<HavingDatetimeFilter>;
  number?: InputMaybe<HavingIntFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type TaskHavingStddevSampleInput = {
  columnIndex?: InputMaybe<HavingIntFilter>;
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  dueDate?: InputMaybe<HavingDatetimeFilter>;
  number?: InputMaybe<HavingIntFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type TaskHavingSumInput = {
  columnIndex?: InputMaybe<HavingIntFilter>;
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  dueDate?: InputMaybe<HavingDatetimeFilter>;
  number?: InputMaybe<HavingIntFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type TaskHavingVariancePopulationInput = {
  columnIndex?: InputMaybe<HavingIntFilter>;
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  dueDate?: InputMaybe<HavingDatetimeFilter>;
  number?: InputMaybe<HavingIntFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type TaskHavingVarianceSampleInput = {
  columnIndex?: InputMaybe<HavingIntFilter>;
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  dueDate?: InputMaybe<HavingDatetimeFilter>;
  number?: InputMaybe<HavingIntFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

/** An input for mutations affecting `Task` */
export type TaskInput = {
  authorId?: InputMaybe<Scalars['UUID']['input']>;
  columnId: Scalars['UUID']['input'];
  columnIndex?: InputMaybe<Scalars['Int']['input']>;
  content: Scalars['String']['input'];
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  description: Scalars['String']['input'];
  dueDate?: InputMaybe<Scalars['Datetime']['input']>;
  number?: InputMaybe<Scalars['Int']['input']>;
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
  taskId?: InputMaybe<BigIntFilter>;
  updatedAt?: InputMaybe<BigIntFilter>;
};

export type TaskLabelDistinctCountAggregates = {
  __typename?: 'TaskLabelDistinctCountAggregates';
  /** Distinct count of createdAt across the matching connection */
  createdAt?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of labelId across the matching connection */
  labelId?: Maybe<Scalars['BigInt']['output']>;
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
  TaskIdAsc = 'TASK_ID_ASC',
  TaskIdDesc = 'TASK_ID_DESC',
  UpdatedAtAsc = 'UPDATED_AT_ASC',
  UpdatedAtDesc = 'UPDATED_AT_DESC'
}

/** Represents an update to a `TaskLabel`. Fields that are set will be updated. */
export type TaskLabelPatch = {
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  labelId?: InputMaybe<Scalars['UUID']['input']>;
  taskId?: InputMaybe<Scalars['UUID']['input']>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
};

export type TaskMaxAggregateFilter = {
  columnIndex?: InputMaybe<IntFilter>;
  number?: InputMaybe<IntFilter>;
};

export type TaskMaxAggregates = {
  __typename?: 'TaskMaxAggregates';
  /** Maximum of columnIndex across the matching connection */
  columnIndex?: Maybe<Scalars['Int']['output']>;
  /** Maximum of number across the matching connection */
  number?: Maybe<Scalars['Int']['output']>;
};

export type TaskMinAggregateFilter = {
  columnIndex?: InputMaybe<IntFilter>;
  number?: InputMaybe<IntFilter>;
};

export type TaskMinAggregates = {
  __typename?: 'TaskMinAggregates';
  /** Minimum of columnIndex across the matching connection */
  columnIndex?: Maybe<Scalars['Int']['output']>;
  /** Minimum of number across the matching connection */
  number?: Maybe<Scalars['Int']['output']>;
};

/** Methods to use when ordering `Task`. */
export enum TaskOrderBy {
  AssigneesCountAsc = 'ASSIGNEES_COUNT_ASC',
  AssigneesCountDesc = 'ASSIGNEES_COUNT_DESC',
  AssigneesDistinctCountCreatedAtAsc = 'ASSIGNEES_DISTINCT_COUNT_CREATED_AT_ASC',
  AssigneesDistinctCountCreatedAtDesc = 'ASSIGNEES_DISTINCT_COUNT_CREATED_AT_DESC',
  AssigneesDistinctCountDeletedAtAsc = 'ASSIGNEES_DISTINCT_COUNT_DELETED_AT_ASC',
  AssigneesDistinctCountDeletedAtDesc = 'ASSIGNEES_DISTINCT_COUNT_DELETED_AT_DESC',
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
  NumberAsc = 'NUMBER_ASC',
  NumberDesc = 'NUMBER_DESC',
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
  number?: InputMaybe<Scalars['Int']['input']>;
  priority?: InputMaybe<Scalars['String']['input']>;
  projectId?: InputMaybe<Scalars['UUID']['input']>;
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
};

export type TaskStddevPopulationAggregateFilter = {
  columnIndex?: InputMaybe<BigFloatFilter>;
  number?: InputMaybe<BigFloatFilter>;
};

export type TaskStddevPopulationAggregates = {
  __typename?: 'TaskStddevPopulationAggregates';
  /** Population standard deviation of columnIndex across the matching connection */
  columnIndex?: Maybe<Scalars['BigFloat']['output']>;
  /** Population standard deviation of number across the matching connection */
  number?: Maybe<Scalars['BigFloat']['output']>;
};

export type TaskStddevSampleAggregateFilter = {
  columnIndex?: InputMaybe<BigFloatFilter>;
  number?: InputMaybe<BigFloatFilter>;
};

export type TaskStddevSampleAggregates = {
  __typename?: 'TaskStddevSampleAggregates';
  /** Sample standard deviation of columnIndex across the matching connection */
  columnIndex?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample standard deviation of number across the matching connection */
  number?: Maybe<Scalars['BigFloat']['output']>;
};

export type TaskSumAggregateFilter = {
  columnIndex?: InputMaybe<BigIntFilter>;
  number?: InputMaybe<BigIntFilter>;
};

export type TaskSumAggregates = {
  __typename?: 'TaskSumAggregates';
  /** Sum of columnIndex across the matching connection */
  columnIndex: Scalars['BigInt']['output'];
  /** Sum of number across the matching connection */
  number: Scalars['BigInt']['output'];
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
  number?: InputMaybe<BigFloatFilter>;
};

export type TaskVariancePopulationAggregates = {
  __typename?: 'TaskVariancePopulationAggregates';
  /** Population variance of columnIndex across the matching connection */
  columnIndex?: Maybe<Scalars['BigFloat']['output']>;
  /** Population variance of number across the matching connection */
  number?: Maybe<Scalars['BigFloat']['output']>;
};

export type TaskVarianceSampleAggregateFilter = {
  columnIndex?: InputMaybe<BigFloatFilter>;
  number?: InputMaybe<BigFloatFilter>;
};

export type TaskVarianceSampleAggregates = {
  __typename?: 'TaskVarianceSampleAggregates';
  /** Sample variance of columnIndex across the matching connection */
  columnIndex?: Maybe<Scalars['BigFloat']['output']>;
  /** Sample variance of number across the matching connection */
  number?: Maybe<Scalars['BigFloat']['output']>;
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
  taskId: Scalars['UUID']['input'];
  userId: Scalars['UUID']['input'];
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

/** All input for the `updateEmojiById` mutation. */
export type UpdateEmojiByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `Emoji` to be updated. */
  id: Scalars['ID']['input'];
  /** An object where the defined keys will be set on the `Emoji` being updated. */
  patch: EmojiPatch;
};

/** All input for the `updateEmoji` mutation. */
export type UpdateEmojiInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** An object where the defined keys will be set on the `Emoji` being updated. */
  patch: EmojiPatch;
  rowId: Scalars['UUID']['input'];
};

/** The output of our update `Emoji` mutation. */
export type UpdateEmojiPayload = {
  __typename?: 'UpdateEmojiPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `Emoji` that was updated by this mutation. */
  emoji?: Maybe<Emoji>;
  /** An edge for our `Emoji`. May be used by Relay 1. */
  emojiEdge?: Maybe<EmojiEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our update `Emoji` mutation. */
export type UpdateEmojiPayloadEmojiEdgeArgs = {
  orderBy?: Array<EmojiOrderBy>;
};

/** All input for the `updateInvitationById` mutation. */
export type UpdateInvitationByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `Invitation` to be updated. */
  id: Scalars['ID']['input'];
  /** An object where the defined keys will be set on the `Invitation` being updated. */
  patch: InvitationPatch;
};

/** All input for the `updateInvitation` mutation. */
export type UpdateInvitationInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** An object where the defined keys will be set on the `Invitation` being updated. */
  patch: InvitationPatch;
  rowId: Scalars['UUID']['input'];
};

/** The output of our update `Invitation` mutation. */
export type UpdateInvitationPayload = {
  __typename?: 'UpdateInvitationPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `Invitation` that was updated by this mutation. */
  invitation?: Maybe<Invitation>;
  /** An edge for our `Invitation`. May be used by Relay 1. */
  invitationEdge?: Maybe<InvitationEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our update `Invitation` mutation. */
export type UpdateInvitationPayloadInvitationEdgeArgs = {
  orderBy?: Array<InvitationOrderBy>;
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

/** All input for the `updateProjectColumnById` mutation. */
export type UpdateProjectColumnByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `ProjectColumn` to be updated. */
  id: Scalars['ID']['input'];
  /** An object where the defined keys will be set on the `ProjectColumn` being updated. */
  patch: ProjectColumnPatch;
};

/** All input for the `updateProjectColumn` mutation. */
export type UpdateProjectColumnInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** An object where the defined keys will be set on the `ProjectColumn` being updated. */
  patch: ProjectColumnPatch;
  rowId: Scalars['UUID']['input'];
};

/** The output of our update `ProjectColumn` mutation. */
export type UpdateProjectColumnPayload = {
  __typename?: 'UpdateProjectColumnPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `ProjectColumn` that was updated by this mutation. */
  projectColumn?: Maybe<ProjectColumn>;
  /** An edge for our `ProjectColumn`. May be used by Relay 1. */
  projectColumnEdge?: Maybe<ProjectColumnEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our update `ProjectColumn` mutation. */
export type UpdateProjectColumnPayloadProjectColumnEdgeArgs = {
  orderBy?: Array<ProjectColumnOrderBy>;
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

/** All input for the `updateProjectLabelById` mutation. */
export type UpdateProjectLabelByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `ProjectLabel` to be updated. */
  id: Scalars['ID']['input'];
  /** An object where the defined keys will be set on the `ProjectLabel` being updated. */
  patch: ProjectLabelPatch;
};

/** All input for the `updateProjectLabel` mutation. */
export type UpdateProjectLabelInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** An object where the defined keys will be set on the `ProjectLabel` being updated. */
  patch: ProjectLabelPatch;
  rowId: Scalars['UUID']['input'];
};

/** The output of our update `ProjectLabel` mutation. */
export type UpdateProjectLabelPayload = {
  __typename?: 'UpdateProjectLabelPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `ProjectLabel` that was updated by this mutation. */
  projectLabel?: Maybe<ProjectLabel>;
  /** An edge for our `ProjectLabel`. May be used by Relay 1. */
  projectLabelEdge?: Maybe<ProjectLabelEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our update `ProjectLabel` mutation. */
export type UpdateProjectLabelPayloadProjectLabelEdgeArgs = {
  orderBy?: Array<ProjectLabelOrderBy>;
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

/** All input for the `updateProjectProjectLabelById` mutation. */
export type UpdateProjectProjectLabelByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `ProjectProjectLabel` to be updated. */
  id: Scalars['ID']['input'];
  /** An object where the defined keys will be set on the `ProjectProjectLabel` being updated. */
  patch: ProjectProjectLabelPatch;
};

/** All input for the `updateProjectProjectLabel` mutation. */
export type UpdateProjectProjectLabelInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** An object where the defined keys will be set on the `ProjectProjectLabel` being updated. */
  patch: ProjectProjectLabelPatch;
  projectId: Scalars['UUID']['input'];
  projectLabelId: Scalars['UUID']['input'];
};

/** The output of our update `ProjectProjectLabel` mutation. */
export type UpdateProjectProjectLabelPayload = {
  __typename?: 'UpdateProjectProjectLabelPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `ProjectProjectLabel` that was updated by this mutation. */
  projectProjectLabel?: Maybe<ProjectProjectLabel>;
  /** An edge for our `ProjectProjectLabel`. May be used by Relay 1. */
  projectProjectLabelEdge?: Maybe<ProjectProjectLabelEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our update `ProjectProjectLabel` mutation. */
export type UpdateProjectProjectLabelPayloadProjectProjectLabelEdgeArgs = {
  orderBy?: Array<ProjectProjectLabelOrderBy>;
};

/** All input for the `updateSettingById` mutation. */
export type UpdateSettingByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `Setting` to be updated. */
  id: Scalars['ID']['input'];
  /** An object where the defined keys will be set on the `Setting` being updated. */
  patch: SettingPatch;
};

/** All input for the `updateSetting` mutation. */
export type UpdateSettingInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** An object where the defined keys will be set on the `Setting` being updated. */
  patch: SettingPatch;
  rowId: Scalars['UUID']['input'];
};

/** The output of our update `Setting` mutation. */
export type UpdateSettingPayload = {
  __typename?: 'UpdateSettingPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `Setting` that was updated by this mutation. */
  setting?: Maybe<Setting>;
  /** An edge for our `Setting`. May be used by Relay 1. */
  settingEdge?: Maybe<SettingEdge>;
};


/** The output of our update `Setting` mutation. */
export type UpdateSettingPayloadSettingEdgeArgs = {
  orderBy?: Array<SettingOrderBy>;
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
  labelId: Scalars['UUID']['input'];
  /** An object where the defined keys will be set on the `TaskLabel` being updated. */
  patch: TaskLabelPatch;
  taskId: Scalars['UUID']['input'];
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

/** All input for the `updateUserOrganizationById` mutation. */
export type UpdateUserOrganizationByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `UserOrganization` to be updated. */
  id: Scalars['ID']['input'];
  /** An object where the defined keys will be set on the `UserOrganization` being updated. */
  patch: UserOrganizationPatch;
};

/** All input for the `updateUserOrganization` mutation. */
export type UpdateUserOrganizationInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** An object where the defined keys will be set on the `UserOrganization` being updated. */
  patch: UserOrganizationPatch;
  rowId: Scalars['UUID']['input'];
};

/** The output of our update `UserOrganization` mutation. */
export type UpdateUserOrganizationPayload = {
  __typename?: 'UpdateUserOrganizationPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `UserOrganization` that was updated by this mutation. */
  userOrganization?: Maybe<UserOrganization>;
  /** An edge for our `UserOrganization`. May be used by Relay 1. */
  userOrganizationEdge?: Maybe<UserOrganizationEdge>;
};


/** The output of our update `UserOrganization` mutation. */
export type UpdateUserOrganizationPayloadUserOrganizationEdgeArgs = {
  orderBy?: Array<UserOrganizationOrderBy>;
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

/** All input for the `updateUserPreferenceById` mutation. */
export type UpdateUserPreferenceByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `UserPreference` to be updated. */
  id: Scalars['ID']['input'];
  /** An object where the defined keys will be set on the `UserPreference` being updated. */
  patch: UserPreferencePatch;
};

/** All input for the `updateUserPreference` mutation. */
export type UpdateUserPreferenceInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** An object where the defined keys will be set on the `UserPreference` being updated. */
  patch: UserPreferencePatch;
  rowId: Scalars['UUID']['input'];
};

/** The output of our update `UserPreference` mutation. */
export type UpdateUserPreferencePayload = {
  __typename?: 'UpdateUserPreferencePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `UserPreference` that was updated by this mutation. */
  userPreference?: Maybe<UserPreference>;
  /** An edge for our `UserPreference`. May be used by Relay 1. */
  userPreferenceEdge?: Maybe<UserPreferenceEdge>;
};


/** The output of our update `UserPreference` mutation. */
export type UpdateUserPreferencePayloadUserPreferenceEdgeArgs = {
  orderBy?: Array<UserPreferenceOrderBy>;
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
  email: Scalars['String']['output'];
  /** Reads and enables pagination through a set of `Emoji`. */
  emojis: EmojiConnection;
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  id: Scalars['ID']['output'];
  identityProviderId: Scalars['UUID']['output'];
  /** Reads and enables pagination through a set of `Invitation`. */
  invitationsByInviterUserId: InvitationConnection;
  name: Scalars['String']['output'];
  rowId: Scalars['UUID']['output'];
  updatedAt: Scalars['Datetime']['output'];
  /** Reads and enables pagination through a set of `UserOrganization`. */
  userOrganizations: UserOrganizationConnection;
  /** Reads and enables pagination through a set of `UserPreference`. */
  userPreferences: UserPreferenceConnection;
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


export type UserEmojisArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<EmojiCondition>;
  filter?: InputMaybe<EmojiFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<EmojiOrderBy>>;
};


export type UserInvitationsByInviterUserIdArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<InvitationCondition>;
  filter?: InputMaybe<InvitationFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<InvitationOrderBy>>;
};


export type UserUserOrganizationsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<UserOrganizationCondition>;
  filter?: InputMaybe<UserOrganizationFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<UserOrganizationOrderBy>>;
};


export type UserUserPreferencesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<UserPreferenceCondition>;
  filter?: InputMaybe<UserPreferenceFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<UserPreferenceOrderBy>>;
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
  /** Checks for equality with the object’s `email` field. */
  email?: InputMaybe<Scalars['String']['input']>;
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
  /** Distinct count of email across the matching connection */
  email?: Maybe<Scalars['BigInt']['output']>;
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
  /** Filter by the object’s `email` field. */
  email?: InputMaybe<StringFilter>;
  /** Filter by the object’s `emojis` relation. */
  emojis?: InputMaybe<UserToManyEmojiFilter>;
  /** Some related `emojis` exist. */
  emojisExist?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `identityProviderId` field. */
  identityProviderId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `invitationsByInviterUserId` relation. */
  invitationsByInviterUserId?: InputMaybe<UserToManyInvitationFilter>;
  /** Some related `invitationsByInviterUserId` exist. */
  invitationsByInviterUserIdExist?: InputMaybe<Scalars['Boolean']['input']>;
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
  /** Filter by the object’s `userOrganizations` relation. */
  userOrganizations?: InputMaybe<UserToManyUserOrganizationFilter>;
  /** Some related `userOrganizations` exist. */
  userOrganizationsExist?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `userPreferences` relation. */
  userPreferences?: InputMaybe<UserToManyUserPreferenceFilter>;
  /** Some related `userPreferences` exist. */
  userPreferencesExist?: InputMaybe<Scalars['Boolean']['input']>;
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
  email: Scalars['String']['input'];
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
  AuthoredTasksAverageNumberAsc = 'AUTHORED_TASKS_AVERAGE_NUMBER_ASC',
  AuthoredTasksAverageNumberDesc = 'AUTHORED_TASKS_AVERAGE_NUMBER_DESC',
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
  AuthoredTasksDistinctCountNumberAsc = 'AUTHORED_TASKS_DISTINCT_COUNT_NUMBER_ASC',
  AuthoredTasksDistinctCountNumberDesc = 'AUTHORED_TASKS_DISTINCT_COUNT_NUMBER_DESC',
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
  AuthoredTasksMaxNumberAsc = 'AUTHORED_TASKS_MAX_NUMBER_ASC',
  AuthoredTasksMaxNumberDesc = 'AUTHORED_TASKS_MAX_NUMBER_DESC',
  AuthoredTasksMinColumnIndexAsc = 'AUTHORED_TASKS_MIN_COLUMN_INDEX_ASC',
  AuthoredTasksMinColumnIndexDesc = 'AUTHORED_TASKS_MIN_COLUMN_INDEX_DESC',
  AuthoredTasksMinNumberAsc = 'AUTHORED_TASKS_MIN_NUMBER_ASC',
  AuthoredTasksMinNumberDesc = 'AUTHORED_TASKS_MIN_NUMBER_DESC',
  AuthoredTasksStddevPopulationColumnIndexAsc = 'AUTHORED_TASKS_STDDEV_POPULATION_COLUMN_INDEX_ASC',
  AuthoredTasksStddevPopulationColumnIndexDesc = 'AUTHORED_TASKS_STDDEV_POPULATION_COLUMN_INDEX_DESC',
  AuthoredTasksStddevPopulationNumberAsc = 'AUTHORED_TASKS_STDDEV_POPULATION_NUMBER_ASC',
  AuthoredTasksStddevPopulationNumberDesc = 'AUTHORED_TASKS_STDDEV_POPULATION_NUMBER_DESC',
  AuthoredTasksStddevSampleColumnIndexAsc = 'AUTHORED_TASKS_STDDEV_SAMPLE_COLUMN_INDEX_ASC',
  AuthoredTasksStddevSampleColumnIndexDesc = 'AUTHORED_TASKS_STDDEV_SAMPLE_COLUMN_INDEX_DESC',
  AuthoredTasksStddevSampleNumberAsc = 'AUTHORED_TASKS_STDDEV_SAMPLE_NUMBER_ASC',
  AuthoredTasksStddevSampleNumberDesc = 'AUTHORED_TASKS_STDDEV_SAMPLE_NUMBER_DESC',
  AuthoredTasksSumColumnIndexAsc = 'AUTHORED_TASKS_SUM_COLUMN_INDEX_ASC',
  AuthoredTasksSumColumnIndexDesc = 'AUTHORED_TASKS_SUM_COLUMN_INDEX_DESC',
  AuthoredTasksSumNumberAsc = 'AUTHORED_TASKS_SUM_NUMBER_ASC',
  AuthoredTasksSumNumberDesc = 'AUTHORED_TASKS_SUM_NUMBER_DESC',
  AuthoredTasksVariancePopulationColumnIndexAsc = 'AUTHORED_TASKS_VARIANCE_POPULATION_COLUMN_INDEX_ASC',
  AuthoredTasksVariancePopulationColumnIndexDesc = 'AUTHORED_TASKS_VARIANCE_POPULATION_COLUMN_INDEX_DESC',
  AuthoredTasksVariancePopulationNumberAsc = 'AUTHORED_TASKS_VARIANCE_POPULATION_NUMBER_ASC',
  AuthoredTasksVariancePopulationNumberDesc = 'AUTHORED_TASKS_VARIANCE_POPULATION_NUMBER_DESC',
  AuthoredTasksVarianceSampleColumnIndexAsc = 'AUTHORED_TASKS_VARIANCE_SAMPLE_COLUMN_INDEX_ASC',
  AuthoredTasksVarianceSampleColumnIndexDesc = 'AUTHORED_TASKS_VARIANCE_SAMPLE_COLUMN_INDEX_DESC',
  AuthoredTasksVarianceSampleNumberAsc = 'AUTHORED_TASKS_VARIANCE_SAMPLE_NUMBER_ASC',
  AuthoredTasksVarianceSampleNumberDesc = 'AUTHORED_TASKS_VARIANCE_SAMPLE_NUMBER_DESC',
  AvatarUrlAsc = 'AVATAR_URL_ASC',
  AvatarUrlDesc = 'AVATAR_URL_DESC',
  CreatedAtAsc = 'CREATED_AT_ASC',
  CreatedAtDesc = 'CREATED_AT_DESC',
  EmailAsc = 'EMAIL_ASC',
  EmailDesc = 'EMAIL_DESC',
  EmojisCountAsc = 'EMOJIS_COUNT_ASC',
  EmojisCountDesc = 'EMOJIS_COUNT_DESC',
  EmojisDistinctCountCreatedAtAsc = 'EMOJIS_DISTINCT_COUNT_CREATED_AT_ASC',
  EmojisDistinctCountCreatedAtDesc = 'EMOJIS_DISTINCT_COUNT_CREATED_AT_DESC',
  EmojisDistinctCountEmojiAsc = 'EMOJIS_DISTINCT_COUNT_EMOJI_ASC',
  EmojisDistinctCountEmojiDesc = 'EMOJIS_DISTINCT_COUNT_EMOJI_DESC',
  EmojisDistinctCountPostIdAsc = 'EMOJIS_DISTINCT_COUNT_POST_ID_ASC',
  EmojisDistinctCountPostIdDesc = 'EMOJIS_DISTINCT_COUNT_POST_ID_DESC',
  EmojisDistinctCountRowIdAsc = 'EMOJIS_DISTINCT_COUNT_ROW_ID_ASC',
  EmojisDistinctCountRowIdDesc = 'EMOJIS_DISTINCT_COUNT_ROW_ID_DESC',
  EmojisDistinctCountUpdatedAtAsc = 'EMOJIS_DISTINCT_COUNT_UPDATED_AT_ASC',
  EmojisDistinctCountUpdatedAtDesc = 'EMOJIS_DISTINCT_COUNT_UPDATED_AT_DESC',
  EmojisDistinctCountUserIdAsc = 'EMOJIS_DISTINCT_COUNT_USER_ID_ASC',
  EmojisDistinctCountUserIdDesc = 'EMOJIS_DISTINCT_COUNT_USER_ID_DESC',
  IdentityProviderIdAsc = 'IDENTITY_PROVIDER_ID_ASC',
  IdentityProviderIdDesc = 'IDENTITY_PROVIDER_ID_DESC',
  InvitationsByInviterUserIdCountAsc = 'INVITATIONS_BY_INVITER_USER_ID_COUNT_ASC',
  InvitationsByInviterUserIdCountDesc = 'INVITATIONS_BY_INVITER_USER_ID_COUNT_DESC',
  InvitationsByInviterUserIdDistinctCountCreatedAtAsc = 'INVITATIONS_BY_INVITER_USER_ID_DISTINCT_COUNT_CREATED_AT_ASC',
  InvitationsByInviterUserIdDistinctCountCreatedAtDesc = 'INVITATIONS_BY_INVITER_USER_ID_DISTINCT_COUNT_CREATED_AT_DESC',
  InvitationsByInviterUserIdDistinctCountEmailAsc = 'INVITATIONS_BY_INVITER_USER_ID_DISTINCT_COUNT_EMAIL_ASC',
  InvitationsByInviterUserIdDistinctCountEmailDesc = 'INVITATIONS_BY_INVITER_USER_ID_DISTINCT_COUNT_EMAIL_DESC',
  InvitationsByInviterUserIdDistinctCountExpiresAtAsc = 'INVITATIONS_BY_INVITER_USER_ID_DISTINCT_COUNT_EXPIRES_AT_ASC',
  InvitationsByInviterUserIdDistinctCountExpiresAtDesc = 'INVITATIONS_BY_INVITER_USER_ID_DISTINCT_COUNT_EXPIRES_AT_DESC',
  InvitationsByInviterUserIdDistinctCountInviterUserIdAsc = 'INVITATIONS_BY_INVITER_USER_ID_DISTINCT_COUNT_INVITER_USER_ID_ASC',
  InvitationsByInviterUserIdDistinctCountInviterUserIdDesc = 'INVITATIONS_BY_INVITER_USER_ID_DISTINCT_COUNT_INVITER_USER_ID_DESC',
  InvitationsByInviterUserIdDistinctCountOrganizationIdAsc = 'INVITATIONS_BY_INVITER_USER_ID_DISTINCT_COUNT_ORGANIZATION_ID_ASC',
  InvitationsByInviterUserIdDistinctCountOrganizationIdDesc = 'INVITATIONS_BY_INVITER_USER_ID_DISTINCT_COUNT_ORGANIZATION_ID_DESC',
  InvitationsByInviterUserIdDistinctCountRoleAsc = 'INVITATIONS_BY_INVITER_USER_ID_DISTINCT_COUNT_ROLE_ASC',
  InvitationsByInviterUserIdDistinctCountRoleDesc = 'INVITATIONS_BY_INVITER_USER_ID_DISTINCT_COUNT_ROLE_DESC',
  InvitationsByInviterUserIdDistinctCountRowIdAsc = 'INVITATIONS_BY_INVITER_USER_ID_DISTINCT_COUNT_ROW_ID_ASC',
  InvitationsByInviterUserIdDistinctCountRowIdDesc = 'INVITATIONS_BY_INVITER_USER_ID_DISTINCT_COUNT_ROW_ID_DESC',
  InvitationsByInviterUserIdDistinctCountStatusAsc = 'INVITATIONS_BY_INVITER_USER_ID_DISTINCT_COUNT_STATUS_ASC',
  InvitationsByInviterUserIdDistinctCountStatusDesc = 'INVITATIONS_BY_INVITER_USER_ID_DISTINCT_COUNT_STATUS_DESC',
  InvitationsByInviterUserIdDistinctCountTokenAsc = 'INVITATIONS_BY_INVITER_USER_ID_DISTINCT_COUNT_TOKEN_ASC',
  InvitationsByInviterUserIdDistinctCountTokenDesc = 'INVITATIONS_BY_INVITER_USER_ID_DISTINCT_COUNT_TOKEN_DESC',
  NameAsc = 'NAME_ASC',
  NameDesc = 'NAME_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  RowIdAsc = 'ROW_ID_ASC',
  RowIdDesc = 'ROW_ID_DESC',
  UpdatedAtAsc = 'UPDATED_AT_ASC',
  UpdatedAtDesc = 'UPDATED_AT_DESC',
  UserOrganizationsCountAsc = 'USER_ORGANIZATIONS_COUNT_ASC',
  UserOrganizationsCountDesc = 'USER_ORGANIZATIONS_COUNT_DESC',
  UserOrganizationsDistinctCountCreatedAtAsc = 'USER_ORGANIZATIONS_DISTINCT_COUNT_CREATED_AT_ASC',
  UserOrganizationsDistinctCountCreatedAtDesc = 'USER_ORGANIZATIONS_DISTINCT_COUNT_CREATED_AT_DESC',
  UserOrganizationsDistinctCountNameAsc = 'USER_ORGANIZATIONS_DISTINCT_COUNT_NAME_ASC',
  UserOrganizationsDistinctCountNameDesc = 'USER_ORGANIZATIONS_DISTINCT_COUNT_NAME_DESC',
  UserOrganizationsDistinctCountOrganizationIdAsc = 'USER_ORGANIZATIONS_DISTINCT_COUNT_ORGANIZATION_ID_ASC',
  UserOrganizationsDistinctCountOrganizationIdDesc = 'USER_ORGANIZATIONS_DISTINCT_COUNT_ORGANIZATION_ID_DESC',
  UserOrganizationsDistinctCountRoleAsc = 'USER_ORGANIZATIONS_DISTINCT_COUNT_ROLE_ASC',
  UserOrganizationsDistinctCountRoleDesc = 'USER_ORGANIZATIONS_DISTINCT_COUNT_ROLE_DESC',
  UserOrganizationsDistinctCountRowIdAsc = 'USER_ORGANIZATIONS_DISTINCT_COUNT_ROW_ID_ASC',
  UserOrganizationsDistinctCountRowIdDesc = 'USER_ORGANIZATIONS_DISTINCT_COUNT_ROW_ID_DESC',
  UserOrganizationsDistinctCountSlugAsc = 'USER_ORGANIZATIONS_DISTINCT_COUNT_SLUG_ASC',
  UserOrganizationsDistinctCountSlugDesc = 'USER_ORGANIZATIONS_DISTINCT_COUNT_SLUG_DESC',
  UserOrganizationsDistinctCountSyncedAtAsc = 'USER_ORGANIZATIONS_DISTINCT_COUNT_SYNCED_AT_ASC',
  UserOrganizationsDistinctCountSyncedAtDesc = 'USER_ORGANIZATIONS_DISTINCT_COUNT_SYNCED_AT_DESC',
  UserOrganizationsDistinctCountTypeAsc = 'USER_ORGANIZATIONS_DISTINCT_COUNT_TYPE_ASC',
  UserOrganizationsDistinctCountTypeDesc = 'USER_ORGANIZATIONS_DISTINCT_COUNT_TYPE_DESC',
  UserOrganizationsDistinctCountUpdatedAtAsc = 'USER_ORGANIZATIONS_DISTINCT_COUNT_UPDATED_AT_ASC',
  UserOrganizationsDistinctCountUpdatedAtDesc = 'USER_ORGANIZATIONS_DISTINCT_COUNT_UPDATED_AT_DESC',
  UserOrganizationsDistinctCountUserIdAsc = 'USER_ORGANIZATIONS_DISTINCT_COUNT_USER_ID_ASC',
  UserOrganizationsDistinctCountUserIdDesc = 'USER_ORGANIZATIONS_DISTINCT_COUNT_USER_ID_DESC',
  UserPreferencesCountAsc = 'USER_PREFERENCES_COUNT_ASC',
  UserPreferencesCountDesc = 'USER_PREFERENCES_COUNT_DESC',
  UserPreferencesDistinctCountColorAsc = 'USER_PREFERENCES_DISTINCT_COUNT_COLOR_ASC',
  UserPreferencesDistinctCountColorDesc = 'USER_PREFERENCES_DISTINCT_COUNT_COLOR_DESC',
  UserPreferencesDistinctCountCreatedAtAsc = 'USER_PREFERENCES_DISTINCT_COUNT_CREATED_AT_ASC',
  UserPreferencesDistinctCountCreatedAtDesc = 'USER_PREFERENCES_DISTINCT_COUNT_CREATED_AT_DESC',
  UserPreferencesDistinctCountHiddenColumnIdsAsc = 'USER_PREFERENCES_DISTINCT_COUNT_HIDDEN_COLUMN_IDS_ASC',
  UserPreferencesDistinctCountHiddenColumnIdsDesc = 'USER_PREFERENCES_DISTINCT_COUNT_HIDDEN_COLUMN_IDS_DESC',
  UserPreferencesDistinctCountProjectIdAsc = 'USER_PREFERENCES_DISTINCT_COUNT_PROJECT_ID_ASC',
  UserPreferencesDistinctCountProjectIdDesc = 'USER_PREFERENCES_DISTINCT_COUNT_PROJECT_ID_DESC',
  UserPreferencesDistinctCountRowIdAsc = 'USER_PREFERENCES_DISTINCT_COUNT_ROW_ID_ASC',
  UserPreferencesDistinctCountRowIdDesc = 'USER_PREFERENCES_DISTINCT_COUNT_ROW_ID_DESC',
  UserPreferencesDistinctCountUpdatedAtAsc = 'USER_PREFERENCES_DISTINCT_COUNT_UPDATED_AT_ASC',
  UserPreferencesDistinctCountUpdatedAtDesc = 'USER_PREFERENCES_DISTINCT_COUNT_UPDATED_AT_DESC',
  UserPreferencesDistinctCountUserIdAsc = 'USER_PREFERENCES_DISTINCT_COUNT_USER_ID_ASC',
  UserPreferencesDistinctCountUserIdDesc = 'USER_PREFERENCES_DISTINCT_COUNT_USER_ID_DESC',
  UserPreferencesDistinctCountViewModeAsc = 'USER_PREFERENCES_DISTINCT_COUNT_VIEW_MODE_ASC',
  UserPreferencesDistinctCountViewModeDesc = 'USER_PREFERENCES_DISTINCT_COUNT_VIEW_MODE_DESC'
}

export type UserOrganization = Node & {
  __typename?: 'UserOrganization';
  createdAt: Scalars['Datetime']['output'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['String']['output'];
  role: MemberRole;
  rowId: Scalars['UUID']['output'];
  slug: Scalars['String']['output'];
  syncedAt: Scalars['Datetime']['output'];
  type: OrganizationType;
  updatedAt: Scalars['Datetime']['output'];
  /** Reads a single `User` that is related to this `UserOrganization`. */
  user?: Maybe<User>;
  userId: Scalars['UUID']['output'];
};

export type UserOrganizationAggregates = {
  __typename?: 'UserOrganizationAggregates';
  /** Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset) */
  distinctCount?: Maybe<UserOrganizationDistinctCountAggregates>;
  keys?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

/** A filter to be used against aggregates of `UserOrganization` object types. */
export type UserOrganizationAggregatesFilter = {
  /** Distinct count aggregate over matching `UserOrganization` objects. */
  distinctCount?: InputMaybe<UserOrganizationDistinctCountAggregateFilter>;
  /** A filter that must pass for the relevant `UserOrganization` object to be included within the aggregate. */
  filter?: InputMaybe<UserOrganizationFilter>;
};

/**
 * A condition to be used against `UserOrganization` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type UserOrganizationCondition = {
  /** Checks for equality with the object’s `createdAt` field. */
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `name` field. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `organizationId` field. */
  organizationId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `role` field. */
  role?: InputMaybe<MemberRole>;
  /** Checks for equality with the object’s `rowId` field. */
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `slug` field. */
  slug?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `syncedAt` field. */
  syncedAt?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `type` field. */
  type?: InputMaybe<OrganizationType>;
  /** Checks for equality with the object’s `updatedAt` field. */
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `userId` field. */
  userId?: InputMaybe<Scalars['UUID']['input']>;
};

/** A connection to a list of `UserOrganization` values. */
export type UserOrganizationConnection = {
  __typename?: 'UserOrganizationConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<UserOrganizationAggregates>;
  /** A list of edges which contains the `UserOrganization` and cursor to aid in pagination. */
  edges: Array<UserOrganizationEdge>;
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<Array<UserOrganizationAggregates>>;
  /** A list of `UserOrganization` objects. */
  nodes: Array<UserOrganization>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `UserOrganization` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `UserOrganization` values. */
export type UserOrganizationConnectionGroupedAggregatesArgs = {
  groupBy: Array<UserOrganizationGroupBy>;
  having?: InputMaybe<UserOrganizationHavingInput>;
};

export type UserOrganizationDistinctCountAggregateFilter = {
  createdAt?: InputMaybe<BigIntFilter>;
  name?: InputMaybe<BigIntFilter>;
  organizationId?: InputMaybe<BigIntFilter>;
  role?: InputMaybe<BigIntFilter>;
  rowId?: InputMaybe<BigIntFilter>;
  slug?: InputMaybe<BigIntFilter>;
  syncedAt?: InputMaybe<BigIntFilter>;
  type?: InputMaybe<BigIntFilter>;
  updatedAt?: InputMaybe<BigIntFilter>;
  userId?: InputMaybe<BigIntFilter>;
};

export type UserOrganizationDistinctCountAggregates = {
  __typename?: 'UserOrganizationDistinctCountAggregates';
  /** Distinct count of createdAt across the matching connection */
  createdAt?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of name across the matching connection */
  name?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of organizationId across the matching connection */
  organizationId?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of role across the matching connection */
  role?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of rowId across the matching connection */
  rowId?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of slug across the matching connection */
  slug?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of syncedAt across the matching connection */
  syncedAt?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of type across the matching connection */
  type?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of updatedAt across the matching connection */
  updatedAt?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of userId across the matching connection */
  userId?: Maybe<Scalars['BigInt']['output']>;
};

/** A `UserOrganization` edge in the connection. */
export type UserOrganizationEdge = {
  __typename?: 'UserOrganizationEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `UserOrganization` at the end of the edge. */
  node: UserOrganization;
};

/** A filter to be used against `UserOrganization` object types. All fields are combined with a logical ‘and.’ */
export type UserOrganizationFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<UserOrganizationFilter>>;
  /** Filter by the object’s `createdAt` field. */
  createdAt?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `name` field. */
  name?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<UserOrganizationFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<UserOrganizationFilter>>;
  /** Filter by the object’s `organizationId` field. */
  organizationId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `role` field. */
  role?: InputMaybe<MemberRoleFilter>;
  /** Filter by the object’s `rowId` field. */
  rowId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `slug` field. */
  slug?: InputMaybe<StringFilter>;
  /** Filter by the object’s `syncedAt` field. */
  syncedAt?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `type` field. */
  type?: InputMaybe<OrganizationTypeFilter>;
  /** Filter by the object’s `updatedAt` field. */
  updatedAt?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `user` relation. */
  user?: InputMaybe<UserFilter>;
  /** Filter by the object’s `userId` field. */
  userId?: InputMaybe<UuidFilter>;
};

/** Grouping methods for `UserOrganization` for usage during aggregation. */
export enum UserOrganizationGroupBy {
  CreatedAt = 'CREATED_AT',
  CreatedAtTruncatedToDay = 'CREATED_AT_TRUNCATED_TO_DAY',
  CreatedAtTruncatedToHour = 'CREATED_AT_TRUNCATED_TO_HOUR',
  Name = 'NAME',
  OrganizationId = 'ORGANIZATION_ID',
  Role = 'ROLE',
  Slug = 'SLUG',
  SyncedAt = 'SYNCED_AT',
  SyncedAtTruncatedToDay = 'SYNCED_AT_TRUNCATED_TO_DAY',
  SyncedAtTruncatedToHour = 'SYNCED_AT_TRUNCATED_TO_HOUR',
  Type = 'TYPE',
  UpdatedAt = 'UPDATED_AT',
  UpdatedAtTruncatedToDay = 'UPDATED_AT_TRUNCATED_TO_DAY',
  UpdatedAtTruncatedToHour = 'UPDATED_AT_TRUNCATED_TO_HOUR',
  UserId = 'USER_ID'
}

export type UserOrganizationHavingAverageInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  syncedAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type UserOrganizationHavingDistinctCountInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  syncedAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

/** Conditions for `UserOrganization` aggregates. */
export type UserOrganizationHavingInput = {
  AND?: InputMaybe<Array<UserOrganizationHavingInput>>;
  OR?: InputMaybe<Array<UserOrganizationHavingInput>>;
  average?: InputMaybe<UserOrganizationHavingAverageInput>;
  distinctCount?: InputMaybe<UserOrganizationHavingDistinctCountInput>;
  max?: InputMaybe<UserOrganizationHavingMaxInput>;
  min?: InputMaybe<UserOrganizationHavingMinInput>;
  stddevPopulation?: InputMaybe<UserOrganizationHavingStddevPopulationInput>;
  stddevSample?: InputMaybe<UserOrganizationHavingStddevSampleInput>;
  sum?: InputMaybe<UserOrganizationHavingSumInput>;
  variancePopulation?: InputMaybe<UserOrganizationHavingVariancePopulationInput>;
  varianceSample?: InputMaybe<UserOrganizationHavingVarianceSampleInput>;
};

export type UserOrganizationHavingMaxInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  syncedAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type UserOrganizationHavingMinInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  syncedAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type UserOrganizationHavingStddevPopulationInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  syncedAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type UserOrganizationHavingStddevSampleInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  syncedAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type UserOrganizationHavingSumInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  syncedAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type UserOrganizationHavingVariancePopulationInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  syncedAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type UserOrganizationHavingVarianceSampleInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  syncedAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

/** An input for mutations affecting `UserOrganization` */
export type UserOrganizationInput = {
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['String']['input'];
  role?: InputMaybe<MemberRole>;
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  slug: Scalars['String']['input'];
  syncedAt?: InputMaybe<Scalars['Datetime']['input']>;
  type?: InputMaybe<OrganizationType>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
  userId: Scalars['UUID']['input'];
};

/** Methods to use when ordering `UserOrganization`. */
export enum UserOrganizationOrderBy {
  CreatedAtAsc = 'CREATED_AT_ASC',
  CreatedAtDesc = 'CREATED_AT_DESC',
  NameAsc = 'NAME_ASC',
  NameDesc = 'NAME_DESC',
  Natural = 'NATURAL',
  OrganizationIdAsc = 'ORGANIZATION_ID_ASC',
  OrganizationIdDesc = 'ORGANIZATION_ID_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  RowIdAsc = 'ROW_ID_ASC',
  RowIdDesc = 'ROW_ID_DESC',
  SlugAsc = 'SLUG_ASC',
  SlugDesc = 'SLUG_DESC',
  SyncedAtAsc = 'SYNCED_AT_ASC',
  SyncedAtDesc = 'SYNCED_AT_DESC',
  UpdatedAtAsc = 'UPDATED_AT_ASC',
  UpdatedAtDesc = 'UPDATED_AT_DESC',
  UserIdAsc = 'USER_ID_ASC',
  UserIdDesc = 'USER_ID_DESC'
}

/** Represents an update to a `UserOrganization`. Fields that are set will be updated. */
export type UserOrganizationPatch = {
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  organizationId?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<MemberRole>;
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  syncedAt?: InputMaybe<Scalars['Datetime']['input']>;
  type?: InputMaybe<OrganizationType>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
  userId?: InputMaybe<Scalars['UUID']['input']>;
};

/** Represents an update to a `User`. Fields that are set will be updated. */
export type UserPatch = {
  avatarUrl?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  identityProviderId?: InputMaybe<Scalars['UUID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
};

export type UserPreference = Node & {
  __typename?: 'UserPreference';
  color?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Datetime']['output'];
  hiddenColumnIds: Array<Maybe<Scalars['String']['output']>>;
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  id: Scalars['ID']['output'];
  /** Reads a single `Project` that is related to this `UserPreference`. */
  project?: Maybe<Project>;
  projectId: Scalars['UUID']['output'];
  rowId: Scalars['UUID']['output'];
  updatedAt: Scalars['Datetime']['output'];
  /** Reads a single `User` that is related to this `UserPreference`. */
  user?: Maybe<User>;
  userId: Scalars['UUID']['output'];
  viewMode: Scalars['String']['output'];
};

export type UserPreferenceAggregates = {
  __typename?: 'UserPreferenceAggregates';
  /** Distinct count aggregates across the matching connection (ignoring before/after/first/last/offset) */
  distinctCount?: Maybe<UserPreferenceDistinctCountAggregates>;
  keys?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

/** A filter to be used against aggregates of `UserPreference` object types. */
export type UserPreferenceAggregatesFilter = {
  /** Distinct count aggregate over matching `UserPreference` objects. */
  distinctCount?: InputMaybe<UserPreferenceDistinctCountAggregateFilter>;
  /** A filter that must pass for the relevant `UserPreference` object to be included within the aggregate. */
  filter?: InputMaybe<UserPreferenceFilter>;
};

/**
 * A condition to be used against `UserPreference` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type UserPreferenceCondition = {
  /** Checks for equality with the object’s `color` field. */
  color?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `createdAt` field. */
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `projectId` field. */
  projectId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `rowId` field. */
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `updatedAt` field. */
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `userId` field. */
  userId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `viewMode` field. */
  viewMode?: InputMaybe<Scalars['String']['input']>;
};

/** A connection to a list of `UserPreference` values. */
export type UserPreferenceConnection = {
  __typename?: 'UserPreferenceConnection';
  /** Aggregates across the matching connection (ignoring before/after/first/last/offset) */
  aggregates?: Maybe<UserPreferenceAggregates>;
  /** A list of edges which contains the `UserPreference` and cursor to aid in pagination. */
  edges: Array<UserPreferenceEdge>;
  /** Grouped aggregates across the matching connection (ignoring before/after/first/last/offset) */
  groupedAggregates?: Maybe<Array<UserPreferenceAggregates>>;
  /** A list of `UserPreference` objects. */
  nodes: Array<UserPreference>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `UserPreference` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};


/** A connection to a list of `UserPreference` values. */
export type UserPreferenceConnectionGroupedAggregatesArgs = {
  groupBy: Array<UserPreferenceGroupBy>;
  having?: InputMaybe<UserPreferenceHavingInput>;
};

export type UserPreferenceDistinctCountAggregateFilter = {
  color?: InputMaybe<BigIntFilter>;
  createdAt?: InputMaybe<BigIntFilter>;
  hiddenColumnIds?: InputMaybe<BigIntFilter>;
  projectId?: InputMaybe<BigIntFilter>;
  rowId?: InputMaybe<BigIntFilter>;
  updatedAt?: InputMaybe<BigIntFilter>;
  userId?: InputMaybe<BigIntFilter>;
  viewMode?: InputMaybe<BigIntFilter>;
};

export type UserPreferenceDistinctCountAggregates = {
  __typename?: 'UserPreferenceDistinctCountAggregates';
  /** Distinct count of color across the matching connection */
  color?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of createdAt across the matching connection */
  createdAt?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of hiddenColumnIds across the matching connection */
  hiddenColumnIds?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of projectId across the matching connection */
  projectId?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of rowId across the matching connection */
  rowId?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of updatedAt across the matching connection */
  updatedAt?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of userId across the matching connection */
  userId?: Maybe<Scalars['BigInt']['output']>;
  /** Distinct count of viewMode across the matching connection */
  viewMode?: Maybe<Scalars['BigInt']['output']>;
};

/** A `UserPreference` edge in the connection. */
export type UserPreferenceEdge = {
  __typename?: 'UserPreferenceEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `UserPreference` at the end of the edge. */
  node: UserPreference;
};

/** A filter to be used against `UserPreference` object types. All fields are combined with a logical ‘and.’ */
export type UserPreferenceFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<UserPreferenceFilter>>;
  /** Filter by the object’s `color` field. */
  color?: InputMaybe<StringFilter>;
  /** Filter by the object’s `createdAt` field. */
  createdAt?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `hiddenColumnIds` field. */
  hiddenColumnIds?: InputMaybe<StringListFilter>;
  /** Negates the expression. */
  not?: InputMaybe<UserPreferenceFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<UserPreferenceFilter>>;
  /** Filter by the object’s `project` relation. */
  project?: InputMaybe<ProjectFilter>;
  /** Filter by the object’s `projectId` field. */
  projectId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `rowId` field. */
  rowId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `updatedAt` field. */
  updatedAt?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `user` relation. */
  user?: InputMaybe<UserFilter>;
  /** Filter by the object’s `userId` field. */
  userId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `viewMode` field. */
  viewMode?: InputMaybe<StringFilter>;
};

/** Grouping methods for `UserPreference` for usage during aggregation. */
export enum UserPreferenceGroupBy {
  Color = 'COLOR',
  CreatedAt = 'CREATED_AT',
  CreatedAtTruncatedToDay = 'CREATED_AT_TRUNCATED_TO_DAY',
  CreatedAtTruncatedToHour = 'CREATED_AT_TRUNCATED_TO_HOUR',
  HiddenColumnIds = 'HIDDEN_COLUMN_IDS',
  ProjectId = 'PROJECT_ID',
  UpdatedAt = 'UPDATED_AT',
  UpdatedAtTruncatedToDay = 'UPDATED_AT_TRUNCATED_TO_DAY',
  UpdatedAtTruncatedToHour = 'UPDATED_AT_TRUNCATED_TO_HOUR',
  UserId = 'USER_ID',
  ViewMode = 'VIEW_MODE'
}

export type UserPreferenceHavingAverageInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type UserPreferenceHavingDistinctCountInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

/** Conditions for `UserPreference` aggregates. */
export type UserPreferenceHavingInput = {
  AND?: InputMaybe<Array<UserPreferenceHavingInput>>;
  OR?: InputMaybe<Array<UserPreferenceHavingInput>>;
  average?: InputMaybe<UserPreferenceHavingAverageInput>;
  distinctCount?: InputMaybe<UserPreferenceHavingDistinctCountInput>;
  max?: InputMaybe<UserPreferenceHavingMaxInput>;
  min?: InputMaybe<UserPreferenceHavingMinInput>;
  stddevPopulation?: InputMaybe<UserPreferenceHavingStddevPopulationInput>;
  stddevSample?: InputMaybe<UserPreferenceHavingStddevSampleInput>;
  sum?: InputMaybe<UserPreferenceHavingSumInput>;
  variancePopulation?: InputMaybe<UserPreferenceHavingVariancePopulationInput>;
  varianceSample?: InputMaybe<UserPreferenceHavingVarianceSampleInput>;
};

export type UserPreferenceHavingMaxInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type UserPreferenceHavingMinInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type UserPreferenceHavingStddevPopulationInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type UserPreferenceHavingStddevSampleInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type UserPreferenceHavingSumInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type UserPreferenceHavingVariancePopulationInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

export type UserPreferenceHavingVarianceSampleInput = {
  createdAt?: InputMaybe<HavingDatetimeFilter>;
  updatedAt?: InputMaybe<HavingDatetimeFilter>;
};

/** An input for mutations affecting `UserPreference` */
export type UserPreferenceInput = {
  color?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  hiddenColumnIds?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  projectId: Scalars['UUID']['input'];
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
  userId: Scalars['UUID']['input'];
  viewMode?: InputMaybe<Scalars['String']['input']>;
};

/** Methods to use when ordering `UserPreference`. */
export enum UserPreferenceOrderBy {
  ColorAsc = 'COLOR_ASC',
  ColorDesc = 'COLOR_DESC',
  CreatedAtAsc = 'CREATED_AT_ASC',
  CreatedAtDesc = 'CREATED_AT_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  ProjectIdAsc = 'PROJECT_ID_ASC',
  ProjectIdDesc = 'PROJECT_ID_DESC',
  RowIdAsc = 'ROW_ID_ASC',
  RowIdDesc = 'ROW_ID_DESC',
  UpdatedAtAsc = 'UPDATED_AT_ASC',
  UpdatedAtDesc = 'UPDATED_AT_DESC',
  UserIdAsc = 'USER_ID_ASC',
  UserIdDesc = 'USER_ID_DESC',
  ViewModeAsc = 'VIEW_MODE_ASC',
  ViewModeDesc = 'VIEW_MODE_DESC'
}

/** Represents an update to a `UserPreference`. Fields that are set will be updated. */
export type UserPreferencePatch = {
  color?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  hiddenColumnIds?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  projectId?: InputMaybe<Scalars['UUID']['input']>;
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
  userId?: InputMaybe<Scalars['UUID']['input']>;
  viewMode?: InputMaybe<Scalars['String']['input']>;
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

/** A filter to be used against many `Emoji` object types. All fields are combined with a logical ‘and.’ */
export type UserToManyEmojiFilter = {
  /** Aggregates across related `Emoji` match the filter criteria. */
  aggregates?: InputMaybe<EmojiAggregatesFilter>;
  /** Every related `Emoji` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<EmojiFilter>;
  /** No related `Emoji` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<EmojiFilter>;
  /** Some related `Emoji` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<EmojiFilter>;
};

/** A filter to be used against many `Invitation` object types. All fields are combined with a logical ‘and.’ */
export type UserToManyInvitationFilter = {
  /** Aggregates across related `Invitation` match the filter criteria. */
  aggregates?: InputMaybe<InvitationAggregatesFilter>;
  /** Every related `Invitation` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<InvitationFilter>;
  /** No related `Invitation` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<InvitationFilter>;
  /** Some related `Invitation` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<InvitationFilter>;
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

/** A filter to be used against many `UserOrganization` object types. All fields are combined with a logical ‘and.’ */
export type UserToManyUserOrganizationFilter = {
  /** Aggregates across related `UserOrganization` match the filter criteria. */
  aggregates?: InputMaybe<UserOrganizationAggregatesFilter>;
  /** Every related `UserOrganization` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<UserOrganizationFilter>;
  /** No related `UserOrganization` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<UserOrganizationFilter>;
  /** Some related `UserOrganization` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<UserOrganizationFilter>;
};

/** A filter to be used against many `UserPreference` object types. All fields are combined with a logical ‘and.’ */
export type UserToManyUserPreferenceFilter = {
  /** Aggregates across related `UserPreference` match the filter criteria. */
  aggregates?: InputMaybe<UserPreferenceAggregatesFilter>;
  /** Every related `UserPreference` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<UserPreferenceFilter>;
  /** No related `UserPreference` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<UserPreferenceFilter>;
  /** Some related `UserPreference` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<UserPreferenceFilter>;
};

export type ColumnFragment = { __typename?: 'Column', title: string, index: number, rowId: string, icon?: string | null, tasks: { __typename?: 'TaskConnection', totalCount: number } };

export type LabelFragment = { __typename?: 'Label', color: string, icon?: string | null, name: string, rowId: string };

export type ProjectColumnFragment = { __typename?: 'ProjectColumn', title: string, index: number, rowId: string, icon?: string | null, projects: { __typename?: 'ProjectConnection', totalCount: number } };

export type ProjectFragment = { __typename?: 'Project', rowId: string, name: string, slug: string, description?: string | null, prefix?: string | null, projectColumnId: string, columnIndex: number, allTasks: { __typename?: 'TaskConnection', totalCount: number }, completedTasks: { __typename?: 'TaskConnection', totalCount: number } };

export type TaskFragment = { __typename?: 'Task', rowId: string, number?: number | null, columnId: string, columnIndex: number, content: string, description: string, priority: string, dueDate?: Date | null, taskLabels: { __typename?: 'TaskLabelConnection', nodes: Array<{ __typename?: 'TaskLabel', label?: { __typename?: 'Label', color: string, icon?: string | null, name: string, rowId: string } | null }> }, assignees: { __typename?: 'AssigneeConnection', nodes: Array<{ __typename?: 'Assignee', taskId: string, userId: string, user?: { __typename?: 'User', rowId: string, identityProviderId: string, name: string, avatarUrl?: string | null } | null }> }, posts: { __typename?: 'PostConnection', totalCount: number } };

export type CreateAssigneeMutationVariables = Exact<{
  input: CreateAssigneeInput;
}>;


export type CreateAssigneeMutation = { __typename?: 'Mutation', createAssignee?: { __typename?: 'CreateAssigneePayload', assignee?: { __typename?: 'Assignee', taskId: string, userId: string } | null } | null };

export type DeleteAssigneeMutationVariables = Exact<{
  taskId: Scalars['UUID']['input'];
  userId: Scalars['UUID']['input'];
}>;


export type DeleteAssigneeMutation = { __typename?: 'Mutation', deleteAssignee?: { __typename?: 'DeleteAssigneePayload', assignee?: { __typename?: 'Assignee', taskId: string, userId: string } | null } | null };

export type CreateColumnMutationVariables = Exact<{
  input: CreateColumnInput;
}>;


export type CreateColumnMutation = { __typename?: 'Mutation', createColumn?: { __typename?: 'CreateColumnPayload', column?: { __typename?: 'Column', title: string, index: number, rowId: string, icon?: string | null, tasks: { __typename?: 'TaskConnection', totalCount: number } } | null } | null };

export type DeleteColumnMutationVariables = Exact<{
  rowId: Scalars['UUID']['input'];
}>;


export type DeleteColumnMutation = { __typename?: 'Mutation', deleteColumn?: { __typename?: 'DeleteColumnPayload', clientMutationId?: string | null } | null };

export type UpdateColumnMutationVariables = Exact<{
  rowId: Scalars['UUID']['input'];
  patch: ColumnPatch;
}>;


export type UpdateColumnMutation = { __typename?: 'Mutation', updateColumn?: { __typename?: 'UpdateColumnPayload', column?: { __typename?: 'Column', rowId: string } | null } | null };

export type CreatePostEmojiMutationVariables = Exact<{
  input: CreateEmojiInput;
}>;


export type CreatePostEmojiMutation = { __typename?: 'Mutation', createEmoji?: { __typename?: 'CreateEmojiPayload', emoji?: { __typename?: 'Emoji', rowId: string } | null } | null };

export type DeletePostEmojiMutationVariables = Exact<{
  rowId: Scalars['UUID']['input'];
}>;


export type DeletePostEmojiMutation = { __typename?: 'Mutation', deleteEmoji?: { __typename?: 'DeleteEmojiPayload', emoji?: { __typename?: 'Emoji', rowId: string } | null } | null };

export type UpdatePostEmojiMutationVariables = Exact<{
  input: UpdateEmojiInput;
}>;


export type UpdatePostEmojiMutation = { __typename?: 'Mutation', updateEmoji?: { __typename?: 'UpdateEmojiPayload', emoji?: { __typename?: 'Emoji', rowId: string } | null } | null };

export type CreateInvitationMutationVariables = Exact<{
  input: CreateInvitationInput;
}>;


export type CreateInvitationMutation = { __typename?: 'Mutation', createInvitation?: { __typename?: 'CreateInvitationPayload', invitation?: { __typename?: 'Invitation', rowId: string, organizationId: string, email?: string | null, role: MemberRole, token: string, status: InvitationStatus, expiresAt: Date } | null } | null };

export type UpdateInvitationMutationVariables = Exact<{
  input: UpdateInvitationInput;
}>;


export type UpdateInvitationMutation = { __typename?: 'Mutation', updateInvitation?: { __typename?: 'UpdateInvitationPayload', invitation?: { __typename?: 'Invitation', rowId: string, status: InvitationStatus } | null } | null };

export type CreateLabelMutationVariables = Exact<{
  input: CreateLabelInput;
}>;


export type CreateLabelMutation = { __typename?: 'Mutation', createLabel?: { __typename?: 'CreateLabelPayload', label?: { __typename?: 'Label', rowId: string, name: string, color: string, icon?: string | null } | null } | null };

export type DeleteLabelMutationVariables = Exact<{
  rowId: Scalars['UUID']['input'];
}>;


export type DeleteLabelMutation = { __typename?: 'Mutation', deleteLabel?: { __typename?: 'DeleteLabelPayload', label?: { __typename?: 'Label', rowId: string, name: string, color: string } | null } | null };

export type UpdateLabelMutationVariables = Exact<{
  rowId: Scalars['UUID']['input'];
  patch: LabelPatch;
}>;


export type UpdateLabelMutation = { __typename?: 'Mutation', updateLabel?: { __typename?: 'UpdateLabelPayload', label?: { __typename?: 'Label', rowId: string } | null } | null };

export type CreatePostMutationVariables = Exact<{
  input: CreatePostInput;
}>;


export type CreatePostMutation = { __typename?: 'Mutation', createPost?: { __typename?: 'CreatePostPayload', post?: { __typename?: 'Post', rowId: string } | null } | null };

export type DeletePostMutationVariables = Exact<{
  rowId: Scalars['UUID']['input'];
}>;


export type DeletePostMutation = { __typename?: 'Mutation', deletePost?: { __typename?: 'DeletePostPayload', post?: { __typename?: 'Post', rowId: string } | null } | null };

export type UpdatePostMutationVariables = Exact<{
  input: UpdatePostInput;
}>;


export type UpdatePostMutation = { __typename?: 'Mutation', updatePost?: { __typename?: 'UpdatePostPayload', post?: { __typename?: 'Post', rowId: string } | null } | null };

export type CreateProjectColumnMutationVariables = Exact<{
  input: CreateProjectColumnInput;
}>;


export type CreateProjectColumnMutation = { __typename?: 'Mutation', createProjectColumn?: { __typename?: 'CreateProjectColumnPayload', projectColumn?: { __typename?: 'ProjectColumn', title: string, index: number, rowId: string, icon?: string | null, projects: { __typename?: 'ProjectConnection', totalCount: number } } | null } | null };

export type DeleteProjectColumnMutationVariables = Exact<{
  rowId: Scalars['UUID']['input'];
}>;


export type DeleteProjectColumnMutation = { __typename?: 'Mutation', deleteProjectColumn?: { __typename?: 'DeleteProjectColumnPayload', clientMutationId?: string | null } | null };

export type UpdateProjectColumnMutationVariables = Exact<{
  rowId: Scalars['UUID']['input'];
  patch: ProjectColumnPatch;
}>;


export type UpdateProjectColumnMutation = { __typename?: 'Mutation', updateProjectColumn?: { __typename?: 'UpdateProjectColumnPayload', projectColumn?: { __typename?: 'ProjectColumn', rowId: string } | null } | null };

export type CreateProjectMutationVariables = Exact<{
  input: CreateProjectInput;
}>;


export type CreateProjectMutation = { __typename?: 'Mutation', createProject?: { __typename?: 'CreateProjectPayload', project?: { __typename?: 'Project', rowId: string, slug: string } | null } | null };

export type DeleteProjectMutationVariables = Exact<{
  rowId: Scalars['UUID']['input'];
}>;


export type DeleteProjectMutation = { __typename?: 'Mutation', deleteProject?: { __typename?: 'DeleteProjectPayload', clientMutationId?: string | null } | null };

export type UpdateProjectMutationVariables = Exact<{
  rowId: Scalars['UUID']['input'];
  patch: ProjectPatch;
}>;


export type UpdateProjectMutation = { __typename?: 'Mutation', updateProject?: { __typename?: 'UpdateProjectPayload', project?: { __typename?: 'Project', rowId: string } | null } | null };

export type UpdateSettingMutationVariables = Exact<{
  rowId: Scalars['UUID']['input'];
  patch: SettingPatch;
}>;


export type UpdateSettingMutation = { __typename?: 'Mutation', updateSetting?: { __typename?: 'UpdateSettingPayload', setting?: { __typename?: 'Setting', rowId: string, organizationId: string, viewMode: string } | null } | null };

export type CreateTaskLabelMutationVariables = Exact<{
  input: CreateTaskLabelInput;
}>;


export type CreateTaskLabelMutation = { __typename?: 'Mutation', createTaskLabel?: { __typename?: 'CreateTaskLabelPayload', taskLabel?: { __typename?: 'TaskLabel', taskId: string, labelId: string } | null } | null };

export type DeleteTaskLabelMutationVariables = Exact<{
  taskId: Scalars['UUID']['input'];
  labelId: Scalars['UUID']['input'];
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

export type CreateUserOrganizationMutationVariables = Exact<{
  input: CreateUserOrganizationInput;
}>;


export type CreateUserOrganizationMutation = { __typename?: 'Mutation', createUserOrganization?: { __typename?: 'CreateUserOrganizationPayload', userOrganization?: { __typename?: 'UserOrganization', rowId: string, organizationId: string, slug: string, name?: string | null, type: OrganizationType, role: MemberRole } | null } | null };

export type DeleteUserOrganizationMutationVariables = Exact<{
  rowId: Scalars['UUID']['input'];
}>;


export type DeleteUserOrganizationMutation = { __typename?: 'Mutation', deleteUserOrganization?: { __typename?: 'DeleteUserOrganizationPayload', clientMutationId?: string | null } | null };

export type UpdateUserOrganizationMutationVariables = Exact<{
  input: UpdateUserOrganizationInput;
}>;


export type UpdateUserOrganizationMutation = { __typename?: 'Mutation', updateUserOrganization?: { __typename?: 'UpdateUserOrganizationPayload', userOrganization?: { __typename?: 'UserOrganization', rowId: string, organizationId: string, slug: string, name?: string | null, type: OrganizationType, role: MemberRole } | null } | null };

export type CreateUserPreferenceMutationVariables = Exact<{
  input: CreateUserPreferenceInput;
}>;


export type CreateUserPreferenceMutation = { __typename?: 'Mutation', createUserPreference?: { __typename?: 'CreateUserPreferencePayload', userPreference?: { __typename?: 'UserPreference', rowId: string } | null } | null };

export type UpdateUserPreferenceMutationVariables = Exact<{
  rowId: Scalars['UUID']['input'];
  patch: UserPreferencePatch;
}>;


export type UpdateUserPreferenceMutation = { __typename?: 'Mutation', updateUserPreference?: { __typename?: 'UpdateUserPreferencePayload', userPreference?: { __typename?: 'UserPreference', rowId: string } | null } | null };

export type DeleteUserMutationVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type DeleteUserMutation = { __typename?: 'Mutation', deleteUser?: { __typename?: 'DeleteUserPayload', clientMutationId?: string | null } | null };

export type ColumnsQueryVariables = Exact<{
  projectId: Scalars['UUID']['input'];
}>;


export type ColumnsQuery = { __typename?: 'Query', columns?: { __typename?: 'ColumnConnection', nodes: Array<{ __typename?: 'Column', title: string, index: number, rowId: string, icon?: string | null, tasks: { __typename?: 'TaskConnection', totalCount: number } }> } | null };

export type PostEmojisQueryVariables = Exact<{
  postId: Scalars['UUID']['input'];
  userId: Scalars['UUID']['input'];
}>;


export type PostEmojisQuery = { __typename?: 'Query', emojis?: { __typename?: 'EmojiConnection', groupedAggregates?: Array<{ __typename?: 'EmojiAggregates', keys?: Array<string | null> | null, distinctCount?: { __typename?: 'EmojiDistinctCountAggregates', emoji?: string | null, rowId?: string | null } | null }> | null } | null, users?: { __typename?: 'UserConnection', nodes: Array<{ __typename?: 'User', emojis: { __typename?: 'EmojiConnection', nodes: Array<{ __typename?: 'Emoji', emoji?: string | null, rowId: string, postId: string }> } }> } | null };

export type UserEmojisQueryVariables = Exact<{
  postId: Scalars['UUID']['input'];
  userId: Scalars['UUID']['input'];
}>;


export type UserEmojisQuery = { __typename?: 'Query', emojis?: { __typename?: 'EmojiConnection', nodes: Array<{ __typename?: 'Emoji', emoji?: string | null }> } | null };

export type InvitationByTokenQueryVariables = Exact<{
  token: Scalars['String']['input'];
}>;


export type InvitationByTokenQuery = { __typename?: 'Query', invitations?: { __typename?: 'InvitationConnection', nodes: Array<{ __typename?: 'Invitation', rowId: string, organizationId: string, email?: string | null, role: MemberRole, token: string, status: InvitationStatus, expiresAt: Date, inviterUserId: string }> } | null };

export type LabelsQueryVariables = Exact<{
  projectId: Scalars['UUID']['input'];
}>;


export type LabelsQuery = { __typename?: 'Query', labels?: { __typename?: 'LabelConnection', nodes: Array<{ __typename?: 'Label', color: string, icon?: string | null, name: string, rowId: string }> } | null };

export type ProjectColumnsQueryVariables = Exact<{
  organizationId: Scalars['String']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
}>;


export type ProjectColumnsQuery = { __typename?: 'Query', projectColumns?: { __typename?: 'ProjectColumnConnection', nodes: Array<{ __typename?: 'ProjectColumn', title: string, index: number, rowId: string, icon?: string | null, projects: { __typename?: 'ProjectConnection', totalCount: number } }> } | null };

export type ProjectQueryVariables = Exact<{
  rowId: Scalars['UUID']['input'];
}>;


export type ProjectQuery = { __typename?: 'Query', project?: { __typename?: 'Project', rowId: string, name: string, slug: string, description?: string | null, prefix?: string | null, projectColumnId: string, nextTaskNumber: number, tasks: { __typename?: 'TaskConnection', totalCount: number }, columns: { __typename?: 'ColumnConnection', nodes: Array<{ __typename?: 'Column', rowId: string, index: number, title: string, icon?: string | null, tasks: { __typename?: 'TaskConnection', totalCount: number } }> } } | null };

export type ProjectBySlugQueryVariables = Exact<{
  slug: Scalars['String']['input'];
  organizationId: Scalars['String']['input'];
}>;


export type ProjectBySlugQuery = { __typename?: 'Query', projectBySlugAndOrganizationId?: { __typename?: 'Project', rowId: string, name: string } | null };

export type ProjectsQueryVariables = Exact<{
  organizationId: Scalars['String']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['UUID']['input']>;
}>;


export type ProjectsQuery = { __typename?: 'Query', projects?: { __typename?: 'ProjectConnection', nodes: Array<{ __typename?: 'Project', rowId: string, name: string, slug: string, description?: string | null, prefix?: string | null, projectColumnId: string, columnIndex: number, userPreferences: { __typename?: 'UserPreferenceConnection', nodes: Array<{ __typename?: 'UserPreference', rowId: string, color?: string | null, viewMode: string }> }, allTasks: { __typename?: 'TaskConnection', totalCount: number }, completedTasks: { __typename?: 'TaskConnection', totalCount: number } }> } | null };

export type ProjectsSidebarQueryVariables = Exact<{
  organizationId: Scalars['String']['input'];
  userId?: InputMaybe<Scalars['UUID']['input']>;
}>;


export type ProjectsSidebarQuery = { __typename?: 'Query', projects?: { __typename?: 'ProjectConnection', nodes: Array<{ __typename?: 'Project', rowId: string, name: string, slug: string, userPreferences: { __typename?: 'UserPreferenceConnection', nodes: Array<{ __typename?: 'UserPreference', rowId: string, color?: string | null, viewMode: string }> } }> } | null };

export type SettingByOrganizationIdQueryVariables = Exact<{
  organizationId: Scalars['String']['input'];
}>;


export type SettingByOrganizationIdQuery = { __typename?: 'Query', settingByOrganizationId?: { __typename?: 'Setting', rowId: string, organizationId: string, viewMode: string, subscriptionId?: string | null, billingAccountId?: string | null } | null };

export type TaskQueryVariables = Exact<{
  rowId: Scalars['UUID']['input'];
}>;


export type TaskQuery = { __typename?: 'Query', task?: { __typename?: 'Task', rowId: string, number?: number | null, projectId: string, columnId: string, columnIndex: number, content: string, description: string, priority: string, createdAt: Date, updatedAt: Date, dueDate?: Date | null, taskLabels: { __typename?: 'TaskLabelConnection', nodes: Array<{ __typename?: 'TaskLabel', taskId: string, labelId: string, label?: { __typename?: 'Label', color: string, icon?: string | null, name: string, rowId: string } | null }> }, posts: { __typename?: 'PostConnection', totalCount: number, nodes: Array<{ __typename?: 'Post', rowId: string, title?: string | null, description?: string | null, createdAt: Date, authorId?: string | null, author?: { __typename?: 'User', name: string, avatarUrl?: string | null, rowId: string, id: string } | null }> }, column?: { __typename?: 'Column', title: string, icon?: string | null } | null, author?: { __typename?: 'User', name: string, avatarUrl?: string | null, rowId: string } | null, assignees: { __typename?: 'AssigneeConnection', nodes: Array<{ __typename?: 'Assignee', taskId: string, userId: string, user?: { __typename?: 'User', rowId: string, identityProviderId: string, name: string, avatarUrl?: string | null } | null }> } } | null };

export type TasksQueryVariables = Exact<{
  projectId: Scalars['UUID']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
  assignees?: InputMaybe<TaskToManyAssigneeFilter>;
  labels?: InputMaybe<TaskToManyTaskLabelFilter>;
  priorities?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type TasksQuery = { __typename?: 'Query', tasks?: { __typename?: 'TaskConnection', nodes: Array<{ __typename?: 'Task', rowId: string, number?: number | null, columnId: string, columnIndex: number, content: string, description: string, priority: string, dueDate?: Date | null, taskLabels: { __typename?: 'TaskLabelConnection', nodes: Array<{ __typename?: 'TaskLabel', label?: { __typename?: 'Label', color: string, icon?: string | null, name: string, rowId: string } | null }> }, assignees: { __typename?: 'AssigneeConnection', nodes: Array<{ __typename?: 'Assignee', taskId: string, userId: string, user?: { __typename?: 'User', rowId: string, identityProviderId: string, name: string, avatarUrl?: string | null } | null }> }, posts: { __typename?: 'PostConnection', totalCount: number } }> } | null };

export type OrganizationMembersQueryVariables = Exact<{
  organizationId: Scalars['String']['input'];
}>;


export type OrganizationMembersQuery = { __typename?: 'Query', userOrganizations?: { __typename?: 'UserOrganizationConnection', nodes: Array<{ __typename?: 'UserOrganization', rowId: string, organizationId: string, slug: string, name?: string | null, role: MemberRole, createdAt: Date, user?: { __typename?: 'User', rowId: string, name: string, email: string, avatarUrl?: string | null, identityProviderId: string } | null }> } | null };

export type UserPreferencesQueryVariables = Exact<{
  userId: Scalars['UUID']['input'];
  projectId: Scalars['UUID']['input'];
}>;


export type UserPreferencesQuery = { __typename?: 'Query', userPreferenceByUserIdAndProjectId?: { __typename?: 'UserPreference', hiddenColumnIds: Array<string | null>, viewMode: string, rowId: string, color?: string | null } | null };

export type UserQueryVariables = Exact<{
  userId: Scalars['UUID']['input'];
}>;


export type UserQuery = { __typename?: 'Query', user?: { __typename?: 'User', rowId: string, name: string, email: string } | null };

export type UserByIdentityProviderIdQueryVariables = Exact<{
  identityProviderId: Scalars['UUID']['input'];
}>;


export type UserByIdentityProviderIdQuery = { __typename?: 'Query', userByIdentityProviderId?: { __typename?: 'User', rowId: string, userOrganizations: { __typename?: 'UserOrganizationConnection', nodes: Array<{ __typename?: 'UserOrganization', organizationId: string, slug: string, name?: string | null, type: OrganizationType, role: MemberRole }> } } | null };


export const ColumnFragmentDoc = `
    fragment Column on Column {
  title
  index
  rowId
  icon
  tasks {
    totalCount
  }
}
    `;
export const ProjectColumnFragmentDoc = `
    fragment ProjectColumn on ProjectColumn {
  title
  index
  rowId
  icon
  projects {
    totalCount
  }
}
    `;
export const ProjectFragmentDoc = `
    fragment Project on Project {
  rowId
  name
  slug
  description
  prefix
  projectColumnId
  columnIndex
  allTasks: tasks {
    totalCount
  }
  completedTasks: tasks(filter: {column: {title: {equalTo: "Done"}}}) {
    totalCount
  }
}
    `;
export const LabelFragmentDoc = `
    fragment Label on Label {
  color
  icon
  name
  rowId
}
    `;
export const TaskFragmentDoc = `
    fragment Task on Task {
  rowId
  number
  columnId
  columnIndex
  content
  description
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
      taskId
      userId
      user {
        rowId
        identityProviderId
        name
        avatarUrl
      }
    }
  }
  posts {
    totalCount
  }
}
    ${LabelFragmentDoc}`;
export const CreateAssigneeDocument = `
    mutation CreateAssignee($input: CreateAssigneeInput!) {
  createAssignee(input: $input) {
    assignee {
      taskId
      userId
    }
  }
}
    `;

export const useCreateAssigneeMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<CreateAssigneeMutation, TError, CreateAssigneeMutationVariables, TContext>) => {
    
    return useMutation<CreateAssigneeMutation, TError, CreateAssigneeMutationVariables, TContext>(
      {
    mutationKey: ['CreateAssignee'],
    mutationFn: (variables?: CreateAssigneeMutationVariables) => graphqlFetch<CreateAssigneeMutation, CreateAssigneeMutationVariables>(CreateAssigneeDocument, variables)(),
    ...options
  }
    )};

useCreateAssigneeMutation.getKey = () => ['CreateAssignee'];


useCreateAssigneeMutation.fetcher = (variables: CreateAssigneeMutationVariables, options?: RequestInit['headers']) => graphqlFetch<CreateAssigneeMutation, CreateAssigneeMutationVariables>(CreateAssigneeDocument, variables, options);

export const DeleteAssigneeDocument = `
    mutation DeleteAssignee($taskId: UUID!, $userId: UUID!) {
  deleteAssignee(input: {taskId: $taskId, userId: $userId}) {
    assignee {
      taskId
      userId
    }
  }
}
    `;

export const useDeleteAssigneeMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<DeleteAssigneeMutation, TError, DeleteAssigneeMutationVariables, TContext>) => {
    
    return useMutation<DeleteAssigneeMutation, TError, DeleteAssigneeMutationVariables, TContext>(
      {
    mutationKey: ['DeleteAssignee'],
    mutationFn: (variables?: DeleteAssigneeMutationVariables) => graphqlFetch<DeleteAssigneeMutation, DeleteAssigneeMutationVariables>(DeleteAssigneeDocument, variables)(),
    ...options
  }
    )};

useDeleteAssigneeMutation.getKey = () => ['DeleteAssignee'];


useDeleteAssigneeMutation.fetcher = (variables: DeleteAssigneeMutationVariables, options?: RequestInit['headers']) => graphqlFetch<DeleteAssigneeMutation, DeleteAssigneeMutationVariables>(DeleteAssigneeDocument, variables, options);

export const CreateColumnDocument = `
    mutation CreateColumn($input: CreateColumnInput!) {
  createColumn(input: $input) {
    column {
      ...Column
    }
  }
}
    ${ColumnFragmentDoc}`;

export const useCreateColumnMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<CreateColumnMutation, TError, CreateColumnMutationVariables, TContext>) => {
    
    return useMutation<CreateColumnMutation, TError, CreateColumnMutationVariables, TContext>(
      {
    mutationKey: ['CreateColumn'],
    mutationFn: (variables?: CreateColumnMutationVariables) => graphqlFetch<CreateColumnMutation, CreateColumnMutationVariables>(CreateColumnDocument, variables)(),
    ...options
  }
    )};

useCreateColumnMutation.getKey = () => ['CreateColumn'];


useCreateColumnMutation.fetcher = (variables: CreateColumnMutationVariables, options?: RequestInit['headers']) => graphqlFetch<CreateColumnMutation, CreateColumnMutationVariables>(CreateColumnDocument, variables, options);

export const DeleteColumnDocument = `
    mutation DeleteColumn($rowId: UUID!) {
  deleteColumn(input: {rowId: $rowId}) {
    clientMutationId
  }
}
    `;

export const useDeleteColumnMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<DeleteColumnMutation, TError, DeleteColumnMutationVariables, TContext>) => {
    
    return useMutation<DeleteColumnMutation, TError, DeleteColumnMutationVariables, TContext>(
      {
    mutationKey: ['DeleteColumn'],
    mutationFn: (variables?: DeleteColumnMutationVariables) => graphqlFetch<DeleteColumnMutation, DeleteColumnMutationVariables>(DeleteColumnDocument, variables)(),
    ...options
  }
    )};

useDeleteColumnMutation.getKey = () => ['DeleteColumn'];


useDeleteColumnMutation.fetcher = (variables: DeleteColumnMutationVariables, options?: RequestInit['headers']) => graphqlFetch<DeleteColumnMutation, DeleteColumnMutationVariables>(DeleteColumnDocument, variables, options);

export const UpdateColumnDocument = `
    mutation UpdateColumn($rowId: UUID!, $patch: ColumnPatch!) {
  updateColumn(input: {rowId: $rowId, patch: $patch}) {
    column {
      rowId
    }
  }
}
    `;

export const useUpdateColumnMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<UpdateColumnMutation, TError, UpdateColumnMutationVariables, TContext>) => {
    
    return useMutation<UpdateColumnMutation, TError, UpdateColumnMutationVariables, TContext>(
      {
    mutationKey: ['UpdateColumn'],
    mutationFn: (variables?: UpdateColumnMutationVariables) => graphqlFetch<UpdateColumnMutation, UpdateColumnMutationVariables>(UpdateColumnDocument, variables)(),
    ...options
  }
    )};

useUpdateColumnMutation.getKey = () => ['UpdateColumn'];


useUpdateColumnMutation.fetcher = (variables: UpdateColumnMutationVariables, options?: RequestInit['headers']) => graphqlFetch<UpdateColumnMutation, UpdateColumnMutationVariables>(UpdateColumnDocument, variables, options);

export const CreatePostEmojiDocument = `
    mutation CreatePostEmoji($input: CreateEmojiInput!) {
  createEmoji(input: $input) {
    emoji {
      rowId
    }
  }
}
    `;

export const useCreatePostEmojiMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<CreatePostEmojiMutation, TError, CreatePostEmojiMutationVariables, TContext>) => {
    
    return useMutation<CreatePostEmojiMutation, TError, CreatePostEmojiMutationVariables, TContext>(
      {
    mutationKey: ['CreatePostEmoji'],
    mutationFn: (variables?: CreatePostEmojiMutationVariables) => graphqlFetch<CreatePostEmojiMutation, CreatePostEmojiMutationVariables>(CreatePostEmojiDocument, variables)(),
    ...options
  }
    )};

useCreatePostEmojiMutation.getKey = () => ['CreatePostEmoji'];


useCreatePostEmojiMutation.fetcher = (variables: CreatePostEmojiMutationVariables, options?: RequestInit['headers']) => graphqlFetch<CreatePostEmojiMutation, CreatePostEmojiMutationVariables>(CreatePostEmojiDocument, variables, options);

export const DeletePostEmojiDocument = `
    mutation DeletePostEmoji($rowId: UUID!) {
  deleteEmoji(input: {rowId: $rowId}) {
    emoji {
      rowId
    }
  }
}
    `;

export const useDeletePostEmojiMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<DeletePostEmojiMutation, TError, DeletePostEmojiMutationVariables, TContext>) => {
    
    return useMutation<DeletePostEmojiMutation, TError, DeletePostEmojiMutationVariables, TContext>(
      {
    mutationKey: ['DeletePostEmoji'],
    mutationFn: (variables?: DeletePostEmojiMutationVariables) => graphqlFetch<DeletePostEmojiMutation, DeletePostEmojiMutationVariables>(DeletePostEmojiDocument, variables)(),
    ...options
  }
    )};

useDeletePostEmojiMutation.getKey = () => ['DeletePostEmoji'];


useDeletePostEmojiMutation.fetcher = (variables: DeletePostEmojiMutationVariables, options?: RequestInit['headers']) => graphqlFetch<DeletePostEmojiMutation, DeletePostEmojiMutationVariables>(DeletePostEmojiDocument, variables, options);

export const UpdatePostEmojiDocument = `
    mutation UpdatePostEmoji($input: UpdateEmojiInput!) {
  updateEmoji(input: $input) {
    emoji {
      rowId
    }
  }
}
    `;

export const useUpdatePostEmojiMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<UpdatePostEmojiMutation, TError, UpdatePostEmojiMutationVariables, TContext>) => {
    
    return useMutation<UpdatePostEmojiMutation, TError, UpdatePostEmojiMutationVariables, TContext>(
      {
    mutationKey: ['UpdatePostEmoji'],
    mutationFn: (variables?: UpdatePostEmojiMutationVariables) => graphqlFetch<UpdatePostEmojiMutation, UpdatePostEmojiMutationVariables>(UpdatePostEmojiDocument, variables)(),
    ...options
  }
    )};

useUpdatePostEmojiMutation.getKey = () => ['UpdatePostEmoji'];


useUpdatePostEmojiMutation.fetcher = (variables: UpdatePostEmojiMutationVariables, options?: RequestInit['headers']) => graphqlFetch<UpdatePostEmojiMutation, UpdatePostEmojiMutationVariables>(UpdatePostEmojiDocument, variables, options);

export const CreateInvitationDocument = `
    mutation CreateInvitation($input: CreateInvitationInput!) {
  createInvitation(input: $input) {
    invitation {
      rowId
      organizationId
      email
      role
      token
      status
      expiresAt
    }
  }
}
    `;

export const useCreateInvitationMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<CreateInvitationMutation, TError, CreateInvitationMutationVariables, TContext>) => {
    
    return useMutation<CreateInvitationMutation, TError, CreateInvitationMutationVariables, TContext>(
      {
    mutationKey: ['CreateInvitation'],
    mutationFn: (variables?: CreateInvitationMutationVariables) => graphqlFetch<CreateInvitationMutation, CreateInvitationMutationVariables>(CreateInvitationDocument, variables)(),
    ...options
  }
    )};

useCreateInvitationMutation.getKey = () => ['CreateInvitation'];


useCreateInvitationMutation.fetcher = (variables: CreateInvitationMutationVariables, options?: RequestInit['headers']) => graphqlFetch<CreateInvitationMutation, CreateInvitationMutationVariables>(CreateInvitationDocument, variables, options);

export const UpdateInvitationDocument = `
    mutation UpdateInvitation($input: UpdateInvitationInput!) {
  updateInvitation(input: $input) {
    invitation {
      rowId
      status
    }
  }
}
    `;

export const useUpdateInvitationMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<UpdateInvitationMutation, TError, UpdateInvitationMutationVariables, TContext>) => {
    
    return useMutation<UpdateInvitationMutation, TError, UpdateInvitationMutationVariables, TContext>(
      {
    mutationKey: ['UpdateInvitation'],
    mutationFn: (variables?: UpdateInvitationMutationVariables) => graphqlFetch<UpdateInvitationMutation, UpdateInvitationMutationVariables>(UpdateInvitationDocument, variables)(),
    ...options
  }
    )};

useUpdateInvitationMutation.getKey = () => ['UpdateInvitation'];


useUpdateInvitationMutation.fetcher = (variables: UpdateInvitationMutationVariables, options?: RequestInit['headers']) => graphqlFetch<UpdateInvitationMutation, UpdateInvitationMutationVariables>(UpdateInvitationDocument, variables, options);

export const CreateLabelDocument = `
    mutation CreateLabel($input: CreateLabelInput!) {
  createLabel(input: $input) {
    label {
      rowId
      name
      color
      icon
    }
  }
}
    `;

export const useCreateLabelMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<CreateLabelMutation, TError, CreateLabelMutationVariables, TContext>) => {
    
    return useMutation<CreateLabelMutation, TError, CreateLabelMutationVariables, TContext>(
      {
    mutationKey: ['CreateLabel'],
    mutationFn: (variables?: CreateLabelMutationVariables) => graphqlFetch<CreateLabelMutation, CreateLabelMutationVariables>(CreateLabelDocument, variables)(),
    ...options
  }
    )};

useCreateLabelMutation.getKey = () => ['CreateLabel'];


useCreateLabelMutation.fetcher = (variables: CreateLabelMutationVariables, options?: RequestInit['headers']) => graphqlFetch<CreateLabelMutation, CreateLabelMutationVariables>(CreateLabelDocument, variables, options);

export const DeleteLabelDocument = `
    mutation DeleteLabel($rowId: UUID!) {
  deleteLabel(input: {rowId: $rowId}) {
    label {
      rowId
      name
      color
    }
  }
}
    `;

export const useDeleteLabelMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<DeleteLabelMutation, TError, DeleteLabelMutationVariables, TContext>) => {
    
    return useMutation<DeleteLabelMutation, TError, DeleteLabelMutationVariables, TContext>(
      {
    mutationKey: ['DeleteLabel'],
    mutationFn: (variables?: DeleteLabelMutationVariables) => graphqlFetch<DeleteLabelMutation, DeleteLabelMutationVariables>(DeleteLabelDocument, variables)(),
    ...options
  }
    )};

useDeleteLabelMutation.getKey = () => ['DeleteLabel'];


useDeleteLabelMutation.fetcher = (variables: DeleteLabelMutationVariables, options?: RequestInit['headers']) => graphqlFetch<DeleteLabelMutation, DeleteLabelMutationVariables>(DeleteLabelDocument, variables, options);

export const UpdateLabelDocument = `
    mutation UpdateLabel($rowId: UUID!, $patch: LabelPatch!) {
  updateLabel(input: {rowId: $rowId, patch: $patch}) {
    label {
      rowId
    }
  }
}
    `;

export const useUpdateLabelMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<UpdateLabelMutation, TError, UpdateLabelMutationVariables, TContext>) => {
    
    return useMutation<UpdateLabelMutation, TError, UpdateLabelMutationVariables, TContext>(
      {
    mutationKey: ['UpdateLabel'],
    mutationFn: (variables?: UpdateLabelMutationVariables) => graphqlFetch<UpdateLabelMutation, UpdateLabelMutationVariables>(UpdateLabelDocument, variables)(),
    ...options
  }
    )};

useUpdateLabelMutation.getKey = () => ['UpdateLabel'];


useUpdateLabelMutation.fetcher = (variables: UpdateLabelMutationVariables, options?: RequestInit['headers']) => graphqlFetch<UpdateLabelMutation, UpdateLabelMutationVariables>(UpdateLabelDocument, variables, options);

export const CreatePostDocument = `
    mutation CreatePost($input: CreatePostInput!) {
  createPost(input: $input) {
    post {
      rowId
    }
  }
}
    `;

export const useCreatePostMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<CreatePostMutation, TError, CreatePostMutationVariables, TContext>) => {
    
    return useMutation<CreatePostMutation, TError, CreatePostMutationVariables, TContext>(
      {
    mutationKey: ['CreatePost'],
    mutationFn: (variables?: CreatePostMutationVariables) => graphqlFetch<CreatePostMutation, CreatePostMutationVariables>(CreatePostDocument, variables)(),
    ...options
  }
    )};

useCreatePostMutation.getKey = () => ['CreatePost'];


useCreatePostMutation.fetcher = (variables: CreatePostMutationVariables, options?: RequestInit['headers']) => graphqlFetch<CreatePostMutation, CreatePostMutationVariables>(CreatePostDocument, variables, options);

export const DeletePostDocument = `
    mutation DeletePost($rowId: UUID!) {
  deletePost(input: {rowId: $rowId}) {
    post {
      rowId
    }
  }
}
    `;

export const useDeletePostMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<DeletePostMutation, TError, DeletePostMutationVariables, TContext>) => {
    
    return useMutation<DeletePostMutation, TError, DeletePostMutationVariables, TContext>(
      {
    mutationKey: ['DeletePost'],
    mutationFn: (variables?: DeletePostMutationVariables) => graphqlFetch<DeletePostMutation, DeletePostMutationVariables>(DeletePostDocument, variables)(),
    ...options
  }
    )};

useDeletePostMutation.getKey = () => ['DeletePost'];


useDeletePostMutation.fetcher = (variables: DeletePostMutationVariables, options?: RequestInit['headers']) => graphqlFetch<DeletePostMutation, DeletePostMutationVariables>(DeletePostDocument, variables, options);

export const UpdatePostDocument = `
    mutation UpdatePost($input: UpdatePostInput!) {
  updatePost(input: $input) {
    post {
      rowId
    }
  }
}
    `;

export const useUpdatePostMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<UpdatePostMutation, TError, UpdatePostMutationVariables, TContext>) => {
    
    return useMutation<UpdatePostMutation, TError, UpdatePostMutationVariables, TContext>(
      {
    mutationKey: ['UpdatePost'],
    mutationFn: (variables?: UpdatePostMutationVariables) => graphqlFetch<UpdatePostMutation, UpdatePostMutationVariables>(UpdatePostDocument, variables)(),
    ...options
  }
    )};

useUpdatePostMutation.getKey = () => ['UpdatePost'];


useUpdatePostMutation.fetcher = (variables: UpdatePostMutationVariables, options?: RequestInit['headers']) => graphqlFetch<UpdatePostMutation, UpdatePostMutationVariables>(UpdatePostDocument, variables, options);

export const CreateProjectColumnDocument = `
    mutation CreateProjectColumn($input: CreateProjectColumnInput!) {
  createProjectColumn(input: $input) {
    projectColumn {
      ...ProjectColumn
    }
  }
}
    ${ProjectColumnFragmentDoc}`;

export const useCreateProjectColumnMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<CreateProjectColumnMutation, TError, CreateProjectColumnMutationVariables, TContext>) => {
    
    return useMutation<CreateProjectColumnMutation, TError, CreateProjectColumnMutationVariables, TContext>(
      {
    mutationKey: ['CreateProjectColumn'],
    mutationFn: (variables?: CreateProjectColumnMutationVariables) => graphqlFetch<CreateProjectColumnMutation, CreateProjectColumnMutationVariables>(CreateProjectColumnDocument, variables)(),
    ...options
  }
    )};

useCreateProjectColumnMutation.getKey = () => ['CreateProjectColumn'];


useCreateProjectColumnMutation.fetcher = (variables: CreateProjectColumnMutationVariables, options?: RequestInit['headers']) => graphqlFetch<CreateProjectColumnMutation, CreateProjectColumnMutationVariables>(CreateProjectColumnDocument, variables, options);

export const DeleteProjectColumnDocument = `
    mutation DeleteProjectColumn($rowId: UUID!) {
  deleteProjectColumn(input: {rowId: $rowId}) {
    clientMutationId
  }
}
    `;

export const useDeleteProjectColumnMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<DeleteProjectColumnMutation, TError, DeleteProjectColumnMutationVariables, TContext>) => {
    
    return useMutation<DeleteProjectColumnMutation, TError, DeleteProjectColumnMutationVariables, TContext>(
      {
    mutationKey: ['DeleteProjectColumn'],
    mutationFn: (variables?: DeleteProjectColumnMutationVariables) => graphqlFetch<DeleteProjectColumnMutation, DeleteProjectColumnMutationVariables>(DeleteProjectColumnDocument, variables)(),
    ...options
  }
    )};

useDeleteProjectColumnMutation.getKey = () => ['DeleteProjectColumn'];


useDeleteProjectColumnMutation.fetcher = (variables: DeleteProjectColumnMutationVariables, options?: RequestInit['headers']) => graphqlFetch<DeleteProjectColumnMutation, DeleteProjectColumnMutationVariables>(DeleteProjectColumnDocument, variables, options);

export const UpdateProjectColumnDocument = `
    mutation UpdateProjectColumn($rowId: UUID!, $patch: ProjectColumnPatch!) {
  updateProjectColumn(input: {rowId: $rowId, patch: $patch}) {
    projectColumn {
      rowId
    }
  }
}
    `;

export const useUpdateProjectColumnMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<UpdateProjectColumnMutation, TError, UpdateProjectColumnMutationVariables, TContext>) => {
    
    return useMutation<UpdateProjectColumnMutation, TError, UpdateProjectColumnMutationVariables, TContext>(
      {
    mutationKey: ['UpdateProjectColumn'],
    mutationFn: (variables?: UpdateProjectColumnMutationVariables) => graphqlFetch<UpdateProjectColumnMutation, UpdateProjectColumnMutationVariables>(UpdateProjectColumnDocument, variables)(),
    ...options
  }
    )};

useUpdateProjectColumnMutation.getKey = () => ['UpdateProjectColumn'];


useUpdateProjectColumnMutation.fetcher = (variables: UpdateProjectColumnMutationVariables, options?: RequestInit['headers']) => graphqlFetch<UpdateProjectColumnMutation, UpdateProjectColumnMutationVariables>(UpdateProjectColumnDocument, variables, options);

export const CreateProjectDocument = `
    mutation CreateProject($input: CreateProjectInput!) {
  createProject(input: $input) {
    project {
      rowId
      slug
    }
  }
}
    `;

export const useCreateProjectMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<CreateProjectMutation, TError, CreateProjectMutationVariables, TContext>) => {
    
    return useMutation<CreateProjectMutation, TError, CreateProjectMutationVariables, TContext>(
      {
    mutationKey: ['CreateProject'],
    mutationFn: (variables?: CreateProjectMutationVariables) => graphqlFetch<CreateProjectMutation, CreateProjectMutationVariables>(CreateProjectDocument, variables)(),
    ...options
  }
    )};

useCreateProjectMutation.getKey = () => ['CreateProject'];


useCreateProjectMutation.fetcher = (variables: CreateProjectMutationVariables, options?: RequestInit['headers']) => graphqlFetch<CreateProjectMutation, CreateProjectMutationVariables>(CreateProjectDocument, variables, options);

export const DeleteProjectDocument = `
    mutation DeleteProject($rowId: UUID!) {
  deleteProject(input: {rowId: $rowId}) {
    clientMutationId
  }
}
    `;

export const useDeleteProjectMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<DeleteProjectMutation, TError, DeleteProjectMutationVariables, TContext>) => {
    
    return useMutation<DeleteProjectMutation, TError, DeleteProjectMutationVariables, TContext>(
      {
    mutationKey: ['DeleteProject'],
    mutationFn: (variables?: DeleteProjectMutationVariables) => graphqlFetch<DeleteProjectMutation, DeleteProjectMutationVariables>(DeleteProjectDocument, variables)(),
    ...options
  }
    )};

useDeleteProjectMutation.getKey = () => ['DeleteProject'];


useDeleteProjectMutation.fetcher = (variables: DeleteProjectMutationVariables, options?: RequestInit['headers']) => graphqlFetch<DeleteProjectMutation, DeleteProjectMutationVariables>(DeleteProjectDocument, variables, options);

export const UpdateProjectDocument = `
    mutation UpdateProject($rowId: UUID!, $patch: ProjectPatch!) {
  updateProject(input: {rowId: $rowId, patch: $patch}) {
    project {
      rowId
    }
  }
}
    `;

export const useUpdateProjectMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<UpdateProjectMutation, TError, UpdateProjectMutationVariables, TContext>) => {
    
    return useMutation<UpdateProjectMutation, TError, UpdateProjectMutationVariables, TContext>(
      {
    mutationKey: ['UpdateProject'],
    mutationFn: (variables?: UpdateProjectMutationVariables) => graphqlFetch<UpdateProjectMutation, UpdateProjectMutationVariables>(UpdateProjectDocument, variables)(),
    ...options
  }
    )};

useUpdateProjectMutation.getKey = () => ['UpdateProject'];


useUpdateProjectMutation.fetcher = (variables: UpdateProjectMutationVariables, options?: RequestInit['headers']) => graphqlFetch<UpdateProjectMutation, UpdateProjectMutationVariables>(UpdateProjectDocument, variables, options);

export const UpdateSettingDocument = `
    mutation UpdateSetting($rowId: UUID!, $patch: SettingPatch!) {
  updateSetting(input: {rowId: $rowId, patch: $patch}) {
    setting {
      rowId
      organizationId
      viewMode
    }
  }
}
    `;

export const useUpdateSettingMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<UpdateSettingMutation, TError, UpdateSettingMutationVariables, TContext>) => {
    
    return useMutation<UpdateSettingMutation, TError, UpdateSettingMutationVariables, TContext>(
      {
    mutationKey: ['UpdateSetting'],
    mutationFn: (variables?: UpdateSettingMutationVariables) => graphqlFetch<UpdateSettingMutation, UpdateSettingMutationVariables>(UpdateSettingDocument, variables)(),
    ...options
  }
    )};

useUpdateSettingMutation.getKey = () => ['UpdateSetting'];


useUpdateSettingMutation.fetcher = (variables: UpdateSettingMutationVariables, options?: RequestInit['headers']) => graphqlFetch<UpdateSettingMutation, UpdateSettingMutationVariables>(UpdateSettingDocument, variables, options);

export const CreateTaskLabelDocument = `
    mutation CreateTaskLabel($input: CreateTaskLabelInput!) {
  createTaskLabel(input: $input) {
    taskLabel {
      taskId
      labelId
    }
  }
}
    `;

export const useCreateTaskLabelMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<CreateTaskLabelMutation, TError, CreateTaskLabelMutationVariables, TContext>) => {
    
    return useMutation<CreateTaskLabelMutation, TError, CreateTaskLabelMutationVariables, TContext>(
      {
    mutationKey: ['CreateTaskLabel'],
    mutationFn: (variables?: CreateTaskLabelMutationVariables) => graphqlFetch<CreateTaskLabelMutation, CreateTaskLabelMutationVariables>(CreateTaskLabelDocument, variables)(),
    ...options
  }
    )};

useCreateTaskLabelMutation.getKey = () => ['CreateTaskLabel'];


useCreateTaskLabelMutation.fetcher = (variables: CreateTaskLabelMutationVariables, options?: RequestInit['headers']) => graphqlFetch<CreateTaskLabelMutation, CreateTaskLabelMutationVariables>(CreateTaskLabelDocument, variables, options);

export const DeleteTaskLabelDocument = `
    mutation DeleteTaskLabel($taskId: UUID!, $labelId: UUID!) {
  deleteTaskLabel(input: {taskId: $taskId, labelId: $labelId}) {
    clientMutationId
  }
}
    `;

export const useDeleteTaskLabelMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<DeleteTaskLabelMutation, TError, DeleteTaskLabelMutationVariables, TContext>) => {
    
    return useMutation<DeleteTaskLabelMutation, TError, DeleteTaskLabelMutationVariables, TContext>(
      {
    mutationKey: ['DeleteTaskLabel'],
    mutationFn: (variables?: DeleteTaskLabelMutationVariables) => graphqlFetch<DeleteTaskLabelMutation, DeleteTaskLabelMutationVariables>(DeleteTaskLabelDocument, variables)(),
    ...options
  }
    )};

useDeleteTaskLabelMutation.getKey = () => ['DeleteTaskLabel'];


useDeleteTaskLabelMutation.fetcher = (variables: DeleteTaskLabelMutationVariables, options?: RequestInit['headers']) => graphqlFetch<DeleteTaskLabelMutation, DeleteTaskLabelMutationVariables>(DeleteTaskLabelDocument, variables, options);

export const CreateTaskDocument = `
    mutation CreateTask($input: CreateTaskInput!) {
  createTask(input: $input) {
    task {
      rowId
    }
  }
}
    `;

export const useCreateTaskMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<CreateTaskMutation, TError, CreateTaskMutationVariables, TContext>) => {
    
    return useMutation<CreateTaskMutation, TError, CreateTaskMutationVariables, TContext>(
      {
    mutationKey: ['CreateTask'],
    mutationFn: (variables?: CreateTaskMutationVariables) => graphqlFetch<CreateTaskMutation, CreateTaskMutationVariables>(CreateTaskDocument, variables)(),
    ...options
  }
    )};

useCreateTaskMutation.getKey = () => ['CreateTask'];


useCreateTaskMutation.fetcher = (variables: CreateTaskMutationVariables, options?: RequestInit['headers']) => graphqlFetch<CreateTaskMutation, CreateTaskMutationVariables>(CreateTaskDocument, variables, options);

export const DeleteTaskDocument = `
    mutation DeleteTask($rowId: UUID!) {
  deleteTask(input: {rowId: $rowId}) {
    task {
      rowId
    }
  }
}
    `;

export const useDeleteTaskMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<DeleteTaskMutation, TError, DeleteTaskMutationVariables, TContext>) => {
    
    return useMutation<DeleteTaskMutation, TError, DeleteTaskMutationVariables, TContext>(
      {
    mutationKey: ['DeleteTask'],
    mutationFn: (variables?: DeleteTaskMutationVariables) => graphqlFetch<DeleteTaskMutation, DeleteTaskMutationVariables>(DeleteTaskDocument, variables)(),
    ...options
  }
    )};

useDeleteTaskMutation.getKey = () => ['DeleteTask'];


useDeleteTaskMutation.fetcher = (variables: DeleteTaskMutationVariables, options?: RequestInit['headers']) => graphqlFetch<DeleteTaskMutation, DeleteTaskMutationVariables>(DeleteTaskDocument, variables, options);

export const UpdateTaskDocument = `
    mutation UpdateTask($rowId: UUID!, $patch: TaskPatch!) {
  updateTask(input: {rowId: $rowId, patch: $patch}) {
    task {
      rowId
    }
  }
}
    `;

export const useUpdateTaskMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<UpdateTaskMutation, TError, UpdateTaskMutationVariables, TContext>) => {
    
    return useMutation<UpdateTaskMutation, TError, UpdateTaskMutationVariables, TContext>(
      {
    mutationKey: ['UpdateTask'],
    mutationFn: (variables?: UpdateTaskMutationVariables) => graphqlFetch<UpdateTaskMutation, UpdateTaskMutationVariables>(UpdateTaskDocument, variables)(),
    ...options
  }
    )};

useUpdateTaskMutation.getKey = () => ['UpdateTask'];


useUpdateTaskMutation.fetcher = (variables: UpdateTaskMutationVariables, options?: RequestInit['headers']) => graphqlFetch<UpdateTaskMutation, UpdateTaskMutationVariables>(UpdateTaskDocument, variables, options);

export const CreateUserOrganizationDocument = `
    mutation CreateUserOrganization($input: CreateUserOrganizationInput!) {
  createUserOrganization(input: $input) {
    userOrganization {
      rowId
      organizationId
      slug
      name
      type
      role
    }
  }
}
    `;

export const useCreateUserOrganizationMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<CreateUserOrganizationMutation, TError, CreateUserOrganizationMutationVariables, TContext>) => {
    
    return useMutation<CreateUserOrganizationMutation, TError, CreateUserOrganizationMutationVariables, TContext>(
      {
    mutationKey: ['CreateUserOrganization'],
    mutationFn: (variables?: CreateUserOrganizationMutationVariables) => graphqlFetch<CreateUserOrganizationMutation, CreateUserOrganizationMutationVariables>(CreateUserOrganizationDocument, variables)(),
    ...options
  }
    )};

useCreateUserOrganizationMutation.getKey = () => ['CreateUserOrganization'];


useCreateUserOrganizationMutation.fetcher = (variables: CreateUserOrganizationMutationVariables, options?: RequestInit['headers']) => graphqlFetch<CreateUserOrganizationMutation, CreateUserOrganizationMutationVariables>(CreateUserOrganizationDocument, variables, options);

export const DeleteUserOrganizationDocument = `
    mutation DeleteUserOrganization($rowId: UUID!) {
  deleteUserOrganization(input: {rowId: $rowId}) {
    clientMutationId
  }
}
    `;

export const useDeleteUserOrganizationMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<DeleteUserOrganizationMutation, TError, DeleteUserOrganizationMutationVariables, TContext>) => {
    
    return useMutation<DeleteUserOrganizationMutation, TError, DeleteUserOrganizationMutationVariables, TContext>(
      {
    mutationKey: ['DeleteUserOrganization'],
    mutationFn: (variables?: DeleteUserOrganizationMutationVariables) => graphqlFetch<DeleteUserOrganizationMutation, DeleteUserOrganizationMutationVariables>(DeleteUserOrganizationDocument, variables)(),
    ...options
  }
    )};

useDeleteUserOrganizationMutation.getKey = () => ['DeleteUserOrganization'];


useDeleteUserOrganizationMutation.fetcher = (variables: DeleteUserOrganizationMutationVariables, options?: RequestInit['headers']) => graphqlFetch<DeleteUserOrganizationMutation, DeleteUserOrganizationMutationVariables>(DeleteUserOrganizationDocument, variables, options);

export const UpdateUserOrganizationDocument = `
    mutation UpdateUserOrganization($input: UpdateUserOrganizationInput!) {
  updateUserOrganization(input: $input) {
    userOrganization {
      rowId
      organizationId
      slug
      name
      type
      role
    }
  }
}
    `;

export const useUpdateUserOrganizationMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<UpdateUserOrganizationMutation, TError, UpdateUserOrganizationMutationVariables, TContext>) => {
    
    return useMutation<UpdateUserOrganizationMutation, TError, UpdateUserOrganizationMutationVariables, TContext>(
      {
    mutationKey: ['UpdateUserOrganization'],
    mutationFn: (variables?: UpdateUserOrganizationMutationVariables) => graphqlFetch<UpdateUserOrganizationMutation, UpdateUserOrganizationMutationVariables>(UpdateUserOrganizationDocument, variables)(),
    ...options
  }
    )};

useUpdateUserOrganizationMutation.getKey = () => ['UpdateUserOrganization'];


useUpdateUserOrganizationMutation.fetcher = (variables: UpdateUserOrganizationMutationVariables, options?: RequestInit['headers']) => graphqlFetch<UpdateUserOrganizationMutation, UpdateUserOrganizationMutationVariables>(UpdateUserOrganizationDocument, variables, options);

export const CreateUserPreferenceDocument = `
    mutation CreateUserPreference($input: CreateUserPreferenceInput!) {
  createUserPreference(input: $input) {
    userPreference {
      rowId
    }
  }
}
    `;

export const useCreateUserPreferenceMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<CreateUserPreferenceMutation, TError, CreateUserPreferenceMutationVariables, TContext>) => {
    
    return useMutation<CreateUserPreferenceMutation, TError, CreateUserPreferenceMutationVariables, TContext>(
      {
    mutationKey: ['CreateUserPreference'],
    mutationFn: (variables?: CreateUserPreferenceMutationVariables) => graphqlFetch<CreateUserPreferenceMutation, CreateUserPreferenceMutationVariables>(CreateUserPreferenceDocument, variables)(),
    ...options
  }
    )};

useCreateUserPreferenceMutation.getKey = () => ['CreateUserPreference'];


useCreateUserPreferenceMutation.fetcher = (variables: CreateUserPreferenceMutationVariables, options?: RequestInit['headers']) => graphqlFetch<CreateUserPreferenceMutation, CreateUserPreferenceMutationVariables>(CreateUserPreferenceDocument, variables, options);

export const UpdateUserPreferenceDocument = `
    mutation UpdateUserPreference($rowId: UUID!, $patch: UserPreferencePatch!) {
  updateUserPreference(input: {rowId: $rowId, patch: $patch}) {
    userPreference {
      rowId
    }
  }
}
    `;

export const useUpdateUserPreferenceMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<UpdateUserPreferenceMutation, TError, UpdateUserPreferenceMutationVariables, TContext>) => {
    
    return useMutation<UpdateUserPreferenceMutation, TError, UpdateUserPreferenceMutationVariables, TContext>(
      {
    mutationKey: ['UpdateUserPreference'],
    mutationFn: (variables?: UpdateUserPreferenceMutationVariables) => graphqlFetch<UpdateUserPreferenceMutation, UpdateUserPreferenceMutationVariables>(UpdateUserPreferenceDocument, variables)(),
    ...options
  }
    )};

useUpdateUserPreferenceMutation.getKey = () => ['UpdateUserPreference'];


useUpdateUserPreferenceMutation.fetcher = (variables: UpdateUserPreferenceMutationVariables, options?: RequestInit['headers']) => graphqlFetch<UpdateUserPreferenceMutation, UpdateUserPreferenceMutationVariables>(UpdateUserPreferenceDocument, variables, options);

export const DeleteUserDocument = `
    mutation DeleteUser($id: UUID!) {
  deleteUser(input: {rowId: $id}) {
    clientMutationId
  }
}
    `;

export const useDeleteUserMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<DeleteUserMutation, TError, DeleteUserMutationVariables, TContext>) => {
    
    return useMutation<DeleteUserMutation, TError, DeleteUserMutationVariables, TContext>(
      {
    mutationKey: ['DeleteUser'],
    mutationFn: (variables?: DeleteUserMutationVariables) => graphqlFetch<DeleteUserMutation, DeleteUserMutationVariables>(DeleteUserDocument, variables)(),
    ...options
  }
    )};

useDeleteUserMutation.getKey = () => ['DeleteUser'];


useDeleteUserMutation.fetcher = (variables: DeleteUserMutationVariables, options?: RequestInit['headers']) => graphqlFetch<DeleteUserMutation, DeleteUserMutationVariables>(DeleteUserDocument, variables, options);

export const ColumnsDocument = `
    query Columns($projectId: UUID!) {
  columns(condition: {projectId: $projectId}, orderBy: INDEX_ASC) {
    nodes {
      ...Column
    }
  }
}
    ${ColumnFragmentDoc}`;

export const useColumnsQuery = <
      TData = ColumnsQuery,
      TError = unknown
    >(
      variables: ColumnsQueryVariables,
      options?: Omit<UseQueryOptions<ColumnsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<ColumnsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<ColumnsQuery, TError, TData>(
      {
    queryKey: ['Columns', variables],
    queryFn: graphqlFetch<ColumnsQuery, ColumnsQueryVariables>(ColumnsDocument, variables),
    ...options
  }
    )};

useColumnsQuery.getKey = (variables: ColumnsQueryVariables) => ['Columns', variables];

export const useSuspenseColumnsQuery = <
      TData = ColumnsQuery,
      TError = unknown
    >(
      variables: ColumnsQueryVariables,
      options?: Omit<UseSuspenseQueryOptions<ColumnsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseSuspenseQueryOptions<ColumnsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useSuspenseQuery<ColumnsQuery, TError, TData>(
      {
    queryKey: ['ColumnsSuspense', variables],
    queryFn: graphqlFetch<ColumnsQuery, ColumnsQueryVariables>(ColumnsDocument, variables),
    ...options
  }
    )};

useSuspenseColumnsQuery.getKey = (variables: ColumnsQueryVariables) => ['ColumnsSuspense', variables];

export const useInfiniteColumnsQuery = <
      TData = InfiniteData<ColumnsQuery>,
      TError = unknown
    >(
      variables: ColumnsQueryVariables,
      options: Omit<UseInfiniteQueryOptions<ColumnsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseInfiniteQueryOptions<ColumnsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useInfiniteQuery<ColumnsQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? ['Columns.infinite', variables],
      queryFn: (metaData) => graphqlFetch<ColumnsQuery, ColumnsQueryVariables>(ColumnsDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      ...restOptions
    }
  })()
    )};

useInfiniteColumnsQuery.getKey = (variables: ColumnsQueryVariables) => ['Columns.infinite', variables];

export const useSuspenseInfiniteColumnsQuery = <
      TData = InfiniteData<ColumnsQuery>,
      TError = unknown
    >(
      variables: ColumnsQueryVariables,
      options: Omit<UseSuspenseInfiniteQueryOptions<ColumnsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseSuspenseInfiniteQueryOptions<ColumnsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useSuspenseInfiniteQuery<ColumnsQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? ['Columns.infiniteSuspense', variables],
      queryFn: (metaData) => graphqlFetch<ColumnsQuery, ColumnsQueryVariables>(ColumnsDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      ...restOptions
    }
  })()
    )};

useSuspenseInfiniteColumnsQuery.getKey = (variables: ColumnsQueryVariables) => ['Columns.infiniteSuspense', variables];


useColumnsQuery.fetcher = (variables: ColumnsQueryVariables, options?: RequestInit['headers']) => graphqlFetch<ColumnsQuery, ColumnsQueryVariables>(ColumnsDocument, variables, options);

export const PostEmojisDocument = `
    query PostEmojis($postId: UUID!, $userId: UUID!) {
  emojis(condition: {postId: $postId}, orderBy: CREATED_AT_ASC) {
    groupedAggregates(groupBy: EMOJI) {
      distinctCount {
        emoji
        rowId
      }
      keys
    }
  }
  users(condition: {rowId: $userId}) {
    nodes {
      emojis(condition: {postId: $postId}) {
        nodes {
          emoji
          rowId
          postId
        }
      }
    }
  }
}
    `;

export const usePostEmojisQuery = <
      TData = PostEmojisQuery,
      TError = unknown
    >(
      variables: PostEmojisQueryVariables,
      options?: Omit<UseQueryOptions<PostEmojisQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<PostEmojisQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<PostEmojisQuery, TError, TData>(
      {
    queryKey: ['PostEmojis', variables],
    queryFn: graphqlFetch<PostEmojisQuery, PostEmojisQueryVariables>(PostEmojisDocument, variables),
    ...options
  }
    )};

usePostEmojisQuery.getKey = (variables: PostEmojisQueryVariables) => ['PostEmojis', variables];

export const useSuspensePostEmojisQuery = <
      TData = PostEmojisQuery,
      TError = unknown
    >(
      variables: PostEmojisQueryVariables,
      options?: Omit<UseSuspenseQueryOptions<PostEmojisQuery, TError, TData>, 'queryKey'> & { queryKey?: UseSuspenseQueryOptions<PostEmojisQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useSuspenseQuery<PostEmojisQuery, TError, TData>(
      {
    queryKey: ['PostEmojisSuspense', variables],
    queryFn: graphqlFetch<PostEmojisQuery, PostEmojisQueryVariables>(PostEmojisDocument, variables),
    ...options
  }
    )};

useSuspensePostEmojisQuery.getKey = (variables: PostEmojisQueryVariables) => ['PostEmojisSuspense', variables];

export const useInfinitePostEmojisQuery = <
      TData = InfiniteData<PostEmojisQuery>,
      TError = unknown
    >(
      variables: PostEmojisQueryVariables,
      options: Omit<UseInfiniteQueryOptions<PostEmojisQuery, TError, TData>, 'queryKey'> & { queryKey?: UseInfiniteQueryOptions<PostEmojisQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useInfiniteQuery<PostEmojisQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? ['PostEmojis.infinite', variables],
      queryFn: (metaData) => graphqlFetch<PostEmojisQuery, PostEmojisQueryVariables>(PostEmojisDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      ...restOptions
    }
  })()
    )};

useInfinitePostEmojisQuery.getKey = (variables: PostEmojisQueryVariables) => ['PostEmojis.infinite', variables];

export const useSuspenseInfinitePostEmojisQuery = <
      TData = InfiniteData<PostEmojisQuery>,
      TError = unknown
    >(
      variables: PostEmojisQueryVariables,
      options: Omit<UseSuspenseInfiniteQueryOptions<PostEmojisQuery, TError, TData>, 'queryKey'> & { queryKey?: UseSuspenseInfiniteQueryOptions<PostEmojisQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useSuspenseInfiniteQuery<PostEmojisQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? ['PostEmojis.infiniteSuspense', variables],
      queryFn: (metaData) => graphqlFetch<PostEmojisQuery, PostEmojisQueryVariables>(PostEmojisDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      ...restOptions
    }
  })()
    )};

useSuspenseInfinitePostEmojisQuery.getKey = (variables: PostEmojisQueryVariables) => ['PostEmojis.infiniteSuspense', variables];


usePostEmojisQuery.fetcher = (variables: PostEmojisQueryVariables, options?: RequestInit['headers']) => graphqlFetch<PostEmojisQuery, PostEmojisQueryVariables>(PostEmojisDocument, variables, options);

export const UserEmojisDocument = `
    query UserEmojis($postId: UUID!, $userId: UUID!) {
  emojis(condition: {userId: $userId, postId: $postId}) {
    nodes {
      emoji
    }
  }
}
    `;

export const useUserEmojisQuery = <
      TData = UserEmojisQuery,
      TError = unknown
    >(
      variables: UserEmojisQueryVariables,
      options?: Omit<UseQueryOptions<UserEmojisQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<UserEmojisQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<UserEmojisQuery, TError, TData>(
      {
    queryKey: ['UserEmojis', variables],
    queryFn: graphqlFetch<UserEmojisQuery, UserEmojisQueryVariables>(UserEmojisDocument, variables),
    ...options
  }
    )};

useUserEmojisQuery.getKey = (variables: UserEmojisQueryVariables) => ['UserEmojis', variables];

export const useSuspenseUserEmojisQuery = <
      TData = UserEmojisQuery,
      TError = unknown
    >(
      variables: UserEmojisQueryVariables,
      options?: Omit<UseSuspenseQueryOptions<UserEmojisQuery, TError, TData>, 'queryKey'> & { queryKey?: UseSuspenseQueryOptions<UserEmojisQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useSuspenseQuery<UserEmojisQuery, TError, TData>(
      {
    queryKey: ['UserEmojisSuspense', variables],
    queryFn: graphqlFetch<UserEmojisQuery, UserEmojisQueryVariables>(UserEmojisDocument, variables),
    ...options
  }
    )};

useSuspenseUserEmojisQuery.getKey = (variables: UserEmojisQueryVariables) => ['UserEmojisSuspense', variables];

export const useInfiniteUserEmojisQuery = <
      TData = InfiniteData<UserEmojisQuery>,
      TError = unknown
    >(
      variables: UserEmojisQueryVariables,
      options: Omit<UseInfiniteQueryOptions<UserEmojisQuery, TError, TData>, 'queryKey'> & { queryKey?: UseInfiniteQueryOptions<UserEmojisQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useInfiniteQuery<UserEmojisQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? ['UserEmojis.infinite', variables],
      queryFn: (metaData) => graphqlFetch<UserEmojisQuery, UserEmojisQueryVariables>(UserEmojisDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      ...restOptions
    }
  })()
    )};

useInfiniteUserEmojisQuery.getKey = (variables: UserEmojisQueryVariables) => ['UserEmojis.infinite', variables];

export const useSuspenseInfiniteUserEmojisQuery = <
      TData = InfiniteData<UserEmojisQuery>,
      TError = unknown
    >(
      variables: UserEmojisQueryVariables,
      options: Omit<UseSuspenseInfiniteQueryOptions<UserEmojisQuery, TError, TData>, 'queryKey'> & { queryKey?: UseSuspenseInfiniteQueryOptions<UserEmojisQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useSuspenseInfiniteQuery<UserEmojisQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? ['UserEmojis.infiniteSuspense', variables],
      queryFn: (metaData) => graphqlFetch<UserEmojisQuery, UserEmojisQueryVariables>(UserEmojisDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      ...restOptions
    }
  })()
    )};

useSuspenseInfiniteUserEmojisQuery.getKey = (variables: UserEmojisQueryVariables) => ['UserEmojis.infiniteSuspense', variables];


useUserEmojisQuery.fetcher = (variables: UserEmojisQueryVariables, options?: RequestInit['headers']) => graphqlFetch<UserEmojisQuery, UserEmojisQueryVariables>(UserEmojisDocument, variables, options);

export const InvitationByTokenDocument = `
    query InvitationByToken($token: String!) {
  invitations(condition: {token: $token}, first: 1) {
    nodes {
      rowId
      organizationId
      email
      role
      token
      status
      expiresAt
      inviterUserId
    }
  }
}
    `;

export const useInvitationByTokenQuery = <
      TData = InvitationByTokenQuery,
      TError = unknown
    >(
      variables: InvitationByTokenQueryVariables,
      options?: Omit<UseQueryOptions<InvitationByTokenQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<InvitationByTokenQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<InvitationByTokenQuery, TError, TData>(
      {
    queryKey: ['InvitationByToken', variables],
    queryFn: graphqlFetch<InvitationByTokenQuery, InvitationByTokenQueryVariables>(InvitationByTokenDocument, variables),
    ...options
  }
    )};

useInvitationByTokenQuery.getKey = (variables: InvitationByTokenQueryVariables) => ['InvitationByToken', variables];

export const useSuspenseInvitationByTokenQuery = <
      TData = InvitationByTokenQuery,
      TError = unknown
    >(
      variables: InvitationByTokenQueryVariables,
      options?: Omit<UseSuspenseQueryOptions<InvitationByTokenQuery, TError, TData>, 'queryKey'> & { queryKey?: UseSuspenseQueryOptions<InvitationByTokenQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useSuspenseQuery<InvitationByTokenQuery, TError, TData>(
      {
    queryKey: ['InvitationByTokenSuspense', variables],
    queryFn: graphqlFetch<InvitationByTokenQuery, InvitationByTokenQueryVariables>(InvitationByTokenDocument, variables),
    ...options
  }
    )};

useSuspenseInvitationByTokenQuery.getKey = (variables: InvitationByTokenQueryVariables) => ['InvitationByTokenSuspense', variables];

export const useInfiniteInvitationByTokenQuery = <
      TData = InfiniteData<InvitationByTokenQuery>,
      TError = unknown
    >(
      variables: InvitationByTokenQueryVariables,
      options: Omit<UseInfiniteQueryOptions<InvitationByTokenQuery, TError, TData>, 'queryKey'> & { queryKey?: UseInfiniteQueryOptions<InvitationByTokenQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useInfiniteQuery<InvitationByTokenQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? ['InvitationByToken.infinite', variables],
      queryFn: (metaData) => graphqlFetch<InvitationByTokenQuery, InvitationByTokenQueryVariables>(InvitationByTokenDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      ...restOptions
    }
  })()
    )};

useInfiniteInvitationByTokenQuery.getKey = (variables: InvitationByTokenQueryVariables) => ['InvitationByToken.infinite', variables];

export const useSuspenseInfiniteInvitationByTokenQuery = <
      TData = InfiniteData<InvitationByTokenQuery>,
      TError = unknown
    >(
      variables: InvitationByTokenQueryVariables,
      options: Omit<UseSuspenseInfiniteQueryOptions<InvitationByTokenQuery, TError, TData>, 'queryKey'> & { queryKey?: UseSuspenseInfiniteQueryOptions<InvitationByTokenQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useSuspenseInfiniteQuery<InvitationByTokenQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? ['InvitationByToken.infiniteSuspense', variables],
      queryFn: (metaData) => graphqlFetch<InvitationByTokenQuery, InvitationByTokenQueryVariables>(InvitationByTokenDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      ...restOptions
    }
  })()
    )};

useSuspenseInfiniteInvitationByTokenQuery.getKey = (variables: InvitationByTokenQueryVariables) => ['InvitationByToken.infiniteSuspense', variables];


useInvitationByTokenQuery.fetcher = (variables: InvitationByTokenQueryVariables, options?: RequestInit['headers']) => graphqlFetch<InvitationByTokenQuery, InvitationByTokenQueryVariables>(InvitationByTokenDocument, variables, options);

export const LabelsDocument = `
    query Labels($projectId: UUID!) {
  labels(condition: {projectId: $projectId}, orderBy: NAME_ASC) {
    nodes {
      ...Label
    }
  }
}
    ${LabelFragmentDoc}`;

export const useLabelsQuery = <
      TData = LabelsQuery,
      TError = unknown
    >(
      variables: LabelsQueryVariables,
      options?: Omit<UseQueryOptions<LabelsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<LabelsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<LabelsQuery, TError, TData>(
      {
    queryKey: ['Labels', variables],
    queryFn: graphqlFetch<LabelsQuery, LabelsQueryVariables>(LabelsDocument, variables),
    ...options
  }
    )};

useLabelsQuery.getKey = (variables: LabelsQueryVariables) => ['Labels', variables];

export const useSuspenseLabelsQuery = <
      TData = LabelsQuery,
      TError = unknown
    >(
      variables: LabelsQueryVariables,
      options?: Omit<UseSuspenseQueryOptions<LabelsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseSuspenseQueryOptions<LabelsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useSuspenseQuery<LabelsQuery, TError, TData>(
      {
    queryKey: ['LabelsSuspense', variables],
    queryFn: graphqlFetch<LabelsQuery, LabelsQueryVariables>(LabelsDocument, variables),
    ...options
  }
    )};

useSuspenseLabelsQuery.getKey = (variables: LabelsQueryVariables) => ['LabelsSuspense', variables];

export const useInfiniteLabelsQuery = <
      TData = InfiniteData<LabelsQuery>,
      TError = unknown
    >(
      variables: LabelsQueryVariables,
      options: Omit<UseInfiniteQueryOptions<LabelsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseInfiniteQueryOptions<LabelsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useInfiniteQuery<LabelsQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? ['Labels.infinite', variables],
      queryFn: (metaData) => graphqlFetch<LabelsQuery, LabelsQueryVariables>(LabelsDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      ...restOptions
    }
  })()
    )};

useInfiniteLabelsQuery.getKey = (variables: LabelsQueryVariables) => ['Labels.infinite', variables];

export const useSuspenseInfiniteLabelsQuery = <
      TData = InfiniteData<LabelsQuery>,
      TError = unknown
    >(
      variables: LabelsQueryVariables,
      options: Omit<UseSuspenseInfiniteQueryOptions<LabelsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseSuspenseInfiniteQueryOptions<LabelsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useSuspenseInfiniteQuery<LabelsQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? ['Labels.infiniteSuspense', variables],
      queryFn: (metaData) => graphqlFetch<LabelsQuery, LabelsQueryVariables>(LabelsDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      ...restOptions
    }
  })()
    )};

useSuspenseInfiniteLabelsQuery.getKey = (variables: LabelsQueryVariables) => ['Labels.infiniteSuspense', variables];


useLabelsQuery.fetcher = (variables: LabelsQueryVariables, options?: RequestInit['headers']) => graphqlFetch<LabelsQuery, LabelsQueryVariables>(LabelsDocument, variables, options);

export const ProjectColumnsDocument = `
    query ProjectColumns($organizationId: String!, $search: String = "") {
  projectColumns(condition: {organizationId: $organizationId}, orderBy: INDEX_ASC) {
    nodes {
      title
      index
      rowId
      icon
      projects(filter: {name: {includesInsensitive: $search}}) {
        totalCount
      }
    }
  }
}
    `;

export const useProjectColumnsQuery = <
      TData = ProjectColumnsQuery,
      TError = unknown
    >(
      variables: ProjectColumnsQueryVariables,
      options?: Omit<UseQueryOptions<ProjectColumnsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<ProjectColumnsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<ProjectColumnsQuery, TError, TData>(
      {
    queryKey: ['ProjectColumns', variables],
    queryFn: graphqlFetch<ProjectColumnsQuery, ProjectColumnsQueryVariables>(ProjectColumnsDocument, variables),
    ...options
  }
    )};

useProjectColumnsQuery.getKey = (variables: ProjectColumnsQueryVariables) => ['ProjectColumns', variables];

export const useSuspenseProjectColumnsQuery = <
      TData = ProjectColumnsQuery,
      TError = unknown
    >(
      variables: ProjectColumnsQueryVariables,
      options?: Omit<UseSuspenseQueryOptions<ProjectColumnsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseSuspenseQueryOptions<ProjectColumnsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useSuspenseQuery<ProjectColumnsQuery, TError, TData>(
      {
    queryKey: ['ProjectColumnsSuspense', variables],
    queryFn: graphqlFetch<ProjectColumnsQuery, ProjectColumnsQueryVariables>(ProjectColumnsDocument, variables),
    ...options
  }
    )};

useSuspenseProjectColumnsQuery.getKey = (variables: ProjectColumnsQueryVariables) => ['ProjectColumnsSuspense', variables];

export const useInfiniteProjectColumnsQuery = <
      TData = InfiniteData<ProjectColumnsQuery>,
      TError = unknown
    >(
      variables: ProjectColumnsQueryVariables,
      options: Omit<UseInfiniteQueryOptions<ProjectColumnsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseInfiniteQueryOptions<ProjectColumnsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useInfiniteQuery<ProjectColumnsQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? ['ProjectColumns.infinite', variables],
      queryFn: (metaData) => graphqlFetch<ProjectColumnsQuery, ProjectColumnsQueryVariables>(ProjectColumnsDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      ...restOptions
    }
  })()
    )};

useInfiniteProjectColumnsQuery.getKey = (variables: ProjectColumnsQueryVariables) => ['ProjectColumns.infinite', variables];

export const useSuspenseInfiniteProjectColumnsQuery = <
      TData = InfiniteData<ProjectColumnsQuery>,
      TError = unknown
    >(
      variables: ProjectColumnsQueryVariables,
      options: Omit<UseSuspenseInfiniteQueryOptions<ProjectColumnsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseSuspenseInfiniteQueryOptions<ProjectColumnsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useSuspenseInfiniteQuery<ProjectColumnsQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? ['ProjectColumns.infiniteSuspense', variables],
      queryFn: (metaData) => graphqlFetch<ProjectColumnsQuery, ProjectColumnsQueryVariables>(ProjectColumnsDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      ...restOptions
    }
  })()
    )};

useSuspenseInfiniteProjectColumnsQuery.getKey = (variables: ProjectColumnsQueryVariables) => ['ProjectColumns.infiniteSuspense', variables];


useProjectColumnsQuery.fetcher = (variables: ProjectColumnsQueryVariables, options?: RequestInit['headers']) => graphqlFetch<ProjectColumnsQuery, ProjectColumnsQueryVariables>(ProjectColumnsDocument, variables, options);

export const ProjectDocument = `
    query Project($rowId: UUID!) {
  project(rowId: $rowId) {
    rowId
    name
    slug
    description
    prefix
    projectColumnId
    nextTaskNumber
    tasks {
      totalCount
    }
    columns(orderBy: INDEX_ASC) {
      nodes {
        rowId
        index
        title
        icon
        tasks {
          totalCount
        }
      }
    }
  }
}
    `;

export const useProjectQuery = <
      TData = ProjectQuery,
      TError = unknown
    >(
      variables: ProjectQueryVariables,
      options?: Omit<UseQueryOptions<ProjectQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<ProjectQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<ProjectQuery, TError, TData>(
      {
    queryKey: ['Project', variables],
    queryFn: graphqlFetch<ProjectQuery, ProjectQueryVariables>(ProjectDocument, variables),
    ...options
  }
    )};

useProjectQuery.getKey = (variables: ProjectQueryVariables) => ['Project', variables];

export const useSuspenseProjectQuery = <
      TData = ProjectQuery,
      TError = unknown
    >(
      variables: ProjectQueryVariables,
      options?: Omit<UseSuspenseQueryOptions<ProjectQuery, TError, TData>, 'queryKey'> & { queryKey?: UseSuspenseQueryOptions<ProjectQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useSuspenseQuery<ProjectQuery, TError, TData>(
      {
    queryKey: ['ProjectSuspense', variables],
    queryFn: graphqlFetch<ProjectQuery, ProjectQueryVariables>(ProjectDocument, variables),
    ...options
  }
    )};

useSuspenseProjectQuery.getKey = (variables: ProjectQueryVariables) => ['ProjectSuspense', variables];

export const useInfiniteProjectQuery = <
      TData = InfiniteData<ProjectQuery>,
      TError = unknown
    >(
      variables: ProjectQueryVariables,
      options: Omit<UseInfiniteQueryOptions<ProjectQuery, TError, TData>, 'queryKey'> & { queryKey?: UseInfiniteQueryOptions<ProjectQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useInfiniteQuery<ProjectQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? ['Project.infinite', variables],
      queryFn: (metaData) => graphqlFetch<ProjectQuery, ProjectQueryVariables>(ProjectDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      ...restOptions
    }
  })()
    )};

useInfiniteProjectQuery.getKey = (variables: ProjectQueryVariables) => ['Project.infinite', variables];

export const useSuspenseInfiniteProjectQuery = <
      TData = InfiniteData<ProjectQuery>,
      TError = unknown
    >(
      variables: ProjectQueryVariables,
      options: Omit<UseSuspenseInfiniteQueryOptions<ProjectQuery, TError, TData>, 'queryKey'> & { queryKey?: UseSuspenseInfiniteQueryOptions<ProjectQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useSuspenseInfiniteQuery<ProjectQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? ['Project.infiniteSuspense', variables],
      queryFn: (metaData) => graphqlFetch<ProjectQuery, ProjectQueryVariables>(ProjectDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      ...restOptions
    }
  })()
    )};

useSuspenseInfiniteProjectQuery.getKey = (variables: ProjectQueryVariables) => ['Project.infiniteSuspense', variables];


useProjectQuery.fetcher = (variables: ProjectQueryVariables, options?: RequestInit['headers']) => graphqlFetch<ProjectQuery, ProjectQueryVariables>(ProjectDocument, variables, options);

export const ProjectBySlugDocument = `
    query ProjectBySlug($slug: String!, $organizationId: String!) {
  projectBySlugAndOrganizationId(slug: $slug, organizationId: $organizationId) {
    rowId
    name
  }
}
    `;

export const useProjectBySlugQuery = <
      TData = ProjectBySlugQuery,
      TError = unknown
    >(
      variables: ProjectBySlugQueryVariables,
      options?: Omit<UseQueryOptions<ProjectBySlugQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<ProjectBySlugQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<ProjectBySlugQuery, TError, TData>(
      {
    queryKey: ['ProjectBySlug', variables],
    queryFn: graphqlFetch<ProjectBySlugQuery, ProjectBySlugQueryVariables>(ProjectBySlugDocument, variables),
    ...options
  }
    )};

useProjectBySlugQuery.getKey = (variables: ProjectBySlugQueryVariables) => ['ProjectBySlug', variables];

export const useSuspenseProjectBySlugQuery = <
      TData = ProjectBySlugQuery,
      TError = unknown
    >(
      variables: ProjectBySlugQueryVariables,
      options?: Omit<UseSuspenseQueryOptions<ProjectBySlugQuery, TError, TData>, 'queryKey'> & { queryKey?: UseSuspenseQueryOptions<ProjectBySlugQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useSuspenseQuery<ProjectBySlugQuery, TError, TData>(
      {
    queryKey: ['ProjectBySlugSuspense', variables],
    queryFn: graphqlFetch<ProjectBySlugQuery, ProjectBySlugQueryVariables>(ProjectBySlugDocument, variables),
    ...options
  }
    )};

useSuspenseProjectBySlugQuery.getKey = (variables: ProjectBySlugQueryVariables) => ['ProjectBySlugSuspense', variables];

export const useInfiniteProjectBySlugQuery = <
      TData = InfiniteData<ProjectBySlugQuery>,
      TError = unknown
    >(
      variables: ProjectBySlugQueryVariables,
      options: Omit<UseInfiniteQueryOptions<ProjectBySlugQuery, TError, TData>, 'queryKey'> & { queryKey?: UseInfiniteQueryOptions<ProjectBySlugQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useInfiniteQuery<ProjectBySlugQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? ['ProjectBySlug.infinite', variables],
      queryFn: (metaData) => graphqlFetch<ProjectBySlugQuery, ProjectBySlugQueryVariables>(ProjectBySlugDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      ...restOptions
    }
  })()
    )};

useInfiniteProjectBySlugQuery.getKey = (variables: ProjectBySlugQueryVariables) => ['ProjectBySlug.infinite', variables];

export const useSuspenseInfiniteProjectBySlugQuery = <
      TData = InfiniteData<ProjectBySlugQuery>,
      TError = unknown
    >(
      variables: ProjectBySlugQueryVariables,
      options: Omit<UseSuspenseInfiniteQueryOptions<ProjectBySlugQuery, TError, TData>, 'queryKey'> & { queryKey?: UseSuspenseInfiniteQueryOptions<ProjectBySlugQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useSuspenseInfiniteQuery<ProjectBySlugQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? ['ProjectBySlug.infiniteSuspense', variables],
      queryFn: (metaData) => graphqlFetch<ProjectBySlugQuery, ProjectBySlugQueryVariables>(ProjectBySlugDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      ...restOptions
    }
  })()
    )};

useSuspenseInfiniteProjectBySlugQuery.getKey = (variables: ProjectBySlugQueryVariables) => ['ProjectBySlug.infiniteSuspense', variables];


useProjectBySlugQuery.fetcher = (variables: ProjectBySlugQueryVariables, options?: RequestInit['headers']) => graphqlFetch<ProjectBySlugQuery, ProjectBySlugQueryVariables>(ProjectBySlugDocument, variables, options);

export const ProjectsDocument = `
    query Projects($organizationId: String!, $search: String = "", $userId: UUID) {
  projects(
    condition: {organizationId: $organizationId}
    filter: {name: {includesInsensitive: $search}}
    orderBy: COLUMN_INDEX_ASC
  ) {
    nodes {
      ...Project
      userPreferences(condition: {userId: $userId}, first: 1) {
        nodes {
          rowId
          color
          viewMode
        }
      }
    }
  }
}
    ${ProjectFragmentDoc}`;

export const useProjectsQuery = <
      TData = ProjectsQuery,
      TError = unknown
    >(
      variables: ProjectsQueryVariables,
      options?: Omit<UseQueryOptions<ProjectsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<ProjectsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<ProjectsQuery, TError, TData>(
      {
    queryKey: ['Projects', variables],
    queryFn: graphqlFetch<ProjectsQuery, ProjectsQueryVariables>(ProjectsDocument, variables),
    ...options
  }
    )};

useProjectsQuery.getKey = (variables: ProjectsQueryVariables) => ['Projects', variables];

export const useSuspenseProjectsQuery = <
      TData = ProjectsQuery,
      TError = unknown
    >(
      variables: ProjectsQueryVariables,
      options?: Omit<UseSuspenseQueryOptions<ProjectsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseSuspenseQueryOptions<ProjectsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useSuspenseQuery<ProjectsQuery, TError, TData>(
      {
    queryKey: ['ProjectsSuspense', variables],
    queryFn: graphqlFetch<ProjectsQuery, ProjectsQueryVariables>(ProjectsDocument, variables),
    ...options
  }
    )};

useSuspenseProjectsQuery.getKey = (variables: ProjectsQueryVariables) => ['ProjectsSuspense', variables];

export const useInfiniteProjectsQuery = <
      TData = InfiniteData<ProjectsQuery>,
      TError = unknown
    >(
      variables: ProjectsQueryVariables,
      options: Omit<UseInfiniteQueryOptions<ProjectsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseInfiniteQueryOptions<ProjectsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useInfiniteQuery<ProjectsQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? ['Projects.infinite', variables],
      queryFn: (metaData) => graphqlFetch<ProjectsQuery, ProjectsQueryVariables>(ProjectsDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      ...restOptions
    }
  })()
    )};

useInfiniteProjectsQuery.getKey = (variables: ProjectsQueryVariables) => ['Projects.infinite', variables];

export const useSuspenseInfiniteProjectsQuery = <
      TData = InfiniteData<ProjectsQuery>,
      TError = unknown
    >(
      variables: ProjectsQueryVariables,
      options: Omit<UseSuspenseInfiniteQueryOptions<ProjectsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseSuspenseInfiniteQueryOptions<ProjectsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useSuspenseInfiniteQuery<ProjectsQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? ['Projects.infiniteSuspense', variables],
      queryFn: (metaData) => graphqlFetch<ProjectsQuery, ProjectsQueryVariables>(ProjectsDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      ...restOptions
    }
  })()
    )};

useSuspenseInfiniteProjectsQuery.getKey = (variables: ProjectsQueryVariables) => ['Projects.infiniteSuspense', variables];


useProjectsQuery.fetcher = (variables: ProjectsQueryVariables, options?: RequestInit['headers']) => graphqlFetch<ProjectsQuery, ProjectsQueryVariables>(ProjectsDocument, variables, options);

export const ProjectsSidebarDocument = `
    query ProjectsSidebar($organizationId: String!, $userId: UUID) {
  projects(
    condition: {organizationId: $organizationId}
    orderBy: COLUMN_INDEX_ASC
  ) {
    nodes {
      rowId
      name
      slug
      userPreferences(condition: {userId: $userId}, first: 1) {
        nodes {
          rowId
          color
          viewMode
        }
      }
    }
  }
}
    `;

export const useProjectsSidebarQuery = <
      TData = ProjectsSidebarQuery,
      TError = unknown
    >(
      variables: ProjectsSidebarQueryVariables,
      options?: Omit<UseQueryOptions<ProjectsSidebarQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<ProjectsSidebarQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<ProjectsSidebarQuery, TError, TData>(
      {
    queryKey: ['ProjectsSidebar', variables],
    queryFn: graphqlFetch<ProjectsSidebarQuery, ProjectsSidebarQueryVariables>(ProjectsSidebarDocument, variables),
    ...options
  }
    )};

useProjectsSidebarQuery.getKey = (variables: ProjectsSidebarQueryVariables) => ['ProjectsSidebar', variables];

export const useSuspenseProjectsSidebarQuery = <
      TData = ProjectsSidebarQuery,
      TError = unknown
    >(
      variables: ProjectsSidebarQueryVariables,
      options?: Omit<UseSuspenseQueryOptions<ProjectsSidebarQuery, TError, TData>, 'queryKey'> & { queryKey?: UseSuspenseQueryOptions<ProjectsSidebarQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useSuspenseQuery<ProjectsSidebarQuery, TError, TData>(
      {
    queryKey: ['ProjectsSidebarSuspense', variables],
    queryFn: graphqlFetch<ProjectsSidebarQuery, ProjectsSidebarQueryVariables>(ProjectsSidebarDocument, variables),
    ...options
  }
    )};

useSuspenseProjectsSidebarQuery.getKey = (variables: ProjectsSidebarQueryVariables) => ['ProjectsSidebarSuspense', variables];

export const useInfiniteProjectsSidebarQuery = <
      TData = InfiniteData<ProjectsSidebarQuery>,
      TError = unknown
    >(
      variables: ProjectsSidebarQueryVariables,
      options: Omit<UseInfiniteQueryOptions<ProjectsSidebarQuery, TError, TData>, 'queryKey'> & { queryKey?: UseInfiniteQueryOptions<ProjectsSidebarQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useInfiniteQuery<ProjectsSidebarQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? ['ProjectsSidebar.infinite', variables],
      queryFn: (metaData) => graphqlFetch<ProjectsSidebarQuery, ProjectsSidebarQueryVariables>(ProjectsSidebarDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      ...restOptions
    }
  })()
    )};

useInfiniteProjectsSidebarQuery.getKey = (variables: ProjectsSidebarQueryVariables) => ['ProjectsSidebar.infinite', variables];

export const useSuspenseInfiniteProjectsSidebarQuery = <
      TData = InfiniteData<ProjectsSidebarQuery>,
      TError = unknown
    >(
      variables: ProjectsSidebarQueryVariables,
      options: Omit<UseSuspenseInfiniteQueryOptions<ProjectsSidebarQuery, TError, TData>, 'queryKey'> & { queryKey?: UseSuspenseInfiniteQueryOptions<ProjectsSidebarQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useSuspenseInfiniteQuery<ProjectsSidebarQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? ['ProjectsSidebar.infiniteSuspense', variables],
      queryFn: (metaData) => graphqlFetch<ProjectsSidebarQuery, ProjectsSidebarQueryVariables>(ProjectsSidebarDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      ...restOptions
    }
  })()
    )};

useSuspenseInfiniteProjectsSidebarQuery.getKey = (variables: ProjectsSidebarQueryVariables) => ['ProjectsSidebar.infiniteSuspense', variables];


useProjectsSidebarQuery.fetcher = (variables: ProjectsSidebarQueryVariables, options?: RequestInit['headers']) => graphqlFetch<ProjectsSidebarQuery, ProjectsSidebarQueryVariables>(ProjectsSidebarDocument, variables, options);

export const SettingByOrganizationIdDocument = `
    query SettingByOrganizationId($organizationId: String!) {
  settingByOrganizationId(organizationId: $organizationId) {
    rowId
    organizationId
    viewMode
    subscriptionId
    billingAccountId
  }
}
    `;

export const useSettingByOrganizationIdQuery = <
      TData = SettingByOrganizationIdQuery,
      TError = unknown
    >(
      variables: SettingByOrganizationIdQueryVariables,
      options?: Omit<UseQueryOptions<SettingByOrganizationIdQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<SettingByOrganizationIdQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<SettingByOrganizationIdQuery, TError, TData>(
      {
    queryKey: ['SettingByOrganizationId', variables],
    queryFn: graphqlFetch<SettingByOrganizationIdQuery, SettingByOrganizationIdQueryVariables>(SettingByOrganizationIdDocument, variables),
    ...options
  }
    )};

useSettingByOrganizationIdQuery.getKey = (variables: SettingByOrganizationIdQueryVariables) => ['SettingByOrganizationId', variables];

export const useSuspenseSettingByOrganizationIdQuery = <
      TData = SettingByOrganizationIdQuery,
      TError = unknown
    >(
      variables: SettingByOrganizationIdQueryVariables,
      options?: Omit<UseSuspenseQueryOptions<SettingByOrganizationIdQuery, TError, TData>, 'queryKey'> & { queryKey?: UseSuspenseQueryOptions<SettingByOrganizationIdQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useSuspenseQuery<SettingByOrganizationIdQuery, TError, TData>(
      {
    queryKey: ['SettingByOrganizationIdSuspense', variables],
    queryFn: graphqlFetch<SettingByOrganizationIdQuery, SettingByOrganizationIdQueryVariables>(SettingByOrganizationIdDocument, variables),
    ...options
  }
    )};

useSuspenseSettingByOrganizationIdQuery.getKey = (variables: SettingByOrganizationIdQueryVariables) => ['SettingByOrganizationIdSuspense', variables];

export const useInfiniteSettingByOrganizationIdQuery = <
      TData = InfiniteData<SettingByOrganizationIdQuery>,
      TError = unknown
    >(
      variables: SettingByOrganizationIdQueryVariables,
      options: Omit<UseInfiniteQueryOptions<SettingByOrganizationIdQuery, TError, TData>, 'queryKey'> & { queryKey?: UseInfiniteQueryOptions<SettingByOrganizationIdQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useInfiniteQuery<SettingByOrganizationIdQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? ['SettingByOrganizationId.infinite', variables],
      queryFn: (metaData) => graphqlFetch<SettingByOrganizationIdQuery, SettingByOrganizationIdQueryVariables>(SettingByOrganizationIdDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      ...restOptions
    }
  })()
    )};

useInfiniteSettingByOrganizationIdQuery.getKey = (variables: SettingByOrganizationIdQueryVariables) => ['SettingByOrganizationId.infinite', variables];

export const useSuspenseInfiniteSettingByOrganizationIdQuery = <
      TData = InfiniteData<SettingByOrganizationIdQuery>,
      TError = unknown
    >(
      variables: SettingByOrganizationIdQueryVariables,
      options: Omit<UseSuspenseInfiniteQueryOptions<SettingByOrganizationIdQuery, TError, TData>, 'queryKey'> & { queryKey?: UseSuspenseInfiniteQueryOptions<SettingByOrganizationIdQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useSuspenseInfiniteQuery<SettingByOrganizationIdQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? ['SettingByOrganizationId.infiniteSuspense', variables],
      queryFn: (metaData) => graphqlFetch<SettingByOrganizationIdQuery, SettingByOrganizationIdQueryVariables>(SettingByOrganizationIdDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      ...restOptions
    }
  })()
    )};

useSuspenseInfiniteSettingByOrganizationIdQuery.getKey = (variables: SettingByOrganizationIdQueryVariables) => ['SettingByOrganizationId.infiniteSuspense', variables];


useSettingByOrganizationIdQuery.fetcher = (variables: SettingByOrganizationIdQueryVariables, options?: RequestInit['headers']) => graphqlFetch<SettingByOrganizationIdQuery, SettingByOrganizationIdQueryVariables>(SettingByOrganizationIdDocument, variables, options);

export const TaskDocument = `
    query Task($rowId: UUID!) {
  task(rowId: $rowId) {
    rowId
    number
    projectId
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
        taskId
        labelId
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
        authorId
        author {
          name
          avatarUrl
          rowId
          id
        }
      }
    }
    column {
      title
      icon
    }
    author {
      name
      avatarUrl
      rowId
    }
    assignees {
      nodes {
        taskId
        userId
        user {
          rowId
          identityProviderId
          name
          avatarUrl
        }
      }
    }
  }
}
    ${LabelFragmentDoc}`;

export const useTaskQuery = <
      TData = TaskQuery,
      TError = unknown
    >(
      variables: TaskQueryVariables,
      options?: Omit<UseQueryOptions<TaskQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<TaskQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<TaskQuery, TError, TData>(
      {
    queryKey: ['Task', variables],
    queryFn: graphqlFetch<TaskQuery, TaskQueryVariables>(TaskDocument, variables),
    ...options
  }
    )};

useTaskQuery.getKey = (variables: TaskQueryVariables) => ['Task', variables];

export const useSuspenseTaskQuery = <
      TData = TaskQuery,
      TError = unknown
    >(
      variables: TaskQueryVariables,
      options?: Omit<UseSuspenseQueryOptions<TaskQuery, TError, TData>, 'queryKey'> & { queryKey?: UseSuspenseQueryOptions<TaskQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useSuspenseQuery<TaskQuery, TError, TData>(
      {
    queryKey: ['TaskSuspense', variables],
    queryFn: graphqlFetch<TaskQuery, TaskQueryVariables>(TaskDocument, variables),
    ...options
  }
    )};

useSuspenseTaskQuery.getKey = (variables: TaskQueryVariables) => ['TaskSuspense', variables];

export const useInfiniteTaskQuery = <
      TData = InfiniteData<TaskQuery>,
      TError = unknown
    >(
      variables: TaskQueryVariables,
      options: Omit<UseInfiniteQueryOptions<TaskQuery, TError, TData>, 'queryKey'> & { queryKey?: UseInfiniteQueryOptions<TaskQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useInfiniteQuery<TaskQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? ['Task.infinite', variables],
      queryFn: (metaData) => graphqlFetch<TaskQuery, TaskQueryVariables>(TaskDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      ...restOptions
    }
  })()
    )};

useInfiniteTaskQuery.getKey = (variables: TaskQueryVariables) => ['Task.infinite', variables];

export const useSuspenseInfiniteTaskQuery = <
      TData = InfiniteData<TaskQuery>,
      TError = unknown
    >(
      variables: TaskQueryVariables,
      options: Omit<UseSuspenseInfiniteQueryOptions<TaskQuery, TError, TData>, 'queryKey'> & { queryKey?: UseSuspenseInfiniteQueryOptions<TaskQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useSuspenseInfiniteQuery<TaskQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? ['Task.infiniteSuspense', variables],
      queryFn: (metaData) => graphqlFetch<TaskQuery, TaskQueryVariables>(TaskDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      ...restOptions
    }
  })()
    )};

useSuspenseInfiniteTaskQuery.getKey = (variables: TaskQueryVariables) => ['Task.infiniteSuspense', variables];


useTaskQuery.fetcher = (variables: TaskQueryVariables, options?: RequestInit['headers']) => graphqlFetch<TaskQuery, TaskQueryVariables>(TaskDocument, variables, options);

export const TasksDocument = `
    query Tasks($projectId: UUID!, $search: String = "", $assignees: TaskToManyAssigneeFilter, $labels: TaskToManyTaskLabelFilter, $priorities: [String!]) {
  tasks(
    filter: {projectId: {equalTo: $projectId}, content: {includesInsensitive: $search}, assignees: $assignees, taskLabels: $labels, priority: {in: $priorities}}
    orderBy: COLUMN_INDEX_ASC
  ) {
    nodes {
      ...Task
    }
  }
}
    ${TaskFragmentDoc}`;

export const useTasksQuery = <
      TData = TasksQuery,
      TError = unknown
    >(
      variables: TasksQueryVariables,
      options?: Omit<UseQueryOptions<TasksQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<TasksQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<TasksQuery, TError, TData>(
      {
    queryKey: ['Tasks', variables],
    queryFn: graphqlFetch<TasksQuery, TasksQueryVariables>(TasksDocument, variables),
    ...options
  }
    )};

useTasksQuery.getKey = (variables: TasksQueryVariables) => ['Tasks', variables];

export const useSuspenseTasksQuery = <
      TData = TasksQuery,
      TError = unknown
    >(
      variables: TasksQueryVariables,
      options?: Omit<UseSuspenseQueryOptions<TasksQuery, TError, TData>, 'queryKey'> & { queryKey?: UseSuspenseQueryOptions<TasksQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useSuspenseQuery<TasksQuery, TError, TData>(
      {
    queryKey: ['TasksSuspense', variables],
    queryFn: graphqlFetch<TasksQuery, TasksQueryVariables>(TasksDocument, variables),
    ...options
  }
    )};

useSuspenseTasksQuery.getKey = (variables: TasksQueryVariables) => ['TasksSuspense', variables];

export const useInfiniteTasksQuery = <
      TData = InfiniteData<TasksQuery>,
      TError = unknown
    >(
      variables: TasksQueryVariables,
      options: Omit<UseInfiniteQueryOptions<TasksQuery, TError, TData>, 'queryKey'> & { queryKey?: UseInfiniteQueryOptions<TasksQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useInfiniteQuery<TasksQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? ['Tasks.infinite', variables],
      queryFn: (metaData) => graphqlFetch<TasksQuery, TasksQueryVariables>(TasksDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      ...restOptions
    }
  })()
    )};

useInfiniteTasksQuery.getKey = (variables: TasksQueryVariables) => ['Tasks.infinite', variables];

export const useSuspenseInfiniteTasksQuery = <
      TData = InfiniteData<TasksQuery>,
      TError = unknown
    >(
      variables: TasksQueryVariables,
      options: Omit<UseSuspenseInfiniteQueryOptions<TasksQuery, TError, TData>, 'queryKey'> & { queryKey?: UseSuspenseInfiniteQueryOptions<TasksQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useSuspenseInfiniteQuery<TasksQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? ['Tasks.infiniteSuspense', variables],
      queryFn: (metaData) => graphqlFetch<TasksQuery, TasksQueryVariables>(TasksDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      ...restOptions
    }
  })()
    )};

useSuspenseInfiniteTasksQuery.getKey = (variables: TasksQueryVariables) => ['Tasks.infiniteSuspense', variables];


useTasksQuery.fetcher = (variables: TasksQueryVariables, options?: RequestInit['headers']) => graphqlFetch<TasksQuery, TasksQueryVariables>(TasksDocument, variables, options);

export const OrganizationMembersDocument = `
    query OrganizationMembers($organizationId: String!) {
  userOrganizations(condition: {organizationId: $organizationId}) {
    nodes {
      rowId
      organizationId
      slug
      name
      role
      createdAt
      user {
        rowId
        name
        email
        avatarUrl
        identityProviderId
      }
    }
  }
}
    `;

export const useOrganizationMembersQuery = <
      TData = OrganizationMembersQuery,
      TError = unknown
    >(
      variables: OrganizationMembersQueryVariables,
      options?: Omit<UseQueryOptions<OrganizationMembersQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<OrganizationMembersQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<OrganizationMembersQuery, TError, TData>(
      {
    queryKey: ['OrganizationMembers', variables],
    queryFn: graphqlFetch<OrganizationMembersQuery, OrganizationMembersQueryVariables>(OrganizationMembersDocument, variables),
    ...options
  }
    )};

useOrganizationMembersQuery.getKey = (variables: OrganizationMembersQueryVariables) => ['OrganizationMembers', variables];

export const useSuspenseOrganizationMembersQuery = <
      TData = OrganizationMembersQuery,
      TError = unknown
    >(
      variables: OrganizationMembersQueryVariables,
      options?: Omit<UseSuspenseQueryOptions<OrganizationMembersQuery, TError, TData>, 'queryKey'> & { queryKey?: UseSuspenseQueryOptions<OrganizationMembersQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useSuspenseQuery<OrganizationMembersQuery, TError, TData>(
      {
    queryKey: ['OrganizationMembersSuspense', variables],
    queryFn: graphqlFetch<OrganizationMembersQuery, OrganizationMembersQueryVariables>(OrganizationMembersDocument, variables),
    ...options
  }
    )};

useSuspenseOrganizationMembersQuery.getKey = (variables: OrganizationMembersQueryVariables) => ['OrganizationMembersSuspense', variables];

export const useInfiniteOrganizationMembersQuery = <
      TData = InfiniteData<OrganizationMembersQuery>,
      TError = unknown
    >(
      variables: OrganizationMembersQueryVariables,
      options: Omit<UseInfiniteQueryOptions<OrganizationMembersQuery, TError, TData>, 'queryKey'> & { queryKey?: UseInfiniteQueryOptions<OrganizationMembersQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useInfiniteQuery<OrganizationMembersQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? ['OrganizationMembers.infinite', variables],
      queryFn: (metaData) => graphqlFetch<OrganizationMembersQuery, OrganizationMembersQueryVariables>(OrganizationMembersDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      ...restOptions
    }
  })()
    )};

useInfiniteOrganizationMembersQuery.getKey = (variables: OrganizationMembersQueryVariables) => ['OrganizationMembers.infinite', variables];

export const useSuspenseInfiniteOrganizationMembersQuery = <
      TData = InfiniteData<OrganizationMembersQuery>,
      TError = unknown
    >(
      variables: OrganizationMembersQueryVariables,
      options: Omit<UseSuspenseInfiniteQueryOptions<OrganizationMembersQuery, TError, TData>, 'queryKey'> & { queryKey?: UseSuspenseInfiniteQueryOptions<OrganizationMembersQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useSuspenseInfiniteQuery<OrganizationMembersQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? ['OrganizationMembers.infiniteSuspense', variables],
      queryFn: (metaData) => graphqlFetch<OrganizationMembersQuery, OrganizationMembersQueryVariables>(OrganizationMembersDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      ...restOptions
    }
  })()
    )};

useSuspenseInfiniteOrganizationMembersQuery.getKey = (variables: OrganizationMembersQueryVariables) => ['OrganizationMembers.infiniteSuspense', variables];


useOrganizationMembersQuery.fetcher = (variables: OrganizationMembersQueryVariables, options?: RequestInit['headers']) => graphqlFetch<OrganizationMembersQuery, OrganizationMembersQueryVariables>(OrganizationMembersDocument, variables, options);

export const UserPreferencesDocument = `
    query UserPreferences($userId: UUID!, $projectId: UUID!) {
  userPreferenceByUserIdAndProjectId(userId: $userId, projectId: $projectId) {
    hiddenColumnIds
    viewMode
    rowId
    color
  }
}
    `;

export const useUserPreferencesQuery = <
      TData = UserPreferencesQuery,
      TError = unknown
    >(
      variables: UserPreferencesQueryVariables,
      options?: Omit<UseQueryOptions<UserPreferencesQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<UserPreferencesQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<UserPreferencesQuery, TError, TData>(
      {
    queryKey: ['UserPreferences', variables],
    queryFn: graphqlFetch<UserPreferencesQuery, UserPreferencesQueryVariables>(UserPreferencesDocument, variables),
    ...options
  }
    )};

useUserPreferencesQuery.getKey = (variables: UserPreferencesQueryVariables) => ['UserPreferences', variables];

export const useSuspenseUserPreferencesQuery = <
      TData = UserPreferencesQuery,
      TError = unknown
    >(
      variables: UserPreferencesQueryVariables,
      options?: Omit<UseSuspenseQueryOptions<UserPreferencesQuery, TError, TData>, 'queryKey'> & { queryKey?: UseSuspenseQueryOptions<UserPreferencesQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useSuspenseQuery<UserPreferencesQuery, TError, TData>(
      {
    queryKey: ['UserPreferencesSuspense', variables],
    queryFn: graphqlFetch<UserPreferencesQuery, UserPreferencesQueryVariables>(UserPreferencesDocument, variables),
    ...options
  }
    )};

useSuspenseUserPreferencesQuery.getKey = (variables: UserPreferencesQueryVariables) => ['UserPreferencesSuspense', variables];

export const useInfiniteUserPreferencesQuery = <
      TData = InfiniteData<UserPreferencesQuery>,
      TError = unknown
    >(
      variables: UserPreferencesQueryVariables,
      options: Omit<UseInfiniteQueryOptions<UserPreferencesQuery, TError, TData>, 'queryKey'> & { queryKey?: UseInfiniteQueryOptions<UserPreferencesQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useInfiniteQuery<UserPreferencesQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? ['UserPreferences.infinite', variables],
      queryFn: (metaData) => graphqlFetch<UserPreferencesQuery, UserPreferencesQueryVariables>(UserPreferencesDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      ...restOptions
    }
  })()
    )};

useInfiniteUserPreferencesQuery.getKey = (variables: UserPreferencesQueryVariables) => ['UserPreferences.infinite', variables];

export const useSuspenseInfiniteUserPreferencesQuery = <
      TData = InfiniteData<UserPreferencesQuery>,
      TError = unknown
    >(
      variables: UserPreferencesQueryVariables,
      options: Omit<UseSuspenseInfiniteQueryOptions<UserPreferencesQuery, TError, TData>, 'queryKey'> & { queryKey?: UseSuspenseInfiniteQueryOptions<UserPreferencesQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useSuspenseInfiniteQuery<UserPreferencesQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? ['UserPreferences.infiniteSuspense', variables],
      queryFn: (metaData) => graphqlFetch<UserPreferencesQuery, UserPreferencesQueryVariables>(UserPreferencesDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      ...restOptions
    }
  })()
    )};

useSuspenseInfiniteUserPreferencesQuery.getKey = (variables: UserPreferencesQueryVariables) => ['UserPreferences.infiniteSuspense', variables];


useUserPreferencesQuery.fetcher = (variables: UserPreferencesQueryVariables, options?: RequestInit['headers']) => graphqlFetch<UserPreferencesQuery, UserPreferencesQueryVariables>(UserPreferencesDocument, variables, options);

export const UserDocument = `
    query User($userId: UUID!) {
  user(rowId: $userId) {
    rowId
    name
    email
  }
}
    `;

export const useUserQuery = <
      TData = UserQuery,
      TError = unknown
    >(
      variables: UserQueryVariables,
      options?: Omit<UseQueryOptions<UserQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<UserQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<UserQuery, TError, TData>(
      {
    queryKey: ['User', variables],
    queryFn: graphqlFetch<UserQuery, UserQueryVariables>(UserDocument, variables),
    ...options
  }
    )};

useUserQuery.getKey = (variables: UserQueryVariables) => ['User', variables];

export const useSuspenseUserQuery = <
      TData = UserQuery,
      TError = unknown
    >(
      variables: UserQueryVariables,
      options?: Omit<UseSuspenseQueryOptions<UserQuery, TError, TData>, 'queryKey'> & { queryKey?: UseSuspenseQueryOptions<UserQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useSuspenseQuery<UserQuery, TError, TData>(
      {
    queryKey: ['UserSuspense', variables],
    queryFn: graphqlFetch<UserQuery, UserQueryVariables>(UserDocument, variables),
    ...options
  }
    )};

useSuspenseUserQuery.getKey = (variables: UserQueryVariables) => ['UserSuspense', variables];

export const useInfiniteUserQuery = <
      TData = InfiniteData<UserQuery>,
      TError = unknown
    >(
      variables: UserQueryVariables,
      options: Omit<UseInfiniteQueryOptions<UserQuery, TError, TData>, 'queryKey'> & { queryKey?: UseInfiniteQueryOptions<UserQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useInfiniteQuery<UserQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? ['User.infinite', variables],
      queryFn: (metaData) => graphqlFetch<UserQuery, UserQueryVariables>(UserDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      ...restOptions
    }
  })()
    )};

useInfiniteUserQuery.getKey = (variables: UserQueryVariables) => ['User.infinite', variables];

export const useSuspenseInfiniteUserQuery = <
      TData = InfiniteData<UserQuery>,
      TError = unknown
    >(
      variables: UserQueryVariables,
      options: Omit<UseSuspenseInfiniteQueryOptions<UserQuery, TError, TData>, 'queryKey'> & { queryKey?: UseSuspenseInfiniteQueryOptions<UserQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useSuspenseInfiniteQuery<UserQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? ['User.infiniteSuspense', variables],
      queryFn: (metaData) => graphqlFetch<UserQuery, UserQueryVariables>(UserDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      ...restOptions
    }
  })()
    )};

useSuspenseInfiniteUserQuery.getKey = (variables: UserQueryVariables) => ['User.infiniteSuspense', variables];


useUserQuery.fetcher = (variables: UserQueryVariables, options?: RequestInit['headers']) => graphqlFetch<UserQuery, UserQueryVariables>(UserDocument, variables, options);

export const UserByIdentityProviderIdDocument = `
    query UserByIdentityProviderId($identityProviderId: UUID!) {
  userByIdentityProviderId(identityProviderId: $identityProviderId) {
    rowId
    userOrganizations {
      nodes {
        organizationId
        slug
        name
        type
        role
      }
    }
  }
}
    `;

export const useUserByIdentityProviderIdQuery = <
      TData = UserByIdentityProviderIdQuery,
      TError = unknown
    >(
      variables: UserByIdentityProviderIdQueryVariables,
      options?: Omit<UseQueryOptions<UserByIdentityProviderIdQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<UserByIdentityProviderIdQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<UserByIdentityProviderIdQuery, TError, TData>(
      {
    queryKey: ['UserByIdentityProviderId', variables],
    queryFn: graphqlFetch<UserByIdentityProviderIdQuery, UserByIdentityProviderIdQueryVariables>(UserByIdentityProviderIdDocument, variables),
    ...options
  }
    )};

useUserByIdentityProviderIdQuery.getKey = (variables: UserByIdentityProviderIdQueryVariables) => ['UserByIdentityProviderId', variables];

export const useSuspenseUserByIdentityProviderIdQuery = <
      TData = UserByIdentityProviderIdQuery,
      TError = unknown
    >(
      variables: UserByIdentityProviderIdQueryVariables,
      options?: Omit<UseSuspenseQueryOptions<UserByIdentityProviderIdQuery, TError, TData>, 'queryKey'> & { queryKey?: UseSuspenseQueryOptions<UserByIdentityProviderIdQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useSuspenseQuery<UserByIdentityProviderIdQuery, TError, TData>(
      {
    queryKey: ['UserByIdentityProviderIdSuspense', variables],
    queryFn: graphqlFetch<UserByIdentityProviderIdQuery, UserByIdentityProviderIdQueryVariables>(UserByIdentityProviderIdDocument, variables),
    ...options
  }
    )};

useSuspenseUserByIdentityProviderIdQuery.getKey = (variables: UserByIdentityProviderIdQueryVariables) => ['UserByIdentityProviderIdSuspense', variables];

export const useInfiniteUserByIdentityProviderIdQuery = <
      TData = InfiniteData<UserByIdentityProviderIdQuery>,
      TError = unknown
    >(
      variables: UserByIdentityProviderIdQueryVariables,
      options: Omit<UseInfiniteQueryOptions<UserByIdentityProviderIdQuery, TError, TData>, 'queryKey'> & { queryKey?: UseInfiniteQueryOptions<UserByIdentityProviderIdQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useInfiniteQuery<UserByIdentityProviderIdQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? ['UserByIdentityProviderId.infinite', variables],
      queryFn: (metaData) => graphqlFetch<UserByIdentityProviderIdQuery, UserByIdentityProviderIdQueryVariables>(UserByIdentityProviderIdDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      ...restOptions
    }
  })()
    )};

useInfiniteUserByIdentityProviderIdQuery.getKey = (variables: UserByIdentityProviderIdQueryVariables) => ['UserByIdentityProviderId.infinite', variables];

export const useSuspenseInfiniteUserByIdentityProviderIdQuery = <
      TData = InfiniteData<UserByIdentityProviderIdQuery>,
      TError = unknown
    >(
      variables: UserByIdentityProviderIdQueryVariables,
      options: Omit<UseSuspenseInfiniteQueryOptions<UserByIdentityProviderIdQuery, TError, TData>, 'queryKey'> & { queryKey?: UseSuspenseInfiniteQueryOptions<UserByIdentityProviderIdQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useSuspenseInfiniteQuery<UserByIdentityProviderIdQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? ['UserByIdentityProviderId.infiniteSuspense', variables],
      queryFn: (metaData) => graphqlFetch<UserByIdentityProviderIdQuery, UserByIdentityProviderIdQueryVariables>(UserByIdentityProviderIdDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      ...restOptions
    }
  })()
    )};

useSuspenseInfiniteUserByIdentityProviderIdQuery.getKey = (variables: UserByIdentityProviderIdQueryVariables) => ['UserByIdentityProviderId.infiniteSuspense', variables];


useUserByIdentityProviderIdQuery.fetcher = (variables: UserByIdentityProviderIdQueryVariables, options?: RequestInit['headers']) => graphqlFetch<UserByIdentityProviderIdQuery, UserByIdentityProviderIdQueryVariables>(UserByIdentityProviderIdDocument, variables, options);
