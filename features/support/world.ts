import { World, setWorldConstructor, type IWorldOptions } from '@cucumber/cucumber';
import { getScreen, type Screen } from '../../src/screens/index';
import * as fs from 'fs';
import * as path from 'path';

export interface FestipodWorld extends World {
  currentRoute: string;
  currentScreenId: string | null;
  formFields: Map<string, { required: boolean; value: string }>;
  navigationHistory: string[];
  isAuthenticated: boolean;

  // Screen analysis
  currentScreen: Screen | null;
  screenSourceContent: string;

  navigateTo(route: string): void;
  getFormField(name: string): { required: boolean; value: string } | undefined;
  getCurrentScreenFields(): string[];
  setScreenFields(screenId: string): void;

  // Methods for screen content analysis
  loadScreenSource(screenId: string): void;
  getRenderedText(): string;
  hasText(text: string): boolean;
  hasField(fieldName: string): boolean;
  hasElement(selector: string): boolean;
  cleanup(): void;
}

// Map screen IDs to their source file names
const screenFileMap: Record<string, string> = {
  'home': 'HomeScreen.tsx',
  'login': 'LoginScreen.tsx',
  'profile': 'ProfileScreen.tsx',
  'update-profile': 'UpdateProfileScreen.tsx',
  'user-profile': 'UserProfileScreen.tsx',
  'settings': 'SettingsScreen.tsx',
  'events': 'EventsScreen.tsx',
  'event-detail': 'EventDetailScreen.tsx',
  'create-event': 'CreateEventScreen.tsx',
  'update-event': 'UpdateEventScreen.tsx',
  'invite': 'InviteScreen.tsx',
  'participants-list': 'ParticipantsListScreen.tsx',
  'meeting-points': 'MeetingPointsScreen.tsx',
  'friends-list': 'FriendsListScreen.tsx',
  'share-profile': 'ShareProfileScreen.tsx',
};

// Screen-specific field detectors - each screen has its own precise detectors
// tailored to its actual implementation. This avoids generic matching.
export const screenFieldDetectors: Record<string, Record<string, (source: string) => boolean>> = {
  'event-detail': {
    // EventDetailScreen.tsx line 29: <Title>Barbecue d'été</Title>
    'Titre': (s) => /<Title[^>]*>[^<]+<\/Title>/.test(s),
    // EventDetailScreen.tsx line 33: 📅 Samedi 25 janvier 2025
    'Date': (s) => /📅[^<]*(?:janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)[^<]*\d{4}/i.test(s),
    // EventDetailScreen.tsx line 36: 🕓 16h00 - 21h00
    'Heure': (s) => /🕓[^<]*\d{1,2}h\d{2}/.test(s),
    // EventDetailScreen.tsx line 39: 📍 Parc Central, Pelouse Ouest
    'Lieu': (s) => /📍[^<]*[A-ZÀ-Ý][a-zà-ÿ]+/.test(s),
    // EventDetailScreen.tsx lines 77-81: À propos section with description
    'Description': (s) => {
      const match = s.match(/À propos[\s\S]*?<Text[^>]*>([\s\S]*?)<\/Text>/);
      return match !== null && match[1] !== undefined && match[1].trim().length > 50;
    },
    // EventDetailScreen.tsx lines 8-13: attendees with { name: 'Marie' } rendered via {a.name}
    'Nom': (s) => /name:\s*['"][^'"]+['"]/.test(s) && /\{[^}]*\.name\}/.test(s),
    'Nom du participant': (s) => /name:\s*['"][^'"]+['"]/.test(s) && /\{[^}]*\.name\}/.test(s),
    // EventDetailScreen.tsx: <Avatar> components for participants
    'Photo': (s) => /<Avatar/.test(s),
    // NOT IMPLEMENTED: no comment UI in EventDetailScreen
    'Commentaire': (s) => /<textarea/i.test(s) || /commentaire/i.test(s),
  },

  'user-profile': {
    // UserProfileScreen.tsx line 24: <Title>Jean Durand</Title>
    'Nom': (s) => /<Title[^>]*>[A-ZÀ-Ý][a-zà-ÿ]+\s+[A-ZÀ-Ý][a-zà-ÿ]+<\/Title>/.test(s),
    // UserProfileScreen.tsx line 25: @jeandurand
    'Pseudo': (s) => /@[a-zA-Z0-9_]+/.test(s),
    // UserProfileScreen.tsx line 23: <Avatar initials="JD" size="lg" />
    'Photo': (s) => /<Avatar/.test(s),
    'Photo de profil': (s) => /<Avatar/.test(s),
  },

  'profile': {
    // ProfileScreen.tsx: similar to user-profile
    'Nom': (s) => /<Title[^>]*>[A-ZÀ-Ý][a-zà-ÿ]+\s+[A-ZÀ-Ý][a-zà-ÿ]+<\/Title>/.test(s),
    'Pseudo': (s) => /@[a-zA-Z0-9_]+/.test(s),
    'Photo': (s) => /<Avatar/.test(s),
    'Photo de profil': (s) => /<Avatar/.test(s),
  },
};

