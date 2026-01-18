# Cucumber BDD Integration

This document explains how the Cucumber BDD testing framework is integrated into Festipod.

## Overview

Festipod uses **Cucumber.js** with **TypeScript** for Behavior-Driven Development testing. All feature files are written in **French** using Gherkin syntax. The integration uses static source code analysis rather than browser automation.

## Architecture

```
Feature Files (French Gherkin)
    ↓
Cucumber Parser (language: "fr")
    ↓
Step Definition Matching
    ↓
World Instance (FestipodWorld)
    ↓
Inline Detection Logic (screen-specific regex patterns)
    ↓
Chai Assertions
    ↓
JSON + HTML Reports
```

## Directory Structure

```
features/
├── support/
│   ├── world.ts              # Custom World class with state management
│   └── hooks.ts              # Before/After lifecycle hooks
├── step_definitions/
│   ├── navigation.steps.ts  # Screen navigation steps
│   ├── form.steps.ts        # Form validation steps
│   └── screen.steps.ts      # Content verification steps
├── user/                    # User-related features (9 files)
├── event/                   # Event features (5 files)
├── workshop/                # Workshop features (6 files)
├── meeting/                 # Meeting features (1 file)
└── notif/                   # Notification features (3 files)
```

## Configuration

The `cucumber.json` file configures the test runner:

```json
{
  "default": {
    "import": [
      "features/support/**/*.ts",
      "features/step_definitions/**/*.ts"
    ],
    "paths": ["features/**/*.feature"],
    "format": [
      "progress-bar",
      "json:reports/cucumber-report.json",
      "html:reports/cucumber-report.html"
    ],
    "language": "fr",
    "formatOptions": {
      "snippetInterface": "async-await"
    },
    "strict": false
  }
}
```

- **language: "fr"** - Uses French Gherkin keywords (Fonctionnalité, Scénario, Étant donné, Quand, Alors)
- **strict: false** - Allows pending scenarios to be reported without failing the test suite
- **Reports** - Generates both JSON (for CI) and HTML (human-readable) reports

## World Class

The `FestipodWorld` class (`features/support/world.ts`) maintains test state:

### Tracked State

| Property | Type | Description |
|----------|------|-------------|
| `currentRoute` | `string` | Current URL hash (e.g., `#/demo/home`) |
| `currentScreenId` | `string` | Current screen identifier |
| `formFields` | `Map` | Form fields with required flag and value |
| `navigationHistory` | `string[]` | All visited routes |
| `isAuthenticated` | `boolean` | Login state |
| `screenSourceContent` | `string` | Raw TypeScript source of current screen |

### Key Methods

- `navigateTo(route)` - Navigate to a screen, load its source code
- `hasField(fieldName)` - Check if a semantic field exists using regex detectors
- `hasText(text)` - Check if text exists in screen source
- `hasElement(selector)` - Check for JSX elements
- `getRenderedText()` - Get the full source code for matching

### Screen Name Mapping

French screen names are mapped to screen IDs:

```typescript
screenNameMap = {
  'accueil': 'home',
  'créer un événement': 'create-event',
  'détail événement': 'event-detail',
  'mon profil': 'profile',
  'profil utilisateur': 'user-profile',
  // ... etc
}
```

### Screen-Specific Field Detectors

Field detection is screen-specific, defined in `screenFieldDetectors` map. Each screen has its own set of regex patterns to identify UI elements:

**event-detail screen:**
| Field | Detection Pattern |
|-------|-------------------|
| Titre | `<Title>content</Title>` |
| Date | 📅 emoji + French month name + year |
| Heure | 🕓 emoji + time pattern (e.g., 14h30) |
| Lieu | 📍 emoji + capitalized location name |
| Description | "À propos" section with 50+ chars of text |
| Photo | `<Avatar` component |

**user-profile / profile screens:**
| Field | Detection Pattern |
|-------|-------------------|
| Nom | `<Title>` with capitalized first/last name |
| Pseudo | `@username` pattern |
| Photo / Photo de profil | `<Avatar` component |

These patterns match what currently exists in each screen's source code. When UI changes, patterns must be updated accordingly.

## Step Definition Design Principles

