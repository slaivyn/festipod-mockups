import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import type { FestipodWorld } from '../../../../shared/support/world';

When('je clique sur un événement', async function (this: FestipodWorld) {
  this.navigateTo('#/demo/event-detail');
});

Given('je visualise l\'événement {string}', async function (this: FestipodWorld, eventName: string) {
  this.navigateTo('#/demo/event-detail');
  expect(this.currentScreen, 'Event detail screen should be loaded').to.not.be.null;
  this.attach(`Viewing event: ${eventName}`, 'text/plain');
});

Then('je peux annuler et revenir à l\'écran précédent', async function (this: FestipodWorld) {
  expect(this.currentScreenId).to.equal('create-event');
  const source = this.getRenderedText();
  const found = /onClick\s*=\s*\{\s*\(\)\s*=>\s*navigate\s*\(['"]home['"]\)\s*\}[^>]*>✕</.test(source);
  expect(found, 'Create event screen should have ✕ button with navigate("home")').to.be.true;
});

Then('je peux voir la liste des participants', async function (this: FestipodWorld) {
  expect(this.currentScreenId).to.equal('event-detail');
  const source = this.getRenderedText();
  const hasAvatars = /<Avatar/.test(source);
  const hasParticipantsSection = /Participants\s*\(\d+\)/.test(source);
  expect(hasAvatars, 'Event detail should have Avatar components for participants').to.be.true;
  expect(hasParticipantsSection, 'Event detail should have "Participants (N)" section').to.be.true;
});

Then('je peux voir les détails de l\'événement', async function (this: FestipodWorld) {
  expect(this.currentScreenId).to.equal('event-detail');
  const source = this.getRenderedText();
  expect(/<Title[^>]*>[^<]+<\/Title>/.test(source), 'Event detail should have a Title').to.be.true;
  expect(/📅/.test(source), 'Event detail should have date emoji 📅').to.be.true;
  expect(/🕓/.test(source), 'Event detail should have time emoji 🕓').to.be.true;
  expect(/📍/.test(source), 'Event detail should have location emoji 📍').to.be.true;
  expect(/À propos/.test(source), 'Event detail should have "À propos" section').to.be.true;
});

Then('l\'écran affiche les informations de l\'événement', async function (this: FestipodWorld) {
  expect(this.currentScreenId).to.equal('event-detail');
  const source = this.getRenderedText();
  expect(/<Title[^>]*>[^<]+<\/Title>/.test(source), 'Event detail should have a Title').to.be.true;
  expect(/📅/.test(source), 'Event detail should have date emoji 📅').to.be.true;
  expect(/🕓/.test(source), 'Event detail should have time emoji 🕓').to.be.true;
  expect(/📍/.test(source), 'Event detail should have location emoji 📍').to.be.true;
  expect(/À propos/.test(source), 'Event detail should have "À propos" section').to.be.true;
});

Then('je peux voir la liste des événements', async function (this: FestipodWorld) {
  const source = this.getRenderedText();
  if (this.currentScreenId === 'home') {
    expect(/Mes événements à venir/.test(source), 'Home screen should have "Événements à venir" text').to.be.true;
  } else if (this.currentScreenId === 'events') {
    expect(/<Card[^>]*onClick/.test(source), 'Events screen should have clickable Card components').to.be.true;
  } else {
    expect.fail(`Unexpected screen "${this.currentScreenId}" - events list should be on home or events screen`);
  }
});

Then('les événements affichent leur lieu', async function (this: FestipodWorld) {
  const source = this.getRenderedText();
  const locationPattern = /📍.*<span[^>]*className="user-content"[^>]*>[^<]+<\/span>/;
  expect(locationPattern.test(source), 'Event cards should display location text after 📍 emoji').to.be.true;
});

Then('je peux m\'inscrire à l\'événement', async function (this: FestipodWorld) {
  expect(this.currentScreenId).to.equal('event-detail');
  const source = this.getRenderedText();
  const hasParticiperButton = /isJoined \? '✓ Inscrit' : 'Participer'/.test(source);
  expect(hasParticiperButton, 'Event detail should have Participer/Inscrit toggle button').to.be.true;
});

Then('je peux me désinscrire de l\'événement', async function (this: FestipodWorld) {
  expect(this.currentScreenId).to.equal('event-detail');
  const source = this.getRenderedText();
  const hasInscritButton = /isJoined \? '✓ Inscrit' : 'Participer'/.test(source);
  expect(hasInscritButton, 'Event detail should have Participer/Inscrit toggle button (click to unregister)').to.be.true;
});

// Event form steps (create-event specific)

Then('le formulaire contient le champ obligatoire {string}', async function (this: FestipodWorld, fieldName: string) {
  expect(this.currentScreenId, 'This step is for form screens only').to.equal('create-event');
  const source = this.getRenderedText();
  const escapedName = fieldName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`>${escapedName}\\s*\\*<`);
  expect(pattern.test(source), `Field "${fieldName}" should be marked as required (with *) in create-event screen`).to.be.true;
});

Then('le formulaire contient les champs obligatoires suivants:', async function (this: FestipodWorld, dataTable) {
  expect(this.currentScreenId, 'This step is for form screens only').to.equal('create-event');
  const source = this.getRenderedText();
  const expectedFields = dataTable.raw().flat();
  expectedFields.forEach((fieldName: string) => {
    const escapedName = fieldName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(`>${escapedName}\\s*\\*<`);
    expect(pattern.test(source), `Field "${fieldName}" should be marked as required (with *) in create-event screen`).to.be.true;
  });
});

Then('le formulaire permet de détecter les doublons', async function (this: FestipodWorld) {
  expect(this.currentScreenId).to.equal('create-event');
  const source = this.getRenderedText();
  expect(/showDuplicateWarning/.test(source), 'Form should have duplicate detection logic').to.be.true;
  expect(/Événement similaire détecté/.test(source), 'Form should have duplicate warning message').to.be.true;
});

Then('le formulaire permet d\'importer depuis Mobilizon ou Transiscope', async function (this: FestipodWorld) {
  expect(this.currentScreenId).to.equal('create-event');
  const source = this.getRenderedText();
  expect(/importableEvents/.test(source), 'Form should have importable events data').to.be.true;
  expect(/Mobilizon/.test(source), 'Form should support Mobilizon import').to.be.true;
  expect(/Transiscope/.test(source), 'Form should support Transiscope import').to.be.true;
  expect(/Importer depuis une source externe/.test(source), 'Form should have import section').to.be.true;
});

Then('l\'import externe ne déclenche pas d\'alerte doublon', async function (this: FestipodWorld) {
  expect(this.currentScreenId).to.equal('create-event');
  const source = this.getRenderedText();
  expect(/importedFrom/.test(source), 'Form should track import source').to.be.true;
  expect(/&& !importedFrom/.test(source), 'Duplicate warning should be disabled for imports').to.be.true;
});
