# 🏗️ 基于任务的架构设计 - 组织架构与工作流

## 📋 文档说明

**版本**: V1.0  
**日期**: 2025年1月8日  
**状态**: 最终设计方案  

本文档整合了以下内容：
- 当前架构全面Review
- 领域模型重新设计（需求与任务架构）
- 架构可视化总结

---

## 🎯 核心设计理念

### 关键原则
1. **模块-团队责任绑定**: Team与Module通过responsibleModules明确绑定
2. **需求三层分解**: UserRequirement → FeatureRequirement → ModuleRequirement
3. **任务多类型支持**: 8种任务类型覆盖实际研发场景
4. **自动工作分配**: 基于模块责任自动分配团队

---

## 📊 完整架构全景图

```
┌────────────────────────────────────────────────────────────────────────────┐
│                          【组织与工作流架构】                               │
└────────────────────────────────────────────────────────────────────────────┘

🏢 组织层 (待补充)
   │
   │  公司 (Company) → 事业部 (Business Unit) → 部门 (Department) → 团队 (Team)
   │
   └─────────────────────────────────────────────────────────────────────────┐
                                                                              │
📦 产品层                                                                     │
   │                                                                          │
   ├─ ProductLine (产品线)                                                   │
   │    └─ Product (产品)                                                    │
   │         └─ Feature (特性) ─────────┐                                    │
   │              └─ Module (模块) ⭐   │                                    │
   │                    │               │                                     │
   │                    └─────────────┐ │                                     │
   │                                  │ │                                     │
   └──────────────────────────────────┼─┼─────────────────────────────────┐  │
                                      │ │                                  │  │
🎯 项目层                              │ │                                  │  │
   │                                  │ │                                  │  │
   ├─ PI Planning                     │ │                                  │  │
   │    │                             │ │                                  │  │
   │    ├─ 时间范围                   │ │                                  │  │
   │    ├─ WorkItem Pool ⭐          │ │                                  │  │
   │    ├─ TeamPlan[]                 │ │                                  │  │
   │    ├─ Sprint[]                   │ │                                  │  │
   │    ├─ Dependencies               │ │                                  │  │
   │    └─ Risks                      │ │                                  │  │
   │                                  │ │                                  │  │
   └──────────────────────────────────┼─┼──────────────────────────────┐  │  │
                                      │ │                              │  │  │
👥 团队层                              │ │                              │  │  │
   │                                  │ │                              │  │  │
   Team ────────────────────────────┐ │ │                              │  │  │
     ├─ id, name, code              │ │ │                              │  │  │
     ├─ members: TeamMember[]       │ │ │                              │  │  │
     ├─ responsibleModules[] ⭐ ────┼─┘ │  🔑 核心绑定                │  │  │
     ├─ capacity                    │   │                              │  │  │
     ├─ currentPI                   │   │                              │  │  │
     ├─ currentSprint               │   │                              │  │  │
     └─ workItems[]                 │   │                              │  │  │
           │                        │   │                              │  │  │
           └────────────────────────┼───┼──────────────────────────┐  │  │  │
                                    │   │                          │  │  │  │
🔄 迭代层                             │   │                          │  │  │  │
   │                                │   │                          │  │  │  │
   Sprint ──────────────────────┐   │   │                          │  │  │  │
     ├─ id, name                │   │   │                          │  │  │  │
     ├─ piId                    │   │   │                          │  │  │  │
     ├─ teamId ⭐ ───────────────┼───┘   │                          │  │  │  │
     ├─ startDate, endDate      │       │                          │  │  │  │
     ├─ capacity                │       │                          │  │  │  │
     ├─ workItems[] ⭐          │       │                          │  │  │  │
     └─ tasks[]                 │       │                          │  │  │  │
           │                    │       │                          │  │  │  │
           └────────────────────┼───────┼──────────────────────┐  │  │  │  │
                                │       │                      │  │  │  │  │
📋 需求层                         │       │                      │  │  │  │  │
   │                            │       │                      │  │  │  │  │
   UserRequirement (L1)         │       │                      │  │  │  │  │
     └─ FeatureRequirement (L2)─┼───────┘                      │  │  │  │  │
          └─ ModuleRequirement (L3)                            │  │  │  │  │
               │                                                │  │  │  │  │
               ├─ moduleId ⭐ ──────────────────────────────────┘  │  │  │  │
               └─ 分解为 WorkItem                                  │  │  │  │
                     │                                             │  │  │  │
                     └─────────────────────────────────────────────┼──┼──┘  │
                                                                   │  │     │
📦 工作项层                                                          │  │     │
   │                                                               │  │     │
   WorkItem ──────────────────────────────────────────────────┐   │  │     │
     ├─ id, type                                              │   │  │     │
     ├─ moduleId ⭐ ───────────────────────────────────────────┼───┘  │     │
     ├─ assignedTeamId ⭐ (通过moduleId自动分配) ─────────────┼──────┘     │
     ├─ assignedSprintId ⭐                                    │            │
     ├─ estimatedEffort                                       │            │
     └─ tasks[] (拆分的任务)                                  │            │
           │                                                  │            │
           └──────────────────────────────────────────────────┼────────────┘
                                                              │
🎯 任务层                                                      │
   │                                                          │
   Task ────────────────────────────────────────────────┐    │
     ├─ id, type (8种类型)                             │    │
     ├─ moduleRequirementId                             │    │
     ├─ teamId ⭐ (继承自WorkItem)                      │    │
     ├─ sprintId ⭐ (继承自WorkItem)                    │    │
     ├─ assignee (Team成员)                             │    │
     ├─ storyPoints                                     │    │
     ├─ status (TODO → In Progress → Done)             │    │
     └─ progress                                        │    │
```

