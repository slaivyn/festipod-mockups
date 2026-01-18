import React from 'react';
import type { ParsedFeature } from '../../types/gherkin';
import { getStoryById, categoryLabels, categoryColors, priorityLabels, priorityColors, type StoryCategory } from '../../data';
import { getTestStatus, getScenarioResults } from '../../data/testResults';
import { getScreen } from '../../screens';
import { GherkinHighlighter } from './GherkinHighlighter';
import { Button } from '../ui/button';
import { ArrowLeft, Monitor, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

interface FeatureViewProps {
  feature: ParsedFeature;
  onBack: () => void;
  onSelectScreen: (screenId: string) => void;
  onSelectStory: (storyId: string) => void;
}

export function FeatureView({ feature, onBack, onSelectScreen, onSelectStory }: FeatureViewProps) {
  const linkedStory = getStoryById(feature.id);
  const linkedScreens = linkedStory?.screenIds
    .map(id => ({ id, screen: getScreen(id) }))
    .filter(s => s.screen) || [];
  const testStatus = getTestStatus(feature.id);
  const scenarioResults = getScenarioResults(feature.id);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Header */}
      <div className="border-b border-border px-4 sm:px-8 py-6 bg-card">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
          </div>

          {/* Test Results - Compact in header */}
          {testStatus && (
            <div className="flex items-center gap-3">
              {testStatus.failed > 0 ? (
                <XCircle className="w-5 h-5 text-red-500" />
              ) : testStatus.skipped > 0 ? (
                <AlertCircle className="w-5 h-5 text-yellow-500" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              )}
              <div className="flex items-center gap-2 text-sm">
                <span className="text-green-600 font-medium">{testStatus.passed} passes</span>
                <span className="text-muted-foreground">·</span>
                <span className="text-red-600 font-medium">{testStatus.failed} echecs</span>
                <span className="text-muted-foreground">·</span>
                <span className="text-yellow-600 font-medium">{testStatus.skipped} ignores</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 mb-3 flex-wrap">
          <span
            className="px-3 py-1 text-sm font-medium text-white rounded-md"
            style={{ backgroundColor: priorityColors[feature.priority] }}
          >
            P{feature.priority} - {priorityLabels[feature.priority]}
          </span>
          <span
            className="px-3 py-1 text-sm font-medium text-white rounded-md"
            style={{ backgroundColor: categoryColors[feature.category as StoryCategory] }}
          >
            {categoryLabels[feature.category as StoryCategory]}
          </span>
          {linkedStory ? (
            <button
              onClick={() => onSelectStory(linkedStory.id)}
              className="text-sm text-primary font-mono hover:underline cursor-pointer"
            >
              {feature.id.toUpperCase()}
            </button>
          ) : (
            <span className="text-sm text-muted-foreground font-mono">
              {feature.id.toUpperCase()}
            </span>
          )}
        </div>

        <h1 className="text-2xl font-semibold mb-2">
          {feature.name.replace(/^US-\d+\s*/, '')}
        </h1>
        {feature.description && (
          <p className="text-muted-foreground max-w-3xl">
            {feature.description}
          </p>
        )}
      </div>

      <div className="px-4 sm:px-8 py-6">
        {/* Linked screens - inline buttons */}
        {linkedScreens.length > 0 && (
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <Monitor className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Écrans:</span>
            {linkedScreens.map(({ id, screen }) => (
              <Button
                key={id}
                variant="outline"
                size="sm"
                onClick={() => onSelectScreen(id)}
              >
                {screen?.name}
              </Button>
            ))}
          </div>
        )}

        {/* Main content - Gherkin */}
        <GherkinHighlighter
          content={feature.rawContent}
          scenarioResults={scenarioResults}
          filePath={feature.filePath}
        />
      </div>
    </div>
  );
}
