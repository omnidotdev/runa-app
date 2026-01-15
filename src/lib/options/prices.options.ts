import { queryOptions } from "@tanstack/react-query";

import { getPrices } from "@/server/functions/prices";

const pricesOptions = () =>
  queryOptions({
    queryKey: ["stripe", "prices"],
    queryFn: () => getPrices(),
    // TODO: Discuss staleTime with team in review
    staleTime: 5 * 60 * 1000,
  });

export default pricesOptions;
