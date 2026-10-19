/**
 * RCM — Main Entry Point
 *
 * Public API for the RERUM Collection Management library.
 */

export * from "./core/index.js";
export * from "./storage/index.js";
export * from "./connectors/index.js";
// Ensure resolver legacy exports are retained in the bundle
import { findForUrl, findAllForUrl } from "./connectors/resolver.js";
export { findForUrl, findAllForUrl };
export * from "./graph/index.js";
export * from "./viewers/index.js";
export * from "./ui/index.js";
