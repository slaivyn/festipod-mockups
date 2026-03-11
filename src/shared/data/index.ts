/**
 * Centralized data architecture for Festipod mockups
 *
 * This module provides:
 * - User stories definitions
 * - Screen-to-story bidirectional links (computed automatically from feature files)
 * - Sample data for mockups
 *
 * screenIds are extracted automatically from .feature files by parse-features.ts.
 * Run `bun run features:parse` to update them.
 */

import { parsedFeatures } from './features';

// ============================================================================
// Types
// ============================================================================

export type StoryCategory = 'WORKSHOP' | 'EVENT' | 'USER' | 'MEETING' | 'NOTIF';

export interface UserStoryDefinition {
  id: string;
  priority: number;
  category: StoryCategory;
  title: string;
  description: string;
}

export interface UserStory extends UserStoryDefinition {
  screenIds: string[];
}

export interface ScreenStories {
  screenId: string;
  stories: UserStory[];
}

// ============================================================================
// Category metadata
// ============================================================================

export const categoryLabels: Record<StoryCategory, string> = {
  WORKSHOP: 'Atelier',
  EVENT: 'Événement',
  USER: 'Utilisateur',
  MEETING: 'Point de rencontre',
  NOTIF: 'Notification',
};

export const categoryColors: Record<StoryCategory, string> = {
  WORKSHOP: '#9c27b0',
  EVENT: '#2196f3',
  USER: '#4caf50',
  MEETING: '#ff9800',
  NOTIF: '#f44336',
};

export const priorityLabels: Record<number, string> = {
  0: 'Impossible',
  1: 'Haute',
  2: 'Moyenne',
  3: 'Basse',
};

export const priorityColors: Record<number, string> = {
  0: '#999',
  1: '#c00',
  2: '#e60',
  3: '#08a',
};

// ============================================================================
// User Stories Data
// ============================================================================

