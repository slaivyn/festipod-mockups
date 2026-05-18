@AGENTS.md

# Festipod Project

Mobile-first web app for discovering and sharing festival/event recommendations through trusted networks. Uses a sketchy hand-drawn UI style.

## Architecture

Feature-based architecture: code is organized by business domain (module), not by technical layer. A module can only import from `shared/` — never from another module.

Multi-layer BDD: each module has `steps/ui/`, `steps/data/`, `steps/e2e/` directories. Shared step definitions live in `src/shared/steps/`.

## Project Structure

```
src/
  modules/                  # Business domain modules
    event/                  # Events (create, discover, detail, update, invite, participants, meeting points)
      screens/              # EventsScreen, EventDetailScreen, CreateEventScreen, etc.
      features/             # Gherkin .feature files for this domain
      steps/                # BDD step definitions
        ui/                 # UI-layer steps
        data/               # Data-layer steps
        e2e/                # E2E steps
    user/                   # User profiles, friends, sharing
      screens/              # ProfileScreen, FriendsListScreen, ShareProfileScreen, etc.
      features/
      steps/
    home/                   # Home dashboard, settings
      screens/              # HomeScreen, SettingsScreen
    auth/                   # Authentication, onboarding
      screens/              # LoginScreen, WelcomeScreen
    workshop/               # Workshop/atelier specs (no screens yet)
      features/
      steps/
    meeting/                # Meeting point specs
      features/
      steps/
    notification/           # Notification specs
      features/
      steps/
  shared/                   # Shared code (importable by all modules)
    components/
      sketchy/              # Hand-drawn UI components (Button, Card, Avatar, etc.)
      ui/                   # Shadcn/Radix components
    context/                # ThemeContext, NextGraphContext, FestipodDataContext
    data/                   # User stories, features.ts (auto-generated), testResults.ts
    hooks/                  # Custom hooks (useShapeWithDefaults)
    shapes/                 # SHEX shapes + ORM bindings (NextGraph)
    utils/                  # ngSession, ngBootstrap
    steps/                  # Shared BDD step definitions (cross-domain)
      ui/                   # navigation.steps.ts, form.steps.ts, screen.steps.ts
      data/
    support/                # Cucumber hooks.ts, world.ts
    types/                  # TypeScript type definitions
    lib/                    # Utility functions (cn, etc.)
  app/                      # App shell
    App.tsx                 # Root component with providers + route switch
    router.tsx              # Path-based routing (History API)
    frontend.tsx            # React entry point
  screens/
    index.ts                # Screen registry (used by Storybook)
scripts/                    # Build scripts for parsing features
docs/                       # Documentation
.storybook/                 # Storybook configuration
```

## Key Commands

```bash
bun run dev              # Start dev server with HMR
bun run storybook        # Browse screens and components in Storybook
bun run test:cucumber    # Run Cucumber tests
bun run features:parse   # Regenerate features.ts from .feature files
bun run steps:extract    # Extract step definitions for tooltips
```

## Routing

Path-based routing via `src/app/router.tsx`. Screens use `useNavigate()` and `useParams()` hooks. See AGENTS.md for the full route table.

## Conventions

- Gherkin specs are in French (Etant donne, Quand, Alors)
- UI labels are in French
- User stories are prefixed US-1 to US-26
- Screens use the sketchy component library, not Tailwind
- Max app width: 768px (tablet portrait)

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
