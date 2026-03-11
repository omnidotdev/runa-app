import { EllipsisIcon } from "lucide-react";

import { Favicon, Tooltip } from "@/components/core";
import { Button } from "@/components/ui/button";
import {
  MenuContent,
  MenuItem,
  MenuPositioner,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu";
import getDomainLabel from "@/lib/util/getDomainLabel";

interface ProjectLink {
  rowId: string;
  url: string;
  title?: string | null;
  order: number;
}

interface Props {
  links: ProjectLink[];
}

const ProjectLinks = ({ links }: Props) => {
  const sortedLinks = [...links]
    .filter((link) => link.url)
    .sort((a, b) => a.order - b.order);

  const visibleLinks = sortedLinks.slice(0, 3);
  const overflowLinks = sortedLinks.slice(3);

  if (!sortedLinks.length) return null;

  return (
    <div className="ml-1 flex items-center gap-0.5 border-border border-l pl-3">
      {visibleLinks.map((link) => (
        <Tooltip
          key={link.rowId}
          tooltip={link.title || getDomainLabel(link.url)}
          trigger={
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md p-1.5 text-base-500 hover:bg-accent hover:text-foreground dark:text-base-400"
            >
              <Favicon url={link.url} />
            </a>
          }
        />
      ))}

      {overflowLinks.length > 0 && (
        <MenuRoot>
          <MenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-7 text-base-500 dark:text-base-400"
            >
              <EllipsisIcon className="size-4" />
            </Button>
          </MenuTrigger>
          <MenuPositioner>
            <MenuContent>
              {overflowLinks.map((link) => (
                <MenuItem key={link.rowId} value={link.rowId} asChild>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <Favicon url={link.url} />
                    <span>{link.title || getDomainLabel(link.url)}</span>
                  </a>
                </MenuItem>
              ))}
            </MenuContent>
          </MenuPositioner>
        </MenuRoot>
      )}
    </div>
  );
};

export default ProjectLinks;
