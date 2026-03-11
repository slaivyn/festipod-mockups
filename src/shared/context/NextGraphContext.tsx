import React, { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { session, sessionPromise, init as initNg, type NextGraphSession } from '../utils/ngSession';

type NgStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

interface NextGraphContextValue {
  status: NgStatus;
  session: NextGraphSession | undefined;
  error: string | undefined;
  connect: () => void;
}

const NextGraphContext = createContext<NextGraphContextValue>({
  status: 'disconnected',
  session: undefined,
  error: undefined,
  connect: () => {},
});

// Track whether initNg() has been called (module-level to survive re-renders)
let ngInitStarted = false;

export function NextGraphProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<NgStatus>(session ? 'connected' : 'disconnected');
  const [ngSession, setNgSession] = useState<NextGraphSession | undefined>(session);
  const [error, setError] = useState<string | undefined>();

  // Auto-init on mount: register the initNgWeb callback so we catch the
  // auto-connect event from the NG iframe. This must happen early.
  useEffect(() => {
    if (ngInitStarted) return;
    ngInitStarted = true;

    console.log('[NG] Auto-init: calling initNg() on mount');
    setStatus('connecting');
    initNg();

    sessionPromise
      .then((s) => {
        console.log('[NG] Session obtained, stores:', {
          private: s.private_store_id,
          protected: s.protected_store_id,
          public: s.public_store_id,
        });
        setNgSession(s);
        setStatus('connected');
      })
      .catch((err) => {
        console.error('[NG] Connection failed:', err);
        setError(err?.message || 'Connexion NextGraph impossible');
        setStatus('error');
      });
  }, []);

  // connect() is now just a fallback — initNg() already started on mount
  const connect = useCallback(() => {
    if (status === 'connecting' || status === 'connected') return;

    console.log('[NG] connect() called, current status:', status);
    setStatus('connecting');
    setError(undefined);

    // initNg() is idempotent (initNgWeb handles multiple calls)
    initNg();

    sessionPromise
      .then((s) => {
        setNgSession(s);
        setStatus('connected');
      })
      .catch((err) => {
        console.error('[NG] Connection failed:', err);
        setError(err?.message || 'Connexion NextGraph impossible');
        setStatus('error');
      });
  }, [status]);

  return (
    <NextGraphContext.Provider value={{ status, session: ngSession, error, connect }}>
      {children}
    </NextGraphContext.Provider>
  );
}

export function useNextGraph() {
  return useContext(NextGraphContext);
}
