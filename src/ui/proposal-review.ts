/**
 * Proposal Review Component
 *
 * Displays connector resolution results for user review before adding to collection.
 * Shows extracted metadata, suggested tools, suggested actions, warnings, and quality rating.
 */

import type { ResolutionResult } from "../connectors/types.js";
import { executeAction } from "./action-registry.js";
import { openViewer } from "./viewer-registry.js";

interface ProposalReviewOptions {
  /** Connector resolution result to review */
  result: ResolutionResult;
  /** Called when user confirms the proposal */
  onConfirm?: (result: ResolutionResult) => void;
  /** Called when user cancels the proposal */
  onCancel?: () => void;
}

export class ProposalReview extends HTMLElement {
  private result: ResolutionResult;
  private onConfirm?: (result: ResolutionResult) => void;
  private onCancel?: () => void;

  constructor() {
    super();
    this.result = {} as ResolutionResult;
  }

  static get observedAttributes() {
    return ["connector-id", "source-url"];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name: string, _oldValue: string | null, newValue: string | null) {
    if (name === "connector-id" || name === "source-url") {
      // Could trigger re-resolution if needed
    }
  }

  /**
   * Set the proposal review options
   */
  setOptions(options: ProposalReviewOptions) {
    // Validate that result has at least some content
    if (!options.result || (!options.result.sourceUrl && !options.result.suggestedType)) {
      console.warn("ProposalReview received an empty or invalid result object");
    }
    
    this.result = options.result;
    this.onConfirm = options.onConfirm;
    this.onCancel = options.onCancel;
    this.render();
  }

