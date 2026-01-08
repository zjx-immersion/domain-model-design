# 🚀 改造计划与关键任务拆分

## 📅 计划日期
**2025-01-08**

---

## 🎯 改造目标

将当前 v3 架构改造为**项目驱动的架构**，引入车型项目和领域项目概念，完善项目-产品-团队的协作流程。

---

## 📋 改造范围

### 涉及的层次

```
1. 数据模型层
   ├─ TypeScript 类型定义
   ├─ Mock 数据结构
   └─ 数据关系调整

2. 业务逻辑层
   ├─ 项目管理逻辑
   ├─ Backlog 管理逻辑
   └─ 工作项分配逻辑

3. 前端展示层
   ├─ 项目管理页面
   ├─ Backlog 管理页面
   └─ 数据流调整

4. 文档层
   ├─ 架构设计文档
   ├─ 数据关系文档
   └─ 用户指南
```

---

## 🗺️ 改造路线图

### Phase 1: 数据模型设计 ✅ (当前阶段)

**目标**: 完成新实体模型设计和关系定义

**交付物**:
- [x] 当前状态分析文档
- [x] 新实体模型设计文档
- [x] 改造计划与任务拆分文档

**耗时**: 1 天

---

### Phase 2: TypeScript 类型定义 📝

**目标**: 实现新实体的 TypeScript 类型定义

**任务列表**:

#### Task 2.1: 创建项目相关类型
- 文件: `frontend/src/types/project-v2.ts`
- 内容:
  - VehicleProject 接口
  - DomainProject 接口
  - ProjectVersion 接口
  - ProjectObjective 接口
  - Milestone 接口

#### Task 2.2: 创建 Backlog 相关类型
- 文件: `frontend/src/types/backlog.ts`
- 内容:
  - ProjectBacklog 接口
  - TeamBacklog 接口
  - BacklogItem 接口

#### Task 2.3: 更新现有类型
- 文件: `frontend/src/types/project.ts` (现有)
- 更新: 标记为已弃用，引导使用新类型

#### Task 2.4: 更新 PIPlanning 类型
- 文件: `frontend/src/types/project.ts`
- 更新: 添加 `domainProjectId` 字段

**耗时**: 1 天

---

### Phase 3: Mock 数据准备 📊

**目标**: 创建完整的 Mock 数据支持新模型

**任务列表**:

#### Task 3.1: 车型项目数据
- 文件: `biz-data/mock/project/vehicle-projects.json`
- 内容: 3-5 个车型项目示例

#### Task 3.2: 领域项目数据
- 文件: `biz-data/mock/project/domain-projects.json`
- 内容: 8-10 个领域项目示例（覆盖三大领域）

#### Task 3.3: 项目版本数据
- 文件: `biz-data/mock/project/project-versions.json`
- 内容: 15-20 个版本规划示例

#### Task 3.4: Project Backlog 数据
- 文件: `biz-data/mock/backlog/project-backlogs.json`
- 内容: 与 PI Planning 对应的 Backlog 数据

#### Task 3.5: Team Backlog 数据
- 文件: `biz-data/mock/backlog/team-backlogs.json`
- 内容: 按团队组织的 Backlog 数据

#### Task 3.6: 更新 PI Planning 数据
- 文件: `biz-data/mock/project/pi-details.json` (现有)
- 更新: 添加 `domainProjectId` 字段

**耗时**: 2 天

---

### Phase 4: 前端页面实现 🎨

**目标**: 实现项目管理和 Backlog 管理页面

**任务列表**:

#### Task 4.1: 车型项目管理
- **页面**: `frontend/src/views/Project/VehicleProjectList.vue`
  - 车型项目列表
  - 筛选和搜索
  - 创建和编辑

- **页面**: `frontend/src/views/Project/VehicleProjectDetail.vue`
  - 项目详情展示
  - 领域项目列表
  - 里程碑展示
  - 进度跟踪

