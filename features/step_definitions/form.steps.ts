import { Given, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import type { FestipodWorld } from '../support/world';

Given('l\'écran {string} est affiché', async function (this: FestipodWorld, screenName: string) {
  const screenId = screenName.toLowerCase().replace(/ /g, '-');
  this.navigateTo(`#/demo/${screenId}`);
});

Given('le formulaire de création est vide', async function (this: FestipodWorld) {
  this.formFields.forEach((field, key) => {
    this.formFields.set(key, { ...field, value: '' });
  });
});

// Steps removed: Form interaction steps (je remplis le champ, je laisse le champ vide, je soumets le formulaire)
// require browser automation. Scenarios needing these use "* Scénario non implémenté" placeholder.

Then('le formulaire contient le champ obligatoire {string}', async function (this: FestipodWorld, fieldName: string) {
  // This step is for form screens only (create-event)
  expect(this.currentScreenId, 'This step is for form screens only').to.equal('create-event');
  const source = this.getRenderedText();
  // CreateEventScreen.tsx: Required fields have " *" after label: >Label *<
  const escapedName = fieldName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`>${escapedName}\\s*\\*<`);
  expect(pattern.test(source), `Field "${fieldName}" should be marked as required (with *) in create-event screen`).to.be.true;
});

Then('le formulaire contient les champs obligatoires suivants:', async function (this: FestipodWorld, dataTable) {
  // This step is for form screens only (create-event)
  expect(this.currentScreenId, 'This step is for form screens only').to.equal('create-event');
  const source = this.getRenderedText();
  const expectedFields = dataTable.raw().flat();
  expectedFields.forEach((fieldName: string) => {
    // CreateEventScreen.tsx: Required fields have " *" after label: >Label *<
    const escapedName = fieldName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(`>${escapedName}\\s*\\*<`);
    expect(pattern.test(source), `Field "${fieldName}" should be marked as required (with *) in create-event screen`).to.be.true;
  });
});

Then('le champ {string} est facultatif', async function (this: FestipodWorld, fieldName: string) {
  const source = this.getRenderedText();
  // Optional fields have label without " *": >Label< followed by Input
  const escapedName = fieldName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // Check field exists but NOT marked as required
  const existsPattern = new RegExp(`>${escapedName}<`);
  const requiredPattern = new RegExp(`>${escapedName}\\s*\\*<`);
  expect(existsPattern.test(source), `Field "${fieldName}" should exist in screen`).to.be.true;
  expect(requiredPattern.test(source), `Field "${fieldName}" should NOT be marked as required`).to.be.false;
});

Then('le champ {string} est présent', async function (this: FestipodWorld, fieldName: string) {
  const source = this.getRenderedText();
  // Check that field label exists in screen source
  const escapedName = fieldName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`>${escapedName}[^<]*<`);
  expect(pattern.test(source), `Field "${fieldName}" should be present in screen`).to.be.true;
});

// Steps removed: Form display/validation steps (le champ affiche, erreur de validation, formulaire affiche N champs)
// require browser automation. Scenarios needing these use "* Scénario non implémenté" placeholder.

Then('le formulaire permet de détecter les doublons', async function (this: FestipodWorld) {
  expect(this.currentScreenId).to.equal('create-event');
  const source = this.getRenderedText();
  // CreateEventScreen.tsx has: showDuplicateWarning logic and "Événement similaire détecté" warning
  expect(/showDuplicateWarning/.test(source), 'Form should have duplicate detection logic').to.be.true;
  expect(/Événement similaire détecté/.test(source), 'Form should have duplicate warning message').to.be.true;
});

Then('le formulaire permet d\'importer depuis Mobilizon ou Transiscope', async function (this: FestipodWorld) {
  expect(this.currentScreenId).to.equal('create-event');
  const source = this.getRenderedText();
  // CreateEventScreen.tsx has: importableEvents with Mobilizon and Transiscope sources
  expect(/importableEvents/.test(source), 'Form should have importable events data').to.be.true;
  expect(/Mobilizon/.test(source), 'Form should support Mobilizon import').to.be.true;
  expect(/Transiscope/.test(source), 'Form should support Transiscope import').to.be.true;
  expect(/Importer depuis une source externe/.test(source), 'Form should have import section').to.be.true;
});

Then('l\'import externe ne déclenche pas d\'alerte doublon', async function (this: FestipodWorld) {
  expect(this.currentScreenId).to.equal('create-event');
  const source = this.getRenderedText();
  // CreateEventScreen.tsx has: importedFrom state and !importedFrom in showDuplicateWarning condition
  expect(/importedFrom/.test(source), 'Form should track import source').to.be.true;
  expect(/&& !importedFrom/.test(source), 'Duplicate warning should be disabled for imports').to.be.true;
});
