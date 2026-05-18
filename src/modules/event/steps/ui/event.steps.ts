import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import type { FestipodWorld } from '../../../../shared/support/world';

When('je clique sur un événement', async function (this: FestipodWorld) {
  await this.navigateTo('#/demo/event-detail');
});

Given('je visualise l\'événement {string}', async function (this: FestipodWorld, eventName: string) {
  await this.navigateTo('#/demo/event-detail');
  expect(this.currentScreen, 'Event detail screen should be loaded').to.not.be.null;
  this.attach(`Viewing event: ${eventName}`, 'text/plain');
});

Then('je peux annuler et revenir à l\'écran précédent', async function (this: FestipodWorld) {
  expect(this.currentScreenId).to.equal('create-event');
  const doc = this.renderedDoc;
  expect(doc, 'Screen should be rendered').to.not.be.null;
  const text = doc!.body.textContent ?? '';
  expect(text.includes('✕'), 'Create event step 1 should expose a ✕ close button').to.be.true;
});

Then('je peux voir la liste des participants', async function (this: FestipodWorld) {
  expect(this.currentScreenId).to.equal('event-detail');
  const doc = this.renderedDoc;
  expect(doc, 'Screen should be rendered').to.not.be.null;
  const avatars = doc!.querySelectorAll('.app-avatar');
  expect(avatars.length, 'Event detail should render at least one participant avatar').to.be.greaterThan(0);
  const text = doc!.body.textContent ?? '';
  expect(/Participants\s*\(\d+\)/.test(text), 'Event detail should show a "Participants (N)" section').to.be.true;
});

Then('je peux voir les détails de l\'événement', async function (this: FestipodWorld) {
  expect(this.currentScreenId).to.equal('event-detail');
  const doc = this.renderedDoc;
  expect(doc, 'Screen should be rendered').to.not.be.null;
  const text = doc!.body.textContent ?? '';
  expect(text.includes('📅'), 'Event detail should show a date icon').to.be.true;
  expect(text.includes('📍'), 'Event detail should show a location icon').to.be.true;
});

Then('l\'écran affiche les informations de l\'événement', async function (this: FestipodWorld) {
  expect(this.currentScreenId).to.equal('event-detail');
  const doc = this.renderedDoc;
  expect(doc, 'Screen should be rendered').to.not.be.null;
  const text = doc!.body.textContent ?? '';
  expect(text.includes('📅'), 'Event detail should show a date icon').to.be.true;
  expect(text.includes('📍'), 'Event detail should show a location icon').to.be.true;
  expect(text.length, 'Event detail body should contain content').to.be.greaterThan(50);
});

Then('je peux voir la liste des événements', async function (this: FestipodWorld) {
  const doc = this.renderedDoc;
  expect(doc, 'Screen should be rendered').to.not.be.null;
  const text = doc!.body.textContent ?? '';
  if (this.currentScreenId === 'home') {
    expect(text.includes('En cours') || text.includes('À venir'),
      'Home should show event section headers').to.be.true;
  } else if (this.currentScreenId === 'events') {
    const cards = doc!.querySelectorAll('.app-card');
    expect(cards.length, 'Events screen should render at least one event card').to.be.greaterThan(0);
  } else {
    expect.fail(`Unexpected screen "${this.currentScreenId}" - events list should be on home or events screen`);
  }
});

Then('les événements affichent leur lieu', async function (this: FestipodWorld) {
  const doc = this.renderedDoc;
  expect(doc, 'Screen should be rendered').to.not.be.null;
  const text = doc!.body.textContent ?? '';
  // List/discover cards show "<date> · <location>" without an icon. Detail
  // screen uses 📍. Accept either signal — the assertion is that location
  // text is visible on event cards.
  const seedLocations = ['Le Revel', 'La Maison du Vélo', "Tiers-lieu L'Hermitage", 'MJC Montplaisir'];
  const hasSeedLocation = seedLocations.some(loc => text.includes(loc));
  expect(hasSeedLocation || text.includes('📍'),
    'Event cards should display a location (text or 📍 icon)').to.be.true;
});

Then('je peux m\'inscrire à l\'événement', async function (this: FestipodWorld) {
  expect(this.currentScreenId).to.equal('event-detail');
  const doc = this.renderedDoc;
  expect(doc, 'Screen should be rendered').to.not.be.null;
  const buttons = Array.from(doc!.querySelectorAll('button')).map(b => b.textContent ?? '');
  const hasToggle = buttons.some(t => t.includes("J'y serai") || t.includes('Je participe'));
  expect(hasToggle, 'Event detail should expose a join/leave toggle button').to.be.true;
});

Then('je peux me désinscrire de l\'événement', async function (this: FestipodWorld) {
  expect(this.currentScreenId).to.equal('event-detail');
  const doc = this.renderedDoc;
  expect(doc, 'Screen should be rendered').to.not.be.null;
  const buttons = Array.from(doc!.querySelectorAll('button')).map(b => b.textContent ?? '');
  const hasToggle = buttons.some(t => t.includes("J'y serai") || t.includes('Je participe'));
  expect(hasToggle, 'Event detail should expose a join/leave toggle button').to.be.true;
});

// --- Create-event form assertions ---

Then('le formulaire contient le champ obligatoire {string}', async function (this: FestipodWorld, fieldName: string) {
  expect(this.currentScreenId, 'This step is for form screens only').to.equal('create-event');
  expectRequiredField(this, fieldName);
});

Then('le formulaire contient les champs obligatoires suivants:', async function (this: FestipodWorld, dataTable) {
  expect(this.currentScreenId, 'This step is for form screens only').to.equal('create-event');
  const expectedFields = dataTable.raw().flat();
  expectedFields.forEach((fieldName: string) => expectRequiredField(this, fieldName));
});

function expectRequiredField(world: FestipodWorld, fieldName: string) {
  // Required-field labels end with " *" — read paragraph labels and check.
  const doc = world.renderedDoc;
  expect(doc, 'Screen should be rendered').to.not.be.null;
  const labels = Array.from(doc!.querySelectorAll('p'))
    .map(p => (p.textContent ?? '').trim());
  if (labels.some(t => t === `${fieldName} *` || t.startsWith(`${fieldName} *`))) return;
  // The wizard reveals some fields only after the first step. Falling back to
  // a body-text scan still proves the form *intends* to require this field.
  const body = doc!.body.textContent ?? '';
  expect(body.includes(`${fieldName} *`),
    `Field "${fieldName}" should be marked as required (with *) in create-event screen`,
  ).to.be.true;
}
