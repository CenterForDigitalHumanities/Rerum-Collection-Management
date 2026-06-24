/**
 * RCM Core — Serialization
 *
 * Utilities for round-tripping RCM objects to and from JSON-LD.
 * The canonical format is JSON-LD; these helpers ensure consistency.
 */

import type { CoreEntity, RcmObject, WithContext } from "./types";

// Path to the RCM JSON-LD context
const RCM_CONTEXT = "./schemas/rcm-context.jsonld";

/**
 * Attach the RCM JSON-LD context to an object.
 * If the object already has a @context, it is preserved.
 */
export function withContext(obj: RcmObject, context: string | Record<string, unknown> = RCM_CONTEXT): RcmObject & WithContext {
  const result = { ...obj };
  if (!result["@context"]) {
    result["@context"] = context;
  }
  return result;
}

/**
 * Serialize an RCM object to a JSON-LD string.
 */
export function toJsonLd(obj: RcmObject, context: string | Record<string, unknown> = RCM_CONTEXT): string {
  return JSON.stringify(withContext(obj, context), null, 2);
}

/**
 * Parse a JSON-LD string into an RCM object.
 */
export function fromJsonLd<T extends RcmObject = RcmObject>(jsonLd: string): T {
  return JSON.parse(jsonLd) as T;
}

/**
 * Validate that an object has the minimum required fields for an RCM entity.
 * Returns an array of validation errors (empty = valid).
 */
export function validateRcmObject(obj: unknown): string[] {
  const errors: string[] = [];

  if (!obj || typeof obj !== "object") {
    return ["Object must be a non-null object."];
  }

  const o = obj as Record<string, unknown>;

  if (!o["@id"] || typeof o["@id"] !== "string") {
    errors.push('Missing or invalid "@id". Every RCM object requires a string "@id".');
  }

  return errors;
}

/**
 * Validate that an object looks like an annotation.
 */
export function validateAnnotation(obj: unknown): string[] {
  const errors = validateRcmObject(obj);

  if (errors.length > 0) return errors;

  const o = obj as Record<string, unknown>;

  if (o["@type"] !== "oa:Annotation") {
    errors.push('Annotation must have "@type": "oa:Annotation".');
  }

  if (!o["oa:motivatedBy"]) {
    errors.push('Annotation must have "oa:motivatedBy".');
  }

  if (!o["oa:hasTarget"]) {
    errors.push('Annotation must have "oa:hasTarget".');
  }

  if (!o["oa:hasBody"]) {
    errors.push('Annotation must have "oa:hasBody".');
  }

  return errors;
}

/**
 * Validate that an object looks like a Thing.
 */
export function validateThing(obj: unknown): string[] {
  const errors = validateRcmObject(obj);

  if (errors.length > 0) return errors;

  const o = obj as Record<string, unknown>;

  if (!o["@type"]) {
    errors.push('Thing should have an "@type" (e.g., a CIDOC CRM or schema.org type).');
  }

  return errors;
}

/**
 * Validate that an object looks like a Representation.
 */
export function validateRepresentation(obj: unknown): string[] {
  const errors = validateRcmObject(obj);

  if (errors.length > 0) return errors;

  const o = obj as Record<string, unknown>;

  if (o["@type"] !== "rcm:Representation") {
    errors.push('Representation must have "@type": "rcm:Representation".');
  }

  if (!o["rcm:represents"] || typeof o["rcm:represents"] !== "string") {
    errors.push('Representation must have "rcm:represents" pointing to a Thing @id.');
  }

  return errors;
}

/**
 * Validate that an object looks like an Expression.
 */
export function validateExpression(obj: unknown): string[] {
  const errors = validateRcmObject(obj);

  if (errors.length > 0) return errors;

  const o = obj as Record<string, unknown>;

  if (o["@type"] !== "rcm:Expression") {
    errors.push('Expression must have "@type": "rcm:Expression".');
  }

  if (!o["rcm:expresses"] || typeof o["rcm:expresses"] !== "string") {
    errors.push('Expression must have "rcm:expresses" pointing to a Thing @id.');
  }

  return errors;
}

/**
 * Round-trip test: serialize to JSON-LD and parse back, then compare.
 * Returns true if the round-trip preserves the object structure.
 */
export function roundTripTest(obj: RcmObject): boolean {
  const serialized = toJsonLd(obj);
  const parsed = fromJsonLd<RcmObject>(serialized);

  // Remove @context for comparison since it may be normalized differently
  const { "@context": _, ...original } = obj as Record<string, unknown>;
  const { "@context": __, ...restored } = parsed as Record<string, unknown>;

  return JSON.stringify(original) === JSON.stringify(restored);
}
