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
Screen Source Analysis (regex field detectors)
    ↓
Chai Assertions
    ↓
JSON + HTML Reports
```

## Directory Structure

```
features/
├── support/
│   ├── world.ts           # Custom World class with state management
│   └── hooks.ts           # Before/After lifecycle hooks
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

This approach makes tests resilient to minor UI changes while still validating the semantic structure of screens.

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

# Feature detection (returns 'pending' if not implemented)
Alors je peux ajouter un commentaire
Alors je peux ajouter une note
Alors je peux modifier un commentaire
Alors je peux supprimer un commentaire
Alors je peux m'inscrire à l'événement
Alors je peux voir le QR code
Alors je peux filtrer les événements par période
```

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
# Run all tests end-to-end (runs tests + generates internal report)
bun run test:cucumber

# Sub-commands for individual steps:
bun run cucumber:run      # Only run cucumber tests (generates HTML/JSON reports)
bun run cucumber:report   # Only parse results to generate internal report

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

After running tests, parse results for the UI:

```bash
# Generate testResults.ts from cucumber-report.json (included in test:cucumber)
bun run cucumber:report

# Regenerate step definitions data
bun run steps:extract

# Parse feature files for UI display
bun run features:parse
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

### Semantic Field Detection

Rather than checking for specific CSS selectors or test IDs, the integration uses semantic patterns to detect features. For example, detecting a "Date" field by looking for the 📅 emoji pattern makes tests resilient to UI changes.

## UI Integration

The Specs page (`#/specs`) displays feature files with:
- Collapsible scenarios (failed ones open by default)
- Test status indicators (pass/fail/skip)
- Error messages for failed tests
- Step definition source code tooltips (click "Définitions" button)

Data is generated by build-time scripts:
- `src/data/features.ts` - Parsed feature file content
- `src/data/testResults.ts` - Test execution results
- `src/data/stepDefinitions.ts` - Step definition source code
