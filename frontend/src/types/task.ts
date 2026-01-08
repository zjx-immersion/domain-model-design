/**
 * 任务管理相关类型定义
 * 基于重新设计的领域模型
 */

/**
 * 任务类型枚举
 */
export enum TaskType {
  REQUIREMENT = 'requirement',           // 需求任务：实现模块需求
  USER_STORY = 'user_story',            // 用户故事：用户视角的功能点
  BUG = 'bug',                          // 缺陷修复：修复软件缺陷
  TECHNICAL_TASK = 'technical_task',    // 技术任务：技术改进/重构
  RISK_TASK = 'risk_task',              // 风险应对：应对项目风险
  TEST_TASK = 'test_task',              // 测试任务：测试活动
  DOCUMENTATION = 'documentation',       // 文档任务：文档编写
  SUBTASK = 'subtask'                   // 子任务：任务的分解
}

/**
 * 任务状态枚举
 */
export enum TaskStatus {
  TODO = 'todo',                   // 待处理
  IN_PROGRESS = 'in_progress',     // 进行中
  IN_REVIEW = 'in_review',         // 评审中
  BLOCKED = 'blocked',             // 阻塞
  DONE = 'done',                   // 完成
  CLOSED = 'closed'                // 关闭
}

/**
 * 优先级枚举
 */
export enum Priority {
  P0 = 'P0',  // Critical - 最高优先级
  P1 = 'P1',  // High - 高优先级
  P2 = 'P2',  // Medium - 中优先级
  P3 = 'P3',  // Low - 低优先级
  P4 = 'P4'   // Trivial - 最低优先级
}

/**
 * Bug严重程度枚举
 */
export enum Severity {
  CRITICAL = 'critical',   // 致命：系统崩溃、数据丢失
  MAJOR = 'major',         // 严重：主要功能无法使用
  MINOR = 'minor',         // 一般：功能部分受影响
  TRIVIAL = 'trivial'      // 轻微：界面问题、文字错误
}

/**
 * 任务数据结构
 */
export interface Task {
  // ========== 基本信息 ==========
  id: string                      // 任务ID: TASK-001
  code: string                    // 任务编号: TASK-001
  title: string                   // 任务标题
  type: TaskType                  // 任务类型
  description: string             // 任务描述
  
  // ========== 关联关系 ==========
  moduleRequirementId?: string    // 关联的模块需求ID (如果是需求任务)
  moduleRequirementTitle?: string // 模块需求标题
  featureRequirementId?: string   // 关联的特性需求ID (用于追溯)
  featureRequirementTitle?: string // 特性需求标题
  userRequirementId?: string      // 关联的用户需求ID (用于追溯)
  userRequirementTitle?: string   // 用户需求标题
  parentTaskId?: string           // 父任务ID (如果是子任务)
  parentTaskTitle?: string        // 父任务标题
  relatedBugId?: string           // 关联的Bug ID
  relatedRiskId?: string          // 关联的风险ID
  
  // ========== 迭代与计划 ==========
  piId?: string                   // 所属PI Planning ID
  piName?: string                 // PI名称
  sprintId?: string               // 所属Sprint ID
  sprintName?: string             // Sprint名称
  epicId?: string                 // 所属Epic ID (可选)
  epicName?: string               // Epic名称
  
  // ========== 优先级与状态 ==========
  priority: Priority              // 优先级: P0, P1, P2, P3, P4
  status: TaskStatus              // 状态
  
  // ========== 工作量与进度 ==========
  storyPoints?: number            // 故事点 (1, 2, 3, 5, 8, 13)
  estimatedHours?: number         // 预估工时
  actualHours?: number            // 实际工时
  remainingHours?: number         // 剩余工时
  progress: number                // 完成进度 (0-1)
  
