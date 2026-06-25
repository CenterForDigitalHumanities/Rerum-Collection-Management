/**
 * Network Viewer
 *
 * General graph exploration.
 * Filter by predicate, creator, collection, evidence, date.
 */

import type { Viewer, ViewerOutput, RenderOptions } from "./types.js";
import type { ChonkyNode, GraphQueryResult } from "../graph/types.js";

export class NetworkViewer implements Viewer {
  readonly id = "network";
  readonly name = "Network Viewer";
  readonly description = "General graph exploration with filtering by predicate, creator, collection, evidence, date.";

  canRender(_slice: GraphQueryResult): boolean {
    // Can always render a network view
    return true;
  }

  render(node: ChonkyNode, options?: RenderOptions): ViewerOutput {
    const nodes = [
      { id: node.thing["@id"], label: String(node.thing["rdfs:label"] ?? node.thing["@id"]), type: "thing" },
      ...node.representations.map((r) => ({ id: r, label: r, type: "representation" })),
      ...node.collections.map((c) => ({ id: c, label: c, type: "collection" })),
    ];

    const links = node.relatedThings.map((e) => ({
      source: e.source,
      target: e.target,
      predicate: e.predicate,
    }));

    const html = `<div class="rcm-viewer rcm-viewer-network">
      <h2>Network: ${this.escapeHtml(String(node.thing["rdfs:label"] ?? node.thing["@id"]))}</h2>
      <div class="network-container" data-nodes='${JSON.stringify(nodes)}' data-links='${JSON.stringify(links)}'>
        <p class="network-placeholder">Network viewer would render ${nodes.length} nodes and ${links.length} edges.</p>
      </div>
      <section class="network-legend">
        <h3>Legend</h3>
        <ul>
          <li><span class="node-thing"></span> Thing</li>
          <li><span class="node-representation"></span> Representation</li>
          <li><span class="node-collection"></span> Collection</li>
        </ul>
      </section>
    </div>`;

    return {
      viewer: this.id,
      html,
      data: { nodes, links },
      meta: { thingId: node.thing["@id"], nodeCount: nodes.length, edgeCount: links.length },
    };
  }

  renderSlice(slice: GraphQueryResult, options?: RenderOptions): ViewerOutput {
    const nodes = slice.nodes.map((n) => ({
      id: n.entity["@id"],
      label: String((n.entity as unknown as Record<string, unknown>)["rdfs:label"] ?? n.entity["@id"]),
      type: n.entity["@type"],
      inDegree: n.inDegree,
      outDegree: n.outDegree,
    }));

    const links = slice.edges.map((e) => ({
      source: e.source,
      target: e.target,
      predicate: e.predicate,
    }));

    const html = `<div class="rcm-viewer rcm-viewer-network">
      <h2>Network View</h2>
      <p>${nodes.length} nodes, ${links.length} edges.</p>
      <div class="network-container" data-nodes='${JSON.stringify(nodes)}' data-links='${JSON.stringify(links)}'>
        <p class="network-placeholder">Network viewer would render graph.</p>
      </div>
    </div>`;

    return {
      viewer: this.id,
      html,
      data: { nodes, links },
      meta: { nodeCount: nodes.length, edgeCount: links.length },
    };
  }

  private escapeHtml(str: string): string {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
  }
}
