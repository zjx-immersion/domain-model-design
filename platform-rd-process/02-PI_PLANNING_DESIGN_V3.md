# Auto DevOps平台 - PI Planning设计 v3.0

> **文档版本**: v3.0 ⭐ NEW  
> **创建日期**: 2025-01-10  
> **重大变更**: 基于工作项统一管理的PI Planning流程

---

## 📋 目录

1. [PI Planning概述](#一pi-planning概述)
2. [v3.0核心变更](#二v30核心变更)
3. [价值流位置](#三价值流位置)
4. [PI Planning流程设计](#四pi-planning流程设计)
5. [可视化协同工具](#五可视化协同工具)
6. [功能与页面设计](#六功能与页面设计)
7. [角色与职责](#七角色与职责)

---

## 一、PI Planning概述

### 1.1 什么是PI Planning

**PI (Program Increment)**: 项目群增量，通常为8-12周的固定时间盒，包含4-6个Sprint。

**PI Planning**: 多项目团队的同步规划活动，目的是：
- **承接上层**：产品线路线图、产品版本计划、特性需求
- **启动下层**：跨团队协同、Sprint规划、资源分配、依赖识别

### 1.2 PI Planning的价值

```yaml
对产品线:
  - 确保多产品版本对齐
  - 识别跨产品依赖
  - 优化资源分配
  - 价值最大化

对团队:
  - 明确PI目标
  - 识别团队间依赖
  - 同步开发节奏
  - 自主规划能力

对管理:
  - 可视化进度和风险
  - 数据驱动决策
  - 及时调整计划
  - 透明度提升
```

### 1.3 PI Planning的输入输出

```mermaid
graph LR
    subgraph INPUT["输入 (来自上层)"]
        Roadmap[产品线路线图]
        VersionPlan[产品版本计划]
        WIBacklog[工作项Backlog ⭐<br/>6种类型混合]
        Resources[可用资源]
        Constraints[技术约束]
    end
    
    subgraph PROCESS["处理过程 (2天)"]
        Align[需求对齐与澄清]
        Capacity[团队容量规划]
        Assign[工作项分配与排期 ⭐]
        Dep[依赖识别与解决]
        Risk[风险评估与应对]
    end
    
    subgraph OUTPUT["输出 (给到下层)"]
        PIObj[PI目标<br/>PI Objectives]
        TeamPlan[团队迭代计划<br/>4-6个Sprint]
        DepMatrix[依赖矩阵<br/>Dependency Matrix]
        RiskBoard[风险清单<br/>Risk Board]
        PIBoard[PI看板<br/>PI Board]
    end
    
    INPUT --> PROCESS
    PROCESS --> OUTPUT
    
    classDef inputStyle fill:#e8f5e9,stroke:#4caf50
    classDef processStyle fill:#e3f2fd,stroke:#2196f3
    classDef outputStyle fill:#fff3e0,stroke:#ff9800
    
    class Roadmap,VersionPlan,WIBacklog,Resources,Constraints inputStyle
    class Align,Capacity,Assign,Dep,Risk processStyle
    class PIObj,TeamPlan,DepMatrix,RiskBoard,PIBoard outputStyle
```

---

## 二、v3.0核心变更

### 2.1 取消Story层，直接规划工作项

**旧流程 (v2.x)**:
```
Feature Requirement → Story → PI Planning → Task
```

**新流程 (v3.0)**:
```
工作项Backlog (6种类型) → PI Planning → Sprint → Task
```

### 2.2 工作项统一管理

#### 6种工作项类型

```mermaid
mindmap
  root((工作项<br/>Work Item))
    需求类
      module_requirement
        来自需求分解
        最常见
    缺陷类
      bugfix
        测试发现
        用户反馈
        生产问题
    技术类
      tech_debt
        代码重构
        架构优化
      non_functional
        性能优化
        安全加固
        可靠性提升
    改进类
      optimization
        用户体验
        流程改进
        工具优化
      research
        技术预研
        POC验证
```

#### 工作项数据结构

```typescript
interface WorkItem {
  // 基本信息
  id: string
  code: string
  title: string
  description: string
  type: WorkItemType           // ⭐ 6种类型
  
  // 核心关联 ⭐⭐⭐
  moduleId?: string            // 关联模块
  assignedTeamId?: string      // 自动分配的团队
  assignedSprintId?: string    // PI Planning分配的Sprint
  
  // 工作量
  estimatedHours: number
  storyPoints?: number
  
  // 优先级和状态
  priority: Priority           // P0, P1, P2, P3
  status: WorkItemStatus       // backlog, planned, in_progress, completed
  progress: number
  
  // 其他
  tags: string[]
  createdBy: string
  createdAt: Date
}
```

### 2.3 自动团队分配机制

```mermaid
sequenceDiagram
    participant WI as 工作项<br/>(WorkItem)
    participant Module as 模块<br/>(Module)
    participant Team as 团队<br/>(Team)
    participant PI as PI Planning
    
    Note over WI: 工作项创建<br/>moduleId: MOD-001
    
    WI->>Module: 查询模块信息
    Module->>Team: 查找负责团队<br/>"MOD-001" IN responsibleModules
    Team-->>WI: 推荐团队<br/>teamId: TEAM-001 ⭐
    
    Note over WI,Team: 自动分配完成
    
    WI->>PI: 进入PI Planning<br/>推荐团队: TEAM-001
    PI->>Team: 团队确认接收
    Team-->>PI: 确认
    
    Note over PI: 分配到Sprint
    
    PI->>WI: assignedSprintId<br/>= SPR-2025-Q1-S1
```

---

## 三、价值流位置

### 3.1 三层价值流结构

```mermaid
graph TB
    subgraph STRATEGIC["战略层 (12-24个月)"]
        Stage0[阶段0: 战略规划<br/>• 产品线路线图<br/>• 产品版本规划<br/>• 特性Backlog]
    end
    
    subgraph COORDINATION["协同层 (8-12周) ⭐ PI Planning"]
        Stage0A[阶段0A: PI Planning<br/>• 多项目对齐<br/>• 工作项分配 ⭐ NEW<br/>• 依赖管理<br/>• 风险评估]
    end
    
    subgraph EXECUTION["执行层 (2-4周)"]
        Stage1[阶段1: 需求输入]
        Stage2[阶段2: 需求分析]
        Stage3[阶段3: 资产规划]
        Stage4[阶段4: 方案设计]
        Stage5[阶段5: 开发实现]
        Stage6[阶段6: 测试验证]
        Stage7[阶段7: 发布交付]
        
        Stage1 --> Stage2 --> Stage3 --> Stage4
        Stage4 --> Stage5 --> Stage6 --> Stage7
    end
    
    Stage0 ==> Stage0A
    Stage0A ==> Stage1
    
    classDef strategicStyle fill:#e8f5e9,stroke:#4caf50,stroke-width:3px
    classDef coordStyle fill:#fff9c4,stroke:#fbc02d,stroke-width:3px
    classDef execStyle fill:#e3f2fd,stroke:#2196f3
    
    class Stage0 strategicStyle
    class Stage0A coordStyle
    class Stage1,Stage2,Stage3,Stage4,Stage5,Stage6,Stage7 execStyle
```

### 3.2 PI Planning的承上启下作用

```mermaid
graph TD
    subgraph UP["承上：接收战略输入"]
        Roadmap[产品线路线图<br/>12-24个月]
        Version[产品版本计划<br/>多产品×多版本]
        Features[特性Backlog<br/>已排序]
        WI[工作项Backlog ⭐<br/>多种类型]
    end
    
    PI[PI Planning<br/>8-12周]
    
    subgraph DOWN["启下：输出执行计划"]
        Obj[PI Objectives<br/>明确目标]
        Plan[团队迭代计划<br/>4-6个Sprint]
        Dep[依赖矩阵<br/>明确依赖]
        Risk[风险看板<br/>应对措施]
    end
    
    Roadmap --> PI
    Version --> PI
    Features --> PI
    WI --> PI
    
    PI --> Obj
    PI --> Plan
    PI --> Dep
    PI --> Risk
    
    Obj --> Sprint1[Sprint 1]
    Plan --> Sprint1
    Dep --> Sprint1
    Risk --> Sprint1
    
    classDef upStyle fill:#e8f5e9,stroke:#4caf50
    classDef piStyle fill:#fff9c4,stroke:#fbc02d,stroke-width:3px
    classDef downStyle fill:#e3f2fd,stroke:#2196f3
    
    class Roadmap,Version,Features,WI upStyle
    class PI piStyle
    class Obj,Plan,Dep,Risk,Sprint1 downStyle
```

---

## 四、PI Planning流程设计

### 4.1 完整流程图（v3.0）

```mermaid
flowchart TB
    subgraph PREP["准备阶段 (PI开始前1-2周)"]
        direction TB
        
        Collect[收集工作项Backlog ⭐<br/>• module_requirement<br/>• bugfix<br/>• tech_debt<br/>• non_functional<br/>• optimization<br/>• research]
        
        AutoAssign[自动分配推荐团队 ⭐<br/>基于moduleId]
        
        Prioritize[优先级排序<br/>• 业务价值<br/>• 技术风险<br/>• 紧急度<br/>• 依赖关系]
        
        CapPlan[团队产能规划<br/>• 统计可用小时<br/>• 考虑假期和预留]
        
        Collect --> AutoAssign
        AutoAssign --> Prioritize
        Prioritize --> CapPlan
    end
    
    subgraph DAY1["Day 1: 业务背景 & 团队规划"]
        direction TB
        
        Morning1[上午: 全体会议]
        Vision[产品愿景讲解<br/>产品经理]
        Arch[架构演进讲解<br/>架构师]
        WIReview[工作项概览 ⭐<br/>特性负责人]
        
        Afternoon1[下午: 团队分组规划]
        TeamBreakout1[团队分组会议<br/>• 评审分配的工作项<br/>• 细化工作项描述<br/>• 初步拆分Task<br/>• 评估工作量<br/>• 识别初步依赖]
        
        Draft1[初版PI Board展示<br/>每个团队5分钟]
        
        Morning1 --> Vision --> Arch --> WIReview
        WIReview --> Afternoon1
        Afternoon1 --> TeamBreakout1 --> Draft1
    end
    
    subgraph DAY2["Day 2: 依赖管理 & 风险评估"]
        direction TB
        
        Morning2[上午: 依赖识别]
        DepWorkshop[依赖识别会议<br/>• 依赖可视化<br/>• 依赖解决方案<br/>• 调整工作项分配]
        
        Lunch[午餐: 风险评估]
        RiskWorkshop[风险评估会议<br/>• 风险识别<br/>• 风险评分<br/>• 应对措施]
        
        Afternoon2[下午: 计划调整]
        TeamBreakout2[团队调整规划<br/>• 解决依赖冲突<br/>• 应对风险<br/>• 优化工作项排期<br/>• 确认Sprint分配]
        
        Draft2[最终PI Board展示<br/>每个团队5分钟]
        
        Morning2 --> DepWorkshop
        DepWorkshop --> Lunch
        Lunch --> RiskWorkshop
        RiskWorkshop --> Afternoon2
        Afternoon2 --> TeamBreakout2 --> Draft2
    end
    
    subgraph FINALIZE["最终确认"]
        direction TB
        
        PIObj[PI Objectives确认<br/>每个团队的目标]
        TeamCommit[团队承诺<br/>信心投票 1-5]
        Management[管理层批准<br/>资源和风险确认]
        
        Release[发布PI计划<br/>• PI Board<br/>• 依赖矩阵<br/>• 风险看板<br/>• Sprint计划]
        
        PIObj --> TeamCommit
        TeamCommit --> Management
        Management --> Release
    end
    
    PREP --> DAY1
    DAY1 --> DAY2
    DAY2 --> FINALIZE
    FINALIZE --> Sprint1[Sprint 1 启动]
    
    classDef prepStyle fill:#e8f5e9,stroke:#4caf50
    classDef day1Style fill:#e3f2fd,stroke:#2196f3
    classDef day2Style fill:#fff3e0,stroke:#ff9800
    classDef finalStyle fill:#f3e5f5,stroke:#9c27b0
    
    class Collect,AutoAssign,Prioritize,CapPlan prepStyle
    class Morning1,Vision,Arch,WIReview,Afternoon1,TeamBreakout1,Draft1 day1Style
    class Morning2,DepWorkshop,Lunch,RiskWorkshop,Afternoon2,TeamBreakout2,Draft2 day2Style
    class PIObj,TeamCommit,Management,Release,Sprint1 finalStyle
```

### 4.2 准备阶段详细流程

#### 4.2.1 工作项收集与分类

```mermaid
flowchart LR
    subgraph SOURCES["工作项来源"]
        direction TB
        
        Source1[需求分解<br/>ModuleRequirement → WorkItem]
        Source2[Bug Triage<br/>Bug → WorkItem: bugfix]
        Source3[技术规划<br/>TechDebt识别]
        Source4[性能评估<br/>NonFunctional识别]
        Source5[持续改进<br/>Optimization识别]
        Source6[技术调研<br/>Research计划]
    end
    
    subgraph POOL["工作项池"]
        WIBacklog[(WorkItem Backlog<br/>混合6种类型)]
    end
    
    subgraph AUTO["自动处理"]
        AutoTeam[自动分配推荐团队<br/>基于moduleId + responsibleModules]
        AutoPriority[自动计算优先级<br/>业务价值 + 技术风险 + 紧急度]
    end
    
    subgraph OUTPUT["输出"]
        Categorized[分类的工作项列表<br/>按团队 + 按类型]
    end
    
    Source1 --> WIBacklog
    Source2 --> WIBacklog
    Source3 --> WIBacklog
    Source4 --> WIBacklog
    Source5 --> WIBacklog
    Source6 --> WIBacklog
    
    WIBacklog --> AutoTeam
    AutoTeam --> AutoPriority
    AutoPriority --> Categorized
```

#### 4.2.2 团队产能规划

```typescript
/**
 * 团队产能计算
 */
interface TeamCapacity {
  teamId: string
  piDuration: number                    // PI时长（周）
  totalMembers: number
  availableMembers: number              // 扣除休假
  weeklyCapacity: number                // 每周可用小时
  piTotalCapacity: number               // PI总可用小时
  reservedPercentage: number            // 预留百分比（会议、支持等）
  effectiveCapacity: number             // 有效产能
  allocation: {
    sprintId: string
    allocatedHours: number
    allocatedStoryPoints: number
  }[]
}

function calculateTeamCapacity(
  team: Team, 
  piWeeks: number, 
  holidays: Date[]
): TeamCapacity {
  // 1. 计算可用成员（扣除休假）
  const availableMembers = team.members.filter(m => 
    !m.vacation.overlaps(piStartDate, piEndDate)
  ).length;
  
  // 2. 计算周产能（每人40小时/周）
  const weeklyCapacity = availableMembers * 40;
  
  // 3. 计算PI总产能（扣除节假日）
  const workingWeeks = piWeeks - holidays.length / 5;
  const piTotalCapacity = weeklyCapacity * workingWeeks;
  
  // 4. 扣除预留（会议15%、支持10%）
  const reservedPercentage = 0.25;
  const effectiveCapacity = piTotalCapacity * (1 - reservedPercentage);
  
  return {
    teamId: team.id,
    piDuration: piWeeks,
    totalMembers: team.members.length,
    availableMembers,
    weeklyCapacity,
    piTotalCapacity,
    reservedPercentage,
    effectiveCapacity,
    allocation: []
  };
}
```

### 4.3 Day 1: 团队规划

#### 4.3.1 团队分组规划会议流程

```mermaid
stateDiagram-v2
    [*] --> ReviewWI: 开始团队分组
    
    state "评审工作项" as ReviewWI {
        [*] --> CheckList
        CheckList --> Clarify: 需要澄清?
        Clarify --> CheckList
        CheckList --> Accept: 理解清楚
        Accept --> [*]
    }
    
    ReviewWI --> EstimateWI: 所有工作项评审完
    
    state "评估工作项" as EstimateWI {
        [*] --> PlanningPoker
        PlanningPoker --> Discuss: 差异大?
        Discuss --> PlanningPoker
        PlanningPoker --> Record: 达成共识
        Record --> [*]
    }
    
    EstimateWI --> BreakdownTask: 工作量评估完
    
    state "初步拆分任务" as BreakdownTask {
        [*] --> Identify
        Identify --> Estimate
        Estimate --> Assign: 初步分配
        Assign --> [*]
    }
    
    BreakdownTask --> AllocateSprint: 任务拆分完
    
    state "分配到Sprint" as AllocateSprint {
        [*] --> S1
        S1 --> S2: 容量足够?
        S2 --> S3
        S3 --> S4
        S4 --> [*]: 分配完成
    }
    
    AllocateSprint --> IdentifyDep: Sprint分配完
    
    state "识别依赖" as IdentifyDep {
        [*] --> Internal: 内部依赖
        Internal --> External: 外部依赖
        External --> [*]
    }
    
    IdentifyDep --> Draft: 依赖识别完
    
    Draft --> [*]: 初版PI Board完成
```

### 4.4 Day 2: 依赖与风险管理

#### 4.4.1 依赖识别与可视化

```mermaid
graph TB
    subgraph TEAMS["团队"]
        T1[Team 1<br/>感知团队]
        T2[Team 2<br/>融合团队]
        T3[Team 3<br/>决策团队]
        T4[Team 4<br/>控制团队]
    end
    
    subgraph DEP["依赖关系"]
        D1[依赖1: 感知 → 融合<br/>WI-001 → WI-005<br/>Sprint 1 Week 2]
        D2[依赖2: 融合 → 决策<br/>WI-005 → WI-010<br/>Sprint 2 Week 1]
        D3[依赖3: 决策 → 控制<br/>WI-010 → WI-015<br/>Sprint 2 Week 3]
        D4[依赖4: 感知 → 决策<br/>WI-002 → WI-011<br/>Sprint 1 Week 3]
    end
    
    subgraph RISK["风险评估"]
        R1[风险1: 依赖链过长<br/>影响: 高<br/>概率: 中]
        R2[风险2: 接口不稳定<br/>影响: 中<br/>概率: 高]
        R3[风险3: 资源冲突<br/>影响: 低<br/>概率: 中]
    end
    
    T1 --> D1
    T2 --> D2
    T3 --> D3
    T1 --> D4
    
    D1 --> R1
    D2 --> R1
    D3 --> R1
    D1 --> R2
    D2 --> R2
    
    classDef teamStyle fill:#e3f2fd,stroke:#2196f3
    classDef depStyle fill:#fff3e0,stroke:#ff9800
    classDef riskStyle fill:#ffebee,stroke:#f44336
    
    class T1,T2,T3,T4 teamStyle
    class D1,D2,D3,D4 depStyle
    class R1,R2,R3 riskStyle
```

#### 4.4.2 风险评估矩阵

```mermaid
quadrantChart
    title 风险评估矩阵
    x-axis 低概率 --> 高概率
    y-axis 低影响 --> 高影响
    quadrant-1 立即处理
    quadrant-2 制定预案
    quadrant-3 监控
    quadrant-4 接受
    
    依赖链过长: [0.5, 0.8]
    接口不稳定: [0.8, 0.6]
    资源冲突: [0.5, 0.3]
    技术不确定: [0.6, 0.7]
    需求变更: [0.4, 0.5]
```

---

## 五、可视化协同工具

### 5.1 PI Board（工作项看板）

```mermaid
graph LR
    subgraph TEAM1["Team 1: 感知团队"]
        direction TB
        S1T1[Sprint 1<br/>15个工作项<br/>120h]
        S2T1[Sprint 2<br/>12个工作项<br/>100h]
        S3T1[Sprint 3<br/>10个工作项<br/>85h]
        S4T1[Sprint 4<br/>8个工作项<br/>70h]
    end
    
    subgraph TEAM2["Team 2: 融合团队"]
        direction TB
        S1T2[Sprint 1<br/>10个工作项<br/>90h]
        S2T2[Sprint 2<br/>15个工作项<br/>130h]
        S3T2[Sprint 3<br/>12个工作项<br/>105h]
        S4T2[Sprint 4<br/>8个工作项<br/>75h]
    end
    
    subgraph TEAM3["Team 3: 决策团队"]
        direction TB
        S1T3[Sprint 1<br/>8个工作项<br/>70h]
        S2T3[Sprint 2<br/>10个工作项<br/>90h]
        S3T3[Sprint 3<br/>15个工作项<br/>125h]
        S4T3[Sprint 4<br/>12个工作项<br/>100h]
    end
    
    S1T1 -.依赖.-> S1T2
    S2T2 -.依赖.-> S2T3
    
    classDef sprintStyle fill:#e3f2fd,stroke:#2196f3
    
    class S1T1,S2T1,S3T1,S4T1,S1T2,S2T2,S3T2,S4T2,S1T3,S2T3,S3T3,S4T3 sprintStyle
```

### 5.2 依赖网络图

```mermaid
graph TD
    subgraph S1["Sprint 1"]
        WI1[WI-001: 目标检测<br/>Team 1, Week 1-2]
        WI2[WI-002: 车道线检测<br/>Team 1, Week 1-2]
        WI5[WI-005: 传感器融合<br/>Team 2, Week 2-3]
    end
    
    subgraph S2["Sprint 2"]
        WI10[WI-010: 路径规划<br/>Team 3, Week 1-2]
        WI11[WI-011: 决策逻辑<br/>Team 3, Week 2-3]
        WI15[WI-015: 横向控制<br/>Team 4, Week 1-2]
    end
    
    WI1 --> WI5
    WI2 --> WI5
    WI5 --> WI10
    WI5 --> WI11
    WI10 --> WI15
    WI11 --> WI15
    
    classDef s1Style fill:#e8f5e9,stroke:#4caf50
    classDef s2Style fill:#e3f2fd,stroke:#2196f3
    classDef criticalStyle fill:#ffebee,stroke:#f44336,stroke-width:3px
    
    class WI1,WI2,WI5 s1Style
    class WI10,WI11,WI15 s2Style
    class WI5,WI10 criticalStyle
```

### 5.3 团队容量规划器

```typescript
/**
 * 团队容量可视化数据
 */
interface TeamCapacityVisualization {
  teamId: string
  teamName: string
  sprints: {
    sprintId: string
    sprintName: string
    capacity: number               // 可用小时
    planned: number                // 已规划小时
    remaining: number              // 剩余小时
    utilization: number            // 利用率 (%)
    workItems: {
      id: string
      title: string
      estimatedHours: number
      type: WorkItemType
    }[]
  }[]
  piSummary: {
    totalCapacity: number
    totalPlanned: number
    averageUtilization: number
  }
}
```

```mermaid
gantt
    title Team 1 容量规划 (PI 2025-Q1)
    dateFormat YYYY-MM-DD
    
    section Sprint 1 (80h)
    工作项1 (20h)     :2025-01-06, 20h
    工作项2 (15h)     :2025-01-08, 15h
    工作项3 (25h)     :2025-01-10, 25h
    工作项4 (18h)     :2025-01-13, 18h
    剩余容量 (2h)     :2025-01-16, 2h
    
    section Sprint 2 (80h)
    工作项5 (30h)     :2025-01-20, 30h
    工作项6 (22h)     :2025-01-23, 22h
    工作项7 (20h)     :2025-01-27, 20h
    剩余容量 (8h)     :2025-01-30, 8h
```

### 5.4 风险热力图

```typescript
/**
 * 风险数据结构
 */
interface Risk {
  id: string
  title: string
  description: string
  probability: number        // 0-1
  impact: number            // 0-1
  score: number             // probability × impact
  category: 'technical' | 'dependency' | 'resource' | 'external'
  status: 'identified' | 'mitigating' | 'resolved'
  owner: string
  mitigationPlan: string
  contingencyPlan: string
}
```

---

## 六、功能与页面设计

### 6.1 功能模块：F029-PI Planning管理

```yaml
F029: PI Planning管理
  描述: 支持多项目团队的PI Planning协同规划
  
  子功能:
    F029-01: PI创建与配置
      - PI基本信息配置（时间、团队、产品）
      - 工作项Backlog导入 ⭐
      - 自动团队分配预览 ⭐
      
    F029-02: 工作项规划 ⭐ NEW
      - 工作项列表（6种类型混合显示）
      - 工作项优先级排序
      - 工作项-团队-Sprint分配
      - 工作量评估
      
    F029-03: 团队协同规划
      - 团队分组会议支持
      - 实时协同编辑
      - PI Board可视化
      - 团队容量规划器
      
    F029-04: 依赖管理
      - 依赖识别工作坊
      - 依赖网络图可视化
      - 依赖解决方案记录
      - 跨团队依赖追踪
      
    F029-05: 风险管理
      - 风险识别会议
      - 风险评估矩阵
      - 风险应对计划
      - 风险热力图
      
    F029-06: PI目标管理
      - PI Objectives定义
      - 团队承诺确认
      - 信心投票
      - 管理层批准
      
    F029-07: PI执行跟踪
      - PI进度看板
      - 依赖实时状态
      - 风险实时监控
      - PI Burndown Chart
```

### 6.2 关键页面设计

#### 6.2.1 页面列表

| 页面编号 | 页面名称 | 路由 | 说明 |
|---------|---------|------|------|
| **P029-01** | PI Planning列表 | `/pi-planning/list` | 查看所有PI |
| **P029-02** | PI创建向导 | `/pi-planning/create` | 创建新PI |
| **P029-03** | 工作项Backlog准备 ⭐ | `/pi-planning/:id/backlog` | 准备阶段 |
| **P029-04** | 自动分配预览 ⭐ | `/pi-planning/:id/auto-assign` | 查看推荐团队 |
| **P029-05** | Day1-业务背景 | `/pi-planning/:id/day1/context` | 愿景讲解 |
| **P029-06** | Day1-团队规划室 | `/pi-planning/:id/day1/team/:teamId` | 团队分组 |
| **P029-07** | PI Board | `/pi-planning/:id/board` | 看板视图 |
| **P029-08** | Day2-依赖识别 | `/pi-planning/:id/day2/dependencies` | 依赖工作坊 |
| **P029-09** | Day2-风险评估 | `/pi-planning/:id/day2/risks` | 风险工作坊 |
| **P029-10** | PI目标确认 | `/pi-planning/:id/objectives` | 目标确认 |
| **P029-11** | PI执行跟踪 | `/pi-planning/:id/tracking` | 进度跟踪 |

#### 6.2.2 核心页面：工作项Backlog准备（P029-03）⭐

```typescript
/**
 * 页面数据结构
 */
interface PIBacklogPageState {
  pi: PIPlanning
  workItems: WorkItem[]                    // ⭐ 所有工作项
  teams: Team[]
  autoAssignments: Map<string, string>     // ⭐ 工作项ID → 推荐团队ID
  
  filters: {
    type: WorkItemType[]                   // 类型筛选
    team: string[]                         // 团队筛选
    priority: Priority[]                   // 优先级筛选
    status: WorkItemStatus[]               // 状态筛选
    keyword: string                        // 关键词搜索
  }
  
  sorting: {
    field: 'priority' | 'estimatedHours' | 'type' | 'createdAt'
    direction: 'asc' | 'desc'
  }
  
  groupBy: 'team' | 'type' | 'priority' | 'none'
}
```

**页面布局**:
```
┌─────────────────────────────────────────────────────────┐
│ 工作项Backlog准备 - PI 2025-Q1                          │
├─────────────────────────────────────────────────────────┤
│ 筛选器:                                                 │
│  [类型▼] [团队▼] [优先级▼] [状态▼] [搜索...]           │
│  分组: [按团队▼]  排序: [优先级▼]  [自动分配预览]      │
├─────────────────────────────────────────────────────────┤
│ Team 1: 感知团队 (15个工作项, 120小时)                 │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ ☐ WI-001 | module_requirement | P0 | 8h | MOD-001  │ │
│ │   目标检测精度提升                                  │ │
│ │   [详情] [编辑] [依赖: 0] [分配Sprint▼]            │ │
│ ├─────────────────────────────────────────────────────┤ │
│ │ ☐ WI-002 | bugfix | P0 | 5h | MOD-001              │ │
│ │   高速场景目标丢失问题                              │ │
│ │   [详情] [编辑] [依赖: 0] [分配Sprint▼]            │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                          │
│ Team 2: 融合团队 (12个工作项, 100小时)                 │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ ☐ WI-005 | module_requirement | P1 | 13h | MOD-004 │ │
│ │   传感器融合算法优化                                │ │
│ │   [详情] [编辑] [依赖: 2 ⚠] [分配Sprint▼]         │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                          │
│ 统计:                                                    │
│  总工作项: 45  总工作量: 385h  平均利用率: 85%         │
│  [导出Excel] [批量操作▼] [下一步: Day 1规划]           │
└─────────────────────────────────────────────────────────┘
```

#### 6.2.3 核心页面：PI Board（P029-07）

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ PI Board - PI 2025-Q1                                    [打印] [导出] [全屏] │
├─────────────────────────────────────────────────────────────────────────────┤
│                 Sprint 1      Sprint 2      Sprint 3      Sprint 4           │
│                 01/06-01/19   01/20-02/02   02/03-02/16   02/17-03/02       │
├─────────────────┬───────────────────────────────────────────────────────────┤
│ Team 1          │ 15 WI       │ 12 WI       │ 10 WI       │ 8 WI            │
│ 感知团队        │ 120h (95%)  │ 100h (80%)  │ 85h (70%)   │ 70h (60%)       │
│                 │ ┌─────────┐ │ ┌─────────┐ │ ┌─────────┐ │ ┌─────────┐   │
│                 │ │ WI-001  │ │ │ WI-010  │ │ │ WI-020  │ │ │ WI-030  │   │
│                 │ │ P0, 8h  │ │ │ P1, 10h │ │ │ P2, 8h  │ │ │ P3, 5h  │   │
│                 │ └─────────┘ │ └─────────┘ │ └─────────┘ │ └─────────┘   │
├─────────────────┼───────────────────────────────────────────────────────────┤
│ Team 2          │ 10 WI       │ 15 WI       │ 12 WI       │ 8 WI            │
│ 融合团队        │ 90h (75%)   │ 130h (100%) │ 105h (85%)  │ 75h (65%)       │
│                 │ ┌─────────┐ │ ┌─────────┐ │ ┌─────────┐ │ ┌─────────┐   │
│                 │ │ WI-005  │ │ │ WI-015  │ │ │ WI-025  │ │ │ WI-035  │   │
│                 │ │ P1, 13h │ │ │ P0, 15h │ │ │ P1, 12h │ │ │ P2, 8h  │   │
│                 │ │ ⚠ 依赖2 │ │ │ ⚠ 依赖1 │ │ └─────────┘ │ └─────────┘   │
│                 │ └─────────┘ │ └─────────┘ │             │               │
├─────────────────┼───────────────────────────────────────────────────────────┤
│ Team 3          │ 8 WI        │ 10 WI       │ 15 WI       │ 12 WI           │
│ 决策团队        │ 70h (60%)   │ 90h (75%)   │ 125h (95%)  │ 100h (80%)      │
├─────────────────┴───────────────────────────────────────────────────────────┤
│ PI Objectives:                                                               │
│  ✓ Objective 1: 提升感知融合精度到95% (Team 1, Team 2)                      │
│  ✓ Objective 2: 优化决策规划响应时间到50ms (Team 2, Team 3)                │
│  ⚠ Objective 3: 完成AEB功能集成 (Team 1, Team 2, Team 3) - 依赖风险        │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 七、角色与职责

### 7.1 PI Planning中的角色

```mermaid
mindmap
  root((PI Planning))
    组织者
      RTE
        Release Train Engineer
        主持PI Planning
        协调跨团队
      产品线经理
        提供战略方向
        批准PI目标
      架构师
        架构演进讲解
        技术风险评估
    参与者
      产品经理
        产品愿景讲解
        需求优先级
      特性负责人
        Feature讲解
        工作项澄清 ⭐
      团队Lead
        团队规划
        工作量评估
        依赖识别
      团队成员
        参与规划
        任务评估
        技术讨论
    支持者
      Scrum Master
        团队协作
        流程引导
      DevOps工程师
        环境准备
        工具支持
```

### 7.2 角色职责矩阵（RACI）

| 活动 | RTE | 产品线经理 | 产品经理 | 架构师 | 特性负责人 | 团队Lead | 团队成员 | Scrum Master |
|------|-----|----------|---------|-------|-----------|---------|---------|-------------|
| **准备阶段** |
| 收集工作项Backlog ⭐ | A | I | R | C | R | C | - | C |
| 自动分配推荐团队 ⭐ | A | I | I | C | C | R | - | C |
| 优先级排序 | C | A | R | C | C | I | - | I |
| 团队产能规划 | I | I | C | - | I | R | C | A |
| **Day 1** |
| 产品愿景讲解 | I | A | R | C | I | I | I | - |
| 架构演进讲解 | I | I | C | A | I | I | I | - |
| 工作项概览 ⭐ | C | I | C | C | R | I | I | - |
| 团队分组规划 | C | - | C | C | C | A | R | R |
| 初版PI Board | C | I | I | C | C | A | R | R |
| **Day 2** |
| 依赖识别会议 | A | I | C | R | R | R | C | C |
| 风险评估会议 | A | C | C | R | C | R | C | C |
| 调整规划 | C | I | C | C | C | A | R | R |
| 最终PI Board | A | I | I | C | C | R | R | R |
| **最终确认** |
| PI Objectives确认 | A | R | R | C | C | C | I | I |
| 团队承诺 | C | I | I | - | C | A | R | C |
| 管理层批准 | C | A | I | C | I | I | - | - |
| 发布PI计划 | A | I | I | I | I | R | I | C |

**图例**: R=负责, A=批准, C=咨询, I=知会

---

## 八、度量与改进

### 8.1 PI Planning效果度量

| 指标 | 定义 | 目标值 | 数据来源 |
|------|------|--------|---------|
| **PI目标达成率** | 完成的PI Objectives / 总PI Objectives | ≥ 85% | PI Review |
| **团队信心度** | 团队承诺投票平均分 | ≥ 3.5/5 | PI Planning Day 2 |
| **依赖解决率** | 解决的依赖 / 识别的依赖 | ≥ 80% | 依赖矩阵 |
| **风险应对率** | 有应对计划的风险 / 总风险 | 100% | 风险看板 |
| **计划变更率** | Sprint中变更的工作项 / 总工作项 | ≤ 15% | Sprint Backlog |
| **工作项完成率** ⭐ | 完成的工作项 / 计划的工作项 | ≥ 80% | PI Burndown |
| **产能利用率** | 实际工作量 / 计划产能 | 75-85% | Sprint Report |
| **依赖冲突次数** | Sprint中的依赖阻塞次数 | ≤ 3次/PI | 阻塞跟踪 |

### 8.2 持续改进

```mermaid
graph LR
    Measure[度量收集] --> Analyze[数据分析]
    Analyze --> Identify[识别问题]
    Identify --> Plan[改进计划]
    Plan --> Implement[实施改进]
    Implement --> Measure
    
    classDef measureStyle fill:#e8f5e9,stroke:#4caf50
    classDef analyzeStyle fill:#e3f2fd,stroke:#2196f3
    classDef improveStyle fill:#fff3e0,stroke:#ff9800
    
    class Measure measureStyle
    class Analyze,Identify analyzeStyle
    class Plan,Implement improveStyle
```

---

## 九、最佳实践

### 9.1 工作项准备最佳实践 ⭐

1. **提前2周开始收集**
   - 需求分解完成
   - Bug优先级确认
   - 技术债评估完成

2. **确保工作项质量**
   - 标题清晰（动词+对象）
   - 描述完整（5W1H）
   - 验收标准明确
   - 工作量预估合理

3. **自动分配验证**
   - 检查推荐团队是否合理
   - 跨模块工作项需人工确认
   - 新模块需明确责任团队

### 9.2 团队规划最佳实践

1. **Planning Poker**
   - 使用Fibonacci序列
   - 差异>3需讨论
   - 记录假设和风险

2. **任务拆分**
   - 单个任务≤16小时
   - 每个任务可独立验证
   - 明确前置条件和交付物

3. **Sprint分配**
   - 优先分配高优先级
   - 考虑依赖关系
   - 预留20-25%缓冲

### 9.3 依赖管理最佳实践

1. **依赖可视化**
   - 使用依赖网络图
   - 标识关键路径
   - 识别循环依赖

2. **依赖解决**
   - 提前集成
   - Mock/Stub接口
   - 频繁沟通

3. **持续跟踪**
   - 每日站会检查
   - 依赖状态更新
   - 阻塞及时上报

---

## 十、工具与技术

### 10.1 推荐工具栈

| 功能 | 工具 | 说明 |
|------|------|------|
| **协同规划** | Miro / Mural | 在线白板，支持实时协作 |
| **视频会议** | Zoom / Teams | 远程团队支持 |
| **工作项管理** | 平台内置 ⭐ | 本平台 |
| **依赖可视化** | Cytoscape.js | 网络图可视化 |
| **投票** | Menti / Poll | 团队信心投票 |
| **时间管理** | Timer | 时间盒控制 |

### 10.2 技术实现

```typescript
/**
 * PI Planning核心API
 */
interface PIPlanningAPI {
  // 准备阶段
  collectWorkItems(piId: string): Promise<WorkItem[]>
  autoAssignTeams(workItems: WorkItem[]): Promise<Map<string, string>>
  prioritizeWorkItems(workItems: WorkItem[]): Promise<WorkItem[]>
  calculateTeamCapacity(teamId: string, piWeeks: number): Promise<TeamCapacity>
  
  // Day 1
  createPIBoard(piId: string): Promise<PIBoard>
  assignWorkItemToSprint(workItemId: string, sprintId: string): Promise<void>
  breakdownWorkItem(workItemId: string, tasks: Task[]): Promise<void>
  
  // Day 2
  identifyDependency(fromWorkItemId: string, toWorkItemId: string): Promise<Dependency>
  assessRisk(risk: Risk): Promise<void>
  updatePIBoard(piId: string, updates: PIBoardUpdate[]): Promise<PIBoard>
  
  // 最终确认
  definePIObjective(piId: string, objective: PIObjective): Promise<void>
  teamCommit(teamId: string, confidence: number): Promise<void>
  approvePI(piId: string): Promise<void>
  publishPI(piId: string): Promise<void>
}
```

---

## 📝 参考文档

- `../Architecture/v2/01-business/BUSINESS_ARCHITECTURE_V3.md` - 业务架构v3.0
- `../Architecture/v2/04-task/TASK_BASED_ARCHITECTURE_V3.md` - 任务架构v3.0
- `01-VALUE_STREAM_MAPPING.md` - 价值流映射
- `03-VALUE_STREAM_WITH_PI_PLANNING.md` - 完整价值流

---

**文档版本**: v3.0 ⭐  
**最后更新**: 2025年1月10日  
**维护团队**: 产品架构团队 + 敏捷教练团队  
**审核状态**: ✅ 已审核通过

