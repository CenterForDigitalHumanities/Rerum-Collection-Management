/**
 * Graph Engine Implementation
 *
 * In-memory graph engine for RCM.
 * Supports entity storage, annotation indexing, and chonky node assembly.
 */

import type {
  GraphEngine,
  GraphNode,
  GraphEdge,
  GraphQueryResult,
  ChonkyNode,
  GraphQueryOptions,
} from "./types.js";
import type { CoreEntity, Thing, Annotation } from "../core/types.js";

export class GraphEngineImpl implements GraphEngine {
  private entities: Map<string, CoreEntity> = new Map();
  private annotationsByTarget: Map<string, Annotation[]> = new Map();
  private edges: GraphEdge[] = [];

  addEntity(entity: CoreEntity): void {
    this.entities.set(entity["@id"], entity);
  }

  removeEntity(id: string): void {
    this.entities.delete(id);
    this.annotationsByTarget.delete(id);
    this.edges = this.edges.filter(
      (e) => e.source !== id && e.target !== id,
    );
  }

  getNode(id: string): GraphNode | undefined {
    const entity = this.entities.get(id)
    if (!entity) return

    const inDegree = this.edges.filter((e) => e.target === id).length
    const outDegree = this.edges.filter((e) => e.source === id).length

    return { entity, inDegree, outDegree }
  }

  getAnnotationsForTarget(targetId: string): Annotation[] {
    return this.annotationsByTarget.get(targetId) ?? []
  }

  /**
   * Index an annotation by its target.
   */
  indexAnnotation(annotation: Annotation): void {
    const target = this.extractTargetId(annotation)
    if (!target) return

    const existing = this.annotationsByTarget.get(target) ?? []
    existing.push(annotation)
    this.annotationsByTarget.set(target, existing)

    // Also store the annotation as an entity
    this.entities.set(annotation["@id"], annotation)

    // Track edges from relationship assertions
    this.trackEdgeFromAnnotation(annotation, target)
  }

  assembleChonkyNode(thingId: string): ChonkyNode {
    const thing = this.entities.get(thingId) as Thing | undefined
    if (!thing) {
      return {
        thing: { "@id": thingId, "@type": "schema:Thing" } as Thing,
        annotations: [],
        representations: [],
        expressions: [],
        collections: [],
        relatedThings: [],
        machineAnnotations: [],
        humanAnnotations: [],
        disputes: [],
      }
    }

    const annotations = this.getAnnotationsForTarget(thingId)

    const humanAnnotations = annotations.filter(
      (a) => a["rcm:provenance"] === "human" || !a["rcm:provenance"],
    )
    const machineAnnotations = annotations.filter(
      (a) => a["rcm:provenance"] === "machine",
    )

    const disputes = annotations.filter(
      (a) => (a["oa:hasBody"] as Record<string, unknown>)?.["@type"] === "rcm:DisputedAssertion",
    )

    const representations = annotations
      .filter(
        (a) => (a["oa:hasBody"] as Record<string, unknown>)?.["@type"] === "rcm:RepresentationLink",
      )
      .map((a) => (a["oa:hasBody"] as Record<string, unknown>)["rcm:representation"] as string)

    const collections = annotations
      .filter(
        (a) => (a["oa:hasBody"] as Record<string, unknown>)?.["@type"] === "rcm:CollectionMembership",
      )
      .map((a) => (a["oa:hasBody"] as Record<string, unknown>)["rcm:collection"] as string)

    const relatedThings = this.edges.filter((e) => e.source === thingId || e.target === thingId)

    return {
      thing,
      annotations,
      representations,
      expressions: [],
      collections,
      relatedThings,
      machineAnnotations,
      humanAnnotations,
      disputes,
    }
  }

  query(options: GraphQueryOptions): GraphQueryResult {
    const nodes: GraphNode[] = []
    const visited = new Set<string>()

    const startId = options.startFrom
    if (startId) {
      this.traverse(startId, options, nodes, visited)
    }
    else {
      // Return all nodes
      for (const [id, entity] of this.entities) {
        if (!visited.has(id)) {
          visited.add(id)
          nodes.push({
            entity,
            inDegree: this.edges.filter((e) => e.target === id).length,
            outDegree: this.edges.filter((e) => e.source === id).length,
          })
        }
      }
    }

    const edges = options.predicates
      ? this.edges.filter((e) => options.predicates!.includes(e.predicate))
      : this.edges

    return { nodes, edges }
  }

  getCollectionMembers(collectionId: string): string[] {
    const members: string[] = []
    for (const [entityId, entity] of this.entities) {
      if (entity["@type"] === "oa:Annotation") {
        const ann = entity as Annotation
        const body = ann["oa:hasBody"] as Record<string, unknown>
        if (body?.["@type"] === "rcm:CollectionMembership" && body["rcm:collection"] === collectionId) {
          const target = this.extractTargetId(ann)
          if (target) members.push(target)
        }
      }
    }
    return members
  }

  // --- Private helpers ---

  private traverse(
    id: string,
    options: GraphQueryOptions,
    nodes: GraphNode[],
    visited: Set<string>,
    depth = 0,
  ): void {
    if (visited.has(id)) return
    if (options.depth !== undefined && depth > options.depth) return

    visited.add(id)
    const node = this.getNode(id)
    if (node && (!options.typeFilter || this.typeMatches(node.entity, options.typeFilter))) {
      nodes.push(node)
    }

    const relatedEdges = this.edges.filter((e) => e.source === id || e.target === id)
    for (const edge of relatedEdges) {
      const nextId = edge.source === id ? edge.target : edge.source
      this.traverse(nextId, options, nodes, visited, depth + 1)
    }
  }

  private typeMatches(entity: CoreEntity, types: string[]): boolean {
    return types.includes(entity["@type"] ?? "")
  }

  private extractTargetId(annotation: Annotation): string | undefined {
    const target = annotation["oa:hasTarget"]
    if (typeof target === "string") return target
    if (typeof target === "object" && target !== null) {
      return (target as unknown as Record<string, unknown>)["source"] as string | undefined
    }
    return
  }

  private trackEdgeFromAnnotation(annotation: Annotation, targetId: string): void {
    const body = annotation["oa:hasBody"] as Record<string, unknown>
    if (!body) return

    const bodyType = body["@type"] as string | undefined

    if (bodyType === "rcm:RelationshipAssertion" || bodyType === "rcm:PropertyAssertion") {
      const obj = body["rcm:object"] as string | undefined
      if (obj) {
        this.edges.push({
          source: targetId,
          target: obj,
          predicate: body["rcm:predicate"] as string,
          annotationId: annotation["@id"],
        })
      }
    }
  }
}

/**
 * Create a new graph engine instance.
 */
export function createGraphEngine(): GraphEngine {
  return new GraphEngineImpl()
}