const userStoriesData: UserStoryDefinition[] = [
  // Row 1 - WORKSHOP - Priority 3
  {
    id: 'us-1',
    priority: 3,
    category: 'WORKSHOP',
    title: 'Visualiser un événement terminé',
    description: 'En tant qu\'utilisateur, je peux visualiser un événement terminé et consulter le programme détaillé des ateliers par journée/heure afin de voir les personnes qui ont participé à chaque atelier et consulter les notes/liens (Ressources)/commentaires de cet atelier (Zone de partage Collective).',
  },
  // Row 2 - WORKSHOP - Priority 3
  {
    id: 'us-2',
    priority: 3,
    category: 'WORKSHOP',
    title: 'Visualiser un événement terminé (notes)',
    description: 'En tant qu\'utilisateur, je peux visualiser un événement terminé et consulter le programme détaillé des ateliers par journée/heure afin de ajouter d\'éventuelles prises de notes/liens (ressources) ou des commentaires associés à l\'atelier (Zone privée de l\'utilisateur et/ou Zone partage publique).',
  },
  // Row 3 - EVENT - Priority 1
  {
    id: 'us-3',
    priority: 1,
    category: 'EVENT',
    title: 'Visualiser un événement terminé',
    description: 'En tant qu\'utilisateur, je peux visualiser un événement terminé et consulter la description de l\'événement afin de voir les personnes qui ont participé à cet événement.',
  },
  // Row 4 - WORKSHOP - Priority 3
  {
    id: 'us-4',
    priority: 3,
    category: 'WORKSHOP',
    title: 'Ajouter/modifier/supprimer un commentaire à un atelier',
    description: 'En tant qu\'utilisateur, je peux consulter et ajouter/modifier/supprimer un commentaire à un atelier en sélectionnant l\'icône « ajouter un commentaire » en dessous du titre de l\'atelier afin de voir les commentaires précédents et ajouter mes commentaires, mentionner mes ressentis, faire part de mes annotations.',
  },
  // Row 5 - EVENT - Priority 3
  {
    id: 'us-5',
    priority: 3,
    category: 'EVENT',
    title: 'Ajouter/modifier/supprimer un commentaire à un événement',
    description: 'En tant qu\'utilisateur, je peux consulter et ajouter/modifier/supprimer un commentaire à un événement en sélectionnant l\'icône « ajouter un commentaire » en dessous du titre de l\'événement (Notes Privées / Personnelles) indiquant les interactions avec les individus rencontrés (Date / Heure / Lieu) afin de voir les commentaires précédents et ajouter mes commentaires, mentionner mes ressentis, faire part de mes annotations.',
  },
  // Row 6 - WORKSHOP - Priority 3
  {
    id: 'us-6',
    priority: 3,
    category: 'WORKSHOP',
    title: 'M\'inscrire/me désinscrire à un événement (atelier)',
    description: 'En tant qu\'utilisateur, je peux m\'inscrire/me désinscrire à un événement en : 1- regardant si l\'événement public existe déjà, 2- M\'enregistrant sur les différents ateliers afin de m\'inscrire à l\'atelier tout en visualisant les personnes qui sont déjà pré-inscrites.',
  },
  // Row 7 - EVENT - Priority 1
  {
    id: 'us-7',
    priority: 1,
    category: 'EVENT',
    title: 'M\'inscrire/me désinscrire à un événement',
    description: 'En tant qu\'utilisateur, je peux m\'inscrire/me désinscrire à un événement après avoir consulté la description de l\'événement, les dates et le lieu de tenue de l\'événement s\'il existe déjà dans le système, ou en le retrouvant dans une base existante (Mobilizon, etc.).',
  },
  // Row 8 - EVENT - Priority 3
  {
    id: 'us-8',
    priority: 3,
    category: 'EVENT',
    title: 'Consulter et m\'inscrire à un macro-événement',
    description: 'En tant qu\'utilisateur, je peux consulter et m\'inscrire à un événement de type « Macro-événement » en créant ou en rattachant des événements existants à ce macro-événement afin de rattacher des événements existants à une thématique particulière ou créer un événement qui est répété est plusieurs périodes dans l\'année (les résidences reconnecté) et voir une consolidation des commentaires / Liens/Ressources /participants de chaque événement rattaché.',
  },
  // Row 9 - USER - Priority 0
  {
    id: 'us-9',
    priority: 0,
    category: 'USER',
    title: 'Visualiser la photo d\'un individu',
    description: 'En tant qu\'utilisateur, je peux visualiser la photo d\'un individu (ou ajouter une photo personnelle sur une fiche existante) et consulter la liste des inscrits à un atelier afin de identifier les personnes que j\'ai rencontré dont je n\'ai pas noté leur nom.',
  },
  // Row 10 - USER - Priority 1
  {
    id: 'us-10',
    priority: 1,
    category: 'USER',
    title: 'Visualiser la fiche/le profil d\'un participant',
    description: 'En tant qu\'utilisateur, je peux sélectionner un individu dans la liste des inscrits à un événement/atelier afin de voir les événements auxquels la personne a participé et voir un formulaire de contact pour intéragir avec elle.',
  },
  // Row 11 - WORKSHOP - Priority 3
  {
    id: 'us-11',
    priority: 3,
    category: 'WORKSHOP',
    title: 'Visualiser le bilan consolidé de l\'événement',
    description: 'En tant qu\'utilisateur, je peux visualiser le bilan consolidé de l\'événement en consultant l\'ensemble des commentaires regroupés par atelier afin de obtenir une synthèse du contenu de chaque atelier et de l\'ensemble des ateliers constituant l\'événement.',
  },
  // Row 12 - USER - Priority 2
  {
    id: 'us-12',
    priority: 2,
    category: 'USER',
    title: 'Consulter la carte / tableau des événements',
    description: 'En tant qu\'utilisateur, je peux consulter la carte / tableau des événements auxquels j\'ai participé en filtrant les événements auxquels j\'ai participé par dates ou par personne afin de avoir une vue consolidée des événements auxquels j\'ai participé ainsi que le lieu ou j\'ai pu rencontrer une personne ou une vue consolidée des événements auxquels une personne a participé.',
  },
  // Row 13 - EVENT - Priority 1
  {
    id: 'us-13',
    priority: 1,
    category: 'EVENT',
    title: 'Créer/Modifier/Supprimer un événement',
    description: 'En tant qu\'utilisateur, je peux créer/modifier/supprimer un événement en choisissant les dates et les horaires de début et de fin de l\'événement, retirer une organisation (personne ou structure) et choisir un lieu. [Données obligatoires : Titre, description, image, adresse, + thématique (sera utilisé pour les notifications)] afin de créer/présenter le contenu de cet événement et le catégoriser par type/thématique.',
  },
  // Row 14 - WORKSHOP - Priority 3
  {
    id: 'us-14',
    priority: 3,
    category: 'WORKSHOP',
    title: 'Créer/Modifier/Supprimer un atelier',
    description: 'En tant qu\'utilisateur, je peux créer/modifier/supprimer un atelier en sélectionnant mon événement et en saisissant les dates et les horaires de début et de fin de l\'atelier afin de définir le programme de mon événement et ajouter description de cet atelier.',
  },
  // Row 15 - USER - Priority 1
  {
    id: 'us-15',
    priority: 1,
    category: 'USER',
    title: 'Visualiser les inscrits à un atelier/événement',
    description: 'En tant qu\'utilisateur, je peux visualiser les inscrits à un atelier/événement en sélectionnant l\'atelier/l\'événement désiré dans la liste des événements/ateliers de l\'événement afin de consulter la liste des inscrits triée par ordre alphabétique.',
  },
  // Row 16 - MEETING - Priority 1
  {
    id: 'us-16',
    priority: 1,
    category: 'MEETING',
    title: 'Indiquer un ou plusieurs points de rencontre',
    description: 'En tant qu\'utilisateur, je peux indiquer un ou plusieurs points de rencontre en précisant le lieu (café,...) ainsi que l\'heure de cette rencontre (ou le délai ex : 30min avant l\'événement) afin de croiser et faire connaissance d\'autres participants. Je peux aussi échanger avec les autres participants nos liens de contact (QR code ou lien ou bluetooth ?).',
  },
  // Row 17 - NOTIF - Priority 2
  {
    id: 'us-17',
    priority: 2,
    category: 'NOTIF',
    title: 'Informer automatiquement d\'autres utilisateurs',
    description: 'En tant qu\'utilisateur, je peux informer automatiquement d\'autres utilisateurs de ma participation à un événement en utilisant un système de notifications (e-mail,...) pour transmettre le lien de l\'événement afin d\'informer les utilisateurs qui résident à proximité de l\'événement (distance à déterminer/configurer). Ou bien informer les utilisateurs ayant manifesté un intérêt pour la thématique de l\'événement. Ou bien informer mes abonnés. Ou bien les trois à la fois.',
  },
  // Row 18 - NOTIF - Priority 2
  {
    id: 'us-18',
    priority: 2,
    category: 'NOTIF',
    title: 'Être informé lorsque de nouveaux participants s\'inscrivent',
    description: 'En tant qu\'utilisateur, je peux être informé lorsque de nouveaux participants s\'inscrivent à un événement auquel je suis inscrit en utilisant un système de notifications (e-mail,...) afin de savoir qui participe à un événement. Éventuellement être uniquement informé des participants que je connais déjà (paramétrable ex : mon réseau).',
  },
  // Row 19 - NOTIF - Priority 2
  {
    id: 'us-19',
    priority: 2,
    category: 'NOTIF',
    title: 'Recevoir un récapitulatif des prochaines rencontres',
    description: 'En tant qu\'utilisateur, je peux recevoir un récapitulatif des prochaines rencontres en réceptionnant une liste des événements auxquels je suis inscrit ou qui sont proches de chez moi afin de établir un programme des événements auxquels je participe par période (mois, trimestre, année,...).',
  },
  // Row 20 - USER - Priority 1
  {
    id: 'us-20',
    priority: 1,
    category: 'USER',
    title: 'Voir le profil des personnes faisant partie de mon réseau',
    description: 'En tant qu\'utilisateur, je peux voir le profil des personnes faisant partie de mon réseau ainsi que le profil des personnes publiques et consulter la description de l\'événement afin de savoir si j\'ai envie de participer à cet événement.',
  },
  // Row 21 - USER - Priority 2
  {
    id: 'us-21',
    priority: 2,
    category: 'USER',
    title: 'Décider que tous les utilisateurs puissent suivre mes activités',
    description: 'En tant qu\'utilisateur, je peux décider que tous les utilisateurs puissent suivre toutes mes activités en déclarant mon profil public afin de communiquer au sujet de mes déplacements et faire la publicité des événements auxquels je participe.',
  },
  // Row 22 - USER - Priority 2
  {
    id: 'us-22',
    priority: 2,
    category: 'USER',
    title: 'Parrainer un nouvel utilisateur',
    description: 'En tant qu\'utilisateur, je peux parrainer un nouvel utilisateur en lui partageant mon QR code ou lien de contact afin de savoir combien de personnes ont rejoint le réseau grâce à moi.',
  },
  // Row 23 - USER - Priority 1
  {
    id: 'us-23',
    priority: 1,
    category: 'USER',
    title: 'Me connecter avec d\'autres utilisateurs',
    description: 'En tant qu\'utilisateur, je peux me connecter avec d\'autres utilisateurs en partageant mon QR code ou mon lien de contact afin de étendre mon réseau.',
  },
  // Row 24 - USER - Priority 2
  {
    id: 'us-24',
    priority: 2,
    category: 'USER',
    title: 'Être notifié des activités de mes contacts',
    description: 'En tant qu\'utilisateur, je peux être notifié lorsqu\'un contact participe à des événements afin de obtenir une synthèse du contenu de chaque atelier et de l\'ensemble des ateliers constituant l\'événement.',
  },
  // Row 25 - USER - Priority 2
  {
    id: 'us-25',
    priority: 2,
    category: 'USER',
    title: 'Être averti des événements susceptibles de m\'intéresser',
    description: 'En tant qu\'utilisateur, je peux être notifié lorsqu\'un nouvel événement est ajouté près de chez moi et/ou avec une thématique qui m\'intéresse en configurant mes notifications.',
  },
  // Row 26 - USER - Priority 2
  {
    id: 'us-26',
    priority: 2,
    category: 'USER',
    title: 'Définir la portée d\'un événement',
    description: 'En tant qu\'utilisateur, je peux créer/présenter le contenu de cet événement et le catégoriser par type/thématique (Liste fixe à déterminer) en indiquant son rayon d\'intérêt en kilomètres afin de m\'assurer que les utilisateurs qui habitent trop loin ne reçoivent pas de notification.',
  },
];

