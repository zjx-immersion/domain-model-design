# Auto DevOps平台 - 完整业务架构图

> **文档版本**: v2.0  
> **创建日期**: 2025-01-05  
> **基于**: 业务架构设计文档v2.0

---

## 📋 目录

1. [综合业务架构全景图](#一综合业务架构全景图)
2. [8层业务能力架构图](#二8层业务能力架构图)
3. [8角色协作架构图](#三8角色协作架构图)
4. [9阶段价值流架构图](#四9阶段价值流架构图)
5. [74页面功能架构图](#五74页面功能架构图)
6. [7层需求追溯架构图](#六7层需求追溯架构图)
7. [3层价值网络架构图](#七3层价值网络架构图)
8. [DevOps全流程架构图](#八devops全流程架构图)
9. [数据分析架构图](#九数据分析架构图)
10. [技术架构分层图](#十技术架构分层图)

---

## 一、综合业务架构全景图

```mermaid
graph TB
    subgraph "战略层 - 业务愿景"
        Vision[业务愿景<br/>智能驾驶研发价值流管理平台]
        Goals[业务目标<br/>降本增效 数据驱动]
    end
    
    subgraph "能力层 - 8层业务能力"
        L1[L1: 战略规划<br/>产品线规划 技术路线]
        L2[L2: 资产管理<br/>产品/特性/模块 三层资产]
        L3[L3: 需求管理<br/>7层追溯 3层价值网络]
        L4[L4: 研发协同<br/>PI Planning Sprint管理]
        L5[L5: DevOps流程<br/>构建 测试 发布]
        L6[L6: 数据分析<br/>价值流 效能 质量]
        L7[L7: 平台支撑<br/>用户 配置 审计]
        L8[L8: 集成能力<br/>Git CI/CD 工具集成]
    end
    
    subgraph "角色层 - 8个核心角色"
        PM[产品经理]
        SE[系统工程师]
        FO[特性负责人]
        DEV[开发工程师]
        QA[测试工程师]
        DEVOPS[DevOps工程师]
        PMO[项目经理]
        MGR[管理者]
    end
    
    subgraph "应用层 - 74个页面"
        P0[Phase 0: 23页面<br/>已实现]
        P1[Phase 1: 15页面<br/>资产与需求]
        P2[Phase 2: 16页面<br/>项目与协同]
        P3[Phase 3: 12页面<br/>DevOps与测试]
        P4[Phase 4: 8页面<br/>数据分析与系统]
    end
    
    subgraph "流程层 - 9阶段价值流"
        S1[阶段1: 战略规划]
        S2[阶段2: 产品定义]
        S3[阶段3: 需求分解]
        S4[阶段4: PI Planning]
        S5[阶段5: Sprint执行]
        S6[阶段6: 持续集成]
        S7[阶段7: 测试验证]
        S8[阶段8: 发布部署]
        S9[阶段9: 监控优化]
    end
    
    subgraph "指标层 - 业务KPI"
        KPI1[价值流效率<br/>Lead Time Cycle Time]
        KPI2[资产复用率<br/>40% → 60% → 80%]
        KPI3[需求追溯<br/>100%覆盖率]
        KPI4[团队效能<br/>速率 吞吐量]
        KPI5[质量指标<br/>缺陷 覆盖率]
    end
    
    Vision --> Goals
    Goals --> L1
    L1 --> L2 --> L3 --> L4 --> L5 --> L6
    L6 --> L7 --> L8
    
    L2 --> PM
    L3 --> SE
    L4 --> FO
    L4 --> DEV
    L5 --> QA
    L5 --> DEVOPS
    L4 --> PMO
    L6 --> MGR
    
    PM --> P0
    SE --> P1
    FO --> P2
    DEV --> P2
    QA --> P3
    DEVOPS --> P3
    PMO --> P2
    MGR --> P4
    
    S1 --> S2 --> S3 --> S4 --> S5 --> S6 --> S7 --> S8 --> S9
    
    S9 --> KPI1
    S9 --> KPI2
    S9 --> KPI3
    S9 --> KPI4
    S9 --> KPI5
    
    KPI1 -.反馈优化.-> S1
    
    style Vision fill:#e1f5ff
    style L3 fill:#fff4e6
    style L4 fill:#f3e5f5
    style L6 fill:#d4edda
```

---

## 二、8层业务能力架构图

```mermaid
graph TB
    subgraph "L1: 战略规划能力"
        L1_1[产品线规划<br/>领域划分 产品组合]
        L1_2[技术平台规划<br/>硬件平台 软件平台]
        L1_3[资源规划<br/>团队 预算]
        L1_4[复用策略<br/>资产复用策略]
    end
    
    subgraph "L2: 资产管理能力 - 三层资产体系"
        L2_1[产品层资产 P<br/>产品定义 产品配置<br/>支撑页面: 产品列表/详情/配置]
        L2_2[特性层资产 F<br/>领域特性 特性设计<br/>支撑页面: 特性列表/详情/关系图]
        L2_3[模块层资产 M<br/>软件模块 接口定义<br/>支撑页面: 模块列表/详情/依赖图]
        L2_4[资产统一管理<br/>检索 推荐 评估<br/>支撑页面: 资产库/关系图]
    end
    
    subgraph "L3: 需求管理能力 - 7层追溯+3层价值网络"
        L3_1[7层需求追溯<br/>L1战略→L7代码<br/>支撑页面: 追溯主页/矩阵]
        L3_2[用户需求 R1<br/>需求收集 分析评审<br/>支撑页面: 用户需求列表/详情]
        L3_3[特性需求 R2<br/>需求分解 技术方案<br/>支撑页面: 特性需求列表/详情]
        L3_4[模块需求 R3<br/>任务拆解 Story管理<br/>支撑页面: 模块需求/Story列表]
        L3_5[3层价值网络<br/>战略级 执行级 操作级<br/>支撑页面: L1/L2/L3价值网络]
        L3_6[影响分析<br/>变更影响 依赖分析<br/>支撑页面: 影响分析工具]
    end
    
    subgraph "L4: 研发协同能力"
        L4_1[PI Planning管理<br/>PI创建 团队规划 Objectives<br/>支撑页面: 8个PI相关页面]
        L4_2[Sprint协同管理<br/>Sprint规划 看板 回顾<br/>支撑页面: 11个Sprint页面]
        L4_3[任务协同<br/>Task管理 状态跟踪<br/>支撑页面: Task列表/详情]
        L4_4[评审管理<br/>需求/设计/代码评审<br/>支撑页面: 评审列表/PR评审]
    end
    
    subgraph "L5: DevOps全流程能力"
        L5_1[配置管理<br/>Git集成 分支策略<br/>集成: GitLab/GitHub]
        L5_2[构建管理<br/>CI/CD流水线 自动构建<br/>支撑页面: 构建列表/详情/配置]
        L5_3[测试管理<br/>测试计划 用例 缺陷<br/>支撑页面: 6个测试页面]
        L5_4[发布管理<br/>发布计划 环境管理<br/>支撑页面: 发布/环境管理]
        L5_5[质量管理<br/>代码质量 测试覆盖<br/>集成: SonarQube]
    end
    
    subgraph "L6: 数据分析能力"
        L6_1[价值流分析<br/>9阶段价值流 瓶颈识别<br/>支撑页面: 价值流分析]
        L6_2[效能分析<br/>团队速率 可预测性<br/>支撑页面: 效能分析]
        L6_3[质量分析<br/>缺陷密度 覆盖率<br/>支撑页面: 质量分析]
        L6_4[成本分析<br/>成本构成 ROI<br/>支撑页面: 成本分析]
        L6_5[复用分析<br/>复用率 收益<br/>支撑页面: 复用分析]
    end
    
    subgraph "L7: 平台支撑能力"
        L7_1[用户权限<br/>用户 角色 权限<br/>支撑页面: 用户/角色/权限管理]
        L7_2[系统配置<br/>参数 认证 通知<br/>支撑页面: 系统配置]
        L7_3[审计日志<br/>操作日志 合规审计<br/>支撑页面: 操作日志]
        L7_4[通知中心<br/>站内 邮件 企业微信<br/>支撑页面: 通知中心]
    end
    
    subgraph "L8: 集成能力"
        L8_1[代码管理集成<br/>GitLab GitHub Gitee]
        L8_2[CI/CD集成<br/>Jenkins GitLab CI]
        L8_3[质量工具集成<br/>SonarQube 覆盖率]
        L8_4[通知集成<br/>企业微信 钉钉 Slack]
    end
    
    L1_1 --> L2_1
    L1_2 --> L2_1
    
    L2_1 --> L2_2 --> L2_3
    L2_1 --> L2_4
    L2_2 --> L2_4
    L2_3 --> L2_4
    
    L2_1 --> L3_2
    L2_2 --> L3_3
    L2_3 --> L3_4
    
    L3_2 --> L3_3 --> L3_4
    L3_2 --> L3_1
    L3_3 --> L3_1
    L3_4 --> L3_1
    L3_1 --> L3_5
    L3_1 --> L3_6
    
    L3_4 --> L4_1
    L4_1 --> L4_2
    L4_2 --> L4_3
    L4_3 --> L4_4
    
    L4_3 --> L5_1
    L5_1 --> L5_2
    L5_2 --> L5_3
    L5_3 --> L5_4
    L5_2 --> L5_5
    L5_3 --> L5_5
    
    L5_4 --> L6_1
    L4_2 --> L6_2
    L5_3 --> L6_3
    L2_4 --> L6_5
    L6_1 --> L6_4
    L6_2 --> L6_4
    
    L6_1 --> L7_1
    L7_1 --> L7_2
    L7_2 --> L7_3
    L7_3 --> L7_4
    
    L5_1 --> L8_1
    L5_2 --> L8_2
    L5_5 --> L8_3
    L7_4 --> L8_4
    
    style L2_1 fill:#e1f5ff
    style L3_1 fill:#fff4e6
    style L4_1 fill:#f3e5f5
    style L6_1 fill:#d4edda
```

---

## 三、8角色协作架构图

```mermaid
graph TB
    subgraph "战略层角色"
        MGR[管理者 Manager<br/>━━━━━━━━━━━━<br/>战略决策 资源分配<br/>效能优化 质量管理<br/>━━━━━━━━━━━━<br/>工作台:<br/>• Dashboard<br/>• 价值流分析<br/>• 效能分析<br/>• 质量分析<br/>• 成本分析]
    end
    
    subgraph "产品层角色"
        PM[产品经理 PM<br/>━━━━━━━━━━━━<br/>产品规划 需求管理<br/>产品配置 发布管理<br/>━━━━━━━━━━━━<br/>工作台:<br/>• 产品管理<br/>• 用户需求管理<br/>• 需求看板<br/>• 产品配置<br/>• 价值网络L1]
        
        SE[系统工程师 SE<br/>━━━━━━━━━━━━<br/>需求分析 系统架构<br/>需求分解 系统集成<br/>━━━━━━━━━━━━<br/>工作台:<br/>• 用户需求<br/>• 特性需求<br/>• 追溯管理<br/>• 影响分析<br/>• 价值网络L2]
    end
    
    subgraph "开发层角色"
        FO[特性负责人 FO<br/>━━━━━━━━━━━━<br/>特性设计 团队管理<br/>代码审查 特性交付<br/>━━━━━━━━━━━━<br/>工作台:<br/>• 特性管理<br/>• 模块需求<br/>• Sprint管理<br/>• Story/Task<br/>• PR管理]
        
        DEV[开发工程师 Dev<br/>━━━━━━━━━━━━<br/>模块开发 代码实现<br/>单元测试 缺陷修复<br/>━━━━━━━━━━━━<br/>工作台:<br/>• 我的任务<br/>• Sprint看板<br/>• Story/Task<br/>• 代码提交<br/>• 构建状态]
    end
    
    subgraph "质量层角色"
        QA[测试工程师 QA<br/>━━━━━━━━━━━━<br/>测试策略 用例设计<br/>测试执行 缺陷管理<br/>━━━━━━━━━━━━<br/>工作台:<br/>• 测试计划<br/>• 测试用例<br/>• 测试执行<br/>• 缺陷管理<br/>• 测试报告]
    end
    
    subgraph "支撑层角色"
        DEVOPS[DevOps工程师<br/>━━━━━━━━━━━━<br/>CI/CD配置 环境管理<br/>发布管理 监控运维<br/>━━━━━━━━━━━━<br/>工作台:<br/>• 构建管理<br/>• 流水线配置<br/>• 环境管理<br/>• 发布管理]
        
        PMO[项目经理 PMO<br/>━━━━━━━━━━━━<br/>项目规划 PI Planning<br/>资源协调 风险管理<br/>━━━━━━━━━━━━<br/>工作台:<br/>• 项目管理<br/>• PI Planning<br/>• Sprint管理<br/>• 依赖/风险管理]
    end
    
    MGR -->|战略指导| PM
    MGR -->|效能监控| PMO
    
    PM -->|需求输入| SE
    SE -->|需求分解| FO
    FO -->|任务分配| DEV
    
    DEV -->|代码提交| FO
    FO -->|特性交付| SE
    SE -->|系统集成| PM
    
    QA -->|测试| DEV
    QA -->|测试| FO
    QA -->|测试| SE
    
    DEVOPS -->|构建发布| DEV
    DEVOPS -->|部署| FO
    DEVOPS -->|发布| PM
    
    PMO -->|组织| PM
    PMO -->|组织| SE
    PMO -->|组织| FO
    PMO -->|跟踪| DEV
    
    QA -.质量报告.-> MGR
    DEVOPS -.发布报告.-> MGR
    PMO -.进度报告.-> MGR
    
    style MGR fill:#e1f5ff
    style PM fill:#fff4e6
    style SE fill:#fff4e6
    style FO fill:#f3e5f5
    style PMO fill:#d4edda
```

---

## 四、9阶段价值流架构图

```mermaid
graph LR
    Start([业务触发]) --> S1
    
    subgraph S1["阶段1: 战略规划<br/>━━━━━━━━━━<br/>角色: 管理者 产品线经理<br/>产出: 产品立项批准"]
        S1_1[产品线规划]
        S1_2[战略制定]
        S1_3[资源分配]
    end
    
    subgraph S2["阶段2: 产品定义<br/>━━━━━━━━━━<br/>角色: 产品经理<br/>产出: PRD 产品配置"]
        S2_1[产品创建]
        S2_2[用户需求]
        S2_3[产品配置]
    end
    
    subgraph S3["阶段3: 需求分解<br/>━━━━━━━━━━<br/>角色: 系统工程师<br/>产出: 系统设计 追溯矩阵"]
        S3_1[需求分析]
        S3_2[特性需求]
        S3_3[模块需求]
        S3_4[追溯建立]
    end
    
    subgraph S4["阶段4: PI Planning<br/>━━━━━━━━━━<br/>角色: 项目经理 所有团队<br/>产出: PI计划 依赖/风险"]
        S4_1[PI创建]
        S4_2[团队规划]
        S4_3[Objectives]
        S4_4[依赖管理]
    end
    
    subgraph S5["阶段5: Sprint执行<br/>━━━━━━━━━━<br/>角色: FO Dev QA<br/>产出: 可工作软件增量"]
        S5_1[Sprint规划]
        S5_2[Story开发]
        S5_3[Task执行]
        S5_4[代码审查]
    end
    
    subgraph S6["阶段6: 持续集成<br/>━━━━━━━━━━<br/>角色: DevOps Dev<br/>产出: 构建产物 测试报告"]
        S6_1[自动构建]
        S6_2[自动测试]
        S6_3[质量分析]
    end
    
    subgraph S7["阶段7: 测试验证<br/>━━━━━━━━━━<br/>角色: 测试工程师<br/>产出: 测试报告 缺陷列表"]
        S7_1[测试计划]
        S7_2[测试执行]
        S7_3[缺陷管理]
    end
    
    subgraph S8["阶段8: 发布部署<br/>━━━━━━━━━━<br/>角色: DevOps PMO<br/>产出: 发布版本 部署记录"]
        S8_1[发布计划]
        S8_2[部署执行]
        S8_3[发布验证]
    end
    
    subgraph S9["阶段9: 监控优化<br/>━━━━━━━━━━<br/>角色: 管理者 DevOps<br/>产出: 分析报告 改进建议"]
        S9_1[价值流分析]
        S9_2[效能分析]
        S9_3[质量分析]
        S9_4[持续改进]
    end
    
    S1 --> S2 --> S3 --> S4 --> S5 --> S6 --> S7 --> S8 --> S9
    S9 -.反馈优化.-> S1
    
    S9 --> End([持续迭代])
    
    style S1 fill:#e1f5ff
    style S3 fill:#fff4e6
    style S5 fill:#f3e5f5
    style S9 fill:#d4edda
```

### 价值流关键指标

```mermaid
graph TB
    subgraph "价值流效率指标"
        LT[前置时间 Lead Time<br/>目标: < 30天<br/>计算: 从需求到交付的总时间]
        CT[周期时间 Cycle Time<br/>目标: < 15天<br/>计算: 从开发到交付的时间]
        FE[流动效率 Flow Efficiency<br/>目标: > 60%<br/>计算: 实际工作时间/总时间]
        DF[部署频率 Deploy Frequency<br/>目标: > 12次/月<br/>计算: 月发布次数]
    end
    
    LT --> Optimize[持续优化]
    CT --> Optimize
    FE --> Optimize
    DF --> Optimize
    
    style Optimize fill:#d4edda
```

---

## 五、74页面功能架构图

```mermaid
graph TB
    subgraph "Phase 0: 已实现 23页面"
        P0_1[基础框架 3<br/>登录 Dashboard Layout]
        P0_2[项目管理 3<br/>项目列表/详情/看板]
        P0_3[PI Planning 3<br/>列表/工作区/看板]
        P0_4[资产管理 2<br/>产品列表/详情]
        P0_5[需求管理 4<br/>用户需求 追溯 矩阵 影响]
        P0_6[Sprint 1<br/>Sprint列表]
        P0_7[价值网络 3<br/>L1/L2/L3价值网络]
        P0_8[价值流 1<br/>主价值流]
        P0_9[系统管理 3<br/>用户/角色/权限]
    end
    
    subgraph "Phase 1: 资产与需求 15页面"
        P1_1[资产管理深化 7<br/>产品线列表/详情<br/>领域特性列表/详情<br/>软件模块列表/详情<br/>资产关系图]
        P1_2[需求管理深化 8<br/>用户需求详情<br/>特性需求列表/详情<br/>模块需求列表/详情<br/>需求变更列表/详情<br/>需求看板]
    end
    
    subgraph "Phase 2: 项目与协同 16页面"
        P2_1[PI Planning深化 5<br/>PI详情<br/>团队规划<br/>依赖管理<br/>风险管理<br/>PI报告]
        P2_2[Sprint协同 11<br/>Sprint详情/看板/规划/回顾<br/>Story列表/详情<br/>Task列表/详情<br/>Commits/PR<br/>评审管理]
    end
    
    subgraph "Phase 3: DevOps与测试 12页面"
        P3_1[DevOps流水线 6<br/>构建列表/详情<br/>流水线配置<br/>环境管理<br/>发布列表/详情]
        P3_2[测试管理 6<br/>测试用例列表/详情<br/>测试计划<br/>缺陷列表/详情<br/>测试报告]
    end
    
    subgraph "Phase 4: 数据分析与系统 8页面"
        P4_1[数据分析 4<br/>价值流分析<br/>效能分析<br/>质量分析<br/>成本分析]
        P4_2[系统管理 4<br/>系统配置<br/>操作日志<br/>通知中心<br/>帮助文档]
    end
    
    P0_1 --> P0_2 --> P0_3 --> P0_4 --> P0_5 --> P0_6 --> P0_7 --> P0_8 --> P0_9
    P0_4 --> P1_1
    P0_5 --> P1_2
    P0_3 --> P2_1
    P0_6 --> P2_2
    P2_2 --> P3_1
    P2_2 --> P3_2
    P0_8 --> P4_1
    P0_9 --> P4_2
    
    style P0_1 fill:#90EE90
    style P1_1 fill:#e1f5ff
    style P2_1 fill:#fff4e6
    style P3_1 fill:#f3e5f5
    style P4_1 fill:#d4edda
```

### 页面与角色映射

```mermaid
graph LR
    subgraph "8个角色"
        PM[产品经理]
        SE[系统工程师]
        FO[特性负责人]
        DEV[开发工程师]
        QA[测试工程师]
        DEVOPS[DevOps工程师]
        PMO[项目经理]
        MGR[管理者]
    end
    
    subgraph "74个页面"
        Asset[资产管理<br/>18页面]
        Req[需求管理<br/>17页面]
        Collab[协同管理<br/>22页面]
        DevOps[DevOps<br/>12页面]
        Data[数据分析<br/>4页面]
        Sys[系统管理<br/>7页面]
    end
    
    PM --> Asset
    PM --> Req
    SE --> Req
    SE --> Asset
    FO --> Collab
    DEV --> Collab
    QA --> DevOps
    DEVOPS --> DevOps
    PMO --> Collab
    MGR --> Data
    MGR --> Sys
    
    style PM fill:#e1f5ff
    style FO fill:#f3e5f5
    style MGR fill:#d4edda
```

---

## 六、7层需求追溯架构图

```mermaid
graph TB
    subgraph "L1: 战略目标层"
        L1_1[公司战略目标]
        L1_2[技术战略规划]
    end
    
    subgraph "L2: 产品规划层"
        L2_1[产品路线图]
        L2_2[版本规划]
    end
    
    subgraph "L3: 用户需求层 R1"
        R1_1[用户需求 R1<br/>━━━━━━━━━━<br/>ID: R1-001<br/>标题: AVP自主泊车功能<br/>━━━━━━━━━━<br/>支撑页面:<br/>• 用户需求列表<br/>• 用户需求详情]
    end
    
    subgraph "L4: 特性需求层 R2"
        R2_1[特性需求 R2-001<br/>感知融合]
        R2_2[特性需求 R2-002<br/>路径规划]
        R2_3[特性需求 R2-003<br/>车辆控制]
    end
    
    subgraph "L5: 模块需求层 R3"
        R3_1[模块需求 R3-001<br/>超声波感知模块]
        R3_2[模块需求 R3-002<br/>环视感知模块]
        R3_3[模块需求 R3-003<br/>A*路径规划算法]
    end
    
    subgraph "L6: 任务层"
        Task1[Story S-001<br/>实现超声波数据采集]
        Task2[Task T-001<br/>开发数据采集接口]
        Task3[Task T-002<br/>实现数据预处理]
    end
    
    subgraph "L7: 代码层"
        Code1[Commit C-001<br/>feat: 添加超声波驱动]
        Code2[PR PR-001<br/>超声波感知模块实现]
        Test1[Test Case TC-001<br/>超声波数据采集测试]
    end
    
    L1_1 --> L2_1
    L1_2 --> L2_1
    
    L2_1 --> L2_2
    
    L2_2 --> R1_1
    
    R1_1 --> R2_1
    R1_1 --> R2_2
    R1_1 --> R2_3
    
    R2_1 --> R3_1
    R2_1 --> R3_2
    R2_2 --> R3_3
    
    R3_1 --> Task1
    Task1 --> Task2
    Task1 --> Task3
    
    Task2 --> Code1
    Task3 --> Code2
    Task1 --> Test1
    
    Code1 -.测试验证.-> Test1
    
    style R1_1 fill:#e1f5ff
    style R2_1 fill:#fff4e6
    style R3_1 fill:#f3e5f5
    style Test1 fill:#d4edda
```

### 追溯关系类型

```mermaid
graph LR
    subgraph "正向追溯"
        F1[需求] -->|分解| F2[特性]
        F2 -->|细化| F3[模块]
        F3 -->|实现| F4[代码]
    end
    
    subgraph "反向追溯"
        B4[代码] -.溯源.-> B3[模块]
        B3 -.溯源.-> B2[特性]
        B2 -.溯源.-> B1[需求]
    end
    
    subgraph "横向追溯"
        H1[需求] <-->|验证| H2[测试用例]
        H3[代码] <-->|关联| H4[测试结果]
    end
    
    style F1 fill:#e1f5ff
    style B4 fill:#fff4e6
    style H1 fill:#f3e5f5
```

---

## 七、3层价值网络架构图

```mermaid
graph TB
    subgraph "L1: 战略级价值网络"
        Strategy[战略目标]
        
        PL1[产品线:<br/>智能驾驶]
        PL2[产品线:<br/>智能座舱]
        
        P1[产品: NOA<br/>高速领航]
        P2[产品: AVP<br/>自主泊车]
        P3[产品: LCC<br/>车道保持]
        
        Strategy --> PL1
        Strategy --> PL2
        PL1 --> P1
        PL1 --> P2
        PL1 --> P3
    end
    
    subgraph "L2: 执行级价值网络"
        P1_E[产品: NOA]
        
        F1[特性:<br/>融合感知]
        F2[特性:<br/>路径规划]
        F3[特性:<br/>车辆控制]
        
        M1[模块:<br/>摄像头感知]
        M2[模块:<br/>雷达感知]
        M3[模块:<br/>A*算法]
        M4[模块:<br/>纵向控制]
        M5[模块:<br/>横向控制]
        
        P1_E --> F1
        P1_E --> F2
        P1_E --> F3
        
        F1 --> M1
        F1 --> M2
        F2 --> M3
        F3 --> M4
        F3 --> M5
        
        M1 -.依赖.-> M2
        M3 -.依赖.-> M1
        M4 -.依赖.-> M3
    end
    
    subgraph "L3: 操作级价值网络"
        M1_O[模块:<br/>摄像头感知]
        
        R1[需求:<br/>R3-001]
        R2[需求:<br/>R3-002]
        
        S1[Story:<br/>S-001]
        S2[Story:<br/>S-002]
        
        T1[Task:<br/>T-001]
        T2[Task:<br/>T-002]
        T3[Task:<br/>T-003]
        
        C1[Commit:<br/>C-001]
        C2[Commit:<br/>C-002]
        
        TC1[Test Case:<br/>TC-001]
        TC2[Test Case:<br/>TC-002]
        
        M1_O --> R1
        M1_O --> R2
        
        R1 --> S1
        R2 --> S2
        
        S1 --> T1
        S1 --> T2
        S2 --> T3
        
        T1 --> C1
        T2 --> C2
        T3 --> C2
        
        S1 --> TC1
        S2 --> TC2
        
        C1 -.测试.-> TC1
        C2 -.测试.-> TC2
    end
    
    P1 -.映射.-> P1_E
    M1 -.映射.-> M1_O
    
    style Strategy fill:#e1f5ff
    style P1_E fill:#fff4e6
    style M1_O fill:#f3e5f5
```

### 价值网络分析

```mermaid
graph LR
    subgraph "影响分析"
        Change[变更点:<br/>法规需求变更]
        Impact1[影响产品: 3个]
        Impact2[影响特性: 8个]
        Impact3[影响模块: 15个]
        Impact4[影响任务: 45个]
        
        Change --> Impact1 --> Impact2 --> Impact3 --> Impact4
    end
    
    subgraph "复用分析"
        Asset[资产:<br/>融合感知特性]
        Reuse1[复用次数: 5次]
        Reuse2[节省工时: 20人天]
        Reuse3[质量提升: 30%]
        
        Asset --> Reuse1 --> Reuse2 --> Reuse3
    end
    
    style Change fill:#FFB6C1
    style Asset fill:#90EE90
```

---

## 八、DevOps全流程架构图

```mermaid
graph LR
    subgraph "配置管理"
        Git[Git仓库]
        Branch[分支管理<br/>main/develop/feature]
        PR[Pull Request<br/>代码审查]
    end
    
    subgraph "持续集成 CI"
        Trigger[触发构建<br/>push/merge]
        Build[编译构建<br/>编译检查]
        UnitTest[单元测试<br/>覆盖率检查]
        Quality[代码质量<br/>SonarQube]
        Artifact[制品管理<br/>Docker镜像]
    end
    
    subgraph "持续测试"
        IntTest[集成测试<br/>API测试]
        E2ETest[E2E测试<br/>UI自动化]
        PerfTest[性能测试<br/>压力测试]
        SecTest[安全测试<br/>漏洞扫描]
    end
    
    subgraph "持续部署 CD"
        Dev[开发环境<br/>自动部署]
        Test[测试环境<br/>自动部署]
        Stage[预发布环境<br/>手动审批]
        Prod[生产环境<br/>灰度发布]
    end
    
    subgraph "监控运维"
        Monitor[监控告警<br/>Prometheus]
        Log[日志分析<br/>ELK]
        Trace[链路追踪<br/>Jaeger]
        Rollback[快速回滚<br/>一键回滚]
    end
    
    Git --> Branch --> PR
    PR --> Trigger
    
    Trigger --> Build --> UnitTest --> Quality --> Artifact
    
    Artifact --> IntTest --> E2ETest --> PerfTest --> SecTest
    
    SecTest --> Dev --> Test --> Stage --> Prod
    
    Prod --> Monitor
    Prod --> Log
    Prod --> Trace
    Monitor -.问题.-> Rollback
    
    Rollback -.回退.-> Stage
    
    style Trigger fill:#e1f5ff
    style Artifact fill:#fff4e6
    style Prod fill:#90EE90
    style Rollback fill:#FFB6C1
```

### DevOps关键指标

```mermaid
graph TB
    subgraph "DORA四大指标"
        DF[部署频率<br/>Deployment Frequency<br/>目标: >12次/月]
        LT[变更前置时间<br/>Lead Time for Changes<br/>目标: <15天]
        MTTR[故障恢复时间<br/>MTTR<br/>目标: <1小时]
        CFR[变更失败率<br/>Change Failure Rate<br/>目标: <5%]
    end
    
    subgraph "质量指标"
        BR[构建成功率<br/>目标: >90%]
        TC[测试覆盖率<br/>目标: >80%]
        CD[缺陷密度<br/>目标: <2个/KLOC]
    end
    
    DF --> Quality[高效能团队]
    LT --> Quality
    MTTR --> Quality
    CFR --> Quality
    
    BR --> Quality
    TC --> Quality
    CD --> Quality
    
    style Quality fill:#90EE90
```

---

## 九、数据分析架构图

```mermaid
graph TB
    subgraph "数据采集层"
        D1[业务数据<br/>需求 任务 代码]
        D2[流程数据<br/>PI Sprint 发布]
        D3[质量数据<br/>缺陷 测试 覆盖率]
        D4[时间数据<br/>创建 开始 完成]
    end
    
    subgraph "数据存储层"
        PG[(PostgreSQL<br/>关系数据)]
        Neo[(Neo4j<br/>图数据)]
        TS[(TimescaleDB<br/>时序数据)]
        Redis[(Redis<br/>缓存)]
    end
    
    subgraph "数据分析层"
        VS[价值流分析<br/>━━━━━━━━━━<br/>• 9阶段耗时<br/>• 瓶颈识别<br/>• 流动效率<br/>• Lead Time]
        
        EFF[效能分析<br/>━━━━━━━━━━<br/>• 团队速率<br/>• 可预测性<br/>• 吞吐量<br/>• 协作效率]
        
        QUA[质量分析<br/>━━━━━━━━━━<br/>• 缺陷密度<br/>• 测试覆盖率<br/>• 代码质量<br/>• 构建成功率]
        
        COST[成本分析<br/>━━━━━━━━━━<br/>• 成本构成<br/>• 团队成本<br/>• ROI分析<br/>• 成本优化]
        
        REUSE[复用分析<br/>━━━━━━━━━━<br/>• 复用率<br/>• 复用收益<br/>• 热力图<br/>• 复用趋势]
    end
    
    subgraph "可视化展示层"
        Dashboard[Dashboard<br/>管理者驾驶舱]
        Report[报表中心<br/>多维度报表]
        Alert[智能预警<br/>异常告警]
    end
    
    D1 --> PG
    D2 --> PG
    D3 --> PG
    D4 --> TS
    
    D1 --> Neo
    D2 --> Neo
    
    PG --> Redis
    Neo --> Redis
    TS --> Redis
    
    Redis --> VS
    Redis --> EFF
    Redis --> QUA
    Redis --> COST
    Redis --> REUSE
    
    VS --> Dashboard
    EFF --> Dashboard
    QUA --> Dashboard
    COST --> Dashboard
    REUSE --> Dashboard
    
    VS --> Report
    EFF --> Report
    QUA --> Report
    
    QUA --> Alert
    EFF --> Alert
    
    style Dashboard fill:#e1f5ff
    style VS fill:#fff4e6
    style Alert fill:#FFB6C1
```

### 分析维度矩阵

```mermaid
graph LR
    subgraph "时间维度"
        T1[日]
        T2[周]
        T3[月]
        T4[季度]
        T5[年]
    end
    
    subgraph "组织维度"
        O1[个人]
        O2[团队]
        O3[项目]
        O4[产品线]
        O5[公司]
    end
    
    subgraph "指标维度"
        M1[效率]
        M2[质量]
        M3[成本]
        M4[复用]
    end
    
    T1 --> Analysis[多维分析引擎]
    T2 --> Analysis
    T3 --> Analysis
    
    O1 --> Analysis
    O2 --> Analysis
    O3 --> Analysis
    
    M1 --> Analysis
    M2 --> Analysis
    M3 --> Analysis
    M4 --> Analysis
    
    Analysis --> Insight[洞察发现]
    
    style Analysis fill:#90EE90
    style Insight fill:#FFD700
```

---

## 十、技术架构分层图

```mermaid
graph TB
    subgraph "L1: 用户体验层"
        Web[Web前端<br/>━━━━━━━━━━<br/>Vue 3.3+ TypeScript<br/>Element Plus<br/>ECharts Cytoscape]
        Mobile[移动端<br/>━━━━━━━━━━<br/>响应式设计<br/>PWA支持]
    end
    
    subgraph "L2: 应用服务层"
        API[API网关<br/>━━━━━━━━━━<br/>路由 鉴权 限流]
        
        BizService[业务服务<br/>━━━━━━━━━━<br/>• 资产服务<br/>• 需求服务<br/>• 协同服务<br/>• DevOps服务<br/>• 分析服务]
    end
    
    subgraph "L3: 平台服务层"
        Workflow[工作流引擎<br/>审批流 状态机]
        Trace[追溯引擎<br/>图查询 关系分析]
        Search[搜索引擎<br/>全文搜索 智能推荐]
        Message[消息中心<br/>通知 订阅]
        Auth[权限中心<br/>认证 授权 SSO]
        Analytics[分析引擎<br/>统计 预测]
    end
    
    subgraph "L4: 数据服务层"
        DataAPI[数据访问层<br/>ORM GraphDB API]
        Cache[缓存层<br/>Redis 分布式缓存]
        MQ[消息队列<br/>异步处理 事件驱动]
    end
    
    subgraph "L5: 数据存储层"
        PG[(PostgreSQL<br/>━━━━━━━━<br/>业务数据<br/>用户 项目 任务)]
        
        Neo[(Neo4j<br/>━━━━━━━━<br/>追溯关系<br/>价值网络)]
        
        TS[(TimescaleDB<br/>━━━━━━━━<br/>时序数据<br/>指标 日志)]
        
        MinIO[(MinIO<br/>━━━━━━━━<br/>对象存储<br/>文件 附件)]
    end
    
    subgraph "L6: 基础设施层"
        K8s[容器编排<br/>Kubernetes]
        Monitor[监控运维<br/>Prometheus Grafana]
        Log[日志系统<br/>ELK Stack]
    end
    
    Web --> API
    Mobile --> API
    
    API --> BizService
    
    BizService --> Workflow
    BizService --> Trace
    BizService --> Search
    BizService --> Message
    BizService --> Auth
    BizService --> Analytics
    
    Workflow --> DataAPI
    Trace --> DataAPI
    Search --> DataAPI
    Message --> DataAPI
    Auth --> DataAPI
    Analytics --> DataAPI
    
    DataAPI --> Cache
    DataAPI --> MQ
    
    DataAPI --> PG
    DataAPI --> Neo
    DataAPI --> TS
    DataAPI --> MinIO
    
    PG --> K8s
    Neo --> K8s
    TS --> K8s
    MinIO --> K8s
    
    K8s --> Monitor
    K8s --> Log
    
    style Web fill:#e1f5ff
    style BizService fill:#fff4e6
    style DataAPI fill:#f3e5f5
    style PG fill:#FFE4B5
```

### 技术栈详细清单

```mermaid
graph LR
    subgraph "前端技术栈"
        FE1[核心框架<br/>Vue 3.3+<br/>TypeScript 5.0+<br/>Vite 4.0+]
        
        FE2[UI组件<br/>Element Plus 2.3+<br/>自定义组件库]
        
        FE3[状态管理<br/>Pinia 2.1+<br/>Vuex可选]
        
        FE4[数据可视化<br/>ECharts 5.4+<br/>Cytoscape.js 3.26+<br/>D3.js可选]
    end
    
    subgraph "后端技术栈"
        BE1[运行时<br/>Node.js 18+<br/>TypeScript 5.0+]
        
        BE2[Web框架<br/>Express 4.18+<br/>Koa可选]
        
        BE3[数据库<br/>PostgreSQL 15+<br/>Neo4j 5.0+<br/>TimescaleDB<br/>Redis 7.0+]
        
        BE4[工具库<br/>TypeORM<br/>neo4j-driver<br/>ioredis<br/>JWT]
    end
    
    subgraph "DevOps工具"
        DO1[CI/CD<br/>GitLab CI<br/>Jenkins<br/>GitHub Actions]
        
        DO2[容器化<br/>Docker<br/>Kubernetes]
        
        DO3[监控<br/>Prometheus<br/>Grafana<br/>ELK]
        
        DO4[质量<br/>SonarQube<br/>Jest<br/>Cypress]
    end
    
    FE1 --> App[Auto DevOps平台]
    FE2 --> App
    FE3 --> App
    FE4 --> App
    
    BE1 --> App
    BE2 --> App
    BE3 --> App
    BE4 --> App
    
    DO1 --> App
    DO2 --> App
    DO3 --> App
    DO4 --> App
    
    style App fill:#90EE90
```

---

## 📊 架构图使用说明

### 1. 综合业务架构全景图
**用途**: 理解平台的整体架构，从战略到实施的完整视图
**适用**: 管理层、新成员、对外宣讲

### 2. 8层业务能力架构图
**用途**: 详细了解每层业务能力及其依赖关系
**适用**: 产品设计、需求分析、能力规划

### 3. 8角色协作架构图
**用途**: 理解角色职责和协作关系
**适用**: 团队协作、职责划分、培训

### 4. 9阶段价值流架构图
**用途**: 端到端业务流程和价值流转
**适用**: 流程优化、效能分析、瓶颈识别

### 5. 74页面功能架构图
**用途**: 页面功能分布和实施进度
**适用**: 开发规划、进度跟踪、验收

### 6. 7层需求追溯架构图
**用途**: 需求追溯关系和覆盖率
**适用**: 需求管理、影响分析、合规审计

### 7. 3层价值网络架构图
**用途**: 战略到执行的价值网络关系
**适用**: 影响分析、复用分析、依赖管理

### 8. DevOps全流程架构图
**用途**: CI/CD流程和质量保障
**适用**: DevOps实施、自动化配置、质量管理

### 9. 数据分析架构图
**用途**: 数据分析体系和指标看板
**适用**: 效能分析、质量分析、决策支持

### 10. 技术架构分层图
**用途**: 技术架构和技术栈选型
**适用**: 技术方案、开发实施、运维部署

---

## 🎯 关键架构决策

### 1. 分层架构设计
- **决策**: 采用清晰的分层架构（L1-L8业务能力 + L1-L6技术架构）
- **理由**: 职责清晰、易于扩展、便于维护

### 2. 角色驱动设计
- **决策**: 8个核心角色，每个角色有专属工作台
- **理由**: 提高协作效率、降低学习成本、提升用户体验

### 3. 价值流优先
- **决策**: 9阶段端到端价值流作为核心主线
- **理由**: 端到端可视化、持续优化、数据驱动

### 4. 图数据库追溯
- **决策**: 使用Neo4j存储7层追溯关系和3层价值网络
- **理由**: 复杂关系查询高效、影响分析快速、可视化友好

### 5. 微服务架构
- **决策**: 采用微服务架构，服务按业务域划分
- **理由**: 独立部署、弹性伸缩、技术异构

---

## 📚 相关文档

- **业务架构v2.0**: `Architecture/00-BUSINESS_ARCHITECTURE_V2.md`
- **领域模型设计**: `Architecture/00-DOMAIN_MODEL_DESIGN.md`
- **功能架构**: `Architecture/02-FUNCTIONAL_ARCHITECTURE.md`
- **平台架构**: `Architecture/05-PLATFORM_ARCHITECTURE_DESIGN.md`
- **价值流设计**: `../platform-rd-process/03-VALUE_STREAM_WITH_PI_PLANNING.md`
- **追溯设计**: `../platform-rd-process/03-TRACEABILITY_AND_VALUE_NETWORK.md`

---

**📄 本文档**: `Architecture/BUSINESS_ARCHITECTURE_DIAGRAM.md`  
**📅 创建日期**: 2025-01-05  
**🏷️ 版本**: v2.0  
**✅ 状态**: 完整的业务架构图（10个视角）

**🎉 10个视角的完整业务架构图，支持多场景使用！**