#### Task 4.2: 领域项目管理
- **页面**: `frontend/src/views/Project/DomainProjectList.vue`
  - 领域项目列表
  - 按领域筛选
  - 创建和编辑

- **页面**: `frontend/src/views/Project/DomainProjectDetail.vue`
  - 项目详情展示
  - 产品列表
  - 团队列表
  - PI Planning 列表
  - 版本规划
  - 进度跟踪

#### Task 4.3: Project Backlog 管理
- **页面**: `frontend/src/views/Backlog/ProjectBacklog.vue`
  - Project Backlog 看板
  - 工作项列表
  - 按模块/团队筛选
  - 工作项详情
  - 分配到 TeamBacklog

#### Task 4.4: Team Backlog 管理
- **页面**: `frontend/src/views/Backlog/TeamBacklog.vue`
  - Team Backlog 看板
  - 工作项列表
  - 优先级排序
  - 拉取到 Sprint
  - 工作量统计

#### Task 4.5: 更新 PI Planning 页面
- **页面**: `frontend/src/views/PIPlanning/Workspace.vue` (现有)
- 更新:
  - 显示所属领域项目
  - 显示目标版本
  - 生成 Project Backlog 的按钮

#### Task 4.6: 更新 Sprint 页面
- **页面**: `frontend/src/views/Sprint/Detail.vue` (现有)
- 更新:
  - 显示 TeamBacklog 来源
  - 从 TeamBacklog 拉取工作项

**耗时**: 5 天

---

### Phase 5: 路由和导航更新 🧭

**目标**: 更新路由配置和导航菜单

**任务列表**:

#### Task 5.1: 添加路由
- 文件: `frontend/src/router/index.ts`
- 新增路由:
  ```typescript
  {
    path: '/projects/vehicle',
    name: 'VehicleProjects',
    component: () => import('@/views/Project/VehicleProjectList.vue')
  },
  {
    path: '/projects/vehicle/:id',
    name: 'VehicleProjectDetail',
    component: () => import('@/views/Project/VehicleProjectDetail.vue')
  },
  {
    path: '/projects/domain',
    name: 'DomainProjects',
    component: () => import('@/views/Project/DomainProjectList.vue')
  },
  {
    path: '/projects/domain/:id',
    name: 'DomainProjectDetail',
    component: () => import('@/views/Project/DomainProjectDetail.vue')
  },
  {
    path: '/backlog/project/:projectId',
    name: 'ProjectBacklog',
    component: () => import('@/views/Backlog/ProjectBacklog.vue')
  },
  {
    path: '/backlog/team/:teamId',
    name: 'TeamBacklog',
    component: () => import('@/views/Backlog/TeamBacklog.vue')
  }
  ```

#### Task 5.2: 更新导航菜单
- 文件: `frontend/src/components/Layout/MainLayout.vue`
- 调整:
  ```html
  <el-sub-menu index="projects">
    <template #title>
      <el-icon><Folder /></el-icon>
      <span>项目管理</span>
    </template>
    <el-menu-item index="/projects/vehicle">车型项目</el-menu-item>
    <el-menu-item index="/projects/domain">领域项目</el-menu-item>
    <el-menu-item index="/projects/board">项目看板</el-menu-item>
  </el-sub-menu>
  
  <el-sub-menu index="backlog">
    <template #title>
      <el-icon><List /></el-icon>
      <span>Backlog管理</span>
    </template>
    <el-menu-item index="/backlog/project">项目待办</el-menu-item>
    <el-menu-item index="/backlog/team">团队待办</el-menu-item>
  </el-sub-menu>
  ```

**耗时**: 0.5 天

---

### Phase 6: 文档更新 📚

**目标**: 更新架构文档和用户指南

**任务列表**:

#### Task 6.1: 更新架构文档
- 文件: `Architecture/v2/01-business/BUSINESS_ARCHITECTURE_V3.md`
- 更新: 添加项目管理部分

