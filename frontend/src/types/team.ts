/**
 * 团队类型定义
 * @description 团队与模块责任绑定
 * @version 2.0
 */

/**
 * 团队成员接口
 */
export interface TeamMember {
  id: string
  name: string
  role: string
  email: string
  capacity: number // 个人产能（小时/Sprint）
  avatar?: string
}

/**
 * 团队产能接口
 */
export interface TeamCapacity {
  sprintCapacity: number // 每Sprint产能（SP）
  velocity: number // 历史速率
  utilizationRate: number // 利用率（0-1）
}

/**
 * 模块详情
 */
export interface ModuleDetail {
  id: string
  name: string
  code?: string
}

/**
 * 团队度量指标
 */
export interface TeamMetrics {
  totalMembers: number
  avgVelocity: number // 平均速率
  completionRate: number // 完成率
  defectRate: number // 缺陷率
}

/**
 * 团队接口
 */
export interface Team {
  // 基本信息
  id: string
  name: string
  code: string
  description?: string

  // 成员
  members: TeamMember[]

  // 模块责任 ⭐ 新增
  responsibleModules: string[] // 负责的模块ID列表
  moduleDetails?: ModuleDetail[] // 模块详情

  // 产能 ⭐ 新增
  capacity: TeamCapacity

  // 当前工作 ⭐ 新增
  currentPI: string // 当前PI
  currentSprint: string // 当前Sprint
  workItems: string[] // 当前工作项列表

  // 元数据
  owner: string
  createdAt: string

  // 度量指标
  metrics?: TeamMetrics
}

/**
 * 团队详情（扩展信息）
 */
export interface TeamDetail extends Team {
  // 模块详细信息
  moduleList?: {
    id: string
    name: string
    code: string
    currentWorkItems: number
    backlogWorkItems: number
    responsiblePerson?: string
  }[]

  // 工作项详情
  workItemDetails?: {
    id: string
    type: string
    title: string
    priority: string
    status: string
    estimatedEffort: number
    progress: number
  }[]

  // PI信息
  piInfo?: {
    id: string
    name: string
    startDate: string
    endDate: string
    totalCapacity: number
    committed: number
    completed: number
  }

  // Sprint信息
  sprintInfo?: {
    id: string
    name: string
    startDate: string
    endDate: string
    capacity: number
    committed: number
    completed: number
  }

  // 成员详细信息
  memberDetails?: {
    id: string
    name: string
    role: string
    email: string
    capacity: number
    currentTasks: number
    completedTasks: number
    workload: number
  }[]
}

/**
 * 团队列表查询参数
 */
export interface TeamQuery {
  keyword?: string
  moduleId?: string // 按负责的模块筛选
  piId?: string // 按PI筛选
  page?: number
  pageSize?: number
  sortBy?: 'name' | 'velocity' | 'utilizationRate'
  sortOrder?: 'asc' | 'desc'
}

/**
 * 团队统计信息
 */
export interface TeamStatistics {
  totalTeams: number
  totalMembers: number
  totalModules: number
  totalCapacity: number
  avgVelocity: number
  avgUtilization: number
}

/**
 * 团队创建请求
 */
export interface CreateTeamRequest {
  name: string
  code: string
  description?: string
  owner: string
  responsibleModules?: string[]
}

/**
 * 团队更新请求
 */
export interface UpdateTeamRequest {
  name?: string
  description?: string
  owner?: string
  responsibleModules?: string[]
}

/**
 * 团队成员添加请求
 */
export interface AddTeamMemberRequest {
  teamId: string
  members: {
    id: string
    name: string
    role: string
    email: string
    capacity: number
  }[]
}

/**
 * 团队模块配置请求
 */
export interface ConfigTeamModulesRequest {
  teamId: string
  moduleIds: string[]
  action: 'add' | 'remove' | 'replace'
}

/**
 * 团队产能配置请求
 */
export interface ConfigTeamCapacityRequest {
  teamId: string
  sprintCapacity: number
  velocity?: number
}

/**
 * 团队工作负载
 */
export interface TeamWorkload {
  teamId: string
  teamName: string
  capacity: number // 总产能
  committed: number // 已承诺的工作量
  available: number // 可用产能
  utilizationRate: number // 利用率
  workItems: {
    backlog: number
    planned: number
    inProgress: number
    completed: number
  }
  overloaded: boolean // 是否超载
}

/**
 * 团队-模块矩阵
 */
export interface TeamModuleMatrix {
  teams: {
    id: string
    name: string
  }[]
  modules: {
    id: string
    name: string
  }[]
  matrix: {
    teamId: string
    moduleId: string
    responsible: boolean // 是否负责
    workItemCount: number // 工作项数量
  }[]
}

/**
 * 团队速率趋势
 */
export interface TeamVelocityTrend {
  teamId: string
  teamName: string
  data: {
    sprintId: string
    sprintName: string
    plannedPoints: number
    completedPoints: number
    velocity: number
  }[]
  avgVelocity: number
  trend: 'up' | 'down' | 'stable'
}

/**
 * 团队协作关系
 */
export interface TeamCollaboration {
  fromTeam: string
  toTeam: string
  dependencies: {
    workItemId: string
    workItemTitle: string
    type: string
    status: string
  }[]
  collaborationCount: number
}

