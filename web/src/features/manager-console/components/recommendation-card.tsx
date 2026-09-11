"use client";

import { useState } from "react";
import {
  BookOpen,
  ChevronDown,
  ClipboardList,
  MessageSquareQuote,
  Radar,
  Target,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  citationKindLabel,
  classificationMeta,
  formatRate,
  primaryCalibration,
} from "@/lib/format";
import type { Citation, Recommendation } from "@/lib/types";

const citationIcons: Record<Citation["kind"], typeof MessageSquareQuote> = {
  attempt_turn: MessageSquareQuote,
  observation: ClipboardList,
  sop_chunk: BookOpen,
  rubric_anchor: Target,
  metric: Radar,
};

/** Label fallback for kinds the shared formatter has not been taught yet. */
const citationKindFallback: Partial<Record<Citation["kind"], string>> = {
  rubric_anchor: "Rubric anchor",
};

const classificationTone: Record<string, string> = {
  behavioural: "bg-[oklch(0.76_0.07_74)]/15 text-[oklch(0.45_0.07_72)] border-[oklch(0.76_0.07_74)]/30",
  process: "bg-[oklch(0.63_0.06_115)]/12 text-[oklch(0.43_0.06_115)] border-[oklch(0.63_0.06_115)]/30",
  policy: "bg-[oklch(0.66_0.09_30)]/12 text-[oklch(0.45_0.08_30)] border-[oklch(0.66_0.09_30)]/30",
};

interface MergedClaim {
  claim: string;
  kinds: Citation["kind"][];
  sources: Citation[];
}

/**
 * One row per claim, not one row per source.
 *
 * The agent emits a claim once per citation, so a claim supported by two
 * practice turns arrived as two identical sentences. Twelve of the sixteen
 * recommendations in the live queue read that way, which is the single biggest
 * reason this card looked long: a quarter of it was the same sentence twice.
 *
 * Merging is presentation only. Every source is kept and still opens.
 */
function mergeClaims(citations: Citation[]): MergedClaim[] {
  const byClaim = new Map<string, MergedClaim>();
  for (const c of citations) {
    const key = (c.claim || "").trim();
    const found = byClaim.get(key);
    if (found) {
      found.sources.push(c);
      if (!found.kinds.includes(c.kind)) found.kinds.push(c.kind);
    } else {
      byClaim.set(key, { claim: key, kinds: [c.kind], sources: [c] });
    }
  }
  return [...byClaim.values()];
}

function kindLabel(kind: Citation["kind"]): string {
  return (
    citationKindLabel[kind] ??
    citationKindFallback[kind] ??
    kind.replace("_", " ")
  );
}

export function RecommendationCard({
  recommendation,
}: {
  recommendation: Recommendation;
}) {
  // Shut by default. A manager deciding confirm or reject does not read the
  // evidence every time; they read it when something looks wrong. Leaving it
  // open put the longest block on the screen above the decision.
  const [showWhy, setShowWhy] = useState(false);
  const [showSay, setShowSay] = useState(false);
  const [openSource, setOpenSource] = useState<string | null>(null);

  // Both of these are absent on real data in ways the type did not admit: an
  // abstained recommendation has no classification, and calibration arrives as
  // an array. Resolve them once, here, instead of at four call sites.
  const meta = recommendation.classification
    ? classificationMeta[recommendation.classification]
    : null;
  const calibration = primaryCalibration(recommendation.calibration);
  const citations = recommendation.citations ?? [];
  const claims = mergeClaims(citations);

  // Both of these are absent on real data in ways the type did not admit: an
  // abstained recommendation has no classification, and calibration arrives as
  // an array. Resolve them once, here, instead of at four call sites.
  const meta = recommendation.classification
    ? classificationMeta[recommendation.classification]
    : null;
  const calibration = primaryCalibration(recommendation.calibration);
  const citations = recommendation.citations ?? [];

  return (
    <Card>
      <CardContent className="space-y-4 p-5 md:p-6">
        {/* ---------------------------------------------------- the verdict */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="outline"
            className={
              recommendation.classification
                ? classificationTone[recommendation.classification]
                : undefined
            }
          >
            {meta ? meta.label : "Abstained"}
          </Badge>
          {citations.length > 0 && (
            <span className="text-xs text-muted-foreground">
              {citations.length} cited claims
            </span>
          )}
          <span className="ml-auto text-xs tabular-nums text-muted-foreground/70">
            {recommendation.trace_id?.slice(0, 8)}
          </span>
        </div>

        <h2 className="text-lg font-semibold leading-snug md:text-xl">
          {recommendation.headline}
        </h2>

        {/* ------------------------------------------------------ the action */}
        {recommendation.suggested_action && (
          <div className="rounded-xl border border-primary/25 bg-accent/30 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
              Do this
            </p>
            <p className="mt-1 text-sm font-medium leading-relaxed">
              {recommendation.suggested_action}
            </p>
          </div>
        )}

        {/* ------------------------------------- everything else, one tap away */}
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Evidence — every claim, checkable in one tap
          </p>
          {citations.map((citation) => {
            const open = openCitation === citation.source_ref;
            const Icon = citationIcons[citation.kind];
            return (
              <div
                key={citation.source_ref}
                className={`rounded-xl border transition-colors ${
                  open ? "border-primary/40 bg-accent/20" : "bg-muted/30"
                }`}
              >
                <button
                  type="button"
                  onClick={() =>
                    setOpenCitation(open ? null : citation.source_ref)
                  }
                  className="flex w-full items-center gap-3 p-3 text-left"
                >
                  <Icon
                    className={`size-4 shrink-0 ${open ? "text-primary" : "text-muted-foreground"}`}
                  />
                  <span className="flex-1 text-sm font-medium">
                    {citation.claim}
                  </span>
                  <Badge variant="outline" className="hidden sm:inline-flex">
                    {citationKindLabel[citation.kind] ??
                      citationKindFallback[citation.kind] ??
                      citation.kind.replace("_", " ")}
                  </Badge>
                  <ChevronDown
                    className={`size-4 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
                  />
                </button>
                {open && citation.quoted_span && (
                  <div className="border-t px-3 py-3">
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      “{citation.quoted_span}”
                    </p>
                    <p className="mt-1.5 text-xs tabular-nums text-muted-foreground/70">
                      {citation.source_ref}
                    </p>
                  </div>
                ))}
              </div>
            </Disclosure>
          )}
        </div>

        {calibration && (
          <div className="flex flex-wrap items-center gap-3 rounded-xl bg-muted/40 p-4 text-xs">
            <span className="text-muted-foreground">
              AI agreement on {calibration.dimension.replace("_", " ")}:
            </span>
            <span className="text-sm font-bold">
              {formatRate(calibration.agreement_rate)}
            </span>
            <span className="text-muted-foreground">
              (n = {calibration.sample_size})
            </span>
            {calibration.advice && (
              <p className="w-full text-muted-foreground">
                {calibration.advice}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/** A labelled row that opens. Same shape for both sections so the card has one
 * disclosure pattern rather than two that look almost alike. */
function Disclosure({
  open,
  onToggle,
  label,
  note,
  children,
}: {
  open: boolean;
  onToggle: () => void;
  label: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`rounded-xl border ${open ? "bg-muted/20" : "bg-card"}`}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex min-h-11 w-full items-center gap-2 px-3 text-left text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronDown
          className={`size-4 shrink-0 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
        {label}
        {note && (
          <span className="ml-auto text-xs font-normal text-muted-foreground/70">
            {note}
          </span>
        )}
      </button>
      {open && children}
    </div>
  );
}
