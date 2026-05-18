import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import type { FestipodWorld } from '../../../../shared/support/world';

// --- Background: ensure wallet has test data ---
//
// The app loads test data automatically on first NG connection (handled inside
// FestipodDataProvider). We just navigate to /home and wait for events to
// appear in the UI.

Given('le portefeuille contient des données de test', async function (this: FestipodWorld) {
  // Navigate to /events to verify the wallet has events. We use /events
  // rather than /home because home filters by the current user's
  // participations, which may hydrate after a longer delay in NG mode.
  await this.appFrame!.evaluate(() => {
    window.history.pushState(null, '', '/events');
    window.dispatchEvent(new PopStateEvent('popstate'));
  });

  // EventsScreen renders Card components (class app-card) when events load.
  const hasData = await this.appFrame!.waitForFunction(
    () => document.querySelectorAll('.app-card').length > 0,
    { timeout: 30000 },
  ).then(() => true).catch(() => false);

  if (!hasData) {
    const debug = await this.appFrame!.evaluate(() => ({
      pathname: window.location.pathname,
      rootText: document.getElementById('root')?.textContent?.substring(0, 500),
    }));
    throw new Error(`No events on events screen. Path: ${debug.pathname}, content: ${debug.rootText}`);
  }
});

// --- Wait helpers ---

When('l\'utilisateur attend que l\'écran {string} soit affiché', async function (this: FestipodWorld, screenId: string) {
  // We match on pathname prefix to allow for dynamic ids (event-detail etc.).
  const expectedPath = screenId === 'event-detail' ? '/events/' :
                       screenId === 'update-event' ? '/edit' :
                       screenId === 'create-event' ? '/events/new' :
                       screenId === 'home' ? '/home' :
                       screenId === 'events' ? '/events' :
                       '/' + screenId;

  await this.appFrame!.waitForFunction(
    (path: string) => {
      const current = window.location.pathname;
      if (path === '/edit') return current.endsWith('/edit');
      return current.startsWith(path);
    },
    expectedPath,
    { timeout: 10000 },
  );
  await this.appFrame!.waitForTimeout(1000);
});

// --- Form interaction ---

When('l\'utilisateur remplit le formulaire de création d\'événement:', async function (this: FestipodWorld, dataTable: any) {
  const rows = dataTable.hashes() as { champ: string; valeur: string }[];

  // The new CreateEventScreen is a 3-step wizard:
  // Step 1: name + dates
  // Step 2: similar-event warning (skipped if none)
  // Step 3: location + description + times
  //
  // We'll fill Step 1 fields first, click Next, then fill remaining fields.

  const formReady = await this.appFrame!.waitForFunction(
    () => !!document.querySelector('input[placeholder="Donnez un nom à votre événement"]'),
    { timeout: 10000 },
  ).then(() => true).catch(() => false);

  if (!formReady) {
    const debug = await this.appFrame!.evaluate(() => ({
      pathname: window.location.pathname,
      inputs: Array.from(document.querySelectorAll('input')).map(i => i.placeholder),
      rootText: document.getElementById('root')?.textContent?.substring(0, 300),
    }));
    throw new Error(`Create form not found. Path: ${debug.pathname}, inputs: ${JSON.stringify(debug.inputs)}, content: ${debug.rootText}`);
  }

  const byChamp: Record<string, string> = {};
  for (const { champ, valeur } of rows) byChamp[champ] = valeur;

  // Step 1: name + start/end date
  if (byChamp['Nom de l\'événement']) {
    const input = this.appFrame!.locator('input[placeholder="Donnez un nom à votre événement"]');
    await input.fill(byChamp['Nom de l\'événement']);
  }
  if (byChamp['Date de début']) {
    await this.appFrame!.locator('input[type="date"]').first().fill(byChamp['Date de début']);
  }
  if (byChamp['Date de fin']) {
    await this.appFrame!.locator('input[type="date"]').nth(1).fill(byChamp['Date de fin']);
  }

  // Advance to step 3 (may pass through step 2 if a similar event matches)
  let stepBtn = this.appFrame!.locator('button', { hasText: 'Suivant' });
  await stepBtn.first().click();
  await this.appFrame!.waitForTimeout(500);

  // If we're on step 2 (warning), click Next again
  const onStep2 = await this.appFrame!.evaluate(
    () => document.body.textContent?.includes('Événement similaire détecté') ?? false,
  );
  if (onStep2) {
    stepBtn = this.appFrame!.locator('button', { hasText: 'Suivant' });
    await stepBtn.first().click();
    await this.appFrame!.waitForTimeout(500);
  }

  // Step 3 inputs
  if (byChamp['Heure de début']) {
    await this.appFrame!.locator('input[type="time"]').first().fill(byChamp['Heure de début']);
  }
  if (byChamp['Heure de fin']) {
    await this.appFrame!.locator('input[type="time"]').nth(1).fill(byChamp['Heure de fin']);
  }
  if (byChamp['Lieu']) {
    await this.appFrame!.locator('input[placeholder="Ajouter un lieu"]').fill(byChamp['Lieu']);
  }
  if (byChamp['Description']) {
    await this.appFrame!.locator('textarea').fill(byChamp['Description']);
  }
});

