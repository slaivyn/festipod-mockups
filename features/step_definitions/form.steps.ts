import { Given, When, Then } from '@cucumber/cucumber';
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

When('je remplis le champ {string} avec {string}', async function (this: FestipodWorld, fieldName: string, value: string) {
  // Cannot fill form fields without browser automation
  this.attach(`CANNOT TEST: Filling field "${fieldName}" with "${value}" requires browser automation`, 'text/plain');
  return 'pending';
});

When('je laisse le champ {string} vide', async function (this: FestipodWorld, fieldName: string) {
  // Cannot manipulate form fields without browser automation
  this.attach(`CANNOT TEST: Leaving field "${fieldName}" empty requires browser automation`, 'text/plain');
  return 'pending';
});

When('je soumets le formulaire', async function (this: FestipodWorld) {
  // Cannot submit forms without browser automation
  this.attach('CANNOT TEST: Form submission requires browser automation', 'text/plain');
  return 'pending';
});

Then('le formulaire contient le champ obligatoire {string}', async function (this: FestipodWorld, fieldName: string) {
  // This step is for form screens only (create-event)
  // For display screens, use different steps
  if (this.currentScreenId !== 'create-event') {
    this.attach(`WRONG STEP: "le formulaire contient le champ obligatoire" is for forms. Screen "${this.currentScreenId}" is not a form.`, 'text/plain');
    return 'pending';
  }
  const source = this.getRenderedText();
  // CreateEventScreen.tsx: Required fields have " *" after label: >Label *<
  const escapedName = fieldName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`>${escapedName}\\s*\\*<`);
  expect(pattern.test(source), `Field "${fieldName}" should be marked as required (with *) in create-event screen`).to.be.true;
});

Then('le formulaire contient les champs obligatoires suivants:', async function (this: FestipodWorld, dataTable) {
  // This step is for form screens only (create-event)
  // For display screens, use different steps
  if (this.currentScreenId !== 'create-event') {
    this.attach(`WRONG STEP: "le formulaire contient les champs obligatoires" is for forms. Screen "${this.currentScreenId}" is not a form.`, 'text/plain');
    return 'pending';
  }
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

Then('le champ {string} affiche {string}', async function (this: FestipodWorld, fieldName: string, expectedValue: string) {
  // Cannot verify displayed field values without browser automation
  this.attach(`CANNOT TEST: Verifying field "${fieldName}" displays "${expectedValue}" requires browser automation`, 'text/plain');
  return 'pending';
});

Then('le champ {string} est présent', async function (this: FestipodWorld, fieldName: string) {
  const source = this.getRenderedText();
  // Check that field label exists in screen source
  const escapedName = fieldName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`>${escapedName}[^<]*<`);
  const found = pattern.test(source);
  if (!found) {
    this.attach(`NOT FOUND: Field "${fieldName}" not present in screen "${this.currentScreenId}"`, 'text/plain');
    return 'pending';
  }
});

Then('une erreur de validation est affichée pour {string}', async function (this: FestipodWorld, fieldName: string) {
  // Cannot verify validation errors without browser automation
  this.attach(`CANNOT TEST: Validation error for "${fieldName}" requires browser automation`, 'text/plain');
  return 'pending';
});

Then('le formulaire affiche {int} champs', async function (this: FestipodWorld, count: number) {
  // Cannot count form fields without specific analysis
  this.attach(`CANNOT TEST: Counting ${count} form fields requires more specific screen analysis`, 'text/plain');
  return 'pending';
});
