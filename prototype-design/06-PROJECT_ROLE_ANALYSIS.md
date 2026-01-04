# Auto DevOps平台 - 项目角色与关系分析

> **文档版本**: v1.0  
> **创建日期**: 2025-01-03  
> **目标**: 澄清"项目"在领域模型和研发价值流中的作用和关系

---

## 📋 目录

1. [问题陈述](#一问题陈述)
2. [汽车行业项目定义](#二汽车行业项目定义)
3. [项目与现有模型的关系](#三项目与现有模型的关系)
4. [补充的项目领域模型](#四补充的项目领域模型)
5. [项目在价值流中的作用](#五项目在价值流中的作用)
6. [实例化分析](#六实例化分析)
7. [设计调整建议](#七设计调整建议)

---

## 一、问题陈述

### 1.1 当前状况

在现有的领域模型和研发价值流设计中：

**领域模型中的实体**:
```
✅ 产品线 (ProductLine)
✅ 领域产品 (DomainProduct)
✅ 产品版本 (ProductVersion)
✅ 领域特性 (DomainFeature)
✅ 软件模块 (SoftwareModule)
✅ 需求 (UserRequirement, FeatureRequirement, ModuleRequirement)
✅ PI (Program Increment)
✅ Sprint / Iteration
❌ 项目 (Project) - 缺失
```

**价值流中的阶段**:
```
产品规划 → 需求分析 → PI Planning → 迭代研发 → ... → 发布交付
```

### 1.2 问题

1. **"项目"实体缺失**: 领域模型中没有明确定义"项目"
2. **关系不清**: 项目与产品、版本、PI、需求的关系不明确
3. **实际脱节**: 汽车行业中"项目"是核心管理单元，但在模型中缺失

### 1.3 为什么重要

在汽车行业中：
- **整车厂视角**: "整车项目"是核心（如：P1项目 = 2026款A级轿车）
- **资源管理**: 人力、预算、时间都以项目为单位管理
- **交付目标**: 项目有明确的交付里程碑和质量要求
- **跨组织协同**: 项目涉及多个产品线、多个供应商

---

## 二、汽车行业项目定义

### 2.1 典型的汽车项目类型

#### 类型1: 整车项目 (Vehicle Program)

```yaml
示例: P1项目 - 2026款A级轿车
描述: 
  - 一个完整的车型开发项目
  - 周期: 3-5年
  - 涉及: 车身、底盘、动力、电子电气、智能驾驶等所有系统
  
交付物:
  - 整车SOP (Start of Production)
  - 所有系统集成并验证
  - 满足法规和客户需求
  
组织:
  - 项目总监
  - 各系统项目经理
  - 多个跨职能团队
```

#### 类型2: 平台项目 (Platform Program)

```yaml
示例: MEB电动平台项目
描述:
  - 一个技术平台的开发项目
  - 周期: 2-4年
  - 可支撑多个车型
  
交付物:
  - 平台架构
  - 平台模块和组件
  - 平台接口规范
```

#### 类型3: 系统/功能项目 (System/Feature Program)

```yaml
示例: NOA智能驾驶项目
描述:
  - 单个系统或功能的开发项目
  - 周期: 1-2年
  - 可集成到多个整车项目
  
交付物:
  - 系统软硬件
  - 系统测试报告
  - 集成文档
```

### 2.2 项目的关键特征

| 特征 | 说明 | 示例 |
|-----|------|------|
| **明确的目标** | 交付特定的产品或功能 | P1项目: 交付2026款A级轿车 |
| **时间约束** | 有明确的开始和结束时间 | 2024-Q1 ~ 2026-Q4 (3年) |
| **资源约束** | 固定的人力、预算、设备 | 团队: 200人, 预算: 5亿 |
| **跨组织** | 涉及多个部门/供应商 | 车身、底盘、电子、智驾 |
| **里程碑** | 多个阶段性交付节点 | 概念、设计、开发、验证、SOP |
| **质量要求** | 严格的质量和法规标准 | ISO 26262, ASPICE |

### 2.3 项目与产品的区别

```
产品 (Product):
- 定义: 持续演进的产品线或产品
- 生命周期: 长期（5-10年或更长）
- 焦点: 产品能力、市场竞争力
- 管理: 产品经理
- 示例: NOA产品（v1.0, v2.0, v3.0, ...）

项目 (Project):
- 定义: 有明确目标和时间的临时性组织
- 生命周期: 短期（1-5年）
- 焦点: 按时、按质、按预算交付
- 管理: 项目经理
- 示例: P1整车项目（2024-2026）
```

---

## 三、项目与现有模型的关系

### 3.1 项目在层次结构中的位置

```
【战略层】
ProductLine (产品线)
  └─ 定义长期的产品规划

【项目层】← 缺失层级
Project (项目)
  └─ 组织交付特定目标

【产品层】
DomainProduct (领域产品)
  └─ 定义产品功能和版本

【执行层】
PI (Program Increment)
  └─ 8-12周的开发周期
```

### 3.2 项目与产品的关系模式

#### 模式1: 一对一（整车项目）

```
整车项目: P1项目 (2026款A级轿车)
  ↓ delivers
领域产品: 
  - NOA v3.0 (智能驾驶)
  - IVI v5.0 (车机系统)
  - Gateway v2.0 (网关)
  - ... (20+个系统)

关系: 一个整车项目集成多个领域产品的特定版本
```

#### 模式2: 一对多（平台项目）

```
平台项目: MEB平台项目
  ↓ produces
技术平台: MEB电动平台
  ↓ supports
领域产品:
  - ID.3
  - ID.4
  - ID.6
  - ... (多个车型)

关系: 一个平台项目创建一个平台，支撑多个产品
```

#### 模式3: 多对一（功能项目）

```
功能项目: NOA项目 (2024-2026)
  ↓ delivers
领域产品: NOA (多个版本)
  - v2.0 (2024-Q4) → 应用到 P1项目
  - v3.0 (2025-Q2) → 应用到 P2项目
  - v3.1 (2025-Q4) → 应用到 P3项目

关系: 一个功能项目持续交付产品版本，应用到多个整车项目
```

### 3.3 项目与需求的关系

```
【需求来源】
整车项目需求 (Vehicle Program Requirements)
  ↓ derives
系统需求 (System Requirements)
  ↓ derives
用户需求 (User Requirements)
  ↓ derives
特性需求 (Feature Requirements)

【需求分配】
整车项目
  ├─ 分配需求 → NOA项目
  ├─ 分配需求 → IVI项目
  └─ 分配需求 → Gateway项目

【需求追溯】
特性需求 → 实现 → 软件模块
  ↓ integrates into
领域产品版本 (NOA v3.0)
  ↓ delivers to
整车项目 (P1项目)
```

### 3.4 项目与PI的关系

```
项目生命周期: 2-3年
  ├─ PI-1 (8-12周)
  ├─ PI-2 (8-12周)
  ├─ PI-3 (8-12周)
  ├─ ...
  └─ PI-N (8-12周)

关系类型:
- 项目包含多个PI
- 每个PI交付项目的阶段性成果
- PI是项目的执行单元

示例:
NOA项目 (2024-2026, 3年)
  ├─ PI-2024-Q1: 基础感知能力
  ├─ PI-2024-Q2: 融合感知升级
  ├─ PI-2024-Q3: 路径规划优化
  ├─ ...
  └─ PI-2026-Q4: 最终验证和交付
```

---

## 四、补充的项目领域模型

### 4.1 项目实体定义

#### Project (项目)

```yaml
实体: Project
说明: 有明确目标、时间和资源约束的临时性组织

核心属性:
  - id: 项目唯一标识
  - name: 项目名称
  - type: 项目类型 (整车项目、平台项目、功能项目)
  - code: 项目代号 (如: P1, P2)
  - description: 项目描述
  - objective: 项目目标
  - startDate: 开始时间
  - endDate: 计划结束时间
  - status: 项目状态 (规划、启动、执行、验收、关闭)
  - budget: 预算
  - priority: 优先级
  
组织属性:
  - projectManager: 项目经理
  - sponsor: 项目发起人
  - stakeholders: 干系人列表
  - teams: 参与团队列表
  
交付属性:
  - deliverables: 交付物清单
  - milestones: 里程碑
  - qualityStandards: 质量标准
  
关联关系:
  - productLine: 所属产品线
  - targetProducts: 目标产品列表 (一对多)
  - sourceProducts: 输入产品列表 (依赖的产品)
  - requirements: 项目需求列表
  - pis: 包含的PI列表
  - dependencies: 项目依赖关系
```

#### ProjectMilestone (项目里程碑)

```yaml
实体: ProjectMilestone
说明: 项目的阶段性目标和检查点

属性:
  - id: 里程碑ID
  - projectId: 所属项目
  - name: 里程碑名称
  - type: 类型 (概念、设计、开发、验证、交付)
  - plannedDate: 计划日期
  - actualDate: 实际日期
  - status: 状态 (计划、进行中、完成、延期)
  - criteria: 通过标准
  - deliverables: 交付物
  - approvers: 审批人
  
示例:
  - M1: 概念冻结 (Concept Freeze)
  - M2: 设计冻结 (Design Freeze)
  - M3: 代码冻结 (Code Freeze)
  - M4: 功能冻结 (Feature Freeze)
  - M5: SOP (Start of Production)
```

#### ProjectRequirement (项目需求)

```yaml
实体: ProjectRequirement
说明: 项目级别的需求（通常来自整车项目）

属性:
  - id: 项目需求ID
  - projectId: 所属项目
  - source: 需求来源 (客户、法规、市场)
  - description: 需求描述
  - category: 需求类别 (功能、性能、质量、法规)
  - priority: 优先级
  - status: 状态
  
关联:
  - allocatedTo: 分配到的子项目/产品
  - derivedRequirements: 派生的系统/用户需求
```

### 4.2 项目关系定义

```yaml
关系类型: belongsTo (属于)
源: Project
目标: ProductLine
说明: 项目属于某个产品线
示例: NOA项目 belongsTo 智能驾驶产品线

---

关系类型: delivers (交付)
源: Project
目标: DomainProduct / ProductVersion
说明: 项目交付产品或产品版本
示例: 
  - P1项目 delivers NOA v3.0
  - NOA项目 delivers NOA产品 (多个版本)

---

关系类型: dependsOn (依赖)
源: Project
目标: Project
说明: 项目间的依赖关系
示例: P1项目 dependsOn NOA项目 (需要NOA v3.0)

---

关系类型: includes (包含)
源: Project
目标: PI
说明: 项目包含多个PI
示例: NOA项目 includes [PI-2024-Q1, PI-2024-Q2, ...]

---

关系类型: allocates (分配)
源: ProjectRequirement
目标: UserRequirement / FeatureRequirement
说明: 项目需求分配到产品需求
示例: P1-REQ-001 allocates UR-001 (NOA融合感知需求)

---

关系类型: integrates (集成)
源: Project (整车项目)
目标: DomainProduct (多个领域产品)
说明: 整车项目集成多个领域产品
示例: P1项目 integrates [NOA v3.0, IVI v5.0, Gateway v2.0]
```

### 4.3 补充后的完整领域模型

```
【产品线层】
ProductLine (产品线)
  ├─ has → DomainProduct (领域产品)
  └─ has → TechnologyPlatform (技术平台)

【项目层】← 新增
Project (项目)
  ├─ belongsTo → ProductLine
  ├─ delivers → DomainProduct / ProductVersion
  ├─ dependsOn → Project
  ├─ includes → PI (多个)
  ├─ has → ProjectRequirement (项目需求)
  └─ has → ProjectMilestone (里程碑)

【产品层】
DomainProduct (领域产品)
  ├─ deliveredBy → Project
  ├─ has → ProductVersion (产品版本)
  ├─ has → DomainFeature (领域特性)
  └─ has → LogicalArchitecture (逻辑架构)

【执行层】
PI (Program Increment)
  ├─ belongsTo → Project
  ├─ delivers → ProductVersion (部分功能)
  └─ includes → Sprint (多个)

【需求层】
ProjectRequirement (项目需求)
  ├─ belongsTo → Project
  └─ allocates → SystemRequirement / UserRequirement

SystemRequirement / UserRequirement
  ├─ allocatedFrom → ProjectRequirement
  └─ derives → FeatureRequirement
```

---

## 五、项目在价值流中的作用

### 5.1 调整后的价值流层次

```
【战略规划层】(1-3年)
产品线路线图
  ↓
项目立项与规划 ← 新增
  ↓
产品版本规划

【项目执行层】(按项目周期)
项目启动
  ↓
需求分析与分配 ← 调整（项目需求分配到产品）
  ↓
多产品协同规划 ← 调整（整车项目视角）
  ↓
PI Planning ← 调整（项目包含多个PI）
  ↓
迭代研发
  ↓
集成验证 ← 增强（项目级集成）
  ↓
项目交付 ← 调整（项目里程碑）

【持续运营层】
运维与迭代
```

### 5.2 调整后的8阶段价值流（整车项目视角）

#### 阶段0: 项目立项 (NEW!)

```yaml
阶段名称: 项目立项与规划
时间跨度: 1-3个月
负责角色: 产品线总监、项目总监、产品经理
核心活动:
  1. 项目立项
     - 定义项目目标和范围
     - 识别干系人
     - 评估资源和风险
  2. 项目规划
     - 制定项目计划
     - 定义项目里程碑
     - 分配预算和资源
  3. 产品范围确定
     - 确定集成的产品列表
     - 确定产品版本目标
     - 识别产品间依赖
  4. 项目需求收集
     - 收集客户需求
     - 收集法规要求
     - 收集市场需求

输入:
  - 产品线路线图
  - 市场分析
  - 技术趋势

输出:
  - Project (项目实体)
  - ProjectRequirement (项目需求)
  - ProjectMilestone (里程碑)
  - 产品集成清单
  - 项目章程

页面:
  - /projects/create (项目创建)
  - /projects/:id/charter (项目章程)
  - /projects/:id/requirements (项目需求)
  - /projects/:id/milestones (里程碑规划)
```

#### 阶段1: 产品规划 (调整)

```yaml
在项目上下文中:
  - 针对项目目标，规划各产品的版本
  - 确定产品交付时间与项目里程碑的关系
  
调整:
  - 产品版本需要关联到项目
  - ProductVersion.project = projectId
```

#### 阶段2: 需求分析 (调整)

```yaml
在项目上下文中:
  - 项目需求分配到各产品
  - 产品需求追溯到项目需求
  
调整:
  - 需求来源增加"项目需求"
  - UserRequirement.projectRequirement = projectRequirementId
  - 需求分配矩阵（项目需求 → 产品需求）
  
新增页面:
  - /projects/:id/requirements/allocation (需求分配)
  - /requirements/user/create?fromProject=:projectId
```

#### 阶段3: PI Planning (调整)

```yaml
在项目上下文中:
  - 整车项目视角: 多产品协同规划
  - 功能项目视角: 单产品多PI规划
  
调整:
  - PI归属于项目
  - PI.project = projectId
  - 跨产品依赖识别（整车项目特有）
  
新增功能:
  - 项目级PI Planning (整车项目)
  - 多产品协同视图
  - 项目级依赖管理
  
新增页面:
  - /projects/:id/pi-planning (项目级PI Planning)
  - /projects/:id/products (产品集成视图)
```

#### 阶段4-7: 迭代研发到需求验收 (微调)

```yaml
调整:
  - 所有工作产物关联到项目
  - Sprint.project = projectId
  - Story.project = projectId
  
新增指标:
  - 项目进度（按里程碑）
  - 项目健康度
  - 项目风险
```

#### 阶段8: 发布/交付 (调整)

```yaml
在项目上下文中:
  - 项目里程碑交付
  - 多产品集成交付
  
调整:
  - Release关联到项目和产品
  - Release.project = projectId
  - Release.milestone = milestoneId
  
新增:
  - 项目交付报告
  - 项目验收
  - 项目关闭
  
新增页面:
  - /projects/:id/releases (项目交付)
  - /projects/:id/milestones/:mid/delivery (里程碑交付)
  - /projects/:id/closure (项目关闭)
```

---

## 六、实例化分析

### 6.1 整车项目实例: P1项目

#### P1项目概览

```yaml
Project:
  id: proj-p1
  name: P1项目 - 2026款A级智能电动轿车
  type: 整车项目 (Vehicle Program)
  code: P1
  startDate: 2024-01-01
  endDate: 2026-12-31
  duration: 3年
  status: 执行中
  
  目标:
    - 交付2026款A级智能电动轿车
    - 支持L2+级智能驾驶
    - 达成500km续航
    - 满足C-NCAP五星标准
  
  组织:
    projectManager: 张伟 (项目总监)
    teams:
      - 车身团队 (50人)
      - 底盘团队 (40人)
      - 动力团队 (60人)
      - 智驾团队 (80人) ← 包含NOA
      - 车机团队 (50人)
      - 集成团队 (30人)
    totalHeadcount: 310人
    budget: 8亿元
  
  集成产品:
    - NOA v3.0 (智能驾驶)
    - IVI v5.0 (车机系统)
    - BMS v4.0 (电池管理)
    - Gateway v2.0 (网关)
    - OTA v3.0 (远程升级)
    - ... (20+个领域产品)
```

#### P1项目里程碑

```yaml
ProjectMilestones:
  - M0: 项目启动 (2024-01-01) ✓
  - M1: 概念冻结 (2024-06-30) ✓
  - M2: 设计冻结 (2025-03-31) 进行中
  - M3: 功能冻结 (2025-12-31) 计划
  - M4: 代码冻结 (2026-06-30) 计划
  - M5: SOP (2026-12-31) 计划
```

#### P1项目需求示例

```yaml
ProjectRequirement:
  - PR-P1-001:
      title: L2+级智能驾驶能力
      source: 市场需求
      description: 支持高速NOA、城市NOA、自动泊车
      priority: P0
      allocatedTo:
        - NOA项目 (主要)
        - 传感器项目
        - 域控制器项目
      derivedRequirements:
        - SR-001: NOA系统需求
        - UR-001: 融合感知升级需求
        - UR-002: 路径规划优化需求
  
  - PR-P1-002:
      title: 500km续航能力
      source: 客户需求
      allocatedTo:
        - BMS项目
        - 电池包项目
        - 电驱项目
```

#### P1项目的PI规划

```yaml
P1项目包含的PI:
  - PI-2024-Q1: 架构设计与集成框架
  - PI-2024-Q2: 核心功能开发（NOA基础、IVI基础）
  - PI-2024-Q3: 功能完善（NOA升级、IVI升级）
  - PI-2024-Q4: 功能集成与初步验证
  - PI-2025-Q1: 系统集成测试
  - PI-2025-Q2: 性能优化与问题修复
  - PI-2025-Q3: 法规测试与认证
  - PI-2025-Q4: 功能冻结
  - PI-2026-Q1: 代码冻结与最终验证
  - PI-2026-Q2: 生产准备
  - PI-2026-Q3: 小批量试产
  - PI-2026-Q4: SOP

每个PI的产出:
  - 集成多个产品的阶段性版本
  - 整车级测试报告
  - 问题和风险清单
```

### 6.2 功能项目实例: NOA项目

#### NOA项目概览

```yaml
Project:
  id: proj-noa
  name: NOA智能驾驶项目
  type: 功能项目 (Feature Program)
  code: NOA-2024
  startDate: 2024-01-01
  endDate: 2026-12-31
  duration: 3年
  status: 执行中
  
  目标:
    - 开发并持续演进NOA产品
    - 交付v2.0, v3.0, v3.1, v3.2, v4.0多个版本
    - 支撑多个整车项目
  
  组织:
    projectManager: 李明 (NOA项目经理)
    teams:
      - 感知团队 (30人)
      - 规划团队 (25人)
      - 控制团队 (20人)
      - 测试团队 (15人)
    totalHeadcount: 90人
    budget: 1.5亿元
  
  交付产品:
    - NOA产品（多个版本）
  
  应用到项目:
    - P1项目 (需要 NOA v3.0)
    - P2项目 (需要 NOA v3.1)
    - P3项目 (需要 NOA v4.0)
```

#### NOA项目与整车项目的关系

```yaml
关系:
  NOA项目 delivers NOA v3.0
  P1项目 integrates NOA v3.0
  
时间协调:
  P1项目 M2里程碑 (2025-03-31): 设计冻结
  → 要求: NOA v3.0 Alpha版本 (2025-02-28)
  
  P1项目 M3里程碑 (2025-12-31): 功能冻结
  → 要求: NOA v3.0 Release版本 (2025-11-30)

依赖:
  P1项目 dependsOn NOA项目
  - 类型: 技术依赖
  - 关键路径: 是
  - 风险等级: 高
  - 缓解措施: 提前集成、Mock接口、资源储备
```

#### NOA项目的PI规划

```yaml
NOA项目的PI:
  - PI-2024-Q1: 
      目标: v2.0发布（支撑早期项目）
      交付: NOA v2.0
      
  - PI-2024-Q2:
      目标: v3.0 Alpha开发
      交付: NOA v3.0 Alpha
      关联整车项目: P1项目（集成测试）
      
  - PI-2024-Q3:
      目标: v3.0 Beta开发
      交付: NOA v3.0 Beta
      
  - PI-2024-Q4:
      目标: v3.0发布
      交付: NOA v3.0 Release
      关联整车项目: P1项目（功能冻结前集成）
      
  - PI-2025-Q1:
      目标: v3.1开发（性能优化）
      交付: NOA v3.1
      关联整车项目: P2项目
      
  - ... 持续迭代
```

### 6.3 项目间协同实例

```yaml
场景: P1项目需要NOA v3.0

协同流程:
  1. P1项目规划阶段
     - 识别需要NOA功能
     - 创建项目需求: PR-P1-001 (L2+智驾)
     
  2. 需求分配
     - PR-P1-001 allocates to NOA项目
     - NOA项目创建产品需求: UR-001 (融合感知升级)
     
  3. 时间协调
     - P1项目 M2里程碑: 2025-03-31
     - NOA项目 v3.0 Alpha交付: 2025-02-28
     - 提前1个月交付，留出集成缓冲
     
  4. PI协同
     - P1 PI-2024-Q4: 集成NOA v3.0 Alpha
     - P1 PI-2025-Q1: 集成NOA v3.0 Beta
     - P1 PI-2025-Q2: 集成NOA v3.0 Release
     
  5. 依赖管理
     - 创建依赖: P1 dependsOn NOA
     - 风险识别: NOA延期风险
     - 缓解措施: 
       - NOA提供Mock接口
       - P1预留2周缓冲
       - 建立周同步会议
       
  6. 集成验证
     - P1项目整车级测试
     - NOA团队支持集成调试
     - 问题快速反馈和修复
     
  7. 项目交付
     - NOA v3.0 交付到 P1项目
     - P1项目 M3里程碑达成
```

---

## 七、设计调整建议

### 7.1 领域模型调整

#### 新增实体

```yaml
核心实体:
  1. Project (项目)
  2. ProjectMilestone (项目里程碑)
  3. ProjectRequirement (项目需求)
  4. ProjectDependency (项目依赖)
  5. ProjectTeam (项目团队)

辅助实体:
  6. ProjectRisk (项目风险)
  7. ProjectIssue (项目问题)
  8. ProjectBudget (项目预算)
```

#### 调整现有实体

```yaml
DomainProduct:
  新增属性:
    - projectId: 所属项目（可选，功能项目有）
    - deliveredToProjects: 交付到的项目列表（整车项目）

ProductVersion:
  新增属性:
    - projectId: 关联项目
    - milestoneId: 关联里程碑

PI:
  新增属性:
    - projectId: 所属项目
    - milestone: 关联的项目里程碑

UserRequirement:
  新增属性:
    - projectRequirementId: 来源项目需求
    - projectId: 关联项目

Sprint, Story, Task:
  新增属性:
    - projectId: 所属项目
```

#### 新增关系

```yaml
1. Project → ProductLine: belongsTo
2. Project → Project: dependsOn
3. Project → DomainProduct: delivers / integrates
4. Project → PI: includes
5. Project → ProductVersion: delivers
6. ProjectRequirement → UserRequirement: allocates
7. ProjectMilestone → ProductVersion: requires
8. ProjectDependency → Dependency: influences
```

### 7.2 价值流调整

#### 调整后的完整价值流（9个阶段）

```
0. 项目立项 ← NEW!
   ↓
1. 产品规划 (项目上下文)
   ↓
2. 需求分析 (项目需求分配)
   ↓
3. 项目协同规划 ← 调整（整车项目多产品协同）
   ↓
4. PI Planning (项目包含多个PI)
   ↓
5. 迭代研发
   ↓
6. 集成晋级 (项目级集成)
   ↓
7. 测试验证
   ↓
8. 需求验收
   ↓
9. 项目交付 ← 调整（项目里程碑交付）
```

#### 分角色价值流（增加项目视角）

```yaml
项目视角 (项目经理、项目总监):
  关注流程:
    - 项目立项
    - 项目协同规划
    - 项目级集成
    - 里程碑交付
    - 项目关闭
  
  核心指标:
    - 项目进度（里程碑达成率）
    - 项目成本（预算执行率）
    - 项目质量（缺陷密度）
    - 项目风险（风险数量、等级）
    - 依赖健康度

产品视角 (产品经理):
  关注流程:
    - 产品规划（项目目标约束）
    - 需求分析（项目需求分配）
    - 产品交付（版本交付到项目）
  
  核心指标:
    - 产品版本交付及时率
    - 需求满足度
    - 产品质量

管理视角 (技术经理):
  关注流程:
    - 项目协同规划
    - PI Planning
    - 项目级集成
  
  核心指标:
    - 团队效能
    - 质量指标
    - 风险指标

团队视角 (开发/测试):
  关注流程:
    - 迭代研发
    - 集成晋级
    - 测试验证
  
  上下文信息:
    - 所属项目
    - 项目目标
    - 项目进度
```

### 7.3 页面设计调整

#### 新增页面（项目管理域）

```yaml
L1主页面:
  - /projects/dashboard (项目总览)
  - /projects/portfolio (项目组合视图)

L2项目页面:
  1. /projects (项目列表)
  2. /projects/create (创建项目)
  3. /projects/:id (项目详情)
  4. /projects/:id/charter (项目章程)
  5. /projects/:id/requirements (项目需求)
  6. /projects/:id/milestones (里程碑)
  7. /projects/:id/products (产品集成清单)
  8. /projects/:id/dependencies (项目依赖)
  9. /projects/:id/teams (项目团队)
  10. /projects/:id/budget (项目预算)
  
L2协同页面:
  11. /projects/:id/collaboration (项目协同规划)
  12. /projects/:id/pi-planning (项目级PI Planning)
  13. /projects/:id/integration (项目级集成)
  14. /projects/:id/delivery (项目交付)
  
L2监控页面:
  15. /projects/:id/progress (项目进度)
  16. /projects/:id/risks (项目风险)
  17. /projects/:id/issues (项目问题)
  18. /projects/:id/reports (项目报告)
```

#### 调整现有页面

```yaml
产品版本规划页面:
  路径: /products/:id/versions/:vid/planning
  新增字段:
    - 所属项目
    - 交付到项目
    - 关联里程碑

需求创建页面:
  路径: /requirements/user/create
  新增字段:
    - 来源项目需求 (projectRequirementId)
    - 所属项目 (projectId)

PI Planning页面:
  路径: /pi-planning/:id/workspace
  新增功能:
    - 项目上下文展示
    - 项目级依赖管理
    - 跨产品协同（整车项目）

发布页面:
  路径: /releases/:id
  新增字段:
    - 所属项目
    - 关联里程碑
    - 项目交付报告
```

### 7.4 数据模型调整（SQL DDL）

```sql
-- 项目表
CREATE TABLE projects (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    type VARCHAR(50) NOT NULL, -- 整车项目、平台项目、功能项目
    description TEXT,
    objective TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL, -- 规划、启动、执行、验收、关闭
    budget DECIMAL(15, 2),
    priority VARCHAR(20),
    
    product_line_id VARCHAR(50),
    project_manager_id VARCHAR(50),
    sponsor_id VARCHAR(50),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (product_line_id) REFERENCES product_lines(id),
    FOREIGN KEY (project_manager_id) REFERENCES users(id)
);

-- 项目里程碑表
CREATE TABLE project_milestones (
    id VARCHAR(50) PRIMARY KEY,
    project_id VARCHAR(50) NOT NULL,
    name VARCHAR(200) NOT NULL,
    code VARCHAR(50) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 概念、设计、开发、验证、交付
    description TEXT,
    planned_date DATE NOT NULL,
    actual_date DATE,
    status VARCHAR(50) NOT NULL, -- 计划、进行中、完成、延期
    criteria TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (project_id) REFERENCES projects(id)
);

-- 项目需求表
CREATE TABLE project_requirements (
    id VARCHAR(50) PRIMARY KEY,
    project_id VARCHAR(50) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    source VARCHAR(100), -- 客户、法规、市场
    category VARCHAR(50), -- 功能、性能、质量、法规
    priority VARCHAR(20) NOT NULL,
    status VARCHAR(50) NOT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (project_id) REFERENCES projects(id)
);

-- 项目依赖表
CREATE TABLE project_dependencies (
    id VARCHAR(50) PRIMARY KEY,
    source_project_id VARCHAR(50) NOT NULL,
    target_project_id VARCHAR(50) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 技术依赖、资源依赖、时间依赖
    description TEXT,
    critical_path BOOLEAN DEFAULT FALSE,
    risk_level VARCHAR(20), -- 高、中、低
    mitigation TEXT,
    status VARCHAR(50) NOT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (source_project_id) REFERENCES projects(id),
    FOREIGN KEY (target_project_id) REFERENCES projects(id)
);

-- 项目产品关联表 (多对多)
CREATE TABLE project_products (
    project_id VARCHAR(50) NOT NULL,
    product_id VARCHAR(50) NOT NULL,
    relationship_type VARCHAR(50) NOT NULL, -- delivers, integrates
    product_version_id VARCHAR(50),
    role VARCHAR(50), -- 主要、依赖
    
    PRIMARY KEY (project_id, product_id),
    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (product_id) REFERENCES domain_products(id),
    FOREIGN KEY (product_version_id) REFERENCES product_versions(id)
);

-- 调整现有表
-- 产品版本表增加项目关联
ALTER TABLE product_versions ADD COLUMN project_id VARCHAR(50);
ALTER TABLE product_versions ADD COLUMN milestone_id VARCHAR(50);
ALTER TABLE product_versions ADD FOREIGN KEY (project_id) REFERENCES projects(id);
ALTER TABLE product_versions ADD FOREIGN KEY (milestone_id) REFERENCES project_milestones(id);

-- PI表增加项目关联
ALTER TABLE pis ADD COLUMN project_id VARCHAR(50);
ALTER TABLE pis ADD COLUMN milestone_id VARCHAR(50);
ALTER TABLE pis ADD FOREIGN KEY (project_id) REFERENCES projects(id);
ALTER TABLE pis ADD FOREIGN KEY (milestone_id) REFERENCES project_milestones(id);

-- 需求表增加项目关联
ALTER TABLE user_requirements ADD COLUMN project_id VARCHAR(50);
ALTER TABLE user_requirements ADD COLUMN project_requirement_id VARCHAR(50);
ALTER TABLE user_requirements ADD FOREIGN KEY (project_id) REFERENCES projects(id);
ALTER TABLE user_requirements ADD FOREIGN KEY (project_requirement_id) REFERENCES project_requirements(id);

-- Sprint表增加项目关联
ALTER TABLE sprints ADD COLUMN project_id VARCHAR(50);
ALTER TABLE sprints ADD FOREIGN KEY (project_id) REFERENCES projects(id);

-- Story表增加项目关联
ALTER TABLE user_stories ADD COLUMN project_id VARCHAR(50);
ALTER TABLE user_stories ADD FOREIGN KEY (project_id) REFERENCES projects(id);

-- Release表增加项目关联
ALTER TABLE releases ADD COLUMN project_id VARCHAR(50);
ALTER TABLE releases ADD COLUMN milestone_id VARCHAR(50);
ALTER TABLE releases ADD FOREIGN KEY (project_id) REFERENCES projects(id);
ALTER TABLE releases ADD FOREIGN KEY (milestone_id) REFERENCES project_milestones(id);
```

### 7.5 功能模块调整

#### 新增功能模块

```yaml
F030: 项目管理
子功能:
  - F030-1: 项目创建与规划
  - F030-2: 项目里程碑管理
  - F030-3: 项目需求管理
  - F030-4: 项目依赖管理
  - F030-5: 项目团队管理
  - F030-6: 项目监控与报告
  - F030-7: 项目交付与关闭

优先级: MVP (关键缺失)
Story Points: 55 SP
工作量: 22人天

F031: 项目协同
子功能:
  - F031-1: 多产品协同规划
  - F031-2: 项目级PI Planning
  - F031-3: 跨项目依赖管理
  - F031-4: 项目集成协同

优先级: V1.0
Story Points: 34 SP
工作量: 14人天
```

#### 调整现有功能模块

```yaml
F007: 用户需求管理
调整:
  - 增加项目需求分配功能
  - 增加需求到项目追溯
  
F012: 任务管理
调整:
  - 增加项目上下文展示
  - 增加任务到项目追溯

F029: PI Planning
调整:
  - 增加项目级PI Planning
  - 增加多产品协同视图
  - 增加项目依赖管理

F020: 发布管理
调整:
  - 增加项目交付功能
  - 增加里程碑关联
  - 增加项目交付报告
```

---

## 八、总结与建议

### 8.1 关键发现

1. **项目是汽车行业的核心管理单元**
   - 整车厂以项目方式组织研发
   - 资源、预算、时间都以项目为单位

2. **项目是产品和执行的桥梁**
   - 产品定义"做什么"
   - 项目定义"何时做、谁来做、如何交付"
   - PI是项目的执行单元

3. **项目提供了完整的追溯链**
   - 从市场需求 → 项目需求 → 产品需求 → 代码 → 交付
   - 项目是追溯的关键锚点

### 8.2 设计影响

**领域模型**:
- ✅ 增加项目层，完善领域模型
- ✅ 建立项目与产品、需求、PI的关系
- ✅ 支持整车项目、功能项目等多种项目类型

**价值流**:
- ✅ 增加项目立项阶段
- ✅ 调整需求分析（项目需求分配）
- ✅ 增加项目协同规划（整车项目）
- ✅ 调整交付阶段（项目里程碑交付）

**功能设计**:
- ✅ 新增项目管理模块 (F030)
- ✅ 新增项目协同模块 (F031)
- ✅ 调整现有模块以支持项目上下文

**数据模型**:
- ✅ 新增项目相关表
- ✅ 调整现有表增加项目关联
- ✅ 完善追溯关系

### 8.3 实施建议

#### Phase 1: MVP补充（高优先级）

```yaml
必须实现:
  1. Project实体及基础CRUD
  2. ProjectMilestone实体及管理
  3. ProjectRequirement实体及需求分配
  4. 现有实体增加projectId关联
  5. 项目视角的价值流视图

工作量: 22人天
紧迫性: 高（这是关键缺失）
```

#### Phase 2: V1.0增强

```yaml
增强功能:
  1. 项目依赖管理
  2. 项目级PI Planning
  3. 多产品协同规划（整车项目）
  4. 项目监控与报告

工作量: 14人天
```

#### Phase 3: V2.0完善

```yaml
高级功能:
  1. 项目组合管理
  2. 项目智能分析
  3. 项目预测与优化
  4. 跨项目资源调度

工作量: 10人天
```

### 8.4 风险与注意事项

1. **复杂度增加**
   - 引入项目层会增加系统复杂度
   - 需要仔细设计项目与产品的关系

2. **灵活性要求**
   - 不同类型项目的管理方式不同
   - 需要支持多种项目模式

3. **组织适配**
   - 不同组织的项目管理成熟度不同
   - 需要提供可配置的项目管理流程

4. **数据迁移**
   - 现有数据需要关联到项目
   - 需要数据迁移策略

### 8.5 最终结论

**项目实体的引入是必要且关键的**:
- ✅ 符合汽车行业实际
- ✅ 完善领域模型
- ✅ 增强追溯能力
- ✅ 提升项目管理能力

**建议立即补充项目管理功能到MVP**:
- 这是一个重要的设计缺口
- 对汽车行业用户至关重要
- 实现成本可控（22人天）

---

## 附录：术语对照

| 中文 | 英文 | 说明 |
|-----|------|------|
| 项目 | Project | 有明确目标和时间约束的临时性组织 |
| 整车项目 | Vehicle Program | 完整车型开发项目 |
| 平台项目 | Platform Program | 技术平台开发项目 |
| 功能项目 | Feature Program | 单个功能/系统开发项目 |
| 项目里程碑 | Project Milestone | 项目的阶段性目标和检查点 |
| 项目需求 | Project Requirement | 项目级别的需求 |
| 项目依赖 | Project Dependency | 项目间的依赖关系 |
| SOP | Start of Production | 量产开始 |
| 概念冻结 | Concept Freeze | 概念设计不再变更 |
| 设计冻结 | Design Freeze | 详细设计不再变更 |
| 功能冻结 | Feature Freeze | 功能范围不再变更 |
| 代码冻结 | Code Freeze | 代码不再变更（仅修复缺陷） |

---

**文档维护**:
- 负责人: 产品架构团队 + 项目管理团队
- 更新频率: 按需更新
- 最后更新: 2025-01-03

