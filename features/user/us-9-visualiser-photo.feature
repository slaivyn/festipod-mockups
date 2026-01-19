# language: fr
@USER @priority-0
Fonctionnalité: US-9 Visualiser la photo d'un individu
  En tant qu'utilisateur
  Je peux visualiser la photo d'un individu ou ajouter une photo personnelle sur une fiche existante
  Et consulter la liste des inscrits à un atelier
  Afin d'identifier les personnes que j'ai rencontrées dont je n'ai pas noté leur nom

  Contexte:
    Étant donné que je suis connecté en tant qu'utilisateur

  Scénario: Accéder au profil pour voir la photo
    * Scénario non implémenté

  Scénario: Naviguer vers le profil depuis la liste des participants
    Étant donné que je suis sur la page "détail événement"
    Quand je clique sur un participant
    Alors je suis redirigé vers "profil utilisateur"
    Et l'écran affiche les informations du profil

  Scénario: Consulter la liste des inscrits à un atelier
    Étant donné que je suis sur la page "détail événement"
    Alors je peux voir la liste des participants

  Scénario: Vérifier les champs de données du profil
    * Scénario non implémenté
