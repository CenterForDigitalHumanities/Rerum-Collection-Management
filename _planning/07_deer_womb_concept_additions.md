# DEER and WOMB Concept Additions for RCM

This supplement reviews `deer.pdf` and `womb.pdf` for concepts that materially add to the RERUM Collection Management planning package.

## Bottom Line

Yes: both PDFs add useful concepts. Some ideas are already present in the planning package, but these documents sharpen several implementation priorities:

1. **Maximum minimum interfaces** — project-specific interfaces should be detailed enough to prevent invalid data and hide ontology complexity, while remaining generic enough to reuse.
2. **DEER-style assembly** — rendered objects are composed from an anchor plus annotations targeting that anchor.
3. **Read-only independence** — public display interfaces should be able to load directly from RERUM URIs without depending on the original data-entry application.
4. **Configuration-driven fields and layouts** — project interfaces should define fields, validation, layouts, service endpoints, help text, vocabulary guidance, and input templates through configuration.
5. **Entity birth from selectors** — a fragment selector, text quote, or image region can be enough evidence to birth an entity anchor.
6. **Evidence classes/events** — WOMB lists existential, transitional, objective, and assertion events as broad categories of evidence for people and identities.
7. **Indexes and dynamic visualizations as graph products** — person/place indexes, categorical collections, GIS, comparative charts, and other visualizations should be generated from the same graph.
8. **Deep description of parts** — leaves, ranges, tables of contents, manuscript parts, parallel structures, and missing content should be describable and rearrangeable through annotation and IIIF-aware tools.
9. **Specific interfaces over general ontological burdens** — users should not need to understand web ontologies to create good linked data.

## 1. Maximum Minimum

DEER frames its goal as finding the "maximum minimum": raise infrastructure and interfaces high enough that little work is needed to customize a project, without requiring anything to be taken away.

For RCM, this should become a design principle:

> Build the smallest generic core that can support highly specific scholarly interfaces.

A generic annotation editor alone is not enough. RCM should make it easy to produce scoped interfaces where the user sees meaningful fields, controlled options, validation, help text, and visual affordances relevant to the project.

## 2. DEER-Style Composed Rendering

DEER's display model is a direct match for RCM:

1. Take an entity/anchor identifier.
2. Query annotations targeting that identifier.
3. Assemble the returned assertions into a displayable object.
4. Render using a known template.

This is a practical operating model for chonky nodes.

Important distinction:

- the anchor remains minimal;
- the display object is a temporary composition;
- the rendered view should be transparent about which annotations supplied which values.

## 3. Read-Only Interfaces Should Be Independent

DEER emphasizes that public read-only interfaces can load directly from RERUM URIs. That means the exhibition or viewer should not require the same application that created the data.

For RCM:

- data entry UI and public exhibit UI should be separable;
- collections should remain usable if the original editor disappears;
- static exhibits can hydrate from RERUM and JSON-LD;
- portable web components should be a long-term goal.

## 4. TinyThings / Proxy Pattern

DEER sits between a RERUM API proxy implementation such as TinyThings and specific HTML project interfaces. The proxy allows display interfaces to be repurposed for data entry.

For RCM:

- define a storage service boundary early;
- keep direct RERUM reads simple;
- route writes through a configurable service/proxy when authentication, API keys, validation, or project ownership matter;
- support sandbox/production switching explicitly.

## 5. Configuration-Driven Interfaces

DEER's configuration notes point toward:

- `fields[]`
- validation rules;
- `@context` aliases;
- layouts;
- service endpoint;
- input templates;
- valuation messages;
- help text;
- vocabulary descriptions.

For RCM, this suggests a project profile file such as:

```json
{
  "@context": "../schemas/rcm-context.jsonld",
  "id": "port-ledger-profile",
  "label": "Port Ledger Entity Extraction",
  "fields": [
    {
      "key": "rdfs:label",
      "label": "Observed label",
      "required": true,
      "input": "text"
    },
    {
      "key": "rdf:type",
      "label": "Suggested entity type",
      "input": "controlled-term",
      "options": ["foaf:Person", "schema:Product", "schema:Place", "crm:E5_Event", "rcm:Lacuna"]
    }
  ],
  "service": {
    "read": "https://store.rerum.io/v1/id/",
    "write": "https://tiny.rerum.io/app/"
  }
}
```

