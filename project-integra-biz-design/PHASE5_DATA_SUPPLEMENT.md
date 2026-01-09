# Phase 5: 业务数据补充和完善

> **实施时间**: 2025-01-10  
> **目标**: 根据领域模型v3.0，系统性补充和完善所有功能的mock数据  
> **状态**: ⏳ 进行中

---

## 📋 数据补充总览

### 核心数据关系图

```
车型项目 (VehicleProject)
  ├─ 里程碑 (Milestones) ⭐ 需补充
  ├─ 团队 (Teams) ⭐ 需补充
  └─ 领域项目 (DomainProjects)
      ├─ 项目目标 (Objectives) ⭐ 已有，需丰富
      ├─ 产品版本 (ProjectVersions) ⭐ 已有，需丰富
      └─ PI Planning
          ├─ PI目标 (PI Objectives)
          ├─ 特性 (Features)
          └─ Sprint
              ├─ 计划故事点 ⭐ 需补充
              └─ 工作项 (WorkItems)
                  ├─ 类型 (6种) ⭐ 需丰富
                  ├─ 故事点 ⭐ 需补充
                  └─ 负责人 ⭐ 需完善

团队 (Team)
  ├─ 成员 (Members) ⭐ 需补充详细信息
  ├─ 模块责任 (Modules) ⭐ 需建立绑定
  └─ Sprint

产品线 (ProductLine)
  └─ 领域产品 (Product)
      ├─ 版本 (Releases) ⭐ 已有
      └─ 领域特性 (Features)
          └─ 软件模块 (Modules)
```

---

## 一、数据补充清单

### 1.1 车型项目数据补充

**文件**: `biz-data/mock/project/vehicle-projects.json`

**需补充内容**:
- ✅ 基本信息（已有）
- ⭐ **里程碑 (milestones)**:
  ```typescript
  {
    id: string
    name: string
    date: string
    description: string
    status: 'upcoming' | 'in_progress' | 'completed'
    owner: string
    deliverables: string[]
  }
  ```
  - SOP里程碑
  - 关键节点里程碑
  - 交付里程碑

- ⭐ **团队列表 (teams)**:
  ```typescript
  {
    id: string
    name: string
    role: string
  }
  ```

**数据量目标**:
- 每个车型项目：3-5个里程碑
- 每个车型项目：3-6个团队

---

### 1.2 领域项目数据补充

**文件**: `biz-data/mock/project/domain-projects.json`

**需补充内容**:
- ✅ 基本信息（已有）
- ✅ 项目目标 (objectives)（已有，需丰富）
- ✅ 产品版本 (projectVersions)（已有，需丰富）
- ⭐ **里程碑 (milestones)**（参考车型项目格式）
- ⭐ **进度 (progress)** 字段
- ⭐ **风险 (risks)** 列表

**数据量目标**:
- 每个领域项目：3-5个目标
- 每个领域项目：2-4个产品版本
- 每个领域项目：3-5个里程碑

---

### 1.3 PI Planning 数据补充

**文件**: `biz-data/mock/projects/pi-plannings.json`

**需补充内容**:
- ✅ 基本信息（已有）
- ⭐ **关联领域项目ID (domainProjectId)**
- ⭐ **PI Objectives**:
  ```typescript
  {
    id: string
    description: string
    businessValue: number  // 1-10
    stretch: boolean
    assignedTo: string     // Team ID
    progress: number       // 0-100
  }
  ```
- ⭐ **Features列表**
- ⭐ **Sprint IDs**

**数据量目标**:
- 每个PI：5-8个 Objectives
- 每个PI：8-12个 Features
- 每个PI：2-3个 Sprints

---

### 1.4 Sprint 数据补充

**文件**: `biz-data/mock/sprint/sprints.json`

**需补充内容**:
- ✅ 基本信息（已有）
- ⭐ **计划故事点 (plannedStoryPoints)**: 30-50
- ⭐ **关联团队ID (teamId)**
- ⭐ **关联PI ID (piId)**
- ⭐ **Sprint目标 (goal)**
- ⭐ **容量 (capacity)**: 团队总人日

