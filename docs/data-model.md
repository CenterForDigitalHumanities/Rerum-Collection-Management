# RCM Data Model

The core data model distinguishes between four kinds of entities:

1. **Thing** — the abstract anchor
2. **Representation** — a digital form of a Thing
3. **Expression** — an intellectual derivative of a Thing
4. **Annotation** — an attributable assertion about a target

This FRBR-esque distinction is foundational to RCM.

## 1. Thing

A **Thing** is the intellectual, material, conceptual, or historical entity being gathered around. A Thing can be:

- A physical object (a letter, a manuscript, an artifact).
- A person (named or unnamed).
- A place (real or implied).
- An event (a performance, a battle, a meeting).
- A concept (a collection theme, a research category).
- A lost or inferred entity (known only from references).

A Thing may be minimal — just an identity anchor:

```json
{
  "@id": "tag:rcm.example,2026:thing/letter-1918-001",
  "@type": "crm:E22_Human-Made_Object"
}
```

### Thing Lifecycle

Things follow a lifecycle from encounter to rich description:

1. **Encountered** — a string, mark, image region, or passage suggests a possible entity.
2. **Anchored** — RCM mints, records, or stages an identifier.
3. **Described** — one or more responsible agents make annotations about it.
4. **Related** — the entity gains edges to sources, people, places, events, collections, or concepts.
5. **Reconciled** — it may be linked to a known authority or another RCM Thing.
6. **Absorbed** — it may be treated as part of another entity or a mistaken duplicate.
7. **Invalidated** — it may be challenged or deprecated, but the history of why it was created remains useful.

### Chonky Nodes

A "chonky node" is a Thing made dense through accumulated annotation. The goal is not fat records but dense connectivity. A chonky node may have:

- Multiple labels.
- Uncertain or competing identities.
- Many representations.
- Annotations by different agents.
- Citation trails.
- Connections to people, places, events, groups, materials, and objects.
- LDN announcements.
- Machine-generated suggestions clearly separated from human claims.

## 2. Representation

A **Representation** is any externally or internally addressable digital form that stands for, depicts, encodes, catalogs, scans, records, transcribes, models, or otherwise represents a Thing.

Examples:

- A IIIF manifest for a scanned letter.
- A catalog record URL.
- A photograph of an artifact.
- A 3D model.
- A cached metadata snapshot.

Representations are not the Thing itself. They are addressable forms that point to or depict it.

```json
{
  "@id": "tag:rcm.example,2026:rep/letter-1918-001-scan",
  "@type": "rcm:Representation",
  "rcm:represents": "tag:rcm.example,2026:thing/letter-1918-001",
  "iiif:manifest": "https://iiif.example.org/manifest/letter-1918-001"
}
```

## 3. Expression

An **Expression** is an intellectual derivative or rendering of a Thing. This distinction is helpful when a scan, transcription, translation, edition, and commentary should all relate to the same conceptual node rather than to one another in arbitrary chains.

Examples:

- A transcription of a handwritten letter.
- A translation of a foreign-language document.
- A critical edition of a manuscript.
- An OCR-generated text layer.

```json
{
  "@id": "tag:rcm.example,2026:expr/letter-1918-001-transcription",
  "@type": "rcm:Expression",
  "rcm:expresses": "tag:rcm.example,2026:thing/letter-1918-001",
  "dc:creator": "tag:rcm.example,2026:agent/transcriber-001",
  "dc:description": "Line-by-line transcription of the original letter."
}
```

## 4. Annotation

An **Annotation** is the primary data unit in RCM. It is where meaning is recorded. Every annotation should carry:

- **Target** — what the annotation is about.
- **Body** — what the annotation asserts.
- **Motivation** — why the annotation was made (describing, linking, tagging, etc.).
- **Creator** — who made the annotation.
- **Created Date** — when the annotation was made.
- **Evidence** — cited resources that support the assertion (when available).
- **Provenance** — how the annotation was generated (human, machine, imported).

### Assertions vs Confidence

Scholarly assertions should not include numeric confidence scores. If an assertion is worth making, it should be made with author, date, scope, motivation, and evidence. Ambiguity should be expressed through:

- Multiple annotations.
- Alternative assertions.
- Disputed claims.
- Evidentiary context.

Numeric confidence is reserved for machine-generated annotations where a classifier, entity recognizer, OCR model, relationship engine, or alignment tool is genuinely guessing.

### Lacunae

A **Lacuna** is a placeholder or negative-space entity. It exists because evidence implies it, not because an authority already exists. Lacunae are first-class Things in RCM.

## Relationships Between Entities

```
Thing ◄──────── Representation  (represents a Thing)
Thing ◄──────── Expression      (expresses a Thing)
Thing ◄──────── Annotation      (targets a Thing)
Representation ◄── Annotation   (targets a Representation)
Expression ◄───── Annotation    (targets an Expression)
Thing ◄───────► Thing           (relationships between Things)
```

## Virtual Collections

Collections in RCM are not containers. They are annotation-generated groupings. A collection membership is an assertion that a Thing belongs to a collection, with evidence and attribution.

See [ADR-0003: Collections as Annotations](decisions/0003-collections-as-annotations.md).
