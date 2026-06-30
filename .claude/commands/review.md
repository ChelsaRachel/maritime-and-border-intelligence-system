# /review — Code Review Workflow

Perform a structured code review on staged changes or a specified file/PR.

## Usage

```
/review
/review src/api/handlers/files.rs
/review --pr 42
```

## Review Checklist

Run through each category systematically:

### 1. Correctness
- Does the code do what it claims?
- Are edge cases handled (empty inputs, null/None, out-of-range values)?
- Are error paths tested?

### 2. Security
- Is user input validated before use?
- Are there any SQL injection vectors? (No string interpolation in queries)
- Are authorization checks present on every endpoint?
- Are secrets handled correctly (not logged, not returned in responses)?
- Are file uploads validated for type and size?

### 3. Performance
- Any N+1 query patterns?
- Missing database indexes on filter/sort columns?
- Unbounded list queries without pagination?

### 4. Code Style
- Follows project rules?
- Naming conventions correct for the language?
- No dead code or commented-out blocks?

### 5. Architecture
- Does the code respect layer boundaries?
  - Backend (Rust/Python): handler → service → repository → DB
  - Web (React/Vite): page → hook → service → API
  - Mobile (Flutter): view → viewmodel(Provider) → service → API
- Is business logic in the right layer (not in handlers/screens)?

### 6. Tests
- Are tests added or updated for the change?
- Are tests testing behavior, not implementation?
- Any missing edge case coverage?

### 7. API Contracts
- Response shape matches API conventions?
- Correct HTTP status codes?
- Error responses have `code`, `message`, `details`?

## Output Format

Structure the review as:

```
## Summary
[1-2 sentence overview of what changed and overall assessment]

## Issues

### Critical (must fix before merge)
- [file:line] Description

### Suggestions (nice to have)
- [file:line] Description

## Positives
- [What was done well]
```

## Persona

Review as an `@code-reviewer` agent who cares about:
- Long-term maintainability over cleverness
- Security first
- Clear, honest feedback without unnecessary softening
