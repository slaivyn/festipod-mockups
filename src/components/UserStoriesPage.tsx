import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  userStories,
  categoryLabels,
  categoryColors,
  priorityLabels,
  priorityColors,
  getScreenIdsWithStories,
  type UserStory,
  type StoryCategory,
} from '../data';
import { getScreen, screens } from '../screens';
import { ThemeToggle } from './ThemeToggle';

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);
  return isMobile;
}

interface UserStoriesPageProps {
  selectedStoryId?: string;
  onBack: () => void;
  onSelectScreen: (screenId: string) => void;
}

const categories: StoryCategory[] = ['WORKSHOP', 'EVENT', 'USER', 'MEETING', 'NOTIF'];

export function UserStoriesPage({ selectedStoryId, onBack, onSelectScreen }: UserStoriesPageProps) {
  const [selectedCategories, setSelectedCategories] = useState<Set<StoryCategory>>(new Set());
  const [selectedPriorities, setSelectedPriorities] = useState<Set<number>>(new Set());
  const [selectedScreens, setSelectedScreens] = useState<Set<string>>(new Set());
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const storyRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const isMobile = useIsMobile();

  // Scroll to selected story on mount
  useEffect(() => {
    if (selectedStoryId) {
      const element = storyRefs.current.get(selectedStoryId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [selectedStoryId]);

  // Get screens that have linked stories
  const screensWithStories = useMemo(() => {
    const screenIds = getScreenIdsWithStories();
    return screens.filter(s => screenIds.includes(s.id));
  }, []);

  // Filter stories
  const filteredStories = useMemo(() => {
    return userStories.filter(story => {
      if (selectedCategories.size > 0 && !selectedCategories.has(story.category)) {
        return false;
      }
      if (selectedPriorities.size > 0 && !selectedPriorities.has(story.priority)) {
        return false;
      }
      if (selectedScreens.size > 0 && !story.screenIds.some(id => selectedScreens.has(id))) {
        return false;
      }
      return true;
    });
  }, [selectedCategories, selectedPriorities, selectedScreens]);

  const storiesByPriority = [0, 1, 2, 3].map(priority => ({
    priority,
    stories: filteredStories.filter(s => s.priority === priority),
  })).filter(({ stories }) => stories.length > 0);

  const toggleCategory = (cat: StoryCategory) => {
    const newSet = new Set(selectedCategories);
    if (newSet.has(cat)) {
      newSet.delete(cat);
    } else {
      newSet.add(cat);
    }
    setSelectedCategories(newSet);
  };

  const togglePriority = (p: number) => {
    const newSet = new Set(selectedPriorities);
    if (newSet.has(p)) {
      newSet.delete(p);
    } else {
      newSet.add(p);
    }
    setSelectedPriorities(newSet);
  };

  const toggleScreen = (screenId: string) => {
    const newSet = new Set(selectedScreens);
    if (newSet.has(screenId)) {
      newSet.delete(screenId);
    } else {
      newSet.add(screenId);
    }
    setSelectedScreens(newSet);
  };

  const clearFilters = () => {
    setSelectedCategories(new Set());
    setSelectedPriorities(new Set());
    setSelectedScreens(new Set());
  };

  const hasFilters = selectedCategories.size > 0 || selectedPriorities.size > 0 || selectedScreens.size > 0;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--tool-bg)', transition: 'background-color 0.2s ease' }}>
      {/* Header */}
      <div style={{
        padding: isMobile ? '16px' : '24px 32px',
        borderBottom: '2px solid var(--tool-border)',
        background: 'var(--tool-surface)',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'stretch' : 'center',
        justifyContent: 'space-between',
        gap: isMobile ? 12 : 0,
        transition: 'background-color 0.2s ease, border-color 0.2s ease',
      }}>
        <div style={{ display: 'flex', alignItems: isMobile ? 'flex-start' : 'center', gap: isMobile ? 12 : 16, flexDirection: isMobile ? 'column' : 'row' }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', width: isMobile ? '100%' : 'auto', justifyContent: 'space-between' }}>
            <button
              onClick={onBack}
              style={{
                background: 'none',
                border: '2px solid var(--tool-border)',
                borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px',
                padding: isMobile ? '6px 12px' : '8px 16px',
                fontFamily: 'var(--font-sketch)',
                fontSize: isMobile ? 12 : 14,
                cursor: 'pointer',
                color: 'var(--tool-text)',
              }}
            >
              ← Retour
            </button>
            {isMobile && <ThemeToggle />}
          </div>
          <div>
            <h1 style={{
              fontFamily: 'var(--font-sketch)',
              fontSize: isMobile ? 22 : 28,
              margin: 0,
              color: 'var(--tool-text)',
            }}>
              User Stories
            </h1>
            <p style={{
              fontFamily: 'var(--font-sketch)',
              fontSize: isMobile ? 13 : 16,
              color: 'var(--tool-text-muted)',
              margin: '8px 0 0 0',
            }}>
              {filteredStories.length} / {userStories.length} stories
            </p>
          </div>
        </div>
        {!isMobile && <ThemeToggle />}
      </div>

      {/* Filter bar */}
      {isMobile ? (
        /* Mobile: Collapsible filter bar */
        <div style={{
          borderBottom: '1px solid var(--tool-border-light)',
          background: 'var(--tool-surface)',
          transition: 'background-color 0.2s ease, border-color 0.2s ease',
        }}>
          {/* Filter toggle button */}
          <button
            onClick={() => setFiltersExpanded(!filtersExpanded)}
            style={{
              width: '100%',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'none',
              border: 'none',
              fontFamily: 'var(--font-sketch)',
              fontSize: 13,
              cursor: 'pointer',
              color: 'var(--tool-text)',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>☰ Filtres</span>
              {hasFilters && (
                <span style={{
                  background: 'var(--tool-text)',
                  color: 'var(--tool-bg)',
                  borderRadius: '50%',
                  width: 20,
                  height: 20,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                }}>
                  {selectedCategories.size + selectedPriorities.size}
                </span>
              )}
            </span>
            <span>{filtersExpanded ? '▲' : '▼'}</span>
          </button>

          {/* Expandable filter panel */}
          {filtersExpanded && (
            <div style={{
              padding: '0 16px 12px',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              borderTop: '1px solid var(--tool-border-light)',
              paddingTop: 12,
            }}>
              {/* Category filters */}
              <div>
                <span style={{
                  fontFamily: 'var(--font-sketch)',
                  fontSize: 11,
                  color: 'var(--tool-text-muted)',
                  display: 'block',
                  marginBottom: 6,
                }}>
                  Catégorie
                </span>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {categories.map(cat => (
                    <FilterChip
                      key={cat}
                      label={categoryLabels[cat]}
                      color={categoryColors[cat]}
                      selected={selectedCategories.has(cat)}
                      onClick={() => toggleCategory(cat)}
                    />
                  ))}
                </div>
              </div>

              {/* Priority filters */}
              <div>
                <span style={{
                  fontFamily: 'var(--font-sketch)',
                  fontSize: 11,
                  color: 'var(--tool-text-muted)',
                  display: 'block',
                  marginBottom: 6,
                }}>
                  Priorité
                </span>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {[0, 1, 2, 3].map(p => (
                    <FilterChip
                      key={p}
                      label={`P${p}`}
                      color={priorityColors[p] ?? '#888'}
                      selected={selectedPriorities.has(p)}
                      onClick={() => togglePriority(p)}
                    />
                  ))}
                </div>
              </div>

              {/* Clear filters */}
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  style={{
                    alignSelf: 'flex-start',
                    background: 'none',
                    border: 'none',
                    fontFamily: 'var(--font-sketch)',
                    fontSize: 12,
                    color: '#c00',
                    cursor: 'pointer',
                    padding: 0,
                    textDecoration: 'underline',
                  }}
                >
                  Effacer les filtres
                </button>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Desktop: Full filter bar */
        <div style={{
          padding: '16px 32px',
          borderBottom: '1px solid var(--tool-border-light)',
          background: 'var(--tool-surface)',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          transition: 'background-color 0.2s ease, border-color 0.2s ease',
        }}>
          {/* Category filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{
              fontFamily: 'var(--font-sketch)',
              fontSize: 13,
              color: 'var(--tool-text-muted)',
              minWidth: 70,
            }}>
              Catégorie
            </span>
            {categories.map(cat => (
              <FilterChip
                key={cat}
                label={categoryLabels[cat]}
                color={categoryColors[cat]}
                selected={selectedCategories.has(cat)}
                onClick={() => toggleCategory(cat)}
              />
            ))}
          </div>

          {/* Priority filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{
              fontFamily: 'var(--font-sketch)',
              fontSize: 13,
              color: 'var(--tool-text-muted)',
              minWidth: 70,
            }}>
              Priorité
            </span>
            {[0, 1, 2, 3].map(p => (
              <FilterChip
                key={p}
                label={`P${p} ${priorityLabels[p]}`}
                color={priorityColors[p] ?? '#888'}
                selected={selectedPriorities.has(p)}
                onClick={() => togglePriority(p)}
              />
            ))}
          </div>

          {/* Screen filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{
              fontFamily: 'var(--font-sketch)',
              fontSize: 13,
              color: 'var(--tool-text-muted)',
              minWidth: 70,
            }}>
              Écran
            </span>
            {screensWithStories.map(screen => (
              <FilterChip
                key={screen.id}
                label={screen.name}
                color="var(--tool-text)"
                selected={selectedScreens.has(screen.id)}
                onClick={() => toggleScreen(screen.id)}
              />
            ))}
          </div>

          {/* Clear filters */}
          {hasFilters && (
            <button
              onClick={clearFilters}
              style={{
                alignSelf: 'flex-start',
                background: 'none',
                border: 'none',
                fontFamily: 'var(--font-sketch)',
                fontSize: 13,
                color: '#c00',
                cursor: 'pointer',
                padding: 0,
                textDecoration: 'underline',
              }}
            >
              Effacer les filtres
            </button>
          )}
        </div>
      )}

      {/* Stories by priority */}
      <div style={{ padding: isMobile ? 16 : 32 }}>
        {storiesByPriority.length === 0 ? (
          <p style={{
            fontFamily: 'var(--font-sketch)',
            fontSize: 16,
            color: 'var(--tool-text-muted)',
            textAlign: 'center',
            padding: 40,
          }}>
            Aucune story ne correspond aux filtres sélectionnés
          </p>
        ) : (
          storiesByPriority.map(({ priority, stories }) => (
            <div key={priority} style={{ marginBottom: 40 }}>
              <h2 style={{
                fontFamily: 'var(--font-sketch)',
                fontSize: 20,
                margin: '0 0 16px 0',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                color: 'var(--tool-text)',
              }}>
                <span style={{
                  display: 'inline-block',
                  padding: '4px 12px',
                  background: priorityColors[priority],
                  color: 'white',
                  borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px',
                  fontSize: 14,
                }}>
                  P{priority}
                </span>
                Priorité {priorityLabels[priority]}
                <span style={{
                  fontSize: 14,
                  color: 'var(--tool-text-muted)',
                  fontWeight: 'normal',
                }}>
                  ({stories.length} stories)
                </span>
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {stories.map(story => (
                  <StoryCard
                    key={story.id}
                    ref={(el) => {
                      if (el) storyRefs.current.set(story.id, el);
                    }}
                    story={story}
                    isSelected={story.id === selectedStoryId}
                    onSelectScreen={onSelectScreen}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

interface FilterChipProps {
  label: string;
  color: string;
  selected: boolean;
  onClick: () => void;
}

function FilterChip({ label, color, selected, onClick }: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      style={{
        background: selected ? color : 'transparent',
        color: selected ? 'white' : color,
        border: `1px solid ${color}`,
        borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px',
        padding: '4px 10px',
        fontFamily: 'var(--font-sketch)',
        fontSize: 12,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
      }}
    >
      {label}
    </button>
  );
}

interface StoryCardProps {
  story: UserStory;
  isSelected: boolean;
  onSelectScreen: (screenId: string) => void;
}

const StoryCard = React.forwardRef<HTMLDivElement, StoryCardProps>(
  function StoryCard({ story, isSelected, onSelectScreen }, ref) {
  const linkedScreens = story.screenIds
    .map(id => ({ id, screen: getScreen(id) }))
    .filter(({ screen }) => screen !== undefined);

  return (
    <div
      ref={ref}
      style={{
        border: isSelected ? '3px solid #2563eb' : '2px solid var(--tool-border)',
        borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px',
        padding: 16,
        background: isSelected ? '#eff6ff' : 'var(--tool-surface)',
        transition: 'all 0.2s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 8 }}>
        {/* Category badge */}
        <span style={{
          display: 'inline-block',
          padding: '2px 8px',
          background: categoryColors[story.category],
          color: 'white',
          borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px',
          fontSize: 11,
          fontFamily: 'var(--font-sketch)',
          flexShrink: 0,
        }}>
          {categoryLabels[story.category]}
        </span>
        <h3 style={{
          fontFamily: 'var(--font-sketch)',
          fontSize: 16,
          margin: 0,
          color: 'var(--tool-text)',
        }}>
          {story.title}
        </h3>
      </div>

      <p style={{
        fontFamily: 'var(--font-sketch)',
        fontSize: 13,
        color: 'var(--tool-text-muted)',
        margin: '0 0 12px 0',
        lineHeight: 1.5,
      }}>
        {story.description}
      </p>

      {linkedScreens.length > 0 ? (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {linkedScreens.map(({ id, screen }) => (
            <button
              key={id}
              onClick={() => onSelectScreen(id)}
              style={{
                background: 'var(--tool-border-light)',
                border: '1px solid var(--tool-border)',
                borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px',
                padding: '6px 12px',
                fontFamily: 'var(--font-sketch)',
                fontSize: 13,
                cursor: 'pointer',
                color: 'var(--tool-text)',
              }}
            >
              → {screen!.name}
            </button>
          ))}
        </div>
      ) : (
        <p style={{
          fontFamily: 'var(--font-sketch)',
          fontSize: 13,
          color: 'var(--tool-text-muted)',
          fontStyle: 'italic',
          margin: 0,
        }}>
          Pas encore de mockup
        </p>
      )}
    </div>
  );
});
