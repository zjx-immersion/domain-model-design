# 🏗️ 基于任务的架构设计 v3.0 - 组织架构与工作流

## 📋 文档说明

**版本**: V3.0  
**日期**: 2025年1月10日  
**状态**: 最终设计方案  

本文档整合了以下内容：
- v3.0工作项管理体系（取消Story层）
- 组织架构层设计
- 领域模型与工作流可视化
- 完整的Mermaid架构图

**⭐⭐⭐ 核心设计原则**：
- **WorkItem是基础抽象模型**，不是单独的一层
- **Task、Bug、TechDebt等都是WorkItem的具体类型**
- **不存在"工作项拆分为任务"的概念**，而是"工作项分解为子工作项"
- **所有工作都是WorkItem**，通过`type`字段区分类型，通过`parentWorkItemId`建立层级关系

---

## 🎯 v3.0 核心设计理念

### 重大变更

#### 1. 简化需求层级 ⭐⭐⭐

**旧架构 (v2.x)**:
```
用户需求 → 特性需求 → 模块需求 → Story → Task
（5层，过于复杂）
```

**新架构 (v3.0)**:
```
用户需求 → 特性需求 → 模块需求 → WorkItem → Task
（4层，直接转换，取消Story层）
```

**变更理由**:
- Story层主要用于敏捷开发，但模块需求已经足够细化
- 减少管理层级，提升效率
- 降低学习成本和使用复杂度

#### 2. 工作项（Work Item）作为基础模型 ⭐⭐⭐

**核心概念**:
- WorkItem 是所有工作的基础抽象模型
- Task、ModuleRequirement、Bug 等都是 WorkItem 的具体类型
- 不存在"工作项拆分为任务"的概念，而是"工作项分解为子工作项"

**工作项类型体系**:
```typescript
// WorkItem 是基础抽象模型
interface WorkItem {
  id: string
  type: WorkItemType
  title: string
  // ... 共同属性
}

// 具体工作项类型
type WorkItemType = 
  | 'task'                // 任务：最小执行单元
  | 'technical_task'      // 技术任务：重构、优化等
  | 'module_requirement'  // 模块需求：可分解为多个task
  | 'test_task'           // 测试任务：测试执行单元
  | 'bug'                 // 缺陷：缺陷修复
  | 'tech_debt'           // 技术债：技术债清理
  | 'research'            // 调研任务：技术调研
  | 'subtask'             // 子任务：任务的细分
```

**工作项层级关系**:
```
ModuleRequirement (工作项) 
  └─ 分解为 → Task (工作项)
                └─ 分解为 → SubTask (工作项)

Bug (工作项) 
  └─ 分解为 → Task (工作项)

TechDebt (工作项)
  └─ 分解为 → TechnicalTask (工作项)
```

**价值**:
- ✅ 统一的工作项模型，易于理解和管理
- ✅ 支持灵活的分解和组合
- ✅ 所有工作类型平等对待
- ✅ 完整的价值流跟踪

#### 3. 模块-团队责任绑定 ⭐⭐

**核心机制**:
```
Module ←→ Team (responsibleModules) ⭐ 核心绑定
   ↓ 自动分配
WorkItem (moduleId → assignedTeamId) ⭐ 统一模型
   ↓ 分解
WorkItem (子工作项，继承 teamId, sprintId)
```

**价值**:
- ✅ 明确团队责任范围
- ✅ 自动化工作项分配
- ✅ 减少协调成本
- ✅ 利于绩效考核

#### 4. 关键原则

1. **模块-团队责任绑定**: Team与Module通过responsibleModules明确绑定
2. **需求三层分解**: UserRequirement → FeatureRequirement → ModuleRequirement
3. **工作项统一模型**: WorkItem是基础模型，Task是其中一种类型 ⭐ 核心变更
4. **工作项分解**: 复杂工作项可分解为多个子工作项（同一模型）
5. **自动团队分配**: 基于模块责任自动分配团队

---

## 📊 完整架构全景图（Mermaid）

### 1. 组织架构与工作流全景

