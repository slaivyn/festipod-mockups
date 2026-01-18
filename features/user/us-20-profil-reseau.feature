# language: fr
@USER @priority-1
Fonctionnalité: US-20 Voir le profil des personnes faisant partie de mon réseau
  En tant qu'utilisateur
  Je peux voir le profil des personnes faisant partie de mon réseau
  Ainsi que le profil des personnes publiques
  Et consulter la description de l'événement afin de savoir si je veux participer

  Contexte:
    Étant donné que je suis connecté en tant qu'utilisateur

  Scénario: Accéder à mon profil
    Étant donné que je suis sur la page "accueil"
    Quand je navigue vers "mon profil"
    Alors je vois l'écran "profile"

  Scénario: Voir mon réseau
    Étant donné que je suis sur la page "mon profil"
    Alors l'écran contient une section "Mon réseau"

  Scénario: Voir un profil de mon réseau
    Étant donné que je suis sur la page "mon profil"
    Quand je clique sur un participant
    Alors je vois l'écran "user-profile"

  Scénario: Consulter un événement depuis un profil
    Étant donné que je suis sur la page "profil utilisateur"
    Quand je clique sur un événement
    Alors je vois l'écran "event-detail"

  Scénario: Vérifier les données du profil
    Étant donné que l'écran "profile" est affiché
    Alors le formulaire contient les champs obligatoires suivants:
      | Photo de profil |
      | Nom             |
      | Pseudo          |
