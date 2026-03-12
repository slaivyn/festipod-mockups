import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import type { FestipodWorld } from '../../../../shared/support/world';

When('je clique sur un participant', async function (this: FestipodWorld) {
  this.navigateTo('#/demo/user-profile');
});

Given('je visualise le profil de {string}', async function (this: FestipodWorld, userName: string) {
  this.navigateTo('#/demo/user-profile');
  expect(this.currentScreen, 'User profile screen should be loaded').to.not.be.null;
  this.attach(`Viewing profile: ${userName}`, 'text/plain');
});

Then('je peux voir mon profil', async function (this: FestipodWorld) {
  expect(this.currentScreenId).to.equal('profile');
  const source = this.getRenderedText();
  expect(/<Avatar[^>]*initials="MD"[^>]*size="lg"/.test(source), 'Profile should have Avatar with initials="MD" and size="lg"').to.be.true;
  expect(/<Title[^>]*>Marie Dupont<\/Title>/.test(source), 'Profile should have Title "Marie Dupont"').to.be.true;
  expect(/@mariedupont/.test(source), 'Profile should have username @mariedupont').to.be.true;
});

Then('je peux voir le profil de l\'utilisateur', async function (this: FestipodWorld) {
  expect(this.currentScreenId).to.equal('user-profile');
  const source = this.getRenderedText();
  expect(/<Avatar[^>]*initials="JD"[^>]*size="lg"/.test(source), 'User profile should have Avatar with initials="JD" and size="lg"').to.be.true;
  expect(/<Title[^>]*>Jean Durand<\/Title>/.test(source), 'User profile should have Title "Jean Durand"').to.be.true;
  expect(/@jeandurand/.test(source), 'User profile should have username @jeandurand').to.be.true;
});

Then('l\'écran affiche les informations du profil', async function (this: FestipodWorld) {
  const source = this.getRenderedText();
  if (this.currentScreenId === 'profile') {
    expect(/<Avatar[^>]*initials="MD"/.test(source), 'Profile should have Avatar with initials="MD"').to.be.true;
    expect(/<Title[^>]*>Marie Dupont<\/Title>/.test(source), 'Profile should have Title "Marie Dupont"').to.be.true;
    expect(/@mariedupont/.test(source), 'Profile should have username @mariedupont').to.be.true;
  } else if (this.currentScreenId === 'user-profile') {
    expect(/<Avatar[^>]*initials="JD"/.test(source), 'User profile should have Avatar with initials="JD"').to.be.true;
    expect(/<Title[^>]*>Jean Durand<\/Title>/.test(source), 'User profile should have Title "Jean Durand"').to.be.true;
    expect(/@jeandurand/.test(source), 'User profile should have username @jeandurand').to.be.true;
  } else {
    expect.fail(`Unexpected screen "${this.currentScreenId}" for profile info check`);
  }
});

Then('je peux contacter l\'utilisateur', async function (this: FestipodWorld) {
  expect(this.currentScreenId).to.equal('user-profile');
  const source = this.getRenderedText();
  const hasContactButton = /<Button>Contacter<\/Button>/.test(source);
  expect(hasContactButton, 'User profile should have "Contacter" button').to.be.true;
});

Then('je peux voir les événements auxquels l\'utilisateur a participé', async function (this: FestipodWorld) {
  expect(this.currentScreenId).to.equal('user-profile');
  const source = this.getRenderedText();
  expect(/Événements à venir/.test(source), 'User profile should have "Événements à venir" section').to.be.true;
  expect(/Événements passés/.test(source), 'User profile should have "Événements passés" section').to.be.true;
});

Then('les événements affichent leur localisation et distance', async function (this: FestipodWorld) {
  expect(this.currentScreenId).to.equal('user-profile');
  const source = this.getRenderedText();
  expect(/location: '[^']+'/.test(source), 'Events should have location data').to.be.true;
  expect(/distance: \d+/.test(source), 'Events should have distance data').to.be.true;
  expect(/\{event\.location\}/.test(source), 'Events should render location').to.be.true;
  expect(/\{event\.distance\}/.test(source), 'Events should render distance').to.be.true;
});

Then('je peux voir le QR code', async function (this: FestipodWorld) {
  const source = this.getRenderedText();
  if (this.currentScreenId === 'share-profile') {
    expect(/QR Code/.test(source), 'Share profile should have "QR Code" text').to.be.true;
    expect(/Scannez pour me retrouver/.test(source), 'Share profile should have "Scannez pour me retrouver" text').to.be.true;
  } else if (this.currentScreenId === 'meeting-points') {
    expect(/Mon QR Code/.test(source), 'Meeting points should have "Mon QR Code" text').to.be.true;
    expect(/Scannez pour m'ajouter/.test(source), 'Meeting points should have "Scannez pour m\'ajouter" text').to.be.true;
  } else {
    expect.fail(`QR code should be on share-profile or meeting-points, not "${this.currentScreenId}"`);
  }
});

Then('je peux voir le lien de partage', async function (this: FestipodWorld) {
  expect(this.currentScreenId, 'Share link should be on share-profile screen').to.equal('share-profile');
  const source = this.getRenderedText();
  expect(/Mon lien de profil/.test(source), 'Share profile should have "Mon lien de profil" text').to.be.true;
  expect(/festipod\.app\/u\//.test(source), 'Share profile should have profile link URL').to.be.true;
});
