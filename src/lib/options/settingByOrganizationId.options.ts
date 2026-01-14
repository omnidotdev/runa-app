import { queryOptions } from "@tanstack/react-query";

import { useSettingByOrganizationIdQuery } from "@/generated/graphql";

import type { SettingByOrganizationIdQueryVariables } from "@/generated/graphql";

const settingByOrganizationIdOptions = (
  variables: SettingByOrganizationIdQueryVariables,
) =>
  queryOptions({
    queryKey: useSettingByOrganizationIdQuery.getKey(variables),
    queryFn: useSettingByOrganizationIdQuery.fetcher(variables),
  });

export default settingByOrganizationIdOptions;