- 文件: `Architecture/v2/02-domain/DOMAIN_MODEL_DESIGN.md`
- 更新: 添加项目相关实体

- 文件: `Architecture/v2/04-task/TASK_BASED_ARCHITECTURE.md`
- 更新: 添加 Backlog 流程

#### Task 6.2: 创建新架构文档
- 文件: `Architecture/v2/08-project/PROJECT_MANAGEMENT_DESIGN.md`
- 内容: 项目管理完整设计

#### Task 6.3: 更新数据关系文档
- 文件: `Architecture/v2/05-data/DATA_RELATIONSHIP_ANALYSIS.md`
- 更新: 添加项目相关实体关系

#### Task 6.4: 更新用户指南
- 文件: `QUICK_START_GUIDE.md`
- 更新: 添加项目管理操作指南

#### Task 6.5: 创建迁移指南
- 文件: `MIGRATION_GUIDE.md`
- 内容: 从旧模型到新模型的迁移步骤

**耗时**: 2 天

---

### Phase 7: 测试和验证 🧪

**目标**: 完整测试新功能和数据流

**任务列表**:

#### Task 7.1: 数据流测试
- 场景 1: 车型项目 → 领域项目
- 场景 2: 领域项目 → 版本规划
- 场景 3: PI Planning → ProjectBacklog
- 场景 4: ProjectBacklog → TeamBacklog
- 场景 5: TeamBacklog → Sprint

#### Task 7.2: 页面功能测试
- 车型项目管理页面
- 领域项目管理页面
- Project Backlog 页面
- Team Backlog 页面
- 更新后的 PI Planning 页面
- 更新后的 Sprint 页面

#### Task 7.3: 集成测试
- 端到端流程测试
- 数据一致性验证
- 性能测试

**耗时**: 2 天

---

## 📊 任务汇总表

| Phase | 任务数 | 预计耗时 | 优先级 | 依赖 |
|-------|--------|----------|--------|------|
| Phase 1: 数据模型设计 | 3 | 1 天 | P0 | 无 |
| Phase 2: TypeScript 类型 | 4 | 1 天 | P0 | Phase 1 |
| Phase 3: Mock 数据 | 6 | 2 天 | P0 | Phase 2 |
| Phase 4: 前端页面 | 6 | 5 天 | P0 | Phase 3 |
| Phase 5: 路由导航 | 2 | 0.5 天 | P1 | Phase 4 |
| Phase 6: 文档更新 | 5 | 2 天 | P1 | Phase 4 |
| Phase 7: 测试验证 | 3 | 2 天 | P0 | Phase 5,6 |
| **总计** | **29** | **13.5 天** | - | - |

---

## 🎯 关键任务详细说明

### 🔥 关键任务 1: 创建 TypeScript 类型定义

**优先级**: P0 - Critical

**文件**: `frontend/src/types/project-v2.ts`

**内容概要**:
```typescript
// 车型项目
export interface VehicleProject {
  id: string
  code: string
  name: string
  description: string
  companyId: string
  businessUnitId: string
  owner: string
  sponsor: string
  startDate: string
  targetDate: string
  actualDate?: string
  domainProjectIds: string[]
  objectives: string[]
  scope: string
  milestones: Milestone[]
  status: ProjectStatus
  phase: string
  budget?: number
  progress: number
  createdAt: string
  updatedAt: string
}

// 领域项目
export interface DomainProject {
  id: string
  code: string
  name: string
  description: string
  domain: string
  vehicleProjectId: string
  departmentId: string
  owner: string
  startDate: string
  endDate: string
  productIds: string[]
  teamIds: string[]
  piPlanningIds: string[]
  projectVersions: ProjectVersion[]
  objectives: ProjectObjective[]
  scope: string
  status: ProjectStatus
  totalPIs: number
  completedPIs: number
  progress: number
  createdAt: string
  updatedAt: string
}

// 其他类型...
```