  /**
   * Render the proposal review UI
   */
  private render() {
    const qualityColor = this.getQualityColor(this.result.quality);
    const qualityIcon = this.getQualityIcon(this.result.quality);

    this.innerHTML = `
      <style>
        .proposal-review {
          font-family: system-ui, -apple-system, sans-serif;
          max-width: 800px;
          margin: 0 auto;
          padding: 1.5rem;
        }

        .proposal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #e5e5e5;
        }

        .proposal-header h2 {
          font-size: 1.25rem;
          margin: 0;
        }

        .quality-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.4rem 0.8rem;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .quality-high { background: #dcfce7; color: #166534; }
        .quality-medium { background: #fef3c7; color: #92400e; }
        .quality-low { background: #fee2e2; color: #991b1b; }

        .section {
          margin-bottom: 1.5rem;
        }

        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.75rem;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 6px;
          transition: background 0.15s;
        }

        .section-header:hover {
          background: #f5f5f5;
        }

        .section-header h3 {
          font-size: 1rem;
          margin: 0;
          font-weight: 600;
        }

        .section-header .count {
          font-size: 0.85rem;
          color: #888;
          font-weight: 400;
        }

        .section-content {
          padding: 0.5rem;
        }

        .section-content.collapsed {
          display: none;
        }

        .metadata-item {
          display: flex;
          padding: 0.5rem 0;
          border-bottom: 1px solid #f0f0f0;
        }

        .metadata-item:last-child {
          border-bottom: none;
        }

        .metadata-label {
          font-weight: 600;
          min-width: 120px;
          color: #3b82f6;
        }

        .metadata-value {
          color: #1a1a1a;
          word-break: break-word;
        }

        .representation-card {
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 6px;
          padding: 1rem;
          margin-bottom: 0.5rem;
        }

        .representation-card h4 {
          font-size: 0.95rem;
          margin: 0 0 0.5rem 0;
        }

        .representation-card .role {
          font-size: 0.8rem;
          color: #888;
          margin-bottom: 0.5rem;
        }

        .representation-card .url {
          font-size: 0.8rem;
          color: #3b82f6;
          word-break: break-all;
        }

        .annotation-card {
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 6px;
          padding: 1rem;
          margin-bottom: 0.5rem;
        }

        .annotation-card .predicate {
          font-weight: 600;
          color: #3b82f6;
          font-size: 0.9rem;
        }

        .annotation-card .object {
          color: #1a1a1a;
          font-size: 0.9rem;
          margin-top: 0.25rem;
        }

        .annotation-card .meta {
          font-size: 0.8rem;
          color: #888;
          margin-top: 0.5rem;
        }

        .tools-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 0.5rem;
        }

        .tool-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.75rem;
          background: #f0f7ff;
          border: 1px solid #bfdbfe;
          border-radius: 6px;
          font-size: 0.85rem;
          color: #1e40af;
          cursor: pointer;
          transition: background 0.15s;
        }

        .tool-item:hover {
          background: #dbeafe;
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 0.5rem;
        }

        .action-item {
          padding: 0.5rem 0.75rem;
          background: #f0f7ff;
          border: 1px solid #bfdbfe;
          border-radius: 6px;
          font-size: 0.85rem;
          color: #1e40af;
          cursor: pointer;
          text-align: center;
          transition: background 0.15s;
        }

        .action-item:hover {
          background: #dbeafe;
        }

        .warnings-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .warning-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.75rem;
          background: #fef3c7;
          border: 1px solid #fcd34d;
          border-radius: 6px;
          margin-bottom: 0.5rem;
          font-size: 0.85rem;
          color: #92400e;
        }

        .warning-icon {
          font-size: 1rem;
        }

        .proposal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
          margin-top: 1.5rem;
          padding-top: 1rem;
          border-top: 2px solid #e5e5e5;
        }

        .btn {
          padding: 0.5rem 1rem;
          font-size: 0.9rem;
          font-weight: 600;
          border: 1px solid #d0d0d0;
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.15s, border-color 0.15s;
        }

        .btn-cancel {
          background: #fff;
          color: #666;
        }

        .btn-cancel:hover {
          background: #f5f5f5;
        }

        .btn-confirm {
          background: #3b82f6;
          color: #fff;
          border-color: #3b82f6;
        }

        .btn-confirm:hover {
          background: #2563eb;
        }

        .connector-badge {
          display: inline-block;
          padding: 0.2rem 0.5rem;
          background: #f3f4f6;
          border-radius: 4px;
          font-size: 0.75rem;
          color: #666;
          margin-left: 0.5rem;
        }
      </style>

      <div class="proposal-review">
        <div class="proposal-header">
          <h2>
            Proposal Review
            <span class="connector-badge">${this.result.connector || "unknown"}</span>
          </h2>
          <div class="quality-badge quality-${this.result.quality || "low"}">
            <span class="quality-icon">${qualityIcon}</span>
            <span>${this.result.quality || "low"}</span>
          </div>
        </div>

        <div class="section">
          <div class="section-header" onclick="this.nextElementSibling?.classList.toggle('collapsed')">
            <h3>📋 Metadata</h3>
            <span class="count">${this.countMetadata()} properties</span>
          </div>
          <div class="section-content">
            ${this.renderMetadata()}
          </div>
        </div>

        <div class="section">
          <div class="section-header" onclick="this.nextElementSibling?.classList.toggle('collapsed')">
            <h3>🎭 Representations</h3>
            <span class="count">${this.result.representations?.length || 0} items</span>
          </div>
          <div class="section-content">
            ${this.renderRepresentations()}
          </div>
        </div>

        <div class="section">
          <div class="section-header" onclick="this.nextElementSibling?.classList.toggle('collapsed')">
            <h3>📝 Annotations</h3>
            <span class="count">${this.result.annotations?.length || 0} items</span>
          </div>
          <div class="section-content">
            ${this.renderAnnotations()}
          </div>
        </div>

        ${this.result.suggestedTools && this.result.suggestedTools.length > 0 ? `
        <div class="section">
          <div class="section-header" onclick="this.nextElementSibling?.classList.toggle('collapsed')">
            <h3>🛠️ Suggested Tools</h3>
            <span class="count">${this.result.suggestedTools.length} tools</span>
          </div>
          <div class="section-content">
            <div class="tools-grid">
              ${this.result.suggestedTools.map(tool => `
                <div class="tool-item" onclick="this.dispatchEvent(new CustomEvent('tool-clicked', {detail: '${tool}'}))">
                  <span>🔧</span>
                  <span>${tool}</span>
                </div>
              `).join("")}
            </div>
          </div>
        </div>
        ` : ""}

        ${this.result.suggestedActions && this.result.suggestedActions.length > 0 ? `
        <div class="section">
          <div class="section-header" onclick="this.nextElementSibling?.classList.toggle('collapsed')">
            <h3>⚡ Suggested Actions</h3>
            <span class="count">${this.result.suggestedActions.length} actions</span>
          </div>
          <div class="section-content">
            <div class="actions-grid">
              ${this.result.suggestedActions.map(action => `
                <div class="action-item" onclick="this.dispatchEvent(new CustomEvent('action-clicked', {detail: '${action}'}))">
                  ${action}
                </div>
              `).join("")}
            </div>
          </div>
        </div>
        ` : ""}

        ${this.result.warnings && this.result.warnings.length > 0 ? `
        <div class="section">
          <div class="section-header" onclick="this.nextElementSibling?.classList.toggle('collapsed')">
            <h3>⚠️ Warnings</h3>
            <span class="count">${this.result.warnings.length} warnings</span>
          </div>
          <div class="section-content">
            <ul class="warnings-list">
              ${this.result.warnings.map(warning => `
                <li class="warning-item">
                  <span class="warning-icon">⚠️</span>
                  <span>${warning}</span>
                </li>
              `).join("")}
            </ul>
          </div>
        </div>
        ` : ""}

        <div class="proposal-footer">
          <button class="btn btn-cancel" onclick="this.dispatchEvent(new CustomEvent('cancel'))">Cancel</button>
          <button class="btn btn-confirm" onclick="this.dispatchEvent(new CustomEvent('confirm'))">Confirm & Add to Collection</button>
        </div>
      </div>
    `;

    // Attach event listeners
    this.addEventListener("confirm", () => {
      this.onConfirm?.(this.result);
    });

    this.addEventListener("cancel", () => {
      this.onCancel?.();
    });

    // Attach tool click handlers
    this.querySelectorAll(".tool-item").forEach((el, index) => {
      el.addEventListener("click", () => {
        const tool = this.result.suggestedTools?.[index];
        if (tool) {
          openViewer(tool, this.result);
        }
      });
    });

    // Attach action click handlers
    this.querySelectorAll(".action-item").forEach((el, index) => {
      el.addEventListener("click", () => {
        const action = this.result.suggestedActions?.[index];
        if (action) {
          executeAction(action, this.result);
        }
      });
    });
  }

