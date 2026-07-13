/**
 * PDF Connector
 *
 * Resolves PDF document URLs into RCM graph seeds.
 * Supports page-level annotation via PDF page selectors.
 */

import type { Connector, ResolutionResult, Representation, Annotation } from "./types.js";

export class PdfConnector implements Connector {
  readonly id = "pdf";
  readonly name = "PDF Connector";
  readonly description = "Resolves PDF documents into RCM graph seeds with page-level annotation support.";

  canHandle(url: string): boolean {
    return /\.(pdf)(\?.*)?$/.test(url)
  }

  async resolve(url: string): Promise<ResolutionResult> {
    try {
      const response = await fetch(url, { method: "HEAD" })
      if (!response.ok) {
        return this.fallbackResult(url)
      }

      const contentType = response.headers.get("content-type") || ""
      const contentLength = response.headers.get("content-length")

      return this.extractFromPdf(url, contentType, contentLength)
    } catch {
      return this.fallbackResult(url)
    }
  }

  private extractFromPdf(url: string, contentType: string, contentLength: string | null): ResolutionResult {
    const warnings: string[] = []
    const representations: Representation[] = []
    const annotations: Annotation[] = []
    const suggestedTools: string[] = ["pdf-viewer", "annotation-composer"]
    const suggestedActions: string[] = ["view-pdf", "annotate-page"]

    // The PDF itself is a representation
    representations.push({
      "@id": `tag:rcm.example,${new Date().getFullYear()}:rep/pdf-${Date.now()}`,
      "@type": "rcm:Representation",
      "rdfs:label": "PDF Document",
      "rcm:represents": `tag:rcm.example,${new Date().getFullYear()}:thing/pdf-${Date.now()}`,
      "rcm:sourceUrl": url,
      "rcm:role": "schema:DigitalDocument",
    })

    // Annotation: link PDF to Thing
    annotations.push({
      "@type": "oa:Annotation",
      "oa:motivatedBy": "oa:describing",
      "oa:hasTarget": `tag:rcm.example,${new Date().getFullYear()}:thing/pdf-${Date.now()}`,
      "oa:hasBody": {
        "@type": "rcm:PropertyAssertion",
        "rcm:predicate": "rdf:type",
        "rcm:object": "schema:DigitalDocument",
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
        "oa:hasTarget": `tag:rcm.example,${new Date().getFullYear()}:thing/pdf-${Date.now()}`,
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
        "oa:hasTarget": `tag:rcm.example,${new Date().getFullYear()}:thing/pdf-${Date.now()}`,
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

    // Annotation: page-level annotation support
    annotations.push({
      "@type": "oa:Annotation",
      "oa:motivatedBy": "oa:describing",
      "oa:hasTarget": `tag:rcm.example,${new Date().getFullYear()}:thing/pdf-${Date.now()}`,
      "oa:hasBody": {
        "@type": "rcm:PropertyAssertion",
        "rcm:predicate": "schema:hasPageSelector",
        "rcm:object": "oa:SpecificResource#oa:PageSelector",
      },
      "dcterms:creator": `tag:rcm.example,${new Date().getFullYear()}:agent/rcm-system`,
      "dcterms:created": new Date().toISOString(),
      "rcm:evidence": [url],
    })

    // Warnings
    if (!contentType || !contentType.includes("pdf")) warnings.push("Content-type may not be PDF")
    if (!contentLength) warnings.push("No content-length detected")

    return {
      sourceUrl: url,
      suggestedThingId: `tag:rcm.example,${new Date().getFullYear()}:thing/pdf-${Date.now()}`,
      suggestedLabel: "PDF Document",
      suggestedType: "schema:DigitalDocument",
      representations,
      annotations,
      suggestedTools,
      suggestedActions,
      warnings,
      connector: this.id,
      quality: contentType.includes("pdf") ? "high" : "medium",
    }
  }

  private fallbackResult(url: string): ResolutionResult {
    return {
      sourceUrl: url,
      suggestedThingId: `tag:rcm.example,${new Date().getFullYear()}:thing/pdf-${Date.now()}`,
      suggestedLabel: "PDF Document",
      suggestedType: "schema:DigitalDocument",
      representations: [],
      annotations: [],
      suggestedTools: ["pdf-viewer", "annotation-composer"],
      suggestedActions: [],
      warnings: ["Failed to fetch PDF metadata"],
      connector: this.id,
      quality: "low",
    }
  }
}
