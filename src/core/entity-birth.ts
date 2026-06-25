/**
 * Entity Birth Module
 *
 * Supports "spontaneous generation" — the birth of an Entity from evidentiary encounter.
 * A fragment selector, text quote, or image region can be enough evidence to birth an entity anchor.
 */

import type { Thing, Annotation, Representation } from "../core/types";

/**
 * An entity birth event — when a new entity is minted from evidence.
 */
export interface EntityBirth {
  /** The newly minted Thing. */
  thing: Thing;
  /** The annotation that triggered the birth (evidence-bearing). */
  birthAnnotation: Annotation;
  /** The source representation where the entity was encountered. */
  sourceRepresentation: string;
  /** The selector that identified the entity in the source. */
  selector?: EntitySelector;
  /** Timestamp of birth. */
  bornAt: string;
  /** Agent who triggered the birth. */
  agent: string;
}

/**
 * A selector identifying where in a source the entity was encountered.
 */
export interface EntitySelector {
  /** Selector type. */
  type: "TextQuoteSelector" | "TextPositionSelector" | "SvgSelector" | "FragmentSelector" | "TimeSelector" | "CssSelector";
  /** The exact text (for text selectors). */
  exact?: string;
  /** Start position (for text position selectors). */
  start?: number;
  /** End position (for text position selectors). */
  end?: number;
  /** SVG path (for image region selectors). */
  path?: string;
  /** XYWH coordinates (for image region selectors). */
  xywh?: string;
}

/**
 * Evidence class for entity birth (from WOMB taxonomy).
 */
export type EvidenceClass =
  | "rcm:ExistentialEvidence"    // birth, death, spawning
  | "rcm:TransitionalEvidence"   // adoption, marriage, employment
  | "rcm:ObjectiveEvidence"      // mention, insult, assert
  | "rcm:CreatorAssertion";      // simply declared by the creator

/**
 * Birth a new entity from a text quote in a source.
 */
export function birthFromTextQuote(
  label: string,
  quote: string,
  sourceId: string,
  agentId: string,
  suggestedType: string = "schema:Thing",
  evidenceClass: EvidenceClass = "rcm:ObjectiveEvidence",
): EntityBirth {
  const now = new Date().toISOString();
  const thingId = `tag:rcm.example,${new Date().getFullYear()}:thing/${slugify(label)}-${Date.now()}`;

  const thing: Thing = {
    "@id": thingId,
    "@type": suggestedType,
    "rdfs:label": label,
    "rcm:lifecycle": "encountered",
  };

  const birthAnnotation: Annotation = {
    "@id": `tag:rcm.example,${new Date().getFullYear()}:annotation/birth-${Date.now()}`,
    "@type": "oa:Annotation",
    "oa:motivatedBy": "oa:identifying",
    "oa:hasTarget": {
      source: sourceId,
      selector: {
        "@type": "oa:TextQuoteSelector",
        exact: quote,
      },
    },
    "oa:hasBody": thingId,
    "dcterms:creator": agentId,
    "dcterms:created": now,
    "rcm:evidence": [sourceId],
    "rcm:provenance": "human",
  };

  return {
    thing,
    birthAnnotation,
    sourceRepresentation: sourceId,
    selector: { type: "TextQuoteSelector", exact: quote },
    bornAt: now,
    agent: agentId,
  };
}

/**
 * Birth a new entity from an image region (SVG or XYWH).
 */
