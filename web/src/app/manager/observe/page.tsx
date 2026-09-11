import { Suspense } from "react";
import { ObservationForm } from "@/features/manager-console/components/observation-form";
import { managerApi } from "@/features/manager-console/api/managerApi";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = { title: "Log observation, Manager Console" };

/** Rendered per request: the roster is live data, and a manager should not be
 * offered a colleague who left last week because the page was built on Tuesday. */
export const dynamic = "force-dynamic";

export default async function ObservePage() {
  // The picker was showing the thirteen seeded names while the property has
  // forty-eight people, so a manager could not log an observation about most
  // of their own team. The seed answers only in mock mode, or if the roster
  // call fails, because a picker with somebody in it beats an empty screen.
  const roster = await managerApi.listStaff().catch(() => []);
  const staff: StaffMember[] = roster.length
    ? roster.map((s) => ({
        id: s.id,
        name: s.name,
        role: s.role ?? "staff",
        department: s.department ?? "other",
        started_at: "",
      }))
    : staffMembers;

export const dynamic = "force-dynamic";

/** Sync shell: paints immediately; the form waits on the roster fetch that
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

/** The form renders its own heading, so the skeleton is form-shaped: a
 * title bar, a subtitle bar, then a card of input-sized lines. */
function ObserveSkeleton() {
  return (
    <div className="space-y-6">
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
      <ObservationForm staff={staff} />
    </div>
  );
}
