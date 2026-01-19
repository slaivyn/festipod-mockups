# language: fr
@EVENT @priority-1
Fonctionnalité: US-3 Visualiser un événement terminé
  En tant qu'utilisateur
  Je peux visualiser un événement terminé et consulter la description de l'événement
  Afin de voir les personnes qui ont participé à cet événement

  Contexte:
    Étant donné que je suis connecté en tant qu'utilisateur

  Scénario: Accéder aux détails d'un événement terminé
    Étant donné que je suis sur la page "accueil"
    Quand je clique sur un événement
    Alors je vois l'écran "event-detail"

  Scénario: Voir la description de l'événement
    Étant donné que je suis sur la page "détail événement"
    Alors l'écran affiche les informations de l'événement

  Scénario: Voir la liste des participants
    Étant donné que je suis sur la page "détail événement"
    Alors je peux voir la liste des participants
