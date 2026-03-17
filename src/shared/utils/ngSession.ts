import { ng, init as initNgWeb } from "@ng-org/web";
import type { NG } from "@ng-org/web";
import { initNg as initNgSignals } from "@ng-org/orm";

export let session: NextGraphSession | undefined;

let resolveSessionPromise: (
    value: NextGraphSession | PromiseLike<NextGraphSession>
) => void;
let rejectSessionPromise: (reason?: any) => void;

export let sessionPromise: Promise<NextGraphSession> = new Promise(
    (resolve, reject) => {
        resolveSessionPromise = resolve;
        rejectSessionPromise = reject;
    }
);

let initPromise: Promise<void> | null = null;

/**
 * Register the initNgWeb callback. Idempotent — returns the same promise on repeated calls.
 * Does NOT trigger login by itself. Call login() separately to open the wallet login page.
 */
export function init(): Promise<void> {
    if (initPromise) return initPromise;
    console.log('[NG session] init() called — registering callback');
    initPromise = initNgWeb(
        async (event: any) => {
            session = event.session;
            session!.ng ??= ng;
            console.log('[NG session] Connected — private_store:', session!.private_store_id);
            resolveSessionPromise(session!);
            initNgSignals(ng, session!);
        },
        true,
        []
    ).catch((error) => {
        console.error('[NG session] init error:', error);
        rejectSessionPromise(error);
    });
    return initPromise;
}

/**
 * Trigger the wallet login page. Must call init() first.
 */
export async function login() {
    console.log('[NG session] login() called — opening wallet login');
    await ng.login();
}

export interface NextGraphSession {
    ng: typeof NG;
    session_id: string;
    protected_store_id: string;
    private_store_id: string;
    public_store_id: string;
    [key: string]: unknown;
}
