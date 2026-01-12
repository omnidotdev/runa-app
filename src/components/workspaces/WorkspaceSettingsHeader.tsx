import { useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi, useCanGoBack, useRouter } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import workspaceOptions from "@/lib/options/workspace.options";
import capitalizeFirstLetter from "@/lib/util/capitalizeFirstLetter";
import { useOrganization } from "@/providers/OrganizationProvider";

const routeApi = getRouteApi("/_auth/workspaces/$workspaceSlug/settings");

export default function WorkspaceSettingsHeader() {
  const { session } = routeApi.useRouteContext();
  const { workspaceId } = routeApi.useLoaderData();
  const { workspaceSlug } = routeApi.useParams();
  const router = useRouter();
  const navigate = routeApi.useNavigate();
  const canGoBack = useCanGoBack();
  const orgContext = useOrganization();

  const { data: workspace } = useSuspenseQuery({
    ...workspaceOptions({
      rowId: workspaceId,
      userId: session?.user?.rowId!,
    }),
    select: (data) => data?.workspace,
  });

  // Resolve org name from JWT claims
  const orgName = workspace?.organizationId
    ? orgContext?.getOrganizationById(workspace.organizationId)?.name
    : undefined;

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
          {capitalizeFirstLetter(workspace?.tier!)}
        </Badge>
      </div>
    </div>
  );
}
