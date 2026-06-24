/**
 * Connector Types
 *
 * Types for the resource resolver / connector layer.
 * "Paste URL, get useful graph seeds."
 */

import type { RcmObject, Representation, Annotation } from "../core/types";

/**
 * Result of resolving a URL into graph seeds.
 */
export interface ResolutionResult {
  /** The original URL that was resolved. */
  sourceUrl: string;
  /** Suggested Thing @id (may be derived from the URL). */
  suggestedThingId: string;
  /** Suggested label for the Thing. */
  suggestedLabel?: string;
  /** Suggested type for the Thing (CIDOC CRM, schema.org, etc.). */
  suggestedType?: string;
  /** Representations extracted from the source. */
  representations: Representation[];
  /** Annotations extracted or suggested from the source. */
  annotations: Annotation[];
  /** Connector that produced this result. */
  connector: string;
  /** Confidence in the resolution (informational only). */
  quality: "high" | "medium" | "low";
}

/**
 * Base interface for all connectors.
 */
export interface Connector {
  /** Unique identifier for this connector. */
  id: string;
  /** Human-readable name. */
  name: string;
  /** Description of what this connector does. */
  description: string;
  /**
   * Returns true if this connector can handle the given URL.
   */
  canHandle(url: string): boolean;
  /**
   * Resolve a URL into graph seeds.
   */
  resolve(url: string): Promise<ResolutionResult>;
}

/**
 * Registry of available connectors.
 */
export interface ConnectorRegistry {
  /** Register a connector. */
  register(connector: Connector): void;
  /** Get a connector by ID. */
  get(id: string): Connector | undefined;
  /** Get all connectors. */
  all(): Connector[];
  /** Find the first connector that can handle the given URL. */
  findForUrl(url: string): Connector | undefined;
  /** Find all connectors that can handle the given URL. */
  findAllForUrl(url: string): Connector[];
}
