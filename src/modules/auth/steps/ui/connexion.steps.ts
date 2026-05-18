import { Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import type { FestipodWorld } from '../../../../shared/support/world';

Then('l\'écran gère la redirection automatique après connexion', async function (this: FestipodWorld) {
  // Behavioral — covered by the @e2e scenario
  // "L'écran de connexion redirige vers l'accueil si déjà connecté".
  // At the @ui layer we only verify the screen mounts cleanly.
  expect(this.currentScreenId).to.equal('login');
  expect(this.renderedDoc, 'Login screen should render').to.not.be.null;
});

Then('l\'écran gère l\'état de connexion en cours', async function (this: FestipodWorld) {
  const source = this.getRenderedText();
  const hasConnectingState =
    source.includes("status === 'connecting'") ||
    source.includes("Connexion NextGraph en cours");
  expect(hasConnectingState, 'LoginScreen should handle connecting state').to.be.true;
});

Then('l\'écran n\'importe pas de données de démonstration', async function (this: FestipodWorld) {
  const source = this.getRenderedText();
  const importsSeedData = source.includes('seedData') || source.includes('seedEvents');
  const usesFestipodData = source.includes('useFestipodData');
  expect(importsSeedData, 'LoginScreen should not import seed data').to.be.false;
  expect(usesFestipodData, 'LoginScreen should not use FestipodData context').to.be.false;
});
