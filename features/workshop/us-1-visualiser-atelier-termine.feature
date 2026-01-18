# language: fr
@WORKSHOP @priority-3
Fonctionnalité: US-1 Visualiser un événement terminé (ateliers)
  En tant qu'utilisateur
  Je peux visualiser un événement terminé et consulter le programme détaillé des ateliers par journée/heure
  Afin de voir les personnes qui ont participé à chaque atelier et consulter les notes/liens/commentaires

  Contexte:
    Étant donné que je suis connecté en tant qu'utilisateur

  Scénario: Accéder aux détails d'un événement terminé
    Étant donné que je suis sur la page "accueil"
    Quand je navigue vers "détail événement"
    Alors je vois l'écran "event-detail"
    Et l'écran contient une section "Programme des ateliers"

  Scénario: Consulter la liste des participants d'un atelier
    Étant donné que je suis sur la page "détail événement"
    Alors je peux voir la liste des participants

  Scénario: Consulter les ressources d'un atelier
    Étant donné que je suis sur la page "détail événement"
    Alors l'écran contient une section "Ressources"
    Et l'écran contient une section "Zone de partage collective"

  Scénario: Vérifier les données affichées pour un atelier
    Étant donné que l'écran "event-detail" est affiché
    Alors le formulaire contient les champs obligatoires suivants:
      | Titre               |
      | Date                |
      | Lieu                |
      | Liste des participants |
