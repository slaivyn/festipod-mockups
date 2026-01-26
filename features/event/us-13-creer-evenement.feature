# language: fr
@EVENT @priority-1
Fonctionnalité: US-13 Créer/Modifier/Supprimer un événement
  En tant qu'utilisateur
  Je peux créer/modifier/supprimer un événement
  En choisissant les dates, horaires, lieu et thématique
  Afin de créer/présenter le contenu de cet événement et le catégoriser

  Contexte:
    Étant donné que je suis connecté en tant qu'utilisateur

  Scénario: Accéder à la création d'événement
    Étant donné que je suis sur la page "accueil"
    Quand je navigue vers "créer un événement"
    Alors je vois l'écran "create-event"

  Scénario: Vérifier les champs obligatoires du formulaire
    Étant donné que l'écran "create-event" est affiché
    Alors le formulaire contient les champs obligatoires suivants:
      | Nom de l'événement |
      | Date de début      |
      | Heure de début     |
      | Lieu               |
      | Thématique         |

  Scénario: Vérifier la présence du bouton de création
    Étant donné que je suis sur la page "créer un événement"
    Alors l'écran contient une section "Créer l'événement"

  Scénario: Pouvoir annuler la création d'événement
    Étant donné que je suis sur la page "créer un événement"
    Alors je peux annuler et revenir à l'écran précédent

  Scénario: Modifier un événement
    * Scénario non implémenté

  Scénario: Supprimer un événement
    * Scénario non implémenté

  Scénario: Retirer une organisation (personne ou structure)
    * Scénario non implémenté
