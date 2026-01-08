/**
 * 需求管理类型定义
 */

// 用户需求
export interface UserRequirement {
  id: string
  code: string
  title: string
  description: string
  source: string
  sourceType: string
  category: string
  priority: 'P0' | 'P1' | 'P2'
  status: 'planned' | 'in_review' | 'in_development' | 'completed'
  owner: string
  ownerAvatar: string
  stakeholders: string[]
  productLine: string
  product: string
  version: string
  featureRequirements: string[]
  featureCount: number
  progress: number
  estimatedWorkload: number
  actualWorkload: number
  createdAt: string
  startedAt?: string
  expectedCompleteAt: string
  completedAt?: string
  tags: string[]
  riskLevel: 'low' | 'medium' | 'high'
  dependencies: string[]
  acceptanceCriteria: string[]
  testCases: number
  defects: number
  changeHistory: ChangeHistoryItem[]
}

// 特性需求
export interface FeatureRequirement {
  id: string
  code: string
  title: string
  description: string
  userRequirementId: string
  userRequirementTitle: string
  category: string
  priority: 'P0' | 'P1' | 'P2'
  status: 'planned' | 'in_development' | 'in_review' | 'completed'
  owner: string
  team: string
  moduleRequirements: string[]
  moduleCount: number
  progress: number
  estimatedWorkload: number
  actualWorkload: number
  createdAt: string
  startedAt?: string
  expectedCompleteAt: string
  completedAt?: string
  tags: string[]
  dependencies: string[]
  acceptanceCriteria: string[]
  testCases: number
  defects: number
}

// 模块需求
export interface ModuleRequirement {
  id: string
  code: string
  title: string
  description: string
  featureRequirementId: string
  featureRequirementTitle: string
  userRequirementId: string
  module: string
  moduleName: string
  category: string
  priority: 'P0' | 'P1' | 'P2'
  status: 'planned' | 'in_development' | 'in_review' | 'completed'
  owner: string
  estimatedWorkload: number
  actualWorkload: number
  progress: number
  createdAt: string
  startedAt?: string
  expectedCompleteAt: string
  stories: string[]
  storyCount: number
  tasks: string[]
  taskCount: number
  completedTasks: number
  testCases: number
  defects: number
  codeReviews: number
  tags: string[]
}

// 需求变更
export interface RequirementChange {
  id: string
  code: string
  title: string
  description: string
  changeType: 'scope_change' | 'technical_solution' | 'schedule_change' | 'requirement_change' | 'ux_optimization' | 'security_enhancement'
  changeReason: string
  targetType: 'user_requirement' | 'feature_requirement' | 'module_requirement'
  targetId: string
  targetTitle: string
  priority: 'P0' | 'P1' | 'P2'
  status: 'pending' | 'in_review' | 'approved' | 'rejected' | 'cancelled'
  impact: ChangeImpact
  proposer: string
  proposerRole: string
  proposedAt: string
  reviewer?: string
  reviewedAt?: string
  approver?: string
  approvedAt?: string
  rejectedAt?: string
  rejectedBy?: string
  rejectionReason?: string
  implementer?: string
  implementStatus: 'pending' | 'planned' | 'in_progress' | 'completed' | 'cancelled'
  implementProgress: number
  completedAt?: string
  expectedCompleteAt?: string
  attachments: Attachment[]
  comments: Comment[]
  changeHistory: ChangeHistoryItem[]
}

export interface ChangeImpact {
  affectedUserRequirements: number
  affectedFeatureRequirements: number
  affectedModuleRequirements: number
  affectedStories: number
  estimatedWorkload: number
  scheduleImpact: number
}

export interface ChangeHistoryItem {
  date: string
  type?: string
  action: string
  operator: string
  description?: string
}

export interface Attachment {
  name: string
  url: string
  size: string
}

export interface Comment {
  author: string
  content: string
  createdAt: string
}

// 需求统计
export interface RequirementStatistics {
  totalCount: number
  byStatus: Record<string, number>
  byPriority: Record<string, number>
  avgProgress: number
  avgWorkload: number
}

