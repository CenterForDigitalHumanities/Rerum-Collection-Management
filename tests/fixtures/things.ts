/**
 * Test Fixtures — Things
 *
 * Sample Thing objects for testing and development.
 */

import type { Thing } from "../core/types";

/** Minimal Thing — just an identity anchor. */
export const minimalThing: Thing = {
  "@id": "tag:rcm.example,2026:thing/letter-1918-001",
  "@type": "crm:E22_Human-Made_Object",
};

/** Thing with label and lifecycle. */
export const labeledThing: Thing = {
  "@id": "tag:rcm.example,2026:thing/manuscript-codex-001",
  "@type": "crm:E22_Human-Made_Object",
  "rdfs:label": ["Codex A", "Manuscript Codex A (15th c.)"],
  "rcm:lifecycle": "described",
};

/** Person Thing. */
export const personThing: Thing = {
  "@id": "tag:rcm.example,2026:agent/allen-l-gooch",
  "@type": "schema:Person",
  "rdfs:label": "Allen L. Gooch",
  "rcm:lifecycle": "anchored",
};

/** Lacuna — entity evidenced by reference only. */
export const lacunaThing: Thing = {
  "@id": "tag:rcm.example,2026:agent/unnamed-sergeant-from-hachita",
  "@type": "schema:Person",
  "rdfs:label": "Unnamed Sergeant from Hachita",
  "rcm:lifecycle": "encountered",
};

/** Place Thing. */
export const placeThing: Thing = {
  "@id": "tag:rcm.example,2026:place/hachita-nm",
  "@type": "schema:Place",
  "rdfs:label": "Hachita, New Mexico",
  "rcm:lifecycle": "anchored",
};

/** Event Thing. */
export const eventThing: Thing = {
  "@id": "tag:rcm.example,2026:event/receipt-pineapples-1920",
  "@type": "schema:Event",
  "rdfs:label": "Receipt of 12 doz. pineapples by Mr. Finan",
  "rcm:lifecycle": "encountered",
};

/** All Things array for batch testing. */
export const allThings: Thing[] = [
  minimalThing,
  labeledThing,
  personThing,
  lacunaThing,
  placeThing,
  eventThing,
];
