# Command: /generate-api

Generates a complete backend API endpoint (Rust or Python).

## Trigger
`/generate-api [resource_name]`

## Execution Steps
1. `<thinking>` Analyze the `[resource_name]` and identify whether the active directory is Rust or Python.
2. Outline the expected HTTP methods (GET, POST, PUT, DELETE) and payload schema.
3. Call upon `@backend-engineer` constraints.
4. Generate the Route/Controller layer.
5. Generate the Service/Business Logic layer.
6. Generate the DTOs/Pydantic/Serde Structs.
7. Integrate the new route into the main application router.

## Output Format
Deliver the required boilerplate code neatly organized by file path. Do not skip error handling or type definitions.
