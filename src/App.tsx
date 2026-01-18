import React from 'react';
import { RouterProvider, useRouter } from './router';
import { ThemeProvider } from './context/ThemeContext';
import { Gallery } from './components/Gallery';
import { DemoMode } from './components/DemoMode';
import { SpecsPage } from './components/specs';

function AppContent() {
  const { route, navigate, goBack } = useRouter();

  if (route.page === 'demo') {
    return (
      <DemoMode
        initialScreenId={route.screenId}
        onBack={goBack}
        onNavigateToStory={(storyId) => navigate({ page: 'specs', storyId })}
      />
    );
  }

  if (route.page === 'specs') {
    return (
      <SpecsPage
        selectedFeatureId={route.featureId}
        selectedStoryId={route.storyId}
        onBack={goBack}
        onSelectScreen={(screenId) => navigate({ page: 'demo', screenId })}
        onSelectStory={(storyId) => navigate({ page: 'specs', storyId })}
      />
    );
  }

  return (
    <Gallery
      onSelectScreen={(screenId) => navigate({ page: 'demo', screenId })}
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