export function birthFromImageRegion(
  label: string,
  sourceId: string,
  selector: { path?: string; xywh?: string },
  agentId: string,
  suggestedType: string = "schema:Thing",
): EntityBirth {
  const now = new Date().toISOString();
  const thingId = `tag:rcm.example,${new Date().getFullYear()}:thing/${slugify(label)}-${Date.now()}`;

  const thing: Thing = {
    "@id": thingId,
    "@type": suggestedType,
    "rdfs:label": label,
    "rcm:lifecycle": "encountered",
  };

  const selectorType = selector.path ? "oa:SvgSelector" : "oa:FragmentSelector";

  const birthAnnotation: Annotation = {
    "@id": `tag:rcm.example,${new Date().getFullYear()}:annotation/birth-${Date.now()}`,
    "@type": "oa:Annotation",
    "oa:motivatedBy": "oa:identifying",
    "oa:hasTarget": {
      source: sourceId,
      selector: {
        "@type": selectorType,
        ...(selector.path ? { "svg": selector.path } : {}),
        ...(selector.xywh ? { "value": selector.xywh } : {}),
      },
    },
    "oa:hasBody": thingId,
    "dcterms:creator": agentId,
    "dcterms:created": now,
    "rcm:evidence": [sourceId],
    "rcm:provenance": "human",
  };

  return {
    thing,
    birthAnnotation,
    sourceRepresentation: sourceId,
    selector: {
      type: selector.path ? "SvgSelector" : "FragmentSelector",
      path: selector.path,
      xywh: selector.xywh,
    },
    bornAt: now,
    agent: agentId,
  };
}

/**
 * Birth a new entity from a time segment (A/V).
 */
export function birthFromTimeSegment(
  label: string,
  sourceId: string,
  startTime: number,
  endTime: number,
  agentId: string,
  suggestedType: string = "schema:Thing",
): EntityBirth {
  const now = new Date().toISOString();
  const thingId = `tag:rcm.example,${new Date().getFullYear()}:thing/${slugify(label)}-${Date.now()}`;

  const thing: Thing = {
    "@id": thingId,
    "@type": suggestedType,
    "rdfs:label": label,
    "rcm:lifecycle": "encountered",
  };

  const birthAnnotation: Annotation = {
    "@id": `tag:rcm.example,${new Date().getFullYear()}:annotation/birth-${Date.now()}`,
    "@type": "oa:Annotation",
    "oa:motivatedBy": "oa:identifying",
    "oa:hasTarget": {
      source: sourceId,
      selector: {
        "@type": "oa:TimeSelector",
        startTime: formatTime(startTime),
        endTime: formatTime(endTime),
      },
    },
    "oa:hasBody": thingId,
    "dcterms:creator": agentId,
    "dcterms:created": now,
    "rcm:evidence": [sourceId],
    "rcm:provenance": "human",
  };

  return {
    thing,
    birthAnnotation,
    sourceRepresentation: sourceId,
    selector: { type: "TimeSelector", start: startTime, end: endTime },
    bornAt: now,
    agent: agentId,
  };
}

/**
 * Birth a Lacuna (placeholder entity with minimal evidence).
 */
export function birthLacuna(
  label: string,
  sourceId: string,
  agentId: string,
): EntityBirth {
  const now = new Date().toISOString();
  const thingId = `tag:rcm.example,${new Date().getFullYear()}:thing/lacuna-${slugify(label)}-${Date.now()}`;

  const thing: Thing = {
    "@id": thingId,
    "@type": "schema:Thing",
    "rdfs:label": label,
    "rcm:lifecycle": "encountered",
  };

  const birthAnnotation: Annotation = {
    "@id": `tag:rcm.example,${new Date().getFullYear()}:annotation/lacuna-birth-${Date.now()}`,
    "@type": "oa:Annotation",
    "oa:motivatedBy": "oa:identifying",
    "oa:hasTarget": sourceId,
    "oa:hasBody": {
      "@type": "rcm:PropertyAssertion",
      "rcm:predicate": "rcm:lacuna",
      "rcm:object": thingId,
    },
    "dcterms:creator": agentId,
    "dcterms:created": now,
    "rcm:evidence": [sourceId],
    "rcm:provenance": "human",
  };

  return {
    thing,
    birthAnnotation,
    sourceRepresentation: sourceId,
    bornAt: now,
    agent: agentId,
  };
}

// --- Helpers ---

function slugify(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const ms = Math.round((seconds % 1) * 1000);
  return `${pad(h, 2)}:${pad(m, 2)}:${pad(s, 2)}.${pad(ms, 3)}`;
}

function pad(n: number, len: number): string {
  return String(n).padStart(len, "0");
}