Step definitions follow strict principles to ensure they are **readable**, **specific**, and **verifiable**:

### 1. Inline Detection Logic (No Abstraction)

All detection logic must be written directly in step definitions, not in separate utility functions. This is critical because:
- The step definition code is displayed in the app's "Définitions" view
- Users must see the exact detection logic when reviewing specs
- Abstraction hides the "how" and prevents quick verification

**Correct approach:**
```typescript
Then('je peux annuler et revenir à l\'écran précédent', async function (this: FestipodWorld) {
  expect(this.currentScreenId).to.equal('create-event');
  const source = this.getRenderedText();
  // Detect ✕ close button with onClick handler that calls navigate()
  const found = /onClick\s*=\s*\{\s*\(\)\s*=>\s*navigate\s*\(['"]home['"]\)\s*\}[^>]*>✕</.test(source);
  expect(found, 'Create event screen should have ✕ button with navigate("home")').to.be.true;
});
```

**Avoid (abstraction hides logic):**
```typescript
// DON'T DO THIS - the function hides the detection logic from the UI
const result = hasBackNavigation(source);
expect(result.found).to.be.true;
```

### 2. Specific Patterns (No Future Anticipation)

Detection patterns must match **exactly what exists in the codebase today**. Do not use OR patterns or generic matching to anticipate future variations that don't exist yet.

**Correct approach:**
```typescript
// CreateEventScreen.tsx has: onClick={() => navigate('home')}...>✕<
const found = /onClick\s*=\s*\{\s*\(\)\s*=>\s*navigate\s*\(['"]home['"]\)\s*\}[^>]*>✕</.test(source);
```

