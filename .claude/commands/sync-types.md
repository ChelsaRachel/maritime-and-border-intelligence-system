# Command: /sync-types

Synchronizes data models across the Fullstack ecosystem. Given a backend response/schema, generates TypeScript Interfaces (FE) and Dart Models (Mobile).

## Trigger
`/sync-types` or `/sync-types [Backend File or JSON target]`

## Execution Steps
1. `<thinking>` Analyze the source JSON payload, Rust Struct, or Python Pydantic Model.
2. Identify data types (Strings, Ints, Dates, Nullables, Arrays).
3. Generate standard TypeScript interface/types for the ReactJS application.
4. Generate equivalent Dart classes using `json_serializable` or `freezed` mappings for the Flutter application.

## Output Format
Provide the TS and Dart code cleanly. Point out any potentially dangerous nullable mismatches.
