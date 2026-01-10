# 业务架构设计

> **关注点**: 业务能力模型与业务流程  
> **目标**: 支撑汽车研发业务的平台架构

---

## 📋 目录

1. [业务架构概述](#一业务架构概述)
2. [核心业务域](#二核心业务域)
3. [业务能力模型](#三业务能力模型)
4. [组织架构设计](#四组织架构设计)
5. [业务流程设计](#五业务流程设计)

---

## 一、业务架构概述

### 1.1 业务架构全景

```mermaid
mindmap
  root((汽车研发平台))
    战略规划层
      产品线规划
      技术路线规划
      资产战略规划
      资源规划
    执行管理层
      产品管理
        产品线管理
        产品管理
        版本管理
        特性管理
      项目管理
        整车项目
        领域项目
        PI Planning
        项目交付
      资产管理
        资产规划
        资产开发
        资产入库
        资产复用
    执行层
      团队协作
        Sprint管理
        WorkItem管理
        代办管理
        日常协作
      研发活动
        需求分析
        设计开发
        集成测试
        代码审查
      质量保证
        测试管理
        缺陷管理
        技术债管理
        质量度量
```

### 1.2 业务架构分层

```mermaid
graph TB
    subgraph 战略规划层
        S1[产品线规划]
        S2[技术路线规划]
        S3[资产战略规划]
        S4[组织能力规划]
    end
    
    subgraph 执行管理层
        M1[产品管理]
        M2[项目管理]
        M3[资产管理]
        M4[团队管理]
    end
    
    subgraph 执行层
        E1[Sprint执行]
        E2[WorkItem执行]
        E3[研发活动]
        E4[质量活动]
    end
    
    subgraph 支撑层
        P1[度量分析]
        P2[知识管理]
        P3[工具集成]
        P4[基础设施]
    end
    
    S1 --> M1
    S2 --> M1
    S2 --> M3
    S3 --> M3
    S4 --> M4
    
    M1 --> M2
    M2 --> E1
    M3 --> E2
    M4 --> E1
    
    E1 --> E2
    E2 --> E3
    E3 --> E4
    
    P1 -.支撑.-> M1
    P1 -.支撑.-> M2
    P1 -.支撑.-> M4
    P2 -.支撑.-> M3
    P3 -.支撑.-> E3
    P4 -.支撑.-> E3
    
    style S1 fill:#e8f5e9
    style M1 fill:#fff9c4
    style E1 fill:#e1f5ff
    style P1 fill:#f3e5f5
```

---

## 二、核心业务域

### 2.1 七大核心业务域

```mermaid
graph TB
    D0[需求域<br/>Requirement Domain<br/>UR-FR-MR三层需求]
    D1[产品域<br/>Product Domain<br/>Product-Feature BOM]
    D2[资产域<br/>Asset Domain<br/>Feature-Module-Platform]
    D3[项目域<br/>Project Domain<br/>PI Planning-Sprint]
    D4[团队域<br/>Team Domain<br/>WorkItem-Sprint执行]
    D5[质量域<br/>Quality Domain<br/>测试-缺陷-技术债]
    D6[度量域<br/>Metrics Domain<br/>指标-分析-改进]
    
    D0 -.需求分解.-> D0
    D0 -.关联产品.-> D1
    D0 -.关联资产.-> D2
    D1 -.Feature BOM.-> D2
    D2 -.资产复用.-> D3
    D3 -.项目任务.-> D4
    D2 -.模块-团队绑定.-> D4
    D4 -.团队产出.-> D5
    D5 -.质量数据.-> D6
    D6 -.度量反馈.-> D0
    D6 -.度量反馈.-> D1
    D6 -.度量反馈.-> D3
    
    style D0 fill:#e1f5ff
    style D1 fill:#e8f5e9
    style D2 fill:#f3e5f5
    style D3 fill:#fff9c4
    style D4 fill:#fce4ec
    style D5 fill:#ffebee
    style D6 fill:#e0f2f1
```

### 2.2 业务域职责

| 业务域 | 核心职责 | 关键实体 | 主要用户 |
|-------|---------|---------|---------|
| **需求域** | 三层需求管理（UR/FR/MR）、需求分解、需求追溯 | UserRequirement, FeatureRequirement, ModuleRequirement | 产品经理、SE、FO |
| **产品域** | 产品规划、版本管理、Feature BOM配置 | ProductLine, Product, Version, FeatureBOM | 产品经理、架构师 |
| **资产域** | 三层资产管理（Feature/Module/Platform）、资产复用 | Feature, Module, Platform, AssetBaseline | 架构师、资产管理员 |
| **项目域** | 项目立项、PI规划、迭代执行、项目交付 | VehicleProject, DomainProject, PIPlanning, Sprint | 项目经理、团队Lead |
| **团队域** | 团队组建、Sprint执行、WorkItem管理、协作 | Team, TeamMember, Sprint, WorkItem | 团队Lead、工程师 |
| **质量域** | 测试管理、缺陷管理、技术债管理、质量保证 | TestCase, Bug, TechDebt, QualityMetric | 测试工程师、QA |
| **度量域** | 指标定义、数据采集、分析报告、持续改进 | Metric, Dashboard, Report, KPI | 管理层、PMO |

**核心关系**：
- **需求域 ←→ 资产域**：需求通过relatedAssetId关联资产，需求跟随产品，资产独立演进
- **产品域 → 资产域**：Product通过Feature BOM包含Feature，Feature实现于Module
- **资产域 → 团队域**：Module绑定Team，MR自动分配到Team

---

## 三、业务能力模型

### 3.1 业务能力地图

```mermaid
graph TB
    subgraph 一级能力
        C1[战略规划能力]
        C2[产品管理能力]
        C3[项目管理能力]
        C4[资产管理能力]
        C5[团队协作能力]
        C6[质量保证能力]
        C7[度量分析能力]
    end
    
    subgraph C1_子能力[战略规划能力]
        C11[产品线规划]
        C12[技术路线规划]
        C13[资源规划]
        C14[能力规划]
    end
    
    subgraph C2_子能力[产品管理能力]
        C21[产品规划]
        C22[特性管理]
        C23[版本管理]
        C24[模块管理]
        C25[基线管理]
    end
    
    subgraph C3_子能力[项目管理能力]
        C31[项目立项]
        C32[PI Planning]
        C33[迭代管理]
        C34[进度跟踪]
        C35[风险管理]
        C36[项目交付]
    end
    
    subgraph C4_子能力[资产管理能力]
        C41[资产规划]
        C42[资产开发]
        C43[资产审核]
        C44[资产入库]
        C45[资产搜索]
        C46[资产复用]
        C47[资产度量]
    end
    
    subgraph C5_子能力[团队协作能力]
        C51[Sprint管理]
        C52[WorkItem管理]
        C53[代办管理]
        C54[协作沟通]
        C55[知识共享]
    end
    
    subgraph C6_子能力[质量保证能力]
        C61[测试管理]
        C62[缺陷管理]
        C63[技术债管理]
        C64[代码审查]
        C65[质量门禁]
    end
    
    subgraph C7_子能力[度量分析能力]
        C71[指标定义]
        C72[数据采集]
        C73[数据分析]
        C74[可视化]
        C75[报告生成]
        C76[持续改进]
    end
    
    C1 --> C1_子能力
    C2 --> C2_子能力
    C3 --> C3_子能力
    C4 --> C4_子能力
    C5 --> C5_子能力
    C6 --> C6_子能力
    C7 --> C7_子能力
    
    style C1 fill:#e8f5e9
    style C2 fill:#fff9c4
    style C3 fill:#e1f5ff
    style C4 fill:#f3e5f5
    style C5 fill:#fce4ec
    style C6 fill:#ffebee
    style C7 fill:#e0f2f1
```

### 3.2 能力成熟度模型

```mermaid
graph LR
    L1[初始级<br/>Level 1] --> L2[可重复级<br/>Level 2]
    L2 --> L3[已定义级<br/>Level 3]
    L3 --> L4[已管理级<br/>Level 4]
    L4 --> L5[优化级<br/>Level 5]
    
    style L1 fill:#ffebee
    style L2 fill:#fff9c4
    style L3 fill:#e1f5ff
    style L4 fill:#e8f5e9
    style L5 fill:#c8e6c9
```

| 级别 | 特征 | 产品管理能力 | 项目管理能力 | 资产管理能力 |
|-----|------|-------------|-------------|-------------|
| **Level 1<br/>初始级** | 流程混乱<br/>依赖个人 | • 无产品规划<br/>• 需求随意变更 | • 无项目计划<br/>• 进度不可控 | • 无资产管理<br/>• 重复开发 |
| **Level 2<br/>可重复级** | 建立基本流程<br/>可重复 | • 有产品规划<br/>• 需求有评审 | • 有项目计划<br/>• 有进度跟踪 | • 有资产库<br/>• 偶尔复用 |
| **Level 3<br/>已定义级** | 流程标准化<br/>全面覆盖 | • 版本管理完善<br/>• 特性可追溯 | • PI Planning标准化<br/>• 风险可控 | • 资产分类管理<br/>• 主动复用 |
| **Level 4<br/>已管理级** | 数据驱动<br/>量化管理 | • 数据驱动决策<br/>• 版本质量可量化 | • 项目度量完善<br/>• 预测准确 | • 资产度量完善<br/>• 复用率高 |
| **Level 5<br/>优化级** | 持续优化<br/>自动化 | • 自动化程度高<br/>• 持续改进 | • 自动化交付<br/>• DevOps成熟 | • 智能推荐<br/>• 自动化复用 |

---

## 四、组织架构设计

### 4.1 组织结构模型

```mermaid
graph TB
    Company[公司<br/>Company]
    
    BU1[事业部<br/>Business Unit]
    BU2[事业部<br/>Business Unit]
    
    Dept1[部门<br/>Department]
    Dept2[部门<br/>Department]
    Dept3[部门<br/>Department]
    
    Team1[团队<br/>Team]
    Team2[团队<br/>Team]
    Team3[团队<br/>Team]
    Team4[团队<br/>Team]
    Team5[团队<br/>Team]
    
    Member1[成员<br/>TeamMember]
    Member2[成员<br/>TeamMember]
    Member3[成员<br/>TeamMember]
    
    Company --> BU1
    Company --> BU2
    
    BU1 --> Dept1
    BU1 --> Dept2
    BU2 --> Dept3
    
    Dept1 --> Team1
    Dept1 --> Team2
    Dept2 --> Team3
    Dept3 --> Team4
    Dept3 --> Team5
    
    Team1 --> Member1
    Team1 --> Member2
    Team2 --> Member3
    
    style Company fill:#e8f5e9
    style BU1 fill:#fff9c4
    style Dept1 fill:#e1f5ff
    style Team1 fill:#f3e5f5
    style Member1 fill:#fce4ec
```

### 4.2 角色与职责

```mermaid
graph LR
    subgraph 战略层角色
        R1[产品线经理]
        R2[技术VP]
        R3[业务VP]
    end
    
    subgraph 管理层角色
        R4[产品经理]
        R5[项目经理]
        R6[架构师]
        R7[资产管理员]
    end
    
    subgraph 执行层角色
        R8[团队Lead]
        R9[开发工程师]
        R10[测试工程师]
        R11[DevOps工程师]
    end
    
    R1 -.指导.-> R4
    R2 -.指导.-> R6
    R3 -.指导.-> R5
    
    R4 -.产品.-> R8
    R5 -.项目.-> R8
    R6 -.技术.-> R8
    R7 -.资产.-> R8
    
    R8 -.任务.-> R9
    R8 -.任务.-> R10
    R8 -.协作.-> R11
    
    style R1 fill:#e8f5e9
    style R4 fill:#fff9c4
    style R8 fill:#e1f5ff
```

**角色详细职责**:

| 角色 | 主要职责 | 关键活动 | 输出 |
|-----|---------|---------|------|
| **产品线经理** | 产品线战略规划<br/>产品线路线图 | • 市场分析<br/>• 产品线规划<br/>• 资源分配 | 产品线战略<br/>产品路线图 |
| **产品经理** | 产品规划<br/>特性管理<br/>版本管理 | • 需求分析<br/>• 特性设计<br/>• 版本规划<br/>• PI Planning | 产品需求<br/>特性列表<br/>版本计划 |
| **项目经理** | 项目规划<br/>进度管理<br/>风险管理 | • 项目立项<br/>• PI Planning<br/>• 进度跟踪<br/>• 风险控制 | 项目计划<br/>PI计划<br/>风险报告 |
| **架构师** | 技术架构<br/>模块设计<br/>资产规划 | • 架构设计<br/>• 模块规划<br/>• 技术选型<br/>• 资产规划 | 架构文档<br/>模块设计<br/>资产规划 |
| **团队Lead** | 团队管理<br/>Sprint执行<br/>工作分配 | • Sprint规划<br/>• 任务分配<br/>• 团队协调<br/>• 技术指导 | Sprint计划<br/>任务分配<br/>团队报告 |
| **开发工程师** | 代码实现<br/>单元测试<br/>代码审查 | • 需求分析<br/>• 编码开发<br/>• 单元测试<br/>• Code Review | 代码<br/>测试用例<br/>技术文档 |
| **测试工程师** | 测试设计<br/>测试执行<br/>缺陷管理 | • 测试设计<br/>• 测试执行<br/>• 缺陷跟踪<br/>• 质量报告 | 测试用例<br/>测试报告<br/>缺陷列表 |
| **资产管理员** | 资产审核<br/>资产入库<br/>资产度量 | • 资产审核<br/>• 资产入库<br/>• 资产维护<br/>• 度量分析 | 资产库<br/>度量报告<br/>复用指南 |

### 4.3 团队模型

**团队类型**:

```mermaid
graph TB
    T1[特性团队<br/>Feature Team]
    T2[组件团队<br/>Component Team]
    T3[平台团队<br/>Platform Team]
    T4[支撑团队<br/>Support Team]
    
    T1 --> T11[端到端交付<br/>跨组件能力]
    T2 --> T21[专注组件<br/>深度专业]
    T3 --> T31[基础设施<br/>公共服务]
    T4 --> T41[工具支持<br/>流程优化]
    
    style T1 fill:#e8f5e9
    style T2 fill:#fff9c4
    style T3 fill:#e1f5ff
    style T4 fill:#f3e5f5
```

**团队规模与配置**:

| 团队类型 | 规模 | 角色配置 | 职责 |
|---------|-----|---------|------|
| **特性团队** | 7-9人 | 1 Lead + 5 开发 + 2 测试 | 端到端交付特性<br/>跨模块协作 |
| **组件团队** | 5-7人 | 1 Lead + 4 开发 + 1 测试 | 专注单一组件<br/>深度开发 |
| **平台团队** | 8-10人 | 1 Lead + 5 开发 + 2 DevOps + 1 测试 | 基础设施<br/>公共服务 |
| **支撑团队** | 3-5人 | 1 Lead + 2 工具开发 + 1 流程专家 | 工具链<br/>流程优化 |

---

## 五、业务流程设计

### 5.1 端到端业务流程

```mermaid
flowchart TD
    Start([业务需求]) --> A1[产品规划]
    
    A1 --> A2{规划类型?}
    
    A2 -->|新产品| B1[产品立项]
    A2 -->|新版本| B2[版本规划]
    A2 -->|新特性| B3[特性规划]
    
    B1 --> C1[模块规划]
    B2 --> C1
    B3 --> C1
    
    C1 --> C2[资产规划]
    C2 --> C3{是否有<br/>可复用资产?}
    
    C3 -->|是| D1[资产适配]
    C3 -->|否| D2[资产开发]
    
    D1 --> E1[项目立项]
    D2 --> E1
    
    E1 --> E2[PI Planning]
    E2 --> E3[WorkItem分解]
    E3 --> E4[团队分配]
    
    E4 --> F1[Sprint执行]
    F1 --> F2[WorkItem开发]
    F2 --> F3[集成测试]
    F3 --> F4[代码审查]
    
    F4 --> F5{质量门禁?}
    
    F5 -->|通过| G1[Sprint交付]
    F5 -->|不通过| F2
    
    G1 --> G2{Sprint完成?}
    
    G2 -->|否| F1
    G2 -->|是| H1[PI交付]
    
    H1 --> H2{项目完成?}
    
    H2 -->|否| E2
    H2 -->|是| I1[项目验收]
    
    I1 --> I2[资产沉淀]
    I2 --> I3[经验总结]
    
    I3 --> End([完成])
    
    style A1 fill:#e8f5e9
    style C2 fill:#f3e5f5
    style E2 fill:#fff9c4
    style F1 fill:#e1f5ff
    style I2 fill:#f3e5f5
```

### 5.2 关键业务场景

#### 场景1: 新产品开发（融合三层需求与三层资产）

```yaml
场景: 新产品开发流程
触发: 市场机会、技术创新
参与角色: 产品线经理、产品经理、SE、架构师、项目经理

主流程:
  1. 市场分析与立项
     - 输入: 市场调研报告
     - 活动: 可行性分析、商业论证
     - 输出: 产品立项书
     - 负责人: 产品线经理
  
  2. 用户需求规划（UR）
     - 输入: 产品立项书
     - 活动: 用户需求收集、需求分析、优先级排序
     - 输出: 用户需求列表（10+ UR）
     - 负责人: 产品经理
     - 关联: UR.productId → Product
  
  3. 特性需求分解（FR）
     - 输入: 用户需求列表
     - 活动: UR分解为FR、Feature资产评估、Make or Reuse决策
     - 输出: 特性需求列表（30+ FR）
     - 负责人: SE + 架构师
     - 关联: FR.relatedFeatureAssetId → Feature（可复用）
     - 决策: 
       * 有可复用Feature → 关联到现有Feature
       * 无可复用Feature → 规划新Feature开发
  
  4. Feature资产规划
     - 输入: 特性需求列表
     - 活动: Feature BOM配置、Feature依赖分析、平台选型
     - 输出: Product Feature BOM（旗舰版/高配版/标准版配置）
     - 负责人: 架构师
     - 关联: Product → FeatureBOM → Feature
  
  5. 模块需求分解（MR）
     - 输入: 特性需求、Feature-Module映射
     - 活动: FR分解为MR、模块设计、团队分配
     - 输出: 模块需求列表（50+ MR）
     - 负责人: FO（功能负责人）
     - 关联: MR.moduleId → Module → Team（自动分配）
  
  6. 项目启动
     - 输入: 需求Backlog（UR/FR/MR）、资产规划（Feature/Module/Platform）
     - 活动: 项目立项、团队组建、资源分配
     - 输出: 项目计划
     - 负责人: 项目经理
  
  7. PI Planning
     - 输入: 项目计划、FR/MR Backlog
     - 活动: PI目标制定、MR分解为Task、团队分配
     - 输出: PI Backlog（MR → Task）、团队迭代计划
     - 负责人: 产品经理 + 项目经理
     - WorkItem: MR (type=module_requirement) → Task (type=task/technical_task/test_task)
  
  8. Sprint迭代开发
     - 输入: 团队Sprint Backlog（Task）
     - 活动: Sprint执行、代码开发、单元测试、Code Review
     - 输出: 可工作软件增量
     - 负责人: 团队Lead
     - 追溯: Task → Commit → Module → Feature
  
  9. Feature集成验证
     - 输入: Module增量
     - 活动: Feature级集成测试、性能测试
     - 输出: Feature验证报告
     - 负责人: 测试工程师
     - 验证: Feature是否满足FR的验收标准
  
  10. 产品交付与资产沉淀
      - 输入: Feature集成验收通过
      - 活动: 产品集成、用户验收、上线部署、资产入库
      - 输出: 正式版本、Feature资产库更新
      - 负责人: 项目经理 + 资产管理员
      - 资产: Feature.reuseCount++, Feature.products.push(newProduct)

度量指标:
  - Time to Market: 从立项到上线 < 6个月
  - Feature资产复用率: ≥ 60%（5-10个产品）
  - 需求追溯完整度: 100%（UR→FR→MR→Task→Commit）
  - 首次质量合格率: ≥ 90%
  - 客户满意度: ≥ 4.0/5.0

追溯链路示例:
  UR-PARK-001（一键自动泊车）
    → FR-PARK-001（自动寻找车位）→ FEAT-AVP-001（AVP资产）
      → MR-PARK-PER-001（车位检测算法）→ MOD-PARK-PER-001
        → TASK-PARK-001（超声波融合）→ Commit-abc123
        → TASK-PARK-002（车位识别）→ Commit-def456
```

#### 场景2: 资产复用开发

```yaml
场景: 基于资产复用的快速开发
触发: 新项目需要类似功能
参与角色: 产品经理、架构师、团队Lead、开发工程师

主流程:
  1. 需求分析
     - 输入: 新功能需求
     - 活动: 需求分析、可行性评估
     - 输出: 需求文档
     - 负责人: 产品经理
  
  2. 资产搜索
     - 输入: 需求文档
     - 活动: 资产库搜索、匹配度评估
     - 输出: 候选资产列表
     - 负责人: 架构师
  
  3. 复用决策
     - 输入: 候选资产列表
     - 活动: 功能匹配度、性能评估、成本分析
     - 输出: 复用方案（Direct/Adapted/Reject）
     - 负责人: 架构师 + 团队Lead
  
  4. 资产适配（如需要）
     - 输入: 资产源代码、适配需求
     - 活动: 接口适配、功能扩展、集成测试
     - 输出: 适配后的资产
     - 负责人: 开发工程师
  
  5. 集成开发
     - 输入: 资产（原始或适配后）
     - 活动: 集成到项目、接口对接、联调测试
     - 输出: 功能实现
     - 负责人: 开发工程师
  
  6. 验证与反馈
     - 输入: 功能实现
     - 活动: 功能测试、性能测试、用户验收
     - 输出: 测试报告、复用反馈
     - 负责人: 测试工程师
  
  7. 资产更新（可选）
     - 输入: 复用反馈、改进建议
     - 活动: 资产优化、版本更新
     - 输出: 新版本资产
     - 负责人: 资产管理员

度量指标:
  - 复用工时节省: 平均节省 30-50% 工时
  - 适配成本: < 20% 重新开发成本
  - 资产质量满意度: ≥ 4.0/5.0
  - 集成时间: < 3天
```

### 5.3 异常处理流程

```mermaid
flowchart TD
    Start([发现异常]) --> A1{异常类型?}
    
    A1 -->|缺陷| B1[创建Bug WorkItem]
    A1 -->|技术债| B2[创建TechDebt WorkItem]
    A1 -->|风险| B3[创建Risk]
    A1 -->|阻塞| B4[创建Blocker]
    
    B1 --> C1[优先级评估]
    B2 --> C1
    B3 --> C2[风险评估]
    B4 --> C3[升级处理]
    
    C1 --> C11{优先级?}
    
    C11 -->|Critical| D1[立即处理]
    C11 -->|High| D2[当前Sprint处理]
    C11 -->|Medium/Low| D3[排入Backlog]
    
    C2 --> C21{风险等级?}
    
    C21 -->|高| D1
    C21 -->|中| D2
    C21 -->|低| D4[监控观察]
    
    C3 --> D5[团队Lead处理]
    D5 --> D51{能解决?}
    
    D51 -->|是| D2
    D51 -->|否| D6[升级到项目经理]
    
    D1 --> E1[分配处理]
    D2 --> E1
    D3 --> E2[等待排期]
    
    E1 --> E3[问题解决]
    E3 --> E4[验证关闭]
    
    E4 --> End([完成])
    
    style B1 fill:#ffebee
    style B2 fill:#fff3e0
    style B3 fill:#fffde7
    style B4 fill:#f3e5f5
    style D1 fill:#ef5350
```

---

## 六、总结

### 业务架构核心价值

```
✓ 业务全景清晰 ⭐⭐⭐
  • 六大核心业务域
  • 清晰的业务分层
  • 端到端业务流程

✓ 组织架构完善 ⭐⭐⭐
  • 4层组织结构
  • 8个核心角色
  • 4种团队类型

✓ 能力模型完整 ⭐⭐⭐
  • 7大一级能力
  • 30+子能力
  • 5级成熟度模型

✓ 流程标准化 ⭐⭐⭐
  • 端到端业务流程
  • 典型业务场景
  • 异常处理机制
```

---

**文档维护**:
- 创建: 2026-01-10
- 版本: 最新
- 负责人: 业务架构团队

