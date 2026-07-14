/**
 * Resource Resolver
 *
 * Main entry point for "paste URL, get graph seeds."
 * Delegates to the appropriate connector based on URL pattern.
 */

import type { Connector, ResolutionResult } from "./types.js";
import { registry } from "./registry.js";
import { IiifConnector } from "./iiif.js";
import { HtmlConnector } from "./html.js";
import { ImageConnector } from "./image.js";
import { JsonLdConnector } from "./jsonld.js";
import { PdfConnector } from "./pdf.js";
import { GenericConnector } from "./generic.js";

// Register built-in connectors (order matters — first match wins)
registry.register(new IiifConnector());
registry.register(new HtmlConnector());
registry.register(new ImageConnector());
registry.register(new JsonLdConnector());
registry.register(new PdfConnector());
registry.register(new GenericConnector());

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
 * Resolve a URL using all matching connectors and merge results.
 *
 * Returns a merged result with contributions from all connectors that can handle the URL.
 * Results are merged with priority: higher quality results take precedence for core fields.
 */
export async function resolveAll(url: string): Promise<ResolutionResult | null> {
  const connectors = registry.findAllForUrl(url)

  if (connectors.length === 0) {
    // No connectors found — return a minimal fallback
    return createFallbackResult(url)
  }

  if (connectors.length === 1) {
    // Single connector — use it directly
    return connectors[0]!.resolve(url)
  }

  // Multiple connectors — resolve with all and merge results
  // Note: Promise.all runs all connectors simultaneously for parallelism.
  // For URLs matching many connectors, this could be expensive.
  const results = await Promise.all(
    connectors.map(connector => connector.resolve(url).catch(err => {
      console.warn(`Connector "${connector.id}" failed:`, err)
      return null
    }))
  )

  // Filter out failed resolutions
  const validResults = results.filter(Boolean) as ResolutionResult[]

  // Guard against empty results array - all connectors failed
  if (validResults.length === 0) {
    return createFallbackResult(url)
  }

  return mergeResults(validResults, url)
}

/**
 * Merge multiple resolution results into a single result.
 *
 * Priority system:
 * - Quality: highest quality result's core fields take precedence
 * - Representations: all unique representations are included
 * - Annotations: all unique annotations are included
 * - SuggestedTools: union of all tools, deduplicated
 * - SuggestedActions: union of all actions, deduplicated
 * - Warnings: all warnings are included
 * - Source: attributed to all contributing connectors
 */
function mergeResults(results: ResolutionResult[], sourceUrl: string): ResolutionResult {
  // Sort by quality: high > medium > low
  const qualityOrder = { high: 3, medium: 2, low: 1 }
  const sorted = [...results].sort((a, b) => {
    const aQuality = qualityOrder[a.quality || "low"] || 0
    const bQuality = qualityOrder[b.quality || "low"] || 0
    return bQuality - aQuality
  })

  // Primary result (highest quality) provides core fields
  const primary = sorted[0]!

  // Merge representations (deduplicate by @id)
  const seenIds = new Set<string>()
  const mergedRepresentations: ResolutionResult["representations"] = []
  for (const result of sorted) {
    for (const rep of result.representations || []) {
      const repId = rep["@id"] || rep["@type"]
      if (!seenIds.has(repId)) {
        seenIds.add(repId)
        mergedRepresentations.push(rep)
      }
    }
  }

  // Merge annotations (deduplicate by @id, with generated fallback)
  // Note: oa:hasTarget is not unique - two annotations can target the same resource.
  // We use @id only, with a generated fallback to avoid false deduplication.
  const seenAnnotationIds = new Set<string>()
  const mergedAnnotations: ResolutionResult["annotations"] = []
  for (const result of sorted) {
    for (const ann of result.annotations || []) {
      const annId = ann["@id"] || `ann-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
      if (!seenAnnotationIds.has(annId)) {
        seenAnnotationIds.add(annId)
        mergedAnnotations.push(ann)
      }
    }
  }

  // Merge suggested tools (union, preserve order)
  const mergedTools = Array.from(new Set(
    sorted.flatMap(r => r.suggestedTools || [])
  ))

  // Merge suggested actions (union, preserve order)
  const mergedActions = Array.from(new Set(
    sorted.flatMap(r => r.suggestedActions || [])
  ))

  // Merge warnings (deduplicated - same warning from multiple connectors appears once)
  const mergedWarnings = Array.from(new Set(
    sorted.flatMap(r => r.warnings || [])
  ))

  // Connector attribution
  const connectorIds = sorted.map(r => r.connector).filter(Boolean)
  const connector = connectorIds.length > 1
    ? `merged(${Array.from(new Set(connectorIds)).join(",")})`
    : connectorIds[0] || "unknown"

  return {
    sourceUrl,
    suggestedThingId: primary.suggestedThingId,
    suggestedLabel: primary.suggestedLabel,
    suggestedType: primary.suggestedType,
    representations: mergedRepresentations,
    annotations: mergedAnnotations,
    suggestedTools: mergedTools,
    suggestedActions: mergedActions,
    warnings: mergedWarnings,
    connector,
    quality: primary.quality,
  }
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
