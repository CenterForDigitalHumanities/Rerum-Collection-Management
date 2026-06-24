# Powerful Entities and Eventities — Supplemental Planning Note

This note incorporates Patrick Cuba's additional planning text around **Powerful Entities**, **spontaneous generation**, **responsible description**, and **effective discovery**. It should be treated as a conceptual refinement to the RCM model, especially around lacunae, entity birth, evidence, and graph discovery.

## 1. Powerful Entities

RCM should support the idea that a digital Entity is born as soon as there is evidence for it. This mirrors ordinary human reading: a document casually mentions commodities, people, places, agencies, events, and units without stopping to define each of them. The reader accepts that these referenced things exist or are at least meaningful within the communicative act.

The system should therefore allow new graph nodes to emerge from evidence before they are classified, reconciled, or fully understood.

Example source records:

```text
12 doz. pineapples received by Mr. Finan
1024 hyB. pharons received by r900
```

From these two records alone, the following candidate Entities may reasonably be born:

- `pineapples` — likely commodity, but still an Entity in the record's world;
- `Mr. Finan` — likely person or receiving agent;
- `pharons` — unknown item, commodity, code word, typo, or domain-specific term;
- `r900` — unknown agent, label, moniker, mechanical identifier, organization code, or scribal artifact;
- `12 doz.` — quantity/unit expression;
- `1024 hyB.` — quantity/unit expression, possibly meaningful even if not understood;
- each whole receipt event — something was received by someone/something.

RCM should not require certainty before minting or staging these nodes. It should allow a researcher to say, in effect:

> This record gives me evidence that something called `pharons` participates in a receipt event.

That is enough to begin.

## 2. Spontaneous Generation

**Spontaneous generation** is the birth of an Entity from evidentiary encounter.

A manuscript, image, catalog entry, transcription, inscription, route book, ledger, oral history, or photograph may cause an Entity to appear in the graph simply because a reader, annotator, or machine identifies a referent worth tracking.

This does not mean the node is authoritative. It means the node has become addressable.

Suggested lifecycle:

1. **Encountered** — a string, mark, image region, or passage suggests a possible entity.
2. **Anchored** — RCM mints, records, or stages an identifier.
3. **Described** — one or more responsible agents make annotations about it.
4. **Related** — the entity gains edges to sources, people, places, events, collections, or concepts.
5. **Reconciled** — it may be linked to a known authority or another RCM Thing.
6. **Absorbed** — it may be treated as part of another entity or a mistaken duplicate.
7. **Invalidated** — it may be challenged or deprecated, but the history of why it was created remains useful.

Important: invalidation should not necessarily delete the node. A false lead can remain historically useful as a documented interpretive path.

## 3. Eventities

The user text includes the coined/typed term **Eventities**. This is worth preserving as a possible RCM design concept.

A possible interpretation:

> **Eventities** are entities generated through events, records of events, or event-like assertions.

In the receipt example, the event is not merely context. It is the reason the Entities become visible. A commodity, receiving agent, unit expression, and place/time context may all become graph nodes because a receipt event attests them.

This suggests RCM should consider an explicit `rcm:Eventity` or `rcm:EventGeneratedEntity` class for planning, even if not adopted in final code.

Possible uses:

- mark entities whose existence is first known through an event record;
- group entities born from the same evidentiary encounter;
- support provenance-aware graph expansion;
- distinguish discovered textual referents from authority-imported records.

Sketch:

```json
{
  "@context": "../schemas/rcm-context.jsonld",
  "@id": "tag:rcm.example,2026:thing/pharons",
  "@type": ["rcm:Thing", "rcm:Lacuna", "rcm:Eventity"],
  "rdfs:label": "pharons"
}
```

Then attach the evidence and claims through annotations.

## 4. Responsible Description

RCM should avoid letting description appear as unowned truth. Even apparently ordinary descriptions should be modeled as responsible assertions where possible.

