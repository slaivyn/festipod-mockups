# language: fr
# Note: US-19 concerne les récapitulatifs par email - non testable via écrans
# Les scénarios ci-dessous testent l'affichage sur l'écran d'accueil (aspect UI)
@NOTIF @priority-2
Fonctionnalité: US-19 Recevoir un récapitulatif des prochaines rencontres
  En tant qu'utilisateur
  Je peux recevoir un récapitulatif des prochaines rencontres
  En réceptionnant une liste des événements auxquels je suis inscrit ou qui sont proches de chez moi
  Afin d'établir un programme des événements auxquels je participe par période

  Contexte:
    Étant donné que je suis connecté en tant qu'utilisateur

  Scénario: Voir les événements à venir sur l'accueil
    Étant donné que je suis sur la page "accueil"
    Alors l'écran contient une section "Événements à venir"

  Scénario: Voir le récapitulatif par période
    * Scénario non implémenté

  Scénario: Voir les événements proches géographiquement
    * Scénario non implémenté

  Scénario: Voir mes inscriptions
    Étant donné que je suis sur la page "mon profil"
    Alors l'écran contient une section "Mes événements à venir"

  Scénario: Vérifier les données de l'accueil
    Étant donné que je suis sur la page "accueil"
    Alors l'écran contient un texte "Barbecue d'été"
    Et l'écran contient un texte "Soirée jeux de société"
