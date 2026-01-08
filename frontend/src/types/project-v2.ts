/**
 * 项目管理类型定义 v2
 * 包含车型项目和领域项目
 */

// ============================================================================
// 基础类型
// ============================================================================

/**
 * 项目状态
 */
export type ProjectStatus = 'planned' | 'active' | 'on-hold' | 'completed' | 'cancelled'

/**
 * 里程碑
 */
export interface Milestone {
  id: string
  name: string
  targetDate: string
  actualDate?: string
  status: 'pending' | 'achieved' | 'missed'
  deliverables: string[]  // 交付物
}

/**
 * 项目目标
 */
export interface ProjectObjective {
  id: string
  description: string       // 目标描述
  businessValue: number     // 业务价值 1-10
  stretch: boolean          // 是否为拉伸目标
  progress: number          // 完成度 0-100
  kpiMetrics?: string[]     // KPI 指标
}

/**
 * 项目版本规划
 */
export interface ProjectVersion {
  id: string
  productId: string         // 产品ID
  productName: string       // 产品名称
  version: string           // 版本号，如 "V3.1"
  targetPI: string          // 目标 PI
  features: string[]        // 计划特性
  status: 'planned' | 'in-progress' | 'completed'
  startDate?: string        // 开始日期
  endDate?: string          // 结束日期
}

// ============================================================================
// 车型项目 (VehicleProject)
// ============================================================================

/**
 * 车型项目
 * 整车级别的项目，涉及多个技术领域的集成和交付
 */
export interface VehicleProject {
  // 基本信息
  id: string                    // 车型项目ID，如 "VP-2025-001"
  code: string                  // 项目代码，如 "2025-ICV"
  name: string                  // 项目名称，如 "2025款智能驾驶车型"
  description: string           // 项目描述
  
  // 组织信息
  companyId: string             // 所属公司
  businessUnitId: string        // 所属事业部
  owner: string                 // 项目负责人
  sponsor: string               // 项目发起人
  teamIds?: string[]            // 参与团队
  
  // 时间信息
  startDate: string             // 开始日期
  targetDate: string            // 目标交付日期
  actualDate?: string           // 实际交付日期
  
  // 关联关系
  domainProjectIds: string[]    // 包含的领域项目
  
  // 目标与范围
  objectives: string[]          // 项目目标
  scope: string                 // 项目范围
  
  // 里程碑
  milestones: Milestone[]       // 项目里程碑
  
  // 状态
  status: ProjectStatus         // 项目状态
  phase: string                 // 项目阶段：需求、开发、测试、验收
  
  // 度量
  budget?: number               // 预算
  progress: number              // 完成度 0-100
  completedDomainProjects?: number  // 完成的领域项目数
  totalDomainProjects?: number      // 总领域项目数
  
  // 风险和问题
  risks?: string[]              // 风险列表
  issues?: string[]             // 问题列表
  
  // 元数据
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy: string
}

// ============================================================================
// 领域项目 (DomainProject)
// ============================================================================

/**
 * 领域项目
 * 特定技术领域的项目，如智能驾驶项目、智能座舱项目
 */
export interface DomainProject {
  // 基本信息
  id: string                    // 领域项目ID，如 "DP-AD-2025-Q1"
  code: string                  // 项目代码，如 "AD-V31"
  name: string                  // 项目名称，如 "智能驾驶 V3.1 项目"
  description: string           // 项目描述
  domain: string                // 技术领域，如 "智能驾驶"
  
  // 组织信息
  vehicleProjectId: string      // 所属车型项目
  departmentId: string          // 负责部门
  owner: string                 // 项目经理
  teamIds: string[]             // 参与的团队
  
  // 时间信息
  startDate: string             // 开始日期
  endDate: string               // 结束日期
  
  // 关联关系
  productIds: string[]          // 包含的产品
  piPlanningIds: string[]       // 关联的 PI Planning
  backlogIds?: string[]         // 关联的 Backlog
  
  // 版本规划
  projectVersions: ProjectVersion[]  // 项目版本规划
  
  // 目标与范围
  objectives: ProjectObjective[]     // 项目目标
  scope: string                      // 项目范围
  
  // 状态
  status: ProjectStatus         // 项目状态
  phase?: string                // 项目阶段
  
  // 度量
  totalPIs: number              // 计划 PI 数量
  completedPIs: number          // 完成 PI 数量
  progress: number              // 完成度 0-100
  
  // 容量和工作量
  totalStoryPoints?: number     // 总故事点
  completedStoryPoints?: number // 完成故事点
  remainingStoryPoints?: number // 剩余故事点
  
  // 统计信息
  stats?: {
    totalWorkItems: number      // 总工作项数
    completedWorkItems: number  // 完成工作项数
    totalFeatures: number       // 总特性数
    completedFeatures: number   // 完成特性数
  }
  
  // 元数据
  createdAt: string
  updatedAt: string
  createdBy?: string
  updatedBy?: string
}

// ============================================================================
// 辅助类型
// ============================================================================

/**
 * 项目摘要信息（用于列表展示）
 */
export interface ProjectSummary {
  id: string
  code: string
  name: string
  domain?: string
  status: ProjectStatus
  progress: number
  startDate: string
  endDate?: string
  owner: string
}

/**
 * 项目统计信息
 */
export interface ProjectStats {
  totalProjects: number
  activeProjects: number
  completedProjects: number
  onHoldProjects: number
  cancelledProjects: number
  averageProgress: number
}

/**
 * 项目查询参数
 */
export interface ProjectQueryParams {
  keyword?: string              // 关键词搜索
  status?: ProjectStatus[]      // 状态筛选
  domain?: string[]             // 领域筛选
  owner?: string                // 负责人筛选
  vehicleProjectId?: string     // 车型项目筛选
  startDate?: string            // 开始日期范围
  endDate?: string              // 结束日期范围
  page?: number                 // 页码
  pageSize?: number             // 每页数量
  sortBy?: string               // 排序字段
  sortOrder?: 'asc' | 'desc'    // 排序方向
}

/**
 * 项目创建/更新参数
 */
export interface VehicleProjectInput {
  code: string
  name: string
  description: string
  companyId: string
  businessUnitId: string
  owner: string
  sponsor: string
  startDate: string
  targetDate: string
  objectives: string[]
  scope: string
  domainProjectIds?: string[]
}

export interface DomainProjectInput {
  code: string
  name: string
  description: string
  domain: string
  vehicleProjectId: string
  departmentId: string
  owner: string
  startDate: string
  endDate: string
  productIds: string[]
  teamIds: string[]
  objectives: ProjectObjective[]
  scope: string
}

// ============================================================================
// API 响应类型
// ============================================================================

/**
 * 项目列表响应
 */
export interface ProjectListResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}

/**
 * 项目详情响应
 */
export interface ProjectDetailResponse<T> {
  data: T
  relatedData?: {
    domainProjects?: DomainProject[]
    products?: any[]
    teams?: any[]
    piPlannings?: any[]
  }
}

