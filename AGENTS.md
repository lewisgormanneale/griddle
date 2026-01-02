# Codex Instructions

- Do not suggest code that has been deleted in the recent edits.
- Use Mantine UI components and conventions where applicable.
- Write tests using Jest and React Testing Library best practices. Add to tests when implementing new features.
- Follow the existing project structure and coding style.
- Ensure accessibility best practices are followed in UI components.
- Use Next.js routing conventions for navigation.
- Maintain consistent styling using CSS modules as per the project's existing styles.

## Testing

- Use nested `describe` blocks for Given/When/Then structure (e.g., `describe('given that ...')` → `describe('when ...')` → `it('then ...')`).
- Each `it` should contain exactly one assertion.
- Avoid targeting elements by text; use stable selectors like `data-testid` instead.