---

## 🔑 核心机制：模块-团队责任绑定

### 设计原理

```
┌─────────────┐        ┌──────────────┐        ┌────────────┐
│   Module    │        │     Team     │        │  WorkItem  │
│             │        │              │        │            │
│  MOD-001    │◄───────┤ responsible  │◄───────┤  moduleId  │
│  摄像头模块 │        │  Modules[]   │ 自动   │  = MOD-001 │
│             │        │              │ 分配   │            │
│             │        │  TEAM-001    │─────►  │  teamId    │
│             │        │  感知团队    │        │  = TEAM-001│
└─────────────┘        └──────────────┘        └────────────┘
     ↑                        ↑                       ↑
     │                        │                       │
   定义模块              绑定模块责任              自动分配团队
```

### 工作分配流程

```
Step 1: 需求定义
  ModuleRequirement { moduleId: "MOD-001" }
       ↓
Step 2: 创建工作项
  WorkItem { moduleId: "MOD-001", assignedTeamId: null }
       ↓
Step 3: 自动分配团队 (基于模块责任)
  查询: Team WHERE "MOD-001" IN responsibleModules
  找到: Team.id = "TEAM-001"
  设置: WorkItem.assignedTeamId = "TEAM-001" ⭐
       ↓
Step 4: PI Planning - 分配Sprint
  WorkItem.assignedSprintId = "SPR-2025-01"
       ↓
Step 5: Sprint Planning - 拆分任务
  Task { teamId: "TEAM-001", sprintId: "SPR-2025-01", assignee: "张三" }
       ↓
Step 6: Sprint执行
  Task状态流转: TODO → In Progress → Review → Done
```

---

## 📋 需求层级设计

### 三层需求分解

```
L1: 用户需求 (User Requirement)
    - 来自客户/市场的业务需求
    - 示例: "高速NOA自动换道优化"
       ↓ 分解 (satisfy)
L2: 特性需求 (Feature Requirement)
    - 产品特性级需求
    - 示例: "融合感知优化"、"决策规划增强"
       ↓ 分解 (decompose)
L3: 模块需求 (Module Requirement)
    - 软件模块级需求
    - 示例: "感知融合算法优化"
    - ⭐ 关联到Module: moduleId
```

### 数据结构

