import { getRouteApi, useCanGoBack, useRouter } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getTierFromSubscription } from "@/lib/types/tier";
import capitalizeFirstLetter from "@/lib/util/capitalizeFirstLetter";
import { useOrganization } from "@/providers/OrganizationProvider";

const routeApi = getRouteApi("/_auth/workspaces/$workspaceSlug/settings");

export default function WorkspaceSettingsHeader() {
  const { organizationId, subscription, prices } = routeApi.useLoaderData();
  const { workspaceSlug } = routeApi.useParams();
  const router = useRouter();
  const navigate = routeApi.useNavigate();
  const canGoBack = useCanGoBack();
  const orgContext = useOrganization();

  // Resolve org name from JWT claims
  const orgName = organizationId
    ? orgContext?.getOrganizationById(organizationId)?.name
    : undefined;

  // Derive tier from subscription
  const tier = getTierFromSubscription(
    subscription,
    prices,
    subscription?.priceId,
  );

  return (
    <div className="mb-10 ml-2 flex items-center justify-between lg:ml-0">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          aria-label="Go back"
          onClick={() =>
            canGoBack
              ? router.history.back()
              : navigate({
                  to: "/workspaces/$workspaceSlug/projects",
                  params: { workspaceSlug },
                })
          }
        >
          <ArrowLeft className="size-4" />
        </Button>
        <div className="flex flex-col gap-2">
          <h1 className="font-semibold text-2xl">{orgName ?? "Workspace"}</h1>
        </div>
        <Badge className="bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
          {capitalizeFirstLetter(tier)}
        </Badge>
      </div>
    </div>
  );
}
