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
    * Scénario non implémenté

  Scénario: Vérifier les données des paramètres
    * Scénario non implémenté

  Scénario: Vérifier les données du profil
    * Scénario non implémenté
