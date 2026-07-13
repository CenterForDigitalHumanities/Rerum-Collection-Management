/**
 * Viewer Registry
 *
 * Maps tool strings from connector suggestions to viewer components.
 * Each viewer can be opened to display the resolved content.
 */

import type { ResolutionResult } from "../connectors/types.js";

interface ViewerConfig {
  /** Human-readable label for the viewer */
  label: string;
  /** Icon or emoji for the viewer */
  icon?: string;
  /** Component name or URL for the viewer */
  component?: string;
  /** Handler function that opens the viewer */
  open: (result: ResolutionResult) => void;
}

interface ViewerRegistry {
  [tool: string]: ViewerConfig;
}

/**
 * Registry of available viewers.
 * Connectors suggest tool strings; this registry maps them to viewer implementations.
 */
const viewers: ViewerRegistry = {};

/**
 * Register a viewer.
 * @param tool - Tool string (e.g., "iiif-viewer")
 * @param config - Viewer configuration
 */
export function registerViewer(tool: string, config: ViewerConfig): void {
  viewers[tool] = config;
}

/**
 * Get a viewer configuration by tool string.
 * @param tool - Tool string
 * @returns Viewer configuration or undefined
 */
export function getViewer(tool: string): ViewerConfig | undefined {
  return viewers[tool];
}

/**
 * Open a viewer by tool string.
 * @param tool - Tool string
 * @param result - ResolutionResult from the connector
 */
export function openViewer(tool: string, result: ResolutionResult): void {
  const viewer = viewers[tool];
  if (!viewer) {
    console.warn(`No viewer registered for tool: ${tool}`);
    return;
  }
  viewer.open(result);
}

/**
 * Get all registered viewer names.
 * @returns Array of tool strings
 */
export function getRegisteredViewers(): string[] {
  return Object.keys(viewers);
}

/**
 * Check if a viewer is registered.
 * @param tool - Tool string
 * @returns True if viewer is registered
 */
export function hasViewer(tool: string): boolean {
  return tool in viewers;
}

// ─── Built-in Viewers ───

/**
 * IIIF Viewer - opens IIIF manifest in Mirador or similar viewer
 */
registerViewer("iiif-viewer", {
  label: "IIIF Viewer",
  icon: "🖼️",
  open: (result) => {
    const manifestUrl = result.sourceUrl;
    if (!manifestUrl) {
      console.warn("No source URL available for IIIF viewing");
      return;
    }

    // Open in Mirador viewer
    const viewerUrl = `https://projectmirador.org/embed/?iiif-content=${encodeURIComponent(manifestUrl)}`;
    window.open(viewerUrl, "_blank");
  },
});

/**
 * PDF Viewer - opens PDF in browser or embedded viewer
 */
registerViewer("pdf-viewer", {
  label: "PDF Viewer",
  icon: "📄",
  open: (result) => {
    const pdfUrl = result.sourceUrl;
    if (!pdfUrl) {
      console.warn("No source URL available for PDF viewing");
      return;
    }

    window.open(pdfUrl, "_blank");
  },
});

/**
 * Video Viewer - opens video in browser or embedded player
 */
registerViewer("video-viewer", {
  label: "Video Viewer",
  icon: "🎬",
  open: (result) => {
    const videoUrl = result.sourceUrl;
    if (!videoUrl) {
      console.warn("No source URL available for video viewing");
      return;
    }

    // Open in video player
    const viewerUrl = `https://projectmirador.org/embed/?iiif-content=${encodeURIComponent(videoUrl)}`;
    window.open(viewerUrl, "_blank");
  },
});

/**
 * Audio Viewer - opens audio in browser or embedded player
 */
registerViewer("audio-viewer", {
  label: "Audio Viewer",
  icon: "🎵",
  open: (result) => {
    const audioUrl = result.sourceUrl;
    if (!audioUrl) {
      console.warn("No source URL available for audio viewing");
      return;
    }

    window.open(audioUrl, "_blank");
  },
});

/**
 * Annotation Composer - opens annotation tool for creating new annotations
 */
registerViewer("annotation-composer", {
  label: "Annotation Composer",
  icon: "📝",
  open: (result) => {
    // Dispatch event for UI to open annotation composer modal
    const event = new CustomEvent("viewer:annotation-composer", {
      detail: { result },
    });
    window.dispatchEvent(event);
  },
});

/**
 * JSON-LD Viewer - opens JSON-LD document in viewer or formatter
 */
registerViewer("jsonld-viewer", {
  label: "JSON-LD Viewer",
  icon: "📋",
  open: (result) => {
    const jsonldUrl = result.sourceUrl;
    if (!jsonldUrl) {
      console.warn("No source URL available for JSON-LD viewing");
      return;
    }

    // Open in JSON-LD playground
    const viewerUrl = `https://json-ld.org/playground/#io=url&data=${encodeURIComponent(jsonldUrl)}`;
    window.open(viewerUrl, "_blank");
  },
});

/**
 * HTML Viewer - opens HTML page in browser
 */
registerViewer("html-viewer", {
  label: "HTML Viewer",
  icon: "🌐",
  open: (result) => {
    const htmlUrl = result.sourceUrl;
    if (!htmlUrl) {
      console.warn("No source URL available for HTML viewing");
      return;
    }

    window.open(htmlUrl, "_blank");
  },
});