In many systems, if `pineapples` are known commodities and `Mr. Finan` is known locally, descriptions are attached directly or assumed. RCM instead prefers:

- who asserted the description;
- what evidence they used;
- when they asserted it;
- what target was described;
- whether the assertion describes a string, a Thing, a Representation, or an Event.

This leaves room for controversy.

Examples of possible controversies:

- the date of the source record is wrong;
- `Mr. Finan` refers to the son of the canonical Mr. Finan;
- `pineapple` is a code word for contraband;
- `r900` is a receiving agency label, not a person;
- `pharons` is a scribal error, not a commodity;
- `1024 hyB.` is a damaged or encoded quantity/unit expression.

The model should not prevent disruptive, fringe, or unconventional assertions. It should prevent them from overwriting or imposing themselves on the original resource or other scholars' assertions.

## 5. Assertion Without Imposition

RCM's non-destructive model means scholarship outside the formal schema of a hosting repository can assert itself, but never impose itself.

That suggests a useful product promise:

> RCM lets you say more about a resource than its host repository anticipated, without altering the host's record or forcing your interpretation onto anyone else's view.

This is important for:

- marginalized or undervalued records;
- informal scholarship;
- speculative identification;
- classroom projects;
- community annotation;
- contested heritage;
- reparative description;
- cross-repository discovery.

## 6. Effective Discovery

Within repositories, items may be discoverable through cataloging and APIs. Outside repositories, discovery often depends on secondary acts: indexes, handlists, scholarly memory, accidental browsing, conference conversations, or serendipity.

RCM should convert more of those serendipitous paths into Linked Data graph paths.

Discovery can emerge from:

- place;
- time;
- subject matter;
- named and unnamed people;
- events;
- units and commodities;
- transcriptions;
- generated content;
- scholarly assertions;
- relationships themselves;
- even poorly accepted or authority-less claims.

The key insight: even a weak or controversial relationship may lead a qualified researcher toward a previously invisible repository item.

RCM therefore should index and expose relationships as objects worthy of discovery, not merely edges hidden behind records.

## 7. Modeling the Receipt Example

### 7.1 Source Representation

```json
{
  "@context": "../schemas/rcm-context.jsonld",
  "@id": "tag:rcm.example,2026:source/port-ledger-page-001",
  "@type": ["rcm:Representation", "schema:DigitalDocument"],
  "rdfs:label": "Port ledger page with receipt records"
}
```

### 7.2 Receipt Event

```json
{
  "@context": "../schemas/rcm-context.jsonld",
  "@id": "tag:rcm.example,2026:event/receipt-001",
  "@type": ["rcm:Thing", "schema:Event", "crm:E5_Event"],
  "rdfs:label": "Receipt of 12 dozen pineapples by Mr. Finan"
}
```

### 7.3 Unknown Commodity / Lacuna

```json
{
  "@context": "../schemas/rcm-context.jsonld",
  "@id": "tag:rcm.example,2026:thing/pharons",
  "@type": ["rcm:Thing", "rcm:Lacuna"],
  "rdfs:label": "pharons"
}
```

### 7.4 Unknown Receiving Agent / Lacuna

```json
{
  "@context": "../schemas/rcm-context.jsonld",
  "@id": "tag:rcm.example,2026:agent/r900",
  "@type": ["rcm:Thing", "rcm:Lacuna", "foaf:Agent"],
  "rdfs:label": "r900"
}
```

### 7.5 Evidence-Bearing Entity Birth Annotation

```json
{
  "@context": "../schemas/rcm-context.jsonld",
  "@type": "oa:Annotation",
  "oa:motivatedBy": "oa:identifying",
  "oa:hasTarget": {
    "source": "tag:rcm.example,2026:source/port-ledger-page-001",
    "selector": {
      "type": "TextQuoteSelector",
      "exact": "1024 hyB. pharons received by r900"
    }
  },
  "oa:hasBody": "tag:rcm.example,2026:thing/pharons",
  "dcterms:creator": "tag:rcm.example,2026:agent/researcher-001",
  "dcterms:created": "2026-06-23T00:00:00Z",
  "rcm:evidence": [
    "tag:rcm.example,2026:source/port-ledger-page-001"
  ]
}
```

