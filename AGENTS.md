# Codex Instructions

- Do not suggest code that has been deleted in the recent edits.

## Testing

- Use nested `describe` blocks for Given/When/Then structure (e.g., `describe('given that ...')` → `describe('when ...')` → `it('then ...')`).
- Each `it` should contain exactly one assertion.
- Avoid targeting elements by text; use stable selectors like `data-testid` instead.
