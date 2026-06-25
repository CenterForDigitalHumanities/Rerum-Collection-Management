/**
 * Project Profile Registry
 *
 * Loads and manages project profiles.
 */

import type { ProjectProfile } from "./profiles.js";

export class ProfileRegistry {
  private profiles: Map<string, ProjectProfile> = new Map()

  register(profile: ProjectProfile): void {
    this.profiles.set(profile.id, profile)
  }

  get(id: string): ProjectProfile | undefined {
    return this.profiles.get(id)
  }

  all(): ProjectProfile[] {
    return Array.from(this.profiles.values())
  }

  /**
   * Load a profile from a JSON object.
   */
  load(profile: Record<string, unknown>): ProjectProfile {
    const p: ProjectProfile = {
      id: String(profile["id"]),
      label: String(profile["label"]),
      description: String(profile["description"] ?? ""),
      "@context": profile["@context"] as string | Record<string, unknown> | undefined,
      fields: (profile["fields"] as Record<string, unknown>[])?.map((f) => ({
        key: String(f["key"]),
        label: String(f["label"]),
        required: Boolean(f["required"]),
        input: (f["input"] as ProfileField["input"]) ?? "text",
        options: (f["options"] as string[]) ?? undefined,
        help: String(f["help"] ?? ""),
        placeholder: String(f["placeholder"] ?? ""),
        default: f["default"],
      })) ?? [],
      service: profile["service"] as ServiceConfig | undefined,
      templates: (profile["templates"] as string[]) ?? undefined,
      validation: profile["validation"] as ValidationRules | undefined,
      help: profile["help"] as Record<string, string> | undefined,
    }

    this.register(p)
    return p
  }
}

import type { ProfileField, ServiceConfig, ValidationRules } from "./profiles.js";

/**
 * Default singleton registry.
 */
export const profileRegistry = new ProfileRegistry();
