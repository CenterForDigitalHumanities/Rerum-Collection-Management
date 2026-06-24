# RERUM Collection Management (RCM) — Foundational Plan

## 1. Short Definition

**RERUM Collection Management (RCM)** is a modular, annotation-driven, graph-native system for gathering, describing, relating, exhibiting, and republishing cultural heritage and digital humanities resources.

It should feel intelligible to people familiar with Zotero, Omeka, Tropy, Mirador, and IIIF ecosystems, but it should not be a clone of any of them. Its distinguishing feature is that it treats description, relationships, collections, and publication as **JSON-LD annotations over identity anchors** rather than as fixed database records.

## 2. Core Thesis

RCM is not primarily a repository. It is not primarily a CMS. It is not primarily a file manager.

RCM is a **knowledge graph workbench** where:

- identity can be minimal;
- descriptions are attributable assertions;
- evidence is preserved and surfaced;
- ambiguity and disagreement are first-class;
- collections are dynamic and annotation-generated;
- original resources can remain wherever they already live;
- RERUM provides a durable store for JSON-LD objects, annotations, and publication signals;
- viewers and visualizers are modular clients over the same data graph.

## 3. Design Commitments

### 3.1 JSON-LD Everywhere

All internal structures should be expressible as JSON-LD. Private application objects may exist for convenience, but they must round-trip into JSON-LD without semantic loss.

### 3.2 Non-Destructive Annotation

RCM should not require edits to source objects. If a library record, IIIF manifest, image, PDF, web page, transcription, or 3D model already exists elsewhere, RCM describes it by reference.

### 3.3 Virtual Collection by Preference

RCM should prefer collecting remote resources, not copying them. It can cache metadata for performance, but the conceptual model should distinguish cached representation from source identity.

### 3.4 Identity Through Evidence

A node may be created because there is evidence that something exists, even if it has no authority file, stable catalog record, image, label, or complete metadata.

### 3.5 No Human Confidence Scores

Scholarly assertions should not include numeric confidence. If an assertion is worth making, it should be made with author, date, scope, motivation, and evidence. Ambiguity should be expressed through multiple annotations, alternative assertions, disputed claims, and evidentiary context—not through a false decimal.

Numeric confidence is reserved for machine-generated annotation where a classifier, entity recognizer, OCR model, relationship engine, or alignment tool is genuinely guessing.

### 3.6 Chonky Nodes

One long-term goal is to create "chonky" Linked Data nodes: identity anchors dense enough with annotations, relationships, representations, citations, contradictions, and references that previously undervalued or unlinked records become graspable and discoverable.

A chonky node is not chonky because it has one gigantic metadata record. It is chonky because many small, attributable, evidence-bearing annotations accumulate around it.

## 4. The FRBR-esque Core

RCM needs a distinction between an abstract thing and its digital appearances.

### 4.1 Thing

A **Thing** is the intellectual, material, conceptual, or historical entity being gathered around.

Examples:

- the actual letter written in 1918;
- a manuscript codex;
- a person referenced but unnamed in a document;
- a place implied by a route book;
- a lost object known only from a catalog reference;
- a performance, event, oral history, artifact, inscription, image subject, or collection concept.

A Thing can be minimal:

```json
{
  "@id": "tag:rcm.example,2026:thing/letter-1918-001",
  "@type": "crm:E22_Human-Made_Object"
}
```

### 4.2 Representation

A **Representation** is a digital or descriptive embodiment of a Thing.

Examples:

- IIIF Manifest;
- IIIF Canvas;
- image URL;
- PDF;
- A/V file;
- 3D model;
- catalog record;
- web page;
- TEI file;
- OCR text;
- transcription page.

```json
{
  "@id": "https://example.org/iiif/manifest/123",
  "@type": "iiif:Manifest",
  "rcm:represents": "tag:rcm.example,2026:thing/letter-1918-001"
}
```

### 4.3 Expression

An **Expression** is an intellectual rendering or derivative of a Thing.

Examples:

- transcription;
- translation;
- edition;
- normalized text;
- summary;
- audio reading;
- model reconstruction.

```json
{
  "@id": "tag:rcm.example,2026:expression/transcription-001",
  "@type": ["schema:DigitalDocument", "rcm:Expression"],
  "rcm:isExpressionOf": "tag:rcm.example,2026:thing/letter-1918-001"
}
```

