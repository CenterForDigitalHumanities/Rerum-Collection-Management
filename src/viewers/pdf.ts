/**
 * PDF Viewer
 *
 * Page-level and text-selection annotations.
 * Links pages to Things and extracted OCR/text Expressions.
 */

import type { Viewer, ViewerOutput, RenderOptions } from "./types.js";
import type { ChonkyNode, GraphQueryResult } from "../graph/types.js";

export class PdfViewer implements Viewer {
  readonly id = "pdf";
  readonly name = "PDF Viewer";
  readonly description = "Renders PDF documents with page-level and text-selection annotations.";

  canRender(slice: GraphQueryResult): boolean {
    return slice.nodes.some(
      (n) =>
        (n.entity as unknown as Record<string, unknown>)["@type"] === "rcm:Representation" &&
        (n.entity as unknown as Record<string, unknown>)["rcm:sourceUrl"]?.toString().endsWith(".pdf"),
    )
  }

  render(node: ChonkyNode, options?: RenderOptions): ViewerOutput {
    const pdfReps = node.representations.filter((r) => r.endsWith(".pdf") || r.includes("/pdf/"))

    const html = `<div class="rcm-viewer rcm-viewer-pdf">
      <h2>${this.escapeHtml(String(node.thing["rdfs:label"] ?? node.thing["@id"]))}</h2>
      ${pdfReps.map((r) => `<iframe class="pdf-embed" src="${this.escapeHtml(r)}" width="100%" height="600"></iframe>`).join("")}
      <section class="pdf-annotations">
        <h3>Annotations (${node.annotations.length})</h3>
        <ul>${node.annotations.map((a) => `<li>${this.escapeHtml(JSON.stringify(a["oa:hasBody"]))}</li>`).join("")}</ul>
      </section>
    </div>`

    return {
      viewer: this.id,
      html,
      data: node,
      meta: { thingId: node.thing["@id"], pdfRepresentations: pdfReps.length },
    }
  }

  renderSlice(slice: GraphQueryResult, options?: RenderOptions): ViewerOutput {
    const html = `<div class="rcm-viewer rcm-viewer-pdf">
      <h2>PDF Collection</h2>
      <p>${slice.nodes.length} items.</p>
    </div>`

    return { viewer: this.id, html, data: slice, meta: { items: slice.nodes.length } }
  }

  private escapeHtml(str: string): string {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
  }
}
