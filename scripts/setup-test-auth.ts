/**
 * One-time auth setup for data-layer testing.
 *
 * Two-step flow:
 *   Step 1: Opens nextgraph.net so you can create/import a wallet
 *   Step 2: Navigates to the broker redirect URL to authenticate the test app
 *
 * Saves auth state to playwright/.auth/ng-state.json for reuse by test runs.
 *
 * Usage: bun run test:auth-setup
 */
import { chromium } from 'playwright';
import * as http from 'http';
import * as path from 'path';
import * as fs from 'fs';
import * as readline from 'readline';

const AUTH_STATE_PATH = path.resolve('playwright/.auth/ng-state.json');

function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

const SETUP_HTML = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Festipod Test Auth Setup</title></head>
<body style="font-family: system-ui; padding: 2rem; text-align: center;">
  <h2>Festipod — Test Auth Setup</h2>
  <p id="status">Waiting for NextGraph session...</p>
  <script type="module">
    import { init, ng } from "@ng-org/web";

    await init(
      async (event) => {
        document.getElementById("status").innerHTML =
          '<span style="color: green; font-size: 1.5rem;">✓ Logged in!</span>' +
          '<br><br>You can now close this browser window.';
        console.log("[auth-setup] Session established:", event.session?.session_id);
      },
      true,
      []
    );
  </script>
</body>
</html>`;

async function main() {
  console.log('=== NextGraph Auth Setup (2 steps) ===');
  console.log('');

  // ---- Step 1: Create / open wallet ----
  console.log('STEP 1: Create or open your NextGraph wallet');
  console.log('A browser will open at nextgraph.net.');
  console.log('Create a wallet (or open an existing one), then come back here.');
  console.log('');

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('https://nextgraph.net', { waitUntil: 'domcontentloaded' });

  await prompt('Press ENTER here once your wallet is ready...');

  // ---- Step 2: Authenticate the test app via broker redirect ----
  console.log('');
  console.log('STEP 2: Authenticating test app via broker...');

  // Start a minimal HTTP server
  const server = http.createServer((_req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(SETUP_HTML);
  });

  const port = await new Promise<number>((resolve) => {
    server.listen(0, '127.0.0.1', () => {
      resolve((server.address() as { port: number }).port);
    });
  });

  const appUrl = `http://127.0.0.1:${port}`;
  const brokerUrl = `https://nextgraph.net/redir/#/?o=${encodeURIComponent(appUrl)}`;

  // Navigate the same page to the broker redirect
  await page.goto(brokerUrl, { waitUntil: 'domcontentloaded' });

  console.log('The broker should now show your wallet login.');
  console.log('Log in, wait for "✓ Logged in!", then close the browser.');
  console.log('');

  // Wait for browser close
  await new Promise<void>((resolve) => {
    page.on('close', () => resolve());
    browser.on('disconnected', () => resolve());
  });

  // Save storage state
  try {
    const state = await context.storageState();
    fs.mkdirSync(path.dirname(AUTH_STATE_PATH), { recursive: true });
    fs.writeFileSync(AUTH_STATE_PATH, JSON.stringify(state, null, 2));
    console.log(`\nAuth state saved to: ${AUTH_STATE_PATH}`);
    console.log('You can now run: bun run test:data');
  } catch {
    console.log('\nCould not save auth state — browser may have closed too quickly.');
  }

  try { await context.close(); } catch {}
  try { await browser.close(); } catch {}
  server.close();
}

main().catch(console.error);
