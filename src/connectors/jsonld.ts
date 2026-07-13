/**
 * JSON-LD Connector
 *
 * Resolves JSON-LD document URLs into RCM graph seeds.
 * Extracts properties, relationships, and representations from the document.
 */

import type { Connector, ResolutionResult, Representation, Annotation } from "./types.js";

export class JsonLdConnector implements Connector {
  readonly id = "jsonld";
  readonly name = "JSON-LD Connector";
  readonly description = "Resolves JSON-LD documents into RCM graph seeds with property extraction.";

  canHandle(url: string): boolean {
    return /\.(jsonld?)(\?.*)?$/.test(url) || /\/ld\/|\/linked-data\//.test(url)
  }

  async resolve(url: string): Promise<ResolutionResult> {
    try {
      const response = await fetch(url)
      if (!response.ok) {
        return this.fallbackResult(url)
      }

      const data = await response.json()
      return this.extractFromJsonLd(data, url)
    } catch {
      return this.fallbackResult(url)
    }
  }

  private extractFromJsonLd(data: Record<string, unknown>, url: string): ResolutionResult {
    const warnings: string[] = []
    const representations: Representation[] = []
    const annotations: Annotation[] = []
    const suggestedTools: string[] = []
    const suggestedActions: string[] = []

    // Extract document properties
    const docId = data["@id"] as string | undefined
    const docType = data["@type"] as string | string[] | undefined
    const docLabel = data["label"] || data["name"] || data["rdfs:label"]
    const docCreator = data["creator"] || data["dcterms:creator"]
    const docDate = data["date"] || data["dcterms:created"] || data["dcterms:issued"]
    const docDescription = data["description"] || data["dcterms:description"]
    const docContext = data["@context"]

    // Suggested Thing
    const suggestedThingId = docId
      ? this.toTagUri(docId)
      : `tag:rcm.example,${new Date().getFullYear()}:thing/jsonld-${Date.now()}`

    // The JSON-LD document itself is a representation
    representations.push({
      "@id": `tag:rcm.example,${new Date().getFullYear()}:rep/jsonld-${Date.now()}`,
      "@type": "rcm:Representation",
      "rdfs:label": docLabel || "JSON-LD Document",
      "rcm:represents": suggestedThingId,
      "rcm:sourceUrl": url,
      "rcm:role": "schema:DigitalDocument",
    })

    // Build annotations for extracted properties
    if (docLabel) {
      annotations.push({
        "@type": "oa:Annotation",
        "oa:motivatedBy": "oa:describing",
        "oa:hasTarget": suggestedThingId,
        "oa:hasBody": {
          "@type": "rcm:PropertyAssertion",
          "rcm:predicate": "rdfs:label",
          "rcm:object": docLabel,
        },
        "dcterms:creator": `tag:rcm.example,${new Date().getFullYear()}:agent/rcm-system`,
        "dcterms:created": new Date().toISOString(),
        "rcm:evidence": [url],
      })
    }

    if (docType) {
      const types = Array.isArray(docType) ? docType : [docType]
      for (const type of types) {
        annotations.push({
          "@type": "oa:Annotation",
          "oa:motivatedBy": "oa:describing",
          "oa:hasTarget": suggestedThingId,
          "oa:hasBody": {
            "@type": "rcm:PropertyAssertion",
            "rcm:predicate": "rdf:type",
            "rcm:object": type,
          },
          "dcterms:creator": `tag:rcm.example,${new Date().getFullYear()}:agent/rcm-system`,
          "dcterms:created": new Date().toISOString(),
          "rcm:evidence": [url],
        })
      }
    }

    if (docCreator) {
      annotations.push({
        "@type": "oa:Annotation",
        "oa:motivatedBy": "oa:describing",
        "oa:hasTarget": suggestedThingId,
        "oa:hasBody": {
          "@type": "rcm:PropertyAssertion",
          "rcm:predicate": "dcterms:creator",
          "rcm:object": docCreator,
        },
        "dcterms:creator": `tag:rcm.example,${new Date().getFullYear()}:agent/rcm-system`,
        "dcterms:created": new Date().toISOString(),
        "rcm:evidence": [url],
      })
    }

    if (docDate) {
      annotations.push({
        "@type": "oa:Annotation",
        "oa:motivatedBy": "oa:describing",
        "oa:hasTarget": suggestedThingId,
        "oa:hasBody": {
          "@type": "rcm:PropertyAssertion",
          "rcm:predicate": "dcterms:created",
          "rcm:object": docDate,
        },
        "dcterms:creator": `tag:rcm.example,${new Date().getFullYear()}:agent/rcm-system`,
        "dcterms:created": new Date().toISOString(),
        "rcm:evidence": [url],
      })
    }

    if (docDescription) {
      annotations.push({
        "@type": "oa:Annotation",
        "oa:motivatedBy": "oa:describing",
        "oa:hasTarget": suggestedThingId,
        "oa:hasBody": {
          "@type": "rcm:PropertyAssertion",
          "rcm:predicate": "dcterms:description",
          "rcm:object": docDescription,
        },
        "dcterms:creator": `tag:rcm.example,${new Date().getFullYear()}:agent/rcm-system`,
        "dcterms:created": new Date().toISOString(),
        "rcm:evidence": [url],
      })
    }

    // Extract relationships (properties that reference other resources)
    const relationshipKeys = ["partOf", "hasPart", "relatedTo", "references", "isPartOf", "seeAlso", "sameAs"]
    for (const key of relationshipKeys) {
      const value = data[key]
      if (value) {
        annotations.push({
          "@type": "oa:Annotation",
          "oa:motivatedBy": "oa:linking",
          "oa:hasTarget": suggestedThingId,
          "oa:hasBody": {
            "@type": "rcm:RelationshipAssertion",
            "rcm:predicate": key,
            "rcm:object": value,
          },
          "dcterms:creator": `tag:rcm.example,${new Date().getFullYear()}:agent/rcm-system`,
          "dcterms:created": new Date().toISOString(),
          "rcm:evidence": [url],
        })
      }
    }

    // Warnings
    if (!docId) warnings.push("No @id detected in JSON-LD document")
    if (!docType) warnings.push("No @type detected in JSON-LD document")
    if (!docContext) warnings.push("No @context detected in JSON-LD document")

    return {
      sourceUrl: url,
      suggestedThingId,
      suggestedLabel: docLabel as string | undefined,
      suggestedType: Array.isArray(docType) ? docType[0] : docType as string | undefined,
      representations,
      annotations,
      suggestedTools: Array.from(new Set(suggestedTools)),
      suggestedActions: Array.from(new Set(suggestedActions)),
      warnings,
      connector: this.id,
      quality: docId && docType ? "high" : docId ? "medium" : "low",
    }
  }

  private toTagUri(id: string): string {
    if (id.startsWith("http://") || id.startsWith("https://")) {
      return `tag:rcm.example,${new Date().getFullYear()}:thing/${id.replace(/[^a-zA-Z0-9]/g, "_")}`
    }
    return id
  }

  private fallbackResult(url: string): ResolutionResult {
    return {
      sourceUrl: url,
      suggestedThingId: `tag:rcm.example,${new Date().getFullYear()}:thing/jsonld-${Date.now()}`,
      suggestedLabel: "JSON-LD Document",
      suggestedType: undefined,
      representations: [],
      annotations: [],
      suggestedTools: [],
      suggestedActions: [],
      warnings: ["Failed to fetch or parse JSON-LD document"],
      connector: this.id,
      quality: "low",
    }
  }
}
