# Cursor setup — okandemir.org

Copy `AGENTS.md` and `.cursor/rules/` into the root of the Git repository and commit them. Keep the existing project brief (for example `docs/okandemirorg_cursor_brief.md`) available to Cursor.

## Recommended workflow
1. Open the correct repository root in Cursor.
2. Ask Agent to read `AGENTS.md`, `.cursor/rules/`, and the project brief.
3. First request a repository discovery report only; no edits, package installs, migrations, or live actions.
4. Review the plan, then authorize one small phase.
5. Review the diff and test results before committing.
6. Approve production deployment separately.

## First Cursor prompt
Read `AGENTS.md` and `.cursor/rules/`. Perform repository discovery: inspect the actual file tree, `package.json` scripts, Next.js version, auth/session flow, MySQL connection and migration system, API routes, test infrastructure, and `n8n/` flows. In this turn do not edit files, install packages, run migrations, or perform live actions. Report current architecture, reusable pieces, security risks, actual file paths, and the first small implementation step. Do not assume unknown facts. Never read out or print secret values.

## Settings guidance
- Use a strong coding model available in your Cursor plan; model names and plan limits change, so don't hardcode a specific model.
- Prefer small diffs and staged changes over broad autonomous edits.
- Require approval for terminal commands that are destructive, production-impacting, migrations, or spend money.
- Don't add `.env`, private keys, database dumps, or customer data to prompts unnecessarily.
- Rules reduce risk but cannot guarantee error-free code: review diffs, run tests, and keep backups.
