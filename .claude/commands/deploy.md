# /deploy — Deployment Workflow

Executes the deployment workflow for services to the target environment, including full support for local machine deployment accessible over a Local Area Network (LAN).

## Usage
```text
/deploy
/deploy [service_name] [stage]
/deploy backend staging
/deploy web production
/deploy all staging
```

## Phase 1: Artifact Verification

1. Inspect the project root directory for the existence of `docker-compose.yml`. Additionally, inspect each target application folder within the `apps/` directory to ensure a `Dockerfile` exists for each respective service.
2. If **missing** (either the root `docker-compose.yml` or the required `Dockerfile` for the target service): Pause the deployment process and instruct the user to run `/dockerize` (or `/dockerize [service_name]`) to generate the necessary artifacts first.
3. If **present**: Proceed to Phase 2.

## Phase 2: Mandatory Interactive Interview & Metadata Collection

You **MUST** conduct an interactive interview with the user to collect or confirm the following information before proceeding with the deployment:
- **Application Name (`appname`):** 
  - **Strict Rule:** Must be entirely lowercase, words separated only by hyphens (`-`), with no spaces or other symbols allowed (e.g., `vibe-fs-app`, `core-backend`).
- **Application Description (`description`):** A brief explanation of the application (e.g., File management system).
- **Target Stage:** Prompt the user to select one of the following: `'local' | 'staging' | 'production'`.

## Phase 3: Service Identification & `deployment.json` Generation

1. **Directory Scan:** Scan the `apps/` directory in the project root to identify the names of all application folders (e.g., `web`, `backend`, `mobile`).
2. **Artifact Generation:** Generate or update the `deployment.json` file in the root directory based on the interview results and the discovered folder names. Update the `deployed_at` timestamp **only** for the target stage being deployed.

**Required `deployment.json` Format:**
*(Replace `<app_folder_name_X>` with the actual directory names found inside the `apps/` folder).*
```json
{
  "appname": "[INTERVIEW_APPNAME_KEBAB_CASE]",
  "description": "[INTERVIEW_DESCRIPTION]",
  "version": "0.0.0",
  "build": {
    "development": {
      "deployed_at": "[TIMESTAMP_ONLY_UPDATED_ON_LOCAL_DEPLOY]",
      "url": "http://[LOCAL_LAN_IP]:[PORT]",
      "services": {
        "<app_folder_name_1>": {
          "env": {
            "NODE_ENV": "development",
          }
        },
        "<app_folder_name_2>": {
          "env": {
            "NODE_ENV": "development",
          }
        }
      }
    },
    "staging": {
      "deployed_at": "[TIMESTAMP_ONLY_UPDATED_ON_STAGING_DEPLOY]",
      "url": "[https://api-staging.vibe-fs.com](https://api-staging.vibe-fs.com)",
      "services": {
        "<app_folder_name_1>": {
          "env": {
            "NODE_ENV": "staging",
          }
        }
      }
    },
    "production": {
      "deployed_at": "[TIMESTAMP_ONLY_UPDATED_ON_PRODUCTION_DEPLOY]",
      "url": "[https://api-vibe-fs.com](https://api-vibe-fs.com)",
      "services": {
        "<app_folder_name_1>": {
          "env": {
            "NODE_ENV": "production",
          }
        }
      }
    }
  }
}
```

## Phase 4: Pre-Deploy Checklist

Before deploying any service to staging or production, confirm:

- [ ] All CI checks pass on the target branch
- [ ] Database migrations reviewed and tested
- [ ] Environment variables configured in target environment
- [ ] Dependencies updated and locked (`Cargo.lock` / `poetry.lock` / `package-lock.json`)
- [ ] `CHANGELOG.md` updated
- [ ] Feature flags enabled/disabled as intended

## Phase 5: Deployment Execution by Stage

### Local Deployment (Target: `local`)

To ensure the application is accessible to other devices on the same network (WiFi/LAN):
1. **Retrieve Local IP:** Execute system commands to fetch the machine's internal IP address (e.g., `192.168.1.X`).
   - *Linux/macOS:* `hostname -I | awk '{print $1}'`
   - *Windows:* `ipconfig`
2. **Update Configuration:** Inject the fetched IP into the `development.url` field in `deployment.json` (e.g., `http://192.168.1.24:3000`). Update `development.deployed_at` with the current timestamp.
3. **Run Containers:** Execute Docker Compose at the project root. Ensure Docker Engine/Docker Desktop is running.
   ```bash
   docker compose up -d
   ```
4. **Access Notice:** Output the following message to the user:
   > *"Deployment successful. The application is accessible on your local network at: http://[LOCAL_IP]:[PORT]"*
   
   *(Important Note: Ensure the application binds to `0.0.0.0` rather than `127.0.0.1` in the `docker-compose.yml` to allow external network access).*

### Staging / Production Deployment

**Backend Deploy (Rust / Python)**
```bash
# -- If Rust --
cargo build --release
sqlx migrate run --database-url $DATABASE_URL

# -- If Python --
# (Ensure pip/poetry deps are installed inside the Docker image)
# alembic upgrade head

# 1. Build Docker image
docker build -t vibe-fs-backend .
docker push registry/vibe-fs-backend:$VERSION

# 2. Verify health check
curl [https://api.vibe-fs.com/health](https://api.vibe-fs.com/health)
```

**Web Deploy (React / Next.js)**
```bash
# 1. Install & build
npm ci
npm run build

# 2. Build image & push
# (adjust for Vercel, Docker standalone, S3+CloudFront, Netlify, etc.)
docker build -t vibe-fs-web .
docker push registry/vibe-fs-web:$VERSION

# 3. Verify deployment
curl -I [https://vibe-fs.com](https://vibe-fs.com)
```

**Mobile Deploy (Flutter)**
```bash
# Android
flutter build appbundle --release
# Upload to Google Play Console

# iOS
flutter build ipa --release
# Upload to App Store Connect via Xcode or xcrun altool
```

## Phase 6: Post-Deploy Verification

After every deploy:

1. **Health check** — `GET /health` returns `200`.
2. **Connectivity Test** — For `local` deployments, verify access using the provided LAN URL from another device on the same network.
3. **Smoke test** — Log in, retrieve data, test main feature.
4. **Logs** — Check for unexpected errors in the first 5 minutes (`docker compose logs -f` for local).
5. **Metrics** — Verify error rate and p95 latency in monitoring dashboard (Staging/Production).

## Rollback

```bash
# Backend / Web: redeploy previous Docker image tag
docker pull registry/vibe-fs-$SERVICE:$PREVIOUS_VERSION
# restart service

# Database: revert last migration (only if safe)
# sqlx migrate revert --database-url $DATABASE_URL
# alembic downgrade -1
```

## Environments

| Env        | Default Target URL            | Branch  |
|------------|-------------------------------|---------|
| local      | `http://[LOCAL_LAN_IP]:[PORT]`| any     |
| staging    | `https://api-staging.vibe-fs.com` | develop |
| production | `https://api.vibe-fs.com`       | main    |

## Notes

- Never deploy directly to production from a local machine.
- All production deploys go through the CI/CD pipeline.
- Migrations run automatically in CI before the new binary/server starts.
- Keep at least 2 previous Docker image tags available for rollback.