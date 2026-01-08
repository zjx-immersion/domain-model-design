# 领域模型对比可视化图

> **文档版本**: v1.0  
> **创建时间**: 2026-01-02  
> **对应文档**: 01-DOMAIN_MODEL_COMPARISON.md

---

## 📊 目录

1. [三层资产管理体系类图](#一-三层资产管理体系类图)
2. [实体关系图](#二-实体关系图)
3. [当前实现vs理想设计对比](#三-当前实现vs理想设计对比)
4. [关键差距可视化](#四-关键差距可视化)
5. [改进路径图](#五-改进路径图)

---

## 一、 三层资产管理体系类图

### 1.1 产品层（Product Layer）类图

```mermaid
classDiagram
    class Product {
        +string id
        +string name
        +string code
        +string version
        +ProductType type
        +Domain domain
        +Stage lifecycle_stage
        +string productLineId
        +string[] platformIds
        +FeatureBOM[] featureBOM
        +User owner
        +Roadmap roadmap
        +Date createdAt
        +Date updatedAt
    }
    
    class FeatureBOM {
        +string featureId
        +boolean isStandard
        +boolean isOptional
        +string variantRules
    }
    
    class Platform {
        +string id
        +string name
        +string code
        +PlatformType type
        +string version
        +string[] products
        +PlatformSpecs specs
        +Status status
    }
    
    class UserRequirement {
        +string id
        +URType type
        +string description
        +number value_score
        +Priority priority
        +string productId
        +User[] stakeholders
        +string[] featureRequirements
    }
    
    class ProductLine {
        +string id
        +string name
        +string code
        +Domain domain
        +string description
        +string owner
        +number productCount
    }
    
    Product "1" --> "*" FeatureBOM : contains
    Product "*" --> "*" Platform : depends on
    Product "*" --> "1" ProductLine : belongs to
    UserRequirement "*" --> "1" Product : associated with
    UserRequirement "1" --> "*" FeatureRequirement : decomposes to
```

### 1.2 功能层（Function Layer）类图

```mermaid
classDiagram
    class Feature {
        +string id
        +string name
        +string code
        +string version
        +FeatureType type
        +Domain domain
        +Complexity complexity
        +boolean is_standard
        +boolean is_optional
        +string[] dependencies
        +string[] conflicts
        +string[] modules
        +string[] logicalComponents
        +User owner
        +Status status
        +Date createdAt
    }
    
    class FeatureRequirement {
        +string id
        +string description
        +string parentURId
        +string relatedFeatureId
        +AcceptanceCriteria[] acceptance_criteria
        +string[] moduleRequirements
        +Performance performance
        +Status status
        +Priority priority
    }
    
    class LogicalArchitecture {
        +string id
        +string name
        +string featureId
        +LogicalComponent[] components
        +Connection[] connections
        +Interface[] interfaces
    }
    
    class LogicalComponent {
        +string id
        +string name
        +ComponentType type
        +string[] responsibilities
        +string[] providedInterfaces
        +string[] requiredInterfaces
    }
    
    Feature "1" --> "*" FeatureRequirement : has
    Feature "1" --> "1" LogicalArchitecture : defines
    Feature "*" --> "*" Feature : depends on
    Feature "1" --> "*" Module : implemented by
    LogicalArchitecture "1" --> "*" LogicalComponent : contains
```

### 1.3 模块层（Module Layer）类图

```mermaid
classDiagram
    class Module {
        +string id
        +string name
        +string code
        +string version
        +TechStack tech_stack
        +Language language
        +string framework
        +DeployTarget deploy_target
        +string deploy_location
        +HardwareRequirements hardware_requirements
        +string repository_url
        +string repository_branch
        +string[] featureIds
        +string[] productIds
        +User owner
        +Team team
        +Status status
    }
    
    class Component {
        +string id
        +string name
        +ComponentType type
        +string moduleId
        +API[] apis
        +string sourcePath
    }
    
    class ModuleRequirement {
        +string id
        +MRType type
        +number story_points
        +string description
        +AcceptanceCriteria[] ac_list
        +string parentFRId
        +string moduleId
        +string[] taskIds
        +string[] commitIds
        +string[] testCaseIds
    }
    
    class DeployTarget {
        +string id
        +string name
        +string hardware
        +string platform
        +string os
    }
    
    Module "1" --> "*" Component : contains
    Module "1" --> "*" ModuleRequirement : implements
    Module "*" --> "1" DeployTarget : deploys on
    ModuleRequirement "1" --> "*" Task : generates
    ModuleRequirement "1" --> "*" TestCase : verified by
```

---

## 二、 实体关系图

### 2.1 完整三层关系图

```mermaid
erDiagram
    ProductLine ||--o{ Product : contains
    Product ||--o{ FeatureBOM : has
    Product }o--o{ Platform : depends-on
    Product ||--o{ UserRequirement : associated-with
    Product ||--o{ Module : uses
    
    UserRequirement ||--o{ FeatureRequirement : decomposes-to
    
    FeatureBOM }o--|| Feature : references
    Feature ||--o{ FeatureRequirement : has
    Feature }o--o{ Feature : depends-on
    Feature ||--o{ Module : implemented-by
    Feature ||--|| LogicalArchitecture : defines
    
    FeatureRequirement ||--o{ ModuleRequirement : decomposes-to
    
    Module ||--o{ Component : contains
    Module }o--|| DeployTarget : deploys-on
    Module ||--o{ ModuleRequirement : implements
    Module }o--o{ Feature : supports
    
    ModuleRequirement ||--o{ Task : generates
    ModuleRequirement ||--o{ TestCase : verified-by
    ModuleRequirement }o--|| FeatureRequirement : traces-to
    
    DeployTarget }o--|| Platform : based-on
    
    Task ||--o{ Commit : produces
```

### 2.2 追溯关系图（Traceability）

```mermaid
graph TD
    UR[UserRequirement<br/>用户需求<br/>UR-AVP-001] --> FR1[FeatureRequirement<br/>特性需求<br/>FR-AVP-001]
    UR --> FR2[FeatureRequirement<br/>特性需求<br/>FR-AVP-002]
    
    FR1 --> MR1[ModuleRequirement<br/>模块需求<br/>MR-AVP-PER-001]
    FR1 --> MR2[ModuleRequirement<br/>模块需求<br/>MR-AVP-PER-002]
    
    FR2 --> MR3[ModuleRequirement<br/>模块需求<br/>MR-AVP-PLAN-001]
    FR2 --> MR4[ModuleRequirement<br/>模块需求<br/>MR-AVP-PLAN-002]
    
    MR1 --> T1[Task<br/>开发任务]
    MR2 --> T2[Task<br/>开发任务]
    MR3 --> T3[Task<br/>开发任务]
    MR4 --> T4[Task<br/>开发任务]
    
    T1 --> C1[Commit<br/>代码提交]
    T2 --> C2[Commit<br/>代码提交]
    T3 --> C3[Commit<br/>代码提交]
    T4 --> C4[Commit<br/>代码提交]
    
    MR1 -.-> TC1[TestCase<br/>测试用例]
    MR2 -.-> TC2[TestCase<br/>测试用例]
    MR3 -.-> TC3[TestCase<br/>测试用例]
    MR4 -.-> TC4[TestCase<br/>测试用例]
    
    style UR fill:#e1f5ff
    style FR1 fill:#fff4e6
    style FR2 fill:#fff4e6
    style MR1 fill:#f3e5f5
    style MR2 fill:#f3e5f5
    style MR3 fill:#f3e5f5
    style MR4 fill:#f3e5f5
```

### 2.3 资产构成关系图（Composition）

```mermaid
graph TD
    PL[ProductLine<br/>智能驾驶产品线] --> P1[Product<br/>智驾旗舰版]
    PL --> P2[Product<br/>智驾标准版]
    
    P1 --> BOM1[FeatureBOM<br/>ACC v2.0]
    P1 --> BOM2[FeatureBOM<br/>LCC v2.0]
    P1 --> BOM3[FeatureBOM<br/>AVP v1.5<br/>optional]
    
    BOM1 -.-> F1[Feature<br/>ACC特性]
    BOM2 -.-> F2[Feature<br/>LCC特性]
    BOM3 -.-> F3[Feature<br/>AVP特性]
    
    F1 --> M1[Module<br/>感知模块]
    F1 --> M2[Module<br/>规划模块]
    F1 --> M3[Module<br/>控制模块]
    
    F3 --> M4[Module<br/>泊车感知模块]
    F3 --> M5[Module<br/>泊车规划模块]
    F3 --> M3
    
    M4 --> DT1[DeployTarget<br/>Horizon J6M]
    M5 --> DT2[DeployTarget<br/>Orin-X]
    M3 --> DT3[DeployTarget<br/>Aurix TC397]
    
    DT1 -.-> PLT1[Platform<br/>J6M平台]
    DT2 -.-> PLT2[Platform<br/>Orin-X平台]
    DT3 -.-> PLT3[Platform<br/>Aurix平台]
    
    style P1 fill:#e1f5ff
    style F1 fill:#fff4e6
    style F2 fill:#fff4e6
    style F3 fill:#fff4e6
    style M1 fill:#f3e5f5
    style M4 fill:#f3e5f5
    style M5 fill:#f3e5f5
```

---

## 三、 当前实现vs理想设计对比

### 3.1 实体层面对比

```mermaid
graph LR
    subgraph 理想设计
        A1[Product<br/>✅ featureBOM<br/>✅ platformIds<br/>✅ roadmap]
        A2[Platform<br/>✅ 完整定义]
        A3[Feature<br/>✅ 独立资产<br/>✅ 版本管理<br/>✅ 依赖管理]
        A4[Module<br/>✅ tech_stack<br/>✅ deploy_target<br/>✅ featureIds]
    end
    
    subgraph 当前实现
        B1[Product<br/>❌ 无featureBOM<br/>❌ 无platformIds<br/>❌ 无roadmap]
        B2[Platform<br/>❌ 完全缺失]
        B3[Feature<br/>❌ 不存在<br/>混淆在FR中]
        B4[Module<br/>❌ 无tech_stack<br/>❌ 无deploy_target<br/>❌ 无featureIds]
    end
    
    A1 -.差距.-> B1
    A2 -.差距.-> B2
    A3 -.差距.-> B3
    A4 -.差距.-> B4
    
    style A1 fill:#c8e6c9
    style A2 fill:#c8e6c9
    style A3 fill:#c8e6c9
    style A4 fill:#c8e6c9
    style B1 fill:#ffccbc
    style B2 fill:#ffccbc
    style B3 fill:#ffccbc
    style B4 fill:#ffccbc
```

### 3.2 关系对比

```mermaid
graph TD
    subgraph 理想设计关系
        direction TB
        R1[Product → FeatureBOM]
        R2[FeatureBOM → Feature]
        R3[Feature → Module]
        R4[Module → DeployTarget]
        R5[DeployTarget → Platform]
        R6[Feature → Feature 依赖]
    end
    
    subgraph 当前实现关系
        direction TB
        C1[Product → Module ✅]
        C2[Product → FeatureBOM ❌]
        C3[Feature实体 ❌]
        C4[Module → DeployTarget ❌]
        C5[Platform实体 ❌]
        C6[Feature依赖 ❌]
    end
    
    style R1 fill:#c8e6c9
    style R2 fill:#c8e6c9
    style R3 fill:#c8e6c9
    style R4 fill:#c8e6c9
    style R5 fill:#c8e6c9
    style R6 fill:#c8e6c9
    style C2 fill:#ffccbc
    style C3 fill:#ffccbc
    style C4 fill:#ffccbc
    style C5 fill:#ffccbc
    style C6 fill:#ffccbc
```

---

## 四、 关键差距可视化

### 4.1 差距优先级矩阵

```mermaid
quadrantChart
    title 差距分析矩阵（影响 vs 复杂度）
    x-axis 低复杂度 --> 高复杂度
    y-axis 低影响 --> 高影响
    quadrant-1 P1: 重要但复杂
    quadrant-2 P0: 关键且可行
    quadrant-3 P2: 可选
    quadrant-4 P1: 快速改进
    
    Feature实体: [0.3, 0.9]
    featureBOM: [0.25, 0.85]
    deploy_target: [0.2, 0.8]
    featureIds: [0.15, 0.75]
    Platform实体: [0.5, 0.7]
    platformIds: [0.4, 0.65]
    Feature依赖: [0.6, 0.6]
    LogicalArch: [0.7, 0.4]
    Commit实体: [0.8, 0.3]
    roadmap: [0.75, 0.25]
```

### 4.2 完成度对比（雷达图）

```mermaid
%%{init: {'theme':'base'}}%%
graph TD
    A["领域模型完成度分析"]
    
    B1["产品层: 70%<br/>✅ Product基本属性<br/>❌ FeatureBOM<br/>❌ Platform依赖"]
    B2["功能层: 20%<br/>❌ Feature实体<br/>✅ FeatureRequirement<br/>❌ LogicalArch"]
    B3["模块层: 50%<br/>✅ Module基本属性<br/>❌ 技术栈信息<br/>❌ 部署信息"]
    B4["需求追溯: 90%<br/>✅ UR→FR→MR<br/>✅ 追溯链完整<br/>⚠️ 缺Task→Commit"]
    B5["关系建模: 40%<br/>❌ Feature→Module<br/>❌ Module→Platform<br/>✅ Product→Module"]
    
    A --> B1
    A --> B2
    A --> B3
    A --> B4
    A --> B5
    
    style A fill:#e3f2fd
    style B1 fill:#fff9c4
    style B2 fill:#ffccbc
    style B3 fill:#ffe0b2
    style B4 fill:#c8e6c9
    style B5 fill:#ffe0b2
```

### 4.3 关键能力差距

```mermaid
graph LR
    subgraph 目标能力
        T1[产品BOM管理]
        T2[Feature复用]
        T3[多平台部署]
        T4[软硬件解耦]
        T5[需求追溯]
        T6[逻辑架构]
        T7[平台管理]
    end
    
    subgraph 当前状态
        C1[❌ 不支持<br/>无FeatureBOM]
        C2[❌ 不支持<br/>无Feature实体]
        C3[❌ 不支持<br/>无deploy_target]
        C4[❌ 不支持<br/>软硬件耦合]
        C5[✅ 支持<br/>追溯完整]
        C6[❌ 不支持<br/>无LogicalArch]
        C7[❌ 不支持<br/>无Platform实体]
    end
    
    T1 -.-> C1
    T2 -.-> C2
    T3 -.-> C3
    T4 -.-> C4
    T5 -.-> C5
    T6 -.-> C6
    T7 -.-> C7
    
    style T1 fill:#c8e6c9
    style T2 fill:#c8e6c9
    style T3 fill:#c8e6c9
    style T4 fill:#c8e6c9
    style T5 fill:#c8e6c9
    style T6 fill:#c8e6c9
    style T7 fill:#c8e6c9
    style C1 fill:#ffccbc
    style C2 fill:#ffccbc
    style C3 fill:#ffccbc
    style C4 fill:#ffccbc
    style C5 fill:#c8e6c9
    style C6 fill:#ffccbc
    style C7 fill:#ffccbc
```

---

## 五、 改进路径图

### 5.1 改进实施路线图

```mermaid
gantt
    title 领域模型改进实施路线图
    dateFormat YYYY-MM-DD
    section P0阶段-关键缺失
    建立Feature实体           :p0_1, 2026-01-03, 5d
    添加Product.featureBOM    :p0_2, after p0_1, 3d
    添加Module.deploy_target  :p0_3, after p0_1, 2d
    添加Module.tech_stack     :p0_4, after p0_3, 2d
    添加Module.featureIds     :p0_5, after p0_4, 2d
    
    section P1阶段-重要缺失
    建立Platform实体          :p1_1, after p0_5, 4d
    添加Product.platformIds   :p1_2, after p1_1, 2d
    Feature依赖管理           :p1_3, after p1_1, 3d
    Module硬件依赖            :p1_4, after p1_2, 2d
    
    section P2阶段-可选缺失
    LogicalArchitecture实体   :p2_1, after p1_4, 5d
    Commit实体                :p2_2, after p2_1, 3d
    Product.roadmap           :p2_3, after p2_1, 2d
```

### 5.2 改进依赖关系图

```mermaid
graph TD
    Start([开始改进]) --> P0_1[P0-1: 建立Feature实体]
    
    P0_1 --> P0_2[P0-2: 添加Product.featureBOM]
    P0_1 --> P0_3[P0-3: 添加Module.deploy_target]
    
    P0_3 --> P0_4[P0-4: 添加Module.tech_stack]
    P0_4 --> P0_5[P0-5: 添加Module.featureIds]
    
    P0_2 --> Milestone1{P0完成<br/>核心能力建立}
    P0_5 --> Milestone1
    
    Milestone1 --> P1_1[P1-1: 建立Platform实体]
    P1_1 --> P1_2[P1-2: 添加Product.platformIds]
    P1_1 --> P1_3[P1-3: Feature依赖管理]
    P1_2 --> P1_4[P1-4: Module硬件依赖]
    
    P1_3 --> Milestone2{P1完成<br/>平台化能力}
    P1_4 --> Milestone2
    
    Milestone2 --> P2_1[P2-1: LogicalArchitecture]
    Milestone2 --> P2_2[P2-2: Commit实体]
    Milestone2 --> P2_3[P2-3: Product.roadmap]
    
    P2_1 --> End([改进完成])
    P2_2 --> End
    P2_3 --> End
    
    style Start fill:#e3f2fd
    style Milestone1 fill:#fff9c4
    style Milestone2 fill:#fff9c4
    style End fill:#c8e6c9
    style P0_1 fill:#ffccbc
    style P0_2 fill:#ffccbc
    style P0_3 fill:#ffccbc
    style P0_4 fill:#ffccbc
    style P0_5 fill:#ffccbc
    style P1_1 fill:#ffe0b2
    style P1_2 fill:#ffe0b2
    style P1_3 fill:#ffe0b2
    style P1_4 fill:#ffe0b2
```

### 5.3 改进后的完整架构

```mermaid
graph TB
    subgraph 产品层
        PL[ProductLine<br/>产品线]
        P[Product<br/>✅ featureBOM<br/>✅ platformIds<br/>✅ roadmap]
        PLT[Platform<br/>✅ 硬件/软件平台]
        UR[UserRequirement<br/>用户需求]
    end
    
    subgraph 功能层
        F[Feature<br/>✅ 独立资产<br/>✅ 版本管理<br/>✅ 依赖管理]
        FR[FeatureRequirement<br/>特性需求]
        LA[LogicalArchitecture<br/>✅ 逻辑架构]
    end
    
    subgraph 模块层
        M[Module<br/>✅ tech_stack<br/>✅ deploy_target<br/>✅ featureIds]
        MR[ModuleRequirement<br/>模块需求]
        DT[DeployTarget<br/>部署目标]
    end
    
    subgraph 实现层
        T[Task<br/>开发任务]
        C[Commit<br/>✅ 代码提交]
        TC[TestCase<br/>测试用例]
    end
    
    PL --> P
    P --> PLT
    P --> F
    UR --> FR
    FR --> F
    F --> LA
    F --> M
    FR --> MR
    M --> DT
    DT --> PLT
    MR --> M
    MR --> T
    MR --> TC
    T --> C
    
    style P fill:#c8e6c9
    style F fill:#c8e6c9
    style M fill:#c8e6c9
    style PLT fill:#c8e6c9
    style LA fill:#c8e6c9
    style C fill:#c8e6c9
```

---

## 六、 总结

### 6.1 可视化要点

本可视化文档通过以下图表类型展示了领域模型对比：

1. **类图（Class Diagram）** - 展示实体的详细属性和方法
2. **实体关系图（ER Diagram）** - 展示实体间的关联关系
3. **追溯关系图（Traceability Graph）** - 展示需求的纵向分解
4. **构成关系图（Composition Graph）** - 展示资产的横向组装
5. **对比图（Comparison Graph）** - 展示理想设计vs当前实现
6. **优先级矩阵（Quadrant Chart）** - 展示差距的优先级
7. **路线图（Gantt Chart）** - 展示改进的时间计划
8. **依赖关系图（Dependency Graph）** - 展示改进任务的依赖

### 6.2 关键发现（可视化视角）

从可视化图表中可以清晰看到：

1. **Feature实体缺失** - 导致产品层和模块层之间断层
2. **Platform实体缺失** - 导致软硬件耦合
3. **部署信息缺失** - Module无法追溯到硬件平台
4. **需求追溯完整** - UR→FR→MR链路清晰（唯一的亮点）

### 6.3 使用建议

- **决策者** - 重点查看"差距优先级矩阵"和"改进路线图"
- **架构师** - 重点查看"类图"和"实体关系图"
- **开发者** - 重点查看"改进依赖关系图"和"改进后的完整架构"

---

**相关文档**:
- [01-DOMAIN_MODEL_COMPARISON.md](./01-DOMAIN_MODEL_COMPARISON.md) - 详细文字对比
- [06-AVP_CASE_STUDY-visualization.md](./06-AVP_CASE_STUDY-visualization.md) - AVP案例可视化
- [05-IMPROVEMENT_PLAN.md](./05-IMPROVEMENT_PLAN.md) - 详细改进方案

