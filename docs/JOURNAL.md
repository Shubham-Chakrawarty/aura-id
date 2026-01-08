# Development Journal

## 2026-01-08

### Project Kickoff

- **Goal:** Initialize AuraID workspace and infrastructure.
- **Aha! Moment:** Realized that a "Headless SDK" allows us to maintain a consistent security layer while giving the other UI full design freedom.

### Troubleshooting

- **Issue:** Port 5432 was already allocated by another project.
- **Solution:** Identified port conflict and decided to [stop the other service / remap to 5433].
