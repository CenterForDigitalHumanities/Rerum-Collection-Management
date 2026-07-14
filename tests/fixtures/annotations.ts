/**
 * Test Fixtures — Annotations
 *
 * Covers all six annotation profiles.
 */

import type {
  Annotation,
  PropertyAssertion,
  RelationshipAssertion,
  CollectionMembership,
  RepresentationLink,
  MachineAnnotation,
  DisputedAssertion,
} from "../core/types";

// --- Profile A: Property Assertion ---

export const propertyAssertionAnnotation: Annotation = {
  "@id": "tag:rcm.example,2026:annotation/prop-001",
  "@type": "oa:Annotation",
  "oa:motivatedBy": "oa:describing",
  "oa:hasTarget": "tag:rcm.example,2026:thing/letter-1918-001",
  "oa:hasBody": {
    "@type": "rcm:PropertyAssertion",
    "rcm:predicate": "dc:creator",
    "rcm:object": "tag:rcm.example,2026:agent/allen-l-gooch",
  } as PropertyAssertion,
  "dcterms:creator": "tag:rcm.example,2026:agent/patrick-cuba",
  "dcterms:created": "2026-06-23T12:00:00Z",
  "rcm:evidence": ["https://example.org/wwi-letter#signature"],
  "rcm:provenance": "human",
};

// --- Profile B: Relationship Assertion ---

export const relationshipAssertionAnnotation: Annotation = {
  "@id": "tag:rcm.example,2026:annotation/rel-001",
  "@type": "oa:Annotation",
  "oa:motivatedBy": "oa:linking",
  "oa:hasTarget": "tag:rcm.example,2026:agent/allen-l-gooch",
  "oa:hasBody": {
    "@type": "rcm:RelationshipAssertion",
    "rcm:predicate": "foaf:knows",
    "rcm:object": "tag:rcm.example,2026:agent/unnamed-sergeant-from-hachita",
  } as RelationshipAssertion,
  "dcterms:creator": "tag:rcm.example,2026:agent/researcher-001",
  "dcterms:created": "2026-06-23T13:00:00Z",
  "rcm:evidence": ["https://example.org/transcription#line-42"],
  "rcm:provenance": "human",
};

// --- Profile C: Collection Membership ---

export const collectionMembershipAnnotation: Annotation = {
  "@id": "tag:rcm.example,2026:annotation/coll-001",
  "@type": "oa:Annotation",
  "oa:motivatedBy": "oa:categorizing",
  "oa:hasTarget": "tag:rcm.example,2026:thing/letter-1918-001",
  "oa:hasBody": {
    "@type": "rcm:CollectionMembership",
    "rcm:collection": "tag:rcm.example,2026:collection/wwi-correspondence",
  } as CollectionMembership,
  "dcterms:creator": "tag:rcm.example,2026:agent/patrick-cuba",
  "dcterms:created": "2026-06-23T14:00:00Z",
};

// --- Profile D: Representation Link ---

export const representationLinkAnnotation: Annotation = {
  "@id": "tag:rcm.example,2026:annotation/rep-001",
  "@type": "oa:Annotation",
  "oa:motivatedBy": "oa:describing",
  "oa:hasTarget": "tag:rcm.example,2026:thing/letter-1918-001",
  "oa:hasBody": {
    "@type": "rcm:RepresentationLink",
    "rcm:representation": "tag:rcm.example,2026:rep/letter-1918-001-scan",
    "rcm:role": "iiif:Manifest",
  } as RepresentationLink,
  "dcterms:creator": "tag:rcm.example,2026:agent/patrick-cuba",
  "dcterms:created": "2026-06-23T14:30:00Z",
};

// --- Profile E: Machine Annotation ---

export const machineAnnotation: Annotation = {
  "@id": "tag:rcm.example,2026:annotation/machine-001",
  "@type": "oa:Annotation",
  "oa:motivatedBy": "oa:classifying",
  "oa:hasTarget": "tag:rcm.example,2026:expr/letter-1918-001-ocr",
  "oa:hasBody": {
    "@type": "rcm:MachineAnnotation",
    "rcm:entity": "tag:rcm.example,2026:agent/allen-l-gooch",
    "rcm:type": "schema:Person",
    "rcm:confidence": 0.94,
    "rcm:generator": "spaCy NER v3.7",
  } as MachineAnnotation,
  "dcterms:creator": "tag:rcm.example,2026:agent/ner-pipeline-001",
  "dcterms:created": "2026-06-23T14:32:00Z",
  "rcm:provenance": "machine",
};

// --- Profile F: Disputed Assertion ---

export const disputedAssertionAnnotation: Annotation = {
  "@id": "tag:rcm.example,2026:annotation/dispute-001",
  "@type": "oa:Annotation",
  "oa:motivatedBy": "oa:describing",
  "oa:hasTarget": "tag:rcm.example,2026:thing/artifact-001",
  "oa:hasBody": {
    "@type": "rcm:DisputedAssertion",
    "rcm:predicate": "dc:date",
    "rcm:object": "1917",
    "rcm:disputes": ["tag:rcm.example,2026:annotation/assertion-042"],
    "rcm:reason": "Alternative dating based on postal mark analysis.",
  } as DisputedAssertion,
  "dcterms:creator": "tag:rcm.example,2026:agent/researcher-002",
  "dcterms:created": "2026-06-23T15:00:00Z",
  "rcm:provenance": "human",
};

// --- All annotations ---

export const allAnnotations: Annotation[] = [
  propertyAssertionAnnotation,
  relationshipAssertionAnnotation,
  collectionMembershipAnnotation,
  representationLinkAnnotation,
  machineAnnotation,
  disputedAssertionAnnotation,
];
