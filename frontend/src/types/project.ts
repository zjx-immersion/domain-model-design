/**
 * PI Planning类型定义
 * @description PI Planning管理工作项规划
 * @version 2.0
 */

import type { WorkItem, WorkItemType, Priority } from './work-item'

/**
 * PI Planning状态枚举
 */
export type PIStatus = 'planning' | 'executing' | 'completed'

/**
 * 依赖类型
 */
export type DependencyType = 'finish_to_start' | 'start_to_start' | 'finish_to_finish' | 'start_to_finish'

/**
 * 依赖状态
 */
export type DependencyStatus = 'active' | 'resolved' | 'blocked'

/**
 * 风险级别
 */
export type RiskLevel = 'low' | 'medium' | 'high'

/**
 * 风险状态
 */
export type RiskStatus = 'identified' | 'monitoring' | 'mitigated' | 'closed'

/**
 * PI Planning接口
 */
export interface PIPlanning {
  // 基本信息
  id: string
  code: string
  name: string
  version: string

  // 时间范围
  startDate: string
  endDate: string
  sprints: string[] // Sprint ID列表

  // 工作项 ⭐ 重构
  workItemBacklog: WorkItem[] // 待规划的工作项 ⭐ 新增
  plannedWorkItems: string[] // 已规划的工作项ID列表 ⭐ 新增

  // 工作项统计
  workItemStatistics?: {
    total: number
    planned: number
    backlog: number
    byType: Record<WorkItemType, number>
    byPriority: Record<Priority, number>
  }

  // 团队计划
  teamPlans: TeamPlan[]

  // PI目标
  piObjectives: PIObjective[]

  // 依赖和风险
  dependencies: Dependency[]
  risks: Risk[]

  // 状态
  status: PIStatus

  // 度量
  metrics: PIMetrics

  // 元数据
  participants: string[]
  createdBy: string
  createdAt: string
  updatedAt: string
}

/**
 * 团队计划
 */
export interface TeamPlan {
  teamId: string
  teamName: string
  capacity: {
    totalSprints: number
    sprintCapacity: number
    totalCapacity: number
  }
  workItems: string[] // 工作项ID列表 ⭐ 新增
  totalEffort: number // 总工作量
  utilizationRate: number // 利用率
  sprints: SprintPlan[]
}

/**
 * Sprint计划
 */
export interface SprintPlan {
  sprintId: string
  sprintName: string
  workItems: string[] // 工作项ID列表 ⭐ 新增
  tasks: number // 任务数量
  committedPoints: number
}

/**
 * PI目标
 */
export interface PIObjective {
  id: string
  name: string
  description: string
  businessValue: number // 1-10
  teamId: string
  workItems: string[] // 关联的工作项ID列表 ⭐ 新增
  storyPoints: number
  status: 'planned' | 'in_progress' | 'completed'
  progress: number // 0-1
}

/**
 * 依赖关系
 */
export interface Dependency {
  id: string
  fromWorkItem: string // 依赖方工作项 ⭐ 更新
  fromTeam: string
  fromSprint: string
  toWorkItem: string // 被依赖方工作项 ⭐ 更新
  toTeam: string
  toSprint: string
  type: DependencyType
  description: string
  status: DependencyStatus
}

/**
 * 风险
 */
export interface Risk {
  id: string
  title: string
  description: string
  probability: RiskLevel
  impact: RiskLevel
  relatedWorkItems: string[] // 相关工作项 ⭐ 更新
  mitigation: string
  status: RiskStatus
  owner?: string
}

/**
 * PI度量指标
 */
export interface PIMetrics {
  totalWorkItems: number
  plannedWorkItems: number
  completedWorkItems: number
  totalEffort: number
  plannedEffort: number
  completedEffort: number
  predictability: number // 预测准确率
  avgVelocity: number
}

/**
 * PI Planning详情
 */
export interface PIPlanningDetail extends PIPlanning {
  // 工作项详细信息
  workItemDetails?: {
  id: string
    type: WorkItemType
    title: string
    priority: Priority
    status: string
    estimatedEffort: number
    moduleId?: string
    assignedTeamId?: string
    assignedSprintId?: string
  }[]

  // 团队详细信息
  teamDetails?: {
    teamId: string
    teamName: string
    capacity: number
    velocity: number
    members: number
    responsibleModules: string[]
  }[]

  // Sprint详细信息
  sprintDetails?: {
    sprintId: string
    sprintName: string
    startDate: string
    endDate: string
    teamId: string
    capacity: number
    workItemCount: number
  }[]
}

/**
 * PI Planning查询参数
 */
