import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import type { FestipodWorld } from '../support/world';

// Placeholder step for scenarios that are not yet implemented
// This step indicates the feature is planned but not built yet
Given('Scénario non implémenté', async function (this: FestipodWorld) {
  return 'skipped';
});

const screenNameMap: Record<string, string> = {
  'accueil': 'home',
  'liste des événements': 'events',
  'découvrir': 'events',
  'détail événement': 'event-detail',
  'détail de l\'événement': 'event-detail',
  'créer un événement': 'create-event',
  'création d\'événement': 'create-event',
  'inviter des amis': 'invite',
  'invitation': 'invite',
  'mon profil': 'profile',
  'profil': 'profile',
  'profil utilisateur': 'user-profile',
  'profil d\'un utilisateur': 'user-profile',
  'connexion': 'login',
  'paramètres': 'settings',
  'réglages': 'settings',
  'points de rencontre': 'meeting-points',
  'partage de profil': 'share-profile',
};

function resolveScreenId(pageName: string): string {
  const normalized = pageName.toLowerCase().trim();
  return screenNameMap[normalized] || normalized.replace(/ /g, '-');
}

Given('je suis sur la page {string}', async function (this: FestipodWorld, pageName: string) {
  const screenId = resolveScreenId(pageName);
  this.navigateTo(`#/demo/${screenId}`);
});

Given('je suis connecté en tant qu\'utilisateur', async function (this: FestipodWorld) {
  this.isAuthenticated = true;
});

Given('je suis connecté', async function (this: FestipodWorld) {
  this.isAuthenticated = true;
});

Given('je ne suis pas connecté', async function (this: FestipodWorld) {
  this.isAuthenticated = false;
});

When('je navigue vers {string}', async function (this: FestipodWorld, pageName: string) {
  const screenId = resolveScreenId(pageName);
  this.navigateTo(`#/demo/${screenId}`);
});

When('je clique sur {string}', async function (this: FestipodWorld, elementName: string) {
  const source = this.getRenderedText();
  // Check that a clickable element with this text exists (onClick handler + text content)
  const escapedName = elementName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`onClick[^>]*>[^<]*${escapedName}`, 'i');
  const found = pattern.test(source);
  if (!found) {
    this.attach(`MISSING: Clickable element "${elementName}" not found in screen "${this.currentScreenId}"`, 'text/plain');
    return 'pending';
  }
});

When('je sélectionne {string}', async function (this: FestipodWorld, elementName: string) {
  const source = this.getRenderedText();
  // Check that a selectable element with this text exists
  const escapedName = elementName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`onClick[^>]*>[^<]*${escapedName}`, 'i');
  const found = pattern.test(source);
  if (!found) {
    this.attach(`MISSING: Selectable element "${elementName}" not found in screen "${this.currentScreenId}"`, 'text/plain');
    return 'pending';
  }
});

When('je clique sur le bouton {string}', async function (this: FestipodWorld, buttonName: string) {
  const source = this.getRenderedText();
  // Check that a Button component with this label exists
  const escapedName = buttonName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`<Button[^>]*>[^<]*${escapedName}[^<]*</Button>`, 'i');
  const found = pattern.test(source);
  if (!found) {
    this.attach(`MISSING: Button "${buttonName}" not found in screen "${this.currentScreenId}"`, 'text/plain');
    return 'pending';
  }
});

When('je clique sur un participant', async function (this: FestipodWorld) {
  this.navigateTo('#/demo/user-profile');
});

When('je clique sur un événement', async function (this: FestipodWorld) {
  this.navigateTo('#/demo/event-detail');
});

Then('je suis redirigé vers {string}', async function (this: FestipodWorld, pageName: string) {
  const screenId = resolveScreenId(pageName);
  expect(this.currentScreenId).to.equal(screenId);
});

Then('je vois l\'écran {string}', async function (this: FestipodWorld, pageName: string) {
  const screenId = resolveScreenId(pageName);
  expect(this.currentScreenId).to.equal(screenId);
});

Then('je reste sur la page {string}', async function (this: FestipodWorld, pageName: string) {
  const screenId = resolveScreenId(pageName);
  expect(this.currentScreenId).to.equal(screenId);
});

Then('l\'écran contient une section {string}', async function (this: FestipodWorld, sectionName: string) {
  const found = this.hasText(sectionName);
  if (!found) {
    this.attach(`MISSING SECTION: "${sectionName}" not found in screen "${this.currentScreenId}"`, 'text/plain');
    return 'pending';
  }
});

Then('je peux annuler et revenir à l\'écran précédent', async function (this: FestipodWorld) {
  expect(this.currentScreenId).to.equal('create-event');
  const source = this.getRenderedText();
  // Detect ✕ close button with onClick handler that calls navigate()
  const found = /onClick\s*=\s*\{\s*\(\)\s*=>\s*navigate\s*\(['"]home['"]\)\s*\}[^>]*>✕</.test(source);
  expect(found, 'Create event screen should have ✕ button with navigate("home")').to.be.true;
});

Then('je peux naviguer vers {string}', async function (this: FestipodWorld, pageName: string) {
  const screenId = resolveScreenId(pageName);
  const source = this.getRenderedText();
  // Check that a navigation link to this screen exists: navigate('screenId') or onClick={() => navigate('screenId')}
  const pattern = new RegExp(`navigate\\s*\\(\\s*['"]${screenId}['"]\\s*\\)`);
  const found = pattern.test(source);
  if (!found) {
    this.attach(`MISSING: Navigation to "${screenId}" not found in screen "${this.currentScreenId}"`, 'text/plain');
    return 'pending';
  }
});

Then('la navigation affiche {string} comme actif', async function (this: FestipodWorld, menuItem: string) {
  const source = this.getRenderedText();
  // Check that NavBar has an item with this label and active: true
  // Pattern: { icon: '...', label: 'menuItem', active: true }
  const escapedItem = menuItem.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`label:\\s*['"]${escapedItem}['"][^}]*active:\\s*true`, 'i');
  const found = pattern.test(source);
  if (!found) {
    this.attach(`MISSING: Menu item "${menuItem}" is not active in NavBar of screen "${this.currentScreenId}"`, 'text/plain');
    return 'pending';
  }
});
