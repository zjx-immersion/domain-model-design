# Mock数据管理

> **目录说明**: 本目录包含前端演示所需的所有Mock数据  
> **创建日期**: 2025-01-05  
> **用途**: 前端页面开发、演示、测试

---

## 📂 目录结构

```
mock/
├── README.md                       # 本文件
├── asset/                          # 资产管理Mock数据
│   ├── product-lines.json
│   ├── products.json
│   ├── features.json
│   ├── modules.json
│   └── relationships.json
├── requirement/                    # 需求管理Mock数据
│   ├── user-requirements.json
│   ├── feature-requirements.json
│   ├── module-requirements.json
│   ├── changes.json
│   └── traceability.json
├── project/                        # 项目管理Mock数据
│   ├── projects.json
│   ├── pi-plannings.json
│   ├── teams.json
│   ├── dependencies.json
│   └── risks.json
├── sprint/                         # Sprint Mock数据
│   ├── sprints.json
│   ├── stories.json
│   ├── tasks.json
│   ├── commits.json
│   └── pull-requests.json
├── devops/                         # DevOps Mock数据
│   ├── builds.json
│   ├── pipelines.json
│   ├── environments.json
│   └── releases.json
├── test/                           # 测试Mock数据
│   ├── test-cases.json
│   ├── test-plans.json
│   ├── defects.json
│   └── test-reports.json
├── analytics/                      # 分析Mock数据
│   ├── value-stream-metrics.json
│   ├── efficiency-metrics.json
│   ├── quality-metrics.json
│   └── cost-metrics.json
└── system/                         # 系统Mock数据
    ├── users.json
    ├── roles.json
    ├── permissions.json
    ├── settings.json
    ├── audit-logs.json
    └── notifications.json
```

---

## 🎯 数据设计原则

### 1. 真实性

- 基于NOA v3.1真实业务场景
- 数据结构完全符合领域模型
- 数据关系符合业务逻辑

### 2. 完整性

- 覆盖所有实体类型
- 包含所有关系类型
- 支持完整业务流程演示

### 3. 一致性

- 所有数据ID统一格式
- 时间戳统一格式（ISO 8601）
- 状态值统一枚举

### 4. 可维护性

- 每个文件职责单一
- 数据结构清晰
- 便于扩展和修改

---

## 📋 数据文件规范

### JSON文件格式

```json
{
  "metadata": {
    "version": "1.0",
    "lastUpdate": "2025-01-05T10:00:00Z",
    "description": "产品线Mock数据"
  },
  "data": [
    {
      "id": "PL-001",
      "name": "智能驾驶",
      ...
    }
  ]
}
```

### 通用字段规范

| 字段 | 类型 | 格式 | 说明 |
|------|------|------|------|
| `id` | string | `{PREFIX}-{NUMBER}` | 唯一标识 |
| `name` | string | - | 名称 |
| `description` | string | - | 描述 |
| `status` | string | enum | 状态（统一枚举） |
| `createdAt` | string | ISO 8601 | 创建时间 |
| `updatedAt` | string | ISO 8601 | 更新时间 |
| `createdBy` | string | User ID | 创建人 |
| `updatedBy` | string | User ID | 更新人 |

### ID前缀规范

| 前缀 | 实体类型 | 示例 |
|------|---------|------|
| `PL-` | 产品线 | PL-001 |
| `PROD-` | 领域产品 | PROD-NOA |
| `FEAT-` | 领域特性 | FEAT-001 |
| `MOD-` | 软件模块 | MOD-001 |
| `UR-` | 用户需求 | UR-001 |
| `FR-` | 特性需求 | FR-001 |
| `MR-` | 模块需求 | MR-001 |
| `PI-` | PI Planning | PI-2025-Q1 |
| `TEAM-` | 团队 | TEAM-001 |
| `SPRINT-` | Sprint | SPRINT-001 |
| `US-` | User Story | US-101 |
| `TASK-` | Task | TASK-101-1 |
| `BUG-` | 缺陷 | BUG-001 |
| `TC-` | 测试用例 | TC-001 |
| `REL-` | 发布 | REL-001 |

---

## 📊 核心数据文件说明

### 1. 资产管理数据

#### product-lines.json
**说明**: 产品线列表  
**数量**: 3-5条  
**关键字段**: id, name, description, roadmap, products

#### products.json
**说明**: 领域产品列表  
**数量**: 10-15条  
**关键字段**: id, name, productLineId, versions, features

#### features.json
**说明**: 领域特性列表  
**数量**: 20-30条  
**关键字段**: id, name, productId, modules, requirements

#### modules.json
**说明**: 软件模块列表  
**数量**: 50-80条  
**关键字段**: id, name, featureId, requirements, code

---

### 2. 需求管理数据

#### user-requirements.json
**说明**: 用户需求列表  
**数量**: 20-30条  
**关键字段**: id, title, description, status, featureRequirements

#### feature-requirements.json
**说明**: 特性需求列表  
**数量**: 40-60条  
**关键字段**: id, title, userRequirementId, moduleRequirements

#### module-requirements.json
**说明**: 模块需求列表  
**数量**: 80-120条  
**关键字段**: id, title, featureRequirementId, stories

