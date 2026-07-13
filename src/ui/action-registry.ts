/**
 * Action Registry
 *
 * Maps action strings from connector suggestions to handler functions.
 * Each handler receives the ResolutionResult and can perform the suggested action.
 */

import type { ResolutionResult } from "../connectors/types.js";

interface ActionHandler {
  /** Short label for the action */
  label: string;
  /** Icon or emoji for the action */
  icon?: string;
  /** Handler function that executes the action */
  handler: (result: ResolutionResult) => void | Promise<void>;
}

interface ActionRegistry {
  [action: string]: ActionHandler;
}

/**
 * Registry of available action handlers.
 * Connectors suggest action strings; this registry maps them to implementations.
 */
const actions: ActionRegistry = {};

/**
 * Register an action handler.
 * @param action - Action string (e.g., "create-iiif-manifest")
 * @param handler - Handler configuration
 */
export function registerAction(action: string, handler: ActionHandler): void {
  actions[action] = handler;
}

/**
 * Get an action handler by action string.
 * @param action - Action string
 * @returns Handler configuration or undefined
 */
export function getActionHandler(action: string): ActionHandler | undefined {
  return actions[action];
}

/**
 * Execute an action by action string.
 * @param action - Action string
 * @param result - ResolutionResult from the connector
 */
export async function executeAction(action: string, result: ResolutionResult): Promise<void> {
  const handler = actions[action];
  if (!handler) {
    console.warn(`No handler registered for action: ${action}`);
    return;
  }
  return handler.handler(result);
}

/**
 * Get all registered action names.
 * @returns Array of action strings
 */
export function getRegisteredActions(): string[] {
  return Object.keys(actions);
}

/**
 * Check if an action handler is registered.
 * @param action - Action string
 * @returns True if handler is registered
 */
export function hasActionHandler(action: string): boolean {
  return action in actions;
}

// ─── Built-in Action Handlers ───

/**
 * Create IIIF Manifest from image URL.
 * Opens a dialog or navigates to a tool that generates a IIIF Manifest.
 */
registerAction("create-iiif-manifest", {
  label: "Create IIIF Manifest",
  icon: "🖼️",
  handler: (result) => {
    const imageUrl = result.sourceUrl;
    if (!imageUrl) {
      console.warn("No source URL available for IIIF Manifest creation");
      return;
    }

    // Dispatch event for UI to handle (e.g., open IIIF Manifest creator)
    const event = new CustomEvent("action:create-iiif-manifest", {
      detail: { imageUrl, result },
    });
    window.dispatchEvent(event);

    // Fallback: open IIIF Manifest creator tool if available
    const iiifCreatorUrl = `https://iiif.io/api/presentation/3.0/#21-manifest`;
    window.open(iiifCreatorUrl, "_blank");
  },
});

/**
 * Annotate text regions in HTML content.
 * Opens annotation composer with text region support.
 */
registerAction("annotate-text", {
  label: "Annotate Text",
  icon: "📝",
  handler: (result) => {
    const event = new CustomEvent("action:annotate-text", {
      detail: { result },
    });
    window.dispatchEvent(event);
  },
});

/**
 * Annotate PDF pages.
 * Opens PDF annotation tool with page-level selectors.
 */
registerAction("annotate-page", {
  label: "Annotate PDF Pages",
  icon: "📄",
  handler: (result) => {
    const event = new CustomEvent("action:annotate-page", {
      detail: { result },
    });
    window.dispatchEvent(event);
  },
});

/**
 * Annotate time ranges in video/audio content.
 * Opens time-based annotation tool.
 */
registerAction("annotate-time", {
  label: "Annotate Time Ranges",
  icon: "⏱️",
  handler: (result) => {
    const event = new CustomEvent("action:annotate-time", {
      detail: { result },
    });
    window.dispatchEvent(event);
  },
});

/**
 * View IIIF content in IIIF viewer.
 * Opens IIIF viewer with the manifest URL.
 */
registerAction("view-iiif", {
  label: "View in IIIF Viewer",
  icon: "👁️",
  handler: (result) => {
    const manifestUrl = result.sourceUrl;
    if (!manifestUrl) {
      console.warn("No source URL available for IIIF viewing");
      return;
    }

    // Open in IIIF viewer
    const viewerUrl = `https://projectmirador.org/embed/?iiif-content=${encodeURIComponent(manifestUrl)}`;
    window.open(viewerUrl, "_blank");
  },
});

/**
 * View PDF content in PDF viewer.
 * Opens PDF viewer with the PDF URL.
 */
registerAction("view-pdf", {
  label: "View PDF",
  icon: "👁️",
  handler: (result) => {
    const pdfUrl = result.sourceUrl;
    if (!pdfUrl) {
      console.warn("No source URL available for PDF viewing");
      return;
    }

    window.open(pdfUrl, "_blank");
  },
});

/**
 * View JSON-LD content.
 * Opens JSON-LD viewer or formatter.
 */
registerAction("view-jsonld", {
  label: "View JSON-LD",
  icon: "👁️",
  handler: (result) => {
    const jsonldUrl = result.sourceUrl;
    if (!jsonldUrl) {
      console.warn("No source URL available for JSON-LD viewing");
      return;
    }

    // Open in JSON-LD playground or similar
    const viewerUrl = `https://json-ld.org/playground/#io=url&data=${encodeURIComponent(jsonldUrl)}`;
    window.open(viewerUrl, "_blank");
  },
});

/**
 * Link existing Thing.
 * Opens dialog to link this URL to an existing Thing in the collection.
 */
registerAction("link-existing-thing", {
  label: "Link to Existing Thing",
  icon: "🔗",
  handler: (result) => {
    const event = new CustomEvent("action:link-existing-thing", {
      detail: { result },
    });
    window.dispatchEvent(event);
  },
});
