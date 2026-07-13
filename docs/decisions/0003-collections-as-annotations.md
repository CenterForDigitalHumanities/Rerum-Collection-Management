# ADR-0003: Collections as Annotations

**Status:** Accepted
**Date:** 2026-06-24
**Context:** RCM collection model design decision

## Problem

Traditional collection models treat collections as containers: items are added to or removed from a fixed set. This approach:

1. Implies a single authoritative view of collection membership.
2. Makes it difficult to have overlapping, competing, or provisional collections.
3. Doesn't preserve the provenance of collection decisions (who added what, when, and why).
4. Doesn't support virtual collections where membership is dynamically computed.

## Decision

Collections in RCM are annotation-generated groupings. Collection membership is an assertion that a Thing belongs to a collection, with evidence and attribution. A collection is not a container; it is a Thing that other Things are asserted to belong to.

```json
{
  "@type": "oa:Annotation",
  "oa:motivatedBy": "oa:categorizing",
  "oa:hasTarget": "tag:rcm.example,2026:thing/letter-1918-001",
  "oa:hasBody": {
    "@type": "rcm:CollectionMembership",
    "rcm:collection": "tag:rcm.example,2026:collection/wwi-correspondence"
  },
  "dcterms:creator": "tag:rcm.example,2026:agent/patrick-cuba",
  "dcterms:created": "2026-06-23"
}
```

## Consequences

### Positive
- Collection membership is attributable and versioned.
- Multiple agents can maintain different views of the same collection.
- Virtual collections can be defined by query or rule without materializing membership.
- Collection decisions can be disputed or revised without losing history.
- Collections can overlap, nest, or contradict.

### Negative
- Querying "what's in this collection" requires annotation traversal rather than simple container lookup.
- Users expecting traditional container semantics may find the model unfamiliar.
- Performance considerations for large collections (indexing needed).

## References
- [_planning/01_foundational_plan.md](../_planning/01_foundational_plan.md)
- [Web Annotation Data Model](https://www.w3.org/TR/annotation-model/)
