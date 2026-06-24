/**
 * RERUM Client Implementation
 *
 * Client for interacting with a RERUM instance.
 * Keeps RERUM metadata separate from scholarly assertions.
 * Preserves version history. Allows minimal identity.
 */

import type {
  RerumConfig,
  RerumClient,
  CreateResult,
  UpdateResult,
  QueryResult,
  AnnotationQueryOptions,
  LdnAnnouncement,
  LdnResult,
} from "./types";
import type { RcmObject, Annotation } from "../core/types";

/**
 * RERUM client implementation.
 *
 * Note: This is a skeleton. Actual HTTP calls will be implemented
 * once the RERUM API contract is finalized.
 */
export class RerumClientImpl implements RerumClient {
  private config: RerumConfig;

  constructor(config: RerumConfig) {
    this.config = config;
  }

  /**
   * Create a new JSON-LD object in RERUM.
   */
  async createObject(jsonld: RcmObject): Promise<CreateResult> {
    const url = `${this.config.baseUrl}/objects`;
    const response = await fetch(url, {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify(jsonld),
    });

    if (!response.ok) {
      throw new Error(`RERUM create failed: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    return {
      id: result["@id"] ?? jsonld["@id"],
      url: `${this.config.baseUrl}/objects/${result["@id"] ?? jsonld["@id"]}`,
      status: response.status,
    };
  }

  /**
   * Update an existing object by @id.
   */
  async updateObject(id: string, jsonld: RcmObject): Promise<UpdateResult> {
    const url = `${this.config.baseUrl}/objects/${encodeURIComponent(id)}`;
    const response = await fetch(url, {
      method: "PUT",
      headers: this.headers(),
      body: JSON.stringify(jsonld),
    });

    if (!response.ok) {
      throw new Error(`RERUM update failed: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    return {
      id,
      version: result["@version"] ?? 1,
      status: response.status,
    };
  }

  /**
   * Retrieve an object by @id.
   */
  async getObject<T extends RcmObject = RcmObject>(id: string): Promise<T | null> {
    const url = `${this.config.baseUrl}/objects/${encodeURIComponent(id)}`;
    const response = await fetch(url, {
      headers: this.headers(),
    });

    if (response.status === 404) return null;
    if (!response.ok) {
      throw new Error(`RERUM get failed: ${response.status} ${response.statusText}`);
    }

    return response.json() as Promise<T>;
  }

  /**
   * Query annotations by target.
   */
  async queryAnnotationsByTarget(targetId: string, options?: AnnotationQueryOptions): Promise<QueryResult<Annotation>> {
    const params = new URLSearchParams({
      type: "oa:Annotation",
      target: targetId,
      offset: String(options?.offset ?? 0),
      limit: String(options?.limit ?? 50),
    });

    if (options?.motivation) params.set("motivation", options.motivation);
    if (options?.provenance) params.set("provenance", options.provenance);

    const url = `${this.config.baseUrl}/query?${params}`;
    const response = await fetch(url, {
      headers: this.headers(),
    });

    if (!response.ok) {
      throw new Error(`RERUM query failed: ${response.status} ${response.statusText}`);
    }

    return response.json() as Promise<QueryResult<Annotation>>;
  }

  /**
   * Query annotations by creator.
   */
  async queryAnnotationsByCreator(agentId: string, options?: AnnotationQueryOptions): Promise<QueryResult<Annotation>> {
    const params = new URLSearchParams({
      type: "oa:Annotation",
      creator: agentId,
      offset: String(options?.offset ?? 0),
      limit: String(options?.limit ?? 50),
    });

    if (options?.motivation) params.set("motivation", options.motivation);
    if (options?.provenance) params.set("provenance", options.provenance);

    const url = `${this.config.baseUrl}/query?${params}`;
    const response = await fetch(url, {
      headers: this.headers(),
    });

    if (!response.ok) {
      throw new Error(`RERUM query failed: ${response.status} ${response.statusText}`);
    }

    return response.json() as Promise<QueryResult<Annotation>>;
  }

  /**
   * Query collection membership.
   * Returns Things that have CollectionMembership annotations pointing to the given collection.
   */
  async queryCollectionMembership(collectionId: string, options?: AnnotationQueryOptions): Promise<QueryResult<RcmObject>> {
    const params = new URLSearchParams({
      type: "rcm:CollectionMembership",
      collection: collectionId,
      offset: String(options?.offset ?? 0),
      limit: String(options?.limit ?? 50),
    });

    const url = `${this.config.baseUrl}/query?${params}`;
    const response = await fetch(url, {
      headers: this.headers(),
    });

    if (!response.ok) {
      throw new Error(`RERUM collection query failed: ${response.status} ${response.statusText}`);
    }

    return response.json() as Promise<QueryResult<RcmObject>>;
  }

  /**
   * Send an LDN announcement to an inbox.
   */
  async announceToInbox(announcement: LdnAnnouncement, inboxUrl: string): Promise<LdnResult> {
    try {
      const response = await fetch(inboxUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/ld+json",
          ...this.authHeaders(),
        },
        body: JSON.stringify(announcement),
      });

      return {
        success: response.ok,
        status: response.status,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error during LDN announcement",
      };
    }
  }

  /**
   * Get version history for an object.
   */
  async getVersionHistory(id: string): Promise<RcmObject[]> {
    const url = `${this.config.baseUrl}/objects/${encodeURIComponent(id)}/versions`;
    const response = await fetch(url, {
      headers: this.headers(),
    });

    if (!response.ok) {
      throw new Error(`RERUM version history failed: ${response.status} ${response.statusText}`);
    }

    return response.json() as Promise<RcmObject[]>;
  }

  // --- Private helpers ---

  private headers(): Record<string, string> {
    return {
      "Content-Type": "application/ld+json",
      Accept: "application/ld+json",
      ...this.authHeaders(),
    };
  }

  private authHeaders(): Record<string, string> {
    if (!this.config.apiKey) return {};
    return { Authorization: `Bearer ${this.config.apiKey}` };
  }
}

/**
 * Factory function to create a configured RERUM client.
 */
export function createRerumClient(config: RerumConfig): RerumClient {
  return new RerumClientImpl(config);
}
