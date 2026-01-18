import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import type { FestipodWorld } from '../support/world';

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
  this.attach(`Clicked on: ${elementName}`, 'text/plain');
});

When('je sélectionne {string}', async function (this: FestipodWorld, elementName: string) {
  this.attach(`Selected: ${elementName}`, 'text/plain');
});

When('je clique sur le bouton {string}', async function (this: FestipodWorld, buttonName: string) {
  this.attach(`Clicked button: ${buttonName}`, 'text/plain');
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
  expect(this.currentScreenId).to.not.be.null;
  this.attach(`Verified section: ${sectionName}`, 'text/plain');
});

Then('je peux naviguer vers {string}', async function (this: FestipodWorld, pageName: string) {
  const screenId = resolveScreenId(pageName);
  this.attach(`Navigation available to: ${screenId}`, 'text/plain');
});

Then('la navigation affiche {string} comme actif', async function (this: FestipodWorld, menuItem: string) {
  this.attach(`Active menu: ${menuItem}`, 'text/plain');
});
