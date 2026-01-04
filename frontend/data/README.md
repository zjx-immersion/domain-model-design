# 前端数据文件说明

> **数据来源**: 基于NOA v3.1业务数据  
> **数据格式**: JSON  
> **关系处理**: 通过ID字段关联

---

## 📂 数据目录结构

```
data/
├── products/              # 产品资产数据
│   ├── product-lines.json         # 产品线
│   ├── domain-products.json       # 领域产品
│   ├── domain-features.json       # 领域特性
│   └── software-modules.json      # 软件模块
├── requirements/          # 需求数据
│   ├── user-requirements.json     # 用户需求
│   ├── feature-requirements.json  # 特性需求
│   └── module-requirements.json   # 模块需求
├── projects/              # 项目数据
│   ├── projects.json              # 项目
│   ├── pi-plannings.json          # PI Planning
│   ├── milestones.json            # 里程碑
│   └── teams.json                 # 团队
├── sprints/               # 迭代数据
│   ├── sprints.json               # Sprint
│   ├── stories.json               # User Story
│   └── tasks.json                 # Task
├── devops/                # DevOps数据
│   ├── repositories.json          # 代码仓库
│   ├── builds.json                # 构建记录
│   ├── tests.json                 # 测试记录
│   └── releases.json              # 发布记录
└── users/                 # 用户数据
    ├── users.json                 # 用户
    └── teams.json                 # 团队
```

---

## 🔗 数据关系

### 核心关系链

```
ProductLine (产品线)
    ↓ productLineId
DomainProduct (领域产品)
    ↓ productId
DomainFeature (领域特性)
    ↓ featureId
SoftwareModule (软件模块)

UserRequirement (用户需求)
    ↓ userRequirementId
FeatureRequirement (特性需求)
    ↓ featureRequirementId
ModuleRequirement (模块需求)
    ↓ moduleRequirementId
Story (用户故事)
    ↓ storyId
Task (任务)

Project (项目)
    ↓ projectId
PIPlanning (PI规划)
    ↓ piId
Sprint (迭代)
    ↓ sprintId
Story/Task
```

---

## 📊 数据统计

| 数据类型 | 文件 | 数量 |
|---------|------|------|
| 产品线 | product-lines.json | 2 |
| 领域产品 | domain-products.json | 6 |
| 领域特性 | domain-features.json | 18 |
| 软件模块 | software-modules.json | 24 |
| 用户需求 | user-requirements.json | 12 |
| 特性需求 | feature-requirements.json | 25 |
| 模块需求 | module-requirements.json | 36 |
| 项目 | projects.json | 3 |
| PI Planning | pi-plannings.json | 2 |
| Sprint | sprints.json | 10 |
| Story | stories.json | 45 |
| Task | tasks.json | 120 |
| 构建 | builds.json | 30 |
| 测试 | tests.json | 50 |
| 发布 | releases.json | 8 |
| 用户 | users.json | 25 |

**总计**: 约420条业务数据

---

## 🎯 使用方式

### 在组件中加载数据

```typescript
import { ref, onMounted } from 'vue'
import productsData from '@/data/products/domain-products.json'

const products = ref([])

onMounted(async () => {
  // 直接使用导入的数据
  products.value = productsData
  
  // 或通过API加载（模拟）
  const response = await fetch('/data/products/domain-products.json')
  products.value = await response.json()
})
```

### 构建数据关系

```typescript
import { computed } from 'vue'
import featuresData from '@/data/products/domain-features.json'
import requirementsData from '@/data/requirements/feature-requirements.json'

// 通过featureId关联
const featureWithRequirements = computed(() => {
  return featuresData.map(feature => ({
    ...feature,
    requirements: requirementsData.filter(
      req => req.featureId === feature.id
    )
  }))
})
```

---

## 📝 数据字段说明

### 通用字段

| 字段 | 类型 | 说明 |
|------|------|------|
| id | string | 唯一标识 |
| code | string | 业务编码 |
| name | string | 名称 |
| status | string | 状态 |
| createdAt | string | 创建时间(ISO 8601) |
| updatedAt | string | 更新时间(ISO 8601) |
| createdBy | string | 创建人ID |

### 状态枚举

**需求状态**:
- `draft`: 草稿
- `in_review`: 评审中
- `approved`: 已批准
- `in_development`: 开发中
- `completed`: 已完成

**Sprint状态**:
- `planning`: 规划中
- `active`: 进行中
- `completed`: 已完成

**Task状态**:
- `todo`: 待办
- `in_progress`: 进行中
- `in_review`: 评审中
- `done`: 完成

---

**创建日期**: 2025-01-03  
**数据版本**: v1.0  
**基于**: NOA v3.1项目

