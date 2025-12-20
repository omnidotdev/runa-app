import { LogOut } from "lucide-react";

import {
  AvatarFallback,
  AvatarImage,
  AvatarRoot,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import signOut from "@/lib/auth/signOut";

interface Props {
  session: {
    user: {
      image?: string | null;
      username: string;
      name: string;
      email: string;
    };
  } | null;
  isOmniTeamMember?: boolean;
}

/**
 * Profile header.
 */
const ProfileHeader = ({ session, isOmniTeamMember }: Props) => (
  <div className="mb-8 flex flex-col items-center gap-6 rounded-2xl p-6">
    <Button
      variant="outline"
      size="sm"
      className="mt-4 self-end hover:border-red-200 hover:bg-red-50 hover:text-red-700 dark:hover:border-red-800 dark:hover:bg-red-950 dark:hover:text-red-300"
      onClick={signOut}
      aria-label="Sign out"
    >
      <LogOut className="size-4" />
      Sign Out
    </Button>

    <AvatarRoot className="size-28 ring-4 ring-primary/10">
      <AvatarImage
        src={session?.user.image ?? undefined}
        alt={session?.user.username}
      />
      <AvatarFallback className="font-semibold text-2xl">
        {session?.user.username?.slice(0, 2).toUpperCase()}
      </AvatarFallback>
    </AvatarRoot>

    <div className="text-center">
      <h2 className="font-bold text-xl tracking-tight">{session?.user.name}</h2>

      <p className="mt-1 text-muted-foreground text-sm">
        {session?.user.email}
      </p>

      {isOmniTeamMember && (
        <Badge className="mt-2 bg-linear-to-r from-primary-400 to-primary-600 text-base-950">
          Omni Team
        </Badge>
      )}
    </div>
  </div>
);

export default ProfileHeader;
