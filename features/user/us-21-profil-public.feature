# language: fr
@USER @priority-2
Fonctionnalité: US-21 Décider que tous les utilisateurs puissent suivre mes activités
  En tant qu'utilisateur
  Je peux décider que tous les utilisateurs puissent suivre toutes mes activités
  En déclarant mon profil public
  Afin de communiquer au sujet de mes déplacements et faire la publicité des événements

  Contexte:
    Étant donné que je suis connecté en tant qu'utilisateur

  Scénario: Accéder aux paramètres de profil
    Étant donné que je suis sur la page "mon profil"
    Quand je navigue vers "paramètres"
    Alors je vois l'écran "settings"

  Scénario: Configurer la visibilité du profil
    Étant donné que je suis sur la page "paramètres"
    Alors l'écran contient une section "Confidentialité"

  Scénario: Rendre le profil public
    Étant donné que je suis sur la page "paramètres"
    Quand je clique sur "Profil public"
    Alors l'écran contient une section "Visibilité"

  Scénario: Vérifier les données des paramètres
    Étant donné que l'écran "settings" est affiché
    Alors le formulaire contient les champs obligatoires suivants:
      | Notifications       |
      | Confidentialité     |
      | Rayon de notification |

  Scénario: Vérifier les données du profil
    Étant donné que l'écran "profile" est affiché
    Alors le formulaire contient les champs obligatoires suivants:
      | Photo de profil |
      | Nom             |
      | Pseudo          |
