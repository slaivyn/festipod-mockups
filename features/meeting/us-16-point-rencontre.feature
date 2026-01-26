# language: fr
@MEETING @priority-1
Fonctionnalité: US-16 Indiquer un ou plusieurs points de rencontre
  En tant qu'utilisateur
  Je peux indiquer un ou plusieurs points de rencontre
  En précisant le lieu et l'heure de cette rencontre
  Afin de croiser et faire connaissance d'autres participants

  Contexte:
    Étant donné que je suis connecté en tant qu'utilisateur

  Scénario: Accéder aux points de rencontre
    Étant donné que je suis sur la page "détail événement"
    Quand je navigue vers "points de rencontre"
    Alors je vois l'écran "meeting-points"

  Scénario: Voir le bouton pour proposer un point de rencontre
    Étant donné que je suis sur la page "points de rencontre"
    Alors l'écran contient un bouton "Proposer un point de rencontre"

  Scénario: Ouvrir le formulaire de proposition
    Étant donné que je suis sur la page "points de rencontre"
    Quand je clique sur "Proposer un point de rencontre"
    Alors l'écran contient un bouton "Créer le point de rencontre"
    Et l'écran contient un champ "Lieu"

  Scénario: Définir l'heure de rencontre
    Étant donné que je suis sur la page "points de rencontre"
    Quand je clique sur "Proposer un point de rencontre"
    Alors l'écran contient un bouton "30 min avant"
    Et l'écran contient un bouton "1h avant"
    Et l'écran contient un bouton "Personnalisé"
