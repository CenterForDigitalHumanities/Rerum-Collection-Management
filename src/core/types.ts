/**
 * RCM Core Model Types
 *
 * These TypeScript interfaces describe the shape of RCM domain objects.
 * They are guardrails for development — the real data model is JSON-LD.
 * All objects must round-trip into JSON-LD without semantic loss.
 */

// --- Base ---

/** Minimal identity anchor. Every RCM object has at least an @id. */
export interface RcmObject {
  "@id": string;
  "@type"?: string;
}

/** Optional context pointer. */
export interface WithContext {
  "@context"?: string | Record<string, unknown> | (string | Record<string, unknown>)[];
}

/** Dublin Core provenance fields. */
export interface Provenance {
  "dcterms:creator"?: string;
  "dcterms:created"?: string; // ISO 8601
  "dcterms:modified"?: string; // ISO 8601
}

/** Label support. */
export interface Labeled {
  "rdfs:label"?: string | string[];
}

// --- Thing ---

/**
 * A Thing is the abstract anchor for what scholarship is about.
 * It may be real, conceptual, lost, inferred, disputed, or represented only indirectly.
 */
export interface Thing extends RcmObject, Labeled {
  "@type": "crm:E22_Human-Made_Object" | "schema:Person" | "schema:Place" | "schema:Event" | "schema:Thing" | string;
  "rcm:lifecycle"?: "encountered" | "anchored" | "described" | "related" | "reconciled" | "absorbed" | "invalidated";
}

// --- Representation ---

/**
 * A Representation is any externally or internally addressable digital form
 * that stands for, depicts, encodes, or otherwise represents a Thing.
 */
export interface Representation extends RcmObject, Labeled {
  "@type": "rcm:Representation";
  "rcm:represents": string; // @id of Thing
  "rcm:sourceUrl"?: string;
  "rcm:role"?: "iiif:Manifest" | "iiif:Canvas" | "schema:ImageObject" | "schema:VideoObject" | "schema:AudioObject" | string;
  "rcm:cached"?: boolean;
}

// --- Expression ---

/**
 * An Expression is an intellectual derivative or rendering of a Thing.
 * E.g., transcription, translation, edition, OCR text layer.
 */
export interface Expression extends RcmObject, Labeled, Provenance {
  "@type": "rcm:Expression";
  "rcm:expresses": string; // @id of Thing
  "rcm:mode"?: "transcription" | "translation" | "edition" | "commentary" | "ocr" | string;
}

// --- Annotation ---

/** Common fields for all annotation bodies. */
export interface AnnotationBase extends RcmObject {
  "@type": "oa:Annotation";
  "oa:motivatedBy": string;
  "oa:hasTarget": string | AnnotationTarget;
  "oa:hasBody": AnnotationBody;
}

/** Target can be a URI or a structured selector. */
export interface AnnotationTarget {
  source: string;
  selector?: AnnotationSelector;
}

/** Selector for precise targeting (region, time, text, etc.). */
export interface AnnotationSelector {
  "@type": "oa:CssSelector" | "oa:SvgSelector" | "oa:TextQuoteSelector" | "oa:TextPositionSelector" | "oa:FragmentSelector" | "oa:TimeSelector" | string;
  [key: string]: unknown;
}

/** Base annotation body. */
export interface AnnotationBody extends RcmObject {
  [key: string]: unknown;
}

// --- Specific Annotation Body Types ---

/** Profile A — Property Assertion */
export interface PropertyAssertion extends AnnotationBody {
  "@type": "rcm:PropertyAssertion";
  "rcm:predicate": string;
  "rcm:object": string;
}

/** Profile B — Relationship Assertion */
export interface RelationshipAssertion extends AnnotationBody {
  "@type": "rcm:RelationshipAssertion";
  "rcm:predicate": string;
  "rcm:object": string;
}

/** Profile C — Collection Membership */
export interface CollectionMembership extends AnnotationBody {
  "@type": "rcm:CollectionMembership";
  "rcm:collection": string;
}

/** Profile D — Representation Link */
export interface RepresentationLink extends AnnotationBody {
  "@type": "rcm:RepresentationLink";
  "rcm:representation": string;
  "rcm:role"?: string;
}

/** Profile E — Machine Annotation */
export interface MachineAnnotation extends AnnotationBody {
  "@type": "rcm:MachineAnnotation";
  "rcm:entity"?: string;
  "rcm:type"?: string;
  "rcm:confidence"?: number;
  "rcm:generator"?: string;
}

/** Profile F — Disputed Assertion */
export interface DisputedAssertion extends AnnotationBody {
  "@type": "rcm:DisputedAssertion";
  "rcm:predicate": string;
  "rcm:object": unknown;
  "rcm:disputes": string[];
  "rcm:reason"?: string;
}

// --- Full Annotation with Provenance ---

/**
 * A complete RCM annotation with provenance and evidence.
 */
export interface Annotation extends AnnotationBase, Provenance {
  "rcm:evidence"?: string[];
  "rcm:provenance"?: string; // "human" | "machine" | "imported"
}

// --- Collection ---

/**
 * A Collection is a Thing that other Things are asserted to belong to.
 * Membership is expressed through CollectionMembership annotations.
 */
export interface Collection extends Thing, Provenance {
  "@type": "schema:Thing" | "rcm:Collection";
}

// --- Agent ---

/**
 * An Agent is a person, organization, or software agent that creates annotations.
 */
export interface Agent extends RcmObject, Labeled {
  "@type": "schema:Person" | "schema:Organization" | "schema:SoftwareApplication";
  "foaf:mbox"?: string;
  "foaf:homepage"?: string;
}

// --- Evidence ---

/**
 * Evidence is a cited resource that supports an assertion.
 * Evidence is not a score — it is an inspectable reference.
 */
export interface Evidence extends RcmObject, Labeled {
  "@type": "rcm:Evidence";
  "rcm:supports": string; // @id of annotation
  "rcm:source": string;
  "rcm:selector"?: AnnotationSelector;
}

// --- Union Types ---

export type AnnotationBodyType =
  | PropertyAssertion
  | RelationshipAssertion
  | CollectionMembership
  | RepresentationLink
  | MachineAnnotation
  | DisputedAssertion;

export type CoreEntity = Thing | Representation | Expression | Annotation | Collection | Agent | Evidence;
