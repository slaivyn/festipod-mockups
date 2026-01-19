import { Before, After, BeforeAll, AfterAll, Status } from '@cucumber/cucumber';
import type { FestipodWorld } from './world';

BeforeAll(async function () {
  console.log('Starting Festipod BDD tests...');
});

Before(async function (this: FestipodWorld, scenario) {
  this.currentRoute = '#/';
  this.currentScreenId = null;
  this.formFields.clear();
  this.navigationHistory = [];
  this.isAuthenticated = false;
  this.screenSourceContent = '';
  this.currentScreen = null;

  // Skipped scenarios use the "* Scénario non implémenté" placeholder step
  // which returns 'skipped' - no special handling needed in the hook
});

After(async function (this: FestipodWorld, scenario) {
  if (scenario.result?.status === Status.FAILED) {
    this.attach(`Current route: ${this.currentRoute}`, 'text/plain');
    this.attach(`Current screen: ${this.currentScreenId}`, 'text/plain');
    this.attach(`Navigation history: ${JSON.stringify(this.navigationHistory)}`, 'text/plain');
    this.attach(`Form fields: ${JSON.stringify(Array.from(this.formFields.entries()))}`, 'text/plain');
    if (this.screenSourceContent) {
      // Show first 500 chars of source to help debug
      this.attach(`Screen source (first 500 chars): ${this.screenSourceContent.substring(0, 500)}...`, 'text/plain');
    }
  }
  // Clean up
  this.cleanup();
});

AfterAll(async function () {
  console.log('Festipod BDD tests completed.');
});
