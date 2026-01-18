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

  @pending
  Scénario: Voir le récapitulatif par période
    Étant donné que je suis sur la page "accueil"
    Alors je peux filtrer les événements par période

  @pending
  Scénario: Voir les événements proches géographiquement
    Étant donné que je suis sur la page "accueil"
    Alors l'écran contient une section "Près de chez moi"

  @pending
  Scénario: Voir mes inscriptions
    Étant donné que je suis sur la page "accueil"
    Alors l'écran contient une section "Mes inscriptions"

  @pending
  Scénario: Vérifier les données de l'accueil
    Étant donné que l'écran "home" est affiché
    Alors le formulaire contient les champs obligatoires suivants:
      | Événements à venir |
      | Navigation         |
