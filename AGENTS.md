# Codex Instructions

- Do not suggest code that has been deleted in the recent edits.
- Use Mantine UI components and conventions where applicable.
- Write tests using Jest and React Testing Library best practices. Add to tests when implementing new features.
- Follow the existing project structure and coding style.
- Ensure accessibility best practices are followed in UI components.
- Use Next.js routing conventions for navigation.
- Maintain consistent styling using CSS modules as per the project's existing styles.
- Run relevant tests and linters to ensure code quality and passing tests before finalizing changes. Add new/update existing tests for new features.

## Testing

- Use nested `describe` blocks for Given/When/Then structure (e.g., `describe('given that ...')` → `describe('when ...')` → `it('then ...')`).
- Each `it` should contain exactly one assertion.
- Avoid targeting elements by text; use stable selectors like `data-testid` instead.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
