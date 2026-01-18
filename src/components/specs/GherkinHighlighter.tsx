import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ChevronDown, ChevronRight, ChevronsDownUp, ChevronsUpDown, Code2, CheckCircle2, XCircle, AlertCircle, Clock, Table2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader } from '../ui/card';
import { findStepDefinition, type StepDefinitionInfo } from '../../data/stepDefinitions';

interface ScenarioResult {
  name: string;
  status: 'passed' | 'failed' | 'skipped' | 'pending' | 'unknown';
  errorMessage?: string;
}

interface GherkinHighlighterProps {
  content: string;
  scenarioResults?: ScenarioResult[];
}

interface ParsedBlock {
  type: 'header' | 'background' | 'scenario';
  lines: string[];
  startLine: number;
  name?: string;
  status?: 'passed' | 'failed' | 'skipped' | 'pending' | 'unknown';
  errorMessage?: string;
}

const keywords = {
  feature: ['Fonctionnalité:', 'Feature:'],
  background: ['Contexte:', 'Background:'],
  scenario: ['Scénario:', 'Scenario:', 'Plan du Scénario:', 'Scenario Outline:'],
  given: ['Étant donné', 'Etant donné', 'Given', 'Soit'],
  when: ['Quand', 'When', 'Lorsque'],
  then: ['Alors', 'Then'],
  and: ['Et', 'And', 'Mais', 'But'],
  examples: ['Exemples:', 'Examples:'],
};

