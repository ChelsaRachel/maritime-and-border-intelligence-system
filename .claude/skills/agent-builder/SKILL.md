---
name: agent-builder
description: Build a standalone Python agent (LLM + Agno + OpenRouter) that exposes itself as an MCP server, lives at `<cwd>/apps/agents/<role>/`, and joins the project's MCPHub group. Picks the right variant for the use case — tool-calling (agentic crawler / deep analysis), structured-output (single-shot Pydantic response), or multimodal (image/video/audio inputs). Other agents (including an orchestrator) reach this agent uniformly via the project group, never via direct Python imports. Use when the user asks to add an agent, an agentic workflow, an "AI tool" — anything LLM-driven that the rest of the system should be able to call. Triggers: "buatkan agent", "add an Agno agent", "create an agentic crawler", "extract structured data from text", "agent yang trigger via webhook", "agent yang dipanggil dari tombol", "image classifier agent", "multimodal agent", "build an orchestrator".
---

# Agent Builder

Build standalone Python agents. Each agent is its own project at `<cwd>/apps/agents/<role>/`, scaffolded from the `agent-python/` boilerplate, running an Agno LLM agent under a thin FastMCP wrapper. To the rest of the system (be-python's API endpoints, other agents, an orchestrator), every agent looks like just another tool in the project's MCPHub group.

> **Agents are NOT inside `<cwd>/apps/be/`.** They are sibling projects under `<cwd>/apps/agents/`. The be-python backend that needs an agent's output calls it via the project's MCPHub group, the same way it would call any other MCP tool. The agent management plane (registry/scheduler/run-log) lives **inside be-python** as the mandatory `/agent-mgmt/*` router — there is no separate be-agent service.

> **Boilerplate.** This skill scaffolds from [`boilerplates/agent-python/`](../../boilerplates/agent-python/), which already ships with `agent.py` (MCPTools + FileTools wired), `server.py` (FastMCP wrapper), `memory/` placeholders, and four domain skills (`agent-design`, `memory-conventions`, `tools-wiring`, `mcp-export`). The historical bring-up plan is at [`0-agent-architecture-plan.md`](../../0-agent-architecture-plan.md) — keep it for context, but the boilerplate is the source of truth.

## When to use

An "agent" is any unit that:
- Calls an LLM with prompts + tools / structured schema / multimodal input.
- Is invoked by something — a button, a webhook, another agent, or a backend route handler.
- Produces a structured artefact (JSON/Pydantic, text, table, file).

Don't reach for this skill if the task is pure CRUD or pure data-transform — that's regular Python (or a non-LLM MCP via [`mcp-builder`](../mcp-builder/SKILL.md)). Reach for it when an LLM is genuinely the right tool.

## Variant selection

| Use case                                                              | Variant            | Model                          | Reference                                    |
| --------------------------------------------------------------------- | ------------------ | ------------------------------ | -------------------------------------------- |
| Multi-step agent that calls tools (crawl URL, query DB, look up API)  | `tool-calling`     | `z-ai/glm-4.7:nitro`           | [references/tool-calling.md](references/tool-calling.md)         |
| Single-shot structured extraction (text in → Pydantic out)            | `structured-output`| `openai/gpt-oss-120b:nitro`    | [references/structured-output.md](references/structured-output.md) |
| Inputs include an image, video frame, or audio                        | `multimodal`       | `google/gemini-2.5-flash-lite` | [references/multimodal.md](references/multimodal.md)             |

If the task spans two variants (e.g. multimodal input + structured output), default to multimodal and give it an `output_schema`. If the task spans tool-calling + structured output, default to tool-calling and have the final tool return the structured artefact.

## Tool connectivity — MCP-first via the project group (mandatory)

**All agent tools come from MCP servers, and each project gets its own MCPHub group.** Don't write ad-hoc `@tool`-decorated Python functions for anything that does I/O (HTTP fetch, DB query, API call, file read), and don't connect agents to the hub-wide `/mcp` or to individual `/mcp/{server}` endpoints.

- **Group = one project's tool namespace.** Every agent in the project sees only the tools that project actually needs — no cross-project tool noise.
- **Reusable inside the group.** Existing hub servers (web search, Indonesian datasets, etc.) are *added* to the project group; custom MCPs the project builds (including other agents in `agents/`) are also added to the same group. The agent's URL never changes.
- **Auth, rate-limiting, schemas, error shaping** live in the MCP server, not in the agent.

### Env vars (set per agent project)

```bash
export MCP_HUB_URL=http://<host>:<port>          # the team's MCPHub instance
export MCP_HUB_API_KEY=<long-lived-token>        # Bearer token for MCPHub API + /mcp endpoints
export MCP_HUB_GROUP=<slug>                      # the project's group (the snake_case slug from <cwd>/brief/)
```

Persist these in `<cwd>/apps/agents/<role>/.env` and document them in `<cwd>/apps/agents/<role>/.env.example`.

Auth header on every MCPHub request: `Authorization: Bearer $MCP_HUB_API_KEY`. Docs: <https://docs.mcphub.app/>.

### The flow at runtime

Each agent connects to **one URL**: `${MCP_HUB_URL}/mcp/${MCP_HUB_GROUP}`. The hub aggregates every server in that group into a single streamable-HTTP session. The agent doesn't know or care whether a tool comes from `brave-search`, an Indonesian-law server, the project's own `supabase-db`, or a sibling agent in `agents/` — they all show up as tools in the same session.

```python
import os
from agno.agent import Agent
from agno.models.openrouter import OpenRouter
from agno.tools.mcp import MCPTools

async def run(input: str) -> str:
    async with MCPTools(
        transport="streamable-http",
        url=f"{os.environ['MCP_HUB_URL']}/mcp/{os.environ['MCP_HUB_GROUP']}",
        client_params=dict(headers={"Authorization": f"Bearer {os.environ['MCP_HUB_API_KEY']}"}),
    ) as mcp:
        agent = Agent(
            model=OpenRouter(id="z-ai/glm-4.7:nitro"),
            tools=[mcp],
            instructions=["..."],
        )
        return (await agent.arun(input)).content
```

The session is opened per call and closed by the `async with`. Don't cache the `Agent` globally — MCPTools sessions don't survive across requests. The full pattern (FileTools wiring, large-group fallbacks) is in [references/tool-calling.md](references/tool-calling.md).

### Multi-session resumption

A new session can check whether group setup has already run by listing the hub's groups: `curl -sS -H "Authorization: Bearer $MCP_HUB_API_KEY" "$MCP_HUB_URL/api/groups" | grep "\"name\": *\"$MCP_HUB_GROUP\""`. If the group exists, skip Step 0 and go straight to building agents. If not, run Step 0.

### Step 0 — Provision the project group (one-time per project)

The project group is created **once**, the first time agent work begins on the project. After that, every existing hub server the project needs is added to the group, and any custom MCPs (including other agents) are added to the same group. Agents themselves never call the MCPHub admin API at runtime — only this setup step does.

`bootstrap-project` does **not** do this — it focuses on FE/BE app scaffolding only. Agent development is a parallel stream and owns its own setup.

#### Step 0a — Pick the group name

Convention: the group name is the **project slug** (the snake_case canonical project ID derived by `brief-builder`). One slug = one group, regardless of how many agents the project has. The slug is **not** the folder name (folder is fixed `<cwd>/`); it's the logical identifier passed via the `MCP_HUB_GROUP` env var.

#### Step 0b — Create the group (idempotent-safe)

```bash
GROUP="$MCP_HUB_GROUP"
curl -sS -X POST "$MCP_HUB_URL/api/groups" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $MCP_HUB_API_KEY" \
  -d "{\"name\":\"$GROUP\",\"description\":\"Tools for $GROUP agents\",\"servers\":[]}"
```

If the group already exists the API returns an error — fine, move on.

#### Step 0c — Populate with existing hub servers

Inventory what the hub offers. Page through if the hub has > 100 servers:

```bash
PAGE=1
while :; do
  RESP=$(curl -sS -H "Authorization: Bearer $MCP_HUB_API_KEY" \
    "$MCP_HUB_URL/api/servers?page=$PAGE&limit=100")
  echo "$RESP"
  COUNT=$(echo "$RESP" | python -c "import json,sys; print(len(json.load(sys.stdin).get('data',[])))")
  [ "$COUNT" -lt 100 ] && break
  PAGE=$((PAGE+1))
done
```

From the response, pick the servers the project's agents need based on the brief and the sprint backlog. Almost every project needs at least one web-search/fetch server (e.g. `brave`); MVPs touching Indonesian data typically also want `bps`, `bmkg`, `idx`, `indonesian-law`, etc. — but only add what the brief actually justifies.

```bash
for SERVER in brave bps; do
  curl -sS -X POST "$MCP_HUB_URL/api/groups/$GROUP/servers" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $MCP_HUB_API_KEY" \
    -d "{\"serverId\":\"$SERVER\"}"
done
```

#### Step 0d — Note any gaps

For every capability the project needs but no existing hub server covers, file a task under `sprint/backlog/<sprint>/mcp/` (per [`sprint-builder`](../sprint-builder/SKILL.md)). When that MCP gets built via [`mcp-builder`](../mcp-builder/SKILL.md), it registers itself **and** adds itself to `$MCP_HUB_GROUP` automatically.

After Step 0, every agent in the project just connects to `${MCP_HUB_URL}/mcp/${MCP_HUB_GROUP}` — the runtime URL never changes as the group grows.

#### Step 0e — Ensure be-python's `agent_mgmt` router enabled + migration applied

> **be-python = service layer for the agents workforce.** The agent management plane (registry, runs, schedules, webhooks, DLQ) is part of be-python as the mandatory `/agent-mgmt/*` router. There is no separate be-agent service. See [`boilerplates/be-python/skills/agent-mgmt/SKILL.md`](../../boilerplates/be-python/skills/agent-mgmt/SKILL.md).

Pre-requisite: be-python is already scaffolded at `<cwd>/apps/be/` (via `bootstrap-project`). Supabase is running per [`supabase-init`](../supabase-init/SKILL.md). `<sandbox>/.supabase/credentials.env` exists with `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_DB_URL`.

Run from sandbox root (cwd containing `<cwd>/`):

```bash
# 1. Verify be-python ships with agent_mgmt router (default in the boilerplate)
grep -q '"agent_mgmt"' <cwd>/apps/be/api.py || {
  echo "ERROR: be-python is missing the agent_mgmt router. Re-scaffold from boilerplates/be-python."
  exit 1
}

# 2. Verify migration 0008 exists (ships with be-python boilerplate)
[ -f <cwd>/apps/be/supabase/migrations/0008_agent_mgmt.sql ] || {
  echo "ERROR: migration 0008_agent_mgmt.sql missing. Re-scaffold be-python."
  exit 1
}

# 3. Apply migration (idempotent — uses `create table if not exists`)
psql "$SUPABASE_DB_URL" -f <cwd>/apps/be/supabase/migrations/0008_agent_mgmt.sql

# 4. Wire .env: ensure INTERNAL_API_TOKEN + MCP_HUB_* + Supabase populated
#    (Use python script to read/write .env files — Bash blocked from .env*)
python -c "
import os, secrets
p = '<cwd>/apps/be/.env'
if not os.path.exists(p): open(p, 'w').write(open('<cwd>/apps/be/.env.example').read())
s = open(p).read()
if 'replace_me_with_long_random_secret' in s:
    token = secrets.token_urlsafe(48)
    s = s.replace('replace_me_with_long_random_secret_for_internal_callers', token)
    open(p, 'w').write(s)
    print(f'Generated INTERNAL_API_TOKEN ({len(token)} chars) in {p}')
"

# 5. Start be-python (foreground OR via deploy mechanism)
cd <cwd>/apps/be
python api.py &  # → http://localhost:8020 (mandatory: agent_mgmt + scheduler tick loop)

# 6. Verify
sleep 2
curl -fsS http://localhost:8020/agent-mgmt/healthz | grep -q '"ok": true' \
  && echo "agent_mgmt OK" \
  || echo "ERROR: agent_mgmt healthz failed — check be-python logs"
```

What be-python (port 8020) provides for every agent in the project:
- `POST /agent-mgmt/agents` — register agent slug + MCP URL (Step 5b below).
- `POST /agent-mgmt/agent-runs` + `PATCH /agent-mgmt/agent-runs/{id}` — run logging contract (used by `agent-python`'s `_runs.py` helper).
- `POST /agent-mgmt/agent-schedules` — cron triggers fired by scheduler tick loop di lifespan task.
- `POST /agent-mgmt/agent-webhooks` + `POST /agent-mgmt/webhooks/{path}` — signed webhook intake (HMAC-SHA256).
- `GET /agent-mgmt/dlq` — dead-letter queue (read by monitor agent).
- **Autonomy infrastructure (built into 0008 schema)**: `agents.max_retries` + `retry_backoff_seconds` (transient-failure retry), `agents.escalation_agent_id` (fanout to notifier on non-recoverable failure), `agent_runs.metrics` (business telemetry), `agent_runs.attempt` + `parent_run_id` (retry chain), `agent_runs.escalated_at`, `agent_dlq` (DLQ for failed invocations).
- **Auth gate**: JWT admin role OR `X-Internal-Token` header — agent-python `_runs.py` uses the header, FE admin uses JWT.

#### Step 0f — Provision companion ops-layer agents (mandatory if brief Workforce Manifest contains the ops triple)

**Axiom "no human maintainer":** apps run via agents — failure detection, output QA, and alert routing must all be agent-driven. brief-builder Phase 4.5 proposes the ops-layer triple (`monitor` + `validator` + `notifier`) as the default workforce for any app with pipelines, external data, or scheduled jobs. agent-builder executes this triple as companion provisioning **before** scaffolding domain agents (crawler, analyzer, etc.).

**How to check the brief:**

```bash
# Workforce Manifest section in the brief
grep -E "^\| \`(monitor|validator|notifier)\`" "<cwd>/brief/00_OVERVIEW.md"
```

If one or more of the triple is present → scaffold them FIRST (within sprint `00-workforce-scaffold` per [`sprint-builder`](../sprint-builder/SKILL.md#sprint-00--workforce-scaffold-mandatory-if-brief-workforce-includes-agents)). Example sequence:

1. `<cwd>/apps/agents/pm/` — Orchestrator (standard Steps 1-5).
2. `<cwd>/apps/agents/monitor/` — Monitoring variant `tool-calling`. Skill `health-rules`. Schedule `*/5 * * * *` in `agent_schedules`. Reads `agent_runs` + `agent_dlq` via the `supabase-db` MCP or direct call to `/agent-mgmt/dlq`, classifies state, escalates via project-group call to `notifier`.
3. `<cwd>/apps/agents/validator/` — Validation/Guardrail variant `structured-output`. Skill `output-rules`. Triggered by event (post-domain-agent run). Output: `{verdict: "verified"|"rejected", reason: ...}`. On reject → calls notifier + writes an `agent_dlq` row via `/agent-mgmt/dlq` (admin-token).
4. `<cwd>/apps/agents/notifier/` — Notification variant `tool-calling`. Skill `alert-routing`. Tools: `smtp` MCP / `slack-webhook` MCP / etc. Triggered orchestrated (called by monitor / validator).

After the triple is registered at be-python's `/agent-mgmt/agents`, **set `escalation_agent_id` on each domain agent** to point at notifier:

```bash
INTERNAL_TOKEN=$(grep INTERNAL_API_TOKEN <cwd>/apps/be/.env | cut -d= -f2)
BASE="http://localhost:${BE_PORT:-8020}/agent-mgmt"

# Get notifier agent_id (response wrapped di BaseResponse — extract .data)
NOTIFIER_ID=$(curl -sS -H "X-Internal-Token: $INTERNAL_TOKEN" "$BASE/agents" \
  | python -c "import json,sys; r=json.load(sys.stdin)['data']; print(next(a['id'] for a in r if a['slug'].endswith('notifier')))")

# Upsert crawler agent with escalation pointing to notifier
curl -sS -X POST "$BASE/agents" \
  -H "Content-Type: application/json" \
  -H "X-Internal-Token: $INTERNAL_TOKEN" \
  -d "{\"slug\":\"$SLUG_crawler\",\"escalation_agent_id\":\"$NOTIFIER_ID\",\"max_retries\":3,\"retry_backoff_seconds\":5}"
```

Effect: if crawler fails with a transient error, be-python retries 3x with exponential backoff (5s, 10s, 20s); if retries are exhausted or the error is non-transient, be-python inserts into `agent_dlq` + fires notifier with the event payload (see `fire_agent` + `_escalate` in [`boilerplates/be-python/service/agent_mgmt.py`](../../boilerplates/be-python/service/agent_mgmt.py)).

**Refusal:** if the brief Workforce Manifest has pipelines / scheduled jobs / external data but **does NOT** include the ops triple, agent-builder must **block** the scaffold of any domain agent and ask the user to return to brief-builder Phase 4.5 to add the triple — or to explicitly declare "POC, no autonomous ops" in the Blind Spot Review. Without the triple, the app cannot auto-recover from failure, which violates the Argus mindset.

### When you need finer-grained tool surfaces

Switch from `/mcp/{group}` to `${MCP_HUB_URL}/mcp/$smart/${MCP_HUB_GROUP}` when **either** holds:
- The project group has **> 8 servers** (the model-spec sheet starts dominating the prompt).
- You've measured a **wrong-tool-call rate > 20%** over a 50-call sample on the un-smart group.

Vector-based smart routing exposes only the tools the hub thinks are relevant per call — same group, smaller per-call surface. The full table:

| Path                              | Use                                                        |
| --------------------------------- | ---------------------------------------------------------- |
| `/mcp/{group}`                    | **Default for every agent** — all of the project's tools  |
| `/mcp/$smart/{group}`             | Smart routing within the group (large group, narrow agent) |
| `/mcp/{server}`                   | Single server — only when bypassing the group is justified |
| `/mcp/$smart`                     | Hub-wide smart routing — avoid: leaks tools across projects |
| `/mcp`                            | Hub-wide unified — avoid                                   |

## OpenRouter setup (shared across all variants)

One env var required, one optional:

```bash
export OPENROUTER_API_KEY=sk-or-v1-...                  # required
export OPENROUTER_BASE_URL=https://openrouter.ai/api/v1 # optional; only when proxying through a gateway
```

Agno's `OpenRouter(id=...)` reads `OPENROUTER_API_KEY` automatically. The base URL is **not** auto-read — pass it explicitly when the env var is set:

```python
import os
from agno.agent import Agent
from agno.models.openrouter import OpenRouter

base_url = os.environ.get("OPENROUTER_BASE_URL")  # None if unset → Agno default
model_kwargs = {"id": "z-ai/glm-4.7:nitro"}
if base_url:
    model_kwargs["base_url"] = base_url

agent = Agent(model=OpenRouter(**model_kwargs))   # tool-calling
# (use openai/gpt-oss-120b:nitro for structured-output, google/gemini-2.5-flash-lite for multimodal)
```

Pin the model ID per variant — don't make it configurable, the choice IS the variant.

The `:nitro` suffix on OpenRouter routes the request to the premium-throughput tier. Keep it for `z-ai/glm-4.7` and `openai/gpt-oss-120b`; the multimodal Gemini model does not need it.

## Agent project layout (from `agent-python/` boilerplate)

Each agent is its own project at `<cwd>/apps/agents/<role>/`. Scaffold via the bundled init script (see Step 1 below) and move the result into the per-role folder.

```
<cwd>/apps/agents/<role>/
├── AI_GUIDE.md                ← Skills Index format (project contract)
├── agent.py                 ← the Agno agent (model, prompt, tools, run())
├── server.py                ← FastMCP wrapper exposing agent.run as one MCP tool
├── memory/                  ← agent's own memory dir (FileTools scoped here)
│   ├── state.json           ← machine-readable state (last_run, cursors, counters)
│   ├── notes.md             ← human-readable running notes
│   └── runs/<YYYY-MM-DD-HHMMSS>.md   ← per-run summary
├── pyproject.toml           ← agno, fastmcp, httpx, dotenv (+ optional supabase / session-db)
├── .env.example             ← OPENROUTER_API_KEY, MCP_HUB_*, optional SUPABASE_*
├── .gitignore
├── README.md
└── skills/                  ← per-domain skills shipped by the boilerplate
    ├── agent-design/        ← variant choice, prompt phrasing, code-exec opt-ins
    ├── memory-conventions/  ← state.json shape, notes.md, runs/<ts>.md format
    ├── tools-wiring/        ← decision tree: built-in / @tool / MCP / project group
    └── mcp-export/          ← FastMCP wrapper, MCPHub registration
```

> No `Dockerfile` in the boilerplate — containerization is an orchestration concern handled per-deployment, not bundled into the scaffold (consistent with `be-python/` and `web-reactjs/`).

**One agent per `<cwd>/apps/agents/<role>/` project.** Each project deploys as one MCP server. Two specialists = two projects.

### How an agent becomes an MCP

`server.py` is a thin FastMCP wrapper around `agent.py`'s `run()`. It exposes one MCP tool — also called `run` — that takes the agent's input and returns its output:

```python
# <cwd>/apps/agents/<role>/server.py
import os
from fastmcp import FastMCP
from agent import run as _agent_run

mcp = FastMCP(
    name="<slug>_<role>",
    instructions="<one paragraph: what this agent does, when to call it>",
)

@mcp.tool
async def run(input: str) -> str:
    """<one line: what this agent expects and returns>"""
    return await _agent_run(input)

if __name__ == "__main__":
    mcp.run(transport="http",
            host=os.environ.get("MCP_HOST", "0.0.0.0"),
            port=int(os.environ.get("MCP_PORT", "8000")))
```

After registration with MCPHub (see below), the rest of the system calls this agent the same way it calls any other MCP tool. No HTTP/JSON glue, no bespoke clients.

## Skeleton: `agent.py`

The `agent-python/` boilerplate ships this file pre-wired with `MCPTools` (project group) + `FileTools(base_dir=./memory)`. The shape below mirrors what gets scaffolded; copy it only when working outside the boilerplate.

```python
# <cwd>/apps/agents/<role>/agent.py
import os
from pathlib import Path
from agno.agent import Agent
from agno.models.openrouter import OpenRouter
from agno.tools.file import FileTools
from agno.tools.mcp import MCPTools

MODEL_ID = "z-ai/glm-4.7:nitro"   # variant choice — pin per scaffold, never env-driven
MEMORY_DIR = Path(__file__).parent / "memory"

def _model_kwargs() -> dict:
    kwargs: dict = {"id": MODEL_ID}
    base_url = os.environ.get("OPENROUTER_BASE_URL")
    if base_url:
        kwargs["base_url"] = base_url
    return kwargs

async def run(input: str) -> str:
    """Public entry point. Called by server.py and the __main__ block below.

    Each call opens a fresh MCPTools session via `async with` and closes it
    cleanly. Don't cache the Agent globally — MCPTools sessions don't survive
    across requests in production.
    """
    mcp_url = f"{os.environ['MCP_HUB_URL']}/mcp/{os.environ['MCP_HUB_GROUP']}"
    auth = {"Authorization": f"Bearer {os.environ['MCP_HUB_API_KEY']}"}

    async with MCPTools(
        transport="streamable-http",
        url=mcp_url,
        client_params=dict(headers=auth),
    ) as mcp:
        agent = Agent(
            model=OpenRouter(**_model_kwargs()),
            tools=[mcp, FileTools(base_dir=MEMORY_DIR)],
            description="<one-line role>",
            instructions=[
                "Step 1 of the procedure.",
                "Step 2 of the procedure.",
            ],
            # output_schema=...   # structured-output variant only
        )
        response = await agent.arun(input)
        return response.content   # or .output_schema, .images, depending on variant

if __name__ == "__main__":
    import asyncio, sys
    print(asyncio.run(run(" ".join(sys.argv[1:]) or "ping")))
```

The exact body for each variant is in the variant references — copy from there. The `__main__` block lets you ad-hoc run the agent without spinning up the FastMCP server: `OPENROUTER_API_KEY=… MCP_HUB_URL=… MCP_HUB_API_KEY=… MCP_HUB_GROUP=<slug> python agent.py "<input>"`.

### Optional opt-ins (commented in the boilerplate's `agent.py`)

| Opt-in | When to enable | What to add |
|---|---|---|
| Code execution | Agent needs to run Python / shell code on **trusted** input | `from agno.tools.python import PythonTools; from agno.tools.shell import ShellTools`. Append `PythonTools(pip_install=False)` and/or `ShellTools()` to `tools=[…]`. **In-process — no sandbox.** For untrusted code, wrap with a project-level sandbox (DockerSandbox / E2B / Daytona) — that's per-project wiring, not a boilerplate concern. |
| Session memory | Multi-turn conversations (typical for orchestrators, rare for one-shot specialists) | `from agno.db.sqlite import SqliteDb` + `db=SqliteDb(...)` on the `Agent`. Install via `pip install -e ".[session-db]"`. |
| Supabase CRUD | Agent reads/writes the project DB | **Don't** import `supabase-py` directly. Add `mcp/supabase-db/` to the project group; the agent picks it up via the existing MCPTools session. Install via `pip install -e ".[supabase]"` only if a non-MCP path is genuinely required. |

> **Task-vs-code split:** the task file at `<cwd>/sprint/backlog/<sprint>/agent/01-foo.md` (per [`sprint-builder`](../sprint-builder/SKILL.md)) is the spec — what to build, files to touch, done-when. The code lives at `<cwd>/apps/agents/<role>/agent.py`. Don't conflate the two.

## Workflow

### Pre-Step 0 — Sprint task is your contract

> **You're here because a sprint task triggered you.** The sprint task at `<cwd>/sprint/active/<sprint>/agent/NN-<role>.md` (or backlog equivalent) names the role to scaffold, its variant hint, MCP tools needed, skills to load, and any depends-on chain. Read that task file first — it is your contract. Do not start scaffolding from a free-form user prompt; demand the sprint task path or push back to [`sprint-builder`](../sprint-builder/SKILL.md) to create one.

### Pre-Step 1 — Reference brief Workforce + per-role detail

Before scaffolding the agent, **read the brief** for context on the role being built:

1. **`<cwd>/brief/00_OVERVIEW.md` Section 4 Workforce Manifest** — find the row for the role being scaffolded. Extract:
   - **Type** (from the 18-category taxonomy) → determines the variant (`tool-calling` / `structured-output` / `multimodal`) per the [variant hint mapping in agent-types.md](../brief-builder/references/agent-types.md#variant-hint-mapping-untuk-agent-builder-downstream).
   - **Tools (MCP)** → list of MCP servers that must exist in the project group before the agent is deployed. Cross-check with `curl $MCP_HUB_URL/api/groups/$MCP_HUB_GROUP` — if any are missing, run [`mcp-builder`](../mcp-builder/SKILL.md) or add the existing hub server to the group first.
   - **Skills** → list of Agno LocalSkills to load. Author the folder `<cwd>/apps/agents/<role>/skills/<skill-name>/` (SKILL.md + scripts/) per the Agno LocalSkills convention.
   - **Trigger** → goes into `trigger_types` when registering with be-python (Step 5b).
   - **DB** → if the agent reads/writes any app-domain table, cross-check that the schema foundation task `<cwd>/sprint/active/.../backend/00-schema-<feature>.md` is `[x]`. If not, **stop** — schema first, agent after.
2. **`<cwd>/brief/AA_AGENT_<role>.md`** (present if the role meets the detail-brief threshold) — fill `agent.py`'s `DESCRIPTION` and `INSTRUCTIONS` from the "Tujuan", "Input", "Output", and "Failure modes" sections of the detail file.
3. If no detail brief exists (the role is inline-only in the Workforce table), use the Workforce row as the source of truth.

### Step 1 — Scaffold the agent project

Run the bundled `init_boilerplate.sh` from the [`bootstrap-project`](../bootstrap-project/scripts/init_boilerplate.sh) skill, then move into the per-role folder:

```bash
cd <cwd>/
ROLE=<role>
bash .claude/skills/bootstrap-project/scripts/init_boilerplate.sh -p "$ROLE" -s agent-python
mkdir -p apps/agents
mv apps/agent apps/agents/"$ROLE"
```

Result: `<cwd>/apps/agents/<role>/` with the boilerplate's full tree (`agent.py`, `server.py`, `memory/`, `_runs.py`, etc.).

### Step 2 — Edit `agent.py`

- Pick the variant (model). Default in the boilerplate is `tool-calling` / `z-ai/glm-4.7:nitro` — uncomment one of the three `MODEL_ID` lines, delete the others. For structured output add `output_schema=PydanticModel` on the `Agent`; for multimodal handle image/audio inputs per [`references/multimodal.md`](references/multimodal.md).
- Replace the `<TODO: …>` markers in `DESCRIPTION` (one line) and `INSTRUCTIONS` (≤ 5 imperative bullets, including memory-protocol guidance — see the boilerplate's [`skills/memory-conventions/`](../../boilerplates/agent-python/skills/memory-conventions/SKILL.md)).
- `MCPTools` (project group) and `FileTools(base_dir=./memory)` are already wired. Add nothing else unless the agent genuinely needs it — see the **Optional opt-ins** table above for code-execution / session memory / Supabase patterns.

### Step 3 — Edit `server.py`

Replace the `<TODO: …>` markers: set `name="<slug>_<role>"` (init script already rewrote `pyproject.toml` `name` — match it here), fill the `instructions=` paragraph with what this agent does and when to call it (the LLM that routes to it reads this), and replace the docstring on `run` with what `input` is and what the agent returns. The wrapper logic stays generic.

### Step 4 — Local smoke test

```bash
cd <cwd>/apps/agents/<role>
# install deps (per the boilerplate's README)
# run the FastMCP server
OPENROUTER_API_KEY=… MCP_HUB_URL=… MCP_HUB_API_KEY=… MCP_HUB_GROUP=<slug> \
  python server.py
```

In another shell, hit the MCP endpoint with a FastMCP `Client`:

```python
import asyncio
from fastmcp import Client

async def main():
    async with Client("http://localhost:8000/mcp") as c:
        tools = await c.list_tools()
        print([t.name for t in tools])   # should show ["run"]
        result = await c.call_tool("run", {"input": "test input"})
        print(result.data)

asyncio.run(main())
```

### Step 5 — Register the agent as an MCP server with the hub

```bash
SERVER_NAME="<slug>_<role>"          # e.g. dashboard_kemendagri_crawler
SERVER_URL="http://<host>:<port>/mcp"      # where the agent is deployed

curl -sS -X POST "$MCP_HUB_URL/api/servers" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $MCP_HUB_API_KEY" \
  -d "$(cat <<JSON
{
  "name": "$SERVER_NAME",
  "config": {
    "type": "streamable-http",
    "url": "$SERVER_URL",
    "headers": {}
  }
}
JSON
)"

# Add to the project group so every other agent in the project sees it.
curl -sS -X POST "$MCP_HUB_URL/api/groups/$MCP_HUB_GROUP/servers" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $MCP_HUB_API_KEY" \
  -d "{\"serverId\": \"$SERVER_NAME\"}"
```

After this step, any agent in the project (orchestrator, sibling specialist, or be-python's regular endpoints calling MCP) sees this agent as a tool named `<slug>_<role>__run` (or similar — the hub mangles names per its convention) in the group.

### Step 5b — Register the agent with be-python's `/agent-mgmt/*`

Independent of MCPHub: be-python (`<cwd>/apps/be/`, port 8020) hosts the **agent registry** that drives schedulers, webhooks, and run logging via mandatory `agent_mgmt` router. Every newly-scaffolded agent must be inserted into the registry once.

> All `/agent-mgmt/*` calls require either a JWT admin token OR the `X-Internal-Token` header (matching `INTERNAL_API_TOKEN` in `<cwd>/apps/be/.env`). Examples below use the header.

```bash
INTERNAL_TOKEN=$(grep INTERNAL_API_TOKEN <cwd>/apps/be/.env | cut -d= -f2)

curl -sS -X POST "http://localhost:${BE_PORT:-8020}/agent-mgmt/agents" \
  -H "Content-Type: application/json" \
  -H "X-Internal-Token: $INTERNAL_TOKEN" \
  -d "$(cat <<JSON
{
  "slug": "$SERVER_NAME",
  "description": "<one-line role>",
  "mcp_url": "$SERVER_URL",
  "trigger_types": ["manual"],
  "max_retries": 3,
  "retry_backoff_seconds": 5,
  "escalation_agent_id": "<notifier-agent-uuid-or-null>"
}
JSON
)"
```

`trigger_types` is a hint about how the agent is invoked (`manual`, `scheduled`, `webhook`, `orchestrated`). `max_retries` + `retry_backoff_seconds` + `escalation_agent_id` are autonomy fields — be-python retries transient errors, then escalates via notifier if retries are exhausted.

To enable scheduled runs:

```bash
# Run every 15 minutes
curl -sS -X POST "http://localhost:${BE_PORT:-8020}/agent-mgmt/agent-schedules" \
  -H "Content-Type: application/json" \
  -H "X-Internal-Token: $INTERNAL_TOKEN" \
  -d '{"agent_id":"<from-step-5b-response>","cron_expr":"*/15 * * * *","payload":{}}'
```

To enable a webhook trigger:

```bash
# Returns {secret} ONCE — store it in the upstream system that will sign the webhooks
curl -sS -X POST "http://localhost:${BE_PORT:-8020}/agent-mgmt/agent-webhooks" \
  -H "Content-Type: application/json" \
  -H "X-Internal-Token: $INTERNAL_TOKEN" \
  -d '{"agent_id":"<from-step-5b-response>","path":"<unique-path>"}'
```

The upstream system signs each request body with HMAC-SHA256 using the SHA256 hex of `secret_hash` (see [`boilerplates/be-python/service/agent_mgmt.py`](../../boilerplates/be-python/service/agent_mgmt.py) `receive_webhook`) and POSTs to `http://<be-python-host>:8020/agent-mgmt/webhooks/<path>` with `X-Signature: <hex>` header (no `X-Internal-Token` needed — signature is the auth).

## be-python `/agent-mgmt/*` run-logging protocol

Every agent should report start/finish of each invocation to be-python — the registry is useless without runs. The `agent-python` boilerplate ships [`_runs.py`](../../boilerplates/agent-python/_runs.py), a thin `track_run()` async-context-manager that does:

1. `POST /agent-mgmt/agent-runs` on entry (with `agent_id` resolved from `AGENT_SLUG`, `input`, `triggered_by`, `trigger_meta`) → captures `run_id`.
2. The body of `agent.run()` runs.
3. `PATCH /agent-mgmt/agent-runs/{run_id}` on exit (with `status=success|failed`, `output`, `error`, `metrics`).

All requests carry `X-Internal-Token: $INTERNAL_API_TOKEN` header (env var di `<cwd>/apps/agents/<role>/.env`, must match `<cwd>/apps/be/.env`'s `INTERNAL_API_TOKEN`).

Logging is **best-effort**: if be-python is down or unreachable, the agent still runs — the `track_run` context just no-ops. Never let run-logging block agent work.

The agent's `agent.py` opts in by wrapping its `run()` body:

```python
from _runs import track_run

async def run(input: str) -> str:
    async with track_run(input) as r:
        # ... existing async with MCPTools(...) as mcp: + Agent.arun() body ...
        r.set_output({"content": response.content})
        r.record_metric("latency_ms", ...)  # business-level metrics → agent_runs.metrics
        return response.content
```

Required env in agent's `.env`:
- `BE_URL=http://localhost:8020` (be-python instance)
- `INTERNAL_API_TOKEN=<must match be-python settings.INTERNAL_API_TOKEN>`
- `AGENT_SLUG=<slug>_<specialist>`

For runs initiated by **be-python itself** (scheduler tick, webhook fanout via `service/agent_mgmt.fire_agent`), be-python creates the run row directly — the agent's `track_run` would otherwise create a duplicate. To avoid that, future versions can pass an existing `run_id` through `trigger_meta`; for v1, the duplicate is acceptable (rare double-write into one row).

## Trigger patterns (how something invokes an agent)

Every agent is reachable as an MCP tool. Three patterns for who's calling:

### A. Orchestrator agent calls a specialist

The orchestrator is itself an `agents/orchestrator/` project, scaffolded the same way. Its `agent.py` connects to the project group like any specialist; the group includes every other specialist as a tool. It picks one (or several, in sequence) and calls them.

This is the default pattern — one orchestrator routes work to many specialists. No bespoke wiring; everything goes through the group.

### B. be-python regular endpoint calls an agent

A FastAPI endpoint in `<cwd>/apps/be/` that needs an agent's output connects to the project group from inside the route handler:

```python
# <cwd>/apps/be/router/<feature>.py
import os
from fastapi import APIRouter
from agno.tools.mcp import MCPTools

router = APIRouter(prefix="/<feature>")

@router.post("/process")
async def process(payload: ProcessRequest):
    async with MCPTools(
        transport="streamable-http",
        url=f"{os.environ['MCP_HUB_URL']}/mcp/{os.environ['MCP_HUB_GROUP']}",
        client_params=dict(headers={"Authorization": f"Bearer {os.environ['MCP_HUB_API_KEY']}"}),
    ) as mcp:
        # Find and call the specific agent's tool. The hub names it after the server.
        result = await mcp.call_tool("<slug>_<role>__run", {"input": payload.text})
        return {"result": result.data}
```

be-python's regular endpoints don't import the agent's Python; they call its MCP tool. The agent stays standalone.

### C. External webhook fires the agent directly

For external systems (webhooks from third parties) that should fire an agent, a thin route in be-python validates the webhook signature, then forwards to the agent via pattern B. Don't expose the agent's MCP endpoint directly to the public internet without an auth layer.

## Rules

- **Pin the model ID per variant.** No env-driven model selection — the variant *is* the choice.
- **One agent per `<cwd>/apps/agents/<role>/` project.** Don't bundle multiple unrelated agents together.
- **Async by default.** `await agent.arun(...)`. FastMCP's HTTP server is async, the agent layer must match.
- **No prompts inline in `server.py`.** Prompt assembly lives in `agent.py`.
- **Don't log the full prompt or full response in production.** Log a digest (input length, output length, tool calls made) for observability without leaking PII.
- **Never expose an agent's MCP endpoint directly to the public internet** without an auth layer in front. The MCPHub group endpoint with Bearer-token auth is the contract.
- **No `OPENROUTER_API_KEY` in code.** Env only. If a sandbox doesn't have it set, fail loudly at import time so the dev fixes it before deployment.
- **No `@tool` decorators for I/O.** All external capabilities come from MCP tools (the project group). The exception: trivial pure-Python helpers (formatting, math) can be `@tool`-decorated locally — but never anything that does I/O.
- **Don't promote a one-off LLM call to an agent.** If a feature only needs `text → structured JSON` once and never again, write a single function with the SDK directly. Agents are for repeated, tool-using, or workflow-driven LLM use.

### Autonomy guarantees (mindset "no human maintainer")

- **Every agent declares failure modes + escalation policy** in `INSTRUCTIONS` or in the `AA_AGENT_<role>.md` "Failure modes" section. No silent failures. Non-recoverable failures → fan out via `escalation_agent_id`.
- **Every agent must be idempotent.** The scheduler can fire twice in edge cases (process restart between fire and run-finish patch). Agent operations must use cursors / dedup keys / upserts — no repeated side effects.
- **Every domain agent that touches data-critical paths must have a monitor sibling** registered in the brief Workforce. If the brief lacks a monitor for a crawler/ingest/scoring agent → block the scaffold and redirect to brief-builder Phase 4.5. Exception: the brief explicitly declares "POC, no autonomous ops" in the Blind Spot Review.
- **Every agent emits structured error capture + business metrics.** Wrap `agent.arun()` in try/except, set `r.set_error(f"{type(e).__name__}: {e}")` + `r.record_metric("error_class", type(e).__name__)`, then re-raise (don't swallow). Use the boilerplate `agent.py` skeleton as reference — the error path is already documented.
- **Every agent participates in the retry/escalation chain via be-python.** Set `agents.max_retries` ≥ 1 for transient-failure recovery. Set `agents.escalation_agent_id` to the notifier for non-recoverable failures. Default-zero retries is a bug unless the agent is explicitly no-retry-safe (e.g. a payment-trigger).
- **Observability via Agno built-in OpenInference → Langfuse** (LLM-level traces) + `r.record_metric()` (business-level metrics) — don't roll custom telemetry. Setup `LANGFUSE_PUBLIC_KEY` + `LANGFUSE_SECRET_KEY` di `.env` agent + `pip install -e ".[observability]"` (already wired di boilerplate `agent.py` `_setup_langfuse()`).
- **No human-in-the-loop assumptions** in `INSTRUCTIONS`. The words "ops engineer", "operator", "manual review", "wait for approval" in a prompt are a bug. Agents must auto-decide; on uncertainty, escalate to validator/notifier rather than pausing for a human.

## End-to-end example sketch (tool-calling)

User asks: *"Add an agent that crawls a URL the user pastes and returns a one-paragraph summary + the page's main outbound links."*

1. **Variant**: tool-calling.
2. **Scaffold** (run from `<cwd>/`): `bash .claude/skills/bootstrap-project/scripts/init_boilerplate.sh -p crawler -s agent-python && mkdir -p apps/agents && mv apps/agent apps/agents/crawler`. Result: `<cwd>/apps/agents/crawler/`.
3. **Edit `agent.py`**: keep `z-ai/glm-4.7:nitro`; description = "fetch a URL, summarize, list outbound links"; instructions reference the `web` MCP server's `fetch_url` and `extract_links` tools (already in the project group via Step 0c). FileTools-on-memory wired for state.
4. **Edit `server.py`**: update FastMCP `name="dashboard_kemendagri_crawler"`, `instructions="Crawls a URL and returns a one-paragraph summary plus outbound links."`. Wrapper code unchanged.
5. **Smoke test**: `python server.py` then call `run` via FastMCP `Client`.
6. **Register**: deploy the agent (e.g. via Coolify / k8s), then run the two `curl` calls in Step 5 above to register with MCPHub and add to the project group.
7. **Reachable**: from this point on, an orchestrator, sibling specialist, or be-python endpoint can call this crawler via the project group like any other tool.
