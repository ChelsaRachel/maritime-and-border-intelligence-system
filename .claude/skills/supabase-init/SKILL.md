---
name: supabase-init
description: "Bring up sandbox-level self-hosted Supabase via Docker. Generates fresh secrets, starts the stack, and emits credentials.env that the project's BE (`<cwd>/apps/be/`), specialist agents (`<cwd>/apps/agents/<role>/`), and supabase-db MCP (`<cwd>/apps/mcp/supabase-db/`) all consume. One-time per sandbox; idempotent re-runs detect a running stack."
---

# supabase-init — sandbox Supabase bring-up

## Use this skill when

- Setting up a fresh sandbox before the first MVP project is scaffolded
- `<sandbox>/.supabase/credentials.env` is missing, stale, or `bootstrap-project` reports it as a missing precondition
- You need to rotate Supabase secrets (`--force`) — typically because keys leaked or the stack was wiped
- A new project's BE (`<cwd>/apps/be/`) or a specialist agent (`<cwd>/apps/agents/<role>/`) is scaffolded and needs to source the canonical `SUPABASE_*` envs

## Patterns (do this)

| Pattern | How |
| --- | --- |
| First-time bring-up | `python skills/supabase-init/scripts/init.py` from sandbox root |
| Idempotent re-run | Re-running `init.py` against a healthy stack only re-emits `credentials.env` (no key rotation) |
| Source credentials in a project | Add `source $(realpath ../../../../.supabase/credentials.env)` at the top of `<cwd>/apps/be/.env` (BE) or `<cwd>/apps/agents/<role>/.env` (agent specialist) |
| Stop without losing data | `python skills/supabase-init/scripts/teardown.py` |
| Re-emit credentials after deletion | `python skills/supabase-init/scripts/print_env.py` |
| One-shot shell sourcing | `eval "$(python skills/supabase-init/scripts/print_env.py --stdout)"` |
| Verify stack health | `cd <sandbox>/.supabase/docker && docker compose ps` (every row should be `Up (healthy)`) |
| Studio / Dashboard access | Open `SUPABASE_STUDIO_URL` (= `SUPABASE_URL`) in a browser; HTTP-auth user/pwd in `credentials.env` |

## Anti-patterns (don't do this)

| Anti-pattern | Why / use instead |
| --- | --- |
| Boot the stack with the shipped demo `ANON_KEY`/`SERVICE_ROLE_KEY` | They're public — `init.py` rotates them on first run; never skip rotation |
| Hand-edit `<sandbox>/.supabase/docker/.env` | `init.py` is the SSOT; manual edits drift from `credentials.env`. Use `--force` to regenerate instead |
| Commit `<sandbox>/.supabase/` | Contains live secrets and the Postgres datadir — must be gitignored |
| Run multiple sandboxes' stacks on the same host with default ports | Edit `KONG_HTTP_PORT` / `POSTGRES_PORT` in `docker/.env` before bring-up |
| `--wipe` without intent | Drops all rows + storage objects; only use when you intend to start fresh |
| Read keys directly from `docker/.env` in app code | Read from `<sandbox>/.supabase/credentials.env` — it's the cross-project contract |
| Skip the precondition check in `bootstrap-project` | If `credentials.env` is missing, surface it and run `supabase-init` first; don't silently fall back |

## Prerequisites

- Docker Engine + `docker compose` v2 plugin (`docker compose version` succeeds)
- `git` (sparse-checkout supported — git ≥ 2.25)
- Python 3.10+ (stdlib only; no PyJWT / no extra deps)
- Free TCP ports `8000` (Kong API + Studio) and `5432` (Postgres)

## Workflow

