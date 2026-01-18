# language: fr
@WORKSHOP @priority-3
Fonctionnalité: US-6 M'inscrire/me désinscrire à un événement (atelier)
  En tant qu'utilisateur
  Je peux m'inscrire/me désinscrire à un événement
  En regardant si l'événement public existe déjà et en m'enregistrant sur les différents ateliers
  Afin de m'inscrire à l'atelier tout en visualisant les personnes qui sont déjà pré-inscrites

  Contexte:
    Étant donné je suis connecté en tant qu'utilisateur

  Scénario: Rechercher un événement public existant
    Étant donné je suis sur la page "découvrir"
    Alors je peux voir la liste des événements

  Scénario: Voir les personnes pré-inscrites à un atelier
    Étant donné je suis sur la page "détail événement"
    Alors je peux voir la liste des participants

  Scénario: S'inscrire à un atelier
    Étant donné je suis sur la page "détail événement"
    Quand je clique sur "S'inscrire"
    Alors je peux m'inscrire à l'événement

  Scénario: Se désinscrire d'un atelier
    Étant donné je suis sur la page "détail événement"
    Quand je clique sur "Se désinscrire"
    Alors je peux me désinscrire de l'événement
