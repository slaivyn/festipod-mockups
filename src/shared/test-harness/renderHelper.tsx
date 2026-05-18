/**
 * Render helper for @ui tests.
 *
 * Spins up a happy-dom Window, renders a screen wrapped in the local data
 * provider (seedData) + router, and exposes the resulting DOM for assertions.
 *
 * Why happy-dom + local provider:
 *   - happy-dom is in-process, fast, no broker/wallet needed
 *   - LocalDataProvider gives us the same seed data used in disconnected mode,
 *     so assertions can target real values ("Marie Dupont", "@mariedupont", …)
 *   - We bypass NextGraphProvider entirely — those tests aren't about NG
 */

import { Window } from 'happy-dom';
import React from 'react';
import { getScreen } from '../../screens/index';
import { LocalDataProvider } from '../context/FestipodDataContext';
import { RouterProvider } from '../../app/router';

let window: Window | null = null;
let root: any | null = null;
let createRoot: any = null;

/**
 * Install happy-dom globals so React/ReactDOM can run. Must be called before
 * ReactDOM is imported. Idempotent.
 */
export async function ensureDomGlobals(): Promise<void> {
  if (window) return;

  window = new Window({ url: 'http://localhost/' });
  // Install minimal globals React/ReactDOM expect. Some (e.g. `navigator` on
  // Node 22+) are already defined as getter-only properties — we use
  // defineProperty to override them.
  const setGlobal = (name: string, value: any) => {
    try {
      (globalThis as any)[name] = value;
    } catch {
      Object.defineProperty(globalThis, name, { value, writable: true, configurable: true });
    }
  };
  setGlobal('window', window);
  setGlobal('document', window.document);
  setGlobal('navigator', window.navigator);
  setGlobal('HTMLElement', (window as any).HTMLElement);
  setGlobal('HTMLInputElement', (window as any).HTMLInputElement);
  setGlobal('HTMLTextAreaElement', (window as any).HTMLTextAreaElement);
  setGlobal('HTMLButtonElement', (window as any).HTMLButtonElement);
  setGlobal('Element', (window as any).Element);
  setGlobal('Node', (window as any).Node);
  setGlobal('Event', (window as any).Event);
  setGlobal('MouseEvent', (window as any).MouseEvent);
  setGlobal('PopStateEvent', (window as any).PopStateEvent);
  setGlobal('requestAnimationFrame', (cb: any) => setTimeout(cb, 0));
  setGlobal('cancelAnimationFrame', (id: any) => clearTimeout(id));

  // Import ReactDOM only after globals are installed
  const reactDom = await import('react-dom/client');
  createRoot = reactDom.createRoot;
}

/**
 * Render a screen at the given path. Returns the rendered document.
 *
 * If `path` is omitted, derives a default path from the screenId via the
 * screen registry. Any previous render is unmounted first.
 */
export async function renderScreen(screenId: string, path?: string): Promise<Document> {
  await ensureDomGlobals();
  if (!window) throw new Error('DOM globals not installed');

  // Unmount any previous render to keep tests isolated
  if (root) {
    root.unmount();
    root = null;
  }

  const screen = getScreen(screenId);
  if (!screen) throw new Error(`Unknown screen "${screenId}"`);

  // Set pathname so RouterProvider picks the right route
  const targetPath = path ?? defaultPathFor(screen.path);
  (window.history as any).pushState({}, '', targetPath);

  // Clear & mount
  const doc = window.document as unknown as Document;
  doc.body.innerHTML = '<div id="root"></div>';
  const container = doc.getElementById('root')!;

  root = createRoot(container);

  await new Promise<void>((resolve) => {
    root.render(
      <LocalDataProvider>
        <RouterProvider>
          <screen.component />
        </RouterProvider>
      </LocalDataProvider>,
    );
    // Wait one microtask for React to flush effects
    setTimeout(resolve, 0);
  });

  return doc;
}

/**
 * Convert a registry path with `:id` placeholders to a concrete URL using the
 * first seed event/user when applicable. Tests can override via the explicit
 * `path` argument to renderScreen().
 */
function defaultPathFor(registryPath: string): string {
  // Substitute :id with a seed id matching the route's resource. /users/:id
  // needs a user id, /events/:id needs an event id. user-2 is the first
  // non-current user in seedData (Jean Durand).
  let path = registryPath;
  if (path.startsWith('/users/')) {
    path = path.replace(/:id/g, 'user-2');
  } else {
    path = path.replace(/:id/g, 'event-1');
  }
  return path.replace(/\/+$/, '') || '/';
}

export function unmountRender(): void {
  if (root) {
    root.unmount();
    root = null;
  }
}

export function getRenderedDocument(): Document | null {
  return (window?.document as unknown as Document) ?? null;
}