  // ========== 责任与协作 ==========
  assignee: string                // 负责人/经办人
  assigneeName?: string           // 负责人姓名
  reporter: string                // 报告人/创建人
  reporterName?: string           // 报告人姓名
  teamId: string                  // 所属团队
  teamName?: string               // 团队名称
  watchers?: string[]             // 关注者列表
  reviewers?: string[]            // 评审人列表
  
  // ========== 时间信息 ==========
  createdAt: string               // 创建时间
  updatedAt: string               // 更新时间
  dueDate?: string                // 截止日期
  startDate?: string              // 开始日期
  completedAt?: string            // 完成时间
  
  // ========== 其他属性 ==========
  labels?: string[]               // 标签
  components?: string[]           // 组件
  version?: string                // 版本
  fixVersion?: string             // 修复版本
  resolution?: string             // 解决方案 (Resolved/Won't Fix/Duplicate等)
  acceptanceCriteria?: string[]   // 验收标准
  
  // ========== Bug特有字段 ==========
  severity?: Severity             // 严重程度 (for bugs)
  foundInVersion?: string         // 发现版本 (for bugs)
  fixedInVersion?: string         // 修复版本 (for bugs)
  reproduceSteps?: string[]       // 复现步骤 (for bugs)
  environment?: string            // 环境信息 (for bugs)
  
  // ========== 用户故事特有字段 ==========
  userStoryFormat?: {             // 用户故事格式 (for user stories)
    role: string                  // 角色：作为[角色]
    feature: string               // 功能：我想要[功能]
    benefit: string               // 价值：以便[价值]
  }
  
  // ========== 扩展字段 ==========
  customFields?: Record<string, any>  // 自定义字段
  attachments?: Attachment[]      // 附件
  comments?: Comment[]            // 评论
  history?: HistoryEntry[]        // 变更历史
  links?: TaskLink[]              // 任务关联
}

/**
 * 附件
 */
export interface Attachment {
  id: string
  fileName: string
  fileSize: number
  fileType: string
  url: string
  uploadedBy: string
  uploadedAt: string
}

/**
 * 评论
 */
export interface Comment {
  id: string
  content: string
  author: string
  authorName: string
  createdAt: string
  updatedAt?: string
}

/**
 * 变更历史
 */
export interface HistoryEntry {
  id: string
  field: string
  oldValue: any
  newValue: any
  changedBy: string
  changedAt: string
}

/**
 * 任务关联
 */
export interface TaskLink {
  id: string
  linkType: TaskLinkType
  sourceTaskId: string
  targetTaskId: string
  description?: string
}

/**
 * 任务关联类型
 */
export enum TaskLinkType {
  BLOCKS = 'blocks',           // 阻塞
  BLOCKED_BY = 'blocked_by',   // 被阻塞
  RELATES = 'relates',         // 关联
  DUPLICATES = 'duplicates',   // 重复
  DEPENDS_ON = 'depends_on',   // 依赖
  SUBTASK_OF = 'subtask_of'    // 子任务
}

/**
 * Sprint统计信息
 */
export interface SprintTaskStats {
  total: number
  byType: Record<TaskType, number>
  byStatus: Record<TaskStatus, number>
  byPriority: Record<Priority, number>
  totalStoryPoints: number
  completedStoryPoints: number
  remainingStoryPoints: number
}

/**
 * 任务筛选条件
 */
export interface TaskFilter {
  type?: TaskType | TaskType[]
  status?: TaskStatus | TaskStatus[]
  priority?: Priority | Priority[]
  assignee?: string | string[]
  reporter?: string | string[]
  teamId?: string | string[]
  sprintId?: string | string[]
  piId?: string | string[]
  moduleRequirementId?: string
  featureRequirementId?: string
  userRequirementId?: string
  labels?: string[]
  searchText?: string
  createdFrom?: string
  createdTo?: string
  dueFrom?: string
  dueTo?: string
}

/**
 * 任务排序选项
 */
export interface TaskSort {
  field: 'priority' | 'status' | 'createdAt' | 'updatedAt' | 'dueDate' | 'storyPoints'
  order: 'asc' | 'desc'
}

