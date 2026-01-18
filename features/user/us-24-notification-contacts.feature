# language: fr
@USER @priority-2
Fonctionnalité: US-24 Être notifié des activités de mes contacts
  En tant qu'utilisateur
  Je peux être notifié lorsqu'un contact participe à des événements
  Afin d'obtenir une synthèse du contenu des ateliers et événements

  Contexte:
    Étant donné je suis connecté en tant qu'utilisateur

  Scénario: Accéder aux paramètres de notification
    Étant donné je suis sur la page "paramètres"
    Alors l'écran contient une section "Notifications"

  Scénario: Configurer les notifications de contacts
    Étant donné je suis sur la page "paramètres"
    Alors je peux configurer mes notifications

  Scénario: Voir les activités de mes contacts sur l'accueil
    Étant donné je suis sur la page "accueil"
    Alors l'écran contient une section "Activités de mes contacts"

  Scénario: Vérifier les données des paramètres
    Étant donné l'écran "settings" est affiché
    Alors le formulaire contient les champs obligatoires suivants:
      | Notifications       |
      | Confidentialité     |
      | Rayon de notification |
