/**
 * 数据分析类型定义
 */

// 价值流阶段
export interface ValueStreamStage {
  name: string;
  leadTime: number;
  processTime: number;
  waitTime: number;
  efficiency: number;
}

// 价值流瓶颈
export interface Bottleneck {
  stage: string;
  reason: string;
  impact: 'high' | 'medium' | 'low';
}

// 价值流分析
export interface ValueStreamAnalysis {
  period: { start: string; end: string };
  stages: ValueStreamStage[];
  summary: {
    totalLeadTime: number;
    totalProcessTime: number;
    totalWaitTime: number;
    overallEfficiency: number;
    throughput: number;
    cycleTime: number;
  };
  bottlenecks: Bottleneck[];
}

// 团队速率对比
export interface TeamVelocity {
  team: string;
  velocity: number;
  capacity: number;
}

// 吞吐量
export interface Throughput {
  features: { completed: number; inProgress: number; planned: number };
  stories: { completed: number; inProgress: number; planned: number };
  tasks: { completed: number; inProgress: number; planned: number };
}

// 效能分析
export interface EfficiencyAnalysis {
  period: { start: string; end: string };
  velocity: {
    current: number;
    target: number;
    trend: number[];
    teamComparison: TeamVelocity[];
  };
  throughput: Throughput;
  productivity: {
    linesOfCode: number;
    commits: number;
    pullRequests: number;
    codeReviews: number;
    avgPRSize: number;
    avgReviewTime: number;
  };
  quality: {
    defectRate: number;
    testCoverage: number;
    codeQuality: number;
    technicalDebt: number;
  };
}

// 质量分析
export interface QualityAnalysis {
  period: { start: string; end: string };
  defects: {
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
    fixed: number;
    open: number;
    trend: number[];
  };
  testCoverage: {
    unit: number;
    integration: number;
    system: number;
    overall: number;
    trend: number[];
  };
  codeQuality: {
    maintainability: number;
    reliability: number;
    security: number;
    duplication: number;
    complexity: number;
    overall: number;
  };
  buildSuccess: {
    successRate: number;
    totalBuilds: number;
    successBuilds: number;
    failedBuilds: number;
    avgDuration: number;
  };
}

// 成本分析
export interface CostAnalysis {
  period: { start: string; end: string };
  humanCost: {
    total: number;
    byTeam: Array<{ team: string; headcount: number; cost: number }>;
    byRole: Array<{ role: string; headcount: number; avgCost: number }>;
  };
  infrastructureCost: {
    total: number;
    compute: number;
    storage: number;
    network: number;
    licenses: number;
  };
  totalCost: number;
  efficiency: {
    costPerStoryPoint: number;
    costPerFeature: number;
    costPerDefect: number;
    roi: number;
  };
}

