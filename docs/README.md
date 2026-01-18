# Festipod Documentation

This documentation is split into three parts:

## 1. [Festipod Mobile App](./festipod-app.md)

The mobile application being designed - an event discovery and networking platform. This section covers:

- App concept and target users
- User stories (26 stories across 5 categories)
- Screen mockups (13 screens)
- Feature specifications (Cucumber/Gherkin)

## 2. [Prototyping Tool](./prototyping-tool.md)

The web application built to visualize and document the Festipod project. This section covers:

- Architecture and navigation
- Gallery, Demo, Stories, and Specs pages
- Component library (Sketchy UI)
- Build and development setup

## 3. [Cucumber Integration](./cucumber-integration.md)

Technical documentation for the BDD testing framework. This section covers:

- Test architecture and configuration
- World class and state management
- Step definitions (navigation, form, screen)
- Running tests and generating reports

---

## Quick Start

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Run Cucumber tests
bun run test:cucumber

# Parse feature files
bun run features:parse
```

Open http://localhost:3000 to view the prototyping tool.
