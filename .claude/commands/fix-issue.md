# /fix-issue — GitHub Issue Fixer

End-to-end workflow for investigating and fixing a GitHub issue.

## Usage

```
/fix-issue #123
/fix-issue https://github.com/org/vibe-fs/issues/123
```

## Workflow

### Step 1 — Understand the issue

Read the issue carefully:
- What is the reported behavior?
- What is the expected behavior?
- Are there reproduction steps?
- Any attached logs, screenshots, or error messages?

Ask clarifying questions if reproduction steps are missing or ambiguous.

### Step 2 — Reproduce locally

```bash
# Start backend (Rust or Python)
cd backend && cargo run   # OR python main.py

# Reproduce the reported behavior
# Log the exact error response or behavior observed
```

If it cannot be reproduced, comment on the issue with findings before proceeding.

### Step 3 — Locate the root cause

1. Search the codebase for the relevant handler/service/component.
2. Read the code path from the entry point to where the failure occurs.
3. Check recent git history for related changes: `git log --oneline -20 -- <file>`

### Step 4 — Fix

- Make the minimal change that fixes the root cause.
- Do not refactor surrounding code as part of the fix.
- If the fix touches a security-sensitive area, note it for review.

### Step 5 — Add a test

Write a test that:
- Reproduces the original bug (fails before fix, passes after).
- Is named after the scenario: `test_upload_fails_when_size_exceeds_limit`.

### Step 6 — Verify

```bash
# Backend
cargo test     # Rust
pytest         # Python

# Web
npm run test

# Mobile
flutter test
```

### Step 7 — Commit

```bash
git add <changed files>
git commit -m "fix: <concise description of what was fixed>

Closes #<issue-number>"
```

### Step 8 — PR

- Title: `fix: <same as commit message>`
- Body: reference the issue, describe root cause, describe the fix, include test evidence.
- Request review from the relevant code owner.

## Common Issue Types

| Symptom                     | Likely location           |
|-----------------------------|---------------------------|
| Wrong HTTP status code      | `api/handlers/`           |
| Missing auth check          | `middleware/` or handler  |
| Wrong data returned         | `domain/services/`        |
| DB query incorrect          | `repository/`             |
| Validation not triggered    | DTO / Pydantic models     |
| Frontend shows stale data   | Next.js Cache / React Query|
| Mobile screen blank on error| ViewModel/Provider error state |
