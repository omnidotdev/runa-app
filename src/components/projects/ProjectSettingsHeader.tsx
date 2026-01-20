import { getRouteApi, useCanGoBack, useRouter } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

const routeApi = getRouteApi(
  "/_auth/workspaces/$workspaceSlug/projects/$projectSlug/settings",
);

export default function ProjectSettingsHeader() {
  const { workspaceSlug, projectSlug } = routeApi.useParams();
  const { name } = routeApi.useLoaderData();
  const router = useRouter();
  const navigate = routeApi.useNavigate();
  const canGoBack = useCanGoBack();

  return (
    <div className="mb-10 ml-2 flex items-center gap-3 lg:ml-0">
      <Button
        variant="ghost"
        size="icon"
        aria-label="Go back"
        onClick={() =>
          canGoBack
            ? router.history.back()
            : navigate({
                to: "/workspaces/$workspaceSlug/projects/$projectSlug",
                params: { workspaceSlug, projectSlug },
              })
        }
      >
        <ArrowLeft className="size-4" />
      </Button>

      <h1 className="font-semibold text-2xl">{name}</h1>
    </div>
  );
}
