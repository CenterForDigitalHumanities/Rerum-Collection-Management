/**
 * Eventity Types
 *
 * Eventities are entities generated through events, records of events,
 * or event-like assertions.
 */

import type { Thing, Annotation } from "../core/types";

/**
 * An Eventity is a Thing whose existence is first known through an event record.
 */
export interface Eventity extends Thing {
  /** The event that generated this entity. */
  "rcm:generatedByEvent": string;
  /** Other entities born from the same event. */
  "rcm:siblingEventities"?: string[];
  /** The source record of the event. */
  "rcm:eventSource"?: string;
}

/**
 * Create an Eventity from an event and a label.
 */
export function createEventity(
  label: string,
  eventId: string,
  sourceId: string,
  suggestedType: string = "schema:Thing",
): Eventity {
  const now = new Date();
  const id = `tag:rcm.example,${now.getFullYear()}:thing/eventity-${slugify(label)}-${Date.now()}`;

  return {
    "@id": id,
    "@type": suggestedType,
    "rdfs:label": label,
    "rcm:lifecycle": "encountered",
    "rcm:generatedByEvent": eventId,
    "rcm:eventSource": sourceId,
  };
}

/**
 * Create an annotation linking an Eventity to its generating event.
 */
export function createEventityLinkAnnotation(
  eventityId: string,
  eventId: string,
  agentId: string,
): Annotation {
  const now = new Date().toISOString();

  return {
    "@id": `tag:rcm.example,${new Date().getFullYear()}:annotation/eventity-link-${Date.now()}`,
    "@type": "oa:Annotation",
    "oa:motivatedBy": "oa:linking",
    "oa:hasTarget": eventityId,
    "oa:hasBody": {
      "@type": "rcm:RelationshipAssertion",
      "rcm:predicate": "rcm:generatedByEvent",
      "rcm:object": eventId,
    },
    "dcterms:creator": agentId,
    "dcterms:created": now,
    "rcm:provenance": "human",
  };
}

function slugify(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