#### traceability.json
**说明**: 追溯关系数据  
**数量**: 200-300条关系  
**关键字段**: sourceId, targetId, relationType, properties

---

### 3. 项目管理数据

#### pi-plannings.json
**说明**: PI Planning列表  
**数量**: 5-8条  
**关键字段**: id, name, startDate, endDate, teams, objectives

#### teams.json
**说明**: 团队列表  
**数量**: 10-15条  
**关键字段**: id, name, members, capacity, piId

#### dependencies.json
**说明**: 依赖关系  
**数量**: 30-50条  
**关键字段**: id, sourceTeamId, targetTeamId, description, status

---

### 4. Sprint数据

#### sprints.json
**说明**: Sprint列表  
**数量**: 20-30条  
**关键字段**: id, name, startDate, endDate, stories, velocity

#### stories.json
**说明**: User Story列表  
**数量**: 100-150条  
**关键字段**: id, title, description, storyPoints, tasks, status

#### tasks.json
**说明**: Task列表  
**数量**: 300-500条  
**关键字段**: id, title, storyId, assignee, status, hours

---

## 🔧 前端使用方式

### 1. Mock Service

```typescript
// frontend/src/services/mockData.ts
export class MockDataService {
  private baseUrl = '/mock';

  async getProductLines() {
    const response = await fetch(`${this.baseUrl}/asset/product-lines.json`);
    const result = await response.json();
    return result.data;
  }

  async getProductLineById(id: string) {
    const productLines = await this.getProductLines();
    return productLines.find(pl => pl.id === id);
  }

  // 支持本地修改
  async updateProductLine(id: string, updates: Partial<ProductLine>) {
    const productLines = await this.getProductLines();
    const index = productLines.findIndex(pl => pl.id === id);
    if (index !== -1) {
      productLines[index] = { ...productLines[index], ...updates };
      // 保存到localStorage
      localStorage.setItem('productLines', JSON.stringify(productLines));
    }
  }
}
```

### 2. 状态管理

```typescript
// frontend/src/stores/productLine.ts
import { defineStore } from 'pinia';
import { mockDataService } from '@/services/mockData';

export const useProductLineStore = defineStore('productLine', {
  state: () => ({
    productLines: [] as ProductLine[],
    loading: false,
  }),
  
  actions: {
    async fetchProductLines() {
      this.loading = true;
      try {
        this.productLines = await mockDataService.getProductLines();
      } finally {
        this.loading = false;
      }
    },
  },
});
```

---

## 📝 数据维护指南

### 添加新数据

```bash
# 1. 选择合适的文件
cd biz-data/mock/asset

# 2. 编辑JSON文件
vim products.json

# 3. 添加新条目
{
  "id": "PROD-NEW",
  "name": "新产品",
  "productLineId": "PL-001",
  "createdAt": "2025-01-05T10:00:00Z",
  ...
}

# 4. 验证JSON格式
cat products.json | jq .

# 5. 提交更改
git add products.json
git commit -m "feat: 添加新产品Mock数据"
```

### 修改现有数据

```bash
# 1. 编辑JSON文件
vim biz-data/mock/asset/products.json

# 2. 修改相关字段
# 3. 更新 updatedAt 时间戳
# 4. 提交更改
```

### 删除数据

```bash
# 1. 从数组中移除条目
# 2. 检查是否有其他数据引用
# 3. 清理关联数据
# 4. 提交更改
```

---

## 🔄 数据同步策略

### 本地存储

```typescript
// 前端可以将修改保存到localStorage
class MockDataService {
  async updateData(key: string, data: any) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  async getData(key: string) {
    const cached = localStorage.getItem(key);
    if (cached) {
      return JSON.parse(cached);
    }
    // 否则从JSON文件加载
    return this.loadFromFile(key);
  }
}
```

### 重置数据

```typescript
// 重置到初始状态
class MockDataService {
  resetData() {
    localStorage.clear();
    // 重新加载JSON文件
    window.location.reload();
  }
}
```

---

## 📊 数据生成工具

### 批量生成脚本

```bash
# 生成Mock数据脚本
npm run generate:mock

# 或使用Python脚本
python scripts/generate_mock_data.py
```

### 数据验证脚本

```bash
# 验证所有Mock数据
npm run validate:mock

# 或
python scripts/validate_mock_data.py
```

---

## 🎯 后续规划

### Phase 1（当前）
- ✅ 定义数据结构规范
- ✅ 创建目录结构
- 📋 创建50+个Mock数据文件
- 📋 实现Mock Service

### Phase 2（1-2周）
- 📋 补充所有页面所需数据
- 📋 完善数据关系
- 📋 添加更多测试数据

### Phase 3（后续）
- 📋 数据生成工具
- 📋 数据验证工具
- 📋 数据导入导出工具

---

## 📚 相关文档

- [前端实施计划](../../FRONTEND_IMPLEMENTATION_PLAN.md)
- [NOA v3.1业务数据](../02-NOA_V31_BUSINESS_DATA.md)
- [领域模型设计](../../Architecture/00-DOMAIN_MODEL_DESIGN.md)

---

**创建日期**: 2025-01-05  
**维护人**: 前端开发团队  
**状态**: 📋 待创建数据文件


