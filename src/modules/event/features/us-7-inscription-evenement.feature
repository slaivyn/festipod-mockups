# language: fr
@EVENT @priority-1
Fonctionnalité: US-7 M'inscrire/me désinscrire à un événement
  En tant qu'utilisateur
  Je peux m'inscrire/me désinscrire à un événement
  Après avoir consulté la description de l'événement, les dates et le lieu
  S'il existe déjà dans le système ou en le retrouvant dans une base existante

  Contexte:
    Étant donné que je suis connecté en tant qu'utilisateur

  # --- UI ---

  Scénario: Consulter un événement avant inscription
    Étant donné que je suis sur la page "détail événement"
    Alors l'écran affiche les informations de l'événement

  Scénario: Voir le bouton d'inscription sur l'écran
    Étant donné que je suis sur la page "détail événement"
    Alors je peux m'inscrire à l'événement

  Scénario: Rechercher un événement existant
    Étant donné que je suis sur la page "découvrir"
    Alors je peux voir la liste des événements

  # --- Data ---

  @data
  Scénario: S'inscrire à un événement
    Étant donné un événement "Formation CNV" existe
    Et l'utilisateur n'est pas inscrit à l'événement "Formation CNV"
    Et l'événement "Formation CNV" a 8 participants au départ
    Quand l'utilisateur s'inscrit à l'événement "Formation CNV"
    Alors l'utilisateur est participant de l'événement "Formation CNV"
    Et l'utilisateur apparaît dans la liste des participants de l'événement "Formation CNV"
    Et l'événement "Formation CNV" compte 9 participants

  @data
  Scénario: Se désinscrire d'un événement
    Étant donné un événement "Résidence Reconnexion" existe
    Et l'utilisateur est inscrit à l'événement "Résidence Reconnexion"
    Et l'événement "Résidence Reconnexion" a 12 participants au départ
    Quand l'utilisateur se désinscrit de l'événement "Résidence Reconnexion"
    Alors l'utilisateur n'est plus participant de l'événement "Résidence Reconnexion"
    Et l'utilisateur n'apparaît plus dans la liste des participants de l'événement "Résidence Reconnexion"
    Et l'événement "Résidence Reconnexion" compte 11 participants

  @data
  Scénario: L'inscription est idempotente
    Étant donné un événement "Résidence Reconnexion" existe
    Et l'utilisateur est inscrit à l'événement "Résidence Reconnexion"
    Et l'événement "Résidence Reconnexion" a 12 participants au départ
    Quand l'utilisateur essaie de s'inscrire une seconde fois à l'événement "Résidence Reconnexion"
    Alors l'inscription est idempotente pour l'événement "Résidence Reconnexion"
    Et l'événement "Résidence Reconnexion" compte 12 participants

  @data
  Scénario: Se désinscrire d'un événement auquel on n'est pas inscrit
    Étant donné un événement "Formation CNV" existe
    Et l'utilisateur n'est pas inscrit à l'événement "Formation CNV"
    Et l'événement "Formation CNV" a 8 participants au départ
    Quand l'utilisateur se désinscrit de l'événement "Formation CNV"
    Alors l'utilisateur n'est plus participant de l'événement "Formation CNV"
    Et l'événement "Formation CNV" compte 8 participants
