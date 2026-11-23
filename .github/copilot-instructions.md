# Copilot Instructions for DigiLive/mushroom-strategy

## Project context
- This repository is a TypeScript-based Home Assistant dashboard generation project.
- The codebase uses strict TypeScript settings and is bundled with webpack.
- Preserve the existing architecture under `src/` and follow the established naming and structure patterns.
- Prefer small, focused changes over broad refactors.

## Stack and constraints
- Use TypeScript instead of JavaScript when possible.
- Respect the project’s strict typing rules: no implicit any, no implicit returns, strict null checks, and consistent casing.
- Keep generated output compatible with Home Assistant dashboard/card configuration patterns.
- Reuse existing registry, card, utility, and configuration abstractions before introducing new patterns.
- Follow the repo’s linting and formatting setup (`eslint`, `prettier`, and project conventions).

## Coding standards
- Keep functions and classes small and readable.
- Use explicit types for config objects, cards, and generated output.
- Favor clear, domain-specific naming over generic names.
- Avoid dead code, unnecessary abstraction, and duplicated logic.
- Do not change behavior outside the scope of the task.
- Do not add console logging unless explicitly required for debugging or diagnostics.
- Do not introduce new dependencies unless the task clearly requires them.

## Home Assistant-specific guidance
- Before writing or modifying Home Assistant strategy, dashboard, or Mushroom card code, ALWAYS use the configured MCP tools to verify current APIs rather than guessing:
  - **Home Assistant Frontend documentation:** Use the `fetch` MCP tool (`fetch_markdown`) on `https://contributors.home-assistant.io/frontend/` (and its subpages).
  - **Home Assistant Frontend source code:** Use the `ha-frontend` MCP server tools (`search_frontend_code`, `search_frontend_documentation`, `fetch_frontend_documentation`) to inspect `dev/src` in `home-assistant/frontend`.
  - **Mushroom documentation & source code:** Use the `mushroom` MCP server tools (`search_lovelace_mushroom_code`, `search_lovelace_mushroom_documentation`, `fetch_lovelace_mushroom_documentation`) to inspect `docs` and `src` in `piitaya/lovelace-mushroom`.

- Keep generated dashboard YAML/config valid for Home Assistant and Mushroom card usage.
- Preserve compatibility with existing card structures and strategy configuration patterns.
- When working with registry or card definitions, follow the existing conventions already used in `src/cards`, `src/views`, and `src/utilities`.
- Do not break entity/device/area mapping logic or dashboard generation assumptions.

## Documentation and comments
- Keep comments concise, useful, and necessary.
- Add documentation only when it clarifies complex logic or public APIs.
- Follow existing project style and language conventions.

## Testing and validation
- Validate with the smallest relevant command after making changes.
- Prefer project checks such as:
  - `npm run build`
  - targeted linting or type validation if relevant
- If a change affects Markdown/docs, keep docs consistent with the existing project style and run the markdown checks when appropriate.

## Workflow
- Read the relevant files first before editing.
- Keep changes minimal and directly tied to the requested task.
- Ask for clarification when requirements are ambiguous or the correct behavior is not clear.
- Do not proceed with implementation without explicit user confirmation.
