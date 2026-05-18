# language: fr
@EVENT @priority-1
Fonctionnalité: Cycle de vie d'un événement
  En tant qu'utilisateur connecté
  Je peux créer, consulter, modifier et participer à des événements
  Et ces actions persistent dans mon portefeuille NextGraph

  Contexte:
    Étant donné que le portefeuille contient des données de test

  # --- Création et persistance ---

  @e2e
  Scénario: Créer un événement et vérifier qu'il apparaît sur l'accueil
    Quand l'utilisateur navigue vers l'écran "create-event"
    Et l'utilisateur remplit le formulaire de création d'événement:
      | champ                | valeur                        |
      | Nom de l'événement   | Pique-nique au parc           |
      | Date de début        | 2026-06-15                    |
      | Heure de début       | 14:00                         |
      | Lieu                 | Parc Bordelais, Bordeaux      |
    Et l'utilisateur clique sur le bouton "Relayer l'événement"
    Alors l'application affiche l'écran "event-detail"
    Et l'écran contient le texte "Pique-nique au parc"
    Quand l'utilisateur navigue vers l'écran "home"
    Alors l'écran contient le texte "Pique-nique au parc"

  @e2e
  Scénario: L'événement créé persiste après reconnexion
    Alors l'écran d'accueil contient le texte "Pique-nique au parc"

  # --- Consultation ---

  @e2e
  Scénario: Consulter le détail d'un événement depuis l'accueil
    Quand l'utilisateur clique sur un événement de l'accueil
    Alors l'application affiche l'écran "event-detail"
    Et l'écran contient le texte "Participants"

  # --- Inscription / Désinscription ---

  @e2e
  Scénario: S'inscrire à un événement
    Quand l'utilisateur navigue vers l'écran "events"
    Et l'utilisateur clique sur un événement de la liste
    Et l'utilisateur attend que l'écran "event-detail" soit affiché
    Et l'utilisateur clique sur le bouton "J'y serai" si visible
    Alors l'écran contient le texte "Je participe"

  # ngSet.delete() updates UI but doesn't persist — NG ORM limitation.
  @e2e @wip
  Scénario: Se désinscrire d'un événement
    Quand l'utilisateur navigue vers l'écran "events"
    Et l'utilisateur clique sur un événement de la liste
    Et l'utilisateur attend que l'écran "event-detail" soit affiché
    Et l'utilisateur clique sur le bouton "Je participe"
    Alors l'écran contient le texte "J'y serai"

  @e2e @wip
  Scénario: La désinscription persiste après reconnexion
    Quand l'utilisateur navigue vers l'écran "events"
    Et l'utilisateur clique sur un événement de la liste
    Et l'utilisateur attend que l'écran "event-detail" soit affiché
    Alors l'écran contient le texte "J'y serai"

  # --- Modification ---

  @e2e
  Scénario: Modifier un événement et vérifier la persistance
    Quand l'utilisateur navigue vers l'écran "home"
    Et l'utilisateur clique sur un événement de l'accueil
    Et l'utilisateur attend que l'écran "event-detail" soit affiché
    Et l'utilisateur clique sur le bouton de modification
    Et l'utilisateur attend que l'écran "update-event" soit affiché
    Et l'utilisateur modifie le champ lieu avec "Jardin Public, Bordeaux"
    Et l'utilisateur clique sur le bouton "Enregistrer les modifications"
    Alors l'application affiche l'écran "event-detail"
    Et l'écran contient le texte "Jardin Public"
