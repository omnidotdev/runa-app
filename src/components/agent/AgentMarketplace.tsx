import { useCallback, useRef, useState } from "react";
import {
  DownloadIcon,
  Loader2Icon,
  SearchIcon,
  StoreIcon,
  TrashIcon,
  UserIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CATEGORY_LABELS,
  MARKETPLACE_CATEGORIES,
  useInstallFromMarketplace,
  useMarketplaceListings,
  useUnpublishFromMarketplace,
} from "@/lib/ai/hooks/useAgentMarketplace";

import type { MarketplaceCategory } from "@/lib/ai/hooks/useAgentMarketplace";

/** Max characters allowed in the search input. */
const MAX_SEARCH_LENGTH = 200;

interface AgentMarketplaceProps {
  organizationId: string;
}

export function AgentMarketplace({
  organizationId,
}: AgentMarketplaceProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Per-listing loading state to avoid globally disabling all buttons
  const [activeListingId, setActiveListingId] = useState<string | null>(null);

  const handleSearchChange = useCallback((value: string) => {
    const clamped = value.slice(0, MAX_SEARCH_LENGTH);
    setSearchQuery(clamped);
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearch(clamped.trim());
    }, 300);
  }, []);

  const { data: listings = [], isLoading } = useMarketplaceListings(
    selectedCategory,
    debouncedSearch || undefined,
  );

  const { mutate: install, isPending: isInstalling } =
    useInstallFromMarketplace();
  const { mutate: unpublish, isPending: isUnpublishing } =
    useUnpublishFromMarketplace();

  const handleInstall = useCallback(
    (listingId: string) => {
      setActiveListingId(listingId);
      install(
        { listingId, organizationId },
        { onSettled: () => setActiveListingId(null) },
      );
    },
    [install, organizationId],
  );

  const handleUnpublish = useCallback(
    (listingId: string) => {
      setActiveListingId(listingId);
      unpublish(
        { listingId, organizationId },
        { onSettled: () => setActiveListingId(null) },
      );
    },
    [unpublish, organizationId],
  );

  const handleCategoryToggle = useCallback(
    (category: MarketplaceCategory) => {
      setSelectedCategory((prev) =>
        prev === category ? undefined : category,
      );
    },
    [],
  );

  return (
    <div className="mt-4 flex flex-col gap-2 rounded-lg border p-3">
      <div className="flex items-center gap-2">
        <StoreIcon className="size-3.5 text-muted-foreground" />
        <h3 className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
          Marketplace
        </h3>
      </div>
      <p className="text-muted-foreground text-xs">
        Browse and install agent personas shared by other organizations.
      </p>

      {/* Search */}
      <div className="relative">
        <SearchIcon className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search personas..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-8 text-sm"
          aria-label="Search marketplace"
        />
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-1">
        {MARKETPLACE_CATEGORIES.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => handleCategoryToggle(category)}
            className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-colors ${
              selectedCategory === category
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
            aria-pressed={selectedCategory === category}
          >
            {CATEGORY_LABELS[category]}
          </button>
        ))}
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center gap-2 py-4 text-muted-foreground text-xs">
          <Loader2Icon className="size-3 animate-spin" />
          Loading marketplace...
        </div>
      )}

      {/* Empty state */}
      {!isLoading && listings.length === 0 && (
        <div className="flex flex-col items-center gap-1 py-6 text-center">
          <StoreIcon className="size-6 text-muted-foreground/40" />
          <p className="text-muted-foreground text-xs">
            {debouncedSearch || selectedCategory
              ? "No personas match your filters."
              : "No personas published yet."}
          </p>
        </div>
      )}

      {/* Listings grid */}
      {listings.length > 0 && (
        <div className="flex flex-col gap-1.5">
          {listings.map((listing) => {
            const isOwnOrg = listing.organizationId === organizationId;
            const isThisActive = activeListingId === listing.id;
            const isAnyActive = activeListingId !== null;

            return (
              <div
                key={listing.id}
                className="flex items-center justify-between gap-2 rounded-md border bg-muted/30 p-2.5"
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <span className="shrink-0 text-base">
                    {listing.personaIcon ?? (
                      <UserIcon className="size-4 text-muted-foreground" />
                    )}
                  </span>
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate font-medium text-xs">
                      {listing.title}
                    </span>
                    {listing.description && (
                      <span className="line-clamp-1 text-[10px] text-muted-foreground">
                        {listing.description}
                      </span>
                    )}
                    <div className="mt-0.5 flex items-center gap-2">
                      <span className="rounded bg-muted px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground">
                        {CATEGORY_LABELS[
                          listing.category as MarketplaceCategory
                        ] ?? listing.category}
                      </span>
                      <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                        <DownloadIcon className="size-2.5" />
                        {listing.installCount}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  {isOwnOrg ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 gap-1 px-2 text-[10px] text-destructive"
                      onClick={() => handleUnpublish(listing.id)}
                      disabled={isAnyActive}
                      aria-label={`Unpublish ${listing.title}`}
                    >
                      {isThisActive && isUnpublishing ? (
                        <Loader2Icon className="size-2.5 animate-spin" />
                      ) : (
                        <TrashIcon className="size-2.5" />
                      )}
                      Unpublish
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-6 gap-1 px-2 text-[10px]"
                      onClick={() => handleInstall(listing.id)}
                      disabled={isAnyActive}
                      aria-label={`Install ${listing.title}`}
                    >
                      {isThisActive && isInstalling ? (
                        <Loader2Icon className="size-2.5 animate-spin" />
                      ) : (
                        <DownloadIcon className="size-2.5" />
                      )}
                      Install
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
