import { Before, After, BeforeAll, AfterAll, Status, setDefaultTimeout } from '@cucumber/cucumber';
import { chromium, type Browser, type BrowserContext, type Page, type Frame } from 'playwright';
import { execSync, spawn, type ChildProcess } from 'child_process';
import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';
import type { FestipodWorld } from './world';

setDefaultTimeout(30000);

let browser: Browser;
let browserContext: BrowserContext;

// Harness paths
const HARNESS_ENTRY = 'src/shared/test-harness/harness.tsx';
const HARNESS_OUT = path.join('dist', 'test-harness.js');
const HARNESS_NG_ENTRY = 'src/shared/test-harness/harness-ng.tsx';
const HARNESS_NG_OUT = path.join('dist', 'test-harness-ng.js');
// Persistent Chromium profile for NG wallet (not the user's daily browser)
const PLAYWRIGHT_PROFILE = path.resolve('.playwright-profile');

let harnessServer: http.Server | null = null;
let harnessPort = 0;
let useRealBroker = false;

// E2E: real app server
let appServerProcess: ChildProcess | null = null;
let appPort = 0;

const WALLET_NAME = 'festipod-tests';
const WALLET_PASSWORD = 'festipod-tests';

/**
 * Navigate through the NG broker to load an app in its iframe.
 * Handles wallet login and returns the app's Frame.
 */
async function setupBrokerPage(page: Page, appUrl: string): Promise<Frame> {
  const brokerRedirect = `https://nextgraph.net/redir/#/?o=${encodeURIComponent(appUrl)}`;
  await page.goto(brokerRedirect, { waitUntil: 'domcontentloaded' });

  // Automate wallet login if needed
  const loginButton = page.getByText('Login', { exact: true });
  if (await loginButton.isVisible({ timeout: 2000 }).catch(() => false)) {
    await loginButton.click();
    await page.waitForURL('**/wallet/login', { timeout: 5000 }).catch(() => {});

    const walletLink = page.getByText('Click here to login with your wallet');
    await walletLink.waitFor({ state: 'visible', timeout: 5000 });
    await walletLink.click();
    await page.waitForTimeout(1000);

    const passwordInput = page.locator('input[type="password"]');
    await passwordInput.waitFor({ state: 'visible', timeout: 5000 });
    await passwordInput.fill(WALLET_PASSWORD);
    await passwordInput.press('Enter');

    // Wait for login to complete and app iframe to load
    await page.waitForTimeout(3000);
  }

  // Verify iframe loaded after login
  const iframeCount = await page.locator('iframe').count();
  if (iframeCount === 0) {
    const bodyText = await page.evaluate(() => document.body?.innerText?.substring(0, 300));
    throw new Error(`No iframe found after login. Body: ${bodyText}`);
  }

  // Wait for our app iframe (broker loads it after successful auth)
  let appFrame: Frame | null = null;
  const deadline = Date.now() + 30000;
  while (Date.now() < deadline) {
    for (const f of page.frames()) {
      if (f.url().startsWith(appUrl) || f.url().includes('127.0.0.1')) {
        appFrame = f;
        break;
      }
    }
    if (appFrame) break;

    for (const iframe of await page.locator('iframe').all()) {
      const src = await iframe.getAttribute('src');
      if (src && src.includes('127.0.0.1')) {
        const el = await iframe.elementHandle();
        appFrame = await el?.contentFrame() ?? null;
        if (appFrame) break;
      }
    }
    if (appFrame) break;

    await page.waitForTimeout(500);
  }

  if (!appFrame) {
    const frames = page.frames().map(f => f.url());
    throw new Error(`App iframe not found after 30s. Frames: ${JSON.stringify(frames)}`);
  }

  return appFrame;
}

/**
 * Automated wallet creation + login on nextgraph.eu.
 * Flow:
 *   1. Navigate to https://nextgraph.eu/ → "Create Wallet" button
 *   2. Click → redirects to account.nextgraph.eu → "I accept" (ToS)
 *   3. Click → redirects back → username/password form → fill & submit
 *   4. Wallet created → saved in localStorage (shared with nextgraph.eu/auth/)
 *
 * This is also a legitimate test of the app's auth/login feature.
 */
