/**
 * 版本管理和特性包管理类型定义
 */

// 产品版本
export interface ProductRelease {
  id: string
  code: string                      // 版本编号，如 "v3.2"
  name: string                      // 版本名称，如 "春季版"
  productId: string
  productName: string
  
  type: 'major' | 'minor' | 'patch' | 'milestone'
  status: 'planning' | 'development' | 'testing' | 'released' | 'deprecated'
  
  piId?: string
  piName?: string
  
  baselineId?: string
  baselineName?: string
  
  features: FeatureInRelease[]
  newFeatures: string[]
  updatedFeatures: string[]
  deprecatedFeatures: string[]
  
  requirements: RequirementInRelease[]
  
  plannedStartDate: string
  plannedReleaseDate: string
  actualStartDate?: string
  actualReleaseDate?: string
  
  progress: number
  completedRequirements: number
  totalRequirements: number
  testCoverage: number
  defectCount: number
  
  changelog?: string
  releaseNotes?: string
  knownIssues: KnownIssue[]
  
  owner: string
  ownerName: string
  team: string[]
  
  tags: string[]
  createdAt: string
  updatedAt: string
  createdBy: string
}

export interface FeatureInRelease {
  featureId: string
  featureName: string
  featureCode: string
  status: 'new' | 'updated' | 'unchanged' | 'deprecated'
  changes?: string
  version?: string
  requirementCount?: number
  progress?: number
}

export interface RequirementInRelease {
  requirementId: string
  requirementCode: string
  requirementTitle: string
  type: 'user' | 'feature' | 'module'
  status: 'planned' | 'in_progress' | 'completed'
  priority: string
  assignedTo?: string
  sprintId?: string
  sprintName?: string
}

export interface KnownIssue {
  id: string
  title: string
  severity: 'critical' | 'major' | 'minor'
  description: string
  workaround?: string
}

// 特性包（基线）
export interface FeatureBaseline {
  id: string
  code: string
  name: string
  description: string
  
  productId: string
  productName: string
  releaseId?: string
  releaseName?: string
  piId?: string
  piName?: string
  
  type: 'standard' | 'premium' | 'custom' | 'incremental'
  status: 'draft' | 'baseline' | 'frozen' | 'released' | 'deprecated'
  
  features: BaselineFeature[]
  adoptedFeatures: string[]          // 直接采用的特性ID
  developmentFeatures: string[]      // 需要开发的特性ID
  
  requirements: string[]
  newRequirements: number
  existingRequirements: number
  
  estimatedStoryPoints: number
  estimatedSprints: number
  estimatedDuration: number
  
  sprints: SprintAllocation[]
  teams: TeamAssignment[]
  
  progress: number
  completedFeatures: number
  totalFeatures: number
  completedRequirements: number
  totalRequirements: number
  
  baselinedBy?: string
  baselinedAt?: string
  frozenBy?: string
  frozenAt?: string
  
  tags: string[]
  createdAt: string
  updatedAt: string
  createdBy: string
}

export interface BaselineFeature {
  featureId: string
  featureName: string
  featureCode: string
  
  adoptionType: 'direct' | 'development' | 'customization'
  
  requirements?: string[]
  estimatedPoints?: number
  assignedTeam?: string
  targetSprint?: string
  
  currentVersion?: string
  targetVersion?: string
  
  status: 'planned' | 'in_progress' | 'completed' | 'deferred'
  progress: number
  
  dependencies: string[]
  config?: Record<string, any>
}

export interface SprintAllocation {
  sprintId: string
  sprintName: string
  features: string[]
  requirements: string[]
  estimatedPoints: number
  capacity: number
}

export interface TeamAssignment {
  teamId: string
  teamName: string
  features: string[]
  estimatedPoints: number
  capacity: number
}

// 版本类型标签
export const ReleaseTypeLabels: Record<string, string> = {
  major: '主版本',
  minor: '次版本',
  patch: '修订版',
  milestone: '里程碑'
}

// 版本状态标签
export const ReleaseStatusLabels: Record<string, string> = {
  planning: '规划中',
  development: '开发中',
  testing: '测试中',
  released: '已发布',
  deprecated: '已废弃'
}

// 特性包类型标签
export const BaselineTypeLabels: Record<string, string> = {
  standard: '标准包',
  premium: '高级包',
  custom: '定制包',
  incremental: '增量包'
}

// 特性包状态标签
export const BaselineStatusLabels: Record<string, string> = {
  draft: '草稿',
  baseline: '已基线',
  frozen: '已冻结',
  released: '已发布',
  deprecated: '已废弃'
}

// 特性采用方式标签
export const AdoptionTypeLabels: Record<string, string> = {
  direct: '直接采用',
  development: '需要开发',
  customization: '需要定制'
}

