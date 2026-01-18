import React from 'react';
import { RouterProvider, useRouter } from './router';
import { ThemeProvider } from './context/ThemeContext';
import { Gallery } from './components/Gallery';
import { DemoMode } from './components/DemoMode';
import { UserStoriesPage } from './components/UserStoriesPage';
import { SpecsPage } from './components/specs';

function AppContent() {
  const { route, navigate, goBack } = useRouter();

  if (route.page === 'demo') {
    return (
      <DemoMode
        initialScreenId={route.screenId}
        onBack={goBack}
        onNavigateToStory={(storyId) => navigate({ page: 'stories', storyId })}
      />
    );
  }

  if (route.page === 'stories') {
    return (
      <UserStoriesPage
        selectedStoryId={route.storyId}
        onBack={goBack}
        onSelectScreen={(screenId) => navigate({ page: 'demo', screenId })}
      />
    );
  }

  if (route.page === 'specs') {
    return (
      <SpecsPage
        selectedFeatureId={route.featureId}
        onBack={goBack}
        onSelectScreen={(screenId) => navigate({ page: 'demo', screenId })}
        onSelectStory={(storyId) => navigate({ page: 'stories', storyId })}
      />
    );
  }

  return (
    <Gallery
      onSelectScreen={(screenId) => navigate({ page: 'demo', screenId })}
      onShowStories={() => navigate({ page: 'stories' })}
      onShowSpecs={() => navigate({ page: 'specs' })}
    />
  );
}

export function App() {
  return (
    <ThemeProvider>
      <RouterProvider>
        <AppContent />
      </RouterProvider>
    </ThemeProvider>
  );
}

export default App;
