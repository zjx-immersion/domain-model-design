/**
 * 工作项类型定义
 * @description 统一管理需求、Bugfix、技术债等所有工作项
 * @version 2.0
 */

/**
 * 工作项类型枚举
 */
export type WorkItemType =
  | 'module_requirement' // 模块需求
  | 'bugfix' // 缺陷修复
  | 'tech_debt' // 技术债
  | 'non_functional' // 非功能需求（性能、安全等）
  | 'optimization' // 优化改进
  | 'research' // 技术调研

/**
 * 工作项状态枚举
 */
export type WorkItemStatus =
  | 'backlog' // 待办
  | 'planned' // 已规划
  | 'in_progress' // 进行中
  | 'completed' // 已完成
  | 'cancelled' // 已取消

/**
 * 工作项来源类型
 */
export type WorkItemSourceType =
  | 'requirement' // 来自需求
  | 'defect' // 来自缺陷
  | 'tech_debt' // 来自技术债
  | 'nfr' // 来自非功能需求
  | 'optimization' // 来自优化建议
  | 'research' // 来自调研需求

/**
 * 优先级枚举
 */
export type Priority = 'P0' | 'P1' | 'P2' | 'P3'

/**
 * 工作项接口
 */
export interface WorkItem {
  // 基本信息
  id: string
  type: WorkItemType
  title: string
  description: string
  priority: Priority
  status: WorkItemStatus

  // 来源关联
  sourceType: WorkItemSourceType
  sourceId?: string // 来源实体ID
  moduleId?: string // 关联的模块
  requirementId?: string // 关联的需求（如果是需求类）
  defectId?: string // 关联的缺陷（如果是Bugfix）

  // 分配信息
  assignedTeamId?: string // 分配的团队ID
  assignedTeam?: string // 分配的团队名称
  assignedSprintId?: string // 分配的Sprint ID
  assignedSprint?: string // 分配的Sprint名称

  // 工作量
  estimatedEffort: number // 估算工作量（小时或SP）
  actualEffort?: number // 实际工作量

  // 任务拆分
  tasks: string[] // 拆分的Task ID列表
  taskCount: number // 任务数量
  completedTaskCount: number // 完成的任务数量

  // 依赖和阻塞
  dependencies?: string[] // 依赖的工作项ID列表
  blockedBy?: string[] // 被哪些工作项阻塞

  // 元数据
  createdBy: string
  createdAt: string
  updatedAt: string
  completedAt?: string
}

/**
 * 工作项详情（扩展信息）
 */
export interface WorkItemDetail extends WorkItem {
  // 关联实体详情
  module?: {
    id: string
    name: string
    code: string
  }
  requirement?: {
    id: string
    title: string
    type: string
  }
  defect?: {
    id: string
    title: string
    severity: string
  }

  // 团队信息
  team?: {
    id: string
    name: string
    capacity: number
  }

  // Sprint信息
  sprint?: {
    id: string
    name: string
    startDate: string
    endDate: string
  }

  // 任务列表详情
  taskDetails?: {
    id: string
    title: string
    status: string
    assignee: string
    estimatedHours: number
    actualHours?: number
  }[]

  // 进度信息
  progress: number // 0-1之间的进度值
}

/**
 * 工作项列表查询参数
 */
export interface WorkItemQuery {
  type?: WorkItemType | WorkItemType[]
  status?: WorkItemStatus | WorkItemStatus[]
  priority?: Priority | Priority[]
  teamId?: string
  sprintId?: string
  moduleId?: string
  keyword?: string
  page?: number
  pageSize?: number
  sortBy?: 'priority' | 'createdAt' | 'estimatedEffort' | 'progress'
  sortOrder?: 'asc' | 'desc'
}

/**
 * 工作项统计信息
 */
export interface WorkItemStatistics {
  total: number
  byType: Record<WorkItemType, number>
  byPriority: Record<Priority, number>
  byStatus: Record<WorkItemStatus, number>
  byTeam: Record<string, number>
  totalEffort: {
    estimated: number
    actual: number
  }
}

/**
 * 工作项创建请求
 */
export interface CreateWorkItemRequest {
  type: WorkItemType
  title: string
  description: string
  priority: Priority
  sourceType: WorkItemSourceType
  sourceId?: string
  moduleId?: string
  requirementId?: string
  defectId?: string
  estimatedEffort: number
}