```mermaid
graph TB
    %% 组织层
    subgraph ORG["🏢 组织层 (Organization Layer)"]
        Company["公司 (Company)<br/>• 多事业部<br/>• 统一治理"]
        BU["事业部 (Business Unit)<br/>• 业务域<br/>• P&L责任"]
        Dept["部门 (Department)<br/>• 职能域<br/>• 资源池"]
        Team["团队 (Team)<br/>• 8-12人<br/>• 负责Module[]"]
        
        Company --> BU
        BU --> Dept
        Dept --> Team
    end
    
    %% 产品层
    subgraph PROD["📦 产品层 (Product Layer)"]
        PL["产品线 (ProductLine)<br/>• 战略定位<br/>• Roadmap"]
        Product["产品 (Product)<br/>• 客户交付<br/>• Version[]"]
        Feature["特性 (Feature)<br/>• 功能单元<br/>• 可复用"]
        Module["模块 (Module) ⭐<br/>• 软件单元<br/>• 团队责任"]
        
        PL --> Product
        Product --> Feature
        Feature --> Module
    end
    
    %% 项目层
    subgraph PROJ["🎯 项目层 (Project Layer)"]
        VehicleProj["车型项目<br/>• 多产品集成<br/>• Milestone[]"]
        DomainProj["领域项目<br/>• 单产品开发<br/>• Version目标"]
        PI["PI Planning<br/>• 8-12周<br/>• Sprint[]×4-6"]
        
        VehicleProj -.关联.-> DomainProj
        DomainProj --> PI
    end
    
    %% 需求层
    subgraph REQ["📋 需求层 (Requirement Layer)"]
        UR["用户需求 (L1)<br/>• 客户需求<br/>• 业务价值"]
        FR["特性需求 (L2)<br/>• 产品特性<br/>• Feature关联"]
        MR["模块需求 (L3) ⭐<br/>• 软件需求<br/>• Module关联"]
        
        UR --> FR
        FR --> MR
    end
    
    %% 执行层
    subgraph EXEC["🔄 执行层 (Execution Layer)"]
        Sprint["Sprint<br/>• 2-4周<br/>• Team单位<br/>• WorkItem[]"]
        WI["WorkItem ⭐⭐⭐<br/>统一基础模型<br/>类型包括：<br/>• task<br/>• module_requirement<br/>• bug<br/>• tech_debt<br/>• technical_task<br/>• test_task<br/>• research<br/>• subtask"]
        
        Sprint --> WI
    end
    
    %% 核心关联关系
    Module -.responsibleModules.-> Team
    Team -.currentPI.-> PI
    Team -.currentSprint.-> Sprint
    
    MR -.moduleId.-> Module
    MR -.生成.-> WI
    WI -.moduleId自动分配.-> Team
    WI -.PI Planning.-> PI
    WI -.Sprint Planning.-> Sprint
    WI -.可分解为.-> WI
    
    Feature -.实现.-> Module
    Product -.开发.-> DomainProj
    
    %% 样式
    classDef orgStyle fill:#e8f5e9,stroke:#4caf50,stroke-width:2px
    classDef prodStyle fill:#e3f2fd,stroke:#2196f3,stroke-width:2px
    classDef projStyle fill:#fff3e0,stroke:#ff9800,stroke-width:2px
    classDef reqStyle fill:#f3e5f5,stroke:#9c27b0,stroke-width:2px
    classDef execStyle fill:#fff9c4,stroke:#fbc02d,stroke-width:3px
    
    class Company,BU,Dept,Team orgStyle
    class PL,Product,Feature,Module prodStyle
    class VehicleProj,DomainProj,PI projStyle
    class UR,FR,MR reqStyle
    class Sprint,WI execStyle
```

### 2. 工作项流转流程图

```mermaid
flowchart TD
    %% 需求输入
    Start([需求输入]) --> ReqType{来源类型}
    
    ReqType -->|客户需求| UR[用户需求 L1]
    ReqType -->|BUG反馈| Bug[缺陷报告]
    ReqType -->|技术规划| TD[技术债识别]
    ReqType -->|性能问题| NF[非功能需求]
    
    %% 需求分解
    UR --> FR[特性需求 L2]
    FR --> MR[模块需求 L3]
    
    %% 工作项创建
    MR --> WI1[WorkItem<br/>type: module_requirement]
    Bug --> WI2[WorkItem<br/>type: bugfix]
    TD --> WI3[WorkItem<br/>type: tech_debt]
    NF --> WI4[WorkItem<br/>type: non_functional]
    
    WI1 --> WIPool
    WI2 --> WIPool
    WI3 --> WIPool
    WI4 --> WIPool
    
    %% 工作项池
    WIPool[/工作项池<br/>Work Item Backlog/] --> AutoAssign{自动分配团队}
    
    AutoAssign -->|基于moduleId| TeamA[Team A<br/>感知团队]
    AutoAssign -->|基于moduleId| TeamB[Team B<br/>决策团队]
    AutoAssign -->|基于moduleId| TeamC[Team C<br/>控制团队]
    
    %% PI Planning
    TeamA --> PIPlanning[PI Planning<br/>8-12周规划]
    TeamB --> PIPlanning
    TeamC --> PIPlanning
    
    PIPlanning --> PIObj[PI Objectives<br/>确定]
    PIPlanning --> DepMatrix[依赖矩阵<br/>识别]
    PIPlanning --> RiskBoard[风险看板<br/>评估]
    
    %% Sprint分配
    PIObj --> Sprint1[Sprint 1<br/>2周]
    PIObj --> Sprint2[Sprint 2<br/>2周]
    PIObj --> Sprint3[Sprint 3<br/>2周]
    PIObj --> Sprint4[Sprint 4<br/>2周]
    
    %% Sprint Planning
    Sprint1 --> SP1[Sprint Planning<br/>分解WorkItem]
    SP1 --> WI_Task1[WorkItem: Task<br/>type: task<br/>Assignee: 张三]
    SP1 --> WI_Task2[WorkItem: Task<br/>type: task<br/>Assignee: 李四]
    
    %% 工作项执行
    WI_Task1 --> Exec[Sprint执行]
    WI_Task2 --> Exec
    
    Exec --> Review[Sprint Review]
    Review --> Retro[Sprint Retro]
    Retro --> Done([交付增量])
    
    %% 样式
    classDef inputStyle fill:#e8f5e9,stroke:#4caf50
    classDef reqStyle fill:#f3e5f5,stroke:#9c27b0
    classDef wiStyle fill:#fff9c4,stroke:#fbc02d,stroke-width:3px
    classDef teamStyle fill:#e3f2fd,stroke:#2196f3
    classDef piStyle fill:#fff3e0,stroke:#ff9800
    classDef execStyle fill:#fce4ec,stroke:#e91e63
    
    class Start,ReqType inputStyle
    class UR,FR,MR,Bug,TD,NF reqStyle
    class WI1,WI2,WI3,WI4,WIPool,WI_Task1,WI_Task2 wiStyle
    class TeamA,TeamB,TeamC teamStyle
    class PIPlanning,PIObj,DepMatrix,RiskBoard piStyle
    class Sprint1,Sprint2,Sprint3,Sprint4,SP1,Exec execStyle
```

