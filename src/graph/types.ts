/**
 * Graph Module Types
 *
 * Types for graph query, traversal, and assembly.
 */

import type { CoreEntity, Thing, Annotation, Collection } from "../core/types.js";

/**
 * A graph node in the RCM graph.
 */
export interface GraphNode {
  /** The entity this node represents. */
  entity: CoreEntity;
  /** Number of incoming edges. */
  inDegree: number;
  /** Number of outgoing edges. */
  outDegree: number;
}

/**
 * A graph edge (relationship between nodes).
 */
export interface GraphEdge {
  /** Source node @id. */
  source: string;
  /** Target node @id. */
  target: string;
  /** Predicate/relationship type. */
  predicate: string;
  /** The annotation that asserts this edge. */
  annotationId: string;
}

/**
 * Result of a graph query.
 */
export interface GraphQueryResult {
  /** Nodes in the result. */
  nodes: GraphNode[];
  /** Edges in the result. */
  edges: GraphEdge[];
}

/**
 * A "chonky node" — a Thing with all its accumulated annotations and relationships.
 */
export interface ChonkyNode {
  /** The central Thing. */
  thing: Thing;
  /** All annotations targeting this Thing. */
  annotations: Annotation[];
  /** All representations of this Thing. */
  representations: string[];
  /** All expressions of this Thing. */
  expressions: string[];
  /** Collections this Thing is a member of. */
  collections: string[];
  /** Related Things (via relationship assertions). */
  relatedThings: GraphEdge[];
  /** Machine-generated annotations (separately labeled). */
  machineAnnotations: Annotation[];
  /** Human annotations. */
  humanAnnotations: Annotation[];
  /** Disputed assertions. */
  disputes: Annotation[];
}

/**
 * Graph engine interface.
 */
export interface GraphEngine {
  /** Add an entity to the graph. */
  addEntity(entity: CoreEntity): void;

  /** Remove an entity from the graph. */
  removeEntity(id: string): void;

  /** Get a node by @id. */
  getNode(id: string): GraphNode | undefined;

  /** Get all annotations targeting a specific @id. */
  getAnnotationsForTarget(targetId: string): Annotation[];

  /** Assemble a chonky node for a Thing. */
  assembleChonkyNode(thingId: string): ChonkyNode;

  /** Query the graph with a traversal. */
  query(options: GraphQueryOptions): GraphQueryResult;

  /** Get all Things in a collection. */
  getCollectionMembers(collectionId: string): string[];
}

/**
 * Options for graph queries.
 */
export interface GraphQueryOptions {
  /** Start from this node @id. */
  startFrom?: string;
  /** Traverse these predicates. */
  predicates?: string[];
  /** Maximum depth of traversal. */
  depth?: number;
  /** Filter by entity type. */
  typeFilter?: string[];
}
