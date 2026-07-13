/**
 * Test Fixtures — Agents
 */

import type { Agent } from "../core/types";

/** Human researcher. */
export const humanAgent: Agent = {
  "@id": "tag:rcm.example,2026:agent/patrick-cuba",
  "@type": "schema:Person",
  "rdfs:label": "Patrick Cuba",
  "foaf:mbox": "mailto:patrick@example.org",
};

/** Software agent (NER pipeline). */
export const softwareAgent: Agent = {
  "@id": "tag:rcm.example,2026:agent/ner-pipeline-001",
  "@type": "schema:SoftwareApplication",
  "rdfs:label": "NER Pipeline v3.7",
};

export const allAgents: Agent[] = [humanAgent, softwareAgent];
