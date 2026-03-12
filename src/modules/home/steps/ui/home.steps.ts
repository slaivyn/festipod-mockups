import { Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import type { FestipodWorld } from '../../../../shared/support/world';

Then('je peux configurer mes notifications', async function (this: FestipodWorld) {
  expect(this.currentScreenId).to.equal('settings');
  const source = this.getRenderedText();
  expect(/>Notifications</.test(source), 'Settings should have "Notifications" text').to.be.true;
  expect(/<Toggle[^>]*checked=\{notifications\}/.test(source), 'Settings should have Toggle for notifications').to.be.true;
});
