/**
 * IIIF Connector
 *
 * Resolves IIIF manifest and canvas URLs into RCM graph seeds.
 */

import type { Connector, ResolutionResult, Representation, Annotation } from "./types.js";
import type { Representation as RcmRepresentation } from "../core/types.js";

export class IiifConnector implements Connector {
  readonly id = "iiif";
  readonly name = "IIIF Connector";
  readonly description = "Resolves IIIF Presentation API manifests and canvases into RCM graph seeds.";

  canHandle(url: string): boolean {
    // Match IIIF Presentation API v2/v3 URLs
    return (
      /\/api\/presentation\/\d+\.\d+\//.test(url) ||
      /\/manifests?\//.test(url) ||
      /\/manifest\/.*/.test(url) ||
      /iiif\.io/.test(url)
    )
  }

  async resolve(url: string): Promise<ResolutionResult> {
    try {
      const response = await fetch(url)
      if (!response.ok) {
        return this.fallbackResult(url)
      }

      const manifest = await response.json()
      return this.extractFromManifest(manifest, url)
    } catch {
      return this.fallbackResult(url)
    }
  }

  private extractFromManifest(manifest: Record<string, unknown>, url: string): ResolutionResult {
    const label = this.extractLabel(manifest)
    const manifestId = manifest["@id"] as string | undefined

    // Suggested Thing
    const suggestedThingId = manifestId
      ? this.toTagUri(manifestId)
      : `tag:rcm.example,${new Date().getFullYear()}:thing/iiif-${Date.now()}`

    // Representation
    const representations: RcmRepresentation[] = [
      {
        "@id": `tag:rcm.example,${new Date().getFullYear()}:rep/iiif-${Date.now()}`,
        "@type": "rcm:Representation",
        "rdfs:label": label,
        "rcm:represents": suggestedThingId,
        "rcm:sourceUrl": url,
        "rcm:role": "iiif:Manifest",
      },
    ]

    // Extract canvases as additional representations
    const bodies = ((manifest as Record<string, unknown>)["sequences"] as Record<string, unknown>[])?.[0]?.["canvases"] ?? (manifest as Record<string, unknown>)["items"] ?? []
    for (const canvas of bodies as Record<string, unknown>[]) {
      const canvasId = canvas["@id"] as string | undefined
      const canvasLabel = canvas["label"] as string | undefined

      if (canvasId) {
        representations.push({
          "@id": this.toTagUri(canvasId),
          "@type": "rcm:Representation",
          "rdfs:label": canvasLabel,
          "rcm:represents": suggestedThingId,
          "rcm:sourceUrl": canvasId,
          "rcm:role": "iiif:Canvas",
        })
      }
    }

    // Annotation: link manifest to Thing
    const annotations: Annotation[] = [
      {
        "@id": `tag:rcm.example,${new Date().getFullYear()}:annotation/iiif-resolve-${Date.now()}`,
        "@type": "oa:Annotation",
        "oa:motivatedBy": "oa:describing",
        "oa:hasTarget": suggestedThingId,
        "oa:hasBody": {
          "@id": `tag:rcm.example,${new Date().getFullYear()}:body/iiif-link-${Date.now()}`,
          "@type": "rcm:RepresentationLink",
          "rcm:representation": representations[0]!["@id"],
          "rcm:role": "iiif:Manifest",
        },
        "dcterms:creator": "tag:rcm.example,2026:agent/iiif-connector",
        "dcterms:created": new Date().toISOString(),
        "rcm:provenance": "imported",
      },
    ];

    return {
      sourceUrl: url,
      suggestedThingId,
      suggestedLabel: label,
      suggestedType: "crm:E22_Human-Made_Object",
      representations,
      annotations,
      suggestedTools: ["iiif-viewer"],
      suggestedActions: ["view-iiif"],
      warnings: [],
      connector: this.id,
      quality: "high",
    }
  }

  private fallbackResult(url: string): ResolutionResult {
    return {
      sourceUrl: url,
      suggestedThingId: `tag:rcm.example,${new Date().getFullYear()}:thing/iiif-${Date.now()}`,
      representations: [
        {
          "@id": `tag:rcm.example,${new Date().getFullYear()}:rep/iiif-${Date.now()}`,
          "@type": "rcm:Representation",
          "rcm:represents": `tag:rcm.example,${new Date().getFullYear()}:thing/iiif-${Date.now()}`,
          "rcm:sourceUrl": url,
          "rcm:role": "iiif:Manifest",
        },
      ],
      annotations: [],
      suggestedTools: ["iiif-viewer"],
      suggestedActions: ["view-iiif"],
      warnings: ["Could not fetch IIIF manifest"],
      connector: this.id,
      quality: "low",
    }
  }

  private extractLabel(manifest: Record<string, unknown>): string | undefined {
    const label = manifest["label"]
    if (typeof label === "string") return label
    if (typeof label === "object" && label !== null) {
      const lbl = label as Record<string, unknown>;
      const en = lbl["en"];
      if (Array.isArray(en) && en[0] && typeof en[0] === "string") return en[0];
      if (typeof lbl["en"] === "string") return lbl["en"];
    }
    return undefined;
  }

  private toTagUri(id: string): string {
    try {
      const url = new URL(id);
      const host = url.hostname.replace(/\./g, "-");
      const path = url.pathname.replace(/\//g, "/").replace(/[^/\w\-]/g, "");
      return `tag:${host},${url.pathname.includes(year()) ? "" : `${year()}`}:thing${path}`;
    } catch {
      return `tag:rcm.example,${year()}:thing/external-${Date.now()}`;
    }
  }
}

function year(): string {
  return new Date().getFullYear().toString();
}
