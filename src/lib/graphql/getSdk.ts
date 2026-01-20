import { getSdk as getGeneratedSdk } from "@/generated/graphql.sdk";
import {
  getGraphQLClient,
  setAccessToken,
} from "@/lib/graphql/graphqlClientFactory";
import { fetchSession } from "@/server/functions/auth";

const getSdk = async () => {
  const { session } = await fetchSession();
  setAccessToken(session?.accessToken);
  return getGeneratedSdk(getGraphQLClient());
};

export default getSdk;
