# language: fr
@USER @priority-1
Fonctionnalité: US-10 Visualiser la fiche/le profil d'un participant
  En tant qu'utilisateur
  Je peux sélectionner un individu dans la liste des inscrits à un événement/atelier
  Afin de voir les événements auxquels la personne a participé et voir un formulaire de contact

  Contexte:
    Étant donné je suis connecté en tant qu'utilisateur

  Scénario: Accéder au profil d'un participant
    Étant donné je suis sur la page "détail événement"
    Quand je clique sur un participant
    Alors je vois l'écran "user-profile"

  Scénario: Voir les événements du participant
    Étant donné je suis sur la page "profil utilisateur"
    Alors je peux voir les événements auxquels l'utilisateur a participé

  Scénario: Voir le formulaire de contact
    Étant donné je suis sur la page "profil utilisateur"
    Alors je peux contacter l'utilisateur

  Scénario: Vérifier les informations du profil
    Étant donné l'écran "user-profile" est affiché
    Alors le formulaire contient les champs obligatoires suivants:
      | Photo de profil |
      | Nom             |
      | Pseudo          |

  Scénario: Voir les détails du profil utilisateur
    Étant donné je suis sur la page "profil utilisateur"
    Alors l'écran affiche les informations du profil
