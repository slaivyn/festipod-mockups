import React from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { categoryLabels, categoryColors, priorityLabels, priorityColors, type StoryCategory } from '../../data';

const categories: StoryCategory[] = ['WORKSHOP', 'EVENT', 'USER', 'MEETING', 'NOTIF'];

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

  return (
    <div className="border-b border-border bg-muted/30 px-8 py-4 space-y-4">
      {/* Search */}
      <div className="max-w-md">
        <Input
          type="search"
          placeholder="Rechercher une fonctionnalite..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="bg-background"
        />
      </div>

      {/* Category filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-sm text-muted-foreground w-20 shrink-0">Categorie</span>
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
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-sm text-muted-foreground w-20 shrink-0">Priorite</span>
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
