export interface ParsedStep {
  keyword: string;
  text: string;
  dataTable?: string[][];
}

export interface ParsedScenario {
  name: string;
  tags: string[];
  steps: ParsedStep[];
}

export interface ParsedFeature {
  id: string;
  name: string;
  description: string;
  tags: string[];
  category: string;
  priority: number;
  background?: ParsedStep[];
  scenarios: ParsedScenario[];
  filePath: string;
  rawContent: string;
  screenIds: string[];
}

export interface TestResult {
  featureId: string;
  scenarioName: string;
  status: 'passed' | 'failed' | 'skipped' | 'pending';
  duration?: number;
  errorMessage?: string;
}

export interface ScenarioTestResult {
  name: string;
  status: 'passed' | 'failed' | 'skipped' | 'pending' | 'unknown';
  errorMessage?: string;
}

export interface FeatureTestStatus {
  featureId: string;
  totalScenarios: number;
  passed: number;
  failed: number;
  skipped: number;
  lastRun?: Date;
  scenarios?: ScenarioTestResult[];
}
