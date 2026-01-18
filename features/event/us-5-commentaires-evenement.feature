# language: fr
@EVENT @priority-3
Fonctionnalité: US-5 Ajouter/modifier/supprimer un commentaire à un événement
  En tant qu'utilisateur
  Je peux consulter et ajouter/modifier/supprimer un commentaire à un événement
  En sélectionnant l'icône "ajouter un commentaire" en dessous du titre
  Afin de voir les commentaires précédents et ajouter mes notes personnelles

  Contexte:
    Étant donné je suis connecté en tant qu'utilisateur

  Scénario: Voir les commentaires existants
    Étant donné je suis sur la page "détail événement"
    Alors l'écran contient une section "Notes personnelles"

  @pending
  Scénario: Ajouter un commentaire
    Étant donné je suis sur la page "détail événement"
    Quand je clique sur "Ajouter un commentaire"
    Alors je peux ajouter un commentaire

  Scénario: Modifier un commentaire
    Étant donné je suis sur la page "détail événement"
    Quand je clique sur "Modifier"
    Alors je peux modifier un commentaire

  Scénario: Supprimer un commentaire
    Étant donné je suis sur la page "détail événement"
    Quand je clique sur "Supprimer"
    Alors je peux supprimer un commentaire

  Scénario: Vérifier les données de l'écran
    Étant donné l'écran "event-detail" est affiché
    Alors le formulaire contient les champs obligatoires suivants:
      | Titre               |
      | Date                |
      | Lieu                |
