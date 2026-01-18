# language: fr
@USER @priority-0
Fonctionnalité: US-9 Visualiser la photo d'un individu
  En tant qu'utilisateur
  Je peux visualiser la photo d'un individu ou ajouter une photo personnelle sur une fiche existante
  Et consulter la liste des inscrits à un atelier
  Afin d'identifier les personnes que j'ai rencontrées dont je n'ai pas noté leur nom

  Contexte:
    Étant donné je suis connecté en tant qu'utilisateur

  Scénario: Accéder au profil pour voir la photo
    Étant donné je suis sur la page "mon profil"
    Alors je vois l'écran "profile"
    Et l'écran contient une section "Photo de profil"

  Scénario: Naviguer vers le profil depuis la liste des participants
    Étant donné je suis sur la page "détail événement"
    Quand je clique sur un participant
    Alors je suis redirigé vers "profil utilisateur"
    Et l'écran affiche les informations du profil

  Scénario: Consulter la liste des inscrits à un atelier
    Étant donné je suis sur la page "détail événement"
    Alors je peux voir la liste des participants

  Scénario: Vérifier les champs de données du profil
    Étant donné l'écran "profile" est affiché
    Alors le formulaire contient les champs obligatoires suivants:
      | Photo de profil |
      | Nom             |
      | Pseudo          |
