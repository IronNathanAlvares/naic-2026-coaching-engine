import { Suspense } from "react";
import { ObserveSurface } from "@/features/manager-console/components/observe-surface";
import { managerApi } from "@/features/manager-console/api/managerApi";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = { title: "Log observation, Manager Console" };

export const dynamic = "force-dynamic";

/** Sync shell: paints immediately; the surface waits on the roster fetch that
 * feeds its staff picker, so it streams in behind the skeleton. */
export default function ObservePage() {
  return (
    <div className="mx-auto w-full max-w-4xl">
      <Suspense fallback={<ObserveSkeleton />}>
        <ObservePanels />
      </Suspense>
    </div>
  );
}

/** Both capture modes render their own heading, so the skeleton is
 * surface-shaped: the mode switch, a title bar, a subtitle bar, then a card. */
function ObserveSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-12 w-56 rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-8 w-72" />
        <Skeleton className="h-4 w-full max-w-md" />
      </div>
      <Card>
        <CardContent className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-xl" />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

async function ObservePanels() {
  // Real mode lists the live roster; mock mode falls back to the seed.
  const staff = await managerApi.listStaff();

  return (
    <div className="fade-up">
      <ObserveSurface staff={staff} />
    </div>
  );
}