When('l\'utilisateur modifie le champ lieu avec {string}', async function (this: FestipodWorld, valeur: string) {
  // UpdateEventScreen has a "Lieu *" label followed by an Input. Find the input
  // adjacent to that label.
  await this.appFrame!.waitForFunction(
    () => document.getElementById('root')?.textContent?.includes('Lieu') ?? false,
    { timeout: 10000 },
  );
  await this.appFrame!.evaluate((val: string) => {
    const labels = document.querySelectorAll('*');
    for (const el of labels) {
      if (el.textContent?.trim() === 'Lieu *' && el.tagName !== 'DIV') {
        const parent = el.parentElement;
        const input = parent?.querySelector('input');
        if (input) {
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
  // HomeScreen renders only events the current user participates in. If
  // participations haven't hydrated from NG yet, the screen is empty — fall
  // back to /events (no participation filter).
  await this.appFrame!.evaluate(() => {
    window.history.pushState(null, '', '/home');
    window.dispatchEvent(new PopStateEvent('popstate'));
  });
  const homeHasCards = await this.appFrame!.waitForFunction(
    () => document.querySelectorAll('.app-card').length > 0,
    { timeout: 5000 },
  ).then(() => true).catch(() => false);
  if (!homeHasCards) {
    await this.appFrame!.evaluate(() => {
      window.history.pushState(null, '', '/events');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });
    await this.appFrame!.waitForFunction(
      () => document.querySelectorAll('.app-card').length > 0,
      { timeout: 10000 },
    );
  }
  const clicked = await this.appFrame!.evaluate(() => {
    // EventCard has class app-card and onClick navigates to /events/:id
    const cards = document.querySelectorAll('.app-card');
    for (const card of cards) {
      const el = card as HTMLElement;
      // Skip cards without cursor pointer (non-interactive)
      if (el.style.cursor === 'pointer' || window.getComputedStyle(el).cursor === 'pointer') {
        el.click();
        return true;
      }
    }
    // Fallback: any cursor:pointer element with location marker
    const anyClickable = document.querySelectorAll('[style*="cursor"]');
    for (const el of anyClickable) {
      const e = el as HTMLElement;
      if (e.textContent && e.textContent.length > 20 && e.querySelector('.app-card, [class*="card"]') === null) {
        // Skip — find an actual card
      }
    }
    return false;
  });
  if (!clicked) {
    const debug = await this.appFrame!.evaluate(() => ({
      pathname: window.location.pathname,
      rootText: document.getElementById('root')?.textContent?.substring(0, 500),
    }));
    expect.fail(`No event card found on home screen. Path: ${debug.pathname}, content: ${debug.rootText}`);
  }
  await this.appFrame!.waitForTimeout(1500);
});

When('l\'utilisateur clique sur un événement de la liste', async function (this: FestipodWorld) {
  // EventsScreen also uses Card with .app-card class.
  await this.appFrame!.waitForFunction(
    () => document.querySelectorAll('.app-card').length > 0,
    { timeout: 10000 },
  );
  const clicked = await this.appFrame!.evaluate(() => {
    const cards = document.querySelectorAll('.app-card');
    for (const card of cards) {
      const el = card as HTMLElement;
      if (el.style.cursor === 'pointer' || window.getComputedStyle(el).cursor === 'pointer') {
        el.click();
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
      pathname: window.location.pathname,
      rootText: document.getElementById('root')?.textContent?.substring(0, 500),
    }));
    expect.fail(
      `Expected text "${expectedText}" not found. Path: "${debug.pathname}", content: "${debug.rootText}"`,
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
  await this.appFrame!.evaluate(() => {
    window.history.pushState(null, '', '/home');
    window.dispatchEvent(new PopStateEvent('popstate'));
  });
  const appeared = await this.appFrame!.waitForFunction(
    (text: string) => {
      const root = document.getElementById('root');
      const txt = root?.textContent ?? '';
      const hasEvents = txt.includes('En cours') || txt.includes('À venir');
      return hasEvents && txt.includes(text);
    },
    expectedText,
    { timeout: 15000 },
  ).then(() => true).catch(() => false);

  if (!appeared) {
    const debug = await this.appFrame!.evaluate(() => ({
      pathname: window.location.pathname,
      rootText: document.getElementById('root')?.textContent?.substring(0, 500),
    }));
    expect.fail(
      `Expected "${expectedText}" on home screen. Path: "${debug.pathname}", content: "${debug.rootText}"`,
    );
  }
});
