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

// Detect if we're running inside the NG broker iframe
const isInsideBroker = typeof window !== 'undefined' && window.self !== window.top;

export function NextGraphProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<NgStatus>(session ? 'connected' : 'disconnected');
  const [ngSession, setNgSession] = useState<NextGraphSession | undefined>(session);
  const [error, setError] = useState<string | undefined>();

  // Auto-init ONLY when running inside the broker iframe.
  // Outside the broker, initNgWeb() would redirect the page — wait for explicit connect().
  useEffect(() => {
    if (!isInsideBroker || ngInitStarted) return;
    ngInitStarted = true;

    console.log('[NG] Inside broker iframe — auto-init');
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

  // connect(): called by the user clicking "Se connecter".
  // When outside the broker, initNgWeb() will redirect to the broker.
  const connect = useCallback(() => {
    if (status === 'connecting' || status === 'connected') return;

    console.log('[NG] connect() called, current status:', status);
    setStatus('connecting');
    setError(undefined);

    ngInitStarted = true;
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