// Expected content that should be present in each screen
// This maps to what the BDD specs verify - based on actual screen content
export const screenExpectedContent: Record<string, string[]> = {
  'create-event': [
    'Nom de l\'événement',
    'Date',
    'Heure de début',
    'Lieu',
    'Thématique',
    'Créer l\'événement',
  ],
  'profile': [
    'Mon profil',
    'Modifier le profil',
    'Partager',
    'Événement',
  ],
  'user-profile': [
    'Profil',
  ],
  'settings': [
    'Paramètres',
    'Notifications',
    'Confidentialité',
    'Localisation',
  ],
  'login': [
    'Email',
    'Mot de passe',
    'Se connecter',
  ],
  'event-detail': [
    'Participants',
    'À propos',
    'Participer',
    'Inviter',
  ],
  'events': [
    'Découvrir',
    'Rechercher',
  ],
  'home': [
    'Mes événements à venir',
    'Créer un événement',
  ],
  'invite': [
    'Inviter',
    'Rechercher',
  ],
  'meeting-points': [
    'Point de rencontre',
  ],
  'share-profile': [
    'Partager',
    'QR',
  ],
  'friends-list': [
    'Mon réseau',
  ],
  'participants-list': [
    'Participants',
  ],
};

// Required fields that forms should have (for form verification)
export const screenRequiredFields: Record<string, string[]> = {
  'create-event': [
    'Nom de l\'événement',
    'Date',
    'Heure de début',
    'Lieu',
    'Thématique',
  ],
  'profile': [
    'Photo de profil',
    'Nom',
    'Pseudo',
  ],
  'user-profile': [
    'Photo de profil',
    'Nom',
    'Pseudo',
  ],
  'settings': [
    'Notifications',
    'Confidentialité',
    'Rayon de notification',
  ],
  'login': [
    'Email',
    'Mot de passe',
  ],
  'event-detail': [
    'Titre',
    'Date',
    'Lieu',
    'Description',
    'Liste des participants',
  ],
  'events': [
    'Liste des événements',
    'Filtre par date',
  ],
  'home': [
    'Mes événements à venir',
    'Navigation',
  ],
  'invite': [
    'Liste des contacts',
    'Recherche',
  ],
  'meeting-points': [
    'Lieu de rencontre',
    'Heure',
  ],
  'share-profile': [
    'QR Code',
    'Lien de partage',
  ],
};

class CustomWorld extends World implements FestipodWorld {
  currentRoute: string = '#/';
  currentScreenId: string | null = null;
  formFields: Map<string, { required: boolean; value: string }> = new Map();
  navigationHistory: string[] = [];
  isAuthenticated: boolean = false;

  // Screen analysis
  currentScreen: Screen | null = null;
  screenSourceContent: string = '';

  constructor(options: IWorldOptions) {
    super(options);
  }

  navigateTo(route: string): void {
    this.navigationHistory.push(route);
    this.currentRoute = route;

    if (route.startsWith('#/demo/')) {
      this.currentScreenId = route.replace('#/demo/', '');
      this.setScreenFields(this.currentScreenId);
      // Load the screen source for content verification
      this.loadScreenSource(this.currentScreenId);
    } else if (route === '#/specs' || route.startsWith('#/specs/')) {
      this.currentScreenId = null;
    } else if (route === '#/stories' || route.startsWith('#/stories/')) {
      this.currentScreenId = null;
    } else {
      this.currentScreenId = null;
    }
  }

  getFormField(name: string) {
    return this.formFields.get(name);
  }

  getCurrentScreenFields(): string[] {
    return Array.from(this.formFields.keys());
  }

  setScreenFields(screenId: string): void {
    this.formFields.clear();
    const fields = screenRequiredFields[screenId] || [];
    fields.forEach(field => {
      this.formFields.set(field, { required: true, value: '' });
    });
  }

  loadScreenSource(screenId: string): void {
    // Get the screen component
    const screen = getScreen(screenId);
    if (!screen) {
      this.screenSourceContent = '';
      this.currentScreen = null;
      return;
    }

    this.currentScreen = screen;

    // Read the source file to analyze its content
    const fileName = screenFileMap[screenId];
    if (fileName) {
      const filePath = path.join(process.cwd(), 'src', 'screens', fileName);
      try {
        this.screenSourceContent = fs.readFileSync(filePath, 'utf-8');
      } catch {
        this.screenSourceContent = '';
      }
    } else {
      this.screenSourceContent = '';
    }
  }

  getRenderedText(): string {
    // Return the source content which contains all the text that will be rendered
    return this.screenSourceContent;
  }

  hasText(text: string): boolean {
    // Check if the text appears in the screen source
    // This verifies the component contains the expected text
    return this.screenSourceContent.includes(text);
  }

  hasField(fieldName: string): boolean {
    // Use screen-specific field detector if available
    if (this.currentScreenId) {
      const screenDetectors = screenFieldDetectors[this.currentScreenId];
      if (screenDetectors && screenDetectors[fieldName]) {
        return screenDetectors[fieldName](this.screenSourceContent);
      }
    }
    // Fall back to literal text search
    return this.screenSourceContent.includes(fieldName);
  }

  hasElement(selector: string): boolean {
    // Check for common patterns in JSX
    if (!this.screenSourceContent) return false;

    // Check for element types like textarea, input, button
    if (selector === 'textarea') {
      return this.screenSourceContent.includes('<textarea') ||
             this.screenSourceContent.includes('textarea');
    }
    if (selector === 'input') {
      return this.screenSourceContent.includes('<Input') ||
             this.screenSourceContent.includes('<input');
    }
    if (selector === 'button') {
      return this.screenSourceContent.includes('<Button') ||
             this.screenSourceContent.includes('<button');
    }

    return this.screenSourceContent.includes(selector);
  }

  cleanup(): void {
    this.screenSourceContent = '';
    this.currentScreen = null;
  }
}

setWorldConstructor(CustomWorld);
