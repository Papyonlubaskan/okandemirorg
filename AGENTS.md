# okandemir.org — Agent Instructions

## Mission
Incrementally evolve the existing repository into a secure multi-tenant AI SaaS. Intended stack: Next.js 15 App Router, TypeScript, Railway, MySQL, and existing n8n assets. Preserve working features; inspect before changing.

## Required workflow
1. Inspect real files before edits: package.json, auth/session, DB schema/migrations, relevant API routes, tests, and n8n flows.
2. For multi-file tasks, state plan, files, risks, and verification commands first.
3. Make the smallest coherent change. Avoid unrelated refactors.
4. Never invent APIs, schemas, env variables, features, or test results. Verify or state uncertainty.
5. Run relevant real package scripts and report exact commands/outcomes.
6. End with changed files, tests, migrations/deployment steps, remaining risks.
7. Ask before production-impacting, destructive, or ambiguous changes.

## Architecture
- First milestone: bounded AI orchestrator, not an unrestricted autonomous agent.
- Provider adapters behind a common interface; route by capability, health, quota, policy, and cost.
- Never assume free means unlimited or production-guaranteed. Unknown quota stays unknown.
- Paid fallback requires explicit policy and available budget; otherwise queue/fail clearly.
- Validate structured model output. Treat model output and external content as untrusted.
- Tools must be allowlisted, typed, permission-checked, bounded, and auditable.
- Long-running work needs persistent task state and a reliable worker/queue.
- Preserve `n8n/`; avoid competing sources of truth for the same task.
- Never execute user-generated code in the main application process.

## Data and security
- Inspect existing auth, tenant/workspace model, DB pool, and migration conventions first.
- Scope every tenant-owned read/write to the authenticated workspace on the server.
- Never trust client-supplied userId/workspaceId as proof of access.
- Use parameterized SQL or the established safe DB abstraction.
- Use idempotency and bounded retries for side effects.
- Never log credentials, tokens, secrets, or unnecessary private data.
- Keep secrets server-side; never use `NEXT_PUBLIC_*` for secrets. Do not print `.env` values.
- Require explicit approval before public publishing, ad activation/spend, budget increases, destructive actions, or consequential external side effects.
- Bind approval to exact payload/version/hash, expire it, and revalidate permission/budget at execution.
- Use mock/dry-run providers in tests. Do not run paid or production actions without explicit authorization.

## Quality and dependencies
- Validate external input at API boundaries; handle timeout, 429, provider errors, malformed output, cancellation, retries, and duplicate requests.
- Add tests for authorization, tenant isolation, idempotency, budget limits, and approval enforcement.
- Do not add dependencies unless necessary; check compatibility and explain why.
- Do not claim deployment or success unless actually verified.