async function ensureAuth(): Promise<void> {
  const markerPath = path.join(PLAYWRIGHT_PROFILE, '.wallet-ready');
  if (fs.existsSync(markerPath)) {
    console.log('[Auth] Wallet found in persistent profile — skipping creation');
    return;
  }

  console.log('[Auth] No wallet — creating one automatically on nextgraph.eu...');
  fs.mkdirSync(PLAYWRIGHT_PROFILE, { recursive: true });
  const chromePath = chromium.executablePath().replace('chrome-headless-shell', 'chrome').replace('chromium_headless_shell', 'chromium');
  const authContext = await chromium.launchPersistentContext(PLAYWRIGHT_PROFILE, {
    headless: true,
    executablePath: chromePath.includes('headless') ? undefined : chromePath,
  });
  const page = authContext.pages()[0] || await authContext.newPage();
  page.on('pageerror', () => {});

  try {
    // Step 1: Navigate to nextgraph.eu — shows NoWallet page
    console.log('[Auth] Step 1: Loading nextgraph.eu...');
    await page.goto('https://nextgraph.eu/', { waitUntil: 'domcontentloaded', timeout: 30000 });

    // Step 2: Click "Create Wallet"
    console.log('[Auth] Step 2: Clicking "Create Wallet"...');
    const createButton = page.getByText('Create Wallet', { exact: true });
    await createButton.waitFor({ state: 'visible', timeout: 15000 });
    await createButton.click();

    // Step 3: Redirects to account.nextgraph.eu — accept Terms of Service
    console.log('[Auth] Step 3: Accepting Terms of Service...');
    await page.waitForURL('**/account*', { timeout: 15000 }).catch(() => {});
    const acceptButton = page.getByText('I accept', { exact: true });
    await acceptButton.waitFor({ state: 'visible', timeout: 15000 });
    await acceptButton.click();

    // Step 4: Redirects back to nextgraph.eu (possibly via nextgraph.net for bootstrap)
    // Wait for the username input to appear (wallet creation form)
    console.log('[Auth] Step 4: Filling wallet credentials...');
    const usernameInput = page.locator('#username-input');
    await usernameInput.waitFor({ state: 'visible', timeout: 30000 });
    await usernameInput.fill(WALLET_NAME);

    const passwordInput = page.locator('#password-input');
    await passwordInput.waitFor({ state: 'visible', timeout: 5000 });
    await passwordInput.fill(WALLET_PASSWORD);

    // Step 5: Submit — click the create button
    console.log('[Auth] Step 5: Creating wallet...');
    // The button text is "I create my wallet now!" — use a partial match
    const submitButton = page.getByText('create my wallet', { exact: false });
    await submitButton.waitFor({ state: 'visible', timeout: 5000 });
    await submitButton.click();

    // Step 6: Wait for wallet to be created (redirects to #/wallet/login)
    console.log('[Auth] Step 6: Waiting for wallet creation to complete...');
    await page.waitForURL('**/#/wallet/login', { timeout: 30000 });
    // Give localStorage time to persist
    await page.waitForTimeout(2000);

    console.log('[Auth] Wallet created successfully');
  } finally {
    await authContext.close();
  }

  fs.writeFileSync(markerPath, new Date().toISOString());
  console.log('[Auth] Wallet setup complete');
}

// 10-minute timeout for BeforeAll: wallet creation may take a while on first run
BeforeAll({ timeout: 10 * 60 * 1000 }, async function () {
  console.log('Starting Festipod BDD tests...');

  // Build the mock harness (always needed for non-@data or fallback)
  execSync(`bun build ${HARNESS_ENTRY} --outfile ${HARNESS_OUT} --bundle`, { stdio: 'pipe' });
  console.log(`[Harness] Built mock (${(fs.statSync(HARNESS_OUT).size / 1024).toFixed(0)} KB)`);

  // Try to build the real broker harness
  try {
    execSync(`bun build ${HARNESS_NG_ENTRY} --outfile ${HARNESS_NG_OUT} --bundle`, { stdio: 'pipe' });
    console.log(`[Harness] Built NG (${(fs.statSync(HARNESS_NG_OUT).size / 1024).toFixed(0)} KB)`);

    // Ensure wallet exists in persistent profile (opens browser if needed)
    await ensureAuth();
    useRealBroker = true;

    // Start HTTP server serving the harness HTML + JS separately
    // (inline script breaks due to special characters in the bundle)
    const harnessBundle = fs.readFileSync(path.resolve(HARNESS_NG_OUT), 'utf-8');
    const harnessHtml = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body>
  <div id="root"></div>
  <script src="/harness.js"></script>
</body>
</html>`;
    harnessServer = http.createServer((req, res) => {
      if (req.url === '/harness.js') {
        res.writeHead(200, { 'Content-Type': 'application/javascript; charset=utf-8' });
        res.end(harnessBundle);
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(harnessHtml);
      }
    });
    harnessPort = await new Promise<number>((resolve) => {
      harnessServer!.listen(0, '127.0.0.1', () => {
        resolve((harnessServer!.address() as { port: number }).port);
      });
    });
    console.log(`[Harness] HTTP server on http://127.0.0.1:${harnessPort}`);

    // Launch Chromium with the same persistent profile (has the wallet).
    // - Use full Chrome binary (not chrome-headless-shell) so localStorage persists
    // - Grant permissions to avoid prompts
    // - Disable Private Network Access (broker at nextgraph.eu needs to load
    //   our local harness at http://127.0.0.1:{port} in an iframe)
    const chromePath = chromium.executablePath().replace('chrome-headless-shell', 'chrome').replace('chromium_headless_shell', 'chromium');
    browserContext = await chromium.launchPersistentContext(PLAYWRIGHT_PROFILE, {
      headless: true,
      executablePath: chromePath.includes('headless') ? undefined : chromePath,
      permissions: ['notifications', 'clipboard-read', 'clipboard-write', 'geolocation'],
      args: [
        '--disable-features=PrivateNetworkAccessRespectPreflightResults,BlockInsecurePrivateNetworkRequests,PrivateNetworkAccessForWorkers,PrivateNetworkAccessForNavigations',
        '--allow-insecure-localhost',
        '--disable-web-security',
      ],
    });
    console.log('[Hooks] Real broker mode ready');

    // Start real app server for @e2e tests
    appPort = await new Promise<number>((resolve) => {
      const s = http.createServer();
      s.listen(0, '127.0.0.1', () => {
        const port = (s.address() as { port: number }).port;
        s.close(() => resolve(port));
      });
    });
    appServerProcess = spawn('bun', ['src/index.ts'], {
      env: { ...process.env, PORT: String(appPort), NODE_ENV: 'production' },
      stdio: 'pipe',
      cwd: process.cwd(),
    });
    // Wait for app server to respond
    await new Promise<void>((resolve, reject) => {
      const deadline = Date.now() + 15000;
      const check = () => {
        http.get(`http://127.0.0.1:${appPort}`, (res) => {
          res.resume();
          resolve();
        }).on('error', () => {
          if (Date.now() > deadline) reject(new Error('App server startup timeout'));
          else setTimeout(check, 200);
        });
      };
      check();
    });
    console.log(`[E2E] App server on http://127.0.0.1:${appPort}`);
  } catch (err) {
    console.warn(`[Hooks] NG harness build/auth failed, falling back to mock: ${err}`);
    useRealBroker = false;
    browser = await chromium.launch({ headless: true });
    browserContext = await browser.newContext();
    console.log('[Hooks] Mock mode (no broker)');
  }
});