**验收标准**:
- [x] 所有类型定义完整
- [x] 与设计文档一致
- [x] TypeScript 编译通过
- [x] 导出正确

**估时**: 4 小时

---

### 🔥 关键任务 2: 创建 Mock 数据

**优先级**: P0 - Critical

**文件**: 
- `biz-data/mock/project/vehicle-projects.json`
- `biz-data/mock/project/domain-projects.json`
- `biz-data/mock/project/project-versions.json`
- `biz-data/mock/backlog/project-backlogs.json`
- `biz-data/mock/backlog/team-backlogs.json`

**数据要求**:
- 车型项目: 3-5 个
- 领域项目: 8-10 个（智能驾驶3个，智能座舱3个，电子电器2-4个）
- 版本规划: 15-20 个
- Project Backlog: 与每个 PI 对应
- Team Backlog: 与每个团队对应

**数据关系**:
- VehicleProject ←→ DomainProject
- DomainProject ←→ Product
- DomainProject ←→ PIPlanning
- PIPlanning → ProjectBacklog
- ProjectBacklog → TeamBacklog

**验收标准**:
- [x] 数据完整且一致
- [x] 关系正确
- [x] 覆盖典型场景
- [x] JSON 格式正确

**估时**: 1 天

---

### 🔥 关键任务 3: 实现 DomainProjectDetail 页面

**优先级**: P0 - Critical

**文件**: `frontend/src/views/Project/DomainProjectDetail.vue`

**功能要求**:

1. **项目基本信息**
   - 项目名称、代码、描述
   - 所属车型项目
   - 项目负责人
   - 时间范围
   - 状态和进度

2. **产品列表**
   - 显示项目包含的产品
   - 产品状态
   - 版本规划

3. **团队列表**
   - 显示参与的团队
   - 团队容量
   - 工作负载

4. **PI Planning 列表**
   - 显示项目的所有 PI
   - PI 状态和进度
   - 跳转到 PI 详情

5. **版本规划**
   - 显示项目版本规划
   - 目标 PI
   - 计划特性

6. **项目目标**
   - PI Objectives
   - 业务价值
   - 完成度

7. **进度跟踪**
   - 整体进度
   - 里程碑进度
   - 燃尽图

**技术要点**:
- 使用 Element Plus 组件
- 响应式布局
- 数据懒加载
- 状态管理（Pinia）

**验收标准**:
- [x] 所有功能实现
- [x] UI 美观
- [x] 交互流畅
- [x] 数据正确

**估时**: 2 天

---

### 🔥 关键任务 4: 实现 ProjectBacklog 页面

**优先级**: P0 - Critical

**文件**: `frontend/src/views/Backlog/ProjectBacklog.vue`

**功能要求**:

1. **Backlog 概览**
   - 所属领域项目
   - 来源 PI
   - 统计信息（总数、已分配、已完成）

2. **工作项列表**
   - 表格展示
   - 筛选（按模块、按团队、按状态）
   - 排序（按优先级、按工作量）
   - 搜索

3. **工作项详情**
   - 弹窗或侧边栏展示
   - 完整信息
   - 编辑功能

4. **分配到团队**
   - 选择工作项
   - 分配给 TeamBacklog
   - 批量操作

5. **看板视图**
   - 按团队分组
   - 拖拽分配
   - 容量可视化

**技术要点**:
- 虚拟滚动（大数据量）
- 拖拽交互（Vue Draggable）
- 实时更新
- 状态同步

**验收标准**:
- [x] 所有功能实现
- [x] 性能良好（1000+ 工作项）
- [x] 交互流畅
- [x] 数据一致性

**估时**: 2 天

---

### 🔥 关键任务 5: 实现 TeamBacklog 页面

**优先级**: P0 - Critical

**文件**: `frontend/src/views/Backlog/TeamBacklog.vue`

**功能要求**:

