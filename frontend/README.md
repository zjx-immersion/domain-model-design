# Auto DevOps Platform - 前端实现

> **技术栈**: Vue 3 + TypeScript + Element Plus + Pinia  
> **创建日期**: 2025-01-03  
> **版本**: v1.0

---

## 📂 项目结构

```
frontend/
├── README.md                          # 本文件
├── package.json                       # 项目依赖
├── tsconfig.json                      # TypeScript配置
├── vite.config.ts                     # Vite配置
├── index.html                         # 入口HTML
│
├── public/                            # 静态资源
│   └── logo.png
│
├── src/                               # 源代码
│   ├── main.ts                        # 入口文件
│   ├── App.vue                        # 根组件
│   ├── router/                        # 路由配置
│   │   └── index.ts
│   ├── stores/                        # Pinia状态管理
│   │   ├── user.ts
│   │   ├── project.ts
│   │   └── requirement.ts
│   ├── views/                         # 页面组件
│   │   ├── Home/                      # 首页
│   │   ├── Dashboard/                 # 工作台
│   │   ├── ValueStream/               # 价值流
│   │   ├── PIPlanning/                # PI Planning
│   │   ├── Project/                   # 项目管理
│   │   ├── Asset/                     # 资产管理
│   │   ├── Requirement/               # 需求管理
│   │   ├── Sprint/                    # 迭代协同
│   │   ├── DevOps/                    # DevOps
│   │   └── Settings/                  # 系统设置
│   ├── components/                    # 通用组件
│   │   ├── Layout/                    # 布局组件
│   │   ├── Navigation/                # 导航组件
│   │   ├── ValueStream/               # 价值流组件
│   │   ├── Kanban/                    # 看板组件
│   │   └── Charts/                    # 图表组件
│   ├── composables/                   # 组合式函数
│   │   ├── useData.ts                 # 数据加载
│   │   └── useNavigation.ts           # 导航逻辑
│   ├── types/                         # TypeScript类型定义
│   │   ├── project.ts
│   │   ├── requirement.ts
│   │   └── asset.ts
│   ├── utils/                         # 工具函数
│   │   ├── date.ts
│   │   └── formatter.ts
│   └── styles/                        # 样式文件
│       ├── variables.scss             # 变量
│       └── global.scss                # 全局样式
│
└── data/                              # JSON数据文件
    ├── README.md                      # 数据说明
    ├── products/                      # 产品数据
    │   ├── product-lines.json
    │   ├── domain-products.json
    │   └── domain-features.json
    ├── requirements/                  # 需求数据
    │   ├── user-requirements.json
    │   ├── feature-requirements.json
    │   └── module-requirements.json
    ├── projects/                      # 项目数据
    │   ├── projects.json
    │   ├── pi-plannings.json
    │   └── milestones.json
    ├── sprints/                       # 迭代数据
    │   ├── sprints.json
    │   ├── stories.json
    │   └── tasks.json
    ├── devops/                        # DevOps数据
    │   ├── builds.json
    │   ├── tests.json
    │   └── releases.json
    └── users/                         # 用户数据
        ├── users.json
        └── teams.json
```

---

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

---

## 🎨 设计系统

### 主题色

```scss
$primary: #1890ff;      // 品牌蓝
$success: #52c41a;      // 成功绿
$warning: #faad14;      // 警告橙
$danger: #f5222d;       // 危险红
$info: #13c2c2;         // 信息青
```

### 状态色

```scss
$status-planning: #722ed1;     // 规划中-紫
$status-inprogress: #1890ff;   // 进行中-蓝
$status-testing: #faad14;      // 测试中-橙
$status-completed: #52c41a;    // 已完成-绿
$status-blocked: #f5222d;      // 已阻塞-红
```

---

## 📱 核心页面列表（67个）

### 1. 通用页面（5个）

| 页面 | 路由 | 组件 |
|------|------|------|
| 登录页 | `/login` | `views/Login/index.vue` |
| 首页 | `/` | `views/Home/index.vue` |
| 工作台 | `/dashboard` | `views/Dashboard/index.vue` |
| 个人中心 | `/profile` | `views/Profile/index.vue` |
| 系统设置 | `/settings` | `views/Settings/index.vue` |

---

### 2. 价值流页面（9个）

| 页面 | 路由 | 组件 |
|------|------|------|
| L1主价值流 | `/value-stream/main` | `views/ValueStream/MainFlow.vue` |
| L2产品规划 | `/value-stream/product-planning` | `views/ValueStream/ProductPlanning.vue` |
| L2需求分析 | `/value-stream/requirement-analysis` | `views/ValueStream/RequirementAnalysis.vue` |
| L2项目规划 | `/value-stream/project-planning` | `views/ValueStream/ProjectPlanning.vue` |
| L2迭代研发 | `/value-stream/iteration-rd` | `views/ValueStream/IterationRD.vue` |
| L2集成晋级 | `/value-stream/integration` | `views/ValueStream/Integration.vue` |
| L2测试验证 | `/value-stream/testing` | `views/ValueStream/Testing.vue` |
| L2需求验收 | `/value-stream/acceptance` | `views/ValueStream/Acceptance.vue` |
| L2发布交付 | `/value-stream/release` | `views/ValueStream/Release.vue` |

