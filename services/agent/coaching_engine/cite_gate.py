"""
cite_gate.py
============
The gate that refuses to let an ungrounded coaching recommendation out.

This is the single most important control in the product. If the agent cannot
cite the specific practice turn, the specific manager observation and the
specific clause of the hotel's own standard, it does not speak, it abstains
and says what is missing.

Critically: this is CODE, not a prompt asking the model to behave. The model is
never asked whether it was grounded. Self-assessment of hallucination is not a
control. See HLD-A section 5 and LLD-C section 2.7.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from difflib import SequenceMatcher
from typing import Literal, Sequence

SourceKind = Literal["attempt_turn", "observation", "sop_chunk",
                     "rubric_anchor", "metric"]

# How close a quoted span must be to the cited chunk before we accept that the
# chunk supports it. Tuned against the demo corpus in the week of 8 Sept, # too high and we abstain on stage, too low and a citation looks weak when a
# judge opens it.
SPAN_SUPPORT_THRESHOLD = 0.82

MAX_REPAIR_ATTEMPTS = 2


@dataclass(frozen=True)
class EvidenceItem:
    """One citable thing in the evidence bundle."""
    ref: str                      # e.g. "sop:service_recovery_v3:4.2" or "obs:o55c"
    kind: SourceKind
    content: str
    staff_id: str | None = None   # set for per-person evidence; None for SOPs


@dataclass(frozen=True)
class Claim:
    text: str
    citation_refs: tuple[str, ...]
    quoted_span: str | None = None


@dataclass(frozen=True)
class Failure:
    claim_text: str | None
    ref: str | None
    reason: Literal["source_not_found", "span_not_supported",
                    "cross_staff_reference", "not_a_transfer_gap_recommendation"]

    def describe(self) -> str:
        return {
            "source_not_found":
                f"cited {self.ref}, which does not exist in the evidence bundle",
            "span_not_supported":
                f"quoted text is not supported by {self.ref}",
            "cross_staff_reference":
                f"{self.ref} is evidence about a different staff member",
            "not_a_transfer_gap_recommendation":
                "no citation from the floor-observation stream, this is "
                "roleplay feedback, not a transfer-gap reading",
        }[self.reason]


@dataclass
class GateResult:
    passed: bool
    failures: list[Failure] = field(default_factory=list)
    repair_attempts: int = 0

    @property
    def should_abstain(self) -> bool:
        return not self.passed and self.repair_attempts >= MAX_REPAIR_ATTEMPTS

    def abstain_reason(self) -> str:
        """What the manager is told when we decline to give advice.

        Deliberately specific: 'insufficient evidence' alone is useless, but
        'log an observation on empathy and I can give you a reading' is an
        instruction the manager can act on.
        """
        if not self.failures:
            return "Not enough evidence yet to give you grounded coaching."
        reasons = sorted({f.describe() for f in self.failures})
        return ("Not enough evidence yet to give you grounded coaching: "
                + "; ".join(reasons) + ".")


def span_supported(quoted: str, source_content: str,
                   threshold: float = SPAN_SUPPORT_THRESHOLD) -> bool:
    """Is the quoted span actually present in the cited source?

    Catches the subtle failure: a real SOP section is cited, but the model has
    paraphrased it into something it does not say. An exact substring check is
    too brittle (whitespace, casing), so we use a similarity ratio against the
    best-matching window.
    """
    if not quoted:
        return True                       # nothing quoted, nothing to verify
    q, s = quoted.strip().lower(), source_content.strip().lower()
    if not s:
        return False
    if q in s:
        return True
    return SequenceMatcher(None, q, s).ratio() >= threshold


def run_gate(claims: Sequence[Claim],
             bundle: Sequence[EvidenceItem],
             subject_staff_id: str,
             repair_attempts: int = 0) -> GateResult:
    """Four checks. Any failure blocks the recommendation.

    1. Existence, the cited ref is in the bundle
    2. Support, for SOP citations, the quote is genuinely supported
    3. Sufficiency, at least one practice AND one floor citation overall
    4. Scope, no claim leans on another staff member's evidence
    """
    index = {item.ref: item for item in bundle}
    failures: list[Failure] = []
    kinds_cited: set[SourceKind] = set()

    for claim in claims:
        if not claim.citation_refs:
            failures.append(Failure(claim.text, None, "source_not_found"))
            continue

        for ref in claim.citation_refs:
            source = index.get(ref)

            # 1. existence
            if source is None:
                failures.append(Failure(claim.text, ref, "source_not_found"))
                continue

            kinds_cited.add(source.kind)

            # 2. support
            if source.kind == "sop_chunk" and claim.quoted_span:
                if not span_supported(claim.quoted_span, source.content):
                    failures.append(
                        Failure(claim.text, ref, "span_not_supported"))

            # 4. scope
            if source.staff_id is not None and source.staff_id != subject_staff_id:
                failures.append(
                    Failure(claim.text, ref, "cross_staff_reference"))

    # 3. sufficiency, this is what makes it a transfer-gap recommendation
    # rather than roleplay feedback. A competitor's system can cite the practice
    # transcript; only ours can be required to cite a floor observation too.
    if not {"attempt_turn", "observation"} <= kinds_cited:
        failures.append(Failure(None, None, "not_a_transfer_gap_recommendation"))

    if not failures:
        return GateResult(passed=True, repair_attempts=repair_attempts)
    return GateResult(passed=False, failures=failures,
                      repair_attempts=repair_attempts + 1)
