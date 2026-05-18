import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import type { FestipodWorld } from '../../../../shared/support/world';

When('je clique sur un participant', async function (this: FestipodWorld) {
  await this.navigateTo('#/demo/user-profile');
});

Given('je visualise le profil de {string}', async function (this: FestipodWorld, userName: string) {
  await this.navigateTo('#/demo/user-profile');
  expect(this.currentScreen, 'User profile screen should be loaded').to.not.be.null;
  this.attach(`Viewing profile: ${userName}`, 'text/plain');
});

Then('je peux voir mon profil', async function (this: FestipodWorld) {
  expect(this.currentScreenId).to.equal('profile');
  expectProfileDom(this, { initials: 'MD', name: 'Marie Dupont', username: '@mariedupont' });
});

Then('je peux voir le profil de l\'utilisateur', async function (this: FestipodWorld) {
  expect(this.currentScreenId).to.equal('user-profile');
  // user-profile defaults to the first non-current seed user when no userId is
  // bound — see UserProfileScreen.tsx. With current seed data that's Jean Durand.
  expectProfileDom(this, { initials: 'JD', name: 'Jean Durand', username: '@jeandurand' });
});

Then('l\'écran affiche les informations du profil', async function (this: FestipodWorld) {
  const doc = this.renderedDoc;
  expect(doc, 'Screen should be rendered').to.not.be.null;
  const text = doc!.body.textContent ?? '';
  if (this.currentScreenId === 'profile') {
    expect(text.includes('Marie Dupont'), 'Profile should display "Marie Dupont"').to.be.true;
    expect(text.includes('@mariedupont'), 'Profile should display "@mariedupont"').to.be.true;
  } else if (this.currentScreenId === 'user-profile') {
    expect(text.includes('Jean Durand'), 'User profile should display "Jean Durand"').to.be.true;
    expect(text.includes('@jeandurand'), 'User profile should display "@jeandurand"').to.be.true;
  } else {
    expect.fail(`Unexpected screen "${this.currentScreenId}" for profile info check`);
  }
  const avatar = doc!.querySelector('.app-avatar');
  expect(avatar, 'Profile screen should render an avatar').to.not.be.null;
});

Then('je peux contacter l\'utilisateur', async function (this: FestipodWorld) {
  expect(this.currentScreenId).to.equal('user-profile');
  const doc = this.renderedDoc;
  expect(doc, 'Screen should be rendered').to.not.be.null;
  const buttons = Array.from(doc!.querySelectorAll('button')).map(b => b.textContent ?? '');
  expect(buttons.some(t => t.includes('Contacter')),
    'User profile should expose a "Contacter" button').to.be.true;
});

Then('je peux voir les événements auxquels l\'utilisateur a participé', async function (this: FestipodWorld) {
  expect(this.currentScreenId).to.equal('user-profile');
  const doc = this.renderedDoc;
  expect(doc, 'Screen should be rendered').to.not.be.null;
  const text = doc!.body.textContent ?? '';
  expect(text.includes('Événements à venir'),
    'User profile should have "Événements à venir" section').to.be.true;
  expect(text.includes('Événements passés'),
    'User profile should have "Événements passés" section').to.be.true;
});

Then('les événements affichent leur localisation et distance', async function (this: FestipodWorld) {
  expect(this.currentScreenId).to.equal('user-profile');
  const doc = this.renderedDoc;
  expect(doc, 'Screen should be rendered').to.not.be.null;
  const text = doc!.body.textContent ?? '';
  expect(text.includes('📍'), 'Events should show a 📍 location icon').to.be.true;
  expect(/\d+\s*km/.test(text), 'Events should show a distance in km').to.be.true;
});

Then('je peux voir le QR code', async function (this: FestipodWorld) {
  const doc = this.renderedDoc;
  expect(doc, 'Screen should be rendered').to.not.be.null;
  const text = doc!.body.textContent ?? '';
  if (this.currentScreenId === 'share-profile') {
    expect(text.includes('Scannez pour me retrouver'),
      'Share profile should invite to scan for follow-up').to.be.true;
  } else if (this.currentScreenId === 'meeting-points') {
    expect(text.includes('QR') || text.includes('Scannez'),
      'Meeting points should reference a QR code').to.be.true;
  } else {
    expect.fail(`QR code should be on share-profile or meeting-points, not "${this.currentScreenId}"`);
  }
});

Then('je peux voir le lien de partage', async function (this: FestipodWorld) {
  expect(this.currentScreenId, 'Share link should be on share-profile screen').to.equal('share-profile');
  const doc = this.renderedDoc;
  expect(doc, 'Screen should be rendered').to.not.be.null;
  const text = doc!.body.textContent ?? '';
  expect(text.includes('Mon lien de profil'),
    'Share profile should label the profile link section').to.be.true;
  expect(/festipod\.app\/u\//.test(text),
    'Share profile should display a festipod.app/u/… link').to.be.true;
});

function expectProfileDom(
  world: FestipodWorld,
  expected: { initials: string; name: string; username: string },
) {
  const doc = world.renderedDoc;
  expect(doc, 'Screen should be rendered').to.not.be.null;
  const text = doc!.body.textContent ?? '';
  expect(text.includes(expected.name), `Profile should display "${expected.name}"`).to.be.true;
  expect(text.includes(expected.username), `Profile should display "${expected.username}"`).to.be.true;
  const avatar = doc!.querySelector('.app-avatar');
  expect(avatar, 'Profile should render an avatar').to.not.be.null;
  expect((avatar?.textContent ?? '').trim(), `Avatar should show initials "${expected.initials}"`)
    .to.equal(expected.initials);
}
