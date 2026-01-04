/**
 * 需求追溯相关类型定义
 */

// 追溯关系类型
export enum TraceRelationType {
  // 正向追溯（需求→实现）
  DERIVE_FROM = 'derive_from',
  REALIZE_BY = 'realize_by',
  IMPLEMENT_BY = 'implement_by',
  TEST_BY = 'test_by',
  DELIVER_IN = 'deliver_in',
  
  // 反向追溯（实现→需求）
  TRACE_TO = 'trace_to',
  SATISFY = 'satisfy',
  VERIFY = 'verify',
  
  // 横向追溯（同级关联）
  DEPEND_ON = 'depend_on',
  RELATE_TO = 'relate_to',
  CONFLICT_WITH = 'conflict_with',
  REPLACE = 'replace',
  
  // 影响追溯（变更影响）
  IMPACT_ON = 'impact_on',
  TRIGGER = 'trigger',
  BLOCK = 'block',
}

// 追溯实体类型
export enum TraceEntityType {
  // L0 战略层
  PRODUCT_LINE = 'product_line',
  ROADMAP = 'roadmap',
  
  // L0A 规划层
  PI_PLANNING = 'pi_planning',
  PROJECT = 'project',
  
  // L1 需求层
  USER_REQUIREMENT = 'user_requirement',
  STAKEHOLDER_NEED = 'stakeholder_need',
  
  // L2 特性层
  FEATURE_REQUIREMENT = 'feature_requirement',
  PRD = 'prd',
  
  // L3 模块层
  MODULE_REQUIREMENT = 'module_requirement',
  INTERFACE = 'interface',
  
  // L4 任务层
  STORY = 'story',
  TASK = 'task',
  SUB_TASK = 'sub_task',
  
  // L5 实现层
  CODE = 'code',
  COMMIT = 'commit',
  BUILD = 'build',
  
  // L6 验证层
  TEST_CASE = 'test_case',
  TEST_RESULT = 'test_result',
  DEFECT = 'defect',
  
  // L7 交付层
  RELEASE = 'release',
  DEPLOYMENT = 'deployment',
}

// 追溯节点状态
export enum TraceNodeStatus {
  DRAFT = 'draft',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  BLOCKED = 'blocked',
  CANCELLED = 'cancelled',
}

// 追溯节点
export interface TraceNode {
  id: string
  entityType: TraceEntityType
  entityId: string
  name: string
  status: TraceNodeStatus
  layer: number // 0-7
  owner?: string
  createdAt: string
  updatedAt: string
  metadata?: Record<string, any>
}

// 追溯链接
export interface TraceLink {
  id: string
  sourceId: string
  targetId: string
  relationType: TraceRelationType
  description?: string
  createdAt: string
  createdBy: string
}

// 追溯树节点
export interface TraceTreeNode extends TraceNode {
  children?: TraceTreeNode[]
  links?: TraceLink[]
  expanded?: boolean
}

// 追溯方向
export enum TraceDirection {
  FORWARD = 'forward',   // 正向追溯
  BACKWARD = 'backward', // 反向追溯
  HORIZONTAL = 'horizontal', // 横向追溯
  IMPACT = 'impact',     // 影响追溯
}

// 追溯查询参数
export interface TraceQueryParams {
  entityType: TraceEntityType
  entityId: string
  direction: TraceDirection
  maxDepth?: number
  includeRelations?: TraceRelationType[]
}

// 追溯树数据
export interface TraceTreeData {
  root: TraceTreeNode
  totalNodes: number
  maxDepth: number
  criticalPath?: string[] // 关键路径节点ID列表
}

// 追溯矩阵数据
export interface TraceMatrixData {
  rows: TraceNode[]
  columns: TraceNode[]
  cells: {
    rowId: string
    colId: string
    links: TraceLink[]
    hasRelation: boolean
  }[]
}

// 影响分析结果
export interface ImpactAnalysisResult {
  sourceNode: TraceNode
  impactedNodes: TraceNode[]
  impactPaths: {
    path: TraceNode[]
    links: TraceLink[]
    riskLevel: 'low' | 'medium' | 'high'
  }[]
  totalImpact: number
  riskAssessment: {
    level: 'low' | 'medium' | 'high'
    factors: string[]
    suggestions: string[]
  }
}

// 追溯覆盖率统计
export interface TraceCoverageStats {
  totalRequirements: number
  tracedRequirements: number
  coverageRate: number
  byLayer: {
    layer: number
    layerName: string
    total: number
    traced: number
    rate: number
  }[]
  missingTraces: {
    entityType: TraceEntityType
    entityId: string
    name: string
    expectedLinks: string[]
  }[]
}

// 价值网络节点类型
export enum ValueNetworkNodeType {
  // 战略层
  PRODUCT_LINE = 'product_line',
  PRODUCT = 'product',
  ROADMAP = 'roadmap',
  
  // 规划层
  PI_PLANNING = 'pi_planning',
  PROJECT = 'project',
  ITERATION = 'iteration',
  
  // 需求层
  USER_REQUIREMENT = 'user_requirement',
  FEATURE_REQUIREMENT = 'feature_requirement',
  MODULE_REQUIREMENT = 'module_requirement',
  
  // 设计层
  ARCHITECTURE = 'architecture',
  DESIGN_DOC = 'design_doc',
  INTERFACE_SPEC = 'interface_spec',
  
  // 任务层
  STORY = 'story',
  TASK = 'task',
  
  // 实现层
  CODE = 'code',
  COMMIT = 'commit',
  
  // 验证层
  TEST_PLAN = 'test_plan',
  TEST_CASE = 'test_case',
  TEST_RESULT = 'test_result',
  DEFECT = 'defect',
  
  // 交付层
  BUILD = 'build',
  RELEASE = 'release',
  DEPLOYMENT = 'deployment',
  
  // 评审层
  REVIEW = 'review',
  APPROVAL = 'approval',
  MILESTONE = 'milestone',
}

// 价值网络节点
export interface ValueNetworkNode {
  id: string
  type: ValueNetworkNodeType
  name: string
  status: TraceNodeStatus
  layer: 1 | 2 | 3 // L1/L2/L3
  progress: number // 0-100
  owner?: string
  team?: string
  startDate?: string
  endDate?: string
  metrics?: {
    key: string
    value: number
    unit: string
  }[]
  position?: {
    x: number
    y: number
  }
}

// 价值网络连接
export interface ValueNetworkConnection {
  id: string
  source: string
  target: string
  type: 'flow' | 'dependency' | 'feedback'
  label?: string
  weight?: number
  isCritical?: boolean
}

// 价值网络数据
export interface ValueNetworkData {
  level: 1 | 2 | 3
  nodes: ValueNetworkNode[]
  connections: ValueNetworkConnection[]
  criticalPath?: string[]
  bottlenecks?: string[]
  metrics?: {
    totalNodes: number
    totalConnections: number
    avgProgress: number
    criticalPathLength: number
    bottleneckCount: number
  }
}

// 价值网络分析结果
export interface ValueNetworkAnalysis {
  efficiency: {
    score: number // 0-100
    factors: {
      name: string
      impact: number
      description: string
    }[]
  }
  resources: {
    utilization: number // 0-100
    allocation: {
      team: string
      workload: number
      capacity: number
    }[]
  }
  optimization: {
    suggestions: {
      priority: 'high' | 'medium' | 'low'
      title: string
      description: string
      expectedImprovement: string
    }[]
  }
}