**数据量目标**:
- 总共：15-20个 Sprint
- 每个团队：当前有1个进行中的Sprint
- 每个Sprint：计划故事点 30-50

---

### 1.5 工作项数据补充

**文件**: `biz-data/mock/work-item/work-items.json`

**需补充内容**:
- ✅ 基本信息（已有）
- ⭐ **关联Sprint ID (sprintId)**: 确保关联正确
- ⭐ **关联团队ID (teamId)**: 确保关联正确
- ⭐ **故事点 (storyPoints)**: 1, 2, 3, 5, 8, 13
- ⭐ **工作项类型多样化**:
  - module_requirement: 60%
  - bugfix: 20%
  - tech_debt: 10%
  - optimization: 5%
  - non_functional: 3%
  - research: 2%
- ⭐ **负责人 (assigneeId)**: 确保都有负责人

**数据量目标**:
- 总共：100-150个工作项
- 每个Sprint：10-20个工作项
- 每个团队成员：3-5个活跃工作项

---

### 1.6 团队数据补充

**文件**: `biz-data/mock/team/teams.json`

**需补充内容**:
- ✅ 基本信息（已有）
- ⭐ **成员详细信息 (members)**:
  ```typescript
  {
    id: string
    name: string
    role: string          // 开发、测试、架构师等
    avatar: string
    email: string
    capacity: number      // 每Sprint的人日容量
  }
  ```
- ⭐ **负责模块 (modules)**: []
- ⭐ **团队技能 (skills)**: []
- ⭐ **团队容量 (teamCapacity)**: 总人日

**数据量目标**:
- 总共：8-10个团队
- 每个团队：4-8个成员
- 每个团队：负责2-4个模块

---

### 1.7 用户数据补充

**文件**: `biz-data/mock/users/users.json`

**需补充内容**:
- ✅ 基本信息（已有）
- ⭐ **头像 (avatar)**: 完善所有用户
- ⭐ **角色 (role)**: 开发、测试、产品经理等
- ⭐ **团队ID (teamId)**
- ⭐ **技能标签 (skills)**: []

**数据量目标**:
- 总共：40-60个用户
- 覆盖所有团队成员

---

## 二、数据一致性检查清单

### 2.1 ID关联检查

- [ ] 车型项目 ←→ 领域项目 (vehicleProjectId)
- [ ] 领域项目 ←→ PI Planning (domainProjectId)
- [ ] PI Planning ←→ Sprint (piId)
- [ ] Sprint ←→ 工作项 (sprintId)
- [ ] 团队 ←→ Sprint (teamId)
- [ ] 团队 ←→ 工作项 (teamId)
- [ ] 用户 ←→ 工作项 (assigneeId)
- [ ] 产品 ←→ 版本 (productId)
- [ ] 版本 ←→ PI (piId)

### 2.2 数据完整性检查

- [ ] 所有工作项都有负责人
- [ ] 所有工作项都有故事点
- [ ] 所有Sprint都有计划故事点
- [ ] 所有项目都有里程碑
- [ ] 所有团队都有成员详细信息
- [ ] 所有成员都有头像

### 2.3 数据合理性检查

- [ ] Sprint的计划故事点 = 工作项故事点总和（±10%）
- [ ] 团队成员的工作项数量合理（3-5个）
- [ ] 项目进度与里程碑状态一致
- [ ] 工作项类型分布合理

---

## 三、实施步骤

### Step 1: 补充车型项目数据 ⭐
- 添加里程碑
- 添加团队列表
- 更新进度和风险

### Step 2: 补充领域项目数据 ⭐
- 丰富项目目标
- 丰富产品版本
- 添加里程碑
- 添加风险列表

### Step 3: 补充PI Planning数据 ⭐
- 添加domainProjectId
- 添加PI Objectives
- 添加Features列表
- 添加Sprint IDs

### Step 4: 补充Sprint数据 ⭐
- 添加plannedStoryPoints
- 添加teamId和piId
- 添加goal和capacity

### Step 5: 补充工作项数据 ⭐
- 确保所有工作项有sprintId
- 确保所有工作项有teamId
- 添加/更新storyPoints
- 多样化工作项类型
- 确保所有工作项有负责人

