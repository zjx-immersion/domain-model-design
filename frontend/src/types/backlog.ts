/**
 * Backlog 管理类型定义
 * 包含项目待办(ProjectBacklog)和团队待办(TeamBacklog)
 */

import type { WorkItem } from './work-item'

// ============================================================================
// 项目待办 (ProjectBacklog)
// ============================================================================

/**
 * 项目待办
 * PI Planning 的输出，包含所有工作项
 */
export interface ProjectBacklog {
  // 基本信息
  id: string                    // Backlog ID
  name: string                  // Backlog 名称
  description?: string          // 描述
  
  // 关联关系
  domainProjectId: string       // 所属领域项目
  piPlanningId: string          // 来源 PI Planning
  piName?: string               // PI 名称（冗余字段）
  
  // 工作项
  workItemIds: string[]         // 工作项ID列表
  totalWorkItems: number        // 总工作项数
  assignedWorkItems: number     // 已分配数
  unassignedWorkItems: number   // 未分配数
  completedWorkItems: number    // 已完成数
  
  // 工作量统计
  totalStoryPoints: number      // 总故事点
  assignedStoryPoints: number   // 已分配故事点
  completedStoryPoints: number  // 已完成故事点
  
  // 状态
  status: 'active' | 'completed' | 'archived'
  
  // 元数据
  createdAt: string
  updatedAt: string
  createdBy?: string
  updatedBy?: string
}

// ============================================================================
// 团队待办 (TeamBacklog)
// ============================================================================

/**
 * 团队待办
 * 团队从项目待办拉取的工作项池
 */
export interface TeamBacklog {
  // 基本信息
  id: string                    // Team Backlog ID
  name: string                  // Backlog 名称
  description?: string          // 描述
  
  // 关联关系
  teamId: string                // 所属团队
  teamName?: string             // 团队名称（冗余字段）
  domainProjectId: string       // 所属领域项目
  projectBacklogId: string      // 来源 Project Backlog
  
  // 工作项
  workItemIds: string[]         // 工作项ID列表
  priorityQueue: string[]       // 工作项优先级排序（工作项ID）
  
  // 统计
  totalWorkItems: number        // 总工作项数
  todoWorkItems: number         // 待开始数
  inProgressWorkItems: number   // 进行中数
  completedWorkItems: number    // 已完成数
  
  // 工作量统计
  totalStoryPoints: number      // 总故事点
  completedStoryPoints: number  // 已完成故事点
  remainingStoryPoints: number  // 剩余故事点
  
  // 容量
  teamCapacity: number          // 团队容量（故事点/迭代）
  remainingCapacity: number     // 剩余容量
  utilizationRate: number       // 利用率 0-100
  
  // 状态
  status: 'active' | 'archived'
  
  // 元数据
  createdAt: string
  updatedAt: string
  createdBy?: string
  updatedBy?: string
}

// ============================================================================
// Backlog 工作项 (BacklogItem)
// ============================================================================

/**
 * Backlog 工作项视图
 * 扩展 WorkItem，添加 Backlog 特定信息
 */
export interface BacklogItem extends WorkItem {
  // Backlog 特定信息
  priority: number              // 优先级（数字越小优先级越高）
  assignedToBacklog?: string    // 分配到的 Backlog ID
  assignedToSprint?: string     // 分配到的 Sprint ID
  estimatedSprintNo?: number    // 预计 Sprint 编号
  
  // 依赖信息
  blockedBy?: string[]          // 被哪些工作项阻塞
  blocking?: string[]           // 阻塞哪些工作项
  
  // 团队信息
  assignedTeamId?: string       // 分配的团队ID
  assignedTeamName?: string     // 分配的团队名称
}

// ============================================================================
// Backlog 统计
// ============================================================================

/**
 * Backlog 统计信息
 */
export interface BacklogStats {
  totalWorkItems: number
  assignedWorkItems: number
  unassignedWorkItems: number
  completedWorkItems: number
  totalStoryPoints: number
  completedStoryPoints: number
  
  // 按状态分组
  byStatus: {
    todo: number
    inProgress: number
    review: number
    done: number
  }
  
  // 按优先级分组
  byPriority: {
    p0: number
    p1: number
    p2: number
    p3: number
  }
  
  // 按团队分组（仅 ProjectBacklog）
  byTeam?: {
    [teamId: string]: {
      teamName: string
      workItemCount: number
      storyPoints: number
    }
  }
}

// ============================================================================
// Backlog 操作
// ============================================================================

/**
 * 工作项分配参数
 */
export interface AssignWorkItemsParams {
  workItemIds: string[]         // 工作项ID列表
  targetBacklogId: string       // 目标 Backlog ID
  targetTeamId?: string         // 目标团队ID（可选）
  priority?: number             // 优先级（可选）
}

/**
 * 工作项拉取参数
 */
export interface PullWorkItemsParams {
  workItemIds: string[]         // 工作项ID列表
  sourceBacklogId: string       // 来源 Backlog ID
  targetSprintId: string        // 目标 Sprint ID
  checkCapacity?: boolean       // 是否检查容量
}

/**
 * 优先级调整参数
 */
export interface ReorderWorkItemsParams {
  backlogId: string             // Backlog ID
  workItemId: string            // 工作项ID
  newPosition: number           // 新位置（0-based）
}

// ============================================================================
// Backlog 查询
// ============================================================================

/**
 * Backlog 查询参数
 */
export interface BacklogQueryParams {
  domainProjectId?: string      // 领域项目筛选
  teamId?: string               // 团队筛选
  status?: string[]             // 状态筛选
  keyword?: string              // 关键词搜索
  page?: number
  pageSize?: number
}

/**
 * 工作项查询参数（在 Backlog 上下文中）
 */
export interface BacklogWorkItemQueryParams {
  backlogId: string             // Backlog ID
  status?: string[]             // 状态筛选
  priority?: string[]           // 优先级筛选
  moduleId?: string             // 模块筛选
  assignedTeamId?: string       // 团队筛选
  keyword?: string              // 关键词搜索
  page?: number
  pageSize?: number
  sortBy?: 'priority' | 'storyPoints' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
}

// ============================================================================
// Backlog 视图
// ============================================================================

/**
 * Backlog 看板列
 */
export interface BacklogColumn {
  id: string
  title: string
  workItems: BacklogItem[]
  count: number
  storyPoints: number
}

/**
 * Backlog 看板视图
 */
export interface BacklogBoardView {
  columns: BacklogColumn[]
  totalWorkItems: number
  totalStoryPoints: number
}

/**
 * 按团队分组的视图（ProjectBacklog）
 */
export interface BacklogByTeamView {
  teams: Array<{
    teamId: string
    teamName: string
    workItems: BacklogItem[]
    totalWorkItems: number
    totalStoryPoints: number
    capacity: number
    utilizationRate: number
  }>
}

// ============================================================================
// API 响应类型
// ============================================================================

/**
 * Backlog 列表响应
 */
export interface BacklogListResponse {
  data: Array<ProjectBacklog | TeamBacklog>
  total: number
  page: number
  pageSize: number
}

/**
 * Backlog 详情响应
 */
export interface BacklogDetailResponse {
  backlog: ProjectBacklog | TeamBacklog
  workItems: BacklogItem[]
  stats: BacklogStats
  relatedData?: {
    domainProject?: any
    piPlanning?: any
    team?: any
    sprints?: any[]
  }
}

/**
 * 工作项操作响应
 */
export interface BacklogOperationResponse {
  success: boolean
  message: string
  affectedWorkItems: string[]
  updatedBacklog?: ProjectBacklog | TeamBacklog
}