1. **Backlog 概览**
   - 所属团队
   - 所属领域项目
   - 统计信息（总数、进行中、已完成）
   - 容量信息

2. **工作项列表**
   - 优先级队列展示
   - 拖拽排序
   - 筛选和搜索

3. **工作项详情**
   - 详细信息展示
   - 编辑功能
   - 状态更新

4. **拉取到 Sprint**
   - 选择工作项
   - 拉取到指定 Sprint
   - 容量检查
   - 批量操作

5. **容量管理**
   - 团队容量设置
   - 剩余容量展示
   - 容量预警

6. **燃尽图**
   - 工作项燃尽
   - 故事点燃尽
   - 趋势预测

**技术要点**:
- 拖拽排序
- 容量计算
- 图表展示（ECharts）
- 实时同步

**验收标准**:
- [x] 所有功能实现
- [x] 拖拽流畅
- [x] 容量计算准确
- [x] 数据同步正确

**估时**: 2 天

---

## 📅 时间规划

### Week 1 (5 天)
- Day 1: Phase 1 完成 ✅
- Day 2: Phase 2 完成（TypeScript 类型）
- Day 3-4: Phase 3 完成（Mock 数据）
- Day 5: Phase 4 开始（车型项目页面）

### Week 2 (5 天)
- Day 1-3: Phase 4 继续（领域项目、Backlog 页面）
- Day 4: Phase 5 完成（路由导航）
- Day 5: Phase 6 开始（文档更新）

### Week 3 (3.5 天)
- Day 1-2: Phase 6 完成（文档更新）
- Day 3-4: Phase 7 完成（测试验证）

**总耗时**: 13.5 天 (约 3 周)

---

## 🚦 里程碑

| 里程碑 | 日期 | 交付物 | 状态 |
|--------|------|--------|------|
| M1: 设计完成 | Day 1 | 设计文档 | ✅ 完成 |
| M2: 类型定义完成 | Day 2 | TypeScript 类型 | ⏳ 待完成 |
| M3: Mock 数据完成 | Day 4 | Mock 数据文件 | ⏳ 待完成 |
| M4: 核心页面完成 | Day 10 | 项目和 Backlog 页面 | ⏳ 待完成 |
| M5: 集成完成 | Day 11 | 路由和导航 | ⏳ 待完成 |
| M6: 文档完成 | Day 13 | 更新的文档 | ⏳ 待完成 |
| M7: 测试完成 | Day 14 | 测试报告 | ⏳ 待完成 |

---

## 🎯 成功标准

### 功能完整性
- [x] 所有新实体可管理（CRUD）
- [x] 数据流完整（车型项目 → Sprint）
- [x] 与现有功能集成

### 数据一致性
- [x] Mock 数据关系正确
- [x] 前后端数据结构一致
- [x] 实时同步正确

### 用户体验
- [x] 页面交互流畅
- [x] 导航清晰
- [x] 文档完整

### 代码质量
- [x] TypeScript 类型完整
- [x] 代码规范
- [x] 注释清晰

---

## 📝 风险和应对

### 风险 1: 数据关系复杂
**影响**: 可能导致数据不一致

**应对**:
- 完善数据验证
- 添加关系检查
- 充分测试

### 风险 2: 工作量估算不准
**影响**: 可能超期

**应对**:
- 每日跟踪进度
- 及时调整计划
- 优先完成核心功能

### 风险 3: 与现有功能冲突
**影响**: 可能影响现有功能

**应对**:
- 充分回归测试
- 渐进式集成
- 保留回滚方案

---

## 🔗 相关文档

- [当前状态分析](01-CURRENT_STATE_ANALYSIS.md)
- [新实体模型设计](02-NEW_ENTITY_MODEL_DESIGN.md)
- [Architecture v2](../Architecture/v2/)

---

**计划完成时间**: 2025-01-08  
**预计开始时间**: 2025-01-09  
**预计完成时间**: 2025-01-31  
**状态**: 📋 计划完成，待开始实施

