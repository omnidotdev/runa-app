import { FileJsonIcon } from "lucide-react";

export default function ProjectDataSection() {
  return (
    <div className="ml-2 flex flex-col gap-4 lg:ml-0">
      <h3 className="font-medium text-sm">Data</h3>
      <div className="flex items-center gap-2 rounded-lg border border-primary-200 bg-primary-50 px-4 py-3 text-primary-700 dark:border-primary-800 dark:bg-primary-950/50 dark:text-primary-300">
        <FileJsonIcon className="size-4 shrink-0" />
        <span className="text-sm">
          Exporting and importing project data as JSON is coming soon.
        </span>
      </div>
    </div>
  );
}