---

### 3. 项目管理（10个）

| 页面 | 路由 | 组件 |
|------|------|------|
| PI Planning列表 | `/pi-planning` | `views/PIPlanning/List.vue` |
| PI Planning工作区 | `/pi-planning/:id` | `views/PIPlanning/Workspace.vue` |
| PI看板 | `/pi-planning/:id/board` | `views/PIPlanning/Board.vue` |
| 项目列表 | `/projects` | `views/Project/List.vue` |
| 项目详情 | `/projects/:id` | `views/Project/Detail.vue` |
| 项目看板 | `/projects/:id/board` | `views/Project/Board.vue` |
| 项目里程碑 | `/projects/:id/milestones` | `views/Project/Milestones.vue` |
| 项目团队 | `/projects/:id/team` | `views/Project/Team.vue` |
| 项目集成规划 | `/projects/:id/integration` | `views/Project/Integration.vue` |
| 项目报告 | `/projects/:id/report` | `views/Project/Report.vue` |

---

### 4. 资产管理（12个）

| 页面 | 路由 | 组件 |
|------|------|------|
| 产品线列表 | `/assets/product-lines` | `views/Asset/ProductLines.vue` |
| 产品线详情 | `/assets/product-lines/:id` | `views/Asset/ProductLineDetail.vue` |
| 领域产品列表 | `/assets/products` | `views/Asset/Products.vue` |
| 产品详情 | `/assets/products/:id` | `views/Asset/ProductDetail.vue` |
| 产品版本管理 | `/assets/products/:id/versions` | `views/Asset/ProductVersions.vue` |
| 领域特性列表 | `/assets/features` | `views/Asset/Features.vue` |
| 特性详情 | `/assets/features/:id` | `views/Asset/FeatureDetail.vue` |
| 软件模块列表 | `/assets/modules` | `views/Asset/Modules.vue` |
| 模块详情 | `/assets/modules/:id` | `views/Asset/ModuleDetail.vue` |
| 资产库 | `/assets/library` | `views/Asset/Library.vue` |
| 资产复用分析 | `/assets/reuse-analysis` | `views/Asset/ReuseAnalysis.vue` |
| 逻辑架构设计 | `/assets/architecture/:id` | `views/Asset/Architecture.vue` |

---

### 5. 需求管理（12个）

| 页面 | 路由 | 组件 |
|------|------|------|
| 用户需求列表 | `/requirements/user` | `views/Requirement/UserRequirements.vue` |
| 用户需求详情 | `/requirements/user/:id` | `views/Requirement/UserRequirementDetail.vue` |
| 特性需求列表 | `/requirements/feature` | `views/Requirement/FeatureRequirements.vue` |
| 特性需求详情 | `/requirements/feature/:id` | `views/Requirement/FeatureRequirementDetail.vue` |
| PRD编写 | `/requirements/feature/:id/prd` | `views/Requirement/PRDEditor.vue` |
| 模块需求列表 | `/requirements/module` | `views/Requirement/ModuleRequirements.vue` |
| 模块需求详情 | `/requirements/module/:id` | `views/Requirement/ModuleRequirementDetail.vue` |
| 需求追溯视图 | `/requirements/traceability` | `views/Requirement/Traceability.vue` |
| 需求评审 | `/requirements/review/:id` | `views/Requirement/Review.vue` |
| 需求变更管理 | `/requirements/changes` | `views/Requirement/Changes.vue` |
| 需求影响分析 | `/requirements/impact/:id` | `views/Requirement/ImpactAnalysis.vue` |
| 需求看板 | `/requirements/board` | `views/Requirement/Board.vue` |

---

### 6. 迭代协同（8个）

| 页面 | 路由 | 组件 |
|------|------|------|
| Sprint列表 | `/sprints` | `views/Sprint/List.vue` |
| Sprint详情 | `/sprints/:id` | `views/Sprint/Detail.vue` |
| Sprint看板 | `/sprints/:id/board` | `views/Sprint/Board.vue` |
| Sprint Backlog | `/sprints/:id/backlog` | `views/Sprint/Backlog.vue` |
| 任务管理 | `/tasks` | `views/Sprint/Tasks.vue` |
| 燃尽图 | `/sprints/:id/burndown` | `views/Sprint/Burndown.vue` |
| 评审管理 | `/reviews` | `views/Sprint/Reviews.vue` |
| 知识库 | `/knowledge` | `views/Sprint/Knowledge.vue` |

---

### 7. DevOps（7个）

