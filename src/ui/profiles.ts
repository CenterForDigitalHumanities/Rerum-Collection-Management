/**
 * Project Profile Types
 *
 * Configuration-driven interfaces for "maximum minimum" projects.
 * Each project defines fields, validation, layouts, service endpoints,
 * help text, vocabulary guidance, and input templates through configuration.
 */

/**
 * A project profile defines a scoped interface over the generic RCM core.
 */
export interface ProjectProfile {
  /** Profile identifier. */
  id: string;
  /** Human-readable label. */
  label: string;
  /** Description of the project. */
  description?: string;
  /** JSON-LD context to use. */
  "@context"?: string | Record<string, unknown>;

  /** Field definitions for the project's data entry interface. */
  fields: ProfileField[];

  /** Service endpoints for read/write. */
  service?: ServiceConfig;

  /** Available templates for rendering. */
  templates?: string[];

  /** Validation rules. */
  validation?: ValidationRules;

  /** Help text and vocabulary guidance. */
  help?: Record<string, string>;
}

/**
 * A field in a project profile.
 */
export interface ProfileField {
  /** JSON-LD key (e.g., "rdfs:label", "rdf:type"). */
  key: string;
  /** Display label. */
  label: string;
  /** Whether this field is required. */
  required?: boolean;
  /** Input type. */
  input: "text" | "textarea" | "controlled-term" | "uri" | "date" | "number" | "boolean" | "json";
  /** Controlled term options (for "controlled-term" input). */
  options?: string[];
  /** Help text shown to the user. */
  help?: string;
  /** Placeholder text. */
  placeholder?: string;
  /** Default value. */
  default?: unknown;
}

/**
 * Service configuration for a project.
 */
export interface ServiceConfig {
  /** Read endpoint (RERUM URI prefix). */
  read: string;
  /** Write endpoint (proxy or direct). */
  write: string;
  /** API key (may be injected at runtime). */
  apiKey?: string;
}

/**
 * Validation rules for a project profile.
 */
export interface ValidationRules {
  /** Minimum number of annotations before publishing. */
  minAnnotations?: number;
  /** Required predicates for Things. */
  requiredPredicates?: string[];
  /** Allowed entity types. */
  allowedTypes?: string[];
  /** Custom validation function name. */
  customValidator?: string;
}
