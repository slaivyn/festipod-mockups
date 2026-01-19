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
    Étant donné que je suis sur la page "profil"
    Alors l'écran contient un bouton "Partager"

  Scénario: Naviguer vers le partage de profil
    Étant donné que je suis sur la page "profil"
    Quand je navigue vers "partage de profil"
    Alors je vois l'écran "share-profile"

  Scénario: Voir le QR code de parrainage
    Étant donné que je suis sur la page "partage profil"
    Alors l'écran contient un texte "Scannez pour me retrouver sur Festipod"

  Scénario: Voir le lien de parrainage
    Étant donné que je suis sur la page "partage profil"
    Alors l'écran contient une section "Mon lien de profil"
    Et l'écran contient un bouton "Copier"

  Scénario: Voir les statistiques de parrainage
    Étant donné que je suis sur la page "partage profil"
    Alors l'écran contient une section "Statistiques de parrainage"
    Et l'écran contient un texte "Personnes parrainées"
    Et l'écran contient un texte "Scans du QR code"