// ============================================================================
// Computed data & indexes
// ============================================================================

// Build a map of feature id -> screenIds from parsed features
const featureScreenIds = new Map<string, string[]>();
for (const feature of parsedFeatures) {
  featureScreenIds.set(feature.id, feature.screenIds);
}

// Export the stories with screenIds computed from parsed features
export const userStories: UserStory[] = userStoriesData.map(story => ({
  ...story,
  screenIds: featureScreenIds.get(story.id) || [],
}));

// Build reverse index: screenId -> stories
const storiesByScreenIndex = new Map<string, UserStory[]>();

userStories.forEach(story => {
  story.screenIds.forEach(screenId => {
    if (!storiesByScreenIndex.has(screenId)) {
      storiesByScreenIndex.set(screenId, []);
    }
    storiesByScreenIndex.get(screenId)!.push(story);
  });
});

// ============================================================================
// Query functions
// ============================================================================

/**
 * Get all stories linked to a specific screen
 */
export function getStoriesForScreen(screenId: string): UserStory[] {
  return storiesByScreenIndex.get(screenId) || [];
}

/**
 * Get all stories filtered by priority
 */
export function getStoriesByPriority(priority: number): UserStory[] {
  return userStories.filter(story => story.priority === priority);
}

/**
 * Get all stories filtered by category
 */
