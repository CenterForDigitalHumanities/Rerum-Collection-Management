# RCM Annotation Profiles

Canonical annotation shapes for RCM. These are planning profiles, not final schemas.

## General Requirements

Every RCM annotation should attempt to include:

- `@context` — pointing to the RCM JSON-LD context.
- `@id` — when known or after persistence.
- `@type: oa:Annotation`.
- `oa:motivatedBy` — the motivation for this annotation.
- `oa:hasTarget` — what the annotation is about.
- `oa:hasBody` — what the annotation asserts.
- `dcterms:creator` — the agent who created the annotation.
- `dcterms:created` — the creation date.
- `rcm:evidence` — cited resources supporting the assertion (when available).

---

## Profile A — Property Assertion

Use when asserting metadata-like claims about a target.

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

---

## Profile B — Relationship Assertion

Use when asserting an edge between two nodes.

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

---

## Profile C — Collection Membership

Use when asserting that a Thing belongs to a collection.

```json
{
  "@context": "../schemas/rcm-context.jsonld",
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

---

## Profile D — Representation Link

Use when linking a Representation to a Thing.

```json
{
  "@context": "../schemas/rcm-context.jsonld",
  "@type": "oa:Annotation",
  "oa:motivatedBy": "oa:describing",
  "oa:hasTarget": "tag:rcm.example,2026:thing/letter-1918-001",
  "oa:hasBody": {
    "@type": "rcm:RepresentationLink",
    "rcm:representation": "tag:rcm.example,2026:rep/letter-1918-001-scan",
    "rcm:role": "iiif:Manifest"
  },
  "dcterms:creator": "tag:rcm.example,2026:agent/patrick-cuba",
  "dcterms:created": "2026-06-23"
}
```

---

## Profile E — Machine Annotation

Use for machine-generated annotations (entity recognition, OCR, classification). These may include numeric confidence.

```json
{
  "@context": "../schemas/rcm-context.jsonld",
  "@type": "oa:Annotation",
  "oa:motivatedBy": "oa:classifying",
  "oa:hasTarget": "tag:rcm.example,2026:expr/letter-1918-001-ocr",
  "oa:hasBody": {
    "@type": "rcm:MachineAnnotation",
    "rcm:entity": "tag:rcm.example,2026:agent/allen-l-gooch",
    "rcm:type": "schema:Person",
    "rcm:confidence": 0.94,
    "rcm:generator": "spaCy NER v3.7"
  },
  "dcterms:creator": "tag:rcm.example,2026:agent/ner-pipeline-001",
  "dcterms:created": "2026-06-23T14:32:00Z"
}
```

---

## Profile F — Disputed Assertion

Use when recording a claim that is contested or alternative.

```json
{
  "@context": "../schemas/rcm-context.jsonld",
  "@type": "oa:Annotation",
  "oa:motivatedBy": "oa:describing",
  "oa:hasTarget": "tag:rcm.example,2026:thing/artifact-001",
  "oa:hasBody": {
    "@type": "rcm:DisputedAssertion",
    "rcm:predicate": "dc:date",
    "rcm:object": "1917",
    "rcm:disputes": [
      "tag:rcm.example,2026:annotation/assertion-042"
    ],
    "rcm:reason": "Alternative dating based on postal mark analysis."
  },
  "dcterms:creator": "tag:rcm.example,2026:agent/researcher-002",
  "dcterms:created": "2026-06-23"
}
```

---

## Motivation Vocabulary

RCM uses the Web Annotation motivation vocabulary:

| Motivation | Use Case |
|---|---|
| `oa:describing` | Asserting properties or metadata about a target. |
| `oa:linking` | Asserting relationships between nodes. |
| `oa:categorizing` | Collection membership, tagging. |
| `oa:classifying` | Type assignment, entity classification. |
| `oa:commenting` | Scholarly commentary, notes. |
| `oa:highlighting` | Drawing attention to a specific region or passage. |
| `oa:tagging` | Assigning keywords or labels. |
