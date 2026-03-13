import { Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import type { FestipodWorld } from '../../../../shared/support/world';

Then('l\'écran gère la redirection automatique après connexion', async function (this: FestipodWorld) {
  const source = this.getRenderedText();
  // LoginScreen must have a useEffect that navigates on status === 'connected'
  const hasAutoNavigate =
    source.includes('useEffect') &&
    source.includes("status === 'connected'") &&
    source.includes("navigate") &&
    source.includes("'home'");
  expect(hasAutoNavigate, 'LoginScreen should auto-navigate to home when status becomes connected').to.be.true;
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
