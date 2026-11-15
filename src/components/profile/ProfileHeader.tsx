import {
  AvatarFallback,
  AvatarImage,
  AvatarRoot,
} from "@omnidotdev/thornberry/avatar";
import { Badge } from "@omnidotdev/thornberry/badge";

interface Props {
  session: {
    user: {
      image?: string | null;
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
    <AvatarRoot className="ring-primary/10 size-28 ring-4">
      <AvatarImage
        src={session?.user.image ?? undefined}
        alt={session?.user.name}
      />
      <AvatarFallback className="text-2xl font-semibold">
        {session?.user.name?.slice(0, 2).toUpperCase()}
      </AvatarFallback>
    </AvatarRoot>

    <div className="text-center">
      <h2 className="text-xl font-bold tracking-tight">{session?.user.name}</h2>

      <p className="text-muted-foreground mt-1 text-sm">
        {session?.user.email}
      </p>

      {isOmniTeamMember && (
        <Badge className="from-primary-400 to-primary-600 text-base-950 mt-2 bg-linear-to-r">
          Omni Team
        </Badge>
      )}
    </div>
  </div>
);

export default ProfileHeader;
