import { When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import type { FestipodWorld } from '../../../../shared/support/world';

// --- E2E step definitions ---
// These interact with the REAL app running in the browser (via broker iframe),
// not the test harness bridge. They test actual UI behavior.

// Screen content markers — text that uniquely identifies each screen
const SCREEN_MARKERS: Record<string, string> = {
  'home': 'Mes événements à venir',
  'events': 'Découvrir',
  'login': 'connecter',
  'profile': 'Mon profil',
  'create-event': "Nom de l'événement",
  'settings': 'Paramètres',
};

When('l\'utilisateur navigue vers l\'écran {string}', async function (this: FestipodWorld, screenId: string) {
  await this.appFrame!.evaluate((id: string) => {
    window.location.hash = `#/demo/${id}`;
  }, screenId);
  // Wait for React to process the navigation
  await this.appFrame!.waitForTimeout(1500);
});

When('l\'utilisateur navigue vers l\'écran {string} sans historique', async function (this: FestipodWorld, screenId: string) {
  // Use replaceState to navigate without creating a back-history entry
  // (simulates the app being loaded directly at a DemoMode URL in the broker iframe)
  await this.appFrame!.evaluate((id: string) => {
    window.history.replaceState(null, '', `#/demo/${id}`);
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  }, screenId);
  await this.appFrame!.waitForTimeout(1500);
});

Then('l\'application est toujours dans l\'iframe', async function (this: FestipodWorld) {
  // Verify the app didn't redirect away (initNgWeb would redirect if not in iframe)
  const url = await this.appFrame!.evaluate(() => window.location.href);
  expect(url, 'App should still be on localhost, not redirected to broker').to.include('127.0.0.1');

  // Verify the app rendered (not a blank page or error)
  const hasContent = await this.appFrame!.evaluate(() => {
    const root = document.getElementById('root');
    return root && root.innerHTML.length > 100;
  });
  expect(hasContent, 'App should have rendered content').to.be.true;
});

Then('l\'application affiche l\'écran {string}', async function (this: FestipodWorld, expectedScreenId: string) {
  const marker = SCREEN_MARKERS[expectedScreenId];

  // Wait for the expected screen to appear (handles async redirects like login→home)
  const appeared = await this.appFrame!.waitForFunction(
    ([id, markerText]: [string, string | undefined]) => {
      const hash = window.location.hash;
      if (!hash.includes(`demo/${id}`)) return false;

      const root = document.getElementById('root');
      if (!root || root.innerHTML.length < 100) return false;

      // If we have a marker, verify screen content too
      if (markerText) {
        return root.textContent?.includes(markerText) ?? false;
      }
      return true;
    },
    [expectedScreenId, marker] as [string, string | undefined],
    { timeout: 10000 },
  ).then(() => true).catch(() => false);

  if (!appeared) {
    // Gather debug info on failure
    const debug = await this.appFrame!.evaluate(() => ({
      hash: window.location.hash,
      rootText: document.getElementById('root')?.textContent?.substring(0, 300),
    }));
    expect.fail(
      `Expected screen "${expectedScreenId}" but got hash="${debug.hash}", ` +
      `content: "${debug.rootText}"`,
    );
  }
});

Then('l\'URL contient {string}', async function (this: FestipodWorld, expected: string) {
  const hash = await this.appFrame!.evaluate(() => window.location.hash);
  expect(hash, `URL hash should contain "${expected}"`).to.include(expected);
});

When('l\'utilisateur clique sur le bouton {string}', async function (this: FestipodWorld, buttonText: string) {
  // Click button matching the text inside the app iframe
  const button = this.appFrame!.locator(`button`, { hasText: buttonText });
  await button.first().click();
  await this.appFrame!.waitForTimeout(1000);
});

Then('l\'application affiche la galerie', async function (this: FestipodWorld) {
  const appeared = await this.appFrame!.waitForFunction(
    () => {
      const root = document.getElementById('root');
      if (!root) return false;
      const hash = window.location.hash;
      // Gallery is at #/ or empty hash
      const isGalleryHash = hash === '#/' || hash === '' || hash === '#';
      // Gallery shows screen thumbnails — look for "Tous les écrans" or screen grid
      const isGalleryContent = root.textContent?.includes('Wireframe') ?? false;
      return isGalleryHash || isGalleryContent;
    },
    { timeout: 10000 },
  ).then(() => true).catch(() => false);

  if (!appeared) {
    const debug = await this.appFrame!.evaluate(() => ({
      hash: window.location.hash,
      rootText: document.getElementById('root')?.textContent?.substring(0, 300),
    }));
    expect.fail(
      `Expected Gallery but got hash="${debug.hash}", content: "${debug.rootText}"`,
    );
  }
});