export interface PIPlanningQuery {
  status?: PIStatus | PIStatus[]
  year?: number
  quarter?: number
  keyword?: string
  page?: number
  pageSize?: number
  sortBy?: 'startDate' | 'totalWorkItems' | 'avgVelocity'
  sortOrder?: 'asc' | 'desc'
}

/**
 * PI Planning创建请求
 */
export interface CreatePIPlanningRequest {
  code: string
  name: string
  version: string
  startDate: string
  endDate: string
  numberOfSprints: number
  sprintLength: number // 天数
}

/**
 * PI Planning更新请求
 */
export interface UpdatePIPlanningRequest {
  name?: string
  version?: string
  startDate?: string
  endDate?: string
  status?: PIStatus
}

/**
 * 工作项规划请求
 */
export interface PlanWorkItemRequest {
  piId: string
  workItemId: string
  teamId: string
  sprintId: string
}

/**
 * 批量工作项规划请求
 */
export interface BatchPlanWorkItemsRequest {
  piId: string
  plans: {
    workItemId: string
    teamId: string
    sprintId: string
  }[]
}

/**
 * PI规划工作区数据
 */
export interface PIPlanningWorkspace {
  piId: string
  piName: string
  
  // 左侧：工作项Backlog
  backlog: {
    workItems: WorkItem[]
    statistics: {
      total: number
      byType: Record<WorkItemType, number>
      byPriority: Record<Priority, number>
    }
  }
  
  // 中间：团队和Sprint
  teams: {
    teamId: string
    teamName: string
    capacity: number
    responsibleModules: string[]
    sprints: {
      sprintId: string
      sprintName: string
      capacity: number
      workItems: string[]
      utilized: number
    }[]
  }[]
  
  // 右侧：依赖和风险
  dependencies: Dependency[]
  risks: Risk[]
}

/**
 * PI容量规划
 */
export interface PICapacityPlan {
  piId: string
  piName: string
  totalCapacity: number
  allocatedCapacity: number
  remainingCapacity: number
  teams: {
    teamId: string
    teamName: string
    totalCapacity: number
    allocatedCapacity: number
    utilizationRate: number
    overloaded: boolean
  }[]
  recommendations: {
    type: 'overload' | 'underload' | 'balance'
    teamId: string
    message: string
    suggestedAction: string
  }[]
}

/**
 * PI进度仪表板
 */
export interface PIProgressDashboard {
  piId: string
  piName: string
  startDate: string
  endDate: string
  daysElapsed: number
  daysRemaining: number
  currentSprint: number
  totalSprints: number
  
  workItems: {
    total: number
    completed: number
    inProgress: number
    notStarted: number
    completionRate: number
  }
  
  objectives: {
    total: number
    completed: number
    atRisk: number
  }
  
  teams: {
    teamId: string
    teamName: string
    velocity: number
    completionRate: number
    workItemsCompleted: number
    workItemsTotal: number
  }[]
  
  risks: {
    high: number
    medium: number
    low: number
  }
  
  dependencies: {
    total: number
    active: number
    blocked: number
    resolved: number
  }
  
  onTrack: boolean
  predictedCompletion: number // 预测完成率
}

/**
 * PI依赖网络
 */
export interface PIDependencyNetwork {
  piId: string
  nodes: {
    id: string // workItemId
    label: string // workItemTitle
    type: WorkItemType
    team: string
    sprint: string
  }[]
  edges: {
    from: string // fromWorkItem
    to: string // toWorkItem
    type: DependencyType
    status: DependencyStatus
  }[]
}

/**
 * PI风险热图
 */
export interface PIRiskHeatmap {
  piId: string
  risks: {
    id: string
    title: string
    probability: RiskLevel
    impact: RiskLevel
    score: number // probability * impact
    relatedWorkItems: string[]
    teams: string[]
    status: RiskStatus
  }[]
  matrix: {
    probability: RiskLevel
    impact: RiskLevel
    count: number
    riskIds: string[]
  }[]
}

/**
 * PI评审报告
 */
export interface PIReviewReport {
  piId: string
  piName: string
  startDate: string
  endDate: string
  
  summary: {
    totalWorkItems: number
    completedWorkItems: number
    completionRate: number
    totalObjectives: number
    achievedObjectives: number
    objectiveAchievementRate: number
  }
  
  teamPerformance: {
    teamId: string
    teamName: string
    velocity: number
    plannedVelocity: number
    completionRate: number
    defectRate: number
  }[]
  
  achievements: string[]
  challenges: string[]
  lessonsLearned: string[]
  
  nextSteps: string[]
}
