## Goal

Show detected metadata before adding to collection.

## Tasks

- [ ] **Proposal component** - Display ResolutionResult with expandable sections
- [ ] **Metadata preview** - Show extracted properties, representations, annotations
- [ ] **Tool suggestions** - Show suggested viewers with icons
- [ ] **Action buttons** - Show suggested actions as clickable buttons
- [ ] **Warnings display** - Show warnings as informational badges
- [ ] **Quality indicator** - Show quality rating (high/medium/low) as visual indicator
- [ ] **Edit before confirm** - Allow editing label, type before adding to collection

## Files to Create/Modify

- `src/ui/proposal-review.ts` (new component)
- `src/ui/index.ts` (export new component)
- `index.html` (add component to UI)

## Acceptance Criteria

- UI shows proposal review before adding to collection
- All extracted metadata is visible and expandable
- Suggested tools are shown with icons
- Suggested actions are clickable buttons
- Warnings are shown as informational badges
- Quality rating is visible as a visual indicator
- User can edit label and type before confirming

## Testing

- Paste various URLs and verify proposal review is shown
- Verify all metadata is displayed correctly
- Verify suggested tools and actions are functional
- Verify warnings and quality rating are displayed correctly
- Verify editing label and type works before confirming
