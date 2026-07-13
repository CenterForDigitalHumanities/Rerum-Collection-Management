/**
 * IIIF Viewer
 *
 * Opens IIIF manifests/canvases, shows image annotations,
 * allows region selectors, connects annotations to canvas/fragment or Thing.
 */

import type { Viewer, ViewerOutput, RenderOptions } from "./types.js";
import type { ChonkyNode, GraphQueryResult } from "../graph/types.js";

export class IiifViewer implements Viewer {
  readonly id = "iiif";
  readonly name = "IIIF Viewer";
  readonly description = "Renders IIIF manifests and canvases with annotation overlays.";

  canRender(slice: GraphQueryResult): boolean {
    return slice.nodes.some(
      (n) =>
        (n.entity as unknown as Record<string, unknown>)["@type"] === "rcm:Representation" &&
        (n.entity as unknown as Record<string, unknown>)["rcm:role"] === "iiif:Manifest",
    )
  }

  render(node: ChonkyNode, options?: RenderOptions): ViewerOutput {
    const iiifReps = node.representations.filter((r) => r.includes("iiif"))

    const html = this.renderHtml(node, iiifReps, options)

    return {
      viewer: this.id,
      html,
      data: node,
      meta: {
        thingId: node.thing["@id"],
        label: node.thing["rdfs:label"],
        iiifRepresentations: iiifReps.length,
        annotations: node.annotations.length,
      },
    }
  }

  renderSlice(slice: GraphQueryResult, options?: RenderOptions): ViewerOutput {
    const html = `<div class="rcm-viewer rcM-viewer-iiif">
      <h2>IIIF Collection View</h2>
      <p>${slice.nodes.length} items with IIIF representations.</p>
      <div class="iiif-grid">${slice.nodes.map((n) => this.renderItemCard(n)).join("")}</div>
    </div>`

    return {
      viewer: this.id,
      html,
      data: slice,
      meta: { items: slice.nodes.length },
    }
  }

  private renderHtml(node: ChonkyNode, iiifReps: string[], options?: RenderOptions): string {
    const showProvenance = options?.showProvenance ?? true
    const showDisputes = options?.showDisputes ?? true

    let html = `<div class="rcm-viewer rcm-viewer-iiif">
      <h2>${this.escapeHtml(String(node.thing["rdfs:label"] ?? node.thing["@id"]))}</h2>`

    // IIIF viewer embed
    for (const rep of iiifReps) {
      html += `<div class="iiif-embed" data-manifest="${this.escapeHtml(rep)}">
        <p class="iiif-placeholder">IIIF viewer would embed here. Data: ${this.escapeHtml(rep)}</p>
      </div>`
    }

    // Annotations section
    if (node.annotations.length > 0) {
      html += `<section class="annotations">
        <h3>Assertions about this Thing (${node.annotations.length})</h3>
        <ul>`
      for (const ann of node.humanAnnotations) {
        html += `<li class="annotation human">
          <span class="motivation">${this.escapeHtml(ann["oa:motivatedBy"])}</span>
          ${showProvenance ? `<span class="creator">by ${this.escapeHtml(ann["dcterms:creator"] ?? "unknown")}</span>` : ""}
        </li>`
      }
      html += `</ul></section>`
    }

    // Machine annotations (separate)
    if (node.machineAnnotations.length > 0) {
      html += `<section class="machine-annotations">
        <h3>Machine Suggestions (${node.machineAnnotations.length})</h3>
        <ul class="machine">`
      for (const ann of node.machineAnnotations) {
        html += `<li class="annotation machine">${this.escapeHtml(JSON.stringify(ann["oa:hasBody"]))}</li>`
      }
      html += `</ul></section>`
    }

    // Disputes
    if (showDisputes && node.disputes.length > 0) {
      html += `<section class="disputes">
        <h3>Disputed Assertions (${node.disputes.length})</h3>
        <ul>`
      for (const ann of node.disputes) {
        html += `<li class="dispute">${this.escapeHtml(JSON.stringify(ann["oa:hasBody"]))}</li>`
      }
      html += `</ul></section>`
    }

    html += `</div>`
    return html
  }

  private renderItemCard(node: import("../graph/types.js").GraphNode): string {
    const entity = node.entity as unknown as Record<string, unknown>
    return `<div class="iiif-item-card">
      <h4>${this.escapeHtml(String(entity["rdfs:label"] ?? entity["@id"]))}</h4>
      <p class="type">${this.escapeHtml(String(entity["@type"]))}</p>
    </div>`
  }

  private escapeHtml(str: string): string {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
  }
}
