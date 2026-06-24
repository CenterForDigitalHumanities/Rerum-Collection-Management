# RCM Development Plan

## Phase 0 — Planning and Repository Shaping

Goal: make the repository understandable before implementation accelerates.

Suggested folders:

```text
/_planning
  /sources
  /schemas
  /examples
  /diagrams
  /decisions
/src
  /core
  /connectors
  /storage
  /graph
  /viewers
  /ui
/schemas
/examples
/tests
/docs
```

Recommended first files:

- `README.md` — project identity and principles;
- `docs/architecture.md` — evolving architecture;
- `docs/data-model.md` — Thing / Representation / Expression / Annotation;
- `docs/annotation-profiles.md` — canonical shapes;
- `docs/decisions/0001-jsonld-everywhere.md`;
- `docs/decisions/0002-no-human-confidence.md`;
- `docs/decisions/0003-collections-as-annotations.md`.

## Phase 1 — Core Model and JSON-LD Shapes

Goal: implement the smallest model that can support future complexity.

Deliverables:

- starter JSON-LD context;
- TypeScript or JavaScript interfaces for core objects;
- JSON Schema or SHACL-like validation sketches;
- annotation profile examples;
- test fixtures for Things, Representations, Collections, and Annotations.

Key decision: TypeScript is useful for guardrails, but do not confuse TypeScript types with the real data model. JSON-LD is the model.

## Phase 2 — RERUM Client

Goal: make RERUM persistence boring and reliable.

Core methods:

```text
createObject(jsonld)
updateObject(id, jsonld)
getObject(id)
queryAnnotationsByTarget(targetId)
queryAnnotationsByCreator(agentId)
queryCollectionMembership(collectionId)
announceToInbox(notification, inboxUrl)
```

Important behavior:

- keep RERUM metadata separate from scholarly assertions;
- preserve version history;
- allow object creation with minimal identity;
- allow safe sandbox vs production configuration;
- never hide remote provenance.

## Phase 3 — Resource Resolver / Connector Layer

Goal: paste URL, get useful graph seeds.

Initial connectors:

1. IIIF Presentation v3 manifest;
2. IIIF Presentation v2 manifest where needed;
3. JSON-LD generic document;
4. image URL;
5. PDF URL;
6. HTML page with basic metadata extraction;
7. unknown URL fallback.

Connector output should be a proposal, not a forced import:

```json
{
  "thing": { "@id": "..." },
  "representations": [],
  "suggestedAnnotations": [],
  "warnings": []
}
```

## Phase 4 — MVP User Interface

Goal: prove the annotation-first workflow.

Minimum screens:

- Add Resource URL;
- Review detected metadata;
- Create/select Thing;
- Add Annotation;
- Create Collection;
- Collection View;
- JSON-LD Export;
- LDN Announcement form.

Important UI principle:

The UI should show assertions as assertions. It should not collapse them into a fake master record without showing provenance.

## Phase 5 — Dynamic Collection Assembly

Goal: collections are query results over membership annotations.

Features:

- list all Things in a collection;
- show why each item is included;
- filter by annotation creator, type, evidence, representation type, date, geography;
- export resolved view;
- generate IIIF Collection-like view when relevant.

## Phase 6 — Viewer Plugin System

Goal: make visualization modular.

Plugin contract sketch:

```ts
interface RcmViewerPlugin {
  id: string;
  label: string;
  canRender(nodeOrGraph: unknown): boolean;
  render(container: HTMLElement, graphSlice: RcmGraphSlice): Promise<void> | void;
}
```

Initial plugins:

- Generic metadata/assertion viewer;
- IIIF viewer;
- Network viewer;
- Map viewer;
- PDF viewer.

Later plugins:

- Genealogy viewer;
- Timeline viewer;
- A/V timed annotation viewer;
- 3D model viewer;
- Text/transcription alignment viewer.

## Phase 7 — Entity and Lacuna Workbench

Goal: support discovered, partial, unnamed, and disputed entities.

Features:

- create placeholder Thing from evidence;
- attach labels as annotations;
- mark unresolved identity;
- propose sameAs links;
- show alternative identity assertions;
- reconcile without deletion.

## Phase 8 — Publication and LDN

Goal: make sharing graph updates first-class.

Deliverables:

- JSON-LD bundle export;
- LDN notification generator;
- RERUM inbox target config;
- external inbox target config;
- static HTML exhibition prototype;
- citation page for a collection.

## Phase 9 — Desktop and Browser Extension Wishlist

Desktop app, Tropy-like:

- local file watcher;
- local metadata draft;
- batch resource linking;
- local-first annotation cache;
- push to RERUM.

Browser extension:

- capture current URL;
- detect IIIF/JSON-LD/meta tags;
- create annotation against page/selection;
- add to collection;
- send to RERUM.

## Build Order Recommendation

1. JSON-LD context and examples.
2. RERUM client abstraction.
3. URL resolver with IIIF first.
4. Minimal annotation editor.
5. Dynamic collection view.
6. JSON-LD export.
7. LDN announcement.
8. Viewer plugin proof of concept.
