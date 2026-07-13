## Goal

Make existing connectors consistent and complete.

## Tasks

- [ ] **IIIF connector** - Add `suggestedTools: ["iiif-viewer"]`, `suggestedActions: []`
- [ ] **All connectors** - Add `@id` to annotations (currently missing on HTML, Image, JSON-LD, PDF, Generic)
- [ ] **JSON-LD connector** - Add `suggestedTools`, `suggestedActions` based on extracted type
- [ ] **PDF connector** - Add `suggestedActions: ["annotate-page"]`
- [ ] **Generic connector** - Improve content-type detection to suggest appropriate tools

## Files to Modify

- `src/connectors/iiif.ts`
- `src/connectors/html.ts`
- `src/connectors/image.ts`
- `src/connectors/jsonld.ts`
- `src/connectors/pdf.ts`
- `src/connectors/generic.ts`

## Acceptance Criteria

- All connectors produce consistent ResolutionResult with `@id` on annotations
- IIIF connector suggests iiif-viewer tool
- JSON-LD connector suggests tools based on extracted type
- PDF connector suggests annotate-page action
- Generic connector suggests tools based on content-type

## Testing

- Run each connector's `canHandle()` and `resolve()` methods with test URLs
- Verify all annotations have `@id` field
- Verify suggestedTools and suggestedActions are populated appropriately
