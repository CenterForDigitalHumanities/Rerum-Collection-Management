/**
 * Resource Resolver
 *
 * Main entry point for "paste URL, get graph seeds."
 * Delegates to the appropriate connector based on URL pattern.
 */

import type { Connector, ResolutionResult } from "./types.js";
import { registry } from "./registry.js";
import { IiifConnector } from "./iiif.js";

// Register built-in connectors
registry.register(new IiifConnector());

/**
 * Resolve a URL into RCM graph seeds.
 *
 * Finds the appropriate connector and delegates resolution.
 */
export async function resolveUrl(url: string): Promise<ResolutionResult | null> {
  const connector = registry.findForUrl(url)
  if (!connector) {
    // No connector found — return a minimal fallback
    return createFallbackResult(url)
  }

  return connector.resolve(url)
}

/**
 * Resolve a URL using a specific connector by ID.
 */
export async function resolveWith(url: string, connectorId: string): Promise<ResolutionResult | null> {
  const connector = registry.get(connectorId)
  if (!connector) {
    throw new Error(`Connector "${connectorId}" not found.`)
  }
  if (!connector.canHandle(url)) {
    throw new Error(`Connector "${connectorId}" cannot handle URL: ${url}`)
  }
  return connector.resolve(url)
}

/**
 * List available connectors.
 */
export function listConnectors(): Array<{ id: string; name: string; description: string }> {
  return registry.all().map((c) => ({
    id: c.id,
    name: c.name,
    description: c.description,
  }))
}

/**
 * Create a minimal fallback result when no connector matches.
 */
function createFallbackResult(url: string): ResolutionResult {
  const thingId = `tag:rcm.example,${new Date().getFullYear()}:thing/unknown-${Date.now()}`;

  return {
    sourceUrl: url,
    suggestedThingId: thingId,
    representations: [
      {
        "@id": `tag:rcm.example,${new Date().getFullYear()}:rep/unknown-${Date.now()}`,
        "@type": "rcm:Representation",
        "rcm:represents": thingId,
        "rcm:sourceUrl": url,
      },
    ],
    annotations: [],
    connector: "fallback",
    quality: "low",
  };
}
