/**
 * Video Connector
 *
 * Resolves video URLs into RCM graph seeds.
 * Supports direct video URLs (.mp4, .webm, .mov, .avi, .mkv, .flv, .wmv, .m4v).
 * Proposes time-based annotation for video content.
 */

import type { Connector, ResolutionResult, Representation, Annotation } from "./types.js";

export class VideoConnector implements Connector {
  readonly id = "video";
  readonly name = "Video Connector";
  readonly description = "Resolves video URLs into RCM graph seeds with time-based annotation support.";

  canHandle(url: string): boolean {
    // Match common video file extensions
    return /\.(mp4|webm|mov|avi|mkv|flv|wmv|m4v)(\?.*)?$/i.test(url)
  }

  async resolve(url: string): Promise<ResolutionResult> {
    try {
      const response = await fetch(url, { method: "HEAD" })
      if (!response.ok) {
        return this.fallbackResult(url)
      }

      const contentType = response.headers.get("content-type") || ""
      const contentLength = response.headers.get("content-length")

      return this.extractFromVideo(url, contentType, contentLength)
    } catch {
      return this.fallbackResult(url)
    }
  }

  private extractFromVideo(url: string, contentType: string, contentLength: string | null): ResolutionResult {
    const warnings: string[] = []
    const representations: Representation[] = []
    const annotations: Annotation[] = []
    const suggestedTools: string[] = ["video-viewer"]
    const suggestedActions: string[] = ["annotate-time"]

    // The video itself is a representation
    representations.push({
      "@id": `tag:rcm.example,${new Date().getFullYear()}:rep/video-${Date.now()}`,
      "@type": "rcm:Representation",
      "rdfs:label": "Video",
      "rcm:represents": `tag:rcm.example,${new Date().getFullYear()}:thing/video-${Date.now()}`,
      "rcm:sourceUrl": url,
      "rcm:role": "schema:VideoObject",
    })

    // Annotation: link video to Thing
    annotations.push({
      "@id": `tag:rcm.example,${new Date().getFullYear()}:annotation/video-type-${Date.now()}`,
      "@type": "oa:Annotation",
      "oa:motivatedBy": "oa:describing",
      "oa:hasTarget": `tag:rcm.example,${new Date().getFullYear()}:thing/video-${Date.now()}`,
      "oa:hasBody": {
        "@id": `tag:rcm.example,${new Date().getFullYear()}:body/video-type-${Date.now()}`,
        "@type": "rcm:PropertyAssertion",
        "rcm:predicate": "rdf:type",
        "rcm:object": "schema:VideoObject",
      },
      "dcterms:creator": `tag:rcm.example,${new Date().getFullYear()}:agent/rcm-system`,
      "dcterms:created": new Date().toISOString(),
      "rcm:evidence": [url],
    })

    // Annotation: content type
    if (contentType) {
      annotations.push({
        "@id": `tag:rcm.example,${new Date().getFullYear()}:annotation/video-format-${Date.now()}`,
        "@type": "oa:Annotation",
        "oa:motivatedBy": "oa:describing",
        "oa:hasTarget": `tag:rcm.example,${new Date().getFullYear()}:thing/video-${Date.now()}`,
        "oa:hasBody": {
          "@id": `tag:rcm.example,${new Date().getFullYear()}:body/video-format-${Date.now()}`,
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
        "@id": `tag:rcm.example,${new Date().getFullYear()}:annotation/video-extent-${Date.now()}`,
        "@type": "oa:Annotation",
        "oa:motivatedBy": "oa:describing",
        "oa:hasTarget": `tag:rcm.example,${new Date().getFullYear()}:thing/video-${Date.now()}`,
        "oa:hasBody": {
          "@id": `tag:rcm.example,${new Date().getFullYear()}:body/video-extent-${Date.now()}`,
          "@type": "rcm:PropertyAssertion",
          "rcm:predicate": "dcterms:extent",
          "rcm:object": contentLength,
        },
        "dcterms:creator": `tag:rcm.example,${new Date().getFullYear()}:agent/rcm-system`,
        "dcterms:created": new Date().toISOString(),
        "rcm:evidence": [url],
      })
    }

    // Annotation: time-based annotation support
    annotations.push({
      "@id": `tag:rcm.example,${new Date().getFullYear()}:annotation/video-time-${Date.now()}`,
      "@type": "oa:Annotation",
      "oa:motivatedBy": "oa:describing",
      "oa:hasTarget": `tag:rcm.example,${new Date().getFullYear()}:thing/video-${Date.now()}`,
      "oa:hasBody": {
        "@id": `tag:rcm.example,${new Date().getFullYear()}:body/video-time-${Date.now()}`,
        "@type": "rcm:PropertyAssertion",
        "rcm:predicate": "schema:hasTimeSelector",
        "rcm:object": "oa:SpecificResource#oa:TimeSelector",
      },
      "dcterms:creator": `tag:rcm.example,${new Date().getFullYear()}:agent/rcm-system`,
      "dcterms:created": new Date().toISOString(),
      "rcm:evidence": [url],
    })

    // Warnings
    if (!contentType || !contentType.includes("video")) warnings.push("Content-type may not be video")
    if (!contentLength) warnings.push("No content-length detected")

    return {
      sourceUrl: url,
      suggestedThingId: `tag:rcm.example,${new Date().getFullYear()}:thing/video-${Date.now()}`,
      suggestedLabel: "Video",
      suggestedType: "schema:VideoObject",
      representations,
      annotations,
      suggestedTools,
      suggestedActions,
      warnings,
      connector: this.id,
      quality: contentType.includes("video") ? "high" : "medium",
    }
  }

  private fallbackResult(url: string): ResolutionResult {
    return {
      sourceUrl: url,
      suggestedThingId: `tag:rcm.example,${new Date().getFullYear()}:thing/video-${Date.now()}`,
      suggestedLabel: "Video",
      suggestedType: "schema:VideoObject",
      representations: [],
      annotations: [],
      suggestedTools: ["video-viewer"],
      suggestedActions: ["annotate-time"],
      warnings: ["Failed to fetch video metadata"],
      connector: this.id,
      quality: "low",
    }
  }
}
