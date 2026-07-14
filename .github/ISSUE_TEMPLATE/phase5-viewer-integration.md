## Goal

Wire suggested tools to viewer implementations.

## Tasks

- [ ] **Viewer registry** - Map tool strings to viewer components
- [ ] **iiif-viewer** - Already exists, verify integration
- [ ] **pdf-viewer** - Already exists, verify integration
- [ ] **video-viewer** - Create or verify existing implementation
- [ ] **audio-viewer** - Create or verify existing implementation
- [ ] **annotation-composer** - Create or verify existing implementation

## Files to Create/Modify

- `src/ui/viewer-registry.ts` (new file)
- `src/viewers/` (verify existing viewers)
- `src/ui/proposal-review.ts` (integrate viewer registry)

## Acceptance Criteria

- Viewer registry maps all tool strings to viewer components
- All existing viewers are integrated and functional
- New viewers (video, audio, annotation-composer) are created if needed
- All viewers are tested and working

## Testing

- Click each suggested tool and verify it opens the correct viewer
- Verify viewer registry maps all tool strings correctly
- Verify all viewers render content correctly
