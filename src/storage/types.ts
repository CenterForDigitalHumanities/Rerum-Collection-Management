/**
 * RERUM Client Types
 *
 * Types and interfaces for the RERUM persistence layer.
 */

import type { RcmObject, Annotation } from "../core/types";

/** Configuration for the RERUM client. */
export interface RerumConfig {
  /** Base URL of the RERUM instance. */
  baseUrl: string;
  /** API key or token for authentication. */
  apiKey?: string;
  /** Project/workspace identifier within RERUM. */
  projectId?: string;
  /** Whether this is a sandbox environment. */
  sandbox?: boolean;
  /** Request timeout in milliseconds. */
  timeout?: number;
}

/** Result of a create operation. */
export interface CreateResult {
  /** The @id assigned by RERUM. */
  id: string;
  /** Full URL of the created object. */
  url: string;
  /** HTTP status code. */
  status: number;
}

/** Result of an update operation. */
export interface UpdateResult {
  /** The @id of the updated object. */
  id: string;
  /** Version number after update. */
  version: number;
  /** HTTP status code. */
  status: number;
}

/** Query result page. */
export interface QueryResult<T extends RcmObject = RcmObject> {
  /** Matching objects. */
  items: T[];
  /** Total count of matching objects. */
  total: number;
  /** Current page offset. */
  offset: number;
  /** Page size. */
  limit: number;
}

/** Query options for annotation queries. */
export interface AnnotationQueryOptions {
  /** Filter by target @id. */
  targetId?: string;
  /** Filter by creator @id. */
  creatorId?: string;
  /** Filter by motivation. */
  motivation?: string;
  /** Filter by provenance (human, machine, imported). */
  provenance?: "human" | "machine" | "imported";
  /** Page offset. */
  offset?: number;
  /** Page size. */
  limit?: number;
}

/** LDN announcement payload. */
export interface LdnAnnouncement {
  /** ActivityStreams type. */
  "@type": "as:Announce";
  /** Actor publishing the announcement. */
  actor: string;
  /** Object being announced (collection, thing, etc.). */
  object: string;
  /** Target LDN inbox URL. */
  target: string;
  /** Human-readable summary. */
  summary?: string;
  /** Published timestamp. */
  published?: string;
}

/** Result of an LDN announcement. */
export interface LdnResult {
  /** Whether the announcement was sent successfully. */
  success: boolean;
  /** HTTP status code. */
  status?: number;
  /** Error message if failed. */
  error?: string;
}

/**
 * The RERUM client interface.
 *
 * Core methods for persistence and querying.
 */
export interface RerumClient {
  /** Create a new JSON-LD object in RERUM. */
  createObject(jsonld: RcmObject): Promise<CreateResult>;

  /** Update an existing object by @id. */
  updateObject(id: string, jsonld: RcmObject): Promise<UpdateResult>;

  /** Retrieve an object by @id. */
  getObject<T extends RcmObject = RcmObject>(id: string): Promise<T | null>;

  /** Query annotations by target. */
  queryAnnotationsByTarget(targetId: string, options?: AnnotationQueryOptions): Promise<QueryResult<Annotation>>;

  /** Query annotations by creator. */
  queryAnnotationsByCreator(agentId: string, options?: AnnotationQueryOptions): Promise<QueryResult<Annotation>>;

  /** Query collection membership. */
  queryCollectionMembership(collectionId: string, options?: AnnotationQueryOptions): Promise<QueryResult<RcmObject>>;

  /** Send an LDN announcement to an inbox. */
  announceToInbox(announcement: LdnAnnouncement, inboxUrl: string): Promise<LdnResult>;

  /** Get version history for an object. */
  getVersionHistory(id: string): Promise<RcmObject[]>;
}