export function getStoriesByCategory(category: StoryCategory): UserStory[] {
  return userStories.filter(story => story.category === category);
}

/**
 * Get a story by its ID
 */
export function getStoryById(id: string): UserStory | undefined {
  return userStories.find(story => story.id === id);
}

/**
 * Get all screen IDs that have linked stories
 */
export function getScreenIdsWithStories(): string[] {
  return Array.from(storiesByScreenIndex.keys());
}

/**
 * Get story count for a screen
 */
export function getStoryCountForScreen(screenId: string): number {
  return storiesByScreenIndex.get(screenId)?.length || 0;
}

// ============================================================================
// Sample data for mockups
// ============================================================================

export const sampleUsers = [
  { id: '1', name: 'Marie Dupont', initials: 'MD', username: '@mariedupont' },
  { id: '2', name: 'Jean Durand', initials: 'JD', username: '@jeandurand' },
  { id: '3', name: 'Alice Martin', initials: 'AM', username: '@alice' },
  { id: '4', name: 'Baptiste Morel', initials: 'BM', username: '@baptiste' },
  { id: '5', name: 'Camille Dubois', initials: 'CD', username: '@camille' },
  { id: '6', name: 'David Leroy', initials: 'DL', username: '@david' },
];

export const sampleEvents = [
  { id: '1', title: 'Résidence Reconnexion', date: '16-20 fév.', location: 'Le Revel, Rogues (30)', participants: 24 },
  { id: '2', title: 'Atelier low-tech', date: '8 fév.', location: 'La Maison du Vélo, Lyon', participants: 12 },
  { id: '3', title: 'Forum Ouvert Transition', date: '22 fév.', location: 'Tiers-lieu L\'Hermitage', participants: 45 },
  { id: '4', title: 'Formation CNV', date: '1 mars', location: 'MJC Montplaisir, Lyon', participants: 16 },
];
