# Development Journal

## 2026-01-08

### Project Kickoff

- **Goal:** Initialize AuraID workspace and infrastructure.
- **Aha! Moment:** Realized that a "Headless SDK" allows us to maintain a consistent security layer while giving the other UI full design freedom.

### Troubleshooting

- **Issue:** Port 5432 was already allocated by another project.
- **Solution:** Identified port conflict and decided to [stop the other service / remap to 5433].

## 2026-01-09

### Infrastructure Setup

**Goal**: Standardize TypeScript and ESLint across the monorepo using a shared configuration strategy.
**Aha! Moment**: Learned that ESLint v9 (Flat Config) works best with a "Centralized Root" strategy in monorepos. By keeping the Engine at the root and Plugins in the config package, we get full consistency with zero copy-pasting.
**Decision**: Adopted ES Modules (ESM) for all configuration files to ensure the entire stack (from tooling to apps) uses the same modern import/export syntax.

### Troubleshooting

**Issue**: TypeScript could not find @aura/typescript-config/server.json.
**Solution**: Identified that pnpm needs a pnpm install at the root to create symbolic links (symlinks) so apps can "see" local packages.
**Issue**: ESLint failed to find a config file because v9 no longer "climbs" the folder tree.
**Solution**: Created a root eslint.config.js to act as a router, delegating rules to specific app folders.