### 7.6 Responsible Description Annotation

```json
{
  "@context": "../schemas/rcm-context.jsonld",
  "@type": "oa:Annotation",
  "oa:motivatedBy": "oa:describing",
  "oa:hasTarget": "tag:rcm.example,2026:thing/pharons",
  "oa:hasBody": {
    "@type": "rcm:PropertyAssertion",
    "rcm:predicate": "rdf:type",
    "rcm:object": "schema:Product"
  },
  "dcterms:creator": "tag:rcm.example,2026:agent/researcher-001",
  "dcterms:created": "2026-06-23T00:00:00Z",
  "rcm:evidence": [
    "tag:rcm.example,2026:source/port-ledger-page-001"
  ]
}
```

### 7.7 Challenge / Alternative Interpretation

```json
{
  "@context": "../schemas/rcm-context.jsonld",
  "@type": "oa:Annotation",
  "oa:motivatedBy": "oa:questioning",
  "oa:hasTarget": "tag:rcm.example,2026:annotation/pharons-as-product-001",
  "oa:hasBody": {
    "@type": "oa:TextualBody",
    "value": "The term may be a scribal error or local shorthand rather than a commodity class."
  },
  "dcterms:creator": "tag:rcm.example,2026:agent/researcher-002",
  "dcterms:created": "2026-06-23T00:00:00Z"
}
```

## 8. Architecture Implications

### 8.1 Entity Birth Should Be Cheap

The UI should make it easy to create a placeholder from selected text, image region, A/V segment, table cell, map feature, or imported metadata field.

Possible button labels:

- "Make Entity"
- "Create Thing from Selection"
- "Track This Referent"
- "Create Placeholder"
- "Annotate as Entity"

### 8.2 Entity Birth Should Be Reversible but Not Erased

If later found mistaken, the node can be challenged, deprecated, merged, or marked as absorbed. Avoid hard deletion where the scholarly path matters.

### 8.3 Assertions Should Be First-Class Search Results

Search should return:

- Things;
- Representations;
- Collections;
- Annotations;
- assertions;
- relationships;
- evidence passages;
- lacunae.

### 8.4 Discovery Should Include Weak Ties

The graph should not only expose high-confidence, canonical, authority-backed relationships. It should expose weak, obscure, speculative, local, and contested ties with clear attribution.

### 8.5 The Original Remains Pristine

All interpretations, conventional or disruptive, should be external to the source. RCM's job is to preserve and expose interpretive layers, not to overwrite repositories.

## 9. Development Additions

Add to the roadmap:

### Entity Birth MVP

- Select text in a displayed source.
- Create a new Thing/Lacuna from the selection.
- Save an identifying annotation tying the Thing to the selected evidence.
- Add a responsible description annotation.
- Show the new node in graph view.

### Discovery MVP

- Search annotations as well as Things.
- Show "discovered through" source snippets.
- Show "related by assertion" paths.
- Allow filtering by responsible agent and evidence source.

### Controversy MVP

- Allow an annotation to target another annotation.
- Support questioning/challenging motivation.
- Display unresolved disagreement without requiring a winner.

## 10. Suggested Terms to Consider

- `rcm:EntityBirth`
- `rcm:SpontaneousEntity`
- `rcm:Eventity`
- `rcm:Lacuna`
- `rcm:ResponsibleDescription`
- `rcm:Assertion`
- `rcm:EvidenceLink`
- `rcm:AbsorbedIdentity`
- `rcm:DeprecatedIdentity`
- `rcm:DiscoveredThrough`

These terms are not final vocabulary recommendations. They are planning handles.
