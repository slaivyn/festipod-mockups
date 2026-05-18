import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// ============================================================================
// Route types
// ============================================================================

type Route =
  | { page: 'welcome' }
  | { page: 'login' }
  | { page: 'home' }
  | { page: 'events' }
  | { page: 'create-event' }
  | { page: 'event-detail'; eventId: string }
  | { page: 'update-event'; eventId: string }
  | { page: 'invite'; eventId: string }
  | { page: 'participants'; eventId: string }
  | { page: 'meeting-points'; eventId: string }
  | { page: 'profile' }
  | { page: 'edit-profile' }
  | { page: 'friends' }
  | { page: 'share-profile' }
  | { page: 'connect' }
  | { page: 'user-profile'; userId: string }
  | { page: 'settings' };

export type { Route };

export interface RouteParams {
  eventId?: string;
  userId?: string;
}

// ============================================================================
// Path parsing & generation
// ============================================================================

function parsePath(pathname: string): Route {
  const path = pathname.replace(/\/+$/, '') || '/';

  if (path === '/' || path === '') return { page: 'welcome' };
  if (path === '/login') return { page: 'login' };
  if (path === '/home') return { page: 'home' };
  if (path === '/events') return { page: 'events' };
  if (path === '/events/new') return { page: 'create-event' };
  if (path === '/settings') return { page: 'settings' };
  if (path === '/profile') return { page: 'profile' };
  if (path === '/profile/edit') return { page: 'edit-profile' };
  if (path === '/profile/friends') return { page: 'friends' };
  if (path === '/profile/share') return { page: 'share-profile' };
  if (path === '/profile/connect') return { page: 'connect' };

  // /events/:id/...
  const eventMatch = path.match(/^\/events\/([^/]+)(?:\/(.+))?$/);
  if (eventMatch) {
    const eventId = eventMatch[1]!;
    const sub = eventMatch[2];
    if (!sub) return { page: 'event-detail', eventId };
    if (sub === 'edit') return { page: 'update-event', eventId };
    if (sub === 'invite') return { page: 'invite', eventId };
    if (sub === 'participants') return { page: 'participants', eventId };
    if (sub === 'meeting-points') return { page: 'meeting-points', eventId };
  }

  // /users/:id
  const userMatch = path.match(/^\/users\/([^/]+)$/);
  if (userMatch) {
    return { page: 'user-profile', userId: userMatch[1]! };
  }

  return { page: 'welcome' };
}

export function routeToPath(route: Route): string {
  switch (route.page) {
    case 'welcome': return '/';
    case 'login': return '/login';
    case 'home': return '/home';
    case 'events': return '/events';
    case 'create-event': return '/events/new';
    case 'event-detail': return `/events/${route.eventId}`;
    case 'update-event': return `/events/${route.eventId}/edit`;
    case 'invite': return `/events/${route.eventId}/invite`;
    case 'participants': return `/events/${route.eventId}/participants`;
    case 'meeting-points': return `/events/${route.eventId}/meeting-points`;
    case 'profile': return '/profile';
    case 'edit-profile': return '/profile/edit';
    case 'friends': return '/profile/friends';
    case 'share-profile': return '/profile/share';
    case 'connect': return '/profile/connect';
    case 'user-profile': return `/users/${route.userId}`;
    case 'settings': return '/settings';
  }
}

// ============================================================================
// Router context
// ============================================================================

interface RouterContextValue {
  route: Route;
  navigate: (path: string) => void;
  goBack: () => void;
  params: RouteParams;
}

const RouterContext = createContext<RouterContextValue | null>(null);

export function RouterProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<Route>(() => parsePath(window.location.pathname));

  useEffect(() => {
    const handlePopState = () => {
      setRoute(parsePath(window.location.pathname));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback((path: string) => {
    window.history.pushState(null, '', path);
    setRoute(parsePath(path));
  }, []);

  const goBack = useCallback(() => {
    window.history.back();
  }, []);

  const params: RouteParams = {};
  if ('eventId' in route) params.eventId = route.eventId;
  if ('userId' in route) params.userId = route.userId;

  return (
    <RouterContext.Provider value={{ route, navigate, goBack, params }}>
      {children}
    </RouterContext.Provider>
  );
}

// ============================================================================
// Hooks
// ============================================================================

export function useRouter() {
  const context = useContext(RouterContext);
  if (!context) throw new Error('useRouter must be used within a RouterProvider');
  return context;
}

export function useNavigate() {
  return useRouter().navigate;
}

export function useGoBack() {
  return useRouter().goBack;
}

export function useParams(): RouteParams {
  return useRouter().params;
}
