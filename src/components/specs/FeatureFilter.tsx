import React, { useState, useEffect } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { ChevronDown, ChevronUp, Filter } from 'lucide-react';
import { categoryLabels, categoryColors, priorityLabels, priorityColors, type StoryCategory } from '../../data';

const categories: StoryCategory[] = ['WORKSHOP', 'EVENT', 'USER', 'MEETING', 'NOTIF'];

function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);
  return isMobile;
}

interface FeatureFilterProps {
  selectedCategories: Set<string>;
  onCategoriesChange: (categories: Set<string>) => void;
  selectedPriorities: Set<number>;
  onPrioritiesChange: (priorities: Set<number>) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function FeatureFilter({
  selectedCategories,
  onCategoriesChange,
  selectedPriorities,
  onPrioritiesChange,
  searchQuery,
  onSearchChange,
}: FeatureFilterProps) {
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const isMobile = useIsMobile();

  const toggleCategory = (cat: string) => {
    const newSet = new Set(selectedCategories);
    if (newSet.has(cat)) {
      newSet.delete(cat);
    } else {
      newSet.add(cat);
    }
    onCategoriesChange(newSet);
  };

  const togglePriority = (p: number) => {
    const newSet = new Set(selectedPriorities);
    if (newSet.has(p)) {
      newSet.delete(p);
    } else {
      newSet.add(p);
    }
    onPrioritiesChange(newSet);
  };

  const clearFilters = () => {
    onCategoriesChange(new Set());
    onPrioritiesChange(new Set());
    onSearchChange('');
  };

  const hasFilters = selectedCategories.size > 0 || selectedPriorities.size > 0 || searchQuery;
  const activeFilterCount = selectedCategories.size + selectedPriorities.size + (searchQuery ? 1 : 0);

  // On mobile, show compact filter bar with expand button
  if (isMobile) {
    return (
      <div className="border-b border-border bg-muted/30">
        {/* Compact header with search and filter toggle */}
        <div className="px-4 py-3 flex items-center gap-2">
          <div className="flex-1">
            <Input
              type="search"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="bg-background text-sm h-9"
            />
          </div>
          <Button
            variant={activeFilterCount > 0 ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFiltersExpanded(!filtersExpanded)}
            className="shrink-0 h-9"
          >
            <Filter className="w-4 h-4 mr-1" />
            {activeFilterCount > 0 ? activeFilterCount : ''}
            {filtersExpanded ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
          </Button>
        </div>

        {/* Expandable filter panel */}
        {filtersExpanded && (
          <div className="px-4 pb-3 space-y-3 border-t border-border/50 pt-3">
            {/* Category filters */}
            <div>
              <span className="text-xs text-muted-foreground block mb-2">Catégorie</span>
              <div className="flex gap-1.5 flex-wrap">
                {categories.map(cat => (
                  <Button
                    key={cat}
                    variant={selectedCategories.has(cat) ? 'default' : 'outline'}
                    size="sm"
                    className="text-xs px-2 h-7"
                    style={{
                      backgroundColor: selectedCategories.has(cat) ? categoryColors[cat] : 'transparent',
                      borderColor: categoryColors[cat],
                      color: selectedCategories.has(cat) ? 'white' : categoryColors[cat],
                    }}
                    onClick={() => toggleCategory(cat)}
                  >
                    {categoryLabels[cat]}
                  </Button>
                ))}
              </div>
            </div>

            {/* Priority filters */}
            <div>
              <span className="text-xs text-muted-foreground block mb-2">Priorité</span>
              <div className="flex gap-1.5 flex-wrap">
                {[0, 1, 2, 3].map(p => (
                  <Button
                    key={p}
                    variant={selectedPriorities.has(p) ? 'default' : 'outline'}
                    size="sm"
                    className="text-xs px-2 h-7"
                    style={{
                      backgroundColor: selectedPriorities.has(p) ? priorityColors[p] : 'transparent',
                      borderColor: priorityColors[p],
                      color: selectedPriorities.has(p) ? 'white' : priorityColors[p],
                    }}
                    onClick={() => togglePriority(p)}
                  >
                    P{p}
                  </Button>
                ))}
              </div>
            </div>

            {/* Clear filters */}
            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-destructive hover:text-destructive text-xs p-0 h-auto">
                Effacer les filtres
              </Button>
            )}
          </div>
        )}
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="border-b border-border bg-muted/30 px-8 py-4 space-y-4">
      {/* Search */}
      <div className="max-w-md">
        <Input
          type="search"
          placeholder="Rechercher une fonctionnalité..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="bg-background"
        />
      </div>

      {/* Category filters */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground w-20 shrink-0">Catégorie</span>
        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => (
            <Button
              key={cat}
              variant={selectedCategories.has(cat) ? 'default' : 'outline'}
              size="sm"
              style={{
                backgroundColor: selectedCategories.has(cat) ? categoryColors[cat] : 'transparent',
                borderColor: categoryColors[cat],
                color: selectedCategories.has(cat) ? 'white' : categoryColors[cat],
              }}
              onClick={() => toggleCategory(cat)}
            >
              {categoryLabels[cat]}
            </Button>
          ))}
        </div>
      </div>

      {/* Priority filters */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground w-20 shrink-0">Priorité</span>
        <div className="flex gap-2 flex-wrap">
          {[0, 1, 2, 3].map(p => (
            <Button
              key={p}
              variant={selectedPriorities.has(p) ? 'default' : 'outline'}
              size="sm"
              style={{
                backgroundColor: selectedPriorities.has(p) ? priorityColors[p] : 'transparent',
                borderColor: priorityColors[p],
                color: selectedPriorities.has(p) ? 'white' : priorityColors[p],
              }}
              onClick={() => togglePriority(p)}
            >
              P{p} - {priorityLabels[p]}
            </Button>
          ))}
        </div>
      </div>

      {/* Clear filters */}
      {hasFilters && (
        <div>
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-destructive hover:text-destructive">
            Effacer les filtres
          </Button>
        </div>
      )}
    </div>
  );
}
