# language: fr
# Note: US-17 concerne les notifications par email - non testable via écrans
@NOTIF @priority-2
Fonctionnalité: US-17 Informer automatiquement d'autres utilisateurs
  En tant qu'utilisateur
  Je peux informer automatiquement d'autres utilisateurs de ma participation à un événement
  En utilisant un système de notifications pour transmettre le lien de l'événement
  Afin d'informer les utilisateurs proches, intéressés par la thématique, ou mes abonnés

  Contexte:
    Étant donné je suis connecté en tant qu'utilisateur

  @pending
  Scénario: Partager un événement auquel je participe
    Étant donné je suis sur la page "détail événement"
    Quand je clique sur "Partager"
    Alors l'écran contient une section "Options de partage"

  @pending
  Scénario: Informer les utilisateurs à proximité
    Étant donné je suis sur la page "détail événement"
    Quand je clique sur "Notifier à proximité"
    Alors l'écran contient une section "Rayon de notification"

  @pending
  Scénario: Informer les utilisateurs par thématique
    Étant donné je suis sur la page "détail événement"
    Quand je clique sur "Notifier par thématique"
    Alors l'écran contient une section "Thématiques"

  @pending
  Scénario: Informer mes abonnés
    Étant donné je suis sur la page "détail événement"
    Quand je clique sur "Notifier mes abonnés"
    Alors l'écran contient une section "Mes abonnés"

  @pending
  Scénario: Combiner les options de notification
    Étant donné je suis sur la page "détail événement"
    Alors l'écran contient une section "Options de notification"
