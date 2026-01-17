import { Skeleton } from "@/components/ui/skeleton";

const ProjectPageSkeleton = () => (
  <div className="flex size-full">
    <div className="flex size-full flex-col">
      {/* Header - matches px-6 py-4 border-b */}
      <div className="border-b px-6 py-4">
        <div className="flex flex-col gap-2">
          {/* Title - matches text-2xl line height */}
          <Skeleton className="h-8 w-48" />

          {/* Description - matches text-sm line height */}
          <Skeleton className="h-5 w-64" />

          {/* Controls row - matches mt-2 flex gap-2 */}
          <div className="mt-2 flex flex-wrap gap-2 sm:flex-nowrap">
            {/* Search input skeleton - matches h-9 with pl-10 */}
            <Skeleton className="h-9 w-full flex-1 sm:w-48 sm:flex-none" />

            {/* View toggle button - size-9 */}
            <Skeleton className="size-9 shrink-0" />

            {/* Filter button - size-9 */}
            <Skeleton className="size-9 shrink-0" />

            {/* Settings button - size-9 */}
            <Skeleton className="size-9 shrink-0" />
          </div>
        </div>
      </div>

      {/* Board area - matches bg and padding */}
      <div className="h-full overflow-hidden bg-primary-100/30 dark:bg-primary-950/15">
        <div className="h-full min-w-fit p-4">
          <div className="flex h-full gap-3">
            {/* Render 4 column skeletons */}
            {Array.from({ length: 4 }).map((_, columnIndex) => (
              <div
                key={columnIndex}
                className="flex h-full w-85 flex-col gap-2"
              >
                {/* Column header - matches mb-1 py-2 layout */}
                <div className="mb-1 flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    {/* Emoji placeholder */}
                    <Skeleton className="size-5 rounded" />
                    {/* Title */}
                    <Skeleton className="h-5 w-20" />
                    {/* Count badge */}
                    <Skeleton className="size-7 rounded-full" />
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Menu button */}
                    <Skeleton className="size-7 rounded-md" />
                    {/* Add button */}
                    <Skeleton className="size-7 rounded-md" />
                  </div>
                </div>

                {/* Cards container */}
                <div className="flex flex-1 flex-col overflow-hidden">
                  <div className="flex flex-col gap-2">
                    {/* Vary card count per column for visual interest */}
                    {Array.from({
                      length: [3, 2, 4, 1][columnIndex] ?? 2,
                    }).map((_, cardIndex) => (
                      <CardSkeleton key={cardIndex} />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const CardSkeleton = () => (
  <div className="rounded-lg border bg-background p-3">
    <div className="flex flex-col gap-1">
      <div className="flex items-start gap-2">
        <div className="mt-0.5 min-w-0 flex-1">
          {/* Task ID and priority row */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="size-3" />
          </div>
          {/* Content area - matches py-4 */}
          <div className="py-4">
            <Skeleton className="h-4 w-full max-w-[200px]" />
          </div>
        </div>
        {/* Avatar */}
        <Skeleton className="mt-2 size-5.5 rounded-full" />
      </div>

      {/* Bottom row - labels and due date */}
      <div className="grid grid-cols-4">
        <div className="col-span-3 flex items-end gap-1 p-1">
          <Skeleton className="h-5 w-14 rounded-full" />
          <Skeleton className="h-5 w-10 rounded-full" />
        </div>
        <div className="col-span-1 flex justify-end">
          <Skeleton className="h-5 w-16" />
        </div>
      </div>
    </div>
  </div>
);

export default ProjectPageSkeleton;
