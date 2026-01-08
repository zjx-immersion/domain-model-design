# 🏗️ 新实体模型设计 - 项目与产品关系

## 📅 设计日期
**2025-01-08**

---

## 🎯 设计目标

设计新的**项目（Project）实体模型**，明确车型项目、领域项目与产品的关系。

---

## 📊 核心实体设计

### 1️⃣ VehicleProject (车型项目)

**定义**: 整车级别的项目，涉及多个技术领域的集成和交付。

**TypeScript 定义**:
```typescript
interface VehicleProject {
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
  status: ProjectStatus         // planned | active | on-hold | completed | cancelled
  phase: string                 // 项目阶段：需求、开发、测试、验收
  
  // 度量
  budget?: number               // 预算
  progress: number              // 完成度 0-100
  
  // 元数据
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy: string
}

interface Milestone {
  id: string
  name: string
  targetDate: string
  actualDate?: string
  status: 'pending' | 'achieved' | 'missed'
  deliverables: string[]        // 交付物
}

type ProjectStatus = 'planned' | 'active' | 'on-hold' | 'completed' | 'cancelled'
```

**示例数据**:
```json
{
  "id": "VP-2025-001",
  "code": "2025-ICV",
  "name": "2025款智能驾驶车型项目",
  "description": "2025款搭载 L3 级智能驾驶的智能网联车型",
  "companyId": "COMPANY-001",
  "businessUnitId": "BU-ICV",
  "owner": "张三",
  "sponsor": "李总",
  "startDate": "2024-01-01",
  "targetDate": "2025-12-31",
  "domainProjectIds": [
    "DP-AD-2025-Q1",
    "DP-IC-2025-Q1",
    "DP-EE-2025-Q1"
  ],
  "objectives": [
    "实现 L3 级智能驾驶",
    "升级智能座舱体验",
    "优化电子电器架构"
  ],
  "status": "active",
  "phase": "开发",
  "progress": 45
}
```

---

### 2️⃣ DomainProject (领域项目)

**定义**: 特定技术领域的项目，如智能驾驶项目、智能座舱项目。

**TypeScript 定义**:
```typescript
interface DomainProject {
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
  
  // 时间信息
  startDate: string             // 开始日期
  endDate: string               // 结束日期
  
  // 关联关系
  productIds: string[]          // 包含的产品
  teamIds: string[]             // 参与的团队
  piPlanningIds: string[]       // 关联的 PI Planning
  
  // 版本规划
  projectVersions: ProjectVersion[]  // 项目版本规划
  
  // 目标与范围
  objectives: ProjectObjective[]     // 项目目标
  scope: string                      // 项目范围
  
  // 状态
  status: ProjectStatus         // planned | active | on-hold | completed | cancelled
  
  // 度量
  totalPIs: number              // 计划 PI 数量
  completedPIs: number          // 完成 PI 数量
  progress: number              // 完成度 0-100
  
  // 元数据
  createdAt: string
  updatedAt: string
}

interface ProjectVersion {
  id: string
  productId: string             // 产品ID
  productName: string           // 产品名称
  version: string               // 版本号，如 "V3.1"
  targetPI: string              // 目标 PI
  features: string[]            // 计划特性
  status: 'planned' | 'in-progress' | 'completed'
}

interface ProjectObjective {
  id: string
  description: string           // 目标描述
  businessValue: number         // 业务价值 1-10
  stretch: boolean              // 是否为拉伸目标
  progress: number              // 完成度 0-100
}
```

**示例数据**:
```json
{
  "id": "DP-AD-2025-Q1",
  "code": "AD-V31",
  "name": "智能驾驶 V3.1 项目",
  "description": "实现高速和城区 NOA 功能升级",
  "domain": "智能驾驶",
  "vehicleProjectId": "VP-2025-001",
  "departmentId": "DEPT-AD",
  "owner": "王经理",
  "startDate": "2025-01-01",
  "endDate": "2025-06-30",
  "productIds": [
    "PROD-AD-NOA",
    "PROD-AD-PARK",
    "PROD-AD-SUMMON"
  ],
  "teamIds": [
    "TEAM-PERCEPTION",
    "TEAM-PLANNING",
    "TEAM-CONTROL"
  ],
  "piPlanningIds": [
    "PI-2025-Q1",
    "PI-2025-Q2"
  ],
  "projectVersions": [
    {
      "id": "PV-001",
      "productId": "PROD-AD-NOA",
      "productName": "高速 NOA",
      "version": "V3.1",
      "targetPI": "PI-2025-Q2",
      "features": ["融合感知优化", "路径规划增强"],
      "status": "in-progress"
    }
  ],
  "status": "active",
  "totalPIs": 2,
  "completedPIs": 0,
  "progress": 30
}
```

---

### 3️⃣ ProjectBacklog (项目待办)

**定义**: 项目级别的工作项池，来自 PI Planning 的输出。

