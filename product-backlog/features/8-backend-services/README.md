# 后端服务 - Backend Services

> **功能域**: Backend Services  
> **优先级**: Phase 2（前端演示完成后实施）  
> **Story Points**: 280 SP（预估）  
> **说明**: 本功能域包含所有后端API和服务实现，暂不实施，前端使用Mock数据

---

## 📋 功能列表

### F034 - 基础服务层

**Story Points**: 34 SP

**功能说明**:
- 用户认证服务（JWT）
- 权限管理服务（RBAC）
- 会话管理（Redis）
- API网关

**技术栈**:
- Node.js + TypeScript
- Express/Koa
- JWT + Redis
- API Gateway

---

### F035 - 资产管理服务

**Story Points**: 34 SP

**功能说明**:
- 产品线CRUD API
- 领域产品CRUD API
- 领域特性CRUD API
- 软件模块CRUD API
- 资产关系管理API

**数据库**:
- PostgreSQL（主数据）

---

### F036 - 需求管理服务

**Story Points**: 47 SP

**功能说明**:
- 用户需求CRUD API
- 特性需求CRUD API
- 模块需求CRUD API
- 需求变更流程API
- **需求追溯服务**（Neo4j）⭐

**数据库**:
- PostgreSQL（需求数据）
- Neo4j（追溯关系）⭐
- Redis（缓存）

---

### F037 - 项目管理服务

**Story Points**: 55 SP

**功能说明**:
- 项目立项API
- PI Planning管理API
- 团队规划API
- 依赖管理API
- 风险管理API
- 容量规划API

**数据库**:
- PostgreSQL

---

### F038 - 研发协同服务

**Story Points**: 34 SP

**功能说明**:
- Sprint管理API
- Story管理API
- Task管理API
- 看板数据API
- 评审流程API

**数据库**:
- PostgreSQL

---

### F039 - DevOps服务

**Story Points**: 34 SP

**功能说明**:
- 代码仓库集成API
- 构建管理API
- 测试管理API
- 发布管理API
- 监控数据API

**集成**:
- GitLab/GitHub API
- Jenkins/GitLab CI
- SonarQube
- Prometheus

---

### F040 - 数据分析服务

**Story Points**: 34 SP

**功能说明**:
- 价值流分析API
- 效能分析API
- 质量分析API
- 趋势预测API
- 报表导出API

**数据库**:
- PostgreSQL（原始数据）
- InfluxDB（时序数据）
- Redis（缓存）

---

### F041 - 文件存储服务

**Story Points**: 8 SP

**功能说明**:
- 文件上传API
- 文件下载API
- 文件预览API
- 附件管理API

**存储**:
- MinIO / S3
- 本地存储

---

## 📊 技术架构

### 后端技术栈

```
┌─────────────────────────────────────────┐
│ API Gateway（Nginx/Kong）                │
├─────────────────────────────────────────┤
│ 业务服务层（Node.js + TypeScript）       │
│ ├─ 基础服务（F034）                      │
│ ├─ 资产管理服务（F035）                  │
│ ├─ 需求管理服务（F036）⭐                │
│ ├─ 项目管理服务（F037）                  │
│ ├─ 研发协同服务（F038）                  │
│ ├─ DevOps服务（F039）                    │
│ ├─ 数据分析服务（F040）                  │
│ └─ 文件存储服务（F041）                  │
├─────────────────────────────────────────┤
│ 数据层                                   │
│ ├─ PostgreSQL（主数据库）                │
│ ├─ Neo4j（图数据库）⭐                   │
│ ├─ Redis（缓存）                         │
│ ├─ InfluxDB（时序数据）                  │
│ └─ MinIO（对象存储）                     │
└─────────────────────────────────────────┘
```

---

## 🎯 实施策略

### Phase 1: 前端演示（当前）

**策略**: 前端使用Mock数据
- ✅ 所有Mock数据放在 `biz-data/mock/` 目录
- ✅ 前端通过Mock Service读取JSON数据
- ✅ 前端实现完整交互逻辑
- ✅ 可以完整演示所有功能

**优势**:
- 快速开发，无需等待后端
- 可以完整演示产品
- 前后端开发解耦

---

### Phase 2: 后端实施（6周）

**Week 1-2: 基础设施**
- F034: 基础服务层（34 SP）
- 数据库Schema设计
- API文档编写

**Week 3-4: 核心服务**
- F035: 资产管理服务（34 SP）
- F036: 需求管理服务（47 SP）⭐ 含Neo4j
- F037: 项目管理服务（55 SP）

**Week 5-6: 扩展服务**
- F038: 研发协同服务（34 SP）
- F039: DevOps服务（34 SP）
- F040: 数据分析服务（34 SP）
- F041: 文件存储服务（8 SP）

**总计**: 280 SP，约112人天，6周（2人团队）

---

## 📝 API设计规范

### RESTful API规范

```
GET    /api/{resource}           # 列表查询
GET    /api/{resource}/{id}      # 详情查询
POST   /api/{resource}           # 创建
PUT    /api/{resource}/{id}      # 更新
DELETE /api/{resource}/{id}      # 删除
```

### GraphQL API（可选）

```graphql
query {
  product(id: "PROD-NOA") {
    id
    name
    features {
      id
      name
    }
  }
}
```

---

## 🔗 与前端对接

### 对接方式

**Phase 1（当前）**:
```typescript
// 前端使用Mock Service
import { mockDataService } from '@/services/mockData';

const products = await mockDataService.getProducts();
```

**Phase 2（后端完成后）**:
```typescript
// 前端切换到真实API
import { apiService } from '@/services/api';

const products = await apiService.getProducts();
```

### 切换策略

1. 前端使用统一的Service Layer
2. 通过配置切换Mock/真实API
3. 接口定义保持一致
4. 最小化切换成本

---

## 📚 相关文档

- [F010后端API分析](../../../F010_BACKEND_API_ANALYSIS.md) - F036核心技术方案
- [实施计划](../../../IMPLEMENTATION_PLAN.md) - 后端实施详细计划
- [前端实施计划](../../../FRONTEND_IMPLEMENTATION_PLAN.md) - 当前前端计划

---

**创建日期**: 2025-01-05  
**优先级**: Phase 2  
**状态**: 📋 待实施（前端完成后）


