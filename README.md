# Festipod

A prototyping tool for the Festipod mobile app - an event discovery and networking platform.

## What's Inside

- **Mobile App Mockups** - 13 interactive screens with hand-drawn "sketchy" UI
- **User Stories** - 26 stories across 5 categories (Events, Workshops, Users, Meetings, Notifications)
- **BDD Specifications** - Cucumber feature files in French with test integration

## Quick Start

```bash
bun install
bun run dev
```

Open http://localhost:3000

## Navigation

| Page | Route | Description |
|------|-------|-------------|
| Gallery | `#/` | Browse all mockup screens |
| Demo | `#/demo/{screen}` | Interactive screen preview |
| Stories | `#/stories` | User stories browser |
| Specs | `#/specs` | BDD specifications with test status |

## Commands

```bash
bun run dev              # Start dev server with HMR
bun run test:cucumber    # Run Cucumber tests
bun run features:parse   # Regenerate features from .feature files
bun run steps:extract    # Extract step definitions
```

## Documentation

See [docs/](./docs/) for detailed documentation:

- [Festipod App](./docs/festipod-app.md) - Mobile app design
- [Prototyping Tool](./docs/prototyping-tool.md) - Web app architecture
- [Cucumber Integration](./docs/cucumber-integration.md) - BDD testing setup
