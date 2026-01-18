# language: fr
@WORKSHOP @priority-3
Fonctionnalité: US-11 Visualiser le bilan consolidé de l'événement
  En tant qu'utilisateur
  Je peux visualiser le bilan consolidé de l'événement
  En consultant l'ensemble des commentaires regroupés par atelier
  Afin d'obtenir une synthèse du contenu de chaque atelier et de l'ensemble des ateliers

  Contexte:
    Étant donné je suis connecté en tant qu'utilisateur

  Scénario: Accéder au bilan consolidé
    Étant donné je suis sur la page "détail événement"
    Alors l'écran contient une section "Bilan"

  Scénario: Voir les commentaires regroupés par atelier
    Étant donné je suis sur la page "détail événement"
    Quand je clique sur "Voir le bilan"
    Alors l'écran contient une section "Commentaires par atelier"

  @pending
  Scénario: Voir la synthèse globale
    Étant donné je suis sur la page "détail événement"
    Alors l'écran contient une section "Synthèse"

  Scénario: Vérifier les données du bilan
    Étant donné l'écran "event-detail" est affiché
    Alors le formulaire contient les champs obligatoires suivants:
      | Titre               |
      | Date                |
      | Liste des participants |
