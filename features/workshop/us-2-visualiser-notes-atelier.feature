# language: fr
@WORKSHOP @priority-3
Fonctionnalité: US-2 Visualiser un événement terminé (notes)
  En tant qu'utilisateur
  Je peux visualiser un événement terminé et consulter le programme détaillé des ateliers
  Afin d'ajouter d'éventuelles prises de notes/liens ou des commentaires associés à l'atelier

  Contexte:
    Étant donné je suis connecté en tant qu'utilisateur

  Scénario: Accéder à la zone de notes personnelles
    Étant donné je suis sur la page "détail événement"
    Alors l'écran contient une section "Notes personnelles"

  Scénario: Accéder à la zone de partage publique
    Étant donné je suis sur la page "détail événement"
    Alors l'écran contient une section "Zone de partage publique"

  @pending
  Scénario: Ajouter une note personnelle
    Étant donné je suis sur la page "détail événement"
    Quand je clique sur "Ajouter une note"
    Alors je peux ajouter une note

  Scénario: Ajouter un lien/ressource
    Étant donné je suis sur la page "détail événement"
    Quand je clique sur "Ajouter une ressource"
    Alors l'écran contient une section "Ressources"
