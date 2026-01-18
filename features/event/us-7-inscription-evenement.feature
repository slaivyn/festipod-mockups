# language: fr
@EVENT @priority-1
Fonctionnalité: US-7 M'inscrire/me désinscrire à un événement
  En tant qu'utilisateur
  Je peux m'inscrire/me désinscrire à un événement
  Après avoir consulté la description de l'événement, les dates et le lieu
  S'il existe déjà dans le système ou en le retrouvant dans une base existante

  Contexte:
    Étant donné je suis connecté en tant qu'utilisateur

  Scénario: Consulter un événement avant inscription
    Étant donné je suis sur la page "détail événement"
    Alors l'écran affiche les informations de l'événement

  Scénario: S'inscrire à un événement
    Étant donné je suis sur la page "détail événement"
    Quand je clique sur "S'inscrire"
    Alors je peux m'inscrire à l'événement

  Scénario: Se désinscrire d'un événement
    Étant donné je suis sur la page "détail événement"
    Quand je clique sur "Se désinscrire"
    Alors je peux me désinscrire de l'événement

  Scénario: Rechercher un événement existant
    Étant donné je suis sur la page "découvrir"
    Alors je peux voir la liste des événements

  Scénario: Vérifier les données de l'écran
    Étant donné l'écran "event-detail" est affiché
    Alors le formulaire contient les champs obligatoires suivants:
      | Titre               |
      | Date                |
      | Lieu                |
      | Description         |
      | Liste des participants |
