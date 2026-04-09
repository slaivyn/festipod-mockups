import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import type { FestipodWorld } from '../../../../shared/support/world';

// --- Background: ensure wallet has test data ---

Given('le portefeuille contient des données de test', async function (this: FestipodWorld) {
  // Navigate to home and wait for NG data to load
  await this.appFrame!.evaluate(() => { window.location.hash = '#/demo/home'; });

  // Wait for NG-connected home screen with real event data (contains "inscrits" badges)
  const hasData = await this.appFrame!.waitForFunction(
    () => {
      const root = document.getElementById('root');
      return root?.textContent?.includes('inscrits') ?? false;
    },
    { timeout: 15000 },
  ).then(() => true).catch(() => false);

  if (!hasData) {
    // Go to gallery and trigger data loading
    await this.appFrame!.evaluate(() => { window.location.hash = '#/'; });
    await this.appFrame!.waitForTimeout(2000);

    const loadButton = this.appFrame!.locator('button', { hasText: 'Charger données de test' });
    if (await loadButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await loadButton.click();
      await this.appFrame!.waitForFunction(
        () => !Array.from(document.querySelectorAll('button')).some(b => b.textContent?.includes('Chargement...')),
        { timeout: 60000 },
      );
      await this.appFrame!.waitForTimeout(3000);
    }

    // Navigate to home and wait for data
    await this.appFrame!.evaluate(() => { window.location.hash = '#/demo/home'; });
    await this.appFrame!.waitForFunction(
      () => document.getElementById('root')?.textContent?.includes('inscrits') ?? false,
      { timeout: 15000 },
    );
  }
});

// --- Wait helpers ---

When('l\'utilisateur attend que l\'écran {string} soit affiché', async function (this: FestipodWorld, screenId: string) {
  await this.appFrame!.waitForFunction(
    (id: string) => window.location.hash.includes(`demo/${id}`),
    screenId,
    { timeout: 10000 },
  );
  await this.appFrame!.waitForTimeout(1000);
});

// --- Form interaction ---

When('l\'utilisateur remplit le formulaire de création d\'événement:', async function (this: FestipodWorld, dataTable: any) {
  const rows = dataTable.hashes() as { champ: string; valeur: string }[];

  // Wait for the form to render (screen transition may take time in DemoMode)
  const formReady = await this.appFrame!.waitForFunction(
    () => !!document.querySelector('input[placeholder="Donnez un nom à votre événement"]'),
    { timeout: 10000 },
  ).then(() => true).catch(() => false);

  if (!formReady) {
    const debug = await this.appFrame!.evaluate(() => ({
      hash: window.location.hash,
      inputs: Array.from(document.querySelectorAll('input')).map(i => i.placeholder),
      rootText: document.getElementById('root')?.textContent?.substring(0, 300),
    }));
    throw new Error(`Create form not found. Hash: ${debug.hash}, inputs: ${JSON.stringify(debug.inputs)}, content: ${debug.rootText}`);
  }

  for (const { champ, valeur } of rows) {
    if (champ === 'Nom de l\'événement') {
      const input = this.appFrame!.locator('input[placeholder="Donnez un nom à votre événement"]');
      await input.fill(valeur);
      // Dismiss autocomplete suggestions
      await this.appFrame!.locator('body').click({ position: { x: 10, y: 10 } });
      await this.appFrame!.waitForTimeout(300);
    } else if (champ === 'Date de début') {
      await this.appFrame!.locator('input[type="date"]').first().fill(valeur);
    } else if (champ === 'Heure de début') {
      await this.appFrame!.locator('input[type="time"]').first().fill(valeur);
    } else if (champ === 'Lieu') {
      await this.appFrame!.locator('input[placeholder="Ajouter un lieu"]').fill(valeur);
    } else if (champ === 'Description') {
      await this.appFrame!.locator('textarea').fill(valeur);
    }
  }
});

When('l\'utilisateur modifie le champ lieu avec {string}', async function (this: FestipodWorld, valeur: string) {
  // The update form has "Lieu *" label followed by an Input.
  // Find the input by locating the label text and then the nearby input.
  await this.appFrame!.waitForFunction(
    () => document.getElementById('root')?.textContent?.includes('Lieu') ?? false,
    { timeout: 10000 },
  );
  // Use evaluate to find the input next to the "Lieu" label
  await this.appFrame!.evaluate((val: string) => {
    const labels = document.querySelectorAll('*');
    for (const el of labels) {
      if (el.textContent?.trim() === 'Lieu *' && el.tagName !== 'DIV') {
        const parent = el.parentElement;
        const input = parent?.querySelector('input');
        if (input) {
          // Clear and set value via native setter to trigger React onChange
          const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')!.set!;
          nativeInputValueSetter.call(input, val);
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.dispatchEvent(new Event('change', { bubbles: true }));
          return;
        }
      }
    }
  }, valeur);
  await this.appFrame!.waitForTimeout(500);
});

