# ADR-0001: JSON-LD Everywhere

**Status:** Accepted
**Date:** 2026-06-24
**Context:** RCM foundational design decision

## Problem

RCM needs a data format that is:
- Interoperable with cultural heritage and linked data ecosystems.
- Capable of expressing complex relationships and provenance.
- Machine-readable while remaining human-readable.
- Suitable for both internal storage and external exchange.

## Decision

All internal RCM structures shall be expressible as JSON-LD. Private application objects may exist for convenience (e.g., TypeScript interfaces, in-memory representations), but they must round-trip into JSON-LD without semantic loss.

## Consequences

### Positive
- Direct compatibility with RERUM, IIIF, CIDOC CRM, schema.org, and broader RDF ecosystem.
- Data portability: RCM data can be consumed by any JSON-LD-aware tool.
- Context-based vocabulary resolution avoids hard-coded ontology dependencies.
- Enables linked data publishing and SPARQL endpoint integration.

### Negative
- JSON-LD processing adds complexity compared to plain JSON.
- Context management requires discipline (versioning, resolution).
- Some UI frameworks prefer flat object models; mapping layer needed.

## References
- [JSON-LD 1.1 Specification](https://www.w3.org/TR/json-ld11/)
- [RERUM](https://rerum.github.io/)
- [_planning/01_foundational_plan.md](../_planning/01_foundational_plan.md)
