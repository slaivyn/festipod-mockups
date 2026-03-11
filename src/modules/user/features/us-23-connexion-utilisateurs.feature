# language: fr
@USER @priority-1
Fonctionnalité: US-23 Me connecter avec d'autres utilisateurs
  En tant qu'utilisateur
  Je peux me connecter avec d'autres utilisateurs
  En partageant mon QR code ou mon lien de contact
  Afin d'étendre mon réseau

  Contexte:
    Étant donné que je suis connecté en tant qu'utilisateur

  Scénario: Accéder au partage depuis le profil
    Étant donné que je suis sur la page "mon profil"
    Alors l'écran contient une section "Partager"

  Scénario: Voir le QR code
    Étant donné que je suis sur la page "partage profil"
    Alors l'écran contient un texte "Scannez pour me retrouver sur Festipod"

  Scénario: Voir le lien de partage
    Étant donné que je suis sur la page "partage profil"
    Alors l'écran contient une section "Mon lien de profil"

  Scénario: Accéder à l'écran de partage dédié
    Étant donné que je suis sur la page "mon profil"
    Quand je navigue vers "partage de profil"
    Alors je vois l'écran "share-profile"

  Scénario: Vérifier les données du profil
    Étant donné que je suis sur la page "partage profil"
    Alors l'écran contient un texte "Marie Dupont"
