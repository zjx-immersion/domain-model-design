/**
 * Sprint类型定义
 * @description Sprint管理工作项和任务
 * @version 2.0
 */

import type { WorkItemType } from './work-item'
import type { TaskStatus } from './task'

/**
 * Sprint状态枚举
 */
export type SprintStatus = 'planned' | 'active' | 'completed'

/**
 * Sprint接口
 */
export interface Sprint {
  // 基本信息
  id: string
  name: string
  piId: string // 所属PI
  teamId: string // 所属团队
  team?: string // 团队名称

  // 时间
  startDate: string
  endDate: string
  duration: number // 天数

  // 目标
  sprintGoal: string

  // 产能和承诺
  capacity: number // 产能（SP）
  commitment: number // 承诺的SP
  completed: number // 完成的SP

  // 工作项和任务 ⭐ 重构
  workItems: string[] // 工作项列表 ⭐ 新增
  tasks: string[] // 任务列表（由工作项拆分而来）

  // 状态
  status: SprintStatus

  // 度量
  metrics: SprintMetrics
}

/**
 * Sprint度量指标
 */
export interface SprintMetrics {
  velocity: number // 速率
  completionRate: number // 完成率
  burndown: number[] // 燃尽数据
  defects: number // 缺陷数
  codeReviewTime: number // 代码评审时间（小时）
}

/**
 * Sprint详情（扩展信息）
 */
export interface SprintDetail extends Sprint {
  // 工作项详情列表
  workItemDetails?: {
    id: string
    type: WorkItemType
    title: string
    priority: string
    status: string
    estimatedEffort: number
    actualEffort?: number
    progress: number
    taskCount: number
    completedTaskCount: number
  }[]

  // 任务统计
  taskStatistics?: {
    total: number
    todo: number
    in_progress: number
    done: number
  }

  // 团队信息
  teamInfo?: {
    id: string
    name: string
    capacity: number
    members: number
  }

  // PI信息
  piInfo?: {
    id: string
    name: string
    startDate: string
    endDate: string
  }

  // 燃尽图数据
  burndownData?: {
    date: string
    remainingPoints: number
    idealPoints: number
    completedPoints: number
  }[]

  // 每日统计
  dailyStats?: {
    date: string
    completedTasks: number
    completedPoints: number
    addedDefects: number
    resolvedDefects: number
  }[]
}

/**
 * Sprint列表查询参数
 */
export interface SprintQuery {
  piId?: string
  teamId?: string
  status?: SprintStatus | SprintStatus[]
  keyword?: string
  page?: number
  pageSize?: number
  sortBy?: 'startDate' | 'velocity' | 'completionRate'
  sortOrder?: 'asc' | 'desc'
}

/**
 * Sprint统计信息
 */
export interface SprintStatistics {
  total: number
  byStatus: Record<SprintStatus, number>
  byTeam: Record<string, number>
  avgVelocity: number
  avgCompletionRate: number
  totalWorkItems: number
  totalTasks: number
}

/**
 * Sprint创建请求
 */
export interface CreateSprintRequest {
  name: string
  piId: string
  teamId: string
  startDate: string
  endDate: string
  sprintGoal: string
  capacity: number
}

/**
 * Sprint更新请求
 */
export interface UpdateSprintRequest {
  name?: string
  startDate?: string
  endDate?: string
  sprintGoal?: string
  capacity?: number
  status?: SprintStatus
}

/**
 * Sprint规划请求
 */
export interface PlanSprintRequest {
  sprintId: string
  workItems: string[] // 要添加的工作项ID列表
}

/**
 * Sprint工作项添加请求
 */
export interface AddWorkItemToSprintRequest {
  sprintId: string
  workItemIds: string[]
}

/**
 * Sprint工作项移除请求
 */
export interface RemoveWorkItemFromSprintRequest {
  sprintId: string
  workItemIds: string[]
}

/**
 * Sprint看板数据
 */
export interface SprintBoard {
  sprintId: string
  sprintName: string
  columns: {
    status: TaskStatus
    label: string
    tasks: {
      id: string
      title: string
      workItemId: string
      workItemType: WorkItemType
      workItemTitle: string
      assignee: string
      estimatedHours: number
      priority: string
    }[]
    count: number
    totalHours: number
  }[]
}

/**
 * Sprint容量计划
 */
export interface SprintCapacityPlan {
  sprintId: string
  sprintName: string
  teamId: string
  teamName: string
  totalCapacity: number
  members: {
    memberId: string
    memberName: string
    capacity: number
    allocatedHours: number
    availableHours: number
    tasks: {
      taskId: string
      taskTitle: string
      estimatedHours: number
    }[]
  }[]
  teamUtilization: number
}

/**
 * Sprint燃尽图配置
 */
export interface SprintBurndownConfig {
  sprintId: string
  startDate: string
  endDate: string
  totalPoints: number
  workingDays: number
}

/**
 * Sprint回顾会议记录
 */
export interface SprintRetrospective {
  sprintId: string
  sprintName: string
  date: string
  participants: string[]
  whatWentWell: string[]
  whatNeedsImprovement: string[]
  actionItems: {
    id: string
    description: string
    owner: string
    dueDate: string
    status: 'todo' | 'in_progress' | 'done'
  }[]
  velocity: number
  completionRate: number
  teamMood: number // 1-5
}

/**
 * Sprint进度报告
 */
export interface SprintProgressReport {
  sprintId: string
  sprintName: string
  teamId: string
  teamName: string
  startDate: string
  endDate: string
  daysElapsed: number
  daysRemaining: number
  workItems: {
    total: number
    completed: number
    inProgress: number
    notStarted: number
  }
  tasks: {
    total: number
    completed: number
    inProgress: number
    notStarted: number
  }
  points: {
    committed: number
    completed: number
    remaining: number
    completionRate: number
  }
  risks: {
    id: string
    description: string
    impact: 'high' | 'medium' | 'low'
    mitigation: string
  }[]
  blockers: {
    id: string
    description: string
    affectedTasks: string[]
    resolver: string
  }[]
  onTrack: boolean
}

/**
 * Sprint目标
 */
export interface SprintGoal {
  id: string
  sprintId: string
  description: string
  successCriteria: string[]
  relatedWorkItems: string[]
  achieved: boolean
}

/**
 * Sprint事件
 */
export interface SprintEvent {
  id: string
  sprintId: string
  type: 'planning' | 'daily_standup' | 'review' | 'retrospective'
  date: string
  duration: number // 分钟
  participants: string[]
  notes?: string
  actionItems?: {
    description: string
    owner: string
    status: string
  }[]
}

