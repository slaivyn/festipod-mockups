# language: fr
@NOTIF @priority-2
Fonctionnalité: US-18 Être informé lorsque de nouveaux participants s'inscrivent
  En tant qu'utilisateur
  Je peux être informé lorsque de nouveaux participants s'inscrivent à un événement auquel je suis inscrit
  En utilisant un système de notifications
  Afin de savoir qui participe à un événement

  Contexte:
    Étant donné je suis connecté en tant qu'utilisateur

  Scénario: Configurer les notifications de nouveaux participants
    Étant donné je suis sur la page "paramètres"
    Alors l'écran contient une section "Notifications"

  Scénario: Activer les notifications pour un événement
    Étant donné je suis sur la page "détail événement"
    Quand je clique sur "Activer les notifications"
    Alors l'écran contient une section "Notifications activées"

  Scénario: Filtrer les notifications par réseau
    Étant donné je suis sur la page "paramètres"
    Quand je clique sur "Mon réseau uniquement"
    Alors l'écran contient une section "Filtre réseau"

  Scénario: Voir les nouveaux participants sur l'accueil
    Étant donné je suis sur la page "accueil"
    Alors l'écran contient une section "Nouveaux participants"

  Scénario: Vérifier les données des paramètres
    Étant donné l'écran "settings" est affiché
    Alors le formulaire contient les champs obligatoires suivants:
      | Notifications       |
      | Confidentialité     |
      | Rayon de notification |
