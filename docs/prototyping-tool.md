# Prototyping Tool

A web application for visualizing and documenting the Festipod mobile app project. It combines interactive mockups, user story management, and BDD test integration.

## Overview

The tool provides four main views:

| Page | Route | Purpose |
|------|-------|---------|
| Gallery | `#/` | Browse all mockup screens |
| Stories | `#/stories` | View and filter user stories |
| Demo | `#/demo/{screenId}` | Interactive screen preview |
| Specs | `#/specs` | BDD specifications with test status |

## Architecture

```
src/
  App.tsx              # Main app with routing
  router.tsx           # Hash-based SPA router

  components/
    Gallery.tsx        # Screen gallery grid
    DemoMode.tsx       # Interactive demo view
    UserStoriesPage.tsx # Stories listing
    sketchy/           # UI component library
    specs/             # Specs viewer components
    ui/                # Shadcn/Radix components

  screens/             # Mockup screen components
  data/                # Stories, features, test data
  types/               # TypeScript definitions
```

## Pages

### Gallery

The landing page displaying all mockup screens organized by category:

- **Accueil** - Home section
- **Evenements** - Event-related screens
- **Utilisateur** - User profile screens
- **General** - Login, settings

Features:
- Horizontal scrolling layout
- Zoom slider (32% to 75%)
- Click any screen to open in Demo mode
- Navigation buttons to Stories and Specs pages

### Demo Mode

Two-panel interactive preview:

**Left Sidebar:**
- Back to Gallery button
- Current screen with navigation history
- Linked user stories for the screen
- Quick navigation to all screens

**Right Panel:**
- Phone frame with live mockup
- Auto-scales to fit viewport
- Interactive navigation within mockups

Clicking a user story navigates to the Stories page with that story selected.

### Stories Page

User story browser with filtering:

**Filters:**
- Category (EVENT, WORKSHOP, USER, MEETING, NOTIF)
- Priority (P0-P3)
- Linked screen

**Display:**
- Stories grouped by priority
- Color-coded category and priority badges
- Description and linked screens
- Click title to open linked screen in Demo

### Specs Page

BDD specification viewer with test integration:

**Header:**
- Test summary (passed/failed/skipped counts)
- Last run timestamp
- Link to HTML Cucumber report

**Filters:**
- Category checkboxes
- Priority selection
- Text search

**Feature Cards:**
- Feature name and description
- Scenario count
- Test status indicator
- Click to open detailed view

### Feature View

Detailed specification page:

- Priority and category badges
- Clickable user story link
- Linked screens as buttons
- Gherkin syntax highlighting with:
  - Collapsible scenarios
  - Color-coded keywords
  - Step definition tooltips
  - Test status indicators
  - Error messages for failed scenarios

## Component Library

### Sketchy Components

Hand-drawn style UI components in `components/sketchy/`:

| Component | Purpose |
|-----------|---------|
| PhoneFrame | iPhone-style device frame |
| Header | App header with title and actions |
| NavBar | Bottom navigation with icons |
| Button | Primary and default variants |
| Card | Content container |
| Avatar | User avatar with initials |
| Badge | Label badges |
| Input | Text input field |
| Text | Styled typography |
| Title | Heading text |
| Placeholder | Empty state box |
| Divider | Visual separator |
| Checkbox | Form checkbox |
| Toggle | On/off switch |
| ListItem | List row |

### UI Components

Modern components from Shadcn/Radix in `components/ui/`:

- Button, Card, Badge
- Slider, Input
- Tooltip
- Dialog

## Data Layer

### Stories (`data/index.ts`)

```typescript
interface UserStoryDefinition {
  id: string;
  priority: number;
  category: StoryCategory;
  title: string;
  description: string;
  screenIds: string[];
}
```

Functions:
- `getStoryById(id)` - Get story by ID
- `getStoriesForScreen(screenId)` - Stories linked to a screen
- `getStoriesByCategory(category)` - Filter by category
- `getStoriesByPriority(priority)` - Filter by priority

### Features (`data/features.ts`)

Auto-generated from Cucumber feature files:

```typescript
interface ParsedFeature {
  id: string;
  name: string;
  description: string;
  tags: string[];
  category: string;
  priority: number;
  scenarios: ParsedScenario[];
  filePath: string;
  rawContent: string;
}
```

### Test Results (`data/testResults.ts`)

Parsed from Cucumber JSON reports:

```typescript
interface TestStatus {
  passed: number;
  failed: number;
  skipped: number;
  total: number;
}
```

### Step Definitions (`data/stepDefinitions.ts`)

Extracted step implementations for tooltip display.

## Build Scripts

Located in `scripts/`:

| Script | Command | Purpose |
|--------|---------|---------|
| parse-features.ts | `bun run features:parse` | Parse .feature files |
| parse-test-results.ts | `bun run test:report` | Generate test report |
| extract-step-definitions.ts | `bun run steps:extract` | Extract step code |

## Development

### Setup

```bash
bun install
```

### Development Server

```bash
bun run dev
```

Starts server on http://localhost:3000 with HMR.

### Run Tests

```bash
bun run test:cucumber
```

Runs Cucumber tests and generates HTML report.

### Regenerate Data

```bash
# After modifying .feature files
bun run features:parse

# After modifying step definitions
bun run steps:extract
```

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Bun | Runtime and bundler |
| React 19 | UI framework |
| TypeScript | Type safety |
| Tailwind CSS | Utility styling |
| Radix UI | Accessible primitives |
| Lucide | Icons |
| Cucumber | BDD testing |

## Future Plans

This prototyping tool is designed to be extracted as a standalone application for:

- Rapid mobile app prototyping
- User story management
- BDD specification writing
- Test result visualization

The "Sketchy" design system emphasizes the prototype nature and can be swapped for production-ready components.
