# language: fr
@USER @priority-2
Fonctionnalité: US-26 Définir la portée d'un événement
  En tant qu'utilisateur
  Je peux relayer/présenter le contenu d'un événement et le catégoriser par type/thématique
  En indiquant son rayon d'intérêt en kilomètres
  Afin de m'assurer que les utilisateurs qui habitent trop loin ne reçoivent pas de notification

  Contexte:
    Étant donné que je suis connecté en tant qu'utilisateur

  Scénario: Accéder au formulaire de relai d'événement
    Étant donné que je suis sur la page "accueil"
    Quand je navigue vers "relayer un événement"
    Alors je vois l'écran "create-event"

  Scénario: Définir le rayon d'intérêt
    * Scénario non implémenté

  Scénario: Choisir une thématique
    Étant donné que je suis sur la page "relayer un événement"
    Alors l'écran contient une section "Thématique"

  Scénario: Vérifier les champs obligatoires
    Étant donné que l'écran "create-event" est affiché
    Alors le formulaire contient les champs obligatoires suivants:
      | Nom de l'événement |
      | Date de début      |
      | Heure de début     |
      | Lieu               |
      | Thématique         |
