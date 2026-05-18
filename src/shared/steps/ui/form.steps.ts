import { Given, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import type { FestipodWorld } from '../../support/world';

Given('l\'écran {string} est affiché', async function (this: FestipodWorld, screenName: string) {
  const screenId = screenName.toLowerCase().replace(/ /g, '-');
  await this.navigateTo(`#/demo/${screenId}`);
});

Given('le formulaire de création est vide', async function (this: FestipodWorld) {
  this.formFields.forEach((field, key) => {
    this.formFields.set(key, { ...field, value: '' });
  });
});

Then('le champ {string} est facultatif', async function (this: FestipodWorld, fieldName: string) {
  const source = this.getRenderedText();
  const escapedName = fieldName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const existsPattern = new RegExp(`>${escapedName}<`);
  const requiredPattern = new RegExp(`>${escapedName}\\s*\\*<`);
  expect(existsPattern.test(source), `Field "${fieldName}" should exist in screen`).to.be.true;
  expect(requiredPattern.test(source), `Field "${fieldName}" should NOT be marked as required`).to.be.false;
});

Then('le champ {string} est présent', async function (this: FestipodWorld, fieldName: string) {
  const source = this.getRenderedText();
  const escapedName = fieldName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`>${escapedName}[^<]*<`);
  expect(pattern.test(source), `Field "${fieldName}" should be present in screen`).to.be.true;
});
