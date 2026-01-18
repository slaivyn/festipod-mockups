import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronRight, ChevronsDownUp, ChevronsUpDown, Code2 } from 'lucide-react';
import { Button } from '../ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { findStepDefinition, type StepDefinitionInfo } from '../../data/stepDefinitions';

interface ScenarioResult {
  name: string;
  status: 'passed' | 'failed' | 'skipped' | 'pending' | 'unknown';
  errorMessage?: string;
}

interface GherkinHighlighterProps {
  content: string;
  scenarioResults?: ScenarioResult[];
  filePath?: string;
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

export function GherkinHighlighter({ content, scenarioResults = [], filePath }: GherkinHighlighterProps) {
  const lines = content.split('\n');

  // Parse content into blocks
  const blocks = useMemo(() => parseBlocks(lines, scenarioResults), [lines, scenarioResults]);

  // Determine initial collapsed state - collapsed by default, open if failed
  const initialCollapsed = useMemo(() => {
    const state: Record<number, boolean> = {};
    blocks.forEach((block, index) => {
      if (block.type === 'scenario' || block.type === 'background') {
        state[index] = block.status !== 'failed';
      }
    });
    return state;
  }, [blocks]);

  const [collapsed, setCollapsed] = useState<Record<number, boolean>>(initialCollapsed);
  const [showDefinitions, setShowDefinitions] = useState(false);

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
      if (block.type === 'scenario' || block.type === 'background') {
        newState[index] = true;
      }
    });
    setCollapsed(newState);
  };

  const collapsibleCount = blocks.filter(b => b.type === 'scenario' || b.type === 'background').length;
  const collapsedCount = Object.values(collapsed).filter(Boolean).length;
  const allCollapsed = collapsedCount === collapsibleCount;

  return (
    <TooltipProvider delayDuration={300}>
      <div className="rounded-lg border border-border bg-zinc-950 overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-2 px-4 py-2 bg-zinc-900 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={allCollapsed ? expandAll : collapseAll}
              className="h-7 px-2 text-xs cursor-pointer text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
            >
              {allCollapsed ? (
                <>
                  <ChevronsUpDown className="w-3.5 h-3.5 mr-1" />
                  Tout déplier
                </>
              ) : (
                <>
                  <ChevronsDownUp className="w-3.5 h-3.5 mr-1" />
                  Tout replier
                </>
              )}
            </Button>
            <Button
              variant={showDefinitions ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setShowDefinitions(!showDefinitions)}
              className="h-7 px-2 text-xs cursor-pointer text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
            >
              <Code2 className="w-3.5 h-3.5 mr-1" />
              Définitions
            </Button>
          </div>
          {filePath && (
            <code className="text-xs text-zinc-500 truncate max-w-md">
              {filePath}
            </code>
          )}
        </div>

        {/* Content */}
        <div className="p-4 overflow-x-auto">
          <pre className="font-mono text-sm leading-relaxed text-zinc-300">
            <code>
              {blocks.map((block, blockIndex) => (
                <BlockRenderer
                  key={blockIndex}
                  block={block}
                  isCollapsed={collapsed[blockIndex] ?? false}
                  onToggle={() => toggleBlock(blockIndex)}
                  showDefinitions={showDefinitions}
                />
              ))}
            </code>
          </pre>
        </div>
      </div>
    </TooltipProvider>
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
    return (
      <>
        {block.lines.map((line, index) => (
          <LineRenderer
            key={block.startLine + index}
            line={line}
            showDefinitions={showDefinitions}
          />
        ))}
      </>
    );
  }

  const firstLine = block.lines[0] ?? '';
  const restLines = block.lines.slice(1);
  const isCollapsible = block.type === 'scenario' || block.type === 'background';

  return (
    <>
      {/* Scenario/Background header line */}
      <div
        className={`flex hover:bg-zinc-800/50 ${isCollapsible ? 'cursor-pointer' : ''}`}
        onClick={isCollapsible ? onToggle : undefined}
      >
        <span className="flex items-center gap-1 flex-1">
          {isCollapsible && (
            <span className="w-4 h-4 flex items-center justify-center text-zinc-500">
              {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </span>
          )}
          {block.status && block.status !== 'unknown' && (
            <span className={`w-2 h-2 rounded-full mr-1 ${
              block.status === 'passed' ? 'bg-green-500' :
              block.status === 'failed' ? 'bg-red-500' :
              block.status === 'skipped' ? 'bg-yellow-500' :
              'bg-zinc-600'
            }`} />
          )}
          {highlightLine(firstLine, false)}
        </span>
      </div>

      {/* Collapsible content */}
      {!isCollapsed && restLines.map((line, index) => (
        <LineRenderer
          key={block.startLine + index + 1}
          line={line}
          showDefinitions={showDefinitions}
        />
      ))}

      {/* Error message for failed scenarios */}
      {!isCollapsed && block.status === 'failed' && block.errorMessage && (
        <div className="ml-5 my-2 p-3 bg-red-950 border border-red-800 rounded-md">
          <div className="text-xs font-medium text-red-400 mb-1">Erreur:</div>
          <pre className="text-xs text-red-300 whitespace-pre-wrap break-words font-mono">
            {block.errorMessage}
          </pre>
        </div>
      )}
    </>
  );
}

interface LineRendererProps {
  line: string;
  showDefinitions: boolean;
}

