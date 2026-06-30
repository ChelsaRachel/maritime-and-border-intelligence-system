# Command: /dockerize

Generates or refines deployment artifacts (Dockerfile / docker-compose).

## Trigger
`/dockerize` or `/dockerize [service_name]`

## Execution Rules
* **Strict Dependency Minimization:** By default, do not add external backing services (e.g., MongoDB, Redis, PostgreSQL, Celery) to the `docker-compose.yml`.
* **Explicit Requests Only:** Only include dependency services if the user explicitly requests them (e.g., `/dockerize with mongodb`).
* **Application Isolation:** The primary focus must be solely on containerizing the target application itself.

## Execution Steps
1. `<scoping>` Check the prompt for explicit database or message broker requests. If none are explicitly requested, omit all supporting services.
2. `<thinking>` Analyze the target service framework (e.g., Rust binary, Python Uvicorn/Gunicorn, Next.js standalone).
3. Construct a multi-stage `Dockerfile`:
   - Stage 1: Dependency fetching and compilation (Builder).
   - Stage 2: Minimal runtime image (e.g., Alpine or distroless).
4. Add the main application service to `docker-compose.yml`, configuring networks and volume mounts as needed. Do not include external dependencies or `depends_on` directives unless they were explicitly requested.

## Output Format
Output the contents of the `Dockerfile` and the exact snippet to insert into `docker-compose.yml`. Ensure security best practices are applied (e.g., use the `USER` instruction so containers do not run as `root`).