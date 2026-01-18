# language: fr
@WORKSHOP @priority-3
Fonctionnalité: US-4 Ajouter/modifier/supprimer un commentaire à un atelier
  En tant qu'utilisateur
  Je peux consulter et ajouter/modifier/supprimer un commentaire à un atelier
  En sélectionnant l'icône "ajouter un commentaire" en dessous du titre de l'atelier
  Afin de voir les commentaires précédents et ajouter mes commentaires

  Contexte:
    Étant donné que je suis connecté en tant qu'utilisateur

  Scénario: Voir les commentaires existants d'un atelier
    Étant donné que je suis sur la page "détail événement"
    Alors l'écran contient une section "Commentaires"

  @pending
  Scénario: Ajouter un commentaire à un atelier
    Étant donné que je suis sur la page "détail événement"
    Quand je clique sur "Ajouter un commentaire"
    Alors je peux ajouter un commentaire

  Scénario: Modifier un commentaire existant
    Étant donné que je suis sur la page "détail événement"
    Quand je clique sur "Modifier"
    Alors je peux modifier un commentaire

  Scénario: Supprimer un commentaire
    Étant donné que je suis sur la page "détail événement"
    Quand je clique sur "Supprimer"
    Alors je peux supprimer un commentaire
