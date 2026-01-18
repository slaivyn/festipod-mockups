# language: fr
@MEETING @priority-1
Fonctionnalité: US-16 Indiquer un ou plusieurs points de rencontre
  En tant qu'utilisateur
  Je peux indiquer un ou plusieurs points de rencontre
  En précisant le lieu et l'heure de cette rencontre
  Afin de croiser et faire connaissance d'autres participants

  Contexte:
    Étant donné je suis connecté en tant qu'utilisateur

  Scénario: Accéder aux points de rencontre
    Étant donné je suis sur la page "détail événement"
    Quand je navigue vers "points de rencontre"
    Alors je vois l'écran "meeting-points"

  Scénario: Créer un point de rencontre
    Étant donné je suis sur la page "points de rencontre"
    Quand je clique sur "Ajouter un point de rencontre"
    Alors l'écran contient une section "Nouveau point de rencontre"

  Scénario: Définir le lieu de rencontre
    Étant donné je suis sur la page "points de rencontre"
    Alors le champ "Lieu de rencontre" est présent

  Scénario: Définir l'heure de rencontre
    Étant donné je suis sur la page "points de rencontre"
    Alors le champ "Heure" est présent

  Scénario: Échanger des liens de contact
    Étant donné je suis sur la page "points de rencontre"
    Alors l'écran contient une section "Partage de contact"
    Et je peux voir le QR code

  Scénario: Vérifier les données requises
    Étant donné l'écran "meeting-points" est affiché
    Alors le formulaire contient les champs obligatoires suivants:
      | Lieu de rencontre |
      | Heure             |
