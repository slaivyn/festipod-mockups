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
  const existing = this.formFields.get(fieldName);
  this.formFields.set(fieldName, {
    required: existing?.required ?? false,
    value
  });
});

When('je laisse le champ {string} vide', async function (this: FestipodWorld, fieldName: string) {
  const existing = this.formFields.get(fieldName);
  if (existing) {
    this.formFields.set(fieldName, { ...existing, value: '' });
  }
});

When('je soumets le formulaire', async function (this: FestipodWorld) {
  this.attach('Form submitted', 'text/plain');
});

Then('le formulaire contient le champ obligatoire {string}', async function (this: FestipodWorld, fieldName: string) {
  const field = this.formFields.get(fieldName);
  expect(field, `Field "${fieldName}" should exist`).to.not.be.undefined;
  expect(field?.required, `Field "${fieldName}" should be required`).to.equal(true);
});

Then('le formulaire contient les champs obligatoires suivants:', async function (this: FestipodWorld, dataTable) {
  const expectedFields = dataTable.raw().flat();
  expectedFields.forEach((fieldName: string) => {
    const field = this.formFields.get(fieldName);
    expect(field, `Field "${fieldName}" should exist`).to.not.be.undefined;
    expect(field?.required, `Field "${fieldName}" should be required`).to.equal(true);
  });
});

Then('le champ {string} est facultatif', async function (this: FestipodWorld, fieldName: string) {
  const field = this.formFields.get(fieldName);
  if (field) {
    expect(field.required).to.equal(false);
  }
});

Then('le champ {string} affiche {string}', async function (this: FestipodWorld, fieldName: string, expectedValue: string) {
  const field = this.formFields.get(fieldName);
  expect(field?.value).to.equal(expectedValue);
});

Then('le champ {string} est présent', async function (this: FestipodWorld, fieldName: string) {
  const field = this.formFields.get(fieldName);
  expect(field, `Field "${fieldName}" should exist`).to.not.be.undefined;
});

Then('une erreur de validation est affichée pour {string}', async function (this: FestipodWorld, fieldName: string) {
  const field = this.formFields.get(fieldName);
  expect(field?.required).to.equal(true);
  expect(field?.value).to.equal('');
  this.attach(`Validation error for: ${fieldName}`, 'text/plain');
});

Then('le formulaire affiche {int} champs', async function (this: FestipodWorld, count: number) {
  expect(this.formFields.size).to.equal(count);
});