**TypeScript 定义**:
```typescript
interface ProjectBacklog {
  // 基本信息
  id: string                    // Backlog ID
  domainProjectId: string       // 所属领域项目
  piPlanningId: string          // 来源 PI Planning
  
  // 工作项
  workItems: WorkItem[]         // 工作项列表
  
  // 统计
  totalWorkItems: number        // 总工作项数
  assignedWorkItems: number     // 已分配数
  completedWorkItems: number    // 已完成数
  
  // 元数据
  createdAt: string
  updatedAt: string
}
```

---

### 4️⃣ TeamBacklog (团队待办)

**定义**: 团队级别的工作项池，从项目 Backlog 拉取。

**TypeScript 定义**:
```typescript
interface TeamBacklog {
  // 基本信息
  id: string                    // Team Backlog ID
  teamId: string                // 所属团队
  domainProjectId: string       // 所属领域项目
  
  // 工作项
  workItems: WorkItem[]         // 从 ProjectBacklog 拉取的工作项
  
  // 优先级队列
  priorityQueue: string[]       // 工作项优先级排序
  
  // 统计
  totalWorkItems: number        // 总工作项数
  inProgressWorkItems: number   // 进行中数
  completedWorkItems: number    // 已完成数
  
  // 容量
  teamCapacity: number          // 团队容量（故事点）
  remainingCapacity: number     // 剩余容量
  
  // 元数据
  createdAt: string
  updatedAt: string
}
```

---

## 🔗 关系模型设计

### 完整关系图

```
🏢 组织层
Company
   ↓ has
BusinessUnit
   ↓ has
Department
   ↓ has
Team

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚗 车型项目层
VehicleProject (车型项目)
   ├─ companyId → Company
   ├─ businessUnitId → BusinessUnit
   └─ domainProjectIds → DomainProject[]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 领域项目层
DomainProject (领域项目)
   ├─ vehicleProjectId → VehicleProject
   ├─ departmentId → Department
   ├─ productIds → Product[]
   ├─ teamIds → Team[]
   ├─ piPlanningIds → PIPlanning[]
   └─ projectVersions → ProjectVersion[]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📦 产品层（资产，保持不变）
ProductLine
   ↓ has
Product
   ↓ has
Feature
   ↓ has
Module

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 规划层
ProjectVersion (项目版本规划)
   ├─ domainProjectId → DomainProject
   ├─ productId → Product
   └─ targetPI → PIPlanning

PIPlanning (PI规划)
   ├─ domainProjectId → DomainProject
   ├─ workItems → WorkItem[]
   └─ generates → ProjectBacklog

ProjectBacklog (项目待办)
   ├─ domainProjectId → DomainProject
   ├─ piPlanningId → PIPlanning
   └─ feeds → TeamBacklog[]

TeamBacklog (团队待办)
   ├─ teamId → Team
   ├─ domainProjectId → DomainProject
   └─ pulls from → ProjectBacklog

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔄 执行层（保持不变）
Sprint
   ├─ teamId → Team
   ├─ pulls from → TeamBacklog
   └─ tasks → Task[]

Task
   ├─ sprintId → Sprint
   ├─ teamId → Team
   └─ assignee → TeamMember
```

---

## 📊 关系表

| 实体 A | 关系 | 实体 B | 类型 | 说明 |
|--------|------|--------|------|------|
| **VehicleProject** | has | DomainProject | 1:N | 车型项目包含多个领域项目 |
| **DomainProject** | belongs to | VehicleProject | N:1 | 领域项目归属车型项目 |
| **DomainProject** | includes | Product | N:M | 领域项目包含多个产品 |
| **DomainProject** | has | ProjectVersion | 1:N | 领域项目有多个版本规划 |
| **DomainProject** | has | PIPlanning | 1:N | 领域项目有多个 PI |
| **DomainProject** | involves | Team | N:M | 领域项目涉及多个团队 |
| **PIPlanning** | belongs to | DomainProject | N:1 | PI 归属领域项目 |
| **PIPlanning** | generates | ProjectBacklog | 1:1 | PI 生成项目待办 |
| **ProjectBacklog** | feeds into | TeamBacklog | 1:N | 项目待办喂给团队待办 |
| **TeamBacklog** | belongs to | Team | N:1 | 团队待办归属团队 |
| **Sprint** | pulls from | TeamBacklog | N:1 | Sprint 从团队待办拉取 |

---

## 🔄 数据流设计

### 从项目到交付的完整流程

