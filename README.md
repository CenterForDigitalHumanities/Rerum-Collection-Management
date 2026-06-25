# RERUM Collection Management (RCM)

A collection management and exhibition tool, allowing for the creation of ad hoc collections of distributed or even unknown resources.

This is not a tool for collections of things that you have. It is for things that you know.
The typical workflow may look like this:

1. Find a record that is interesting;
2. Make it more interesting;
3. Share the result.

These results are most likely to be a collection of objects, but may be a single detail page.
In some cases, the entity you are attempting to define may not exist on the Internet, so you will make a place for it.

## Core Thesis

RCM is not primarily a repository. It is not primarily a CMS. It is a **knowledge graph workbench** where:

- Identity can be minimal.
- Descriptions are attributable assertions.
- Evidence is preserved and surfaced.
- Ambiguity and disagreement are first-class.
- Collections are dynamic and annotation-generated.
- Original resources can remain wherever they already live.
- RERUM provides a durable store for JSON-LD objects, annotations, and publication signals.
- Viewers and visualizers are modular clients over the same data graph.

## Design Principles

1. **JSON-LD Everywhere** — All internal structures expressible as JSON-LD. Private application objects may exist for convenience but must round-trip into JSON-LD without semantic loss.
2. **Non-Destructive Annotation** — RCM describes resources by reference. Source objects are never mutated.
3. **Virtual Collections by Preference** — RCM prefers collecting remote resources over copying them.
4. **Identity Through Evidence** — A node may exist because there is evidence that something exists, even without authority records, images, or catalog records.
5. **No Human Confidence Scores** — Scholarly assertions carry evidence, attribution, date, motivation, and provenance. Numeric confidence is reserved for machine-generated guesses.
6. **Chonky Nodes** — Dense, annotation-rich identity anchors built from many small, attributable, evidence-bearing assertions.

## Standards & Ecosystems

RCM is designed to interoperate with:

- **JSON-LD** — primary data format
- **Web Annotation (W3C OA)** — annotation model
- **IIIF** — image and manifest presentation
- **Dublin Core** — core metadata vocabulary
- **FOAF** — agent and social relationships
- **GeoJSON-LD** — spatial data
- **CIDOC CRM** — cultural heritage ontology
- **schema.org** — broader web compatibility
- **Linked Data Notifications (LDN)** — publication and announcement

## Project Structure

```
/
├── _planning/          # Planning artifacts, concepts, examples
├── src/
│   ├── core/           # Core model: Thing, Representation, Expression, Annotation
│   ├── connectors/     # Resource resolvers and external API connectors
│   ├── storage/        # RERUM client and persistence layer
│   ├── graph/          # Graph query, traversal, and manipulation
│   ├── viewers/        # Modular viewers: IIIF, PDF, A/V, map, etc.
│   └── ui/             # User interface components
├── schemas/            # JSON-LD contexts and JSON Schema validation
├── examples/           # Sample JSON-LD objects and annotation bundles
├── tests/              # Test fixtures and test suites
├── docs/
│   ├── architecture.md
│   ├── data-model.md
│   ├── annotation-profiles.md
│   └── decisions/      # Architecture Decision Records
└── README.md
```

## Development Phases

| Phase | Status | Description |
|-------|--------|-------------|
| **Phase 0** | ✅ Complete | Repository shaping, ADRs, documentation |
| **Phase 1** | ✅ Complete | Core model, JSON-LD shapes, serialization, test fixtures |
| **Phase 2** | ✅ Complete | RERUM client layer, LDN announcements |
| **Phase 3** | ✅ Complete | Resource resolver / connector layer, graph engine |
| **Phase 4** | ✅ Complete | Viewers (IIIF, PDF, Map, Network, Detail) |
| **Phase 5** | ✅ Complete | Project profiles and configuration |
| **Phase 6** | ✅ Complete | Entity birth, eventities, evidence classes |
| **Phase 7** | ✅ Complete | Publication, export, static site generation |

## Planning

Detailed planning documents live in the `_planning/` folder. See `_planning/README.md` for an overview.