### 3. 模块-团队责任绑定机制

```mermaid
erDiagram
    Module ||--o{ Team : "responsible by"
    Team ||--o{ TeamMember : "has"
    Module ||--o{ ModuleRequirement : "defines"
    ModuleRequirement ||--|| WorkItem : "generates"
    WorkItem }o--|| Team : "assigned to (auto)"
    WorkItem }o--|| Sprint : "planned in"
    WorkItem ||--o{ WorkItem : "decomposes to (parent-child)"
    WorkItem }o--|| TeamMember : "assigned to"
    Sprint }o--|| Team : "owned by"
    Sprint }o--|| PI : "part of"
    
    Module {
        string id PK
        string name
        string code
        string techStack
        string repositoryUrl
        string owner
    }
    
    Team {
        string id PK
        string name
        string code
        string[] responsibleModules FK "⭐ 核心绑定"
        int capacity
        string currentPI FK
        string currentSprint FK
    }
    
    TeamMember {
        string id PK
        string name
        string teamId FK
        string role
        int weeklyCapacity
    }
    
    ModuleRequirement {
        string id PK
        string code
        string title
        string moduleId FK "⭐ 关联模块"
        string featureRequirementId FK
        int storyPoints
        string priority
        string status
    }
    
    WorkItem {
        string id PK
        string code
        string title
        string type "⭐ task|module_requirement|bug|tech_debt|etc"
        string moduleId FK "⭐ 关联模块"
        string parentWorkItemId FK "⭐ 父工作项(可选)"
        string assignedTeamId FK "⭐ 自动分配"
        string assignedSprintId FK
        string assignee FK "⭐ 分配给成员"
        int estimatedHours
        int storyPoints
        string priority
        string status
        int progress
    }
    
    Sprint {
        string id PK
        string name
        string code
        string piId FK
        string teamId FK "⭐ Sprint属于团队"
        date startDate
        date endDate
        int capacity
        int plannedStoryPoints
        int completedStoryPoints
        string status
    }
    
    PI {
        string id PK
        string name
        string code
        date startDate
        date endDate
        string status
    }
```

---

## 🔑 核心机制详解

### 1. 模块-团队责任绑定机制

#### 1.1 设计原理

```mermaid
sequenceDiagram
    participant MR as 模块需求<br/>(ModuleRequirement)
    participant WI_MR as WorkItem<br/>(type: module_requirement)
    participant Module as 模块<br/>(Module)
    participant Team as 团队<br/>(Team)
    participant Sprint as Sprint
    participant WI_Task as WorkItem<br/>(type: task)
    
    Note over MR: Step 1: 创建模块需求
    MR->>WI_MR: 生成工作项<br/>type: module_requirement<br/>moduleId: MOD-001
    
    Note over WI_MR: Step 2: 自动分配团队
    WI_MR->>Module: 查询模块信息<br/>moduleId: MOD-001
    Module->>Team: 查找负责团队<br/>"MOD-001" IN responsibleModules
    Team-->>WI_MR: 返回 teamId: TEAM-001<br/>⭐ 自动分配
    
    Note over WI_MR: Step 3: PI Planning
    WI_MR->>Team: 确认团队接收
    Team->>Sprint: 分配到Sprint<br/>Sprint 2
    
    Note over Sprint: Step 4: Sprint Planning - 分解工作项
    Sprint->>WI_MR: 分解为子工作项
    WI_MR->>WI_Task: 创建 WorkItem (type: task)<br/>继承 teamId & sprintId<br/>设置 parentWorkItemId
    
    Note over Sprint: Step 5: 执行
    WI_Task->>Team: 团队成员执行
    Team->>Sprint: 完成交付
```

#### 1.2 核心代码逻辑

```typescript
/**
 * 工作项自动分配团队
 */
function autoAssignTeam(workItem: WorkItem): void {
  // 1. 获取工作项关联的模块ID
  const moduleId = workItem.moduleId;
  
  if (!moduleId) {
    console.warn(`WorkItem ${workItem.id} 没有关联模块，无法自动分配团队`);
    return;
  }
  
  // 2. 查找负责该模块的团队
  const responsibleTeam = teams.find(team => 
    team.responsibleModules.includes(moduleId)
  );
  
  if (!responsibleTeam) {
    console.error(`未找到负责模块 ${moduleId} 的团队`);
    return;
  }
  
  // 3. 自动分配团队 ⭐
  workItem.assignedTeamId = responsibleTeam.id;
  workItem.assignedTeamName = responsibleTeam.name;
  
  console.log(
    `WorkItem ${workItem.id} 自动分配给团队 ${responsibleTeam.name} ` +
    `(基于模块 ${moduleId})`
  );
}
```

### 2. 工作项类型设计

#### 2.1 工作项类型定义

