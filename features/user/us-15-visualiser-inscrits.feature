# language: fr
@USER @priority-1
Fonctionnalité: US-15 Visualiser les inscrits à un atelier/événement
  En tant qu'utilisateur
  Je peux visualiser les inscrits à un atelier/événement
  En sélectionnant l'atelier/l'événement désiré dans la liste
  Afin de consulter la liste des inscrits triée par ordre alphabétique

  Contexte:
    Étant donné je suis connecté en tant qu'utilisateur

  Scénario: Accéder à la liste des inscrits
    Étant donné je suis sur la page "détail événement"
    Alors je peux voir la liste des participants

  Scénario: Voir la liste triée
    Étant donné je suis sur la page "détail événement"
    Alors l'écran contient une section "Participants"

  Scénario: Cliquer sur un inscrit pour voir son profil
    Étant donné je suis sur la page "détail événement"
    Quand je clique sur un participant
    Alors je vois l'écran "user-profile"

  Scénario: Vérifier les données de l'écran
    Étant donné l'écran "event-detail" est affiché
    Alors le formulaire contient les champs obligatoires suivants:
      | Titre               |
      | Date                |
      | Liste des participants |
