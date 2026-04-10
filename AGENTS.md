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

## Release and Versioning Protocol
- **Versioning**: Every new build must increment the version number.
- **Global Version Source**: The project version is strictly sourced from `VERSION.md`. This is the single source of truth for the version number.
- **Changelog**: You must update `CHANGELOG.md` with every build, detailing what was added, changed, or fixed.
- **Commits**: Ensure the version number bump (e.g., `[v1.1.1]`) is prominently referenced in the git commit message when committing a version update.
