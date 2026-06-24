# RCM Annotation Profiles

These are planning profiles, not final schemas.

## General Annotation Requirements

Every RCM annotation should attempt to include:

- `@context`
- `@id` when known or after persistence
- `@type: oa:Annotation`
- `oa:motivatedBy`
- `oa:hasTarget`
- `oa:hasBody`
- creator/agent
- created date
- evidence when useful

## Profile A — Property Assertion

Use when asserting metadata-like claims.

```json
{
  "@context": "../schemas/rcm-context.jsonld",
  "@type": "oa:Annotation",
  "oa:motivatedBy": "oa:describing",
  "oa:hasTarget": "tag:rcm.example,2026:thing/letter-1918-001",
  "oa:hasBody": {
    "@type": "rcm:PropertyAssertion",
    "rcm:predicate": "dc:creator",
    "rcm:object": "tag:rcm.example,2026:agent/allen-l-gooch"
  },
  "dcterms:creator": "tag:rcm.example,2026:agent/patrick-cuba",
  "dcterms:created": "2026-06-23",
  "rcm:evidence": [
    "https://example.org/wwi-letter#signature"
  ]
}
```

## Profile B — Relationship Assertion

Use when asserting an edge between nodes.

```json
{
  "@context": "../schemas/rcm-context.jsonld",
  "@type": "oa:Annotation",
  "oa:motivatedBy": "oa:linking",
  "oa:hasTarget": "tag:rcm.example,2026:agent/allen-l-gooch",
  "oa:hasBody": {
    "@type": "rcm:RelationshipAssertion",
    "rcm:predicate": "foaf:knows",
    "rcm:object": "tag:rcm.example,2026:agent/unnamed-sergeant-from-hachita"
  },
  "dcterms:creator": "tag:rcm.example,2026:agent/researcher-001",
  "rcm:evidence": [
    "https://example.org/transcription#line-42"
  ]
}
```

## Profile C — Collection Membership

Use when adding an item to a collection.

```json
{
  "@context": "../schemas/rcm-context.jsonld",
  "@type": "oa:Annotation",
  "oa:motivatedBy": "oa:classifying",
  "oa:hasTarget": "tag:rcm.example,2026:collection/wwi-correspondence",
  "oa:hasBody": "tag:rcm.example,2026:thing/letter-1918-001",
  "dcterms:creator": "tag:rcm.example,2026:agent/curator-001",
  "dcterms:created": "2026-06-23"
}
```

## Profile D — Representation Link

Use when linking a digital representation to a Thing.

```json
{
  "@context": "../schemas/rcm-context.jsonld",
  "@type": "oa:Annotation",
  "oa:motivatedBy": "oa:linking",
  "oa:hasTarget": "tag:rcm.example,2026:thing/letter-1918-001",
  "oa:hasBody": {
    "@type": "rcm:RepresentationLink",
    "rcm:representation": "https://example.org/iiif/manifest/123",
    "rcm:predicate": "rcm:hasRepresentation"
  },
  "dcterms:creator": "tag:rcm.example,2026:agent/rcm-resolver"
}
```

## Profile E — Concept Tagging

Use when a concept is present in or relevant to a target.

```json
{
  "@context": "../schemas/rcm-context.jsonld",
  "@type": "oa:Annotation",
  "oa:motivatedBy": "oa:tagging",
  "oa:hasTarget": {
    "source": "https://example.org/transcription",
    "selector": {
      "type": "TextPositionSelector",
      "start": 200,
      "end": 260
    }
  },
  "oa:hasBody": "tag:rcm.example,2026:place/hachita-nm"
}
```

## Profile F — Lacuna Creation/Identification

Use when evidence indicates the existence of something not yet resolved.

```json
{
  "@context": "../schemas/rcm-context.jsonld",
  "@id": "tag:rcm.example,2026:thing/unnamed-sergeant-from-hachita",
  "@type": ["rcm:Thing", "foaf:Person", "rcm:Lacuna"],
  "rdfs:label": "Unnamed sergeant from Hachita referenced in 1918 letter"
}
```

Then describe it through annotations rather than stuffing all observations into the object.

## Profile G — Disagreement / Challenge

Use when responding to an existing annotation.

```json
{
  "@context": "../schemas/rcm-context.jsonld",
  "@type": "oa:Annotation",
  "oa:motivatedBy": "oa:questioning",
  "oa:hasTarget": "tag:rcm.example,2026:annotation/asserted-creator-001",
  "oa:hasBody": {
    "@type": "TextualBody",
    "value": "The evidence may identify the signer, but not necessarily the physical scribe."
  },
  "dcterms:creator": "tag:rcm.example,2026:agent/researcher-002"
}
```

## Profile H — Machine Annotation

Only here should numeric confidence appear.

```json
{
  "@context": "../schemas/rcm-context.jsonld",
  "@type": "oa:Annotation",
  "oa:motivatedBy": "oa:tagging",
  "oa:hasTarget": "https://example.org/image/001.jpg#xywh=100,100,500,300",
  "oa:hasBody": {
    "@type": "rcm:MachineTag",
    "rdfs:label": "handwritten signature",
    "rcm:confidence": 0.82,
    "rcm:model": "example-vision-model-v0"
  },
  "dcterms:creator": "tag:rcm.example,2026:agent/machine-pipeline-001"
}
```

## Profile I — LDN Announcement

Use when publishing a collection, annotation, graph slice, or update.

```json
{
  "@context": [
    "https://www.w3.org/ns/activitystreams",
    "../schemas/rcm-context.jsonld"
  ],
  "@type": "Announce",
  "actor": "tag:rcm.example,2026:agent/project-001",
  "object": "tag:rcm.example,2026:collection/wwi-correspondence",
  "target": "https://rerum.example.org/inbox",
  "summary": "Published an RCM collection of WWI correspondence annotations."
}
```