```mermaid
classDiagram
    class WorkItem {
        <<Abstract>>
        +string id
        +string code
        +string title
        +WorkItemType type ⭐
        +string parentWorkItemId "⭐ 父工作项"
        +string moduleId
        +string assignedTeamId
        +string assignedSprintId
        +string assignee "⭐ 分配给成员"
        +int estimatedHours
        +int storyPoints
        +Priority priority
        +Status status
        +int progress
        +decompose() WorkItem[] "⭐ 分解为子工作项"
    }
    
    class TaskWI {
        +string taskType "development|review|deployment"
        +string[] subtaskIds
        +validateCompletion() boolean
    }
    
    class TechnicalTaskWI {
        +string technicalArea "refactor|optimize|upgrade"
        +string technicalContext
        +int complexityScore
        +estimateTechnicalRisk() Risk
    }
    
    class ModuleRequirementWI {
        +string moduleRequirementId
        +string featureRequirementId
        +RequirementType reqType
        +string[] acceptanceCriteria
        +validateRequirement() boolean
    }
    
    class TestTaskWI {
        +string testType "unit|integration|e2e"
        +string testSuite
        +int testCaseCount
        +string coverageTarget
        +runTests() TestResult
    }
    
    class BugWI {
        +string bugId
        +Severity severity
        +string reportedBy
        +date reportedDate
        +string affectedVersion
        +string[] reproductionSteps
        +reproducible() boolean
    }
    
    class TechDebtWI {
        +string debtType "code_quality|architecture|documentation"
        +Impact impact
        +string technicalContext
        +int interestRate
        +estimateRefactoringCost() int
    }
    
    class ResearchWI {
        +string topic
        +string objective
        +string methodology
        +string[] deliverables
        +string conclusion
        +evaluate() ResearchResult
    }
    
    class SubTaskWI {
        +string parentTaskId
        +int sequenceOrder
        +boolean isBlocking
    }
    
    WorkItem <|-- TaskWI
    WorkItem <|-- TechnicalTaskWI
    WorkItem <|-- ModuleRequirementWI
    WorkItem <|-- TestTaskWI
    WorkItem <|-- BugWI
    WorkItem <|-- TechDebtWI
    WorkItem <|-- ResearchWI
    WorkItem <|-- SubTaskWI
    
    WorkItem "1" --> "*" WorkItem : parent-child
```

#### 2.2 工作项类型使用场景

| 类型 | 来源 | 可否分解 | PI Planning优先级 | 示例 |
|------|------|----------|------------------|------|
| **task** | 工作项分解 | 可分解为subtask | N/A（已分解） | "实现目标检测算法" |
| **technical_task** | 技术规划 | 可分解为task | P2-P3 | "感知模块性能优化" |
| **module_requirement** | 需求分解 | 可分解为task | P0-P2（按业务价值） | "实现AEB自动紧急制动功能" |
| **test_task** | 测试计划 | 可分解为subtask | N/A（已分解） | "集成测试执行" |
| **bug** | 测试/用户反馈 | 可分解为task | P0-P1（按严重度） | "修复高速NOA车道偏离问题" |
| **tech_debt** | 技术评审 | 可分解为technical_task | P2-P3 | "感知融合模块重构" |
| **research** | 技术规划 | 不可分解 | P2-P3 | "Transformer感知算法POC" |
| **subtask** | task分解 | 不可分解 | N/A（已分解） | "编写单元测试" |

### 3. PI Planning工作流

```mermaid
flowchart TB
    subgraph PREP["阶段1: 准备 (1-2天前)"]
        WIBacklog[收集工作项Backlog<br/>6种类型混合]
        TeamCap[统计团队产能<br/>可用小时数]
        Priority[优先级排序<br/>业务价值 + 技术风险]
        
        WIBacklog --> Priority
        TeamCap --> Priority
    end
    
    subgraph DAY1["Day 1: 业务背景 & 团队规划"]
        Vision[产品愿景<br/>产品经理讲解]
        Arch[架构演进<br/>架构师讲解]
        TeamBreakout1[团队分组规划<br/>• 评审工作项<br/>• 拆分为Task<br/>• 评估工作量<br/>• 识别依赖]
        Draft1[初版PI Board<br/>展示]
        
        Vision --> Arch
        Arch --> TeamBreakout1
        TeamBreakout1 --> Draft1
    end
    
    subgraph DAY2["Day 2: 依赖管理 & 风险评估"]
        Draft1 --> DepWorkshop[依赖识别会议<br/>• 依赖可视化<br/>• 解决方案讨论]
        DepWorkshop --> RiskWorkshop[风险评估会议<br/>• 风险识别<br/>• 应对措施]
        RiskWorkshop --> TeamBreakout2[团队调整规划<br/>• 解决依赖冲突<br/>• 应对风险<br/>• 优化计划]
        TeamBreakout2 --> Draft2[调整版PI Board<br/>展示]
    end
    
    subgraph FINAL["最终确认"]
        Draft2 --> PIObj[PI Objectives确认]
        Draft2 --> TeamCommit[团队承诺]
        Draft2 --> Management[管理层批准]
        
        PIObj --> Release[发布PI计划]
        TeamCommit --> Release
        Management --> Release
    end
    
    Release --> Sprint1[Sprint 1启动]
    
    classDef prepStyle fill:#e8f5e9,stroke:#4caf50
    classDef day1Style fill:#e3f2fd,stroke:#2196f3
    classDef day2Style fill:#fff3e0,stroke:#ff9800
    classDef finalStyle fill:#f3e5f5,stroke:#9c27b0
    
    class WIBacklog,TeamCap,Priority prepStyle
    class Vision,Arch,TeamBreakout1,Draft1 day1Style
    class DepWorkshop,RiskWorkshop,TeamBreakout2,Draft2 day2Style
    class PIObj,TeamCommit,Management,Release finalStyle
```

---

## 🏢 组织架构层设计

### 1. 组织架构模型

