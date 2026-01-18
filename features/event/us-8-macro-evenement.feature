# language: fr
@EVENT @priority-3
Fonctionnalité: US-8 Consulter et m'inscrire à un macro-événement
  En tant qu'utilisateur
  Je peux consulter et m'inscrire à un événement de type "Macro-événement"
  En créant ou en rattachant des événements existants à ce macro-événement
  Afin de voir une consolidation des commentaires/liens/ressources/participants

  Contexte:
    Étant donné que je suis connecté en tant qu'utilisateur

  Scénario: Consulter un macro-événement
    Étant donné que je suis sur la page "découvrir"
    Quand je clique sur un événement
    Alors je vois l'écran "event-detail"
    Et l'écran contient une section "Événements rattachés"

  @pending
  Scénario: Voir les événements rattachés
    Étant donné que je suis sur la page "détail événement"
    Alors l'écran contient une section "Événements rattachés"

  Scénario: Rattacher un événement existant
    Étant donné que je suis sur la page "détail événement"
    Quand je clique sur "Rattacher un événement"
    Alors l'écran contient une section "Sélection d'événement"

  Scénario: Voir la consolidation des participants
    Étant donné que je suis sur la page "détail événement"
    Alors je peux voir la liste des participants
    Et l'écran contient une section "Participants consolidés"