| 页面 | 路由 | 组件 |
|------|------|------|
| 代码仓库 | `/devops/repos` | `views/DevOps/Repositories.vue` |
| 构建列表 | `/devops/builds` | `views/DevOps/Builds.vue` |
| 构建详情 | `/devops/builds/:id` | `views/DevOps/BuildDetail.vue` |
| 测试用例 | `/devops/test-cases` | `views/DevOps/TestCases.vue` |
| 缺陷管理 | `/devops/defects` | `views/DevOps/Defects.vue` |
| 发布管理 | `/devops/releases` | `views/DevOps/Releases.vue` |
| 环境管理 | `/devops/environments` | `views/DevOps/Environments.vue` |

---

### 8. 数据分析（4个）

| 页面 | 路由 | 组件 |
|------|------|------|
| 效能分析 | `/analytics/efficiency` | `views/Analytics/Efficiency.vue` |
| 质量分析 | `/analytics/quality` | `views/Analytics/Quality.vue` |
| 复用分析 | `/analytics/reuse` | `views/Analytics/Reuse.vue` |
| 趋势预测 | `/analytics/trends` | `views/Analytics/Trends.vue` |

---

## 🗂️ JSON数据文件说明

### 数据文件组织原则

1. **按业务域分类**: products/, requirements/, projects/, sprints/, devops/, users/
2. **业务关系通过ID关联**: 使用外键ID建立关系
3. **数据格式统一**: 所有时间使用ISO 8601格式
4. **完整的NOA v3.1数据**: 基于真实业务场景

---

### 主要数据文件

| 文件 | 说明 | 实体数量 |
|------|------|---------|
| `products/product-lines.json` | 产品线数据 | 2个 |
| `products/domain-products.json` | 领域产品数据 | 6个 |
| `products/domain-features.json` | 领域特性数据 | 18个 |
| `requirements/user-requirements.json` | 用户需求数据 | 12个 |
| `requirements/feature-requirements.json` | 特性需求数据 | 25个 |
| `projects/projects.json` | 项目数据 | 3个 |
| `projects/pi-plannings.json` | PI Planning数据 | 2个 |
| `sprints/sprints.json` | 迭代数据 | 10个 |
| `sprints/stories.json` | 用户故事数据 | 45个 |
| `devops/builds.json` | 构建数据 | 30个 |

---

## 🔧 核心功能实现

### 1. 2级可视化价值流

**L1主流程页面** (`views/ValueStream/MainFlow.vue`):
- SVG/Canvas绘制9阶段流程图
- 实时状态展示（进行中/已完成）
- 点击节点跳转L2详细流程
- 角色过滤视图

**L2详细流程页面** (9个独立页面):
- 每个阶段的详细步骤可视化
- 具体数据展示和操作
- 跳转到L3功能页面

---

### 2. 角色工作台

**产品经理工作台**:
- 待办需求列表
- 需求评审待办
- 产品版本进度
- 快捷入口

**项目经理工作台**:
- PI Planning概览
- 项目进度看板
- 风险和问题
- 团队容量

**开发工程师工作台**:
- 我的Story/Task
- Sprint看板
- 代码提交记录
- 构建状态

---

### 3. 数据关系处理

**在Composables中实现**:

```typescript
// composables/useData.ts
export function useRequirementTrace(requirementId: string) {
  // 加载需求追溯数据
  // 通过ID关联构建追溯树
}

export function useProjectData(projectId: string) {
  // 加载项目相关的所有数据
  // 产品、需求、迭代、团队等
}
```

---

## 🎯 技术亮点

### 1. TypeScript类型安全

- 完整的类型定义
- 接口复用
- 类型推断

### 2. 组件化设计

- 可复用的通用组件
- 业务组件封装
- 组合式API

### 3. 状态管理

- Pinia store分模块
- 持久化存储
- 响应式数据

### 4. 性能优化

- 路由懒加载
- 虚拟滚动
- 图片懒加载

---

## 📦 依赖包

```json
{
  "dependencies": {
    "vue": "^3.4.0",
    "vue-router": "^4.2.0",
    "pinia": "^2.1.0",
    "element-plus": "^2.5.0",
    "@element-plus/icons-vue": "^2.3.0",
    "axios": "^1.6.0",
    "dayjs": "^1.11.0",
    "echarts": "^5.4.0",
    "lodash-es": "^4.17.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.0.0",
    "typescript": "^5.3.0",
    "vite": "^5.0.0",
    "sass": "^1.69.0"
  }
}
```

---

## 🔗 相关文档

- [业务架构设计](../Architecture/01-BUSINESS_ARCHITECTURE.md)
- [原型设计](../prototype-design/07-INTEGRATED_PROTOTYPE_DESIGN.md)
- [业务数据](../biz-data/02-NOA_V31_BUSINESS_DATA.md)
- [API文档](../backend/API.md)

---

**创建日期**: 2025-01-03  
**状态**: ✅ 完成  
**开发团队**: 前端团队