function LineRenderer({ line, showDefinitions }: LineRendererProps) {
  const trimmed = line.trim();
  const isStep = [...keywords.given, ...keywords.when, ...keywords.then, ...keywords.and]
    .some(kw => trimmed.startsWith(kw));

  const stepDef = isStep && showDefinitions ? findStepDefinition(trimmed) : null;

  return (
    <div className="hover:bg-zinc-800/50">
      {highlightLineWithTooltip(line, stepDef)}
    </div>
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

function highlightLine(line: string, hasDefinition: boolean): React.ReactNode {
  const trimmed = line.trim();

  // Check for tags
  if (trimmed.startsWith('@')) {
    return <span className="text-zinc-500">{line}</span>;
  }

  // Check for comments
  if (trimmed.startsWith('#') && !trimmed.includes('language:')) {
    return <span className="text-zinc-600 italic">{line}</span>;
  }

  // Check for language declaration
  if (trimmed.includes('# language:')) {
    return <span className="text-zinc-600">{line}</span>;
  }

  // Check for feature keywords
  for (const kw of keywords.feature) {
    if (trimmed.startsWith(kw)) {
      return highlightKeyword(line, kw, 'text-purple-400 font-semibold', hasDefinition);
    }
  }

  // Check for background
  for (const kw of keywords.background) {
    if (trimmed.startsWith(kw)) {
      return highlightKeyword(line, kw, 'text-zinc-400 font-medium', hasDefinition);
    }
  }

  // Check for scenario keywords
  for (const kw of keywords.scenario) {
    if (trimmed.startsWith(kw)) {
      return highlightKeyword(line, kw, 'text-cyan-400 font-medium', hasDefinition);
    }
  }

  // Check for step keywords
  for (const kw of [...keywords.given, ...keywords.when, ...keywords.then, ...keywords.and]) {
    if (trimmed.startsWith(kw)) {
      const color = keywords.given.includes(kw) ? 'text-blue-400' :
                   keywords.when.includes(kw) ? 'text-amber-400' :
                   keywords.then.includes(kw) ? 'text-green-400' :
                   'text-zinc-400';
      return highlightKeyword(line, kw, color, hasDefinition);
    }
  }

  // Check for examples
  for (const kw of keywords.examples) {
    if (trimmed.startsWith(kw)) {
      return highlightKeyword(line, kw, 'text-zinc-400 font-medium', hasDefinition);
    }
  }

  // Check for table rows
  if (trimmed.startsWith('|')) {
    return <span className="text-zinc-500">{line}</span>;
  }

  return <span className="text-zinc-400">{line}</span>;
}

function highlightLineWithTooltip(line: string, stepDef: StepDefinitionInfo | null): React.ReactNode {
  const trimmed = line.trim();

  // Find which step keyword this line starts with
  const allStepKeywords = [...keywords.given, ...keywords.when, ...keywords.then, ...keywords.and];
  let matchedKeyword: string | null = null;
  for (const kw of allStepKeywords) {
    if (trimmed.startsWith(kw)) {
      matchedKeyword = kw;
      break;
    }
  }

  // If no step keyword or no definition, use regular highlighting
  if (!matchedKeyword || !stepDef) {
    return highlightLine(line, false);
  }

  // Split the line: indentation + keyword + step text
  const index = line.indexOf(matchedKeyword);
  const before = line.slice(0, index);
  const after = line.slice(index + matchedKeyword.length);

  // Determine keyword color
  const color = keywords.given.includes(matchedKeyword) ? 'text-blue-400' :
               keywords.when.includes(matchedKeyword) ? 'text-amber-400' :
               keywords.then.includes(matchedKeyword) ? 'text-green-400' :
               'text-zinc-400';

  // Separate leading space from the step text
  const leadingSpaceMatch = after.match(/^(\s*)/);
  const leadingSpace = leadingSpaceMatch?.[1] ?? '';
  const stepText = after.slice(leadingSpace.length);

  // Wrap only the step text (after keyword and space) with tooltip
  const stepTextElement = (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="underline decoration-dotted decoration-zinc-600 cursor-help">
          {highlightStrings(stepText)}
        </span>
      </TooltipTrigger>
      <TooltipContent
        side="bottom"
        align="start"
        sideOffset={4}
        className="p-0 max-w-lg border-0 shadow-xl"
      >
        <SourceCodePopup stepDef={stepDef} />
      </TooltipContent>
    </Tooltip>
  );

  return (
    <span>
      <span>{before}</span>
      <span className={color}>{matchedKeyword}</span>
      <span>{leadingSpace}</span>
      {stepTextElement}
    </span>
  );
}

function highlightKeyword(line: string, keyword: string, className: string, hasDefinition: boolean): React.ReactNode {
  const index = line.indexOf(keyword);
  const before = line.slice(0, index);
  const after = line.slice(index + keyword.length);

  return (
    <span>
      <span>{before}</span>
      <span className={className}>{keyword}</span>
      <span className={hasDefinition ? 'underline decoration-dotted decoration-zinc-600' : ''}>
        {highlightStrings(after)}
      </span>
    </span>
  );
}

function highlightStrings(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  const regex = /"[^"]*"/g;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(<span key={`text-${lastIndex}`}>{text.slice(lastIndex, match.index)}</span>);
    }
    parts.push(
      <span key={`string-${match.index}`} className="text-orange-300">
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