```typescript
interface ModuleRequirement {
  id: string
  code: string
  title: string
  featureRequirementId: string
  moduleId: string              // ⭐ 关联到Module
  moduleName: string
  priority: 'P0' | 'P1' | 'P2'
  status: 'planned' | 'in_development' | 'completed'
  progress: number
}
```

---

## 🎯 任务层级设计

### 任务类型 (8种)

```typescript
enum TaskType {
  REQUIREMENT = 'requirement',           // 需求任务：实现模块需求
  USER_STORY = 'user_story',            // 用户故事：用户视角功能点
  BUG = 'bug',                          // 缺陷修复
  TECHNICAL_TASK = 'technical_task',    // 技术任务：重构、优化
  RISK_TASK = 'risk_task',              // 风险应对
  TEST_TASK = 'test_task',              // 测试任务
  DOCUMENTATION = 'documentation',       // 文档任务
  SUBTASK = 'subtask'                   // 子任务
}
```

### 任务数据结构

```typescript
interface Task {
  // 基本信息
  id: string
  code: string
  title: string
  type: TaskType
  description: string
  
  // 关联关系
  moduleRequirementId?: string
  teamId: string         // ⭐ 所属团队
  sprintId?: string      // ⭐ 所属Sprint
  assignee: string       // 负责人
  
  // 工作量
  storyPoints?: number
  estimatedHours?: number
  
  // 状态
  priority: Priority
  status: TaskStatus
  progress: number
}
```

---

## 🔄 完整工作流程

### PI Planning → Sprint Planning → Sprint执行

```
┌──────────────────────────────────────────────────────────────┐
│  阶段1: PI Planning (程序增量规划)                            │
├──────────────────────────────────────────────────────────────┤
│  输入: Feature Requirements                                  │
│  过程:                                                        │
│  1. 分解Feature → ModuleRequirements                         │
│  2. 创建WorkItems (基于ModuleRequirements)                   │
│  3. 自动分配Team (基于Module责任)                            │
│  4. 评估工作量，形成PI Objectives                            │
│  5. 识别Dependencies和Risks                                  │
│  6. 将WorkItems分配到Sprints                                 │
│                                                               │
│  输出: PI Backlog (WorkItems已分配Team和Sprint)             │
└──────────────────────────────────────────────────────────────┘
                           ↓
┌──────────────────────────────────────────────────────────────┐
│  阶段2: Sprint Planning (迭代规划)                            │
├──────────────────────────────────────────────────────────────┤
│  输入: Sprint Backlog (该Sprint的WorkItems)                  │
│  过程:                                                        │
│  1. 团队评审WorkItems                                         │
│  2. 拆分WorkItems为Tasks (多种类型)                          │
│  3. 细化Task估算 (Story Points, Hours)                       │
│  4. 分配Tasks给团队成员                                       │
│  5. 确定Sprint Goal                                          │
│  6. 确认Sprint Capacity                                      │
│                                                               │
│  输出: Sprint Backlog (Tasks已分配人员)                      │
└──────────────────────────────────────────────────────────────┘
                           ↓
┌──────────────────────────────────────────────────────────────┐
│  阶段3: Sprint执行                                            │
├──────────────────────────────────────────────────────────────┤
│  过程:                                                        │
│  1. 每日站会 (Daily Standup)                                 │
│  2. 任务执行 (Task: TODO → In Progress → Review → Done)     │
│  3. 燃尽图跟踪                                               │
│  4. 阻塞和风险管理                                           │
│  5. Sprint Review                                            │
│  6. Sprint Retrospective                                     │
│                                                               │
│  输出: Potentially Shippable Increment                       │
└──────────────────────────────────────────────────────────────┘
```

---

## 📊 核心实体关系

### 关联表

