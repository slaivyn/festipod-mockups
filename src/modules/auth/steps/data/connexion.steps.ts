import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import type { FestipodWorld } from '../../../../shared/support/world';

// Seed data matching what bootstrapWallet uses
import { seedEvents, seedUsers } from '../../../../shared/data/seedData';

// --- Setup ---

Given('le portefeuille est vide', async function (this: FestipodWorld) {
  // Verify starting state: the harness graph should have its own seeded data.
  // We clear events/users/participations to simulate a truly empty wallet.
  await this.appFrame!.evaluate(() => {
    const td = (window as any).__testData;
    // Delete all events
    for (const e of [...td.events]) td.events.delete(e);
    // Delete all users
    for (const u of [...td.users]) td.users.delete(u);
    // Delete all participations
    for (const p of [...td.participations]) td.participations.delete(p);
  });

  // Verify empty
  const counts = await this.appFrame!.evaluate(() => {
    const td = (window as any).__testData;
    return { events: td.events.size, users: td.users.size, participations: td.participations.size };
  });
  expect(counts.events, 'Events should be empty').to.equal(0);
  expect(counts.users, 'Users should be empty').to.equal(0);
});

Given('le portefeuille contient déjà des événements', async function (this: FestipodWorld) {
  const count = await this.appFrame!.evaluate(() => {
    const td = (window as any).__testData;
    return td.events.size;
  });
  // If empty, seed some data first so the precondition holds
  if (count === 0) {
    await this.appFrame!.evaluate(() => {
      const td = (window as any).__testData;
      td.loadTestData();
    });
    // Wait for data to propagate
    await this.appFrame!.waitForFunction(
      () => (window as any).__testData.events.size > 0,
      { timeout: 10000 },
    );
  }
});

// --- Actions ---

When('je charge les données de test', async function (this: FestipodWorld) {
  // Store count before loading for the idempotency test
  const countBefore = await this.appFrame!.evaluate(() => {
    const td = (window as any).__testData;
    return td.events.size;
  });
  (this as any)._eventCountBefore = countBefore;

  await this.appFrame!.evaluate(() => {
    const td = (window as any).__testData;
    td.loadTestData();
  });

  // Wait for data to propagate (if wallet was empty, data should appear)
  await this.appFrame!.waitForFunction(
    () => {
      const td = (window as any).__testData;
      // Either data was already there, or it should appear after loading
      return td.events.size > 0 || td._loadResult?.seeded === false;
    },
    { timeout: 10000 },
  ).catch(() => {
    // Timeout is OK if wallet was already populated (idempotent case)
  });
});

// --- Assertions ---

Then('le portefeuille est connecté', async function (this: FestipodWorld) {
  const hasSession = await this.appFrame!.evaluate(() => {
    const td = (window as any).__testData;
    return td.session !== undefined && td.session !== null;
  });
  expect(hasSession, 'Wallet should have an active NG session').to.be.true;
});

Then('le portefeuille ne contient aucun événement de démonstration', async function (this: FestipodWorld) {
  // Wallet should be empty — no auto-seeding.
  // Also verify through the app's data context (same view as screens).
  const result = await this.appFrame!.evaluate(() => {
    const td = (window as any).__testData;
    return {
      walletEvents: td.events.size,
      appEvents: td.appData?.events?.length ?? -1,
      ngStatus: td.ngStatus,
    };
  });
  expect(result.walletEvents, 'Wallet should have no events').to.equal(0);
  // App-level view should also show no events (providers working correctly)
  expect(result.appEvents, 'App data context should show no events').to.equal(0);
  expect(result.ngStatus, 'NG status should be connected').to.equal('connected');
});

Then('le portefeuille contient des événements', async function (this: FestipodWorld) {
  const count = await this.appFrame!.evaluate(() => {
    const td = (window as any).__testData;
    return td.events.size;
  });
  expect(count, 'Wallet should contain events').to.be.greaterThan(0);
});

Then('le portefeuille contient des utilisateurs', async function (this: FestipodWorld) {
  const count = await this.appFrame!.evaluate(() => {
    const td = (window as any).__testData;
    return td.users.size;
  });
  expect(count, 'Wallet should contain users').to.be.greaterThan(0);
});

Then('le nombre d\'événements n\'a pas changé', async function (this: FestipodWorld) {
  const countBefore = (this as any)._eventCountBefore as number;
  const countAfter = await this.appFrame!.evaluate(() => {
    const td = (window as any).__testData;
    return td.events.size;
  });
  expect(countAfter, 'Event count should not change after reload').to.equal(countBefore);
});

Then('les événements ont des identifiants NextGraph', async function (this: FestipodWorld) {
  const ids = await this.appFrame!.evaluate(() => {
    const td = (window as any).__testData;
    return [...td.events].map((e: any) => e['@id']);
  });
  expect(ids.length, 'Should have events').to.be.greaterThan(0);
  for (const id of ids) {
    expect(id, `Event ID "${id}" should be a NextGraph IRI`).to.match(/^did:ng:/);
  }
});

Then('les utilisateurs ont des identifiants NextGraph', async function (this: FestipodWorld) {
  const ids = await this.appFrame!.evaluate(() => {
    const td = (window as any).__testData;
    return [...td.users].map((u: any) => u['@id']);
  });
  expect(ids.length, 'Should have users').to.be.greaterThan(0);
  for (const id of ids) {
    expect(id, `User ID "${id}" should be a NextGraph IRI`).to.match(/^did:ng:/);
  }
});
