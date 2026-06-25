/**
 * Detail Viewer
 *
 * Renders a chonky node as a detail page.
 * Shows assertions, representations, evidence, disputes, and machine suggestions.
 */

import type { Viewer, ViewerOutput, RenderOptions } from "./types";
import type { ChonkyNode, GraphQueryResult } from "../graph/types";

export class DetailViewer implements Viewer {
  readonly id = "detail";
  readonly name = "Detail Viewer";
  readonly description = "Renders a chonky node as a detail page with assembled view from annotations.";

  canRender(_slice: GraphQueryResult): boolean {
    return true;
  }

  render(node: ChonkyNode, options?: RenderOptions): ViewerOutput {
    const showProvenance = options?.showProvenance ?? true;
    const showEvidence = options?.showEvidence ?? true;
    const showDisputes = options?.showDisputes ?? true;

    let html = `<div class="rcm-viewer rcm-viewer-detail">
      <header>
        <h1>${this.escapeHtml(String(node.thing["rdfs:label"] ?? node.thing["@id"]))}</h1>
        <p class="thing-id">${this.escapeHtml(node.thing["@id"])}</p>
        <p class="thing-type">${this.escapeHtml(String(node.thing["@type"]))}</p>
        ${node.thing["rcm:lifecycle"] ? `<span class="lifecycle-badge">${this.escapeHtml(node.thing["rcm:lifecycle"])}</span>` : ""}
      </header>`;

    // Assertions
    if (node.humanAnnotations.length > 0) {
      html += `<section class="assertions">
        <h2>Assertions about this Thing (${node.humanAnnotations.length})</h2>
        <ul>`;
      for (const ann of node.humanAnnotations) {
        html += `<li class="assertion">
          <span class="predicate">${this.escapeHtml(JSON.stringify(ann["oa:hasBody"]))}</span>
          ${showProvenance ? `<cite>— ${this.escapeHtml(ann["dcterms:creator"] ?? "unknown")}, ${this.escapeHtml(ann["dcterms:created"] ?? "")}</cite>` : ""}
          ${showEvidence && ann["rcm:evidence"] ? `<details><summary>Evidence</summary><ul>${ann["rcm:evidence"].map((e) => `<li><a href="${this.escapeHtml(e)}">${this.escapeHtml(e)}</a></li>`).join("")}</ul></details>` : ""}
        </li>`;
      }
      html += `</ul></section>`;
    }

    // Representations
    if (node.representations.length > 0) {
      html += `<section class="representations">
        <h2>Representations (${node.representations.length})</h2>
        <ul>${node.representations.map((r) => `<li><a href="${this.escapeHtml(r)}">${this.escapeHtml(r)}</a></li>`).join("")}</ul>
      </section>`;
    }

    // Machine suggestions (separate)
    if (node.machineAnnotations.length > 0) {
      html += `<section class="machine-suggestions">
        <h2>Machine Suggestions (${node.machineAnnotations.length})</h2>
        <p class="warning">These are probabilistic guesses, not scholarly assertions.</p>
        <ul>${node.machineAnnotations.map((a) => `<li>${this.escapeHtml(JSON.stringify(a["oa:hasBody"]))}</li>`).join("")}</ul>
      </section>`;
    }

    // Disputes
    if (showDisputes && node.disputes.length > 0) {
      html += `<section class="disputes">
        <h2>Disputed Assertions (${node.disputes.length})</h2>
        <ul>${node.disputes.map((a) => `<li>${this.escapeHtml(JSON.stringify(a["oa:hasBody"]))}</li>`).join("")}</ul>
      </section>`;
    }

    // Collection membership
    if (node.collections.length > 0) {
      html += `<section class="collections">
        <h2>Collection Membership</h2>
        <ul>${node.collections.map((c) => `<li><a href="${this.escapeHtml(c)}">${this.escapeHtml(c)}</a></li>`).join("")}</ul>
      </section>`;
    }

    // Related Things
    if (node.relatedThings.length > 0) {
      html += `<section class="related">
        <h2>Related Things (${node.relatedThings.length})</h2>
        <ul>${node.relatedThings.map((e) => `<li><a href="${this.escapeHtml(e.target)}">${this.escapeHtml(e.predicate)} → ${this.escapeHtml(e.target)}</a></li>`).join("")}</ul>
      </section>`;
    }

    html += `</div>`;

    return {
      viewer: this.id,
      html,
      data: node,
      meta: {
        thingId: node.thing["@id"],
        assertionCount: node.humanAnnotations.length,
        machineCount: node.machineAnnotations.length,
        disputeCount: node.disputes.length,
      },
    };
  }

  renderSlice(slice: GraphQueryResult, options?: RenderOptions): ViewerOutput {
    const html = `<div class="rcm-viewer rcm-viewer-detail">
      <h2>Collection View</h2>
      <p>${slice.nodes.length} items in this collection.</p>
      <ul class="item-list">
        ${slice.nodes.map((n) => `<li><a href="${this.escapeHtml(n.entity["@id"])}">${this.escapeHtml(String((n.entity as Record<string, unknown>)["rdfs:label"] ?? n.entity["@id"]))}</a></li>`).join("")}
      </ul>
    </div>`;

    return { viewer: this.id, html, data: slice, meta: { itemCount: slice.nodes.length } };
  }

  private escapeHtml(str: string): string {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
}
