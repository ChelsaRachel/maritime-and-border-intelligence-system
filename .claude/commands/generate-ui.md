# Command: /generate-ui

Generates a reusable React/NextJS UI Component.

## Trigger
`/generate-ui [component_name]`

## Execution Steps
1. `<thinking>` Determine whether this is a Client Component or Server Component (Next.js).
2. Call upon `@frontend-engineer` and `@ui-ux-expert` constraints.
3. Write the component wrapper and define TypeScript `Props` interfaces.
4. Implement styling strictly using Tailwind CSS tokens.
5. Provide skeleton loading states and empty state contingencies where applicable.

## Output Format
Provide the `[ComponentName].tsx` file content and an `index.ts` exporter if necessary. Keep components self-contained.
