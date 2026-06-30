# Command: /test-suite

Generates comprehensive unit and integration tests based on the current context.

## Trigger
`/test-suite`

## Execution Steps
1. `<thinking>` Look at the currently active file. Determine its language: Setup `pytest` (Python), `cargo test` (Rust), `jest/vitest` (React), or `flutter test` (Dart).
2. Identify all edge cases, successful paths (happy path), and failure states.
3. Write mock definitions for external API calls or database hits.
4. Write the test cases.

## Output Format
Provide valid test file code ready to be executed in the current environment's test runner.
