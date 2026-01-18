# language: fr
@WORKSHOP @priority-3
Fonctionnalité: US-14 Créer/Modifier/Supprimer un atelier
  En tant qu'utilisateur
  Je peux créer/modifier/supprimer un atelier
  En sélectionnant mon événement et en saisissant les dates et horaires de l'atelier
  Afin de définir le programme de mon événement et ajouter une description

  Contexte:
    Étant donné je suis connecté en tant qu'utilisateur

  Scénario: Accéder à la création d'atelier
    Étant donné je suis sur la page "créer un événement"
    Alors l'écran contient une section "Ateliers"

  Scénario: Vérifier les champs obligatoires pour créer un atelier
    Étant donné l'écran "create-event" est affiché
    Alors le formulaire contient les champs obligatoires suivants:
      | Nom de l'événement |
      | Date               |
      | Heure de début     |
      | Lieu               |
      | Thématique         |

  Scénario: Créer un atelier
    Étant donné je suis sur la page "créer un événement"
    Quand je clique sur "Ajouter un atelier"
    Alors l'écran contient une section "Nouvel atelier"

  Scénario: Modifier un atelier existant
    Étant donné je suis sur la page "créer un événement"
    Quand je clique sur "Modifier l'atelier"
    Alors l'écran contient une section "Modifier l'atelier"

  Scénario: Supprimer un atelier
    Étant donné je suis sur la page "créer un événement"
    Quand je clique sur "Supprimer l'atelier"
    Alors l'écran contient une section "Confirmation"
