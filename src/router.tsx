import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

type Route =
  | { page: 'gallery' }
  | { page: 'demo'; screenId: string }
  | { page: 'specs'; featureId?: string; storyId?: string };

interface RouterContextValue {
  route: Route;
  navigate: (route: Route) => void;
  goBack: () => void;
}

const RouterContext = createContext<RouterContextValue | null>(null);

function parseHash(hash: string): Route {
  const path = hash.replace(/^#\/?/, '') || '/';

  if (path === '/' || path === '') {
    return { page: 'gallery' };
  }

  // Redirect /stories to /specs (backward compatibility)
  if (path === 'stories') {
    return { page: 'specs' };
  }

  // Redirect /stories/{id} to /specs with storyId (backward compatibility)
  if (path.startsWith('stories/')) {
    const storyId = path.replace('stories/', '');
    if (storyId) {
      return { page: 'specs', storyId };
    }
  }

  if (path.startsWith('demo/')) {
    const screenId = path.replace('demo/', '');
    if (screenId) {
      return { page: 'demo', screenId };
    }
  }

  if (path === 'specs') {
    return { page: 'specs' };
  }

  if (path.startsWith('specs/')) {
    const featureId = path.replace('specs/', '');
    if (featureId) {
      return { page: 'specs', featureId };
    }
  }

  return { page: 'gallery' };
}

function routeToHash(route: Route): string {
  switch (route.page) {
    case 'gallery':
      return '#/';
    case 'demo':
      return `#/demo/${route.screenId}`;
    case 'specs':
      if (route.featureId) return `#/specs/${route.featureId}`;
      if (route.storyId) return `#/specs/${route.storyId}`;
      return '#/specs';
  }
}

export function RouterProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash));

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(parseHash(window.location.hash));
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = useCallback((newRoute: Route) => {
    window.location.hash = routeToHash(newRoute);
  }, []);

  const goBack = useCallback(() => {
    window.history.back();
  }, []);

  return (
    <RouterContext.Provider value={{ route, navigate, goBack }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter() {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
}

export function useNavigate() {
  const { navigate } = useRouter();
  return navigate;
}

export function useGoBack() {
  const { goBack } = useRouter();
  return goBack;
}

/**
 * Generate a URL for a specific story (now redirects to specs)
 */
export function getStoryUrl(storyId: string): string {
  return `#/specs/${storyId}`;
}

/**
 * Generate a URL for a specific feature spec
 */
export function getSpecUrl(featureId: string): string {
  return `#/specs/${featureId}`;
}