/**
 * 工作项更新请求
 */
export interface UpdateWorkItemRequest {
  title?: string
  description?: string
  priority?: Priority
  status?: WorkItemStatus
  assignedTeamId?: string
  assignedSprintId?: string
  estimatedEffort?: number
  actualEffort?: number
}

/**
 * 工作项分配请求
 */
export interface AssignWorkItemRequest {
  workItemIds: string[]
  teamId: string
  sprintId?: string
}

/**
 * 工作项拆分为任务的请求
 */
export interface SplitWorkItemToTasksRequest {
  workItemId: string
  tasks: {
    title: string
    description: string
    estimatedHours: number
    assigneeId?: string
  }[]
}

/**
 * 工作项类型配置
 */
export interface WorkItemTypeConfig {
  type: WorkItemType
  label: string
  description: string
  icon: string
  color: string
  allowedSourceTypes: WorkItemSourceType[]
}

/**
 * 工作项类型配置列表
 */
export const WORK_ITEM_TYPE_CONFIGS: WorkItemTypeConfig[] = [
  {
    type: 'module_requirement',
    label: '模块需求',
    description: '来自需求分解的模块级需求',
    icon: 'Document',
    color: '#409EFF',
    allowedSourceTypes: ['requirement'],
  },
  {
    type: 'bugfix',
    label: '缺陷修复',
    description: '修复已发现的软件缺陷',
    icon: 'Warning',
    color: '#F56C6C',
    allowedSourceTypes: ['defect'],
  },
  {
    type: 'tech_debt',
    label: '技术债',
    description: '需要偿还的技术债务',
    icon: 'Tools',
    color: '#E6A23C',
    allowedSourceTypes: ['tech_debt'],
  },
  {
    type: 'non_functional',
    label: '非功能需求',
    description: '性能、安全、可靠性等非功能需求',
    icon: 'Lightning',
    color: '#67C23A',
    allowedSourceTypes: ['nfr'],
  },
  {
    type: 'optimization',
    label: '优化改进',
    description: '系统优化和持续改进',
    icon: 'Sunny',
    color: '#909399',
    allowedSourceTypes: ['optimization'],
  },
  {
    type: 'research',
    label: '技术调研',
    description: '技术选型和可行性研究',
    icon: 'Reading',
    color: '#606266',
    allowedSourceTypes: ['research'],
  },
]

/**
 * 工作项状态配置
 */
export interface WorkItemStatusConfig {
  status: WorkItemStatus
  label: string
  description: string
  color: string
  icon: string
}

/**
 * 工作项状态配置列表
 */
export const WORK_ITEM_STATUS_CONFIGS: WorkItemStatusConfig[] = [
  {
    status: 'backlog',
    label: '待办',
    description: '已创建，待规划',
    color: '#909399',
    icon: 'Box',
  },
  {
    status: 'planned',
    label: '已规划',
    description: '已分配到团队和Sprint',
    color: '#409EFF',
    icon: 'Calendar',
  },
  {
    status: 'in_progress',
    label: '进行中',
    description: '团队正在执行',
    color: '#E6A23C',
    icon: 'Loading',
  },
  {
    status: 'completed',
    label: '已完成',
    description: '所有任务已完成',
    color: '#67C23A',
    icon: 'CircleCheck',
  },
  {
    status: 'cancelled',
    label: '已取消',
    description: '不再需要执行',
    color: '#F56C6C',
    icon: 'CircleClose',
  },
]

/**
 * 优先级配置
 */
export interface PriorityConfig {
  priority: Priority
  label: string
  description: string
  color: string
  weight: number
}

/**
 * 优先级配置列表
 */
export const PRIORITY_CONFIGS: PriorityConfig[] = [
  {
    priority: 'P0',
    label: 'P0',
    description: '最高优先级，阻塞性问题',
    color: '#F56C6C',
    weight: 4,
  },
  {
    priority: 'P1',
    label: 'P1',
    description: '高优先级，重要功能',
    color: '#E6A23C',
    weight: 3,
  },
  {
    priority: 'P2',
    label: 'P2',
    description: '中优先级，常规功能',
    color: '#409EFF',
    weight: 2,
  },
  {
    priority: 'P3',
    label: 'P3',
    description: '低优先级，优化改进',
    color: '#909399',
    weight: 1,
  },
]

