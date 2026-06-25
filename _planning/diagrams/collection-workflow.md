# Collection-Centric User Flow

## Problem

The current `index.html` starts with "paste a URL" — this is a connector test, not a research workflow. A user comes to RCM to **work within a collection** they're building, not to resolve arbitrary URLs.

## Primary Entry Points

```
┌─────────────────────────────────────────────────────────────┐
│                      RCM Landing                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌──────────────────────────┐  ┌──────────────────────┐   │
│   │  📂 Open Existing        │  │  ➕ New Collection   │   │
│   │                          │  │                      │   │
│   │  • Recent collections    │  │  • Name               │   │
│   │  • Search by name/ID     │  │  • Description        │   │
│   │  • Browse all            │  │  • Profile (optional) │   │
│   └──────────┬───────────────┘  └──────────┬───────────┘   │
│              │                              │                │
│              ▼                              ▼                │
│       ┌──────────────┐            ┌──────────────┐          │
│       │  Collection  │            │  Collection  │          │
│       │   View       │            │   View       │          │
│       └──────────────┘            └──────────────┘          │
└─────────────────────────────────────────────────────────────┘
```

## Collection View (the main workspace)

```
┌──────────────────────────────────────────────────────────────────┐
│  Collection: "WWI Letters — Gooch Family"    [⚙ Settings]       │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────────────────────────────────┐ │
│  │  Sidebar     │  │  Main Area                               │ │
│  │              │  │                                          │ │
│  │  Members (12)│  │  ┌────────────────────────────────────┐  │ │
│  │              │  │  │  ┌──────────────────────────────┐  │  │ │
│  │  📄 Letter   │  │  │  │  Letter from A. Gooch        │  │  │ │
│  │  👤 Allen    │  │  │  │  (crm:E22_Human-Made_Object) │  │  │ │
│  │  👤 Martha   │  │  │  │                                │  │  │ │
│  │  📍 Camp     │  │  │  │  Assertions (5)               │  │  │ │
│  │              │  │  │  │  Representations (2)           │  │  │ │
│  │  ─────────── │  │  │  │  Related (3)                   │  │  │ │
│  │  Filters     │  │  │  └──────────────────────────────┘  │  │ │
│  │  • Type      │  │  │  ┌──────────────────────────────┐  │  │ │
│  │  • Provenance│  │  │  │  Letter to M. Gooch          │  │  │ │
│  │  • Date      │  │  │  └──────────────────────────────┘  │  │ │ │
│  │  • Has IIIF  │  │  └────────────────────────────────────┘  │ │
│  └──────────────┘  │                                          │ │
│                    │  ──────────────────────────────────────── │ │
│                    │                                          │ │
│                    │  ┌────────────────────────────────────┐  │ │
│                    │  │  + Add to Collection              │  │ │
│                    │  ├────────────────────────────────────┤  │ │
│                    │  │  🔗 Paste URL (resolve)            │  │ │
│                    │  │  📝 Create Thing manually          │  │ │
│                    │  │  📤 Import JSON-LD bundle          │  │ │
│                    │  │  🔍 Search external resources      │  │ │
│                    │  └────────────────────────────────────┘  │ │
│                    └──────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

## Add to Collection

The "Add to Collection" panel is where the URL resolver lives — as a tool within the collection context, not as the home screen.

```
┌──────────────────────────────────────────────────────────┐
│  Add to Collection: "WWI Letters — Gooch Family"        │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ┌────────────────────────────────────────────────────┐  │
│  │  🔗 Paste URL                                      │  │
│  │  ┌─────────────────────────┐  ┌────────────────┐  │  │
│  │  │ https://iiif.example... │  │ [Resolve]      │  │  │
│  │  └─────────────────────────┘  └────────────────┘  │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  ┌────────────────────────────────────────────────────┐  │
│  │  📝 Create Thing manually                          │  │
│  │                                                    │  │
│  │  Label:  [________________________]                │  │
│  │  Type:    [crm:E22_Human-Made_Object ▼]           │  │
│  │  Notes:  [________________________]                │  │
│  │                              [Create]              │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  ┌────────────────────────────────────────────────────┐  │
│  │  📤 Import JSON-LD bundle                          │  │
│  │  [Drop files here or click to browse]              │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

## Resolution Review (after pasting a URL)

