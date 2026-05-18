# Refactor multi-store NextGraph

**Status:** Incubating — aucun travail démarré
**Last updated:** 2026-05-17

## Context

L'app Festipod est aujourd'hui *mono-store* : tout ce que l'app écrit (events, profils, participations, friendships) atterrit dans le `private_store` de l'utilisateur connecté. C'est un héritage du sample expense-tracker-rdf, formalisé dans [la décision du 2026-03-17](../decisions/2026-03-17-1600-private-store-nuri-scope.md).

Ce choix bloque toute évolution vers du multi-utilisateurs : par construction le `private_store` est non partageable (cf. [data-layer](../knowledge/data-layer.md) et la doc NextGraph officielle — *« It is not possible to share the documents of your private store with anybody else »*). Tant que tout est dans le private_store, Bob ne pourra jamais voir l'event d'Alice.

Le modèle natif NextGraph est *multi-store par utilisateur* (private, protected, public, group, dialog) — chaque type d'information a sa place. Festipod doit s'aligner sur ce modèle avant de pouvoir devenir collaboratif.

**Déclencheur :** discussion du 2026-05-17 sur la suite multi-user. Décision prise : *poser le cap, exécuter plus tard*.

## What We Know

### État actuel du code

Deux fichiers concentrent le hardcoding du store unique :

- `src/shared/utils/ngGraph.ts:30` — `ensureGraphNuri()` retourne `did:ng:${session.private_store_id}` pour TOUTES les entités, peu importe leur nature.
- `src/shared/hooks/useShapeWithDefaults.ts` — accepte un `storeNuri` mais l'appelant unique (`FestipodDataContext`) lui passe systématiquement le NURI du private_store.

Entités impactées (toutes mélangées dans le même store aujourd'hui) :
- `FpEvent` — devrait vivre dans un store partagé (logique multi-user)
- `FpUserProfile` — devrait être en partie privée, en partie publique
- `FpParticipation` — liée à un event, devrait vivre avec lui
- `FpMeetingPoint` — actuellement local-only côté types ([`src/shared/data/types.ts:106`](../../src/shared/data/types.ts)), pas encore branché à NextGraph
- `FpFriendship` — actuellement local-only, naturellement privée

### Modèle cible proposé

Structure hiérarchique en **4 niveaux de Group stores** (pas de private/public pour le métier collaboratif — tout en Group) :

```
┌─ Group store « index communautaire » ────────────────────┐
│  Référence tous les events visibles dans la communauté   │
│  Lecture par tous les membres, sert d'annuaire/discovery │
│                                                          │
│  ┌─ Group store « communauté » ──────────────────────┐   │
│  │  Propriétaire de l'event                          │   │
│  │  Permissions = qui peut modifier l'event          │   │
│  │  (organisateurs / membres de la communauté)       │   │
│  │                                                   │   │
│  │  ┌─ Group store « event » ─────────────────────┐  │   │
│  │  │  Tout ce qui se rattache à l'event :        │  │   │
│  │  │  participations, infos pratiques, discu…    │  │   │
│  │  │  Membres = participants à l'event           │  │   │
│  │  │                                             │  │   │
│  │  │  ┌─ Group store « meeting point » ───────┐  │  │   │
│  │  │  │  Un RDV de l'event = son propre group │  │  │   │
│  │  │  │  Permet participations + discu        │  │  │   │
│  │  │  │  scopées au point de rencontre        │  │  │   │
│  │  │  └───────────────────────────────────────┘  │  │   │
│  │  └─────────────────────────────────────────────┘  │   │
│  └───────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────┘
```

Mapping entités → store cible :

| Entité | Store cible | Justification |
|---|---|---|
| Event (métadonnées : titre, dates, description) | Group store « communauté » | C'est la communauté qui possède l'event, donc qui contrôle qui peut le modifier |
| Référence d'event (pointeur depuis l'index) | Group store « index communautaire » | Discovery : « voici les events visibles » |
| Participation | Group store « event » | Une participation n'a de sens que dans le contexte de son event |
| MeetingPoint (métadonnées) | Group store « event » | Le RDV appartient à l'event |
| Participation à un MeetingPoint | Group store « meeting point » | RSVP/présence scopés au RDV |
| UserProfile (partie publique) | public_store de l'utilisateur | Modèle natif NextGraph |
| Friendship | private_store de l'utilisateur | Donnée purement personnelle |

### Contrainte SDK bloquante

La création de Group stores et la gestion des invitations/permissions **ne sont pas exposées dans le SDK `@ng-org/web` actuel** (version `0.1.2-alpha.11`). Les méthodes disponibles : `doc_create`, `doc_subscribe`, `sparql_query/update`, `orm_start_*`, `file_get`, `app_request_stream`. Aucune méthode `share_doc`, `invite_user`, `create_group_store`, `accept_invite`. La doc NextGraph annonce qu'*« An API will be provided for permission manipulation »* — pas de date.

