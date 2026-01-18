# language: fr
@USER @priority-2
Fonctionnalité: US-12 Consulter la carte/tableau des événements
  En tant qu'utilisateur
  Je peux consulter la carte/tableau des événements auxquels j'ai participé
  En filtrant les événements par dates ou par personne
  Afin d'avoir une vue consolidée des événements et lieux de rencontre

  Contexte:
    Étant donné je suis connecté en tant qu'utilisateur

  Scénario: Accéder à la liste des événements depuis le profil
    Étant donné je suis sur la page "mon profil"
    Alors je peux voir la liste des événements

  Scénario: Accéder à la liste des événements depuis découvrir
    Étant donné je suis sur la page "découvrir"
    Alors je peux voir la liste des événements

  Scénario: Filtrer par date
    Étant donné je suis sur la page "découvrir"
    Quand je clique sur "Filtrer par date"
    Alors l'écran contient une section "Filtre par date"

  Scénario: Filtrer par personne
    Étant donné je suis sur la page "profil utilisateur"
    Alors je peux voir les événements auxquels l'utilisateur a participé

  Scénario: Vérifier les données de l'écran événements
    Étant donné l'écran "events" est affiché
    Alors le formulaire contient les champs obligatoires suivants:
      | Liste des événements |
      | Filtre par date      |

  Scénario: Vérifier les données de l'écran profil
    Étant donné l'écran "profile" est affiché
    Alors le formulaire contient les champs obligatoires suivants:
      | Photo de profil |
      | Nom             |
      | Pseudo          |
