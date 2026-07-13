# ADR-0002: No Human Confidence Scores

**Status:** Accepted
**Date:** 2026-06-24
**Context:** RCM annotation model design decision

## Problem

Many annotation and classification systems use numeric confidence scores (e.g., 0.87) to express uncertainty. This creates several problems in a scholarly context:

1. It implies a false precision for human judgment.
2. It flattens nuanced scholarly disagreement into a single number.
3. It makes it difficult to distinguish between "I'm fairly sure" and "the evidence strongly supports this."
4. It conflates machine-generated guesses with human assertions.

## Decision

Scholarly assertions in RCM shall not include numeric confidence scores. If an assertion is worth making, it shall be made with:

- **Author** — who made the assertion.
- **Date** — when it was made.
- **Scope** — what it applies to.
- **Motivation** — why it was made.
- **Evidence** — cited resources that support it.

Ambiguity shall be expressed through:
- Multiple annotations from different agents.
- Alternative assertions.
- Disputed claims with reasoning.
- Evidentiary context.

Numeric confidence is reserved exclusively for machine-generated annotations where a classifier, entity recognizer, OCR model, relationship engine, or alignment tool is genuinely guessing.

## Consequences

### Positive
- Scholarly assertions carry proper provenance and evidence.
- Disagreement is first-class and inspectable.
- Machine and human annotations are clearly distinguished.
- Encourages rigorous evidence citation over hand-waving.

### Negative
- Users familiar with confidence scores may find the model unfamiliar.
- Aggregating or ranking assertions requires more sophisticated logic.
- Machine annotations need clear labeling to avoid confusion with human claims.

## References
- [_planning/01_foundational_plan.md §3.5](../_planning/01_foundational_plan.md)
- [_planning/00_manifest.txt](../_planning/00_manifest.txt)
