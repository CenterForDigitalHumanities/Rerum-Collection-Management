/**
 * Map Viewer
 *
 * Renders Places or Things with geospatial assertions.
 * Allows uncertain or competing location assertions without replacing one another.
 */

import type { Viewer, ViewerOutput, RenderOptions } from "./types.js";
import type { ChonkyNode, GraphQueryResult } from "../graph/types.js";

export interface GeoPoint {
  latitude: number;
  longitude: number;
  label?: string;
  source: string; // annotation @id
}

export class MapViewer implements Viewer {
  readonly id = "map";
  readonly name = "Map Viewer";
  readonly description = "Renders geospatial assertions on a map. Supports competing locations.";

  canRender(slice: GraphQueryResult): boolean {
    return slice.nodes.some(
      (n) =>
        (n.entity as unknown as Record<string, unknown>)["@type"] === "schema:Place" ||
        this.hasGeoAnnotation(n),
    )
  }

  render(node: ChonkyNode, options?: RenderOptions): ViewerOutput {
    const geoPoints = this.extractGeoPoints(node)

    const html = `<div class="rcm-viewer rcm-viewer-map">
      <h2>${this.escapeHtml(String(node.thing["rdfs:label"] ?? node.thing["@id"]))}</h2>
      <div class="map-container" data-points='${JSON.stringify(geoPoints)}'>
        <p class="map-placeholder">Map viewer would render here with ${geoPoints.length} location(s).</p>
        ${geoPoints.length > 1 ? `<p class="competing-locations">Multiple location assertions shown.</p>` : ""}
      </div>
      <section class="location-assertions">
        <h3>Location Assertions</h3>
        <ul>${geoPoints.map((p) => `<li>${p.label ?? "Unknown"} (${p.latitude}, ${p.longitude}) — source: ${p.source}</li>`).join("")}</ul>
      </section>
    </div>`

    return {
      viewer: this.id,
      html,
      data: node,
      meta: { thingId: node.thing["@id"], geoPoints: geoPoints.length },
    }
  }

  renderSlice(slice: GraphQueryResult, options?: RenderOptions): ViewerOutput {
    const places = slice.nodes.filter(
      (n) => (n.entity as unknown as Record<string, unknown>)["@type"] === "schema:Place",
    )

    const html = `<div class="rcm-viewer rcm-viewer-map">
      <h2>Map View</h2>
      <p>${places.length} places in this collection.</p>
      <div class="map-container">
        <p class="map-placeholder">Map viewer would render ${places.length} places.</p>
      </div>
    </div>`

    return { viewer: this.id, html, data: slice, meta: { places: places.length } }
  }

  private hasGeoAnnotation(node: import("../graph/types.js").GraphNode): boolean {
    const entity = node.entity as unknown as Record<string, unknown>
    return (
      entity["geojson:geometry"] !== undefined ||
      entity["schema:latitude"] !== undefined ||
      entity["schema:longitude"] !== undefined
    )
  }

  private extractGeoPoints(node: ChonkyNode): GeoPoint[] {
    const points: GeoPoint[] = []

    for (const ann of node.annotations) {
      const body = ann["oa:hasBody"] as Record<string, unknown>
      if (body?.["rcm:predicate"] === "schema:location" || body?.["rcm:predicate"] === "geojson:geometry") {
        // Try to extract coordinates from the body or linked resource
        const lat = body["schema:latitude"] ?? body["latitude"]
        const lng = body["schema:longitude"] ?? body["longitude"]
        if (lat !== undefined && lng !== undefined) {
          points.push({
            latitude: Number(lat),
            longitude: Number(lng),
            label: String(body["rdfs:label"] ?? body["rcm:object"]),
            source: ann["@id"],
          })
        }
      }
    }

    return points
  }

  private escapeHtml(str: string): string {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
  }
}
