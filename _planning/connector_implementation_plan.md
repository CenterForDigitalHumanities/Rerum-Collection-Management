# Connector Layer Implementation Plan

## Overview

The connector layer is the entry point for "paste URL, get graph seeds." Each connector extracts metadata from a content type, proposes representations and annotations, and suggests tools and actions. This plan covers fixing existing connectors, adding new ones, and integrating with the UI.

## Current State

- **6 connectors exist**: IIIF, HTML, Image, JSON-LD, PDF, Generic
- **All registered** in `resolver.ts`
- **ResolutionResult** has `suggestedTools`, `suggestedActions`, `warnings`, `quality`
- **No UI** for reviewing proposals before adding to collection
- **No action handlers** for suggested actions (create-iiif-manifest, annotate-text)
- **No viewer integration** for suggested tools

## Implementation Phases

### Phase 1: Fix Existing Connectors

**Goal**: Make existing connectors consistent and complete.

- [ ] **IIIF connector** - Add `suggestedTools: ["iiif-viewer"]`, `suggestedActions: []`
- [ ] **All connectors** - Add `@id` to annotations (currently missing on HTML, Image, JSON-LD, PDF, Generic)
- [ ] **JSON-LD connector** - Add `suggestedTools`, `suggestedActions` based on extracted type
- [ ] **PDF connector** - Add `suggestedActions: ["annotate-page"]`
- [ ] **Generic connector** - Improve content-type detection to suggest appropriate tools

**PR**: `fix/connector-consistency`

### Phase 2: Add New Connectors

**Goal**: Cover common content types that users will paste.

- [ ] **Video connector** - `.mp4`, `.webm`, `.mov` - propose as Representation, suggest time-based annotation
- [ ] **Audio connector** - `.mp3`, `.wav`, `.ogg` - propose as Representation, suggest time-based annotation
- [ ] **RERUM connector** - `store.rerum.io/v1/id/...` - fetch RERUM object, extract properties
- [ ] **Web Annotation connector** - OA annotation URLs - extract target, body, motivation
- [ ] **YouTube connector** - `youtube.com/watch?v=...` - extract title, duration, thumbnail
- [ ] **Vimeo connector** - `vimeo.com/...` - extract title, duration, thumbnail

**PRs**: `feat/video-audio-connectors`, `feat/rerum-connector`, `feat/web-annotation-connector`, `feat/youtube-vimeo-connectors`

### Phase 3: Proposal Review UI

**Goal**: Show detected metadata before adding to collection.

- [ ] **Proposal component** - Display ResolutionResult with expandable sections
- [ ] **Metadata preview** - Show extracted properties, representations, annotations
- [ ] **Tool suggestions** - Show suggested viewers with icons
- [ ] **Action buttons** - Show suggested actions as clickable buttons
- [ ] **Warnings display** - Show warnings as informational badges
- [ ] **Quality indicator** - Show quality rating (high/medium/low) as visual indicator
- [ ] **Edit before confirm** - Allow editing label, type before adding to collection

**PR**: `feat/proposal-review-ui`

### Phase 4: Action Handlers

**Goal**: Implement the actions suggested by connectors.

- [ ] **create-iiif-manifest** - Generate IIIF Manifest from image/video/audio URL
- [ ] **annotate-text** - Open annotation composer for text content
- [ ] **annotate-page** - Open page-level annotation for PDF
- [ ] **annotate-time** - Open time-based annotation for video/audio
- [ ] **action registry** - Map action strings to handler functions

**PR**: `feat/action-handlers`

### Phase 5: Viewer Integration

**Goal**: Wire suggested tools to viewer implementations.

- [ ] **Viewer registry** - Map tool strings to viewer components
- [ ] **iiif-viewer** - Already exists, verify integration
- [ ] **pdf-viewer** - Already exists, verify integration
- [ ] **video-viewer** - Create or verify existing implementation
- [ ] **audio-viewer** - Create or verify existing implementation
- [ ] **annotation-composer** - Create or verify existing implementation

**PR**: `feat/viewer-integration`

### Phase 6: Multi-Connector Resolution

**Goal**: Allow multiple connectors to run on the same URL and merge results.

- [ ] **findAllForUrl usage** - Use registry.findAllForUrl instead of findForUrl
- [ ] **Result merging** - Merge representations, annotations from multiple connectors
- [ ] **Priority system** - Higher-priority connectors' suggestions take precedence
- [ ] **UI for multiple proposals** - Show merged proposal with source attribution

**PR**: `feat/multi-connector-resolution`

## GitHub Issues

Each phase above should be a separate GitHub issue with:
- Clear acceptance criteria
- Links to relevant code files
- Examples of expected behavior
- Testing instructions

## Testing Strategy

- **Unit tests** - Each connector's `canHandle()` and `resolve()` methods
- **Integration tests** - Resolver's `resolveUrl()` with various URLs
- **E2E tests** - UI proposal review flow with mock connectors
- **Manual testing** - Paste real URLs and verify extraction

## Success Criteria

- [ ] All existing connectors produce consistent ResolutionResult with `@id` on annotations
- [ ] New connectors cover common content types (video, audio, RERUM, YouTube, Vimeo)
- [ ] UI shows proposal review before adding to collection
- [ ] Suggested actions are clickable and functional
- [ ] Suggested tools open appropriate viewers
- [ ] Multiple connectors can run on the same URL with merged results
- [ ] All connectors have unit tests with >80% coverage

## Timeline

- **Phase 1**: 1-2 days (fixes to existing code)
- **Phase 2**: 3-5 days (new connectors)
- **Phase 3**: 3-5 days (UI component)
- **Phase 4**: 2-3 days (action handlers)
- **Phase 5**: 2-3 days (viewer integration)
- **Phase 6**: 2-3 days (multi-connector resolution)

**Total**: ~13-21 days for complete implementation

## Notes

- Connectors should be **aggressive about detection** - extract everything possible
- The only exception is bulk import pipelines where minimal ingestion is preferred
- All objects must round-trip into JSON-LD without semantic loss
- The `quality` field should reflect confidence in the extraction, not just success/failure
- Warnings should be specific and actionable (e.g., "No @id detected" not "Missing metadata")
