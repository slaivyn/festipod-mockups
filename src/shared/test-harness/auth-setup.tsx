/**
 * Minimal NG app for auth setup.
 * Calls @ng-org/web init() — which redirects to broker if at top level,
 * or establishes session if inside broker iframe.
 * On success, POSTs the session back to the local server and saves it in localStorage.
 */
import { init, ng } from '@ng-org/web';

await init(
  async (event: any) => {
    const status = document.getElementById('status')!;
    status.innerHTML =
      '<span style="color: green; font-size: 1.5rem;">&#10003; Logged in!</span>' +
      '<br><br>You can close this tab. Tests will continue automatically.';

    // Send session to local server so the test runner can save it
    const session = event.session;
    try {
      await fetch('/auth-done', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: session.session_id,
          private_store_id: session.private_store_id,
          protected_store_id: session.protected_store_id,
          public_store_id: session.public_store_id,
        }),
      });
    } catch (e) {
      console.error('[auth-setup] Failed to notify server:', e);
    }
  },
  true,
  [],
);