Before({ timeout: 60000 }, async function (this: FestipodWorld, scenario) {
  // Reset UI-layer state
  this.currentRoute = '#/';
  this.currentScreenId = null;
  this.formFields.clear();
  this.navigationHistory = [];
  this.isAuthenticated = false;
  this.screenSourceContent = '';
  this.currentScreen = null;

  // Launch Playwright page for @data and @e2e scenarios
  const tags = scenario.pickle.tags.map(t => t.name);
  const needsPlaywright = tags.includes('@data') || tags.includes('@e2e');

  if (needsPlaywright) {
    this.page = await browserContext.newPage();

    // Capture console for debugging
    this.page.on('pageerror', (err) => console.error('[Browser error]', err.message));
    this.page.on('console', (msg) => {
      if (msg.type() === 'error') console.error('[Browser console]', msg.text());
    });
  }

  if (tags.includes('@data')) {
    if (useRealBroker) {
      const harnessUrl = `http://127.0.0.1:${harnessPort}`;
      this.appFrame = await setupBrokerPage(this.page!, harnessUrl);

      // Wait for NG session + useShape + bridge
      await this.appFrame.waitForFunction(
        () => (window as any).__testData?.ready === true,
        { timeout: 30000 },
      );
    } else {
      // Mock mode: load harness directly
      await this.page!.setContent('<!DOCTYPE html><html><body><div id="root"></div></body></html>');
      await this.page!.addScriptTag({ path: path.resolve(HARNESS_OUT) });

      this.appFrame = this.page!.mainFrame();
      await this.appFrame.waitForFunction(
        () => (window as any).__testData?.ready === true,
        { timeout: 10000 },
      );
    }
  }

  if (tags.includes('@e2e')) {
    if (!useRealBroker || !appPort) {
      throw new Error('@e2e scenarios require real broker mode (NG harness + app server)');
    }

    const realAppUrl = `http://127.0.0.1:${appPort}`;
    this.appFrame = await setupBrokerPage(this.page!, realAppUrl);

    // Wait for React to render the app
    await this.appFrame.waitForFunction(
      () => {
        const root = document.getElementById('root');
        return root && root.innerHTML.length > 100;
      },
      { timeout: 30000 },
    );

    // Wait for NG to connect and providers to stabilize
    await this.appFrame.waitForTimeout(3000);
  }
});

After({ timeout: 10000 }, async function (this: FestipodWorld, scenario) {
  if (scenario.result?.status === Status.FAILED) {
    this.attach(`Current route: ${this.currentRoute}`, 'text/plain');
    this.attach(`Current screen: ${this.currentScreenId}`, 'text/plain');
    this.attach(`Navigation history: ${JSON.stringify(this.navigationHistory)}`, 'text/plain');
    this.attach(`Form fields: ${JSON.stringify(Array.from(this.formFields.entries()))}`, 'text/plain');
    if (this.screenSourceContent) {
      this.attach(`Screen source (first 500 chars): ${this.screenSourceContent.substring(0, 500)}...`, 'text/plain');
    }
  }

  // Close Playwright page
  if (this.page) {
    await this.page.close();
    this.page = null;
    this.appFrame = null;
  }

  // Clean up UI-layer
  this.cleanup();
});

AfterAll(async function () {
  if (browserContext) await browserContext.close();
  if (browser) await browser.close();
  if (harnessServer) {
    await new Promise<void>((resolve) => harnessServer!.close(() => resolve()));
  }
  if (appServerProcess) {
    appServerProcess.kill();
    appServerProcess = null;
  }
  console.log('Festipod BDD tests completed.');
});
