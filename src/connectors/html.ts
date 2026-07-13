/**
 * HTML Connector
 *
 * Resolves HTML page URLs into RCM graph seeds.
 * Extracts metadata from <title>, meta tags, and content.
 * Detects embedded images, video, audio for representation proposals.
 */

import type { Connector, ResolutionResult, Representation, Annotation } from "./types.js";

export class HtmlConnector implements Connector {
  readonly id = "html";
  readonly name = "HTML Connector";
  readonly description = "Resolves HTML pages into RCM graph seeds with metadata extraction.";

  canHandle(url: string): boolean {
    return /\.(html?)(\?.*)?$/.test(url) || /\/(post|page|blog|article)\//.test(url)
  }

  async resolve(url: string): Promise<ResolutionResult> {
    try {
      const response = await fetch(url)
      if (!response.ok) {
        return this.fallbackResult(url)
      }

      const html = await response.text()
      const doc = new DOMParser().parseFromString(html, "text/html")

      return this.extractFromHtml(doc, url)
    } catch {
      return this.fallbackResult(url)
    }
  }

  private extractFromHtml(doc: Document, url: string): ResolutionResult {
    const warnings: string[] = []
    const representations: Representation[] = []
    const annotations: Annotation[] = []
    const suggestedTools: string[] = []
    const suggestedActions: string[] = []

    // Extract metadata
    const title = doc.querySelector("title")?.textContent?.trim()
      || doc.querySelector("h1")?.textContent?.trim()
      || doc.querySelector("meta[name='title']")?.getAttribute("content")
      || url

    const author = doc.querySelector("meta[name='author']")?.getAttribute("content")
      || doc.querySelector("meta[property='author']")?.getAttribute("content")
      || doc.querySelector("meta[name='creator']")?.getAttribute("content")

    const date = doc.querySelector("meta[name='date']")?.getAttribute("content")
      || doc.querySelector("meta[property='date']")?.getAttribute("content")
      || doc.querySelector("time[datetime]")?.getAttribute("datetime")
      || doc.querySelector("meta[name='publication-date']")?.getAttribute("content")

    const description = doc.querySelector("meta[name='description']")?.getAttribute("content")
      || doc.querySelector("meta[property='description']")?.getAttribute("content")

    const tags = doc.querySelector("meta[name='tags']")?.getAttribute("content")
      || doc.querySelector("meta[name='keywords']")?.getAttribute("content")

    // Extract body text
    const body = doc.querySelector("body")
    const bodyText = body?.textContent?.trim().replace(/\s+/g, " ").slice(0, 5000)

    // Detect embedded images
    const images = Array.from(doc.querySelectorAll("img")).map((img) => ({
      src: img.getAttribute("src") || img.getAttribute("data-src") || "",
      alt: img.getAttribute("alt") || "",
    })).filter((img) => img.src)

    // Detect embedded video
    const videos = Array.from(doc.querySelectorAll("video, iframe[src*='youtube'], iframe[src*='vimeo']")).map((v) => ({
      src: v.getAttribute("src") || v.getAttribute("data-src") || "",
    })).filter((v) => v.src)

    // Detect embedded audio
    const audios = Array.from(doc.querySelectorAll("audio")).map((a) => ({
      src: a.getAttribute("src") || a.getAttribute("data-src") || "",
    })).filter((a) => a.src)

    // Build representations
    if (images.length > 0) {
      for (const img of images) {
        representations.push({
          "@id": `tag:rcm.example,${new Date().getFullYear()}:rep/img-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          "@type": "rcm:Representation",
          "rdfs:label": img.alt || "Embedded Image",
          "rcm:represents": `tag:rcm.example,${new Date().getFullYear()}:thing/html-${Date.now()}`,
          "rcm:sourceUrl": img.src,
          "rcm:role": "schema:ImageObject",
        })
      }
      suggestedTools.push("iiif-viewer")
      suggestedActions.push("create-iiif-manifest")
    }

    if (videos.length > 0) {
      for (const vid of videos) {
        representations.push({
          "@id": `tag:rcm.example,${new Date().getFullYear()}:rep/vid-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          "@type": "rcm:Representation",
          "rdfs:label": "Embedded Video",
          "rcm:represents": `tag:rcm.example,${new Date().getFullYear()}:thing/html-${Date.now()}`,
          "rcm:sourceUrl": vid.src,
          "rcm:role": "schema:VideoObject",
        })
      }
      suggestedTools.push("video-viewer")
    }

    if (audios.length > 0) {
      for (const aud of audios) {
        representations.push({
          "@id": `tag:rcm.example,${new Date().getFullYear()}:rep/aud-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          "@type": "rcm:Representation",
          "rdfs:label": "Embedded Audio",
          "rcm:represents": `tag:rcm.example,${new Date().getFullYear()}:thing/html-${Date.now()}`,
          "rcm:sourceUrl": aud.src,
          "rcm:role": "schema:AudioObject",
        })
      }
      suggestedTools.push("audio-viewer")
    }

    // The HTML page itself is a representation
    representations.push({
      "@id": `tag:rcm.example,${new Date().getFullYear()}:rep/html-${Date.now()}`,
      "@type": "rcm:Representation",
      "rdfs:label": "HTML Page",
      "rcm:represents": `tag:rcm.example,${new Date().getFullYear()}:thing/html-${Date.now()}`,
      "rcm:sourceUrl": url,
      "rcm:role": "schema:WebPage",
    })

    // Build annotations
    if (title) {
      annotations.push({
        "@id": `tag:rcm.example,${new Date().getFullYear()}:annotation/html-title-${Date.now()}`,
        "@type": "oa:Annotation",
        "oa:motivatedBy": "oa:describing",
        "oa:hasTarget": `tag:rcm.example,${new Date().getFullYear()}:thing/html-${Date.now()}`,
        "oa:hasBody": {
          "@id": `tag:rcm.example,${new Date().getFullYear()}:body/html-title-${Date.now()}`,
          "@type": "rcm:PropertyAssertion",
          "rcm:predicate": "rdfs:label",
          "rcm:object": title,
        },
        "dcterms:creator": `tag:rcm.example,${new Date().getFullYear()}:agent/rcm-system`,
        "dcterms:created": new Date().toISOString(),
        "rcm:evidence": [url],
      })
    }

    if (author) {
      annotations.push({
        "@id": `tag:rcm.example,${new Date().getFullYear()}:annotation/html-author-${Date.now()}`,
        "@type": "oa:Annotation",
        "oa:motivatedBy": "oa:describing",
        "oa:hasTarget": `tag:rcm.example,${new Date().getFullYear()}:thing/html-${Date.now()}`,
        "oa:hasBody": {
          "@id": `tag:rcm.example,${new Date().getFullYear()}:body/html-author-${Date.now()}`,
          "@type": "rcm:PropertyAssertion",
          "rcm:predicate": "dcterms:creator",
          "rcm:object": author,
        },
        "dcterms:creator": `tag:rcm.example,${new Date().getFullYear()}:agent/rcm-system`,
        "dcterms:created": new Date().toISOString(),
        "rcm:evidence": [url],
      })
    }

    if (date) {
      annotations.push({
        "@id": `tag:rcm.example,${new Date().getFullYear()}:annotation/html-date-${Date.now()}`,
        "@type": "oa:Annotation",
        "oa:motivatedBy": "oa:describing",
        "oa:hasTarget": `tag:rcm.example,${new Date().getFullYear()}:thing/html-${Date.now()}`,
        "oa:hasBody": {
          "@id": `tag:rcm.example,${new Date().getFullYear()}:body/html-date-${Date.now()}`,
          "@type": "rcm:PropertyAssertion",
          "rcm:predicate": "dcterms:created",
          "rcm:object": date,
        },
        "dcterms:creator": `tag:rcm.example,${new Date().getFullYear()}:agent/rcm-system`,
        "dcterms:created": new Date().toISOString(),
        "rcm:evidence": [url],
      })
    }

    if (description) {
      annotations.push({
        "@id": `tag:rcm.example,${new Date().getFullYear()}:annotation/html-desc-${Date.now()}`,
        "@type": "oa:Annotation",
        "oa:motivatedBy": "oa:describing",
        "oa:hasTarget": `tag:rcm.example,${new Date().getFullYear()}:thing/html-${Date.now()}`,
        "oa:hasBody": {
          "@id": `tag:rcm.example,${new Date().getFullYear()}:body/html-desc-${Date.now()}`,
          "@type": "rcm:PropertyAssertion",
          "rcm:predicate": "dcterms:description",
          "rcm:object": description,
        },
        "dcterms:creator": `tag:rcm.example,${new Date().getFullYear()}:agent/rcm-system`,
        "dcterms:created": new Date().toISOString(),
        "rcm:evidence": [url],
      })
    }

    if (tags) {
      annotations.push({
        "@id": `tag:rcm.example,${new Date().getFullYear()}:annotation/html-tags-${Date.now()}`,
        "@type": "oa:Annotation",
        "oa:motivatedBy": "oa:describing",
        "oa:hasTarget": `tag:rcm.example,${new Date().getFullYear()}:thing/html-${Date.now()}`,
        "oa:hasBody": {
          "@id": `tag:rcm.example,${new Date().getFullYear()}:body/html-tags-${Date.now()}`,
          "@type": "rcm:PropertyAssertion",
          "rcm:predicate": "dcterms:subject",
          "rcm:object": tags,
        },
        "dcterms:creator": `tag:rcm.example,${new Date().getFullYear()}:agent/rcm-system`,
        "dcterms:created": new Date().toISOString(),
        "rcm:evidence": [url],
      })
    }

    if (bodyText) {
      annotations.push({
        "@id": `tag:rcm.example,${new Date().getFullYear()}:annotation/html-text-${Date.now()}`,
        "@type": "oa:Annotation",
        "oa:motivatedBy": "oa:describing",
        "oa:hasTarget": `tag:rcm.example,${new Date().getFullYear()}:thing/html-${Date.now()}`,
        "oa:hasBody": {
          "@id": `tag:rcm.example,${new Date().getFullYear()}:body/html-text-${Date.now()}`,
          "@type": "rcm:PropertyAssertion",
          "rcm:predicate": "schema:text",
          "rcm:object": bodyText,
        },
        "dcterms:creator": `tag:rcm.example,${new Date().getFullYear()}:agent/rcm-system`,
        "dcterms:created": new Date().toISOString(),
        "rcm:evidence": [url],
      })
      suggestedTools.push("annotation-composer")
    }

    // Warnings
    if (!title) warnings.push("No title detected")
    if (!author) warnings.push("No author detected")
    if (!date) warnings.push("No date detected")
    if (!bodyText) warnings.push("No body text detected")

    return {
      sourceUrl: url,
      suggestedThingId: `tag:rcm.example,${new Date().getFullYear()}:thing/html-${Date.now()}`,
      suggestedLabel: title,
      suggestedType: "schema:WebPage",
      representations,
      annotations,
      suggestedTools: Array.from(new Set(suggestedTools)),
      suggestedActions: Array.from(new Set(suggestedActions)),
      warnings,
      connector: this.id,
      quality: title && author && date ? "high" : title && author ? "medium" : "low",
    }
  }

  private fallbackResult(url: string): ResolutionResult {
    return {
      sourceUrl: url,
      suggestedThingId: `tag:rcm.example,${new Date().getFullYear()}:thing/html-${Date.now()}`,
      suggestedLabel: url,
      suggestedType: "schema:WebPage",
      representations: [],
      annotations: [],
      suggestedTools: [],
      suggestedActions: [],
      warnings: ["Failed to fetch or parse HTML page"],
      connector: this.id,
      quality: "low",
    }
  }
}