| 实体 | 关联到 | 关联字段 | 关系类型 | 说明 |
|------|--------|----------|----------|------|
| **ModuleRequirement** | Module | moduleId | N:1 | 模块需求属于一个模块 |
| **Team** | Module | responsibleModules[] | N:M | 团队负责多个模块 ⭐ |
| **WorkItem** | Module | moduleId | N:1 | 工作项关联一个模块 |
| **WorkItem** | Team | assignedTeamId | N:1 | 工作项分配给团队 ⭐ |
| **WorkItem** | Sprint | assignedSprintId | N:1 | 工作项分配到Sprint |
| **Task** | WorkItem | workItemId | N:1 | 任务从工作项拆分 |
| **Task** | Team | teamId | N:1 | 任务属于团队 ⭐ |
| **Task** | Sprint | sprintId | N:1 | 任务属于Sprint |
| **Task** | TeamMember | assignee | N:1 | 任务分配给成员 |
| **Sprint** | Team | teamId | N:1 | Sprint属于团队 ⭐ |
| **Sprint** | PIPlanning | piId | N:1 | Sprint属于PI |

**关键关系链**:
```
Module ←→ Team (responsibleModules)
   ↓
WorkItem (moduleId → assignedTeamId)
   ↓
Task (teamId)
   ↓
Sprint (teamId)
```

---

## ⚠️ 当前设计问题与改进建议

### 问题1: 缺少组织架构层 (P0 - Critical)

**当前状态**: ❌ 无组织架构定义

**影响**:
- 大型组织无法使用
- 权限管理困难
- 资源分配不清晰

**改进方案**:
```typescript
interface Company {
  id: string
  name: string
  businessUnits: BusinessUnit[]
}

interface BusinessUnit {
  id: string
  name: string
  departments: Department[]
}

interface Department {
  id: string
  name: string
  teams: Team[]
  manager: string
}
```

---

### 问题2: Project概念缺失 (P1 - High)

**当前状态**: ❌ 只有PI Planning，没有长期项目管理

**影响**:
- 无法管理跨PI的长期项目
- 项目级资源和预算管理缺失
- 项目交付物管理不清晰

**改进方案**:
```typescript
interface Project {
  id: string
  name: string
  productIds: string[]
  teamIds: string[]
  piPlannings: string[]
  startDate: string
  targetDate: string
  deliverables: Deliverable[]
}
```

---

### 问题3: 模块-团队绑定不够灵活 (P2 - Medium)

**当前状态**: ⚠️ 静态绑定，无主责/协助区分

**改进方案**:
```typescript
interface ModuleTeamAssignment {
  moduleId: string
  teamId: string
  role: 'primary' | 'secondary'  // 主责/协助
  percentage: number              // 负责比例
  effectiveFrom: string
  effectiveTo?: string
}
```

---

## ✅ 当前架构优势

### 1. 模块-团队责任绑定机制 ⭐⭐⭐
- 清晰的责任界定
- 自动化工作分配
- 利于绩效考核

### 2. 三层需求分解清晰 ⭐⭐⭐
- 层次分明
- 端到端可追溯
- 符合实际业务

### 3. 统一工作项管理 ⭐⭐⭐
- 需求、Bug、技术债统一管理
- 统一排期和分配
- 统一度量

### 4. 丰富的任务类型 ⭐⭐
- 8种任务类型覆盖实际场景
- 灵活的工作量度量
- 完整的状态流转

---

## 🚀 改进路线图

### Phase 1: 补充组织架构 (2周)
- 定义 Company/BusinessUnit/Department
- 更新 Team 归属关系
- 实现组织架构树

### Phase 2: 补充Project概念 (2周)
- 定义 Project 数据模型
- Project 与 Product/Team/PI 关联
- Project 管理页面

### Phase 3: 优化模块-团队绑定 (2周)
- ModuleTeamAssignment 设计
- 主责/协助区分
- 动态调整机制

---

## 📝 参考文档

- TypeScript类型定义: `frontend/src/types/task.ts`
- TypeScript类型定义: `frontend/src/types/team.ts`
- TypeScript类型定义: `frontend/src/types/project.ts`
- TypeScript类型定义: `frontend/src/types/sprint.ts`
- TypeScript类型定义: `frontend/src/types/work-item.ts`

---

**文档版本**: V1.0  
**最后更新**: 2025年1月8日  
**状态**: 最终设计方案

