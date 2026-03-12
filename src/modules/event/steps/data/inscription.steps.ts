import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import type { FestipodWorld } from '../../../../shared/support/world';

// Data-layer steps: operate via Playwright + window.__testData bridge.
// The harness exposes DeepSignalSets and helper methods directly.

// --- Setup ---

Given('un événement {string} existe', async function (this: FestipodWorld, eventTitle: string) {
  const exists = await this.appFrame!.evaluate(
    (title) => {
      const td = (window as any).__testData;
      return [...td.events].some((e: any) => e.title === title);
    },
    eventTitle,
  );
  expect(exists, `Event "${eventTitle}" should exist in the data layer`).to.be.true;
});

Given('l\'utilisateur n\'est pas inscrit à l\'événement {string}', async function (this: FestipodWorld, eventTitle: string) {
  await this.appFrame!.evaluate(
    (title) => {
      const td = (window as any).__testData;
      const event = [...td.events].find((e: any) => e.title === title);
      if (event) td.leaveEvent(event['@id'], td.currentUserId);
    },
    eventTitle,
  );
});

Given('l\'utilisateur est inscrit à l\'événement {string}', async function (this: FestipodWorld, eventTitle: string) {
  await this.appFrame!.evaluate(
    (title) => {
      const td = (window as any).__testData;
      const event = [...td.events].find((e: any) => e.title === title);
      if (event) td.joinEvent(event['@id'], td.currentUserId);
    },
    eventTitle,
  );
});

Given('l\'événement {string} a {int} participants au départ', async function (this: FestipodWorld, eventTitle: string, count: number) {
  await this.appFrame!.evaluate(
    ([title, c]: [string, number]) => {
      const td = (window as any).__testData;
      const event = [...td.events].find((e: any) => e.title === title);
      if (event) td.updateEvent(event['@id'], { participantCount: c });
    },
    [eventTitle, count] as [string, number],
  );
});

// --- Actions ---

When('l\'utilisateur s\'inscrit à l\'événement {string}', async function (this: FestipodWorld, eventTitle: string) {
  await this.appFrame!.evaluate(
    (title) => {
      const td = (window as any).__testData;
      const event = [...td.events].find((e: any) => e.title === title);
      if (event) td.joinEvent(event['@id'], td.currentUserId);
    },
    eventTitle,
  );
});

When('l\'utilisateur se désinscrit de l\'événement {string}', async function (this: FestipodWorld, eventTitle: string) {
  await this.appFrame!.evaluate(
    (title) => {
      const td = (window as any).__testData;
      const event = [...td.events].find((e: any) => e.title === title);
      if (event) td.leaveEvent(event['@id'], td.currentUserId);
    },
    eventTitle,
  );
});

When('l\'utilisateur essaie de s\'inscrire une seconde fois à l\'événement {string}', async function (this: FestipodWorld, eventTitle: string) {
  await this.appFrame!.evaluate(
    (title) => {
      const td = (window as any).__testData;
      const event = [...td.events].find((e: any) => e.title === title);
      if (event) td.joinEvent(event['@id'], td.currentUserId);
    },
    eventTitle,
  );
});

// --- Assertions ---

Then('l\'utilisateur est participant de l\'événement {string}', async function (this: FestipodWorld, eventTitle: string) {
  const participating = await this.appFrame!.evaluate(
    (title) => {
      const td = (window as any).__testData;
      const event = [...td.events].find((e: any) => e.title === title);
      if (!event) return false;
      return td.isParticipating(event['@id'], td.currentUserId);
    },
    eventTitle,
  );
  expect(participating, `User should be participating in "${eventTitle}"`).to.be.true;
});

Then('l\'utilisateur n\'est plus participant de l\'événement {string}', async function (this: FestipodWorld, eventTitle: string) {
  const participating = await this.appFrame!.evaluate(
    (title) => {
      const td = (window as any).__testData;
      const event = [...td.events].find((e: any) => e.title === title);
      if (!event) return false;
      return td.isParticipating(event['@id'], td.currentUserId);
    },
    eventTitle,
  );
  expect(participating, `User should NOT be participating in "${eventTitle}"`).to.be.false;
});

Then('l\'événement {string} compte {int} participants', async function (this: FestipodWorld, eventTitle: string, expectedCount: number) {
  const count = await this.appFrame!.evaluate(
    (title) => {
      const td = (window as any).__testData;
      const event = [...td.events].find((e: any) => e.title === title);
      return event?.participantCount ?? -1;
    },
    eventTitle,
  );
  expect(count, `Event "${eventTitle}" participant count`).to.equal(expectedCount);
});

Then('l\'utilisateur apparaît dans la liste des participants de l\'événement {string}', async function (this: FestipodWorld, eventTitle: string) {
  const found = await this.appFrame!.evaluate(
    (title) => {
      const td = (window as any).__testData;
      const event = [...td.events].find((e: any) => e.title === title);
      if (!event) return false;
      return td.getEventParticipants(event['@id']).some((p: any) => p.user === td.currentUserId);
    },
    eventTitle,
  );
  expect(found, `User should appear in participants of "${eventTitle}"`).to.be.true;
});

Then('l\'utilisateur n\'apparaît plus dans la liste des participants de l\'événement {string}', async function (this: FestipodWorld, eventTitle: string) {
  const found = await this.appFrame!.evaluate(
    (title) => {
      const td = (window as any).__testData;
      const event = [...td.events].find((e: any) => e.title === title);
      if (!event) return false;
      return td.getEventParticipants(event['@id']).some((p: any) => p.user === td.currentUserId);
    },
    eventTitle,
  );
  expect(found, `User should NOT appear in participants of "${eventTitle}"`).to.be.false;
});

Then('l\'inscription est idempotente pour l\'événement {string}', async function (this: FestipodWorld, eventTitle: string) {
  const count = await this.appFrame!.evaluate(
    (title) => {
      const td = (window as any).__testData;
      const event = [...td.events].find((e: any) => e.title === title);
      if (!event) return 0;
      return td.getEventParticipants(event['@id']).filter((p: any) => p.user === td.currentUserId).length;
    },
    eventTitle,
  );
  expect(count, 'User should have exactly one participation record').to.equal(1);
});
