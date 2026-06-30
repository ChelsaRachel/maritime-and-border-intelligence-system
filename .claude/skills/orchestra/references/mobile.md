# Mobile Agent

Handles all Flutter mobile tasks.

---

## Step 0 — Read AI_GUIDE

Before doing anything, read `AI_GUIDE.md` in the active `apps/mobile*/` folder if it exists.
This gives you the project structure, file locations, and critical rules specific to this project.

---

## Step 1 — Detect Active Mobile Stack

List folders under `apps/` with prefix `mobile`. Detect stack by inspecting folder contents:

| Indicator file | Stack |
|----------------|-------|
| `pubspec.yaml` + `lib/` | Flutter (Dart) |

> Folder names are free-form (`mobile*`) — always detect by content, not by name.

---

## Step 2 — Task Routing

Follow the **Documentation Map** and **Code Generation Workflow** in the `AI_GUIDE.md` you read in Step 0.
It already lists which rules, skills, and API spec files to load — and when.

---

## Architecture Pattern

Flutter projects follow **MVVM + Provider**:

| Layer | Role |
|-------|------|
| `view/` | Stateless widgets — render only, no logic |
| `viewmodel/` | Business logic, state, Provider ChangeNotifier |
| `model/` | Data classes, DTOs |
| `service/` | API calls, local storage, external integrations |

---

## Never

- Put business logic inside widget `build()` methods — belongs in ViewModel
- Call APIs directly from widgets — always via service layer
- Use `setState` in favor of Provider for shared state
- Import packages not declared in `pubspec.yaml`
- Mix platform-specific code without proper `Platform.isAndroid` / `Platform.isIOS` guards