```
阶段1: 项目启动
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚗 VehicleProject 创建
   └─ "2025款智驾车型项目"
   
   ↓ 创建子项目
   
🎯 DomainProject 创建
   └─ "智能驾驶 V3.1 项目"
      ├─ 关联产品: NOA, 泊车, 召唤
      └─ 组建团队: 感知、规划、控制

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
阶段2: 版本规划
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 ProjectVersion 规划
   ├─ NOA V3.1 → 目标 PI-2025-Q2
   ├─ 泊车 V2.0 → 目标 PI-2025-Q2
   └─ 召唤 V1.5 → 目标 PI-2025-Q3

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
阶段3: PI Planning
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 PIPlanning (PI-2025-Q2)
   Input:
   • ProjectVersion 目标
   • 特性需求列表
   • 团队容量
   
   Process:
   • 特性分解为模块需求
   • 模块需求分配给团队
   • 评估工作量
   • 识别依赖和风险
   
   Output:
   • PI Objectives
   • 工作项列表 (WorkItem[])
   • Dependencies
   • Risks

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
阶段4: Project Backlog 生成
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 ProjectBacklog 创建
   └─ 包含 PI Planning 产生的所有 WorkItem
   
   WorkItem 特点:
   • moduleId (关联模块)
   • assignedTeamId (已分配团队)
   • assignedSprintId (可能未分配)
   • estimatedEffort (已评估工作量)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
阶段5: Team Backlog 拉取
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 TeamBacklog (感知团队)
   Pull from ProjectBacklog:
   • 拉取 assignedTeamId = 感知团队 的工作项
   • 按优先级排序
   • 检查团队容量
   
   Status:
   • Total: 50 个工作项
   • In Progress: 10 个
   • Completed: 15 个
   • Remaining: 25 个

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
阶段6: Sprint Planning
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔄 Sprint (Sprint-2025-W01)
   Pull from TeamBacklog:
   • 团队从 TeamBacklog 拉取工作项
   • 根据 Sprint 容量和优先级
   • 拆分为 Task
   
   Tasks:
   • Requirement Task
   • User Story
   • Bug
   • Technical Task
   • etc.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
阶段7: Sprint 执行
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 Task 执行
   状态流转:
   TODO → In Progress → Review → Done
   
   每日站会:
   • 进度更新
   • 阻塞识别
   • 协作调整
   
   Sprint Review:
   • 演示完成工作
   • 收集反馈
   
   Sprint Retrospective:
   • 改进总结
```

---

## 📝 数据示例

### 完整场景示例

```json
{
  "vehicleProject": {
    "id": "VP-2025-001",
    "name": "2025款智驾车型项目",
    "domainProjects": ["DP-AD-2025-Q1", "DP-IC-2025-Q1"]
  },
  
  "domainProject": {
    "id": "DP-AD-2025-Q1",
    "name": "智能驾驶 V3.1 项目",
    "vehicleProjectId": "VP-2025-001",
    "productIds": ["PROD-AD-NOA", "PROD-AD-PARK"],
    "piPlanningIds": ["PI-2025-Q1", "PI-2025-Q2"],
    "projectVersions": [
      {
        "productId": "PROD-AD-NOA",
        "version": "V3.1",
        "targetPI": "PI-2025-Q2"
      }
    ]
  },
  
  "piPlanning": {
    "id": "PI-2025-Q2",
    "domainProjectId": "DP-AD-2025-Q1",
    "workItems": [/* WorkItem 列表 */]
  },
  
  "projectBacklog": {
    "id": "PB-PI-2025-Q2",
    "domainProjectId": "DP-AD-2025-Q1",
    "piPlanningId": "PI-2025-Q2",
    "workItems": [/* 所有 WorkItem */]
  },
  
  "teamBacklog": {
    "id": "TB-TEAM-PERCEPTION-Q2",
    "teamId": "TEAM-PERCEPTION",
    "domainProjectId": "DP-AD-2025-Q1",
    "workItems": [/* 感知团队的 WorkItem */]
  },
  
  "sprint": {
    "id": "SPR-2025-W01",
    "teamId": "TEAM-PERCEPTION",
    "workItems": [/* 从 TeamBacklog 拉取 */],
    "tasks": [/* 拆分的 Task */]
  }
}
```

---

## 🎯 设计要点总结

### 核心改进

1. ✅ **引入车型项目层**: 整车级别的项目管理
2. ✅ **引入领域项目层**: 技术领域的项目管理
3. ✅ **明确项目-产品关系**: 项目包含产品版本
4. ✅ **引入项目待办**: PI Planning → ProjectBacklog → TeamBacklog
5. ✅ **完整数据流**: 从项目到交付的端到端流程

### 保持不变

1. ✅ **产品资产管理**: ProductLine → Product → Feature → Module
2. ✅ **模块-团队绑定**: Module ←→ Team 责任绑定
3. ✅ **任务类型**: 8 种任务类型
4. ✅ **Sprint 执行**: Sprint → Task 的执行模式

---

## 📊 对比总结

| 维度 | 调整前 | 调整后 |
|------|--------|--------|
| **项目管理** | ❌ 无明确项目概念 | ✅ 车型项目 + 领域项目 |
| **版本规划** | ⚠️ 在产品下 | ✅ 在领域项目下 |
| **PI Planning** | ⚠️ 独立存在 | ✅ 归属领域项目 |
| **工作项流转** | ⚠️ 直接到 Sprint | ✅ ProjectBacklog → TeamBacklog → Sprint |
| **团队协作** | ✅ 模块-团队绑定 | ✅ 保持不变 |

---

**设计完成时间**: 2025-01-08  
**下一步**: 设计改造计划和实施任务

