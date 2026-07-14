## Goal

Implement the actions suggested by connectors.

## Tasks

- [ ] **create-iiif-manifest** - Generate IIIF Manifest from image/video/audio URL
- [ ] **annotate-text** - Open annotation composer for text content
- [ ] **annotate-page** - Open page-level annotation for PDF
- [ ] **annotate-time** - Open time-based annotation for video/audio
- [ ] **action registry** - Map action strings to handler functions

## Files to Create/Modify

- `src/ui/action-registry.ts` (new file)
- `src/ui/proposal-review.ts` (add action button handlers)
- `src/connectors/resolver.ts` (update to use action registry)

## Acceptance Criteria

- Each suggested action is clickable and functional
- Action registry maps action strings to handler functions
- Handlers open appropriate UI components or perform actions
- All actions are tested and working

## Testing

- Click each action button and verify it performs the correct action
- Verify action registry maps all action strings correctly
- Verify handlers open appropriate UI components or perform actions
