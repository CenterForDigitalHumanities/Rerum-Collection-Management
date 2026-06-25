/**
 * Viewer Types
 *
 * Every viewer receives a graph slice, not an application database record.
 */

import type { ChonkyNode, GraphQueryResult } from "../graph/types.js";

/**
 * Base interface for all viewers.
 */
export interface Viewer {
  /** Unique identifier for this viewer. */
  id: string;
  /** Human-readable name. */
  name: string;
  /** Description of what this viewer renders. */
  description: string;
  /**
   * Returns true if this viewer can render the given graph slice.
   */
  canRender(slice: GraphQueryResult): boolean;
  /**
   * Render a chonky node.
   */
  render(node: ChonkyNode): ViewerOutput;
  /**
   * Render a graph slice (collection, network, etc.).
   */
  renderSlice(slice: GraphQueryResult): ViewerOutput;
}

/**
 * Output from a viewer render.
 */
export interface ViewerOutput {
  /** The viewer that produced this output. */
  viewer: string;
  /** HTML string for rendering. */
  html: string;
  /** JSON-LD data that was rendered. */
  data: unknown;
  /** Metadata about the rendering (e.g., number of items, warnings). */
  meta: Record<string, unknown>;
}

/**
 * Options for rendering.
 */
export interface RenderOptions {
  /** Whether to show provenance (who asserted what). */
  showProvenance?: boolean;
  /** Whether to show machine annotations separately. */
  separateMachineAnnotations?: boolean;
  /** Whether to show disputed assertions. */
  showDisputes?: boolean;
  /** Whether to show evidence links. */
  showEvidence?: boolean;
  /** Maximum number of items to render. */
  maxItems?: number;
  /** Template to use (for project-specific rendering). */
  template?: string;
}
