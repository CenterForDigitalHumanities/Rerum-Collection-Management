## Goal

Cover common content types that users will paste.

## Tasks

- [ ] **Video connector** - `.mp4`, `.webm`, `.mov` - propose as Representation, suggest time-based annotation
- [ ] **Audio connector** - `.mp3`, `.wav`, `.ogg` - propose as Representation, suggest time-based annotation
- [ ] **RERUM connector** - `store.rerum.io/v1/id/...` - fetch RERUM object, extract properties
- [ ] **Web Annotation connector** - OA annotation URLs - extract target, body, motivation
- [ ] **YouTube connector** - `youtube.com/watch?v=...` - extract title, duration, thumbnail
- [ ] **Vimeo connector** - `vimeo.com/...` - extract title, duration, thumbnail

## Files to Create

- `src/connectors/video.ts`
- `src/connectors/audio.ts`
- `src/connectors/rerum.ts`
- `src/connectors/web-annotation.ts`
- `src/connectors/youtube.ts`
- `src/connectors/vimeo.ts`
- `src/connectors/resolver.ts` (update to register new connectors)

## Acceptance Criteria

- Each connector implements the Connector interface
- Each connector extracts relevant metadata from the content type
- Each connector suggests appropriate tools and actions
- All new connectors are registered in resolver.ts
- All new connectors have unit tests

## Testing

- Run each connector's `canHandle()` and `resolve()` methods with test URLs
- Verify metadata extraction is correct
- Verify suggestedTools and suggestedActions are populated appropriately
