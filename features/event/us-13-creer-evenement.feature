# language: fr
@EVENT @priority-1
Fonctionnalité: US-13 Relayer/Modifier/Supprimer un événement
  En tant qu'utilisateur
  Je peux relayer/modifier/supprimer un événement
  En choisissant les dates, horaires, lieu et thématique
  Afin de relayer/présenter le contenu de cet événement et le catégoriser

  Contexte:
    Étant donné que je suis connecté en tant qu'utilisateur

  Scénario: Accéder au formulaire de relai d'événement
    Étant donné que je suis sur la page "accueil"
    Quand je navigue vers "relayer un événement"
    Alors je vois l'écran "create-event"

  Scénario: Vérifier les champs obligatoires du formulaire
    Étant donné que l'écran "create-event" est affiché
    Alors le formulaire contient les champs obligatoires suivants:
      | Nom de l'événement |
      | Date de début      |
      | Heure de début     |
      | Lieu               |
      | Thématique         |

  Scénario: Vérifier la présence du bouton de relai
    Étant donné que je suis sur la page "relayer un événement"
    Alors l'écran contient une section "Relayer l'événement"

  Scénario: Pouvoir annuler le relai d'événement
    Étant donné que je suis sur la page "relayer un événement"
    Alors je peux annuler et revenir à l'écran précédent

  Scénario: Modifier un événement
    * Scénario non implémenté

  Scénario: Supprimer un événement
    * Scénario non implémenté

  Scénario: Retirer une organisation (personne ou structure)
    * Scénario non implémenté