```mermaid
classDiagram
    class Company {
        +string id
        +string name
        +string code
        +string country
        +BusinessUnit[] businessUnits
        +User ceo
        +getOrganizationChart() OrgChart
    }
    
    class BusinessUnit {
        +string id
        +string name
        +string code
        +string companyId FK
        +Domain domain
        +Department[] departments
        +User generalManager
        +Budget budget
        +getRevenue() Revenue
    }
    
    class Department {
        +string id
        +string name
        +string code
        +string businessUnitId FK
        +Function function
        +Team[] teams
        +User manager
        +int headcount
        +getCostCenter() CostCenter
    }
    
    class Team {
        +string id
        +string name
        +string code
        +string departmentId FK
        +TeamMember[] members
        +string[] responsibleModules FK "⭐ 核心"
        +int capacity
        +string currentPI FK
        +string currentSprint FK
        +TeamMetrics metrics
        +getVelocity() number
    }
    
    class TeamMember {
        +string id
        +string userId FK
        +string teamId FK
        +string name
        +Role role
        +int weeklyCapacity
        +Skill[] skills
        +int experienceYears
        +getUtilization() number
    }
    
    Company "1" --> "*" BusinessUnit
    BusinessUnit "1" --> "*" Department
    Department "1" --> "*" Team
    Team "1" --> "*" TeamMember
```

### 2. 组织架构层级示例

```mermaid
graph TB
    Company["智能驾驶科技有限公司<br/>(Company)"]
    
    Company --> BU1["智能驾驶事业部<br/>(Business Unit)<br/>领域: ADAS/AD"]
    Company --> BU2["智能座舱事业部<br/>(Business Unit)<br/>领域: Cockpit"]
    Company --> BU3["车联网事业部<br/>(Business Unit)<br/>领域: TSP"]
    
    BU1 --> Dept1["感知部<br/>(Department)<br/>职能: Perception"]
    BU1 --> Dept2["决策规划部<br/>(Department)<br/>职能: Planning & Control"]
    BU1 --> Dept3["仿真测试部<br/>(Department)<br/>职能: Testing"]
    
    Dept1 --> Team1["相机感知团队<br/>(Team)<br/>负责: MOD-001, MOD-002"]
    Dept1 --> Team2["雷达感知团队<br/>(Team)<br/>负责: MOD-003, MOD-004"]
    Dept1 --> Team3["融合感知团队<br/>(Team)<br/>负责: MOD-005"]
    
    Dept2 --> Team4["全局规划团队<br/>(Team)<br/>负责: MOD-006, MOD-007"]
    Dept2 --> Team5["局部规划团队<br/>(Team)<br/>负责: MOD-008"]
    Dept2 --> Team6["控制团队<br/>(Team)<br/>负责: MOD-009, MOD-010"]
    
    Team1 --> Member1["张三<br/>Tech Lead"]
    Team1 --> Member2["李四<br/>Senior Dev"]
    Team1 --> Member3["王五<br/>Dev"]
    Team1 --> Member4["赵六<br/>QA"]
    
    classDef companyStyle fill:#e8f5e9,stroke:#4caf50,stroke-width:3px
    classDef buStyle fill:#e3f2fd,stroke:#2196f3,stroke-width:2px
    classDef deptStyle fill:#fff3e0,stroke:#ff9800,stroke-width:2px
    classDef teamStyle fill:#f3e5f5,stroke:#9c27b0,stroke-width:2px
    classDef memberStyle fill:#fce4ec,stroke:#e91e63
    
    class Company companyStyle
    class BU1,BU2,BU3 buStyle
    class Dept1,Dept2,Dept3 deptStyle
    class Team1,Team2,Team3,Team4,Team5,Team6 teamStyle
    class Member1,Member2,Member3,Member4 memberStyle
```

---

## 📋 需求与任务层级设计

### 1. 三层需求分解

```mermaid
flowchart TD
    subgraph L1["L1: 用户需求层 (User Requirement)"]
        UR1[UR-001: 高速NOA自动换道优化<br/>• 来源: 客户反馈<br/>• 业务价值: 高<br/>• 关联产品: PRO-001]
    end
    
    subgraph L2["L2: 特性需求层 (Feature Requirement)"]
        FR1[FR-001: 融合感知优化<br/>• 关联Feature: FEAT-001]
        FR2[FR-002: 决策规划增强<br/>• 关联Feature: FEAT-002]
        FR3[FR-003: 控制平滑性提升<br/>• 关联Feature: FEAT-003]
        
        UR1 -.satisfy.-> FR1
        UR1 -.satisfy.-> FR2
        UR1 -.satisfy.-> FR3
    end
    
    subgraph L3["L3: 模块需求层 (Module Requirement)"]
        MR1[MR-001: 目标检测精度提升<br/>• 关联Module: MOD-001<br/>• ⭐ 自动分配Team: TEAM-001]
        MR2[MR-002: 目标追踪稳定性<br/>• 关联Module: MOD-004<br/>• ⭐ 自动分配Team: TEAM-003]
        MR3[MR-003: 换道决策逻辑优化<br/>• 关联Module: MOD-006<br/>• ⭐ 自动分配Team: TEAM-004]
        MR4[MR-004: 横向控制平滑<br/>• 关联Module: MOD-009<br/>• ⭐ 自动分配Team: TEAM-006]
        
        FR1 -.decompose.-> MR1
        FR1 -.decompose.-> MR2
        FR2 -.decompose.-> MR3
        FR3 -.decompose.-> MR4
    end
    
    subgraph WI_L1["工作项层 - L1 (Module Requirement)"]
        WI1[WI-001<br/>type: module_requirement<br/>title: 目标检测精度提升<br/>moduleId: MOD-001<br/>teamId: TEAM-001 ⭐]
        WI2[WI-002<br/>type: module_requirement<br/>title: 目标追踪稳定性<br/>moduleId: MOD-004<br/>teamId: TEAM-003 ⭐]
        
        MR1 -.生成.-> WI1
        MR2 -.生成.-> WI2
    end
    
    subgraph WI_L2["工作项层 - L2 (Task) ⭐ 同一模型"]
        T1[WI-Task-001<br/>type: task<br/>title: 数据集标注<br/>parentWorkItemId: WI-001<br/>Assignee: 张三<br/>8h]
        T2[WI-Task-002<br/>type: task<br/>title: 模型训练<br/>parentWorkItemId: WI-001<br/>Assignee: 李四<br/>16h]
        T3[WI-Task-003<br/>type: task<br/>title: 模型部署<br/>parentWorkItemId: WI-001<br/>Assignee: 王五<br/>8h]
        
        WI1 -.Sprint Planning分解.-> T1
        WI1 -.Sprint Planning分解.-> T2
        WI1 -.Sprint Planning分解.-> T3
    end
    
    classDef urStyle fill:#e8f5e9,stroke:#4caf50
    classDef frStyle fill:#e3f2fd,stroke:#2196f3
    classDef mrStyle fill:#fff3e0,stroke:#ff9800
    classDef wiL1Style fill:#fff9c4,stroke:#fbc02d,stroke-width:3px
    classDef wiL2Style fill:#e1f5fe,stroke:#0288d1,stroke-width:2px
    
    class UR1 urStyle
    class FR1,FR2,FR3 frStyle
    class MR1,MR2,MR3,MR4 mrStyle
    class WI1,WI2 wiL1Style
    class T1,T2,T3 wiL2Style
```