/**
 * 看板列定义
 */
export interface KanbanColumn {
  id: string
  title: string
  status: TaskStatus
  tasks: Task[]
  limit?: number  // WIP限制
}

/**
 * 燃尽图数据点
 */
export interface BurndownDataPoint {
  date: string
  ideal: number           // 理想剩余工作量
  actual: number          // 实际剩余工作量
  completed: number       // 已完成工作量
}

/**
 * 任务类型显示配置
 */
export interface TaskTypeConfig {
  type: TaskType
  label: string
  color: string
  icon: string
  description: string
}

// 任务类型显示配置表
export const TASK_TYPE_CONFIGS: Record<TaskType, Omit<TaskTypeConfig, 'type'>> = {
  [TaskType.REQUIREMENT]: {
    label: '需求任务',
    color: '#1890ff',
    icon: 'Document',
    description: '实现模块需求的开发任务'
  },
  [TaskType.USER_STORY]: {
    label: '用户故事',
    color: '#52c41a',
    icon: 'User',
    description: '从用户视角描述的功能点'
  },
  [TaskType.BUG]: {
    label: '缺陷修复',
    color: '#f5222d',
    icon: 'Warning',
    description: '修复软件缺陷或问题'
  },
  [TaskType.TECHNICAL_TASK]: {
    label: '技术任务',
    color: '#722ed1',
    icon: 'Setting',
    description: '技术改进、重构、优化'
  },
  [TaskType.RISK_TASK]: {
    label: '风险应对',
    color: '#fa8c16',
    icon: 'Warning',
    description: '应对识别出的项目风险'
  },
  [TaskType.TEST_TASK]: {
    label: '测试任务',
    color: '#13c2c2',
    icon: 'Connection',
    description: '测试用例编写、测试执行'
  },
  [TaskType.DOCUMENTATION]: {
    label: '文档任务',
    color: '#eb2f96',
    icon: 'Document',
    description: '文档编写和维护'
  },
  [TaskType.SUBTASK]: {
    label: '子任务',
    color: '#8c8c8c',
    icon: 'List',
    description: '父任务的分解任务'
  }
}

// 任务状态显示配置
export const TASK_STATUS_CONFIGS: Record<TaskStatus, { label: string; color: string }> = {
  [TaskStatus.TODO]: {
    label: '待处理',
    color: 'info'
  },
  [TaskStatus.IN_PROGRESS]: {
    label: '进行中',
    color: 'warning'
  },
  [TaskStatus.IN_REVIEW]: {
    label: '评审中',
    color: 'primary'
  },
  [TaskStatus.BLOCKED]: {
    label: '阻塞',
    color: 'danger'
  },
  [TaskStatus.DONE]: {
    label: '完成',
    color: 'success'
  },
  [TaskStatus.CLOSED]: {
    label: '关闭',
    color: ''
  }
}

// 优先级显示配置
export const PRIORITY_CONFIGS: Record<Priority, { label: string; color: string }> = {
  [Priority.P0]: {
    label: 'P0-最高',
    color: 'danger'
  },
  [Priority.P1]: {
    label: 'P1-高',
    color: 'warning'
  },
  [Priority.P2]: {
    label: 'P2-中',
    color: 'primary'
  },
  [Priority.P3]: {
    label: 'P3-低',
    color: 'info'
  },
  [Priority.P4]: {
    label: 'P4-最低',
    color: ''
  }
}

// Bug严重程度显示配置
export const SEVERITY_CONFIGS: Record<Severity, { label: string; color: string }> = {
  [Severity.CRITICAL]: {
    label: '致命',
    color: 'danger'
  },
  [Severity.MAJOR]: {
    label: '严重',
    color: 'warning'
  },
  [Severity.MINOR]: {
    label: '一般',
    color: 'primary'
  },
  [Severity.TRIVIAL]: {
    label: '轻微',
    color: 'info'
  }
}
