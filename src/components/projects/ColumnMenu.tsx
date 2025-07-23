import { useSuspenseQuery } from "@tanstack/react-query";
import { useLoaderData, useRouteContext } from "@tanstack/react-router";
import { EyeOffIcon, MoreHorizontalIcon, Trash2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  MenuContent,
  MenuItem,
  MenuPositioner,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu";
import { useUpdateUserPreferenceMutation } from "@/generated/graphql";
import userPreferencesOptions from "@/lib/options/userPreferences.options";

interface Props {
  columnId: string;
}

const ColumnMenu = ({ columnId }: Props) => {
  const { projectId } = useLoaderData({
    from: "/_auth/workspaces/$workspaceSlug/projects/$projectSlug/",
  });

  const { session } = useRouteContext({
    from: "/_auth/workspaces/$workspaceSlug/projects/$projectSlug/",
  });

  const { data: userPreferences } = useSuspenseQuery({
    ...userPreferencesOptions({
      userId: session?.user?.rowId!,
      projectId,
    }),
    select: (data) => data?.userPreferenceByUserIdAndProjectId,
  });

  const { mutate: updateUserPreferences } = useUpdateUserPreferenceMutation({
    meta: {
      invalidates: [
        userPreferencesOptions({
          userId: session?.user?.rowId!,
          projectId,
        }).queryKey,
      ],
    },
  });
  return (
    <MenuRoot
      positioning={{
        strategy: "fixed",
        placement: "bottom-end",
      }}
    >
      <MenuTrigger asChild>
        <Button variant="ghost" size="xs" className="size-5">
          <MoreHorizontalIcon className="size-4" />
        </Button>
      </MenuTrigger>

      <MenuPositioner>
        <MenuContent className="focus-within:outline-none">
          <MenuItem
            value="hide"
            className="flex cursor-pointer items-center gap-2"
            onClick={() => {
              updateUserPreferences({
                rowId: userPreferences?.rowId!,
                patch: {
                  hiddenColumnIds: [
                    ...(userPreferences?.hiddenColumnIds as string[]),
                    columnId,
                  ],
                },
              });
            }}
          >
            <EyeOffIcon />
            <span>Hide Column</span>
          </MenuItem>

          <MenuItem
            value="delete"
            className="flex cursor-pointer items-center gap-2"
            variant="destructive"
            disabled
          >
            <Trash2Icon />
            <span>Delete All Tasks</span>
          </MenuItem>
        </MenuContent>
      </MenuPositioner>
    </MenuRoot>
  );
};

export default ColumnMenu;
