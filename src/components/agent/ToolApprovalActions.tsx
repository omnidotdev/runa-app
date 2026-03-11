import { useSuspenseQuery } from "@tanstack/react-query";
import { useLoaderData } from "@tanstack/react-router";
import { CheckIcon, XIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import toolRegistryOptions from "@/lib/options/toolRegistry.options";
import { formatApprovalDetails } from "./utils/approvalFormatters";

interface ToolApprovalActionsProps {
  approvalId: string;
  toolName: string;
  input: unknown;
  onApprovalResponse: (response: { id: string; approved: boolean }) => void;
}

export function ToolApprovalActions({
  approvalId,
  toolName,
  input,
  onApprovalResponse,
}: ToolApprovalActionsProps) {
  // Fetch tool registry (cached with staleTime: Infinity)
  const { data: registry } = useSuspenseQuery(toolRegistryOptions());

  // Get project prefix from route loader data
  const { projectPrefix } = useLoaderData({
    from: "/_app/workspaces/$workspaceSlug/projects/$projectSlug/",
  });

  const [isResponding, setIsResponding] = useState(false);

  const handleResponse = (approved: boolean) => {
    setIsResponding(true);
    onApprovalResponse({ id: approvalId, approved });
  };

  return (
    <div className="flex flex-col gap-3">
      <p className="text-pretty text-sm">
        {formatApprovalDetails(
          toolName,
          input,
          registry,
          projectPrefix ?? undefined,
        )}
      </p>
      <div className="flex gap-2">
        <Button
          size="sm"
          className="h-8 flex-1 gap-1.5"
          disabled={isResponding}
          onClick={() => handleResponse(true)}
        >
          <CheckIcon className="size-3.5" />
          Approve
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-8 flex-1 gap-1.5"
          disabled={isResponding}
          onClick={() => handleResponse(false)}
        >
          <XIcon className="size-3.5" />
          Deny
        </Button>
      </div>
    </div>
  );
}