This lets RCM remain broad while individual projects become precise.

## 6. WOMB: Evidence Categories for Identity

WOMB adds a useful taxonomy for evidence of existence, especially for people:

- **Existential** — birth, death, resurrection, spawning;
- **Transitional** — adoption, marriage, coronation, conscription, employment, burial, graduation;
- **Objective** — mention, insult, congratulate, replace, divide, assert, attack;
- **Assertion** — simply declared by the creator.

These categories are valuable for RCM beyond micro-biographies. They can shape annotation motivations or body types for entity birth.

Possible planning vocabulary:

```json
{
  "rcm:evidenceClass": "rcm:ObjectiveMention"
}
```

Do not over-formalize too early, but preserve this as a seed for better UI prompts and filters.

## 7. Entity Birth from Selectors

WOMB's person-in-image example sharpens the entity-birth model:

- a fragment selector identifies a visual region;
- the annotator mints a unique empty entity anchor;
- an annotation asserts that the fragment depicts that anchor;
- additional annotations supply type, label, possible identity, or external links.

The important idea is that the entity can be initially empty. Its existence is created by reuse of the identifier and the evidentiary annotation.

This should be incorporated into the RCM MVP as:

- "Create Entity from Region";
- "Create Entity from Text Selection";
- "Create Entity from Time Segment";
- "Create Entity from Table Cell";
- "Create Entity from 3D Part / Viewpoint".

## 8. Labels Are Aids, Not Proof

WOMB makes a useful distinction: a loose label such as "Washington" can help users navigate, but stronger claims such as `foaf:givenName` or `owl:sameAs` require better evidence.

RCM should distinguish:

- display labels;
- names;
- authority alignments;
- exact identity assertions;
- external references;
- evidence bundles.

This is a subtle but important UI and data-model rule.

## 9. Indexes, Categorical Collections, and Dynamic Visualizations

WOMB explicitly calls out indexes, categorical collections, and dynamic visualizations as products of entity creation.

For RCM:

- a person index is a collection/view over entity annotations;
- a place index is a collection/view over geospatial assertions;
- a thematic collection is a query over asserted qualities;
- maps, timelines, and comparative charts should be graph renderings, not separate data silos.

## 10. Deep Description of Parts and Ranges

DEER's Deep Codex and Rejiggery examples add another important dimension: parts of wholes need deep, rearrangeable, annotation-based description.

RCM should support:

- manuscript leaves;
- sides of leaves;
- dismembered codex fragments;
- IIIF ranges;
- tables of contents;
- parallel codicological/content structures;
- missing content;
- reordered or proposed sequences;
- provenance of separated parts.

This strengthens the need for selectors, ranges, part-whole relationships, and multiple structural interpretations.

## 11. Development Plan Additions

Add these tasks to the roadmap:

### Project Profiles

Create a declarative profile format for fields, validation, layouts, terms, help text, and service endpoints.

### Composed Object Resolver

Build a function that takes an anchor URI and returns:

- base object;
- annotations targeting it;
- assembled display values;
- provenance map showing which annotation supplied each value.

### Entity-from-Selector MVP

Support entity creation from:

- text quote selector;
- image fragment selector;
- IIIF canvas region;
- document/page selection.

### Portable Read-Only Component

Create a minimal `<rcm-view>` or DEER-like component:

```html
<rcm-view rcm-id="tag:rcm.example,2026:thing/pharons" rcm-template="entity"></rcm-view>
```

### Structure/Ranges Pilot

Use IIIF ranges or a simple range-like JSON-LD object to represent a table of contents, manuscript structure, or rearranged sequence.

## 12. Recommendation

These PDFs do add to the concepts. The most important additions to fold into the main architecture are:

1. **Maximum minimum** as an interface design principle.
2. **Configuration-driven project profiles** as a bridge between generic infrastructure and specific scholarly workflows.
3. **Composed rendering from annotations** as the default display model.
4. **Entity birth from selectors** as a concrete MVP feature.
5. **Evidence categories** as a planning taxonomy.
6. **Labels vs stronger identity claims** as a UI/data distinction.
7. **Deep structure/range editing** as a future but architecturally important capability.