**Implication :** le refactor *structurel* (passer d'un store unique à un système de stores par entité) peut commencer sans attendre cette API, en utilisant des placeholders (par ex. continuer à pointer vers `private_store_id` pour les Group stores qui ne peuvent pas encore exister). Mais l'**aboutissement complet** (vrai multi-user, partage entre wallets distincts) dépend de l'arrivée de l'API SDK ou d'un contournement (fork du wallet, accès Rust direct, etc.).

### Implications côté code

Le refactor touche au moins :

1. **Disparition de `ensureGraphNuri()`** comme helper unique. Remplacé par des helpers par entité (`getEventStore(communityId)`, `getParticipationStore(eventId)`, `getProfileStore(scope: 'public' | 'private')`, …) ou par une couche `storeRegistry` qui résout le NURI selon `(entité, contexte)`.
2. **`useShapeWithDefaults` reste un wrapper utile** mais l'appelant choisit explicitement le store. Aujourd'hui un seul appelant ([`FestipodDataContext`](../../src/shared/context/FestipodDataContext.tsx)), demain N appelants ou un appelant qui résout dynamiquement.
3. **Chaque entité de domaine déclare son store cible** — soit via un mapping centralisé, soit via une convention (shape → store).
4. **`bootstrapWallet()`** ([`src/shared/utils/ngBootstrap.ts`](../../src/shared/utils/ngBootstrap.ts)) doit être revu : on ne seed plus dans un unique store, on doit seed dans plusieurs (ou décider que seed ne crée que des données de l'utilisateur courant — ce qui colle mieux à la réalité multi-user).
5. **`FestipodDataContext`** : structurer les hooks par entité, chacun avec son store résolu.

## Open Questions

1. **Quand crée-t-on un Group store de communauté ?** L'API n'existe pas en SDK aujourd'hui. Faut-il que ce soit un acte explicite de l'utilisateur (« créer une communauté ») ou bien tout user a une communauté par défaut à la création de son wallet ?
2. **Comment Bob connaît-il l'index communautaire d'Alice ?** Discovery toujours ouverte — possiblement via le public_store d'Alice qui annonce le NURI de l'index communautaire.
3. **Faut-il vraiment 4 niveaux d'imbrication ?** Le « meeting point comme group store » mérite d'être validé — quel besoin réel justifie une couche de permission supplémentaire vs un simple sous-graphe du group store de l'event ?
4. **Que devient le seed de démo** quand l'app est multi-store et que les Group stores ne peuvent pas encore exister ? Mode dégradé en private_store le temps que le SDK rattrape, ou retirer le seed en mode connecté ?
5. **Migration des wallets existants** : les wallets de test ont déjà des données dans le private_store. Comment on les fait évoluer (script de migration, wipe and reseed, ignore) ?
6. **Bootstrap d'un user vierge** : à la première connexion, faut-il auto-créer un Group store communautaire « par défaut » pour lui ou attendre une action utilisateur ?

## Possible Approaches

Esquisses sans engagement (les arbitrages se feront dans une décision dédiée au moment de l'exécution) :

- **Refactor structurel d'abord, partage ensuite.** Réorganiser l'app en multi-store dès maintenant en utilisant `private_store_id` comme placeholder pour les Group stores manquants. Quand l'API arrive, on remplace les placeholders par de vrais NURIs de Group stores.
- **Registry centralisé** vs **résolution par convention**. Soit un `storeRegistry.ts` qui mappe explicitement `(entité, contexte) → NURI`, soit chaque shape porte sa propre logique de scope.
- **Big-bang** vs **par entité**. Tout migrer en un coup vs migrer entité par entité (commencer par Event qui est le plus stratégique).
- **Maintenir un mode mono-store** parallèle pour le dev/demo tant que les Group stores ne sont pas fonctionnels.

## Out of Scope

Ce brief — et le refactor qui en découlera — **ne traite pas** :
- L'invitation effective d'utilisateurs à un Group store (capability sharing, Nuri d'invitation)
- La gestion des permissions par rôle (organisateur / membre / lecteur)
- La résolution du problème de discovery cross-wallet
- Le contournement éventuel de l'UI wallet (jugée dysfonctionnelle dans cette conversation)
- Le mode P2P direct sans broker

Ces sujets relèvent d'un **second chantier multi-user** dont le refactor multi-store est seulement le *prérequis structurel*.

## Starting Points

- [decision: private_store NURI scope](../decisions/2026-03-17-1600-private-store-nuri-scope.md) — la décision actuelle qu'on viendra modifier
- [knowledge: data-layer](../knowledge/data-layer.md) — état actuel du pattern d'écriture
- [`src/shared/utils/ngGraph.ts`](../../src/shared/utils/ngGraph.ts) — point de hardcoding principal
- [`src/shared/hooks/useShapeWithDefaults.ts`](../../src/shared/hooks/useShapeWithDefaults.ts) — l'autre point de hardcoding
- [`src/shared/context/FestipodDataContext.tsx`](../../src/shared/context/FestipodDataContext.tsx) — l'unique appelant aujourd'hui
- [`src/shared/utils/ngBootstrap.ts`](../../src/shared/utils/ngBootstrap.ts) — le seed à revoir
- NextGraph docs : [Documents et Stores](https://docs.nextgraph.org/en/documents/), [Getting started](https://docs.nextgraph.org/en/getting-started/)
