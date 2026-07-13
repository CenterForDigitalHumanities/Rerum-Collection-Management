## Goal

Allow multiple connectors to run on the same URL and merge results.

## Tasks

- [ ] **findAllForUrl usage** - Use registry.findAllForUrl instead of findForUrl
- [ ] **Result merging** - Merge representations, annotations from multiple connectors
- [ ] **Priority system** - Higher-priority connectors' suggestions take precedence
- [ ] **UI for multiple proposals** - Show merged proposal with source attribution

## Files to Modify

- `src/connectors/resolver.ts` (use findAllForUrl, merge results)
- `src/connectors/registry.ts` (add priority system)
- `src/ui/proposal-review.ts` (show merged proposal with source attribution)

## Acceptance Criteria

- Multiple connectors can run on the same URL
- Results are merged correctly with source attribution
- Higher-priority connectors' suggestions take precedence
- UI shows merged proposal with source attribution
- All merging logic is tested and working

## Testing

- Run multiple connectors on the same URL and verify results are merged correctly
- Verify higher-priority connectors' suggestions take precedence
- Verify UI shows merged proposal with source attribution
