# language: fr
@EVENT @priority-1
Fonctionnalité: US-13 Créer/Modifier/Supprimer un événement
  En tant qu'utilisateur
  Je peux créer/modifier/supprimer un événement
  En choisissant les dates, horaires, lieu et thématique
  Afin de créer/présenter le contenu de cet événement et le catégoriser

  Contexte:
    Étant donné je suis connecté en tant qu'utilisateur

  Scénario: Accéder à la création d'événement
    Étant donné je suis sur la page "accueil"
    Quand je navigue vers "créer un événement"
    Alors je vois l'écran "create-event"

  Scénario: Vérifier les champs obligatoires du formulaire
    Étant donné l'écran "create-event" est affiché
    Alors le formulaire contient les champs obligatoires suivants:
      | Nom de l'événement |
      | Date               |
      | Heure de début     |
      | Lieu               |
      | Thématique         |

  Scénario: Remplir le formulaire de création d'événement
    Étant donné je suis sur la page "créer un événement"
    Quand je remplis le champ "Nom de l'événement" avec "Mon événement"
    Et je remplis le champ "Date" avec "2025-02-15"
    Et je remplis le champ "Heure de début" avec "14:00"
    Et je remplis le champ "Lieu" avec "Lyon"
    Et je remplis le champ "Thématique" avec "Technologie"
    Alors le champ "Nom de l'événement" affiche "Mon événement"
    Et le champ "Lieu" affiche "Lyon"

  Scénario: Vérifier la présence du bouton de création
    Étant donné je suis sur la page "créer un événement"
    Alors l'écran contient une section "Créer l'événement"

  Scénario: Pouvoir annuler la création d'événement
    Étant donné je suis sur la page "créer un événement"
    Alors je peux annuler et revenir à l'écran précédent
