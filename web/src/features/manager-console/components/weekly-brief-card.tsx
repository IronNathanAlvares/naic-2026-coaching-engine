"use client";

import { useState } from "react";
import { ArrowUpRight, FileText, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { managerApi } from "@/features/manager-console/api/managerApi";
import type { WeeklyBriefResponse } from "@/lib/types";

/**
 * Turn the patterns on this page into something a GM will actually read.
 *
 * WHY IT LIVES HERE AND NOWHERE ELSE
 *
 * This page ends on a question. A manager can see that eleven people share a
 * problem and that the cause is the process rather than the people, and then
 * they have to go and make that case to somebody who was not looking at this
 * screen. Writing that up is a real job, it takes half an hour, and it is the
 * step where the insight usually dies.
 *
 * The brief is assembled from exactly the patterns rendered above, so the
 * button is next to its own evidence. Putting it on the overview instead would
 * mean commissioning a document about numbers you cannot see.
 *
 * WHAT LEAVES THE BUILDING
 *
 * Only the aggregates already on this screen. Every pattern here has already
 * cleared the k-anonymity threshold, so no individual is identifiable in it,
 * and no name, id or transcript is in the prompt. That is worth stating on the
 * card rather than in a policy document, because the manager pressing the
 * button is the person accountable for it.
 *
 * WHY IT LINKS OUT INSTEAD OF SHOWING A DOCUMENT
 *
 * Manus is asynchronous and the work takes minutes. Faking an inline result
 * would mean either blocking the page on a spinner nobody will wait through,
 * or polling for something the API does not yet store. The handle is the
 * honest answer: commissioned, here is where it will appear.
 */
export function WeeklyBriefCard({ patternCount }: { patternCount: number }) {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">(
    "idle",
  );
  const [result, setResult] = useState<WeeklyBriefResponse | null>(null);

  const commission = async () => {
    setState("sending");
    try {
      const response = await managerApi.commissionWeeklyBrief();
      setResult(response);
      setState("done");
    } catch {
      setState("error");
    }
  };

  // Nothing has cleared the threshold, so there is genuinely nothing to write
  // about. Saying so beats a button that returns an empty document.
  if (patternCount === 0) return null;

  return (
    <div className="fade-up rounded-2xl border bg-card p-4 md:p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 gap-3">
          <span
            aria-hidden
            className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"
          >
            <FileText className="size-4.5" />
          </span>
          <div className="min-w-0">
            <h2 className="text-base font-semibold leading-snug">
              Write this up for the GM
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              A one page operations brief from{" "}
              {patternCount === 1
                ? "the pattern below"
                : `all ${patternCount} patterns below`}
              : what changed, what it costs to leave alone, and the single
              action worth taking this week, with the role that owns each one.
            </p>
          </div>
        </div>

        {state !== "done" && (
          <Button
            type="button"
            onClick={() => void commission()}
            disabled={state === "sending"}
            className="shrink-0"
          >
            {state === "sending" ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Commissioning
              </>
            ) : (
              <>
                <FileText className="size-4" />
                Commission the brief
              </>
            )}
          </Button>
        )}
      </div>

      {/* Said on the card, not in a policy page, because the person pressing
          the button is the one accountable for what it sends. */}
      <p className="mt-3 flex items-start gap-2 border-t pt-3 text-xs text-muted-foreground">
        <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-primary" />
        <span>
          Only the patterns above are sent, and every one of them has already
          cleared the k-anonymity threshold. No name, no staff id, no
          transcript. Written by Manus, which takes a few minutes.
        </span>
      </p>

      {state === "error" && (
        <p className="mt-3 rounded-xl border border-dashed p-3 text-sm text-muted-foreground">
          Could not reach the writing service. The patterns above are unchanged;
          try again in a moment.
        </p>
      )}

      {state === "done" && result?.status === "nothing_to_report" && (
        <p className="mt-3 rounded-xl border border-dashed p-3 text-sm text-muted-foreground">
          {result.detail ??
            "Nothing reached the k-anonymity threshold this period, so there is nothing to write up."}
        </p>
      )}

      {state === "done" && result?.status === "submitted" && (
        <div className="mt-3 rounded-xl border border-primary/30 bg-primary/5 p-3">
          <p className="text-sm font-medium">
            Commissioned
            {typeof result.patterns_included === "number" && (
              <>
                {" "}
                from {result.patterns_included}{" "}
                {result.patterns_included === 1 ? "pattern" : "patterns"}
              </>
            )}
            .
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            It takes a few minutes to write. You do not have to wait here.
          </p>
          {result.task_url && (
            <a
              href={result.task_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex min-h-10 items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              Open the brief
              <ArrowUpRight className="size-3.5" />
            </a>
          )}
        </div>
      )}
    </div>
  );
}
