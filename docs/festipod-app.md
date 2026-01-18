# Festipod Mobile App

Festipod is a mobile application for discovering, organizing, and attending events. It emphasizes community building and networking through shared activities.

## Concept

The app helps users:
- Discover nearby events and festivals
- Organize their own events with workshops
- Connect with other participants before and during events
- Build a network of contacts with shared interests

## User Stories

26 user stories organized by category and priority.

### Priority Levels

| Priority | Label | Description |
|----------|-------|-------------|
| P0 | Impossible | Not feasible or out of scope |
| P1 | Haute | Core features, must-have |
| P2 | Moyenne | Important features |
| P3 | Basse | Nice-to-have features |

### Categories

| Category | Color | Stories |
|----------|-------|---------|
| EVENT | Blue | Event creation and management |
| WORKSHOP | Green | Workshop scheduling within events |
| USER | Purple | User profiles and networking |
| MEETING | Orange | Meeting points and connections |
| NOTIF | Pink | Notifications and alerts |

### Stories by Priority

#### P1 - Haute (8 stories)

| ID | Category | Title |
|----|----------|-------|
| US-3 | EVENT | Consulter les evenements termines |
| US-7 | EVENT | S'inscrire ou se desinscrire d'un evenement |
| US-10 | USER | Consulter le profil et les coordonnees des participants |
| US-13 | EVENT | Creer, modifier ou supprimer un evenement |
| US-15 | USER | Consulter la liste des participants |
| US-16 | MEETING | Indiquer les points de rencontres |
| US-20 | USER | Consulter la liste des contacts et profils publics |
| US-23 | USER | Se connecter avec un autre utilisateur |

#### P2 - Moyenne (9 stories)

| ID | Category | Title |
|----|----------|-------|
| US-12 | USER | Consulter la carte ou le tableau des evenements |
| US-17 | NOTIF | Recevoir des notifications d'evenements |
| US-18 | NOTIF | Etre notifie des nouveaux inscrits |
| US-19 | NOTIF | Recevoir un recap des evenements |
| US-21 | USER | Rendre son profil public |
| US-22 | USER | Parrainer un nouvel utilisateur |
| US-24 | NOTIF | Etre notifie quand un contact participe |
| US-25 | NOTIF | Recevoir des alertes d'evenements proches |
| US-26 | USER | Definir le rayon de notification |

#### P3 - Basse (8 stories)

| ID | Category | Title |
|----|----------|-------|
| US-1 | WORKSHOP | Consulter les evenements termines avec programme |
| US-2 | WORKSHOP | Ajouter des notes et ressources aux ateliers |
| US-4 | WORKSHOP | Ajouter des commentaires aux ateliers |
| US-6 | WORKSHOP | S'inscrire aux ateliers |
| US-8 | EVENT | Creer un macro-evenement |
| US-11 | WORKSHOP | Consulter le resume consolide |
| US-14 | WORKSHOP | Creer des ateliers dans un evenement |

#### P0 - Impossible (1 story)

| ID | Category | Title |
|----|----------|-------|
| US-9 | USER | Visualiser les photos des utilisateurs |

## Screens

13 mockup screens organized by section.

### Home

| Screen ID | Name | Description |
|-----------|------|-------------|
| home | Accueil | Dashboard with upcoming events |

### Events

| Screen ID | Name | Description |
|-----------|------|-------------|
| events | Decouvrir | Browse available events |
| event-detail | Detail evenement | Full event details and participants |
| create-event | Creer un evenement | Event creation form |
| invite | Inviter | Share event with friends |
| participants-list | Liste participants | Full participants list |
| meeting-points | Points de rencontre | Set/view meeting points |

### User

| Screen ID | Name | Description |
|-----------|------|-------------|
| profile | Mon profil | Current user profile |
| user-profile | Profil utilisateur | View other user's profile |
| friends-list | Mon reseau | Friends and public profiles |
| share-profile | Partager profil | Share profile via QR/link |

### General

| Screen ID | Name | Description |
|-----------|------|-------------|
| login | Connexion | Login screen |
| settings | Parametres | App settings and notifications |

## Screen-Story Mapping

Each screen is linked to one or more user stories:

| Screen | Linked Stories |
|--------|----------------|
| home | US-19 |
| events | US-3, US-25 |
| event-detail | US-7, US-10, US-15, US-16 |
| create-event | US-13 |
| participants-list | US-15 |
| meeting-points | US-16 |
| profile | US-21, US-22 |
| user-profile | US-10, US-20 |
| friends-list | US-20 |
| share-profile | US-22, US-23 |
| settings | US-17, US-24, US-25, US-26 |

## Feature Specifications

BDD specifications written in Gherkin (French) are located in `features/`:

```
features/
  event/       # 5 feature files
  workshop/    # 6 feature files
  user/        # 11 feature files
  meeting/     # 1 feature file
  notif/       # 3 feature files
```

Each feature file maps to a user story (e.g., `us-13-creer-evenement.feature` for US-13).

### Gherkin Keywords (French)

| French | English | Purpose |
|--------|---------|---------|
| Fonctionnalite | Feature | Feature title |
| Contexte | Background | Shared preconditions |
| Scenario | Scenario | Test case |
| Etant donne | Given | Initial state |
| Quand | When | Action |
| Alors | Then | Expected result |
| Et | And | Additional step |

## Design Language

The mockups use a "Sketchy" design aesthetic:
- Hand-drawn borders and rounded corners
- Informal, prototype-style appearance
- Comic Sans-inspired typography
- Mobile-first (375x812 phone dimensions)
- Bottom navigation bar with icons
