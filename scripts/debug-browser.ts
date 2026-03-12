/**
 * Manual debug tool: launches a headed Chromium to inspect NextGraph broker interactions.
 * Creates a temporary profile in `.playwright-profile-debug/` (gitignored).
 *
 * Usage: bun scripts/debug-browser.ts
 */
import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: false });
const context = await browser.newContext();
const page = await context.newPage();

console.log('Browser launched. Navigating to nextgraph.net...');

page.on('pageerror', (err) => console.log('[pageerror]', err.message));
page.on('close', () => console.log('[page closed]'));
page.on('crash', () => console.log('[page crashed]'));
browser.on('disconnected', () => console.log('[browser disconnected]'));

try {
  await page.goto('https://nextgraph.net/redir/#/?o=http%3A%2F%2F127.0.0.1%3A12345', {
    waitUntil: 'domcontentloaded',
    timeout: 30000,
  });
  console.log('Navigation done. Page URL:', page.url());
} catch (err: any) {
  console.log('Navigation error (expected):', err.message);
}

console.log('Waiting... close the browser manually when done.');

// Keep alive indefinitely
await new Promise(() => {});
