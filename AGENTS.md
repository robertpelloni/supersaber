# Agent Directives

## General Guidelines
- **Documentation is paramount**: Any structural changes, architectural decisions, or new features must be logged in `CHANGELOG.md`, `ROADMAP.md`, and `TODO.md`.
- **UI First**: Every backend change must have a corresponding, well-documented UI representation. Do not build hidden features.
- **A-Frame Strictness**: Adhere to the entity-component-system (ECS) architecture. Do not manipulate DOM elements directly for gameplay logic; write A-Frame components.
- **Verification**: Always test rendering via `npm run start` and verifying in browser output before committing.
- **Commit Format**: Prepend commit messages with `[vX.X.X]` matching the `CHANGELOG.md` version bump.

## Modifying Files
- Most HTML structure is in `src/index.html` and `src/templates/` (using Nunjucks). You must run the build step for these to appear in the final HTML.
- Component logic lives in `src/components/`. State logic is in `src/state/`.
