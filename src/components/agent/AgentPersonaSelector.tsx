import { SparklesIcon, UserIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  PopoverContent,
  PopoverPositioner,
  PopoverRoot,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import type { AgentPersona } from "@/lib/options/agentPersonas.options";

interface AgentPersonaSelectorProps {
  personas: AgentPersona[];
  selectedPersonaId: string | null;
  onSelect: (personaId: string | null) => void;
}

export function AgentPersonaSelector({
  personas,
  selectedPersonaId,
  onSelect,
}: AgentPersonaSelectorProps) {
  const enabledPersonas = personas.filter((p) => p.enabled);

  if (enabledPersonas.length === 0) return null;

  const selected = enabledPersonas.find((p) => p.id === selectedPersonaId);

  return (
    <PopoverRoot positioning={{ placement: "bottom-start" }}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          aria-label="Select persona"
          className="h-6 gap-1 px-2 text-xs"
        >
          {selected ? (
            <>
              {selected.icon ?? <UserIcon className="size-3" />}
              <span className="max-w-[100px] truncate">{selected.name}</span>
            </>
          ) : (
            <>
              <SparklesIcon className="size-3" />
              <span>Default</span>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverPositioner>
        <PopoverContent className="w-56 p-1.5">
          <p className="mb-1 px-2 font-medium text-[10px] text-muted-foreground uppercase tracking-wide">
            Persona
          </p>
          <button
            type="button"
            onClick={() => onSelect(null)}
            className={cn(
              "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-xs transition-colors hover:bg-muted",
              !selectedPersonaId && "bg-muted font-medium",
            )}
          >
            <SparklesIcon className="size-3 shrink-0" />
            <span>Default Agent</span>
          </button>
          {enabledPersonas.map((persona) => (
            <button
              key={persona.id}
              type="button"
              onClick={() => onSelect(persona.id)}
              className={cn(
                "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-xs transition-colors hover:bg-muted",
                selectedPersonaId === persona.id && "bg-muted font-medium",
              )}
            >
              <span className="shrink-0 text-sm">
                {persona.icon ?? <UserIcon className="size-3" />}
              </span>
              <div className="flex min-w-0 flex-col">
                <span className="truncate">{persona.name}</span>
                {persona.description && (
                  <span className="truncate text-[10px] text-muted-foreground">
                    {persona.description}
                  </span>
                )}
              </div>
            </button>
          ))}
        </PopoverContent>
      </PopoverPositioner>
    </PopoverRoot>
  );
}