```
┌──────────────────────────────────────────────────────────┐
│  Resolution Result                                       │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Suggested Thing: "Letter from Allen Gooch, 1918-06-07" │
│  Suggested Type: crm:E22_Human-Made_Object               │
│  Source: IIIF Manifest (3 canvases)                      │
│                                                          │
│  ──────────────────────────────────────────────────────  │
│                                                          │
│  What do you want to do?                                 │
│                                                          │
│  ┌──────────────────┐  ┌──────────────────┐             │
│  │ ✓ Add as new     │  │ 🔗 Link to       │             │
│  │   Thing          │  │   existing       │             │
│  │                  │  │   Thing          │             │
│  │ Add the resolved │  │  [Search members │             │
│  │ Thing + all      │  │   in this        │             │
│  │ representations  │  │   collection...] │             │
│  │ to this          │  │                  │             │
│  │ collection.      │  │  Merge with an   │             │
│  │                  │  │  existing Thing. │             │
│  └──────────────────┘  └──────────────────┘             │
│                                                          │
│  [Skip — just add representations]                       │
│  [Cancel]                                                │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

## Thing Detail View

Clicking a member in the collection view opens the Thing Detail — the primary workspace for scholarly annotation.

```
┌──────────────────────────────────────────────────────────────────┐
│  ← Back to Collection                                          │
│                                                                  │
│  Letter from Allen Gooch, 1918-06-07                           │
│  crm:E22_Human-Made_Object    tag:rcm.example,2026:thing/...   │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Assertions about this Thing (5)                           │ │
│  │                                                            │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │ dc:creator → "Allen L. Gooch"                       │ │ │
│  │  │ by: researcher-001, 2026-06-20                       │ │ │
│  │  │ evidence: 2 items                                    │ │ │
│  │  │ [✏ Edit] [🗑 Remove] [⚑ Dispute]                    │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  │                                                            │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │ dc:date → "1918-06-07"                              │ │ │
│  │  │ by: researcher-001, 2026-06-20                       │ │ │
│  │  │ evidence: 1 item                                     │ │ │
│  │  │ [✏ Edit] [🗑 Remove] [⚑ Dispute]                    │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  │                                                            │ │
│  │  [+ Add Assertion]                                         │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Representations (2)                                       │ │
│  │                                                            │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │ IIIF Manifest: 3 canvases                            │ │ │
│  │  │ [View] [Annotate region]                             │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  │                                                            │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │ Transcription (Expression)                           │ │ │
│  │  │ [View] [Annotate text]                               │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  │                                                            │ │
│  │  [+ Add Representation]                                    │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Related Things (3)                                        │ │
│  │                                                            │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │ dc:creator → Allen L. Gooch (crm:E74_Group)         │ │ │
│  │  │ [View] [Add evidence]                                │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  │                                                            │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │ dc:subject → "Camp Logan" (schema:Place)            │ │ │
│  │  │ [View] [Add evidence]                                │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  │                                                            │ │
│  │  [+ Add Relationship]                                      │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

## Annotation Composer

The core scholarly action: adding a description, evidence, or relationship to a Thing.

```
┌──────────────────────────────────────────────────────────────────┐
│  New Assertion about: Letter from Allen Gooch, 1918-06-07      │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Predicate                                                 │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │ [dc:creator ▼]  or  [Custom predicate ____________] │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Object (the value)                                        │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │ [Allen L. Gooch __________________________]         │ │ │
│  │  │                                                     │ │ │
│  │  │ ┌─────────────┐ ┌─────────────┐ ┌───────────────┐  │ │ │
│  │  │ │ Literal     │ │ Existing    │ │ New Thing     │  │ │ │
│  │  │ │ text value  │ │ Thing in    │ │ (creates a   │  │ │ │
│  │  │ │             │ │ collection  │ │  new member)  │  │ │ │
│  │  │ └─────────────┘ └─────────────┘ └───────────────┘  │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Evidence (optional)                                       │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │ Attach evidence supporting this assertion:          │ │ │
│  │  │                                                     │ │ │
│  │  │ • IIIF Canvas region (from a Representation)       │ │ │
│  │  │ • Text quote (from a Transcription Expression)     │ │ │
│  │  │ • External URL                                     │ │ │
│  │  │ • Another Thing in this collection                 │ │ │
│  │  │                                                     │ │ │
│  │  │ [+ Add evidence]                                    │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Motivation                                                 │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │ [oa:describing ▼]  (describing / classifying /      │ │ │
│  │  │                 identifying / linking / commenting)  │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Notes (optional)                                          │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │ Free-text note about this assertion...              │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│                              [Cancel]  [Save Assertion]        │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

## Evidence Attachment

When evidence is attached to an assertion, it becomes part of the annotation.

```
┌──────────────────────────────────────────────────────────────────┐
│  Add Evidence                                                    │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  From a Representation                                     │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │ Select a Representation of this Thing:              │ │ │
│  │  │                                                     │ │ │
│  │  │ ○ IIIF Manifest: 3 canvases                         │ │ │
│  │  │   → Select canvas, then region or text              │ │ │
│  │  │                                                     │ │ │
│  │  │ ○ Transcription (Expression)                        │ │ │
│  │  │   → Select text passage                             │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  From an external source                                   │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │ URL: [________________________________________]     │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  From another Thing in this collection                     │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │ [Search collection members...]                      │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│                              [Cancel]  [Attach Evidence]       │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

