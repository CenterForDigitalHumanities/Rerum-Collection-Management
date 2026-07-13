/**
 * Image Connector
 *
 * Resolves image URLs into RCM graph seeds.
 * Proposes IIIF Manifest creation for single images.
 */

import type { Connector, ResolutionResult, Representation, Annotation } from "./types.js";

export class ImageConnector implements Connector {
  readonly id = "image";
  readonly name = "Image Connector";
  readonly description = "Resolves image URLs into RCM graph seeds with IIIF Manifest proposal.";

  canHandle(url: string): boolean {
    return /\.(jpg|jpeg|png|gif|webp|tiff|tif|bmp)(\?.*)?$/.test(url)
  }

  async resolve(url: string): Promise<ResolutionResult> {
    try {
      const response = await fetch(url, { method: "HEAD" })
      if (!response.ok) {
        return this.fallbackResult(url)
      }

      const contentType = response.headers.get("content-type") || ""
      const contentLength = response.headers.get("content-length")

      return this.extractFromImage(url, contentType, contentLength)
    } catch {
      return this.fallbackResult(url)
    }
  }

  private extractFromImage(url: string, contentType: string, contentLength: string | null): ResolutionResult {
    const warnings: string[] = []
    const representations: Representation[] = []
    const annotations: Annotation[] = []
    const suggestedTools: string[] = ["iiif-viewer"]
    const suggestedActions: string[] = ["create-iiif-manifest"]

    // The image itself is a representation
    representations.push({
      "@id": `tag:rcm.example,${new Date().getFullYear()}:rep/img-${Date.now()}`,
      "@type": "rcm:Representation",
      "rdfs:label": "Image",
      "rcm:represents": `tag:rcm.example,${new Date().getFullYear()}:thing/img-${Date.now()}`,
      "rcm:sourceUrl": url,
      "rcm:role": "schema:ImageObject",
    })

    // Annotation: link image to Thing
    annotations.push({
      "@id": `tag:rcm.example,${new Date().getFullYear()}:annotation/img-type-${Date.now()}`,
      "@type": "oa:Annotation",
      "oa:motivatedBy": "oa:describing",
      "oa:hasTarget": `tag:rcm.example,${new Date().getFullYear()}:thing/img-${Date.now()}`,
      "oa:hasBody": {
        "@id": `tag:rcm.example,${new Date().getFullYear()}:body/img-type-${Date.now()}`,
        "@type": "rcm:PropertyAssertion",
        "rcm:predicate": "rdf:type",
        "rcm:object": "schema:ImageObject",
      },
      "dcterms:creator": `tag:rcm.example,${new Date().getFullYear()}:agent/rcm-system`,
      "dcterms:created": new Date().toISOString(),
      "rcm:evidence": [url],
    })

    // Annotation: content type
    if (contentType) {
      annotations.push({
        "@id": `tag:rcm.example,${new Date().getFullYear()}:annotation/img-format-${Date.now()}`,
        "@type": "oa:Annotation",
        "oa:motivatedBy": "oa:describing",
        "oa:hasTarget": `tag:rcm.example,${new Date().getFullYear()}:thing/img-${Date.now()}`,
        "oa:hasBody": {
          "@id": `tag:rcm.example,${new Date().getFullYear()}:body/img-format-${Date.now()}`,
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
        "@id": `tag:rcm.example,${new Date().getFullYear()}:annotation/img-extent-${Date.now()}`,
        "@type": "oa:Annotation",
        "oa:motivatedBy": "oa:describing",
        "oa:hasTarget": `tag:rcm.example,${new Date().getFullYear()}:thing/img-${Date.now()}`,
        "oa:hasBody": {
          "@id": `tag:rcm.example,${new Date().getFullYear()}:body/img-extent-${Date.now()}`,
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

    return {
      sourceUrl: url,
      suggestedThingId: `tag:rcm.example,${new Date().getFullYear()}:thing/img-${Date.now()}`,
      suggestedLabel: "Image",
      suggestedType: "schema:ImageObject",
      representations,
      annotations,
      suggestedTools,
      suggestedActions,
      warnings,
      connector: this.id,
      quality: contentType ? "high" : "medium",
    }
  }

  private fallbackResult(url: string): ResolutionResult {
    return {
      sourceUrl: url,
      suggestedThingId: `tag:rcm.example,${new Date().getFullYear()}:thing/img-${Date.now()}`,
      suggestedLabel: "Image",
      suggestedType: "schema:ImageObject",
      representations: [],
      annotations: [],
      suggestedTools: ["iiif-viewer"],
      suggestedActions: ["create-iiif-manifest"],
      warnings: ["Failed to fetch image metadata"],
      connector: this.id,
      quality: "low",
    }
  }
}