### Step 6: 补充团队数据 ⭐
- 完善成员详细信息
- 添加模块责任绑定
- 添加团队容量

### Step 7: 补充用户数据 ⭐
- 完善所有用户头像
- 添加角色和团队ID
- 添加技能标签

### Step 8: 验证数据一致性 ⭐
- 运行一致性检查脚本
- 修复所有不一致的地方
- 生成数据质量报告

---

## 四、预期成果

### 4.1 数据量级

| 数据类型 | 目标数量 | 当前数量 | 状态 |
|---------|---------|---------|------|
| 车型项目 | 3-5 | 待查 | ⏳ |
| 领域项目 | 6-10 | 待查 | ⏳ |
| PI Planning | 8-12 | 待查 | ⏳ |
| Sprint | 15-20 | 待查 | ⏳ |
| 工作项 | 100-150 | 待查 | ⏳ |
| 团队 | 8-10 | 待查 | ⏳ |
| 用户 | 40-60 | 待查 | ⏳ |

### 4.2 数据质量指标

- **完整性**: 100% (所有必填字段都有值)
- **一致性**: 100% (所有ID关联正确)
- **合理性**: 90%+ (数据分布和数量合理)
- **真实性**: 80%+ (模拟真实业务场景)

### 4.3 覆盖场景

- ✅ 产品资产全景页：产品线、产品、版本、特性、模块完整展示
- ✅ 项目全景图页：车型项目、领域项目、PI、里程碑完整展示
- ✅ 团队工作全景页：Sprint、工作项、成员负载完整展示
- ✅ 所有列表页：数据丰富，支持搜索和筛选
- ✅ 所有详情页：关联数据完整，支持跳转导航

---

## 五、验收标准

### 5.1 功能验收

- [ ] 产品资产全景页所有区域都有数据显示
- [ ] 产品-项目矩阵有至少10个产品×5个项目的数据
- [ ] 项目全景图页至少有3个车型项目和10个领域项目
- [ ] 项目时间轴至少有20个里程碑
- [ ] 团队工作全景页Sprint信息完整，工作项看板有数据
- [ ] 团队成员负载分析至少有20个成员
- [ ] 所有工作项都可以拖拽更新状态

### 5.2 数据验收

- [ ] 所有ID关联都正确，无断链
- [ ] 所有工作项都有负责人和故事点
- [ ] Sprint计划故事点与工作项总和匹配
- [ ] 团队成员工作负载合理分布
- [ ] 项目进度与实际数据一致

### 5.3 体验验收

- [ ] 页面加载速度快（<2s）
- [ ] 数据切换流畅，无卡顿
- [ ] 搜索和筛选响应及时
- [ ] 数据展示美观，布局合理

---

## 六、时间计划

| 任务 | 预计时间 | 状态 |
|-----|---------|------|
| Step 1: 车型项目 | 30分钟 | ⏳ |
| Step 2: 领域项目 | 30分钟 | ⏳ |
| Step 3: PI Planning | 45分钟 | ⏳ |
| Step 4: Sprint | 30分钟 | ⏳ |
| Step 5: 工作项 | 60分钟 | ⏳ |
| Step 6: 团队 | 45分钟 | ⏳ |
| Step 7: 用户 | 30分钟 | ⏳ |
| Step 8: 验证 | 30分钟 | ⏳ |
| **总计** | **4.5小时** | ⏳ |

---

## 七、风险和依赖

### 7.1 风险

1. **数据量过大**: 可能影响页面加载性能
   - **缓解措施**: 实现分页和懒加载

2. **数据关联复杂**: 可能出现循环引用或断链
   - **缓解措施**: 编写自动化检查脚本

3. **数据不真实**: 模拟数据可能不符合实际业务
   - **缓解措施**: 参考真实项目数据进行模拟

### 7.2 依赖

- 依赖领域模型v3.0的定义
- 依赖前端页面的数据结构要求
- 依赖现有的mock数据格式

---

**Phase 5 完成标准**: 所有8个步骤完成，数据验收通过，三大核心视图完美展示！

