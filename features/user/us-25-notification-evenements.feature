# language: fr
@USER @priority-2
Fonctionnalité: US-25 Être averti des événements susceptibles de m'intéresser
  En tant qu'utilisateur
  Je peux être notifié lorsqu'un nouvel événement est ajouté près de chez moi
  Et/ou avec une thématique qui m'intéresse
  En configurant mes notifications

  Contexte:
    Étant donné que je suis connecté en tant qu'utilisateur

  Scénario: Accéder aux paramètres de notification
    Étant donné que je suis sur la page "paramètres"
    Alors l'écran contient une section "Notifications"

  Scénario: Configurer le rayon de notification
    Étant donné que je suis sur la page "paramètres"
    Alors je peux définir mon rayon de notification

  Scénario: Configurer les thématiques d'intérêt
    Étant donné que je suis sur la page "paramètres"
    Alors je peux définir mes thématiques d'intérêt

  Scénario: Vérifier les données des paramètres
    Étant donné que l'écran "settings" est affiché
    Alors le formulaire contient les champs obligatoires suivants:
      | Notifications       |
      | Confidentialité     |
      | Rayon de notification |
