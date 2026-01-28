import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { toast } from "sonner";

import { API_BASE_URL } from "@/lib/config/env.config";
import { useAccessToken } from "./useAccessToken";
import { agentPersonasQueryKey } from "./useAgentPersonas";

/** Valid marketplace listing categories. */
export const MARKETPLACE_CATEGORIES = [
  "triage",
  "sprint-planning",
  "standup",
  "code-review",
  "documentation",
  "reporting",
  "custom",
] as const;

export type MarketplaceCategory = (typeof MARKETPLACE_CATEGORIES)[number];

/** Human-readable labels for categories. */
export const CATEGORY_LABELS: Record<MarketplaceCategory, string> = {
  triage: "Triage",
  "sprint-planning": "Sprint Planning",
  standup: "Standup",
  "code-review": "Code Review",
  documentation: "Documentation",
  reporting: "Reporting",
  custom: "Custom",
};

export interface MarketplaceListing {
  id: string;
  personaId: string;
  organizationId: string;
  title: string;
  description: string | null;
  category: string;
  installCount: number;
  publishedAt: string;
  personaIcon: string | null;
}

function marketplaceQueryKey(category?: string, search?: string) {
  return ["AgentMarketplace", { category, search }] as const;
}

async function fetchListings(
  accessToken: string,
  category?: string,
  search?: string,
): Promise<MarketplaceListing[]> {
  const url = new URL(`${API_BASE_URL}/api/ai/marketplace`);
  if (category) url.searchParams.set("category", category);
  if (search) url.searchParams.set("search", search);

  const response = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch marketplace listings");
  }

  const data = (await response.json()) as { listings: MarketplaceListing[] };
  return data.listings;
}

/**
 * Fetch marketplace listings with optional category/search filters.
 */
export function useMarketplaceListings(category?: string, search?: string) {
  const accessToken = useAccessToken();
  const tokenRef = useRef(accessToken);
  tokenRef.current = accessToken;

  return useQuery({
    queryKey: marketplaceQueryKey(category, search),
    queryFn: () => fetchListings(tokenRef.current, category, search),
  });
}

/**
 * Install a marketplace listing into an organization.
 */
export function useInstallFromMarketplace() {
  const accessToken = useAccessToken();
  const tokenRef = useRef(accessToken);
  tokenRef.current = accessToken;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      listingId: string;
      organizationId: string;
    }) => {
      const response = await fetch(
        `${API_BASE_URL}/api/ai/marketplace/${params.listingId}/install`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${tokenRef.current}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            organizationId: params.organizationId,
          }),
        },
      );

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(data?.error ?? "Failed to install persona");
      }

      return (await response.json()) as {
        persona: { id: string; name: string };
      };
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["AgentMarketplace"],
      });
      queryClient.invalidateQueries({
        queryKey: agentPersonasQueryKey(variables.organizationId),
      });
      toast.success("Persona installed successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to install persona");
    },
  });
}

/**
 * Unpublish a listing from the marketplace.
 */
export function useUnpublishFromMarketplace() {
  const accessToken = useAccessToken();
  const tokenRef = useRef(accessToken);
  tokenRef.current = accessToken;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      listingId: string;
      organizationId: string;
    }) => {
      const response = await fetch(
        `${API_BASE_URL}/api/ai/marketplace/${params.listingId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${tokenRef.current}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            organizationId: params.organizationId,
          }),
        },
      );

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(data?.error ?? "Failed to unpublish listing");
      }

      return (await response.json()) as { success: boolean };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["AgentMarketplace"],
      });
      toast.success("Listing removed from marketplace");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to unpublish");
    },
  });
}