## Deep Entity Detail (Future)

A Thing may be very complex — a person with many relationships, a place with competing locations, an event with many participants. The deep entity view is a future enhancement.

```
┌──────────────────────────────────────────────────────────────────┐
│  Allen L. Gooch (crm:E74_Group)                                │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Timeline View                                             │ │
│  │  ──────────────────────────────────────────────────────── │ │
│  │  1918  1919  1920  1921  1922  1923  1924  1925         │ │
│  │  │───│───│───│───│───│───│───│───│───│───│───│───│      │ │
│  │  ●   ●   ●   ●   ●   ●   ●   ●   ●   ●   ●   ●          │ │
│  │  (letters, events, locations, relationships)              │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Relationship Graph                                        │ │
│  │  [Interactive network visualization]                       │ │
│  │  Filter by: predicate / provenance / date / evidence       │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Competing Assertions                                      │ │
│  │  Where multiple annotators disagree:                       │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │ dc:creator → "Allen L. Gooch" (researcher-001)      │ │ │
│  │  │ dc:creator → "A. L. Gooch, Sgt." (researcher-002)  │ │ │
│  │  │ [View dispute thread]                                │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

> **Note:** Deep entity views (timeline, graph, dispute threads) are Phase 7+ features. The MVP needs Thing Detail + Annotation Composer.

## Data Model

```
Collection (Thing with @type "rcm:Collection")
├── membership annotations → Things in the collection
├── descriptive annotations → collection metadata
└── settings → profile, view preferences, service config

Thing
├── descriptive annotations → properties/assertions
├── representation links → digital embodiments
├── relationship assertions → links to other Things
└── membership annotations → which collections it belongs to

Annotation
├── oa:hasTarget → the Thing being annotated
├── oa:hasBody → the assertion (PropertyAssertion, RelationshipAssertion, etc.)
├── oa:motivatedBy → describing / classifying / identifying / linking
├── dcterms:creator → who made the assertion
├── dcterms:created → when
├── rcm:evidence → array of evidence URIs (selectors, representations, etc.)
└── rcm:provenance → human / machine / imported
```

## Navigation Summary

```
Landing
  ├── Open Collection → Collection View
  └── New Collection  → Collection View (empty)
                        ├── Click member → Thing Detail
                        │                     ├── Assertions list
                        │                     │   └── [+ Add Assertion] → Annotation Composer
                        │                     │       ├── Choose predicate
                        │                     │       ├── Choose object (literal / existing Thing / new Thing)
                        │                     │       ├── [+ Add evidence] → Evidence Attachment
                        │                     │       └── Save → creates Annotation
                        │                     ├── Representations list
                        │                     │   └── [+ Add Representation] → URL or link
                        │                     ├── Related Things list
                        │                     │   └── [+ Add Relationship] → Annotation Composer
                        │                     └── (future: deep entity views)
                        ├── Add to Collection
                        │   ├── Paste URL → Resolution Review → add/link
                        │   ├── Create Thing → add to collection
                        │   └── Import JSON-LD → add to collection
                        └── Settings → profile, export, LDN config
```

## Key Decisions

1. **Collection is the home screen**, not URL resolver
2. **URL resolver is a tool within a collection**, not the entry point
3. **Resolution result offers choices**: add new, link existing, skip
4. **Sidebar shows collection members** with filters
5. **Main area shows member cards** with assertion/representation counts
6. **"Add to Collection" is always accessible** from the collection view
7. **Thing Detail is the primary scholarly workspace** — assertions, representations, relationships
8. **Annotation Composer is the core action** — predicate + object + evidence
9. **Evidence is first-class** — attached to assertions, not to Things directly
10. **Deep entity views are future work** — timeline, graph, dispute threads are Phase 7+