  /**
   * Render metadata section
   */
  private renderMetadata(): string {
    const items: string[] = [];

    if (this.result.suggestedLabel) {
      items.push(`<div class="metadata-item"><span class="metadata-label">Label:</span><span class="metadata-value">${this.result.suggestedLabel}</span></div>`);
    }

    if (this.result.suggestedType) {
      items.push(`<div class="metadata-item"><span class="metadata-label">Type:</span><span class="metadata-value">${this.result.suggestedType}</span></div>`);
    }

    if (this.result.suggestedThingId) {
      items.push(`<div class="metadata-item"><span class="metadata-label">Thing ID:</span><span class="metadata-value" style="word-break: break-all;">${this.result.suggestedThingId}</span></div>`);
    }

    if (this.result.sourceUrl) {
      items.push(`<div class="metadata-item"><span class="metadata-label">Source URL:</span><span class="metadata-value" style="word-break: break-all;">${this.result.sourceUrl}</span></div>`);
    }

    return items.length > 0 ? items.join("") : "<div class='metadata-item'><span class='metadata-value'>No metadata extracted</span></div>";
  }

  /**
   * Render representations section
   */
  private renderRepresentations(): string {
    if (!this.result.representations || this.result.representations.length === 0) {
      return "<div class='metadata-item'><span class='metadata-value'>No representations extracted</span></div>";
    }

    return this.result.representations.map(rep => `
      <div class="representation-card">
        <h4>${rep["rdfs:label"] || rep["@id"] || "Unnamed Representation"}</h4>
        <div class="role">${rep["rcm:role"] || "No role specified"}</div>
        <div class="url">${rep["rcm:sourceUrl"] || "No source URL"}</div>
      </div>
    `).join("");
  }

  /**
   * Render annotations section
   */
  private renderAnnotations(): string {
    if (!this.result.annotations || this.result.annotations.length === 0) {
      return "<div class='metadata-item'><span class='metadata-value'>No annotations extracted</span></div>";
    }

    return this.result.annotations.map(ann => {
      const body = ann["oa:hasBody"] || ann.body;
      const predicate = body?.["rcm:predicate"] || body?.predicate || "";
      const object = body?.["rcm:object"] || body?.object || "";

      return `
        <div class="annotation-card">
          <div class="predicate">${predicate}</div>
          <div class="object">${object}</div>
          <div class="meta">${ann["dcterms:creator"] || "Unknown creator"}</div>
        </div>
      `;
    }).join("");
  }

  /**
   * Count metadata items
   */
  private countMetadata(): number {
    let count = 0;
    if (this.result.suggestedLabel) count++;
    if (this.result.suggestedType) count++;
    if (this.result.suggestedThingId) count++;
    if (this.result.sourceUrl) count++;
    return count;
  }

  /**
   * Get quality badge color
   */
  private getQualityColor(quality?: "high" | "medium" | "low"): string {
    switch (quality) {
      case "high": return "#166534";
      case "medium": return "#92400e";
      case "low": return "#991b1b";
      default: return "#991b1b";
    }
  }

  /**
   * Get quality icon
   */
  private getQualityIcon(quality?: "high" | "medium" | "low"): string {
    switch (quality) {
      case "high": return "✅";
      case "medium": return "⚠️";
      case "low": return "❌";
      default: return "❌";
    }
  }
}

// Register the custom element
customElements.define("proposal-review", ProposalReview);
