/**
 * Test Fixtures — Collections
 */

import type { Collection } from "../core/types";

/** WWI Correspondence collection. */
export const wwiCorrespondenceCollection: Collection = {
  "@id": "tag:rcm.example,2026:collection/wwi-correspondence",
  "@type": "rcm:Collection",
  "rdfs:label": "WWI Correspondence",
  "dcterms:creator": "tag:rcm.example,2026:agent/patrick-cuba",
  "dcterms:created": "2026-06-23",
};

/** Hachita Mining Disaster artifacts. */
export const hachitaCollection: Collection = {
  "@id": "tag:rcm.example,2026:collection/hachita-mining-disaster",
  "@type": "rcm:Collection",
  "rdfs:label": "Hachita Mining Disaster Artifacts",
  "dcterms:creator": "tag:rcm.example,2026:agent/researcher-001",
  "dcterms:created": "2026-06-23",
};

export const allCollections: Collection[] = [
  wwiCorrespondenceCollection,
  hachitaCollection,
];