// --- Event navigation ---

When('l\'utilisateur clique sur un événement de l\'accueil', async function (this: FestipodWorld) {
  // Home screen event cards have "inscrits" badge — click the first card container
  await this.appFrame!.waitForFunction(
    () => document.getElementById('root')?.textContent?.includes('inscrits') ?? false,
    { timeout: 10000 },
  );
  // Click the first event card (find by inscrits badge, then click parent card)
  const clicked = await this.appFrame!.evaluate(() => {
    // Find elements containing event data — cards with cursor:pointer
    const cards = document.querySelectorAll('[style*="cursor"]');
    for (const card of cards) {
      if (card.textContent?.includes('inscrits') && card.textContent?.includes('📍')) {
        (card as HTMLElement).click();
        return true;
      }
    }
    return false;
  });
  if (!clicked) {
    expect.fail('No event card found on home screen');
  }
  await this.appFrame!.waitForTimeout(1500);
});

When('l\'utilisateur clique sur un événement de la liste', async function (this: FestipodWorld) {
  // Events screen also has event cards with "inscrits" badges
  await this.appFrame!.waitForFunction(
    () => document.getElementById('root')?.textContent?.includes('inscrits') ?? false,
    { timeout: 10000 },
  );
  const clicked = await this.appFrame!.evaluate(() => {
    const cards = document.querySelectorAll('[style*="cursor"]');
    for (const card of cards) {
      if (card.textContent?.includes('inscrits') && card.textContent?.includes('📍')) {
        (card as HTMLElement).click();
        return true;
      }
    }
    return false;
  });
  if (!clicked) {
    expect.fail('No event card found on events screen');
  }
  await this.appFrame!.waitForTimeout(1500);
});

When('l\'utilisateur clique sur le bouton de modification', async function (this: FestipodWorld) {
  // The edit button shows "✎" in the header — only visible if user is event owner
  const editBtn = this.appFrame!.locator('text=✎').first();
  await editBtn.click();
  await this.appFrame!.waitForTimeout(1500);
});

When('l\'utilisateur clique sur le bouton {string} si visible', async function (this: FestipodWorld, buttonText: string) {
  const button = this.appFrame!.locator('button', { hasText: buttonText }).first();
  if (await button.isVisible({ timeout: 3000 }).catch(() => false)) {
    await button.click();
    await this.appFrame!.waitForTimeout(1000);
  }
  // If not visible, the user is already in the desired state — no-op
});

// --- Text assertions ---

Then('l\'écran contient le texte {string}', async function (this: FestipodWorld, expectedText: string) {
  const appeared = await this.appFrame!.waitForFunction(
    (text: string) => document.getElementById('root')?.textContent?.includes(text) ?? false,
    expectedText,
    { timeout: 10000 },
  ).then(() => true).catch(() => false);

  if (!appeared) {
    const debug = await this.appFrame!.evaluate(() => ({
      hash: window.location.hash,
      rootText: document.getElementById('root')?.textContent?.substring(0, 500),
    }));
    expect.fail(
      `Expected text "${expectedText}" not found. Hash: "${debug.hash}", content: "${debug.rootText}"`,
    );
  }
});

Then('l\'écran ne contient pas le texte {string}', async function (this: FestipodWorld, unexpectedText: string) {
  await this.appFrame!.waitForTimeout(500);
  const found = await this.appFrame!.evaluate(
    (text: string) => document.getElementById('root')?.textContent?.includes(text) ?? false,
    unexpectedText,
  );
  expect(found, `Text "${unexpectedText}" should NOT be present`).to.be.false;
});

Then('l\'écran d\'accueil contient le texte {string}', async function (this: FestipodWorld, expectedText: string) {
  // Navigate to home and wait for NG data + expected text
  await this.appFrame!.evaluate(() => { window.location.hash = '#/demo/home'; });
  const appeared = await this.appFrame!.waitForFunction(
    (text: string) => {
      const root = document.getElementById('root');
      return (root?.textContent?.includes('inscrits') && root?.textContent?.includes(text)) ?? false;
    },
    expectedText,
    { timeout: 15000 },
  ).then(() => true).catch(() => false);

  if (!appeared) {
    const debug = await this.appFrame!.evaluate(() => ({
      hash: window.location.hash,
      rootText: document.getElementById('root')?.textContent?.substring(0, 500),
    }));
    expect.fail(
      `Expected "${expectedText}" on home screen. Hash: "${debug.hash}", content: "${debug.rootText}"`,
    );
  }
});
