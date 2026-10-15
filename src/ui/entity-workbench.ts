// Entity Workbench – Placeholder creation and lacuna handling

import type { Thing } from "../core/types.js";

/**
 * Create a provisional placeholder Thing.
 *
 * @param label Human‑readable label for the placeholder (e.g., "Unnamed Artifact")
 * @param provisionalIds Optional IDs or evidence references that justify the placeholder
 * @returns A Thing object marked as a placeholder.
 */
export function createPlaceholderThing(label: string, provisionalIds?: string[]): Thing {
  const placeholder: Thing = {
    "@id": `_:placeholder-${Date.now()}`,
    "@type": "schema:Thing",
    "rcm:placeholder": true,
    "rdfs:label": label,
    "rcm:provisionalIds": provisionalIds ? [...provisionalIds] : [],
  };
  return placeholder;
}

/**
 * Simple utility to merge two provisional Things, marking them as a single lacuna.
 * Returns a new Thing with combined provisionalIds.
 */
export function mergePlaceholders(a: Thing, b: Thing): Thing {
  if (!a["rcm:placeholder"] || !b["rcm:placeholder"]) {
    throw new Error("Both inputs must be placeholders");
  }
  const merged: Thing = {
    "@id": `_:merged-${Date.now()}`,
    "@type": "schema:Thing",
    "rcm:placeholder": true,
    "rdfs:label": `${a["rdfs:label"]} / ${b["rdfs:label"]}`,
    "rcm:provisionalIds": [...(a["rcm:provisionalIds"] ?? []), ...(b["rcm:provisionalIds"] ?? [])],
  };
  return merged;
}