**Avoid (anticipates variations that don't exist):**
```typescript
// DON'T DO THIS - the app doesn't have "Retour", "←", or "Annuler" buttons
const found = /✕|←|Retour|Annuler/.test(source);
```

### 3. Code Duplication is Acceptable

If multiple steps need similar detection logic, duplicate the code. This maintains readability and allows each step to evolve independently based on actual screen content.

### 4. Screen-Specific Detection

Each step should know exactly which screen it's testing and what specific patterns to look for in that screen's source code.

### When Tests Fail

A failing test means a specific UI element was removed or changed:

```
AssertionError: Create event screen should have ✕ button with navigate("home")
```

This tells the developer exactly what's missing and where to look. The regex in the step definition shows exactly what pattern was expected.

## Step Definitions

### Navigation Steps (`navigation.steps.ts`)

```gherkin
# Given steps
Étant donné je suis sur la page "accueil"
Étant donné je suis connecté(e)

# When steps
Quand je navigue vers "détail événement"
Quand je clique sur {string}
Quand je clique sur un participant

# Then steps
Alors je suis redirigé vers "profil utilisateur"
Alors je vois l'écran "profile"
Alors l'écran contient une section "Photo de profil"
```

### Form Steps (`form.steps.ts`)

```gherkin
# Validating required fields
Alors le formulaire contient le champ obligatoire "Titre"

# Multiple fields with DataTable
Alors le formulaire contient les champs obligatoires suivants:
  | Titre       |
  | Date        |
  | Description |

# Form interaction
Quand je remplis le champ "Titre" avec "Mon événement"
Quand je laisse le champ "Date" vide
Alors une erreur de validation est affichée pour "Date"
```

### Screen Steps (`screen.steps.ts`)

```gherkin
# Content verification
Alors je peux voir la liste des participants
Alors l'écran affiche les informations de l'événement

# Feature detection (may return 'pending' - see Test Outcomes section below)
Alors je peux ajouter un commentaire
Alors je peux ajouter une note
Alors je peux m'inscrire à l'événement
Alors je peux voir le QR code
```

## Test Outcomes

Every step definition must produce one of two outcomes:

### 1. Pass/Fail (Testable)

When we **can verify** the feature through static source analysis:
- The step runs assertions (`expect(...).to.be.true`)
- If the assertion passes → test passes
- If the assertion fails → test fails with descriptive error message

```typescript
Then('je peux voir la liste des participants', async function (this: FestipodWorld) {
  expect(this.currentScreenId).to.equal('event-detail');
  const source = this.getRenderedText();
  // EventDetailScreen.tsx has: <Avatar components and "Participants (12)" text
  const hasAvatars = /<Avatar/.test(source);
  expect(hasAvatars, 'Event detail should have Avatar components for participants').to.be.true;
});
```

### 2. Pending (Not Testable)

When we **cannot verify** the feature, the step must return `'pending'` with an explanatory message. There are four reasons a test may be pending:

| Prefix | Reason | Example |
|--------|--------|---------|
| `NOT IMPLEMENTED` | Feature doesn't exist in the UI | Comment functionality not in EventDetailScreen.tsx |
| `CANNOT TEST` | Requires browser automation, backend, or database | Form submission requires browser automation |
| `WRONG STEP` | Step is being used on inappropriate screen type | "le formulaire contient..." on a display screen |
| `NOT ON THIS SCREEN` | Feature exists but on a different screen | QR code is on share-profile, not profile |

```typescript
// NOT IMPLEMENTED - feature doesn't exist
Then('je peux ajouter un commentaire', async function (this: FestipodWorld) {
  this.attach('NOT IMPLEMENTED: Comment functionality not in EventDetailScreen.tsx', 'text/plain');
  return 'pending';
});

// CANNOT TEST - requires browser automation
When('je remplis le champ {string} avec {string}', async function (this: FestipodWorld, fieldName: string, value: string) {
  this.attach(`CANNOT TEST: Filling field "${fieldName}" with "${value}" requires browser automation`, 'text/plain');
  return 'pending';
});

// WRONG STEP - step used on wrong screen type
Then('le formulaire contient le champ obligatoire {string}', async function (this: FestipodWorld, fieldName: string) {
  if (this.currentScreenId !== 'create-event') {
    this.attach(`WRONG STEP: "le formulaire contient le champ obligatoire" is for forms. Screen "${this.currentScreenId}" is not a form.`, 'text/plain');
    return 'pending';
  }
  // ... actual test logic ...
});

// NOT ON THIS SCREEN - feature exists elsewhere
Then('je peux voir le QR code', async function (this: FestipodWorld) {
  const source = this.getRenderedText();
  if (this.currentScreenId === 'share-profile') {
    expect(/QR Code/.test(source), 'Share profile should have "QR Code" text').to.be.true;
  } else {
    this.attach(`NOT ON THIS SCREEN: QR code is on share-profile, not "${this.currentScreenId}"`, 'text/plain');
    return 'pending';
  }
});
```

### No Silent Tests

**Critical rule**: A test must never do nothing. Every step definition must either:
1. Run assertions that can pass or fail, OR
2. Return `'pending'` with an explanatory message

This ensures the test suite provides clear feedback about what is tested, what is not testable, and why.

## Hooks

Lifecycle hooks in `features/support/hooks.ts`:

| Hook | Purpose |
|------|---------|
| `BeforeAll` | Log test suite start |
| `Before` | Reset World state, mark `@pending` scenarios as pending |
| `After` | Attach debug info on failure, cleanup |
| `AfterAll` | Log test suite completion |

### Pending Scenarios

Scenarios tagged with `@pending` are automatically marked as pending in the Before hook:

```typescript
Before(async function (this: FestipodWorld, scenario) {
  // ... reset state ...
  const isPending = scenario.pickle.tags.some(tag => tag.name === '@pending');
  if (isPending) {
    return 'pending';
  }
});
```

Use `@pending` for:
- Features not yet implemented
- Email/notification features that cannot be tested via screen analysis
- Scenarios waiting for UI implementation

### Debug Information on Failure

When a scenario fails, the `After` hook attaches:
- Current route
- Current screen ID
- Navigation history
- Form fields state
- Screen source snippet (first 500 chars)

## Running Tests

```bash
# Run all tests end-to-end (runs tests + generates all data files)
bun run test:cucumber
# This runs: cucumber:run → cucumber:report → features:parse → steps:extract

# Sub-commands for individual steps:
bun run cucumber:run      # Only run cucumber tests (generates HTML/JSON reports)
bun run cucumber:report   # Parse results to generate testResults.ts
bun run features:parse    # Parse .feature files to generate features.ts
bun run steps:extract     # Extract step definitions to generate stepDefinitions.ts

# Run by category tag
bun run cucumber:run --tags "@USER"
bun run cucumber:run --tags "@EVENT"
bun run cucumber:run --tags "@NOTIF"

# Run by priority
bun run cucumber:run --tags "@priority-0"

# Exclude pending tests
bun run cucumber:run --tags "not @pending"
```

## Parsing Results

All parsing is included in `bun run test:cucumber`. For manual regeneration:

```bash
bun run cucumber:report   # testResults.ts from cucumber-report.json
bun run steps:extract     # stepDefinitions.ts from step definition files
bun run features:parse    # features.ts from .feature files
```

## Example Feature File

```gherkin
# language: fr
@USER @priority-0
Fonctionnalité: US-9 Visualiser la photo d'un individu
  En tant qu'utilisateur
  Je peux visualiser la photo d'un individu

  Contexte:
    Étant donné je suis connecté en tant qu'utilisateur

  Scénario: Accéder au profil pour voir la photo
    Étant donné je suis sur la page "mon profil"
    Alors je vois l'écran "profile"
    Et l'écran contient une section "Photo de profil"

  Scénario: Naviguer vers le profil depuis la liste des participants
    Étant donné je suis sur la page "détail événement"
    Quand je clique sur un participant
    Alors je suis redirigé vers "profil utilisateur"

  @pending
  Scénario: Fonctionnalité non encore implémentée
    Étant donné je suis sur la page "mon profil"
    Alors je peux modifier ma photo de profil
```

## Key Design Decisions

### Static Source Analysis

Instead of running the app in a browser, tests analyze TypeScript source files directly. This approach:
- Runs faster (no browser startup)
- Doesn't require a running server
- Validates code structure, not runtime behavior

### French-First

All Gherkin keywords and step definitions use French:
- `Fonctionnalité` instead of `Feature`
- `Scénario` instead of `Scenario`
- `Étant donné` instead of `Given`
- `Quand` instead of `When`
- `Alors` instead of `Then`

### Specific Detection (Not Generic)

Tests use patterns that match exactly what exists in the codebase today:
- No OR patterns to anticipate future variations
- No abstraction functions that hide detection logic
- Tests break when UI changes - this is intentional to catch regressions
- When a test fails, the developer must update both the UI and the test pattern

## UI Integration

The Specs page (`#/specs`) displays feature files using the `GherkinHighlighter` component.

### GherkinHighlighter Component

Located at `src/components/specs/GherkinHighlighter.tsx`, this component renders Gherkin content in a card-based UI (not code/text style).

**Key design decisions:**
- **System font**: Uses system UI font instead of the sketchy handwritten font for better readability of specifications
- **Card-based layout**: Each scenario/background is a collapsible card with colored left border
- **No header duplication**: Feature metadata (title, priority, category) is shown in `FeatureView`, not duplicated in `GherkinHighlighter`
- **Background always visible**: The "Contexte" (Background) block is always expanded since it provides essential context
- **Compact responsive design**: Reduced padding/gaps for both mobile and desktop

**Visual features:**
- Toolbar with Expand/Collapse all and "Définitions" toggle
- Color-coded keywords:
  - Blue: Given/Étant donné (preconditions)
  - Amber: When/Quand (actions)
  - Green: Then/Alors (assertions)
  - Gray: And/Et (continuation)
- Test status icons per scenario (CheckCircle2/XCircle/AlertCircle)
- Error messages displayed inline for failed scenarios
- Step definition tooltips when "Définitions" mode is enabled
- Tables rendered as styled HTML tables with alternating row colors

**French/English keyword support:**
The component detects both French and English Gherkin keywords for parsing steps (Étant donné/Given, Quand/When, Alors/Then, Et/And, Exemples/Examples).

**Props:**
```typescript
interface GherkinHighlighterProps {
  content: string;           // Raw Gherkin file content
  scenarioResults?: Array<{  // Test results per scenario
    scenarioName: string;
    status: 'passed' | 'failed' | 'skipped';
    errorMessage?: string;
  }>;
}
```

### Data Layer

Data is generated by build-time scripts:
- `src/data/features.ts` - Parsed feature file content
- `src/data/testResults.ts` - Test execution results
- `src/data/stepDefinitions.ts` - Step definition source code