```sh
# 1. From sandbox root.
python skills/supabase-init/scripts/init.py

# Output (truncated):
#   ✓ prerequisites OK (docker, docker compose, git)
#   → fetching supabase/supabase docker subtree …
#   ✓ docker/ subtree placed at <sandbox>/.supabase/docker
#   ✓ rotated 13 secrets in <sandbox>/.supabase/docker/.env
#   $ docker compose pull
#   $ docker compose up -d
#   → waiting for http://127.0.0.1:8000/rest/v1/ …
#   ✓ PostgREST responded 200
#   ✓ wrote <sandbox>/.supabase/credentials.env
#
# 2. The first run pulls ~3 GB of images and is the slow part (2–5 min).
#    Subsequent runs against a healthy stack are instant.
#
# 3. Per-project .env files source credentials.env or copy values verbatim:
#    <cwd>/apps/be/.env                    →  source ../../../../.supabase/credentials.env
#    <cwd>/apps/agents/<role>/.env         →  same (specialists that need DB access)
```

## Outputs (the cross-project contract)

`<sandbox>/.supabase/credentials.env` contains exactly these keys — every
downstream consumer (`<cwd>/apps/be/.env`, `<cwd>/apps/agents/<role>/.env`,
`<cwd>/apps/mcp/supabase-db/` config) reads them under these names:

```
SUPABASE_URL=http://127.0.0.1:8000
SUPABASE_ANON_KEY=<HS256 JWT, role=anon, signed with SUPABASE_JWT_SECRET>
SUPABASE_SERVICE_ROLE_KEY=<HS256 JWT, role=service_role, signed with SUPABASE_JWT_SECRET>
SUPABASE_JWT_SECRET=<the secret used to sign both keys>
SUPABASE_DB_URL=postgres://postgres:<POSTGRES_PASSWORD>@127.0.0.1:5432/postgres
SUPABASE_STUDIO_URL=http://127.0.0.1:8000
SUPABASE_DASHBOARD_USERNAME=supabase
SUPABASE_DASHBOARD_PASSWORD=<DASHBOARD_PASSWORD>
```

## Common operations

| Goal | Command |
| --- | --- |
| First-time bring-up | `python skills/supabase-init/scripts/init.py` |
| Re-emit `credentials.env` only | `python skills/supabase-init/scripts/init.py` (idempotent) |
| Force-rotate all secrets | `python skills/supabase-init/scripts/init.py --force` |
| Stop, keep data | `python skills/supabase-init/scripts/teardown.py` |
| Stop, drop volumes (data lost) | `python skills/supabase-init/scripts/teardown.py --wipe` |
| Full reset (delete `.supabase/`) | `python skills/supabase-init/scripts/teardown.py --remove-stack` |
| Re-emit credentials only | `python skills/supabase-init/scripts/print_env.py` |
| Stream env to shell | `eval "$(python skills/supabase-init/scripts/print_env.py --stdout)"` |

## Resumption (multi-session)

A new session detects state via `docker compose ps` inside
`<sandbox>/.supabase/docker/`. Decision tree:

- **`docker/.env` missing** → run `init.py` from scratch
- **`docker/.env` present but stack stopped** → run `init.py` (will skip secret rotation, just `compose up -d` + emit credentials)
- **stack healthy but `credentials.env` missing** → `print_env.py`
- **stack healthy AND `credentials.env` present** → no-op; you're done

## Layout (post-execution)

```
<sandbox>/
├── .supabase/                       ← gitignored; per-sandbox infra
│   ├── docker/                      ← cloned subset of supabase/supabase
│   │   ├── docker-compose.yml
│   │   ├── .env                     ← rotated secrets (NEVER commit)
│   │   ├── .env.example             ← upstream template
│   │   └── volumes/                 ← Postgres datadir, storage objects
│   └── credentials.env              ← downstream consumers source this
└── skills/supabase-init/
    ├── SKILL.md
    ├── scripts/
    │   ├── init.py                  ← bring up + emit credentials
    │   ├── teardown.py              ← stop / wipe / remove
    │   └── print_env.py             ← re-emit from a running stack
    └── references/
        └── docker-setup.md          ← distilled official docs + gotchas
```

## See also

- [`references/docker-setup.md`](references/docker-setup.md) — verbatim
  reference for the upstream bring-up flow, secret-generation algorithm, port
  layout, volume layout, and the gotchas the script handles automatically.
- Upstream docs: <https://supabase.com/docs/guides/self-hosting/docker>
- Upstream key generator (mirrored by `init.py`):
  <https://github.com/supabase/supabase/blob/master/docker/utils/generate-keys.sh>
