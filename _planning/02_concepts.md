# RCM Concepts and Vocabulary Notes

## Thing

The abstract anchor for what scholarship is about. It may be real, conceptual, lost, inferred, disputed, or represented only indirectly.

A Thing should be allowed to exist before it is well described. The first act may be simply minting a URI because a passage, image, catalog entry, or scholar indicates there is something worth referring to.

## Chonky Node

A Thing made dense through accumulated annotation. The goal is not fat records but dense connectivity.

A chonky node may have:

- multiple labels;
- uncertain or competing identities;
- many representations;
- annotations by different agents;
- citation trails;
- connections to people, places, events, groups, materials, and objects;
- LDN announcements;
- machine-generated suggestions clearly separated from human claims.

## Representation

Any externally or internally addressable digital form that stands for, depicts, encodes, catalogs, scans, records, transcribes, models, or otherwise represents a Thing.

## Expression

An intellectual derivative or rendering of a Thing. This is helpful when a scan, transcription, translation, edition, and commentary should all relate to the same conceptual node rather than to one another in arbitrary chains.

## Annotation

Primary data unit. An annotation is where RCM records meaning.

Annotation should carry:

- target;
- body;
- motivation;
- creator;
- creation date;
- evidence when available;
- provenance;
- versioning store metadata through RERUM;
- optional selector/state/context for precise targeting.

## Evidence

Evidence is not a score. Evidence is a cited resource, selector, passage, image region, object, annotation, observation, or scholarly statement that supports an assertion.

Evidence should be inspectable.

## Assertion

An assertion is an annotation body that says something about a target. Assertions are not automatically merged into truth. They are accumulated and rendered.

## Lacuna

A placeholder or negative-space entity. It exists because evidence implies it, not because an authority already exists.

A lacuna can later be reconciled with an authority, sameAs target, representation, or fuller Thing.

## Collection

A collection is an identity plus aggregation assertions. The assembly of a collection may be static, dynamic, query-based, or publication-specific.

## Agent

Person, organization, software, model, project, or institution responsible for an annotation, representation, transformation, or announcement.

## Human Annotation vs Machine Annotation

Human annotations should favor evidence and attribution.

Machine annotations may include confidence, model name, run ID, prompt/process, input source, generated date, and review status. Machine confidence must not be treated as scholarly confidence.

## SameAs / Identity Reconciliation

Identity reconciliation is not destructive. RCM should allow:

- sameAs assertion;
- closeMatch;
- exactMatch;
- disputed identity;
- replacement/merge suggestion;
- rejection of a proposed alignment.

Do not delete the old identity anchor simply because a stronger one appears.

## Dynamic Collection

A view assembled from annotations at runtime.

Example: all Things collected into `collection:X`, or all Things with a map coordinate and a date range, or all annotations created by a project agent.

## Publication

Publication is a graph state plus announcement. A publication can be a JSON-LD bundle, static site, LDN announcement, IIIF Collection, or public RERUM graph entry.
