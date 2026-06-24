/**
 * Test Fixtures — Representations
 */

import type { Representation } from "../core/types";

/** IIIF manifest representation. */
export const iiifRepresentation: Representation = {
  "@id": "tag:rcm.example,2026:rep/letter-1918-001-scan",
  "@type": "rcm:Representation",
  "rdfs:label": "Scanned image of letter (1918)",
  "rcm:represents": "tag:rcm.example,2026:thing/letter-1918-001",
  "rcm:sourceUrl": "https://iiif.example.org/manifest/letter-1918-001",
  "rcm:role": "iiif:Manifest",
};

/** Catalog record representation. */
export const catalogRepresentation: Representation = {
  "@id": "tag:rcm.example,2026:rep/manuscript-codex-001-catalog",
  "@type": "rcm:Representation",
  "rdfs:label": "Library catalog record for Codex A",
  "rcm:represents": "tag:rcm.example,2026:thing/manuscript-codex-001",
  "rcm:sourceUrl": "https://library.example.org/catalog/MC-001",
};

/** Cached metadata snapshot. */
export const cachedRepresentation: Representation = {
  "@id": "tag:rcm.example,2026:rep/letter-1918-001-metadata-cache",
  "@type": "rcm:Representation",
  "rcm:represents": "tag:rcm.example,2026:thing/letter-1918-001",
  "rcm:sourceUrl": "https://library.example.org/catalog/L-1918-001",
  "rcm:cached": true,
};

export const allRepresentations: Representation[] = [
  iiifRepresentation,
  catalogRepresentation,
  cachedRepresentation,
];