### 2. 工作项数据结构

```typescript
/**
 * 工作项基础接口 ⭐ 统一模型
 */
interface WorkItemBase {
  // 基本信息
  id: string
  code: string
  title: string
  description: string
  type: WorkItemType                   // ⭐ 工作项类型
  
  // 层级关系 ⭐⭐⭐
  parentWorkItemId?: string            // ⭐ 父工作项（支持层级分解）
  childWorkItemIds?: string[]          // 子工作项列表
  
  // 关联关系
  moduleId?: string                    // 关联模块（核心）
  moduleRequirementId?: string         // 关联模块需求（如果是需求类型）
  assignedTeamId?: string              // 分配的团队 ⭐ 自动分配
  assignedTeamName?: string
  assignedSprintId?: string            // 分配的Sprint
  assignedSprintName?: string
  assignee?: string                    // ⭐ 分配给成员（task类型必填）
  assigneeName?: string
  
  // 工作量
  estimatedHours: number
  actualHours?: number
  storyPoints?: number
  
  // 优先级和状态
  priority: Priority                   // P0, P1, P2, P3
  status: WorkItemStatus              // backlog, planned, in_progress, completed
  progress: number                     // 0-100
  
  // 其他
  createdBy: string
  createdAt: Date
  updatedAt: Date
  tags: string[]
  
  // 方法
  decompose(): WorkItem[]              // ⭐ 分解为子工作项
}

/**
 * 工作项类型枚举 ⭐ 8种类型
 */
enum WorkItemType {
  TASK = 'task',                       // ⭐ 任务：最小执行单元
  TECHNICAL_TASK = 'technical_task',   // ⭐ 技术任务：重构、优化
  MODULE_REQUIREMENT = 'module_requirement',
  TEST_TASK = 'test_task',             // ⭐ 测试任务
  BUG = 'bug',                         // ⭐ 缺陷
  TECH_DEBT = 'tech_debt',
  RESEARCH = 'research',
  SUBTASK = 'subtask'                  // ⭐ 子任务
}

/**
 * 任务类型工作项 ⭐
 */
interface TaskWorkItem extends WorkItemBase {
  type: WorkItemType.TASK
  assignee: string                     // 必需
  taskType: 'development' | 'review' | 'deployment' | 'documentation'
  subtaskIds?: string[]
  validateCompletion(): boolean
}

/**
 * 技术任务类型工作项 ⭐
 */
interface TechnicalTaskWorkItem extends WorkItemBase {
  type: WorkItemType.TECHNICAL_TASK
  assignee: string                     // 必需
  technicalArea: 'refactor' | 'optimize' | 'upgrade' | 'migration'
  technicalContext: string
  complexityScore: number
  estimateTechnicalRisk(): Risk
}

/**
 * 模块需求类型工作项
 */
interface ModuleRequirementWorkItem extends WorkItemBase {
  type: WorkItemType.MODULE_REQUIREMENT
  moduleRequirementId: string          // 必需
  moduleId: string                     // 必需 ⭐
  featureRequirementId?: string
  requirementType: 'functional' | 'non_functional'
  acceptanceCriteria: string[]
}

/**
 * 测试任务类型工作项 ⭐
 */
interface TestTaskWorkItem extends WorkItemBase {
  type: WorkItemType.TEST_TASK
  assignee: string                     // 必需
  testType: 'unit' | 'integration' | 'e2e' | 'performance'
  testSuite: string
  testCaseCount: number
  coverageTarget: string
  runTests(): TestResult
}

/**
 * 缺陷类型工作项
 */
interface BugWorkItem extends WorkItemBase {
  type: WorkItemType.BUG
  bugId: string                        // 关联Bug ID
  severity: 'critical' | 'major' | 'minor' | 'trivial'
  affectedVersion: string
  reportedBy: string
  reportedDate: Date
  reproductionSteps: string[]
  rootCause?: string
}

/**
 * 技术债类型工作项
 */
interface TechDebtWorkItem extends WorkItemBase {
  type: WorkItemType.TECH_DEBT
  debtType: 'code_quality' | 'architecture' | 'documentation' | 'test_coverage'
  impact: 'high' | 'medium' | 'low'
  interestRate: number                 // 每周增加的成本估算
  technicalContext: string
  refactoringPlan: string
}

/**
 * 技术调研类型工作项
 */
interface ResearchWorkItem extends WorkItemBase {
  type: WorkItemType.RESEARCH
  topic: string
  objective: string
  methodology: string
  deliverables: string[]
  timeline: string
  conclusion?: string
  nextSteps?: string[]
}

/**
 * 子任务类型工作项 ⭐
 */
interface SubTaskWorkItem extends WorkItemBase {
  type: WorkItemType.SUBTASK
  assignee: string                     // 必需
  parentTaskId: string                 // 必需（等同于parentWorkItemId）
  sequenceOrder: number
  isBlocking: boolean
}
```

