# UI, Viewers, Plugins, and Client Strategy

## Design Language

RCM can rhyme with Omeka in the sense that users understand collections, items, exhibits, metadata, and publication. It can rhyme with Zotero in the sense of collecting references and attaching notes. It can rhyme with Tropy in the sense of working through research images and documents. It can rhyme with Mirador in the sense of IIIF viewing and image annotation.

But conceptually, RCM should remain annotation-first.

## MVP UI

Screens:

1. Resource Resolver
2. Thing Creator/Selector
3. Annotation Composer
4. Collection Builder
5. Collection Viewer
6. Graph Inspector
7. Export/LDN Publisher

## Display Principle

Do not present a single flat metadata record unless it is clear that this is an assembled view from annotations.

Possible UI language:

- "Assertions about this Thing"
- "Representations"
- "Evidence"
- "Also asserted"
- "Disputed"
- "Machine suggestions"
- "Collection membership"
- "Publication events"

## Viewer Plugins

Every viewer receives a graph slice, not an application database record.

### IIIF Viewer

- Open manifest/canvas;
- show image annotations;
- allow region selectors;
- connect annotations to either canvas/fragment or Thing.

### PDF Viewer

- page-level and text-selection annotations;
- link pages to Things;
- link extracted OCR/text Expressions.

### A/V Viewer

- time-based selectors;
- transcript alignment;
- segment/entity tagging.

### Map Viewer

- render Places or Things with geospatial assertions;
- allow uncertain or competing location assertions without replacing one another.

### Genealogy Viewer

- render kinship and social relationships;
- distinguish asserted, evidenced, and machine-suggested relationships;
- allow unnamed/lacuna persons.

### Network Viewer

- general graph exploration;
- filter by predicate, creator, collection, evidence, date.

### 3D Viewer

- render model representation;
- allow annotations on model, parts, viewpoints, or related conceptual Things.

## Browser Extension Wishlist

The browser extension should:

- detect IIIF manifests and JSON-LD;
- capture page URL;
- create quick annotation;
- add to RCM collection;
- send to RERUM;
- support selected text / image region where feasible.

## Desktop Wishlist

A desktop app could support:

- local file working sets;
- batch metadata drafting;
- local cache of annotations;
- sync/publish to RERUM;
- offline annotation;
- eventual export to JSON-LD or static publication.

## Technology Notes

React and TypeScript are acceptable for planning and MVP implementation, especially for component ecosystem access. However, the durable architecture should be framework independent.

Recommended rule:

- Core graph logic: framework-agnostic TypeScript/JavaScript module.
- RERUM client: framework-agnostic.
- Connectors: framework-agnostic.
- UI: whatever is productive.
