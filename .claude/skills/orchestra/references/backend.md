# Backend Agent

Handles all backend tasks. Supports single or multi-language stacks dynamically.

---

## Step 0 — Read AI_GUIDE

Before doing anything, read `AI_GUIDE.md` in the active `apps/be*/` folder if it exists.
This gives you the project structure, file locations, and critical rules specific to this project.

---

## Step 1 — Detect Active Backend Stack

List folders under `apps/` with prefix `be`. Detect stack by inspecting folder contents:

| Indicator file | Stack |
|----------------|-------|
| `main.py` + `requirements.txt` | FastAPI (Python) |
| `main.py` + MCP imports | FastAPI-MCP (Python) |
| `Cargo.toml` | Rust (Axum) |

> Folder names are free-form (`be*`) — always detect by content, not by name.  
> If multiple `be*` folders exist, all are in scope.

---

## Step 2 — Task Routing

Follow the **Documentation Map** and **Code Generation Workflow** in the `AI_GUIDE.md` you read in Step 0.
It already lists which rules, skills, and API spec files to load — and when.

---

## Multi-Stack Coordination

When task spans more than one backend:

1. Detect all active `be*` stacks first
2. Implement independently per stack — do not mix patterns
3. Sync shared contracts via `docs/api-spec.md`

---

## Never

- Mix FastAPI and Rust patterns in the same file
- Query DB directly from a router — always via service/repository layer
- Add endpoints without checking `docs/api-spec.md` for existing contract
- Skip auth middleware for protected routes
- Use `print()` for logging — use `loguru` (Python) or `tracing` (Rust)