---

## 🔄 完整工作流程

### 从需求到交付的完整流程

```mermaid
stateDiagram-v2
    [*] --> RequirementInput: 需求输入
    
    state "需求分析" as ReqAnalysis {
        [*] --> UserReq
        UserReq --> FeatureReq: 分解
        FeatureReq --> ModuleReq: 分解
        ModuleReq --> [*]
    }
    
    RequirementInput --> ReqAnalysis
    
    state "工作项创建" as WICreation {
        [*] --> CreateWI
        CreateWI --> SetModule: 设置moduleId
        SetModule --> AutoAssignTeam: 自动分配团队 ⭐
        AutoAssignTeam --> WIBacklog: 进入工作项池
        WIBacklog --> [*]
    }
    
    ReqAnalysis --> WICreation
    
    state "PI Planning" as PIP {
        [*] --> CollectWI: 收集所有工作项
        CollectWI --> Prioritize: 优先级排序
        Prioritize --> TeamPlan: 团队规划
        TeamPlan --> IdentifyDep: 识别依赖
        IdentifyDep --> AssessRisk: 评估风险
        AssessRisk --> AllocateSprint: 分配Sprint
        AllocateSprint --> PIObjective: 确定PI目标
        PIObjective --> [*]
    }
    
    WICreation --> PIP
    
    state "Sprint Planning" as SP {
        [*] --> SelectWI: 选择工作项
        SelectWI --> DecomposeWI: 分解工作项 ⭐
        DecomposeWI --> CreateSubWI: 创建子工作项(type: task)
        CreateSubWI --> EstimateWI: 估算工作量
        EstimateWI --> AssignWI: 分配工作项给成员 ⭐
        AssignWI --> SprintBacklog: Sprint Backlog
        SprintBacklog --> [*]
    }
    
    PIP --> SP
    
    state "Sprint执行" as SE {
        [*] --> DailyStandup: 每日站会
        DailyStandup --> Coding: 开发编码
        Coding --> CodeReview: 代码审查
        CodeReview --> Testing: 测试
        Testing --> Done: 完成
        Done --> [*]
        
        Coding --> DailyStandup: 持续
        Testing --> Coding: 修复Bug
    }
    
    SP --> SE
    
    state "Sprint结束" as SR {
        [*] --> SprintReview: Sprint评审
        SprintReview --> SprintRetro: Sprint回顾
        SprintRetro --> Increment: 可发布增量
        Increment --> [*]
    }
    
    SE --> SR
    
    SR --> [*]: 交付
    SR --> SP: 下一个Sprint
```

---

## 📊 核心实体关系总结

### 关联关系表

| 实体 | 关联到 | 关联字段 | 关系类型 | 说明 |
|------|--------|----------|----------|------|
| **Company** | BusinessUnit | businessUnits[] | 1:N | 公司包含多个事业部 |
| **BusinessUnit** | Department | departments[] | 1:N | 事业部包含多个部门 |
| **Department** | Team | teams[] | 1:N | 部门包含多个团队 |
| **Team** | TeamMember | members[] | 1:N | 团队包含多个成员 |
| **Team** | Module | responsibleModules[] | N:M | ⭐ 团队负责多个模块 |
| **Module** | ModuleRequirement | moduleId | 1:N | 模块有多个模块需求 |
| **ModuleRequirement** | WorkItem | moduleRequirementId | 1:1 | 模块需求生成工作项 |
| **WorkItem** | Module | moduleId | N:1 | ⭐ 工作项关联模块 |
| **WorkItem** | Team | assignedTeamId | N:1 | ⭐ 工作项自动分配团队 |
| **WorkItem** | Sprint | assignedSprintId | N:1 | 工作项分配到Sprint |
| **WorkItem** | WorkItem | parentWorkItemId | N:1 | ⭐⭐⭐ 工作项层级分解（核心变更） |
| **WorkItem** | TeamMember | assignee | N:1 | ⭐ 工作项分配给成员 |
| **Sprint** | Team | teamId | N:1 | ⭐ Sprint属于团队 |
| **Sprint** | PI | piId | N:1 | Sprint属于PI |

**关键关系链**:
```
Module ←→ Team (responsibleModules) ⭐ 核心绑定
   ↓ 自动分配
WorkItem (moduleId → assignedTeamId) ⭐ 自动分配
   ↓ 分解
WorkItem (parentWorkItemId) ⭐⭐⭐ 工作项层级分解
   ↓ 分配
WorkItem (assignee) → 团队成员执行
   ↓ 交付
Sprint (teamId) → 团队交付
```

---

## ⚠️ 设计改进与扩展

### 1. 组织架构层增强 (P0 - 已补充)

**当前设计**: ✅ 已包含 Company → BusinessUnit → Department → Team

**价值**:
- ✅ 支持大型组织
- ✅ 权限管理清晰
- ✅ 资源分配明确
- ✅ 成本核算完整

### 2. 项目层完善建议 (P1)

**当前状态**: ⚠️ 有车型项目和领域项目，但与PI Planning集成不够紧密

