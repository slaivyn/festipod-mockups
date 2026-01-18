import React, { useState, useMemo } from 'react';
import { parsedFeatures, getFeatureById } from '../../data/features';
import { categoryLabels, categoryColors, priorityLabels, priorityColors, getStoryById, type StoryCategory } from '../../data';
import { getTestStatus, getTestSummary } from '../../data/testResults';
import { FeatureView } from './FeatureView';
import { FeatureFilter } from './FeatureFilter';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { ArrowLeft, FileText, Monitor, CheckCircle2, XCircle, AlertCircle, ExternalLink } from 'lucide-react';
import type { ParsedFeature } from '../../types/gherkin';
import { ThemeToggle } from '../ThemeToggle';

interface SpecsPageProps {
  selectedFeatureId?: string;
  onBack: () => void;
  onSelectScreen: (screenId: string) => void;
  onSelectStory: (storyId: string) => void;
}

export function SpecsPage({ selectedFeatureId, onBack, onSelectScreen, onSelectStory }: SpecsPageProps) {
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [selectedPriorities, setSelectedPriorities] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  // Filter features - must be before any conditional returns to respect hooks rules
  const filteredFeatures = useMemo(() => {
    return parsedFeatures.filter(feature => {
      if (selectedCategories.size > 0 && !selectedCategories.has(feature.category)) {
        return false;
      }
      if (selectedPriorities.size > 0 && !selectedPriorities.has(feature.priority)) {
        return false;
      }
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return feature.name.toLowerCase().includes(query) ||
               feature.description.toLowerCase().includes(query);
      }
      return true;
    });
  }, [selectedCategories, selectedPriorities, searchQuery]);

  // Group by priority
  const featuresByPriority = [0, 1, 2, 3].map(priority => ({
    priority,
    features: filteredFeatures.filter(f => f.priority === priority),
  })).filter(({ features }) => features.length > 0);

  // If a feature is selected, show detail view
  if (selectedFeatureId) {
    const feature = getFeatureById(selectedFeatureId);
    if (feature) {
      return (
        <FeatureView
          feature={feature}
          onBack={onBack}
          onSelectScreen={onSelectScreen}
          onSelectStory={onSelectStory}
        />
      );
    }
  }

  const testSummary = getTestSummary();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border px-4 sm:px-8 py-4 sm:py-6 bg-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <Button variant="outline" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Retour</span>
            </Button>
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold">Specs BDD</h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                {filteredFeatures.length} / {parsedFeatures.length} fonctionnalités
              </p>
            </div>
            <div className="sm:hidden ml-auto">
              <ThemeToggle />
            </div>
          </div>
          {/* Test Results Summary */}
          {testSummary.totalScenarios > 0 && (
            <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm flex-wrap">
              <div className="flex items-center gap-1 sm:gap-2">
                <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                <span className="text-green-600 font-medium">{testSummary.passed}</span>
              </div>
              {testSummary.failed > 0 && (
                <div className="flex items-center gap-1 sm:gap-2">
                  <XCircle className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />
                  <span className="text-red-600 font-medium">{testSummary.failed}</span>
                </div>
              )}
              {testSummary.skipped > 0 && (
                <div className="flex items-center gap-1 sm:gap-2">
                  <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />
                  <span className="text-yellow-600 font-medium">{testSummary.skipped}</span>
                </div>
              )}
              <a href="/reports/cucumber" target="_blank" rel="noopener noreferrer" className="hidden sm:block">
                <Button variant="outline" size="sm">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Rapport
                </Button>
              </a>
              <div className="hidden sm:block">
                <ThemeToggle />
              </div>
            </div>
          )}
          {testSummary.totalScenarios === 0 && <div className="hidden sm:block"><ThemeToggle /></div>}
        </div>
      </div>

      {/* Filters */}
      <FeatureFilter
        selectedCategories={selectedCategories}
        onCategoriesChange={setSelectedCategories}
        selectedPriorities={selectedPriorities}
        onPrioritiesChange={setSelectedPriorities}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Feature list */}
      <div className="px-4 sm:px-8 py-4 sm:py-6 space-y-6 sm:space-y-8">
        {featuresByPriority.map(({ priority, features }) => (
          <div key={priority}>
            <div className="flex items-center gap-3 mb-4">
              <span
                className="px-3 py-1 text-sm font-medium text-white rounded-md"
                style={{ backgroundColor: priorityColors[priority] }}
              >
                P{priority}
              </span>
              <h2 className="text-lg font-semibold">
                Priorite {priorityLabels[priority]}
              </h2>
              <span className="text-sm text-muted-foreground">
                ({features.length} fonctionnalites)
              </span>
            </div>

            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {features.map(feature => (
                <FeatureCard
                  key={feature.id}
                  feature={feature}
                  onClick={() => window.location.hash = `#/specs/${feature.id}`}
                />
              ))}
            </div>
          </div>
        ))}

        {featuresByPriority.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            Aucune fonctionnalite ne correspond aux filtres selectionnes
          </div>
        )}
      </div>
    </div>
  );
}

interface FeatureCardProps {
  feature: ParsedFeature;
  onClick: () => void;
}

function FeatureCard({ feature, onClick }: FeatureCardProps) {
  const linkedStory = getStoryById(feature.id);
  const testStatus = getTestStatus(feature.id);

  const getStatusIcon = () => {
    if (!testStatus) return null;
    if (testStatus.failed > 0) {
      return <XCircle className="w-4 h-4 text-red-500" />;
    }
    if (testStatus.skipped > 0) {
      return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    }
    return <CheckCircle2 className="w-4 h-4 text-green-500" />;
  };

  const getStatusText = () => {
    if (!testStatus) return null;
    if (testStatus.failed > 0) {
      return <span className="text-red-600">{testStatus.passed}/{testStatus.totalScenarios}</span>;
    }
    if (testStatus.skipped > 0) {
      return <span className="text-yellow-600">{testStatus.passed}/{testStatus.totalScenarios}</span>;
    }
    return <span className="text-green-600">{testStatus.passed}/{testStatus.totalScenarios}</span>;
  };

  return (
    <Card
      className="cursor-pointer hover:border-primary hover:shadow-md transition-all"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span
              className="px-2 py-0.5 text-xs font-medium text-white rounded"
              style={{ backgroundColor: categoryColors[feature.category as StoryCategory] }}
            >
              {categoryLabels[feature.category as StoryCategory]}
            </span>
            <span className="text-xs text-muted-foreground font-mono">
              {feature.id.toUpperCase()}
            </span>
          </div>
          {testStatus && (
            <div className="flex items-center gap-1 text-xs">
              {getStatusIcon()}
              {getStatusText()}
            </div>
          )}
        </div>
        <CardTitle className="text-base leading-tight line-clamp-2">
          {feature.name.replace(/^US-\d+\s*/, '')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {feature.description && (
          <CardDescription className="line-clamp-2 text-sm mb-3">
            {feature.description}
          </CardDescription>
        )}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <FileText className="w-3 h-3" />
            {feature.scenarios.length} scenarios
          </span>
          {linkedStory && linkedStory.screenIds.length > 0 && (
            <span className="flex items-center gap-1">
              <Monitor className="w-3 h-3" />
              {linkedStory.screenIds.length} ecrans
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
