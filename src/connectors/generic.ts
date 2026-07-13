/**
 * Generic Connector
 *
 * Fallback connector for unknown URL types.
 * Provides minimal extraction - just the URL as a representation.
 */

import type { Connector, ResolutionResult, Representation, Annotation } from "./types.js";

export class GenericConnector implements Connector {
  readonly id = "generic";
  readonly name = "Generic Connector";
  readonly description = "Fallback connector for unknown URL types with minimal extraction.";

  canHandle(url: string): boolean {
    // Always matches - this is the fallback
    return true
  }

  async resolve(url: string): Promise<ResolutionResult> {
    try {
      const response = await fetch(url, { method: "HEAD" })
      if (!response.ok) {
        return this.fallbackResult(url)
      }

      const contentType = response.headers.get("content-type") || ""
      const contentLength = response.headers.get("content-length")

      return this.extractFromUrl(url, contentType, contentLength)
    } catch {
      return this.fallbackResult(url)
    }
  }

  private extractFromUrl(url: string, contentType: string, contentLength: string | null): ResolutionResult {
    const warnings: string[] = []
    const representations: Representation[] = []
    const annotations: Annotation[] = []
    const suggestedTools: string[] = []
    const suggestedActions: string[] = []

    // The URL itself is a representation
    representations.push({
      "@id": `tag:rcm.example,${new Date().getFullYear()}:rep/generic-${Date.now()}`,
      "@type": "rcm:Representation",
      "rdfs:label": "External Resource",
      "rcm:represents": `tag:rcm.example,${new Date().getFullYear()}:thing/generic-${Date.now()}`,
      "rcm:sourceUrl": url,
      "rcm:role": "schema:Thing",
    })

    // Annotation: link URL to Thing
    annotations.push({
      "@type": "oa:Annotation",
      "oa:motivatedBy": "oa:describing",
      "oa:hasTarget": `tag:rcm.example,${new Date().getFullYear()}:thing/generic-${Date.now()}`,
      "oa:hasBody": {
        "@type": "rcm:PropertyAssertion",
        "rcm:predicate": "rdf:type",
        "rcm:object": "schema:Thing",
      },
      "dcterms:creator": `tag:rcm.example,${new Date().getFullYear()}:agent/rcm-system`,
      "dcterms:created": new Date().toISOString(),
      "rcm:evidence": [url],
    })

    // Annotation: content type
    if (contentType) {
      annotations.push({
        "@type": "oa:Annotation",
        "oa:motivatedBy": "oa:describing",
        "oa:hasTarget": `tag:rcm.example,${new Date().getFullYear()}:thing/generic-${Date.now()}`,
        "oa:hasBody": {
          "@type": "rcm:PropertyAssertion",
          "rcm:predicate": "dcterms:format",
          "rcm:object": contentType,
        },
        "dcterms:creator": `tag:rcm.example,${new Date().getFullYear()}:agent/rcm-system`,
        "dcterms:created": new Date().toISOString(),
        "rcm:evidence": [url],
      })
    }

    // Annotation: content length
    if (contentLength) {
      annotations.push({
        "@type": "oa:Annotation",
        "oa:motivatedBy": "oa:describing",
        "oa:hasTarget": `tag:rcm.example,${new Date().getFullYear()}:thing/generic-${Date.now()}`,
        "oa:hasBody": {
          "@type": "rcm:PropertyAssertion",
          "rcm:predicate": "dcterms:extent",
          "rcm:object": contentLength,
        },
        "dcterms:creator": `tag:rcm.example,${new Date().getFullYear()}:agent/rcm-system`,
        "dcterms:created": new Date().toISOString(),
        "rcm:evidence": [url],
      })
    }

    // Warnings
    if (!contentType) warnings.push("No content-type detected")
    if (!contentLength) warnings.push("No content-length detected")
    warnings.push("URL type not recognized - minimal extraction applied")

    return {
      sourceUrl: url,
      suggestedThingId: `tag:rcm.example,${new Date().getFullYear()}:thing/generic-${Date.now()}`,
      suggestedLabel: "External Resource",
      suggestedType: "schema:Thing",
      representations,
      annotations,
      suggestedTools: Array.from(new Set(suggestedTools)),
      suggestedActions: Array.from(new Set(suggestedActions)),
      warnings,
      connector: this.id,
      quality: contentType ? "medium" : "low",
    }
  }

  private fallbackResult(url: string): ResolutionResult {
    return {
      sourceUrl: url,
      suggestedThingId: `tag:rcm.example,${new Date().getFullYear()}:thing/generic-${Date.now()}`,
      suggestedLabel: "External Resource",
      suggestedType: "schema:Thing",
      representations: [],
      annotations: [],
      suggestedTools: [],
      suggestedActions: [],
      warnings: ["Failed to fetch URL metadata - minimal extraction applied"],
      connector: this.id,
      quality: "low",
    }
  }
}
