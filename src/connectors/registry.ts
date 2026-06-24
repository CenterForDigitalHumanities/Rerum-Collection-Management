/**
 * Connector Registry
 *
 * Manages the registry of available connectors.
 */

import type { Connector, ConnectorRegistry } from "./types";

export class ConnectorRegistryImpl implements ConnectorRegistry {
  private connectors: Map<string, Connector> = new Map();

  register(connector: Connector): void {
    this.connectors.set(connector.id, connector);
  }

  get(id: string): Connector | undefined {
    return this.connectors.get(id);
  }

  all(): Connector[] {
    return Array.from(this.connectors.values());
  }

  findForUrl(url: string): Connector | undefined {
    return this.all().find((c) => c.canHandle(url));
  }

  findAllForUrl(url: string): Connector[] {
    return this.all().filter((c) => c.canHandle(url));
  }
}

/**
 * Default singleton registry.
 */
export const registry = new ConnectorRegistryImpl();
