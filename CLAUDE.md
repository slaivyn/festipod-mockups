# Festipod Project

This project has two parts:
1. **Festipod App** - Mobile app mockups in `src/screens/` with sketchy hand-drawn UI
2. **Prototyping Tool** - Web app to view mockups, user stories, and BDD specs

## Project Structure

```
src/
  screens/           # Mockup screens (HomeScreen, EventDetailScreen, etc.)
  components/
    sketchy/         # Hand-drawn UI components (Button, Card, Avatar, etc.)
    specs/           # Specs viewer (GherkinHighlighter, FeatureView, etc.)
    ui/              # Shadcn/Radix components
  data/
    index.ts         # User stories definitions
    features.ts      # Auto-generated from .feature files
    testResults.ts   # Cucumber test results
features/            # Gherkin .feature files (French)
scripts/             # Build scripts for parsing features
docs/                # Documentation
```

## Key Commands

```bash
bun run dev              # Start dev server with HMR
bun run test:cucumber    # Run Cucumber tests
bun run features:parse   # Regenerate features.ts from .feature files
bun run steps:extract    # Extract step definitions for tooltips
```

## Conventions

- Gherkin specs are in French (Étant donné, Quand, Alors)
- UI labels are in French
- User stories are prefixed US-1 to US-26
- Screens use the sketchy component library, not Tailwind
- Specs pages use Tailwind + Shadcn components

---

Default to using Bun instead of Node.js.

- Use `bun <file>` instead of `node <file>` or `ts-node <file>`
- Use `bun test` instead of `jest` or `vitest`
- Use `bun build <file.html|file.ts|file.css>` instead of `webpack` or `esbuild`
- Use `bun install` instead of `npm install` or `yarn install` or `pnpm install`
- Use `bun run <script>` instead of `npm run <script>` or `yarn run <script>` or `pnpm run <script>`
- Use `bunx <package> <command>` instead of `npx <package> <command>`
- Bun automatically loads .env, so don't use dotenv.

## APIs

- `Bun.serve()` supports WebSockets, HTTPS, and routes. Don't use `express`.
- `bun:sqlite` for SQLite. Don't use `better-sqlite3`.
- `Bun.redis` for Redis. Don't use `ioredis`.
- `Bun.sql` for Postgres. Don't use `pg` or `postgres.js`.
- `WebSocket` is built-in. Don't use `ws`.
- Prefer `Bun.file` over `node:fs`'s readFile/writeFile
- Bun.$`ls` instead of execa.

## Testing

Use `bun test` to run tests.

```ts#index.test.ts
import { test, expect } from "bun:test";

test("hello world", () => {
  expect(1).toBe(1);
});
```

## Frontend

Use HTML imports with `Bun.serve()`. Don't use `vite`. HTML imports fully support React, CSS, Tailwind.

Server:

```ts#index.ts
import index from "./index.html"

Bun.serve({
  routes: {
    "/": index,
    "/api/users/:id": {
      GET: (req) => {
        return new Response(JSON.stringify({ id: req.params.id }));
      },
    },
  },
  // optional websocket support
  websocket: {
    open: (ws) => {
      ws.send("Hello, world!");
    },
    message: (ws, message) => {
      ws.send(message);
    },
    close: (ws) => {
      // handle close
    }
  },
  development: {
    hmr: true,
    console: true,
  }
})
```

HTML files can import .tsx, .jsx or .js files directly and Bun's bundler will transpile & bundle automatically. `<link>` tags can point to stylesheets and Bun's CSS bundler will bundle.

```html#index.html
<html>
  <body>
    <h1>Hello, world!</h1>
    <script type="module" src="./frontend.tsx"></script>
  </body>
</html>
```

With the following `frontend.tsx`:

```tsx#frontend.tsx
import React from "react";
import { createRoot } from "react-dom/client";

// import .css files directly and it works
import './index.css';

const root = createRoot(document.body);

export default function Frontend() {
  return <h1>Hello, world!</h1>;
}

root.render(<Frontend />);
```

Then, run index.ts

```sh
bun --hot ./index.ts
```

For more information, read the Bun API docs in `node_modules/bun-types/docs/**.mdx`.
