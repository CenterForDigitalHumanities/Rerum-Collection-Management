/**
 * Audio Connector
 *
 * Resolves audio URLs into RCM graph seeds.
 * Supports direct audio URLs (.mp3, .wav, .ogg, .flac, .aac, .m4a, .wma, .opus).
 */

import type { Connector, ResolutionResult, Representation, Annotation } from "./types.js";

export class AudioConnector implements Connector {
  readonly id = "audio";
  readonly name = "Audio Connector";
  readonly description = "Resolves audio URLs into RCM graph seeds with time-based annotation support.";

  canHandle(url: string): boolean {
    // Match common audio file extensions
    return /\.(mp3|wav|ogg|flac|aac|m4a|wma|opus)(\?.*)?$/i.test(url)
  }

  async resolve(url: string): Promise<ResolutionResult> {
    try {
      const response = await fetch(url, { method: "HEAD" })
      if (!response.ok) {
        return this.fallbackResult(url)
      }

      const contentType = response.headers.get("content-type") || ""
      const contentLength = response.headers.get("content-length")

      return this.extractFromAudio(url, contentType, contentLength)
    } catch {
      return this.fallbackResult(url)
    }
  }

  private extractFromAudio(url: string, contentType: string, contentLength: string | null): ResolutionResult {
    const warnings: string[] = []
    const representations: Representation[] = []
    const annotations: Annotation[] = []
    const suggestedTools: string[] = ["audio-viewer"]
    const suggestedActions: string[] = ["annotate-time"]

    // The audio itself is a representation
    representations.push({
      "@id": `tag:rcm.example,${new Date().getFullYear()}:rep/audio-${Date.now()}`,
      "@type": "rcm:Representation",
      "rdfs:label": "Audio",
      "rcm:represents": `tag:rcm.example,${new Date().getFullYear()}:thing/audio-${Date.now()}`,
      "rcm:sourceUrl": url,
      "rcm:role": "schema:AudioObject",
    })

    // Annotation: link audio to Thing
    annotations.push({
      "@id": `tag:rcm.example,${new Date().getFullYear()}:annotation/audio-link-${Date.now()}`,
      "@type": "oa:Annotation",
      "oa:motivatedBy": "oa:describing",
      "oa:hasTarget": `tag:rcm.example,${new Date().getFullYear()}:thing/audio-${Date.now()}`,
      "oa:hasBody": {
        "@id": `tag:rcm.example,${new Date().getFullYear()}:body/audio-link-${Date.now()}`,
        "@type": "rcm:PropertyAssertion",
        "rcm:predicate": "rdf:type",
        "rcm:object": "schema:AudioObject",
      },
      "dcterms:creator": `tag:rcm.example,${new Date().getFullYear()}:agent/audio-connector`,
      "dcterms:created": new Date().toISOString(),
      "rcm:evidence": [url],
    })

    // Annotation: content type
    if (contentType) {
      annotations.push({
        "@id": `tag:rcm.example,${new Date().getFullYear()}:annotation/audio-content-type-${Date.now()}`,
        "@type": "oa:Annotation",
        "oa:motivatedBy": "oa:describing",
        "oa:hasTarget": `tag:rcm.example,${new Date().getFullYear()}:thing/audio-${Date.now()}`,
        "oa:hasBody": {
          "@id": `tag:rcm.example,${new Date().getFullYear()}:body/audio-content-type-${Date.now()}`,
          "@type": "rcm:PropertyAssertion",
          "rcm:predicate": "dc:format",
          "rcm:object": contentType,
        },
        "dcterms:creator": `tag:rcm.example,${new Date().getFullYear()}:agent/audio-connector`,
        "dcterms:created": new Date().toISOString(),
        "rcm:evidence": [url],
      })
    }

    // Annotation: content length (if available)
    if (contentLength) {
      annotations.push({
        "@id": `tag:rcm.example,${new Date().getFullYear()}:annotation/audio-size-${Date.now()}`,
        "@type": "oa:Annotation",
        "oa:motivatedBy": "oa:describing",
        "oa:hasTarget": `tag:rcm.example,${new Date().getFullYear()}:thing/audio-${Date.now()}`,
        "oa:hasBody": {
          "@id": `tag:rcm.example,${new Date().getFullYear()}:body/audio-size-${Date.now()}`,
          "@type": "rcm:PropertyAssertion",
          "rcm:predicate": "dc:extent",
          "rcm:object": `${contentLength} bytes`,
        },
        "dcterms:creator": `tag:rcm.example,${new Date().getFullYear()}:agent/audio-connector`,
        "dcterms:created": new Date().toISOString(),
        "rcm:evidence": [url],
      })
    }

    // Annotation: time-based annotation support
    annotations.push({
      "@id": `tag:rcm.example,${new Date().getFullYear()}:annotation/audio-time-support-${Date.now()}`,
      "@type": "oa:Annotation",
      "oa:motivatedBy": "oa:commenting",
      "oa:hasTarget": `tag:rcm.example,${new Date().getFullYear()}:thing/audio-${Date.now()}`,
      "oa:hasBody": {
        "@id": `tag:rcm.example,${new Date().getFullYear()}:body/audio-time-support-${Date.now()}`,
        "@type": "cnt:ContentAsText",
        "cnt:chars": "This audio supports time-based annotations using IIIF Time Selector syntax (e.g., t=00:01:30,00:02:00 for 1:30-2:00).",
      },
      "dcterms:creator": `tag:rcm.example,${new Date().getFullYear()}:agent/audio-connector`,
      "dcterms:created": new Date().toISOString(),
      "rcm:provenance": "generated",
    })

    return {
      sourceUrl: url,
      suggestedThingId: `tag:rcm.example,${new Date().getFullYear()}:thing/audio-${Date.now()}`,
      suggestedLabel: "Audio",
      suggestedType: "schema:AudioObject",
      representations,
      annotations,
      suggestedTools,
      suggestedActions,
      warnings,
      connector: this.id,
      quality: "high",
    }
  }

  private fallbackResult(url: string): ResolutionResult {
    return {
      sourceUrl: url,
      suggestedThingId: `tag:rcm.example,${new Date().getFullYear()}:thing/audio-${Date.now()}`,
      suggestedLabel: "Audio",
      suggestedType: "schema:AudioObject",
      representations: [],
      annotations: [],
      suggestedTools: ["audio-viewer"],
      suggestedActions: ["annotate-time"],
      warnings: ["Failed to fetch audio metadata"],
      connector: this.id,
      quality: "low",
    }
  }
}