export function GherkinHighlighter({ content, scenarioResults = [] }: GherkinHighlighterProps) {
  const lines = content.split('\n');

  // Parse content into blocks
  const blocks = useMemo(() => parseBlocks(lines, scenarioResults), [lines, scenarioResults]);

  // Determine initial collapsed state - scenarios collapsed by default (open if failed), background always open
  const initialCollapsed = useMemo(() => {
    const state: Record<number, boolean> = {};
    blocks.forEach((block, index) => {
      if (block.type === 'scenario') {
        state[index] = block.status !== 'failed';
      } else if (block.type === 'background') {
        // Background is always expanded
        state[index] = false;
      }
    });
    return state;
  }, [blocks]);

  const [collapsed, setCollapsed] = useState<Record<number, boolean>>(initialCollapsed);
  const [showDefinitions, setShowDefinitions] = useState(true);

  const toggleBlock = (index: number) => {
    setCollapsed(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const expandAll = () => {
    const newState: Record<number, boolean> = {};
    blocks.forEach((_, index) => {
      newState[index] = false;
    });
    setCollapsed(newState);
  };

  const collapseAll = () => {
    const newState: Record<number, boolean> = {};
    blocks.forEach((block, index) => {
      if (block.type === 'scenario') {
        newState[index] = true;
      }
      // Background stays expanded
    });
    setCollapsed(newState);
  };

  const scenarioCount = blocks.filter(b => b.type === 'scenario').length;
  const collapsedScenarioCount = blocks.filter((b, i) => b.type === 'scenario' && collapsed[i]).length;
  const allCollapsed = collapsedScenarioCount === scenarioCount;

  return (
    <div className="space-y-2" style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      {/* Toolbar */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={allCollapsed ? expandAll : collapseAll}
          className="h-7 px-2 text-xs"
        >
          {allCollapsed ? (
            <>
              <ChevronsUpDown className="w-3.5 h-3.5 mr-1" />
              <span className="hidden sm:inline">Tout déplier</span>
              <span className="sm:hidden">Déplier</span>
            </>
          ) : (
            <>
              <ChevronsDownUp className="w-3.5 h-3.5 mr-1" />
              <span className="hidden sm:inline">Tout replier</span>
              <span className="sm:hidden">Replier</span>
            </>
          )}
        </Button>
        <Button
          variant={showDefinitions ? 'secondary' : 'outline'}
          size="sm"
          onClick={() => setShowDefinitions(!showDefinitions)}
          className="h-7 px-2 text-xs"
        >
          <Code2 className="w-3.5 h-3.5 mr-1" />
          <span className="hidden sm:inline">Définitions</span>
          <span className="sm:hidden">Déf.</span>
        </Button>
      </div>

      {/* Scenario/Background Blocks */}
      {blocks.filter(b => b.type !== 'header').map((block, blockIndex) => (
        <BlockRenderer
          key={blockIndex}
          block={block}
          isCollapsed={collapsed[blocks.indexOf(block)] ?? false}
          onToggle={() => toggleBlock(blocks.indexOf(block))}
          showDefinitions={showDefinitions}
        />
      ))}
    </div>
  );
}

function parseBlocks(lines: string[], scenarioResults: ScenarioResult[]): ParsedBlock[] {
  const blocks: ParsedBlock[] = [];
  let currentBlock: ParsedBlock | null = null;

  const resultMap = new Map(scenarioResults.map(r => [r.name.toLowerCase().trim(), { status: r.status, errorMessage: r.errorMessage }]));

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? '';
    const trimmed = line.trim();

    // Check for scenario start
    const isScenario = keywords.scenario.some(kw => trimmed.startsWith(kw));
    const isBackground = keywords.background.some(kw => trimmed.startsWith(kw));
    const isFeature = keywords.feature.some(kw => trimmed.startsWith(kw));

    if (isFeature || (currentBlock === null && !isScenario && !isBackground)) {
      // Header content (tags, language, feature line, description)
      if (!currentBlock || currentBlock.type !== 'header') {
        if (currentBlock) blocks.push(currentBlock);
        currentBlock = { type: 'header', lines: [], startLine: i };
      }
      currentBlock.lines.push(line);
    } else if (isBackground) {
      if (currentBlock) blocks.push(currentBlock);
      currentBlock = {
        type: 'background',
        lines: [line],
        startLine: i,
        name: extractName(trimmed, keywords.background),
        status: 'unknown'
      };
    } else if (isScenario) {
      if (currentBlock) blocks.push(currentBlock);
      const name = extractName(trimmed, keywords.scenario);
      const result = resultMap.get(name.toLowerCase().trim());
      currentBlock = {
        type: 'scenario',
        lines: [line],
        startLine: i,
        name,
        status: result?.status || 'unknown',
        errorMessage: result?.errorMessage
      };
    } else if (currentBlock) {
      currentBlock.lines.push(line);
    }
  }

  if (currentBlock) blocks.push(currentBlock);

  return blocks;
}

function extractName(line: string, keywords: string[]): string {
  for (const kw of keywords) {
    if (line.startsWith(kw)) {
      return line.slice(kw.length).trim();
    }
  }
  return line;
}

interface BlockRendererProps {
  block: ParsedBlock;
  isCollapsed: boolean;
  onToggle: () => void;
  showDefinitions: boolean;
}

function BlockRenderer({ block, isCollapsed, onToggle, showDefinitions }: BlockRendererProps) {
  if (block.type === 'header') {
    // Header is now handled separately in the main component
    return null;
  }

  const restLines = block.lines.slice(1);
  const isBackground = block.type === 'background';

  // Parse steps from rest lines
  const parsedSteps = parseStepsFromLines(restLines);

  // Determine border color based on status
  const borderColor = block.status === 'passed' ? 'border-l-green-500' :
                      block.status === 'failed' ? 'border-l-red-500' :
                      block.status === 'skipped' ? 'border-l-yellow-500' :
                      isBackground ? 'border-l-zinc-400' : 'border-l-cyan-500';

  // Status icon
  const StatusIcon = () => {
    if (!block.status || block.status === 'unknown') return null;
    if (block.status === 'passed') return <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />;
    if (block.status === 'failed') return <XCircle className="w-4 h-4 text-red-500 shrink-0" />;
    if (block.status === 'skipped') return <AlertCircle className="w-4 h-4 text-yellow-500 shrink-0" />;
    return <Clock className="w-4 h-4 text-zinc-400 shrink-0" />;
  };

  return (
    <Card className={`border-l-4 ${borderColor}`}>
      {/* Clickable header */}
      <CardHeader
        className="p-2 cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center gap-1.5">
          <span className="text-muted-foreground shrink-0">
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </span>
          <StatusIcon />
          <div className="flex-1 min-w-0 flex items-center gap-1.5 flex-wrap">
            <span className={`text-xs font-medium px-1.5 py-0.5 rounded shrink-0 ${
              isBackground
                ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                : 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400'
            }`}>
              {isBackground ? 'Contexte' : 'Scénario'}
            </span>
            <span className="font-medium text-foreground text-sm truncate sm:whitespace-normal">
              {block.name}
            </span>
          </div>
          {parsedSteps.length > 0 && (
            <span className="text-xs text-muted-foreground shrink-0 hidden sm:block">
              {parsedSteps.length} étapes
            </span>
          )}
        </div>
      </CardHeader>

      {/* Collapsible content */}
      {!isCollapsed && (
        <CardContent className="pt-0 px-2 pb-2">
          <div className="space-y-0.5 ml-0 sm:ml-6">
            {parsedSteps.map((step, index) => (
              <StepRenderer
                key={index}
                step={step}
                showDefinitions={showDefinitions}
              />
            ))}
          </div>

          {/* Error message for failed scenarios */}
          {block.status === 'failed' && block.errorMessage && (
            <div className="ml-0 sm:ml-6 mt-2 p-2 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-md">
              <div className="text-xs font-medium text-red-600 dark:text-red-400 mb-1">Erreur:</div>
              <pre className="text-xs text-red-700 dark:text-red-300 whitespace-pre-wrap break-words font-mono overflow-x-auto">
                {block.errorMessage}
              </pre>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}

interface ParsedStep {
  type: 'given' | 'when' | 'then' | 'and' | 'examples' | 'table' | 'other';
  keyword: string;
  text: string;
  originalLine: string;
  tableRows?: string[][];
}

function parseStepsFromLines(lines: string[]): ParsedStep[] {
  const steps: ParsedStep[] = [];
  let currentStep: ParsedStep | null = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Check for table row
    if (trimmed.startsWith('|')) {
      const cells = trimmed.split('|').slice(1, -1).map(c => c.trim());
      if (currentStep) {
        if (!currentStep.tableRows) currentStep.tableRows = [];
        currentStep.tableRows.push(cells);
      } else {
        // Standalone table row (shouldn't happen, but handle it)
        steps.push({
          type: 'table',
          keyword: '',
          text: trimmed,
          originalLine: line,
          tableRows: [cells]
        });
      }
      continue;
    }

    // Check for step keywords
    let matched = false;

    for (const kw of keywords.given) {
      if (trimmed.startsWith(kw)) {
        if (currentStep) steps.push(currentStep);
        currentStep = { type: 'given', keyword: kw, text: trimmed.slice(kw.length).trim(), originalLine: line };
        matched = true;
        break;
      }
    }
    if (!matched) {
      for (const kw of keywords.when) {
        if (trimmed.startsWith(kw)) {
          if (currentStep) steps.push(currentStep);
          currentStep = { type: 'when', keyword: kw, text: trimmed.slice(kw.length).trim(), originalLine: line };
          matched = true;
          break;
        }
      }
    }
    if (!matched) {
      for (const kw of keywords.then) {
        if (trimmed.startsWith(kw)) {
          if (currentStep) steps.push(currentStep);
          currentStep = { type: 'then', keyword: kw, text: trimmed.slice(kw.length).trim(), originalLine: line };
          matched = true;
          break;
        }
      }
    }
    if (!matched) {
      for (const kw of keywords.and) {
        if (trimmed.startsWith(kw)) {
          if (currentStep) steps.push(currentStep);
          currentStep = { type: 'and', keyword: kw, text: trimmed.slice(kw.length).trim(), originalLine: line };
          matched = true;
          break;
        }
      }
    }
    if (!matched) {
      for (const kw of keywords.examples) {
        if (trimmed.startsWith(kw)) {
          if (currentStep) steps.push(currentStep);
          currentStep = { type: 'examples', keyword: kw, text: trimmed.slice(kw.length).trim(), originalLine: line };
          matched = true;
          break;
        }
      }
    }
    if (!matched && trimmed) {
      if (currentStep) steps.push(currentStep);
      currentStep = { type: 'other', keyword: '', text: trimmed, originalLine: line };
    }
  }

  if (currentStep) steps.push(currentStep);

  return steps;
}

interface StepRendererProps {
  step: ParsedStep;
  showDefinitions: boolean;
}

function StepRenderer({ step, showDefinitions }: StepRendererProps) {
  // Always check for step definition to show dotted underline
  // Use step.text (without keyword) to match against step definition patterns
  const stepDef = step.type !== 'table' && step.type !== 'other' && step.type !== 'examples'
    ? findStepDefinition(step.text)
    : null;

  // Keyword colors
  const keywordColor = step.type === 'given' ? 'text-blue-600 dark:text-blue-400' :
                       step.type === 'when' ? 'text-amber-600 dark:text-amber-400' :
                       step.type === 'then' ? 'text-green-600 dark:text-green-400' :
                       step.type === 'and' ? 'text-zinc-500 dark:text-zinc-400' :
                       step.type === 'examples' ? 'text-purple-600 dark:text-purple-400' :
                       'text-muted-foreground';

  const keywordBg = step.type === 'given' ? 'bg-blue-50 dark:bg-blue-950/30' :
                    step.type === 'when' ? 'bg-amber-50 dark:bg-amber-950/30' :
                    step.type === 'then' ? 'bg-green-50 dark:bg-green-950/30' :
                    step.type === 'and' ? 'bg-zinc-50 dark:bg-zinc-800/50' :
                    step.type === 'examples' ? 'bg-purple-50 dark:bg-purple-950/30' :
                    '';

  if (step.type === 'table') {
    return (
      <div className="ml-2 sm:ml-4 my-2">
        <Table2 className="w-4 h-4 text-muted-foreground inline mr-2" />
        <span className="text-sm text-muted-foreground">{step.text}</span>
      </div>
    );
  }

  // Show popover only when definitions mode is active, but always show dotted underline for steps with definitions
  const dottedUnderlineStyle = {
    borderBottom: '1.3px dashed',
    borderColor: 'rgb(161 161 170)', // zinc-400
  };
  const stepTextElement = stepDef ? (
    showDefinitions ? (
      <StepDefinitionPopover stepDef={stepDef}>
        {highlightStringsInText(step.text)}
      </StepDefinitionPopover>
    ) : (
      <span style={dottedUnderlineStyle}>
        {highlightStringsInText(step.text)}
      </span>
    )
  ) : (
    <span>{highlightStringsInText(step.text)}</span>
  );

  return (
    <div className="py-0.5">
      <div className={`flex items-start gap-1.5 px-1.5 py-0.5 rounded ${keywordBg}`}>
        {step.keyword && (
          <span className={`font-medium text-sm shrink-0 ${keywordColor}`}>
            {step.keyword}
          </span>
        )}
        <span className="text-sm text-foreground break-words">
          {stepTextElement}
        </span>
      </div>
      {/* Render table if present */}
      {step.tableRows && step.tableRows.length > 0 && (
        <div className="ml-0 sm:ml-4 mt-1 overflow-x-auto -mx-1 px-1">
          <table className="text-sm border-collapse min-w-full">
            <tbody>
              {step.tableRows.map((row, rowIndex) => (
                <tr key={rowIndex} className={rowIndex === 0 ? 'font-medium' : ''}>
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className="px-2 py-1 border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function highlightStringsInText(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  const regex = /"[^"]*"/g;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(<span key={`text-${lastIndex}`}>{text.slice(lastIndex, match.index)}</span>);
    }
    parts.push(
      <span key={`string-${match.index}`} className="font-medium text-orange-600 dark:text-orange-400">
        {match[0]}
      </span>
    );
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(<span key={`text-${lastIndex}`}>{text.slice(lastIndex)}</span>);
  }

  return parts.length > 0 ? <>{parts}</> : text;
}

// Click-based popover for step definitions (works on mobile and desktop)
function StepDefinitionPopover({
  stepDef,
  children
}: {
  stepDef: StepDefinitionInfo;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLSpanElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    // Close on escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const dottedUnderlineStyle = {
    borderBottom: '1.3px dashed rgb(161 161 170)', // zinc-400
  };

  return (
    <span className="relative inline">
      <span
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer"
        style={dottedUnderlineStyle}
      >
        {children}
      </span>
      {isOpen && (
        <div
          ref={popoverRef}
          className="absolute left-0 top-full mt-1 z-50 shadow-xl rounded-lg"
          style={{ minWidth: '300px', maxWidth: 'min(90vw, 500px)' }}
        >
          <SourceCodePopup stepDef={stepDef} />
        </div>
      )}
    </span>
  );
}

function SourceCodePopup({ stepDef }: { stepDef: StepDefinitionInfo }) {
  const lines = stepDef.sourceCode.split('\n');

  return (
    <div className="bg-zinc-900 rounded-lg overflow-hidden min-w-[300px]">
      {/* Header */}
      <div className="px-3 py-2 bg-zinc-800 border-b border-zinc-700 flex items-center justify-between">
        <span className="text-xs text-zinc-400 font-medium">
          {stepDef.file}:{stepDef.lineNumber}
        </span>
        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
          stepDef.keyword === 'Given' ? 'bg-blue-500/20 text-blue-400' :
          stepDef.keyword === 'When' ? 'bg-amber-500/20 text-amber-400' :
          'bg-green-500/20 text-green-400'
        }`}>
          {stepDef.keyword}
        </span>
      </div>

      {/* Code */}
      <div className="p-3 overflow-x-auto">
        <pre className="text-xs leading-relaxed">
          <code>
            {lines.map((codeLine, i) => (
              <div key={i} className="flex">
                <span className="w-6 text-right pr-2 text-zinc-600 select-none text-[10px]">
                  {stepDef.lineNumber + i}
                </span>
                <span className="text-zinc-300">
                  {highlightTypeScript(codeLine)}
                </span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}

function highlightTypeScript(code: string): React.ReactNode {
  // Simple TypeScript syntax highlighting
  const parts: React.ReactNode[] = [];
  let remaining = code;
  let key = 0;

  const patterns: Array<{ regex: RegExp; className: string }> = [
    // Keywords
    { regex: /^(async|function|const|let|var|if|else|for|return|this|await|new|typeof|import|export|from)\b/, className: 'text-purple-400' },
    // Cucumber keywords
    { regex: /^(Given|When|Then)\b/, className: 'text-amber-400 font-medium' },
    // Strings (single, double, backtick)
    { regex: /^'(?:[^'\\]|\\.)*'/, className: 'text-green-400' },
    { regex: /^"(?:[^"\\]|\\.)*"/, className: 'text-green-400' },
    { regex: /^`(?:[^`\\]|\\.)*`/, className: 'text-green-400' },
    // Comments
    { regex: /^\/\/.*$/, className: 'text-zinc-500 italic' },
    // Types after colon
    { regex: /^:\s*[A-Z][a-zA-Z0-9]*/, className: 'text-cyan-400' },
    // Numbers
    { regex: /^\d+/, className: 'text-orange-400' },
    // Booleans
    { regex: /^(true|false|null|undefined)\b/, className: 'text-orange-400' },
    // Methods/functions
    { regex: /^(\.[a-zA-Z_][a-zA-Z0-9_]*)\s*\(/, className: 'text-blue-300' },
    // Properties
    { regex: /^(\.[a-zA-Z_][a-zA-Z0-9_]*)/, className: 'text-zinc-200' },
    // Arrows
    { regex: /^=>/, className: 'text-purple-400' },
    // Brackets and operators
    { regex: /^[{}()\[\];,]/, className: 'text-zinc-400' },
  ];

  while (remaining.length > 0) {
    let matched = false;

    for (const { regex, className } of patterns) {
      const match = remaining.match(regex);
      if (match) {
        parts.push(
          <span key={key++} className={className}>
            {match[0]}
          </span>
        );
        remaining = remaining.slice(match[0].length);
        matched = true;
        break;
      }
    }

    if (!matched) {
      // No pattern matched, take one character
      parts.push(<span key={key++}>{remaining[0]}</span>);
      remaining = remaining.slice(1);
    }
  }

  return <>{parts}</>;
}
