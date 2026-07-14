# RCM Architecture

## Overview

RERUM Collection Management (RCM) is an annotation-driven, graph-native system for cultural heritage and digital humanities resources. This document describes the evolving architecture.

## Architectural Layers

```
┌─────────────────────────────────────────────────────────┐
│                    UI / Viewers                         │
│  (IIIF, PDF, A/V, Map, Graph Inspector, Collection)    │
├─────────────────────────────────────────────────────────┤
│                   Graph Layer                           │
│  (Query, Traversal, Assembly, Disposable Graph)         │
├─────────────────────────────────────────────────────────┤
│                   Core Model                            │
│  (Thing, Representation, Expression, Annotation)        │
├─────────────────────────────────────────────────────────┤
│                  Connector Layer                         │
│  (Resource Resolver, IIIF, PDF, External APIs)          │
├─────────────────────────────────────────────────────────┤
│                  Storage Layer                           │
│  (RERUM Client, Persistence, Versioning)                │
└─────────────────────────────────────────────────────────┘
```

## Layer Descriptions

### Storage Layer

The RERUM persistence layer. Responsible for:

- Creating, reading, updating JSON-LD objects in RERUM.
- Querying annotations by target, creator, collection membership.
- Preserving version history.
- LDN inbox announcement (publication signals).
- Sandbox vs production configuration.

### Connector Layer

Resource resolvers and external API connectors. Responsible for:

- Accepting a URL and returning useful graph seeds.
- Extracting metadata from IIIF manifests, PDFs, web pages, catalog records.
- Normalizing external data into RCM annotation shapes.
- Caching metadata without claiming ownership of source resources.

### Core Model

The domain model. Responsible for:

- Thing: abstract identity anchors.
- Representation: digital forms that stand for a Thing.
- Expression: intellectual derivatives (transcriptions, translations, editions).
- Annotation: the primary data unit — attributable assertions with evidence.

### Graph Layer

Graph query, traversal, and assembly. Responsible for:

- Querying the annotation graph.
- Assembling "chonky nodes" from accumulated annotations.
- Supporting virtual collections (dynamic, annotation-generated).
- Providing a disposable/derived graph layer for fast discovery.

### UI / Viewers

Modular clients over the data graph. Responsible for:

- Rendering Things, collections, and annotations.
- Providing annotation composition interfaces.
- Supporting project-specific "maximum minimum" interfaces.
- IIIF, PDF, A/V, map, and network visualizations.

## Key Architectural Decisions

See `docs/decisions/` for Architecture Decision Records.

- [0001 — JSON-LD Everywhere](decisions/0001-jsonld-everywhere.md)
- [0002 — No Human Confidence Scores](decisions/0002-no-human-confidence.md)
- [0003 — Collections as Annotations](decisions/0003-collections-as-annotations.md)

## Design Influences

RCM draws inspiration from:

- **Zotero** — collecting references and attaching notes.
- **Omeka** — collections, items, exhibits, metadata, publication.
- **Tropy** — working through research images and documents.
- **Mirador** — IIIF viewing and image annotation.
- **DEER/WOMB** — composed rendering from anchors plus annotations.

RCM should not be a clone of any of these. Its distinguishing feature is treating description, relationships, collections, and publication as **JSON-LD annotations over identity anchors**.
