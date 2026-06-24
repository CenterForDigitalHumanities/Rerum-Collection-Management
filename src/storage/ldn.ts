/**
 * LDN (Linked Data Notifications) Announcement Module
 *
 * Helpers for creating and sending LDN announcements.
 * LDN is treated as a first-class export/publishing mode in RCM.
 */

import type { LdnAnnouncement } from "./types";

/**
 * Create a standard LDN announcement for publishing a collection.
 */
export function createCollectionAnnouncement(
  actor: string,
  collectionId: string,
  inboxUrl: string,
  summary?: string,
): LdnAnnouncement {
  return {
    "@type": "as:Announce",
    actor,
    object: collectionId,
    target: inboxUrl,
    summary: summary ?? `Published RCM collection: ${collectionId}`,
    published: new Date().toISOString(),
  };
}

/**
 * Create an LDN announcement for a new Thing.
 */
export function createThingAnnouncement(
  actor: string,
  thingId: string,
  inboxUrl: string,
  summary?: string,
): LdnAnnouncement {
  return {
    "@type": "as:Announce",
    actor,
    object: thingId,
    target: inboxUrl,
    summary: summary ?? `New RCM entity: ${thingId}`,
    published: new Date().toISOString(),
  };
}

/**
 * Create an LDN announcement for a new annotation.
 */
export function createAnnotationAnnouncement(
  actor: string,
  annotationId: string,
  inboxUrl: string,
  summary?: string,
): LdnAnnouncement {
  return {
    "@type": "as:Announce",
    actor,
    object: annotationId,
    target: inboxUrl,
    summary: summary ?? `New annotation: ${annotationId}`,
    published: new Date().toISOString(),
  };
}
