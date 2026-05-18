# language: fr
@AUTH @priority-1
Fonctionnalité: Connexion NextGraph et chargement des données
  En tant qu'utilisateur
  Je peux me connecter à mon portefeuille NextGraph
  Et charger les données de test dans mon portefeuille
  Afin d'utiliser l'application avec mes propres données

  # --- UI layer: écran de connexion ---

  @ui
  Scénario: L'écran de connexion affiche le bouton NextGraph
    Étant donné je suis sur la page "connexion"
    Alors l'écran contient un bouton "Se connecter avec NextGraph"

  @ui @wip
  # Behavioral: requires simulating an NG status change. Better tested at the
  # @e2e layer where a real connected session triggers the redirect.
  Scénario: L'écran de connexion redirige automatiquement quand connecté
    Étant donné je suis sur la page "connexion"
    Alors l'écran gère la redirection automatique après connexion

  @ui
  Scénario: L'état initial est "en cours" quand une connexion est en attente
    Étant donné je suis sur la page "connexion"
    Alors l'écran gère l'état de connexion en cours

  @ui
  Scénario: Aucune donnée de démonstration n'est visible pendant la connexion
    Étant donné je suis sur la page "connexion"
    Alors l'écran n'importe pas de données de démonstration

  # --- Data layer: comportement du portefeuille ---

  @data
  Scénario: Un portefeuille connecté est vide par défaut
    Alors le portefeuille est connecté
    Et le portefeuille ne contient aucun événement de démonstration

  @data
  Scénario: Charger les données de test dans le portefeuille
    Étant donné que le portefeuille est vide
    Quand je charge les données de test
    Alors le portefeuille contient des événements
    Et le portefeuille contient des utilisateurs

  @data
  Scénario: Les données de test ne sont pas rechargées si le portefeuille contient déjà des données
    Étant donné que le portefeuille contient déjà des événements
    Quand je charge les données de test
    Alors le nombre d'événements n'a pas changé

  @data
  Scénario: Les données du portefeuille sont distinctes des données par défaut
    Étant donné que le portefeuille est vide
    Quand je charge les données de test
    Alors les événements ont des identifiants NextGraph
    Et les utilisateurs ont des identifiants NextGraph

  # --- E2E layer: comportement réel dans le navigateur ---

  @e2e
  Scénario: L'écran de connexion redirige vers l'accueil si déjà connecté
    Quand l'utilisateur navigue vers l'écran "login"
    Alors l'application affiche l'écran "home"

  @e2e
  Scénario: La navigation interne met à jour l'URL
    Quand l'utilisateur navigue vers l'écran "events"
    Alors l'URL contient "/events"

  @e2e
  Scénario: L'application ne redirige pas vers le broker quand elle est dans l'iframe
    Alors l'application est toujours dans l'iframe

  @e2e
  Scénario: La liste des événements est peuplée après connexion
    Quand l'utilisateur navigue vers l'écran "events"
    Alors l'écran d'accueil affiche des événements