### 4.4 Annotation

An **Annotation** is the primary unit of change, description, interpretation, collection, and relationship.

Annotations can:

- describe a Thing;
- connect a Representation to a Thing;
- assert a relationship between Things or Agents;
- identify a concept in a passage;
- add a Thing to a Collection;
- cite evidence;
- mark disagreement;
- announce publication;
- attach a viewer-specific selector;
- preserve machine-generated guesses.

### 4.5 Collection

A **Collection** should be represented as an identity anchor plus membership annotations. It may also have collection-level descriptive annotations.

A collection is not merely a static list. It can be a dynamic aggregation of annotations.

### 4.6 Lacuna / Placeholder

A **Lacuna** is a Thing known, suspected, or required by evidence but not yet independently represented.

Examples:

- an unnamed sergeant implied by a letter;
- a missing manuscript referenced in an inventory;
- a family relation inferred from multiple letters;
- a destroyed building known from a map notation;
- an unavailable recording mentioned in a finding aid.

Lacunae are crucial because they turn absence into a research object.

## 5. Annotation as Metadata

Traditional systems make metadata look like stable properties of a record:

```json
{
  "creator": "Allen L. Gooch",
  "date": "1918-06-07"
}
```

RCM should prefer assertions:

```json
{
  "@type": "oa:Annotation",
  "oa:motivatedBy": "oa:describing",
  "oa:hasTarget": "tag:rcm.example,2026:thing/letter-1918-001",
  "oa:hasBody": {
    "@type": "rcm:PropertyAssertion",
    "rcm:predicate": "dc:creator",
    "rcm:object": "tag:rcm.example,2026:agent/allen-l-gooch"
  },
  "dcterms:creator": "tag:rcm.example,2026:agent/researcher-001",
  "dcterms:created": "2026-06-23",
  "rcm:evidence": [
    "https://example.org/letter-image#xywh=1200,2400,300,100",
    "https://example.org/transcription#line-90"
  ]
}
```

This allows:

- later disagreement;
- multiple creators asserting different things;
- evidence-specific review;
- display of provenance;
- graph queries over assertions;
- dynamic collection and publication.

## 6. Ambiguity and Controversy as Features

RCM should not try to flatten claims into a single truth row. It should support:

- competing labels;
- disputed dates;
- multiple sameAs assertions;
- contradictory attributions;
- uncertain but explicit lacunae;
- revision through new annotations;
- annotation versioning through RERUM history;
- UI affordances for "also asserted", "disputed", "supported by", "challenged by", and "based on".

The interface should reveal the scholarly conversation instead of hiding it.

## 7. RERUM Role

RERUM should act as:

- store for JSON-LD Things, annotations, collections, expressions, and derived representations;
- version-aware persistence layer;
- source for dynamic views assembled from annotations;
- publication target for LDN notifications;
- interop bridge for tools such as Mirador, DEER-like renderers, custom viewers, browser extensions, and desktop clients.

## 8. LDN as Publication and Announcement

LDN should be treated not merely as export but as a scholarly event mechanism.

Possible announcement types:

- a collection was published;
- an annotation set was released;
- a new relationship was asserted;
- a tool generated candidate annotations;
- a scholar responded to or challenged an assertion;
- a new representation was associated with a Thing.

## 9. Viewer Architecture

Visualizers should not own data. They should consume graph shapes.

Initial viewer families:

- IIIF image/manuscript viewer;
- PDF viewer;
- A/V viewer with timed annotations;
- map viewer using GeoJSON-LD or geospatial annotations;
- genealogy viewer using kinship/relationship edges;
- network viewer using general graph edges;
- timeline viewer using temporal annotations;
- 3D viewer for glTF/OBJ-style resources;
- text/transcription viewer;
- comparison viewer for multiple representations of the same Thing.

## 10. Development North Star

The MVP should prove this flow:

1. User adds a URL for an Internet resource.
2. RCM detects whether it is IIIF, JSON-LD, image, PDF, HTML, or unknown.
3. RCM mints or selects a Thing anchor.
4. RCM creates a Representation link.
5. User makes one or more annotations on the Thing and/or Representation.
6. User collects the Thing through a collection membership annotation.
7. RCM assembles a collection view dynamically from annotations.
8. User exports JSON-LD and/or sends an LDN announcement.

If that works, the rest can expand naturally.
