# language: fr
@USER @priority-2
Fonctionnalité: US-22 Parrainer un nouvel utilisateur
  En tant qu'utilisateur
  Je peux parrainer un nouvel utilisateur
  En lui partageant mon QR code ou lien de contact
  Afin de savoir combien de personnes ont rejoint le réseau grâce à moi

  Contexte:
    Étant donné que je suis connecté en tant qu'utilisateur

  Scénario: Accéder au partage de profil
    Étant donné que je suis sur la page "mon profil"
    Alors l'écran contient une section "Partager mon profil"

  Scénario: Voir le QR code de parrainage
    Étant donné que je suis sur la page "mon profil"
    Alors je peux voir le QR code

  Scénario: Voir le lien de parrainage
    Étant donné que je suis sur la page "mon profil"
    Alors je peux voir le lien de partage

  Scénario: Voir les statistiques de parrainage
    Étant donné que je suis sur la page "mon profil"
    Alors l'écran contient une section "Mes parrainages"

  Scénario: Vérifier les données du profil
    Étant donné que l'écran "profile" est affiché
    Alors le formulaire contient les champs obligatoires suivants:
      | Photo de profil |
      | Nom             |
      | Pseudo          |