**改进方案**:
```typescript
interface Project {
  id: string
  name: string
  type: 'vehicle' | 'domain'
  productIds: string[]
  teamIds: string[]
  piPlannings: string[]           // 关联的PI Planning
  milestones: Milestone[]
  budget: Budget
  startDate: Date
  targetDate: Date
  status: ProjectStatus
}

interface Milestone {
  id: string
  name: string
  projectId: string
  targetDate: Date
  deliverables: string[]
  dependentTeams: string[]
  status: 'pending' | 'in_progress' | 'completed' | 'delayed'
}
```

### 3. 模块-团队绑定灵活化 (P2)

**当前状态**: ⚠️ 静态绑定，无主责/协助区分

**改进方案**:
```typescript
interface ModuleTeamAssignment {
  moduleId: string
  teamId: string
  role: 'primary' | 'secondary'      // 主责/协助
  percentage: number                 // 负责比例 (0-100)
  effectiveFrom: Date
  effectiveTo?: Date
  reason: string
}

// 使用场景
const assignments: ModuleTeamAssignment[] = [
  {
    moduleId: 'MOD-001',
    teamId: 'TEAM-001',
    role: 'primary',
    percentage: 80,
    effectiveFrom: new Date('2025-01-01')
  },
  {
    moduleId: 'MOD-001',
    teamId: 'TEAM-002',
    role: 'secondary',
    percentage: 20,
    effectiveFrom: new Date('2025-01-01'),
    reason: '协助开发特定子功能'
  }
]
```

### 4. 工作项优先级算法 (P2)

```typescript
/**
 * 工作项优先级评分算法
 */
function calculateWorkItemPriority(workItem: WorkItem): number {
  let score = 0;
  
  // 1. 业务价值 (0-40分)
  score += workItem.businessValue * 0.4;
  
  // 2. 技术风险 (0-30分)
  score += workItem.technicalRisk * 0.3;
  
  // 3. 紧急度 (0-20分)
  score += workItem.urgency * 0.2;
  
  // 4. 依赖关系 (0-10分)
  if (workItem.isBlocker) {
    score += 10;
  } else if (workItem.hasBlockers) {
    score -= 5;
  }
  
  return score;
}
```

---

## ✅ 设计优势总结

### 1. 模块-团队责任绑定机制 ⭐⭐⭐
- ✅ 清晰的责任界定
- ✅ 自动化工作分配
- ✅ 利于绩效考核
- ✅ 减少协调成本

### 2. 工作项统一模型 ⭐⭐⭐
- ✅ WorkItem作为基础抽象模型
- ✅ Task是WorkItem的一种类型（核心变更）
- ✅ 8种工作项类型覆盖所有场景
- ✅ 支持灵活的层级分解（parentWorkItemId）
- ✅ 统一排期和分配
- ✅ 统一度量和追溯
- ✅ 完整的价值流跟踪

### 3. 需求到执行的清晰映射 ⭐⭐⭐
- ✅ 需求三层分解：UserRequirement → FeatureRequirement → ModuleRequirement
- ✅ 工作项灵活分解：ModuleRequirement (WorkItem) → Task (WorkItem) → SubTask (WorkItem)
- ✅ 端到端可追溯
- ✅ 符合实际业务
- ✅ 取消Story层，简化流程

### 4. 组织架构完整 ⭐⭐
- ✅ 支持大型组织
- ✅ 四层组织结构
- ✅ 权限和成本清晰

### 5. PI Planning流程完善 ⭐⭐
- ✅ 2天标准流程
- ✅ 依赖和风险管理
- ✅ 团队自组织
- ✅ 可视化工具支持

---

## 🚀 后续迭代计划

### Phase 1: 核心功能完善 (当前)
- ✅ 工作项统一管理
- ✅ 模块-团队绑定
- ✅ 组织架构设计
- ✅ PI Planning流程

### Phase 2: 项目管理增强 (Q1 2025)
- 🎯 Project与PI Planning深度集成
- 🎯 Milestone管理和跟踪
- 🎯 跨项目资源协调

### Phase 3: 智能化提升 (Q2 2025)
- 🎯 工作项优先级算法
- 🎯 团队产能预测
- 🎯 风险智能识别
- 🎯 依赖自动检测

### Phase 4: 度量与优化 (Q3 2025)
- 🎯 价值流度量
- 🎯 团队效能分析
- 🎯 瓶颈识别和优化建议
- 🎯 成本效益分析

---

## 📝 参考文档

### 类型定义
- `frontend/src/types/work-item.ts` - 工作项类型定义
- `frontend/src/types/task.ts` - 任务类型定义
- `frontend/src/types/team.ts` - 团队类型定义
- `frontend/src/types/organization.ts` - 组织架构类型定义
- `frontend/src/types/project.ts` - 项目类型定义
- `frontend/src/types/sprint.ts` - Sprint类型定义

### 业务流程
- `platform-rd-process/01-VALUE_STREAM_MAPPING.md` - 价值流映射
- `platform-rd-process/02-PI_PLANNING_DESIGN.md` - PI Planning设计
- `platform-rd-process/03-VALUE_STREAM_WITH_PI_PLANNING.md` - 完整价值流

### 架构设计
- `Architecture/v2/01-business/BUSINESS_ARCHITECTURE_V3.md` - 业务架构v3.0
- `Architecture/v2/02-domain/DOMAIN_MODEL_VISUALIZATION.md` - 领域模型可视化
- `Architecture/v2/05-data/DATA_RELATIONSHIP_ANALYSIS.md` - 数据关系分析

---

**文档版本**: V3.0  
**最后更新**: 2025年1月10日  
**维护团队**: 产品架构团队  
**审核状态**: ✅ 已审核通过

